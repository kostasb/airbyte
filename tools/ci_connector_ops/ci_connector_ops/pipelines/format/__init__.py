#
# Copyright (c) 2023 Airbyte, Inc., all rights reserved.
#
"""This module groups factory like functions to dispatch formatting steps according to the connector language."""

from __future__ import annotations

from typing import List

import anyio
from ci_connector_ops.pipelines.bases import ConnectorReport, Step, StepResult, StepStatus
from ci_connector_ops.pipelines.contexts import ConnectorContext
from ci_connector_ops.pipelines.format import java_connectors, python_connectors
from ci_connector_ops.pipelines.git import GitPushChanges
from ci_connector_ops.utils import ConnectorLanguage
from dagger import Directory


class NoFormatStepForLanguageError(Exception):
    pass


FORMATTING_STEP_TO_CONNECTOR_LANGUAGE_MAPPING = {
    ConnectorLanguage.PYTHON: python_connectors.FormatConnectorCode,
    ConnectorLanguage.LOW_CODE: python_connectors.FormatConnectorCode,
    ConnectorLanguage.JAVA: java_connectors.FormatConnectorCode,
}


class ExportChanges(Step):

    title = "Export changes to local repository"

    async def _run(self, changed_directory: Directory, changed_directory_path_in_repo: str) -> StepResult:
        await changed_directory.export(changed_directory_path_in_repo)
        return StepResult(self, StepStatus.SUCCESS, stdout=f"Changes exported to {changed_directory_path_in_repo}")


async def run_connector_format(context: ConnectorContext) -> List[StepResult]:
    steps_results = []
    FormatConnectorCode = FORMATTING_STEP_TO_CONNECTOR_LANGUAGE_MAPPING.get(context.connector.language)
    if not FormatConnectorCode:
        raise NoFormatStepForLanguageError(
            f"No formatting step found for connector {context.connector.technical_name} with language {context.connector.language}"
        )
    format_connector_code_result = await FormatConnectorCode(context).run()
    steps_results.append(format_connector_code_result)

    if context.is_local:
        export_changes_results = await ExportChanges(context).run(
            format_connector_code_result.output_artifact, str(context.connector.code_directory)
        )
        steps_results.append(export_changes_results)
    else:
        git_push_changes_results = await GitPushChanges(context).run(
            format_connector_code_result.output_artifact,
            str(context.connector.code_directory),
            f"Auto format {context.connector.technical_name} code",
        )
        steps_results.append(git_push_changes_results)
    return steps_results


async def run_connector_format_pipeline(context: ConnectorContext, semaphore: anyio.Semaphore) -> ConnectorReport:
    """Run a format pipeline for a single connector.

    Args:
        context (ConnectorContext): The initialized connector context.

    Returns:
        ConnectorReport: The reports holding formats results.
    """
    step_results = []
    async with semaphore:
        async with context:
            step_results += await run_connector_format(context)
            context.report = ConnectorReport(context, step_results, name="FORMAT RESULTS")
        return context.report
