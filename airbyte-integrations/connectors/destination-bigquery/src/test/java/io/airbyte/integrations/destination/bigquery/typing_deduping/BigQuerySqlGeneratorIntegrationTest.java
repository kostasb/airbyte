package io.airbyte.integrations.destination.bigquery.typing_deduping;

import static io.airbyte.integrations.destination.bigquery.BigQueryDestination.getServiceAccountCredentials;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.bigquery.BigQuery;
import com.google.cloud.bigquery.BigQueryException;
import com.google.cloud.bigquery.BigQueryOptions;
import com.google.cloud.bigquery.DatasetInfo;
import com.google.cloud.bigquery.QueryJobConfiguration;
import com.google.cloud.bigquery.StandardSQLTypeName;
import com.google.cloud.bigquery.Table;
import io.airbyte.commons.json.Jsons;
import io.airbyte.integrations.destination.bigquery.BigQueryUtils;
import io.airbyte.integrations.destination.bigquery.typing_deduping.AirbyteType.AirbyteProtocolType;
import io.airbyte.integrations.destination.bigquery.typing_deduping.AirbyteType.Struct;
import io.airbyte.integrations.destination.bigquery.typing_deduping.CatalogParser.ParsedType;
import io.airbyte.integrations.destination.bigquery.typing_deduping.CatalogParser.StreamConfig;
import io.airbyte.integrations.destination.bigquery.typing_deduping.SqlGenerator.QuotedColumnId;
import io.airbyte.integrations.destination.bigquery.typing_deduping.SqlGenerator.QuotedStreamId;
import io.airbyte.protocol.models.v0.DestinationSyncMode;
import io.airbyte.protocol.models.v0.SyncMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.apache.commons.text.StringSubstitutor;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// TODO this proooobably belongs in test-integration?
public class BigQuerySqlGeneratorIntegrationTest {

  private static final Logger LOGGER = LoggerFactory.getLogger(BigQuerySqlGeneratorIntegrationTest.class);
  private final static BigQuerySqlGenerator GENERATOR = new BigQuerySqlGenerator();
  public static final List<QuotedColumnId> PRIMARY_KEY = List.of(GENERATOR.quoteColumnId("id"));

  private String testDataset;
  private QuotedStreamId streamId;

  private static BigQuery bq;
  private static LinkedHashMap<QuotedColumnId, ParsedType<StandardSQLTypeName>> columns;

  @BeforeAll
  public static void setup() throws Exception {
    String rawConfig = Files.readString(Path.of("secrets/credentials-gcs-staging.json"));
    JsonNode config = Jsons.deserialize(rawConfig);

    final BigQueryOptions.Builder bigQueryBuilder = BigQueryOptions.newBuilder();
    final GoogleCredentials credentials = getServiceAccountCredentials(config);
    bq = bigQueryBuilder
        .setProjectId(config.get("project_id").asText())
        .setCredentials(credentials)
        .setHeaderProvider(BigQueryUtils.getHeaderProvider())
        .build()
        .getService();

    columns = new LinkedHashMap<>();
    columns.put(GENERATOR.quoteColumnId("id"), new ParsedType<>(StandardSQLTypeName.INT64, AirbyteProtocolType.INTEGER));
    columns.put(GENERATOR.quoteColumnId("updated_at"), new ParsedType<>(StandardSQLTypeName.TIMESTAMP, AirbyteProtocolType.TIMESTAMP_WITH_TIMEZONE));
    columns.put(GENERATOR.quoteColumnId("name"), new ParsedType<>(StandardSQLTypeName.STRING, AirbyteProtocolType.STRING));

    LinkedHashMap<String, AirbyteType> addressProperties = new LinkedHashMap<>();
    addressProperties.put("city", AirbyteProtocolType.STRING);
    addressProperties.put("state", AirbyteProtocolType.STRING);
    columns.put(GENERATOR.quoteColumnId("address"), new ParsedType<>(StandardSQLTypeName.STRING, new Struct(addressProperties)));

    columns.put(GENERATOR.quoteColumnId("age"), new ParsedType<>(StandardSQLTypeName.INT64, AirbyteProtocolType.INTEGER));
  }

  @BeforeEach
  public void setupDataset() {
    testDataset = "bq_sql_generator_test_" + UUID.randomUUID().toString().replace("-", "_");
    // This is not a typical stream ID would look like, but we're just using this to isolate our tests to a specific dataset.
    // In practice, the final table would be testDataset.users, and the raw table would be airbyte.testDataset_users.
    streamId = new QuotedStreamId(testDataset, "users_final", testDataset, "users_raw");
    LOGGER.info("Running in dataset {}", testDataset);
    bq.create(DatasetInfo.newBuilder(testDataset).build());
  }

  @AfterEach
  public void teardownDataset() {
    bq.delete(testDataset, BigQuery.DatasetDeleteOption.deleteContents());
  }

  @Test
  public void testCreateTableIncremental() throws InterruptedException {
    final String sql = GENERATOR.createTable(incrementalDedupStreamConfig());
    bq.query(QueryJobConfiguration.newBuilder(sql).build());

    final Table table = bq.getTable(testDataset, "users_final");
    // TODO this should assert table schema + partitioning/clustering configs
    assertNotNull(table);
  }

  @Test
  public void testVerifyPrimaryKeysIncremental() throws InterruptedException {
    createRawTable();
    bq.query(QueryJobConfiguration.newBuilder(
        new StringSubstitutor(Map.of(
            "dataset", testDataset
        )).replace("""
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{}', '10d6e27d-ae7a-41b5-baf8-c4c277ef9c11', '2023-01-01T00:00:00Z');
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{"id": 1}', '5ce60e70-98aa-4fe3-8159-67207352c4f0', '2023-01-01T00:00:00Z');
            """)
    ).build());

    final String sql = GENERATOR.validatePrimaryKeys(streamId, List.of(new QuotedColumnId("id", "id", "id")), columns);
    final BigQueryException e = assertThrows(
        BigQueryException.class,
        () -> bq.query(QueryJobConfiguration.newBuilder(sql).build())
    );

    // TODO this is super fragile
    assertEquals(
        "Raw table has 1 rows missing a primary key at [12:3]",
        e.getError().getMessage()
    );
  }

  @Test
  public void testInsertNewRecordsIncremental() throws InterruptedException {
    createRawTable();
    createFinalTable();
    bq.query(QueryJobConfiguration.newBuilder(
        new StringSubstitutor(Map.of(
            "dataset", testDataset
        )).replace("""
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{"id": 1, "name": "Alice", "address": {"city": "San Francisco", "state": "CA"}, "updated_at": "2023-01-01T01:00:00Z"}', '972fa08a-aa06-4b91-a6af-a371aee4cb1c', '2023-01-01T00:00:00Z');
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{"id": 1, "name": "Alice", "address": {"city": "San Diego", "state": "CA"}, "updated_at": "2023-01-01T02:00:00Z"}', '233ad43d-de50-4a47-bbe6-7a417ce60d9d', '2023-01-01T00:00:00Z');
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{"id": 2, "name": "Bob", "age": "oops", "updated_at": "2023-01-01T03:00:00Z"}', 'd4aeb036-2d95-4880-acd2-dc69b42b03c6', '2023-01-01T00:00:00Z');
            """)
    ).build());

    final String sql = GENERATOR.insertNewRecords(streamId, columns);
    bq.query(QueryJobConfiguration.newBuilder(sql).build());

    // TODO more stringent asserts
    final long finalRows = bq.query(QueryJobConfiguration.newBuilder("SELECT * FROM " + streamId.finalTableId()).build()).getTotalRows();
    assertEquals(3, finalRows);
  }

  @Test
  public void testDedupFinalTable() throws InterruptedException {
    createRawTable();
    createFinalTable();
    bq.query(QueryJobConfiguration.newBuilder(
        new StringSubstitutor(Map.of(
            "dataset", testDataset
        )).replace("""
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{"id": 1, "name": "Alice", "address": {"city": "San Francisco", "state": "CA"}, "age": 42, "updated_at": "2023-01-01T01:00:00Z"}', 'd7b81af0-01da-4846-a650-cc398986bc99', '2023-01-01T00:00:00Z');
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{"id": 1, "name": "Alice", "address": {"city": "San Diego", "state": "CA"}, "age": 84, "updated_at": "2023-01-01T02:00:00Z"}', '80c99b54-54b4-43bd-b51b-1f67dafa2c52', '2023-01-01T00:00:00Z');
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{"id": 2, "name": "Bob", "age": "oops", "updated_at": "2023-01-01T03:00:00Z"}', 'ad690bfb-c2c2-4172-bd73-a16c86ccbb67', '2023-01-01T00:00:00Z');
            
            INSERT INTO ${dataset}.users_final (_airbyte_raw_id, _airbyte_extracted_at, _airbyte_meta, id, updated_at, name, address, age) values
              ('d7b81af0-01da-4846-a650-cc398986bc99', '2023-01-01T00:00:00Z', JSON'{"errors":[]}', 1, '2023-01-01T01:00:00Z', 'Alice', '{"city": "San Francisco", "state": "CA"}', 42),
              ('80c99b54-54b4-43bd-b51b-1f67dafa2c52', '2023-01-01T00:00:00Z', JSON'{"errors":[]}', 1, '2023-01-01T02:00:00Z', 'Alice', '{"city": "San Diego", "state": "CA"}', 84),
              ('ad690bfb-c2c2-4172-bd73-a16c86ccbb67', '2023-01-01T00:00:00Z', JSON'{"errors": ["blah blah age"]}', 2, '2023-01-01T03:00:00Z', 'Bob', NULL, NULL);
            """)
    ).build());

    final String sql = GENERATOR.dedupFinalTable(streamId, PRIMARY_KEY, columns);
    bq.query(QueryJobConfiguration.newBuilder(sql).build());

    // TODO more stringent asserts
    final long finalRows = bq.query(QueryJobConfiguration.newBuilder("SELECT * FROM " + streamId.finalTableId()).build()).getTotalRows();
    assertEquals(2, finalRows);
  }

  @Test
  public void testDedupRawTable() throws InterruptedException {
    createRawTable();
    createFinalTable();
    bq.query(QueryJobConfiguration.newBuilder(
        new StringSubstitutor(Map.of(
            "dataset", testDataset
        )).replace("""
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{"id": 1, "name": "Alice", "address": {"city": "San Francisco", "state": "CA"}, "age": 42, "updated_at": "2023-01-01T01:00:00Z"}', 'd7b81af0-01da-4846-a650-cc398986bc99', '2023-01-01T00:00:00Z');
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{"id": 1, "name": "Alice", "address": {"city": "San Diego", "state": "CA"}, "age": 84, "updated_at": "2023-01-01T02:00:00Z"}', '80c99b54-54b4-43bd-b51b-1f67dafa2c52', '2023-01-01T00:00:00Z');
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{"id": 2, "name": "Bob", "age": "oops", "updated_at": "2023-01-01T03:00:00Z"}', 'ad690bfb-c2c2-4172-bd73-a16c86ccbb67', '2023-01-01T00:00:00Z');
            
            INSERT INTO ${dataset}.users_final (_airbyte_raw_id, _airbyte_extracted_at, _airbyte_meta, id, updated_at, name, address, age) values
              ('80c99b54-54b4-43bd-b51b-1f67dafa2c52', '2023-01-01T00:00:00Z', JSON'{"errors":[]}', 1, '2023-01-01T02:00:00Z', 'Alice', '{"city": "San Diego", "state": "CA"}', 84),
              ('ad690bfb-c2c2-4172-bd73-a16c86ccbb67', '2023-01-01T00:00:00Z', JSON'{"errors": ["blah blah age"]}', 2, '2023-01-01T03:00:00Z', 'Bob', NULL, NULL);
            """)
    ).build());

    final String sql = GENERATOR.dedupRawTable(streamId);
    bq.query(QueryJobConfiguration.newBuilder(sql).build());

    // TODO more stringent asserts
    final long rawRows = bq.query(QueryJobConfiguration.newBuilder("SELECT * FROM " + streamId.rawTableId()).build()).getTotalRows();
    assertEquals(2, rawRows);
  }

  @Test
  public void testCommitRawTable() throws InterruptedException {
    createRawTable();
    bq.query(QueryJobConfiguration.newBuilder(
        new StringSubstitutor(Map.of(
            "dataset", testDataset
        )).replace("""
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{"id": 1, "name": "Alice", "address": {"city": "San Diego", "state": "CA"}, "age": 84, "updated_at": "2023-01-01T02:00:00Z"}', '80c99b54-54b4-43bd-b51b-1f67dafa2c52', '2023-01-01T00:00:00Z');
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{"id": 2, "name": "Bob", "age": "oops", "updated_at": "2023-01-01T03:00:00Z"}', 'ad690bfb-c2c2-4172-bd73-a16c86ccbb67', '2023-01-01T00:00:00Z');
            """)
    ).build());

    final String sql = GENERATOR.commitRawTable(streamId);
    bq.query(QueryJobConfiguration.newBuilder(sql).build());

    // TODO more stringent asserts
    final long rawUntypedRows = bq.query(QueryJobConfiguration.newBuilder("SELECT * FROM " + streamId.rawTableId() + " WHERE _airbyte_loaded_at IS NULL").build()).getTotalRows();
    assertEquals(0, rawUntypedRows);
  }

  @Test
  public void testFullUpdate() throws InterruptedException {
    createRawTable();
    createFinalTable();
    bq.query(QueryJobConfiguration.newBuilder(
        new StringSubstitutor(Map.of(
            "dataset", testDataset
        )).replace("""
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{"id": 1, "name": "Alice", "address": {"city": "San Francisco", "state": "CA"}, "age": 42, "updated_at": "2023-01-01T01:00:00Z"}', 'd7b81af0-01da-4846-a650-cc398986bc99', '2023-01-01T00:00:00Z');
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{"id": 1, "name": "Alice", "address": {"city": "San Diego", "state": "CA"}, "age": 84, "updated_at": "2023-01-01T02:00:00Z"}', '80c99b54-54b4-43bd-b51b-1f67dafa2c52', '2023-01-01T00:00:00Z');
            INSERT INTO ${dataset}.users_raw (`_airbyte_data`, `_airbyte_raw_id`, `_airbyte_extracted_at`) VALUES (JSON'{"id": 2, "name": "Bob", "age": "oops", "updated_at": "2023-01-01T03:00:00Z"}', 'ad690bfb-c2c2-4172-bd73-a16c86ccbb67', '2023-01-01T00:00:00Z');
            """)
    ).build());

    final String updateSql = GENERATOR.updateTable("", incrementalDedupStreamConfig());
    bq.query(QueryJobConfiguration.newBuilder(updateSql).build());

    // TODO
    final long finalRows = bq.query(QueryJobConfiguration.newBuilder("SELECT * FROM " + streamId.finalTableId()).build()).getTotalRows();
    assertEquals(2, finalRows);
    final long rawRows = bq.query(QueryJobConfiguration.newBuilder("SELECT * FROM " + streamId.rawTableId()).build()).getTotalRows();
    assertEquals(2, rawRows);
    final long rawUntypedRows = bq.query(QueryJobConfiguration.newBuilder("SELECT * FROM " + streamId.rawTableId() + " WHERE _airbyte_loaded_at IS NULL").build()).getTotalRows();
    assertEquals(0, rawUntypedRows);
  }

  private StreamConfig<StandardSQLTypeName> incrementalDedupStreamConfig() {
    return new StreamConfig<>(
        streamId,
        SyncMode.INCREMENTAL,
        DestinationSyncMode.APPEND_DEDUP,
        PRIMARY_KEY,
        Optional.of(GENERATOR.quoteColumnId("updated_at")),
        columns
    );
  }

  // These are known-good methods for doing stuff with bigquery.
  // Some of them are identical to what the sql generator does, and that's intentional.
  private void createRawTable() throws InterruptedException {
    bq.query(QueryJobConfiguration.newBuilder(
        new StringSubstitutor(Map.of(
            "dataset", testDataset
        )).replace("""
            CREATE TABLE ${dataset}.users_raw (
              _airbyte_raw_id STRING NOT NULL,
              _airbyte_data JSON NOT NULL,
              _airbyte_extracted_at TIMESTAMP NOT NULL,
              _airbyte_loaded_at TIMESTAMP
            ) PARTITION BY (
              DATE_TRUNC(_airbyte_extracted_at, DAY)
            ) CLUSTER BY _airbyte_loaded_at;
            """)
    ).build());
  }

  private void createFinalTable() throws InterruptedException {
    bq.query(QueryJobConfiguration.newBuilder(
        new StringSubstitutor(Map.of(
            "dataset", testDataset
        )).replace("""
            CREATE TABLE ${dataset}.users_final (
              _airbyte_raw_id STRING NOT NULL,
              _airbyte_extracted_at TIMESTAMP NOT NULL,
              _airbyte_meta JSON NOT NULL,
              id INT64,
              updated_at TIMESTAMP,
              name STRING,
              address STRING,
              age INT64
            )
            PARTITION BY (DATE_TRUNC(_airbyte_extracted_at, DAY))
            CLUSTER BY id, _airbyte_extracted_at;
            """)
    ).build());
  }
}
