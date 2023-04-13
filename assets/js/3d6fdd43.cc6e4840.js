"use strict";(self.webpackChunkdocu=self.webpackChunkdocu||[]).push([[5340],{34906:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var a=r(87462),n=(r(67294),r(3905));const i={},o="Twilio",l={unversionedId:"integrations/sources/twilio",id:"integrations/sources/twilio",title:"Twilio",description:"This page contains the setup guide and reference information for the Twilio source connector.",source:"@site/../docs/integrations/sources/twilio.md",sourceDirName:"integrations/sources",slug:"/integrations/sources/twilio",permalink:"/integrations/sources/twilio",draft:!1,editUrl:"https://github.com/airbytehq/airbyte/blob/master/docs/../docs/integrations/sources/twilio.md",tags:[],version:"current",frontMatter:{},sidebar:"mySidebar",previous:{title:"Twilio Taskrouter",permalink:"/integrations/sources/twilio-taskrouter"},next:{title:"Twitter",permalink:"/integrations/sources/twitter"}},s={},p=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Setup guide",id:"setup-guide",level:2},{value:"Supported sync modes",id:"supported-sync-modes",level:2},{value:"Supported Streams",id:"supported-streams",level:2},{value:"Performance considerations",id:"performance-considerations",level:2},{value:"Changelog",id:"changelog",level:2}],c={toc:p},m="wrapper";function u(e){let{components:t,...r}=e;return(0,n.kt)(m,(0,a.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"twilio"},"Twilio"),(0,n.kt)("p",null,"This page contains the setup guide and reference information for the Twilio source connector."),(0,n.kt)("h2",{id:"prerequisites"},"Prerequisites"),(0,n.kt)("p",null,"Twilio HTTP requests to the REST API are protected with HTTP Basic authentication. In short, you will use your Twilio Account SID as the username and your Auth Token as the password for HTTP Basic authentication."),(0,n.kt)("p",null,"You can find your Account SID and Auth Token on your ",(0,n.kt)("a",{parentName:"p",href:"https://www.twilio.com/user/account"},"dashboard"),"."),(0,n.kt)("p",null,"See ",(0,n.kt)("a",{parentName:"p",href:"https://www.twilio.com/docs/iam/api"},"docs")," for more details."),(0,n.kt)("h2",{id:"setup-guide"},"Setup guide"),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"For Airbyte Cloud:")),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("a",{parentName:"li",href:"https://cloud.airbyte.com/workspaces"},"Log into your Airbyte Cloud")," account."),(0,n.kt)("li",{parentName:"ol"},"In the left navigation bar, click ",(0,n.kt)("strong",{parentName:"li"},"Sources"),". In the top-right corner, click ",(0,n.kt)("strong",{parentName:"li"},"+new source"),"."),(0,n.kt)("li",{parentName:"ol"},"On the Set up the source page, enter the name for the Twilio connector and select ",(0,n.kt)("strong",{parentName:"li"},"Twilio")," from the <Source/Destination> type dropdown."),(0,n.kt)("li",{parentName:"ol"},"Enter your ",(0,n.kt)("inlineCode",{parentName:"li"},"account_sid"),"."),(0,n.kt)("li",{parentName:"ol"},"Enter your ",(0,n.kt)("inlineCode",{parentName:"li"},"auth_token"),"."),(0,n.kt)("li",{parentName:"ol"},"Enter your ",(0,n.kt)("inlineCode",{parentName:"li"},"start_date"),"."),(0,n.kt)("li",{parentName:"ol"},"Enter your ",(0,n.kt)("inlineCode",{parentName:"li"},"lookback_window"),"."),(0,n.kt)("li",{parentName:"ol"},"Click ",(0,n.kt)("strong",{parentName:"li"},"Set up source"),".")),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"For Airbyte Open Source:")),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},"Navigate to the Airbyte Open Source dashboard."),(0,n.kt)("li",{parentName:"ol"},"Set the name for your source."),(0,n.kt)("li",{parentName:"ol"},"Enter your ",(0,n.kt)("inlineCode",{parentName:"li"},"account_sid"),"."),(0,n.kt)("li",{parentName:"ol"},"Enter your ",(0,n.kt)("inlineCode",{parentName:"li"},"auth_token"),"."),(0,n.kt)("li",{parentName:"ol"},"Enter your ",(0,n.kt)("inlineCode",{parentName:"li"},"start_date"),"."),(0,n.kt)("li",{parentName:"ol"},"Enter your ",(0,n.kt)("inlineCode",{parentName:"li"},"lookback_window"),"."),(0,n.kt)("li",{parentName:"ol"},"Click ",(0,n.kt)("strong",{parentName:"li"},"Set up source"),".")),(0,n.kt)("h2",{id:"supported-sync-modes"},"Supported sync modes"),(0,n.kt)("p",null,"The Twilio source connector supports the following ",(0,n.kt)("a",{parentName:"p",href:"https://docs.airbyte.com/cloud/core-concepts#connection-sync-modes"},"sync modes"),":"),(0,n.kt)("table",null,(0,n.kt)("thead",{parentName:"table"},(0,n.kt)("tr",{parentName:"thead"},(0,n.kt)("th",{parentName:"tr",align:"left"},"Feature"),(0,n.kt)("th",{parentName:"tr",align:"left"},"Supported?"))),(0,n.kt)("tbody",{parentName:"table"},(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"Full Refresh Sync"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Yes")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"Incremental Sync"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Yes")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"Replicate Incremental Deletes"),(0,n.kt)("td",{parentName:"tr",align:"left"},"No")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"SSL connection"),(0,n.kt)("td",{parentName:"tr",align:"left"},"Yes")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"Namespaces"),(0,n.kt)("td",{parentName:"tr",align:"left"},"No")))),(0,n.kt)("h2",{id:"supported-streams"},"Supported Streams"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/usage/api/account#read-multiple-account-resources"},"Accounts")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/usage/api/address#read-multiple-address-resources"},"Addresses")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/usage/monitor-alert#read-multiple-alert-resources"},"Alerts")," ","(","Incremental",")"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/usage/api/applications#read-multiple-application-resources"},"Applications")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/phone-numbers/api/availablephonenumber-resource#read-a-list-of-countries"},"Available Phone Number Countries")," ","(","Incremental",")"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/phone-numbers/api/availablephonenumberlocal-resource#read-multiple-availablephonenumberlocal-resources"},"Available Phone Numbers Local")," ","(","Incremental",")"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/phone-numbers/api/availablephonenumber-mobile-resource#read-multiple-availablephonenumbermobile-resources"},"Available Phone Numbers Mobile")," ","(","Incremental",")"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/phone-numbers/api/availablephonenumber-tollfree-resource#read-multiple-availablephonenumbertollfree-resources"},"Available Phone Numbers Toll Free")," ","(","Incremental",")"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/voice/api/call-resource#create-a-call-resource"},"Calls")," ","(","Incremental",")"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/voice/api/conference-participant-resource#read-multiple-participant-resources"},"Conference Participants")," ","(","Incremental",")"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/voice/api/conference-resource#read-multiple-conference-resources"},"Conferences")," ","(","Incremental",")"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/conversations/api/conversation-resource#read-multiple-conversation-resources"},"Conversations")," "),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/conversations/api/conversation-message-resource#list-all-conversation-messages"},"Conversation Messages")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/conversations/api/conversation-participant-resource"},"Conversation Participants")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/usage/api/address?code-sample=code-list-dependent-pns-subresources&code-language=curl&code-sdk-version=json#instance-subresources"},"Dependent Phone Numbers")," ","(","Incremental",")"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/phone-numbers/api/incomingphonenumber-resource#read-multiple-incomingphonenumber-resources"},"Executions")," ","(","Incremental",")"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/phone-numbers/api/incomingphonenumber-resource#read-multiple-incomingphonenumber-resources"},"Incoming Phone Numbers")," ","(","Incremental",")"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/studio/rest-api/flow#read-a-list-of-flows"},"Flows")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/usage/api/keys#read-a-key-resource"},"Keys")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/sms/api/media-resource#read-multiple-media-resources"},"Message Media")," ","(","Incremental",")"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/sms/api/message-resource#read-multiple-message-resources"},"Messages")," ","(","Incremental",")"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/voice/api/outgoing-caller-ids#outgoingcallerids-list-resource"},"Outgoing Caller Ids")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/voice/api/queue-resource#read-multiple-queue-resources"},"Queues")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/voice/api/recording#read-multiple-recording-resources"},"Recordings")," ","(","Incremental",")"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/voice/api/recording-transcription?code-sample=code-read-list-all-transcriptions&code-language=curl&code-sdk-version=json#read-multiple-transcription-resources"},"Transcriptions")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/usage/api/usage-record#read-multiple-usagerecord-resources"},"Usage Records")," ","(","Incremental",")"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.twilio.com/docs/usage/api/usage-trigger#read-multiple-usagetrigger-resources"},"Usage Triggers"))),(0,n.kt)("h2",{id:"performance-considerations"},"Performance considerations"),(0,n.kt)("p",null,"The Twilio connector will gracefully handle rate limits.\nFor more information, see ",(0,n.kt)("a",{parentName:"p",href:"https://support.twilio.com/hc/en-us/articles/360044308153-Twilio-API-response-Error-429-Too-Many-Requests-"},"the Twilio docs for rate limitations"),"."),(0,n.kt)("h2",{id:"changelog"},"Changelog"),(0,n.kt)("table",null,(0,n.kt)("thead",{parentName:"table"},(0,n.kt)("tr",{parentName:"thead"},(0,n.kt)("th",{parentName:"tr",align:"left"},"Version"),(0,n.kt)("th",{parentName:"tr",align:"left"},"Date"),(0,n.kt)("th",{parentName:"tr",align:"left"},"Pull Request"),(0,n.kt)("th",{parentName:"tr",align:"left"},"Subject")))),(0,n.kt)("p",null,"| 0.5.0   | 2023-03-21 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/23995"},"23995")," | Add new stream ",(0,n.kt)("inlineCode",{parentName:"p"},"Conversation Participants"),"                                                              |\n| 0.4.0  | 2023-03-18 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/23995"},"23995")," | Add new stream ",(0,n.kt)("inlineCode",{parentName:"p"},"Conversation Messages"),"                                                              |\n| 0.3.0  | 2023-03-18  | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/22874"},"22874")," | Add new stream ",(0,n.kt)("inlineCode",{parentName:"p"},"Executions")," with parent ",(0,n.kt)("inlineCode",{parentName:"p"},"Flows"),"                                                         |\n| 0.2.0  | 2023-03-16 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/24114"},"24114")," | Add ",(0,n.kt)("inlineCode",{parentName:"p"},"Conversations")," stream\n|\n| 0.1.16  | 2023-02-10 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/22825"},"22825")," | Specified date formatting in specification                                                              |\n| 0.1.15  | 2023-01-27 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/22025"},"22025")," | Set ",(0,n.kt)("inlineCode",{parentName:"p"},"AvailabilityStrategy")," for streams explicitly to ",(0,n.kt)("inlineCode",{parentName:"p"},"None"),"                                             |\n| 0.1.14  | 2022-11-16 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/19479"},"19479")," | Fix date range slicing                                                                                  |\n| 0.1.13  | 2022-10-25 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/18423"},"18423")," | Implement datetime slicing for streams supporting incremental syncs                                     |\n| 0.1.11  | 2022-09-30 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/17478"},"17478")," | Add lookback_window parameters                                                                          |\n| 0.1.10  | 2022-09-29 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/17410"},"17410")," | Migrate to per-stream states                                                                            |\n| 0.1.9   | 2022-09-26 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/17134"},"17134")," | Add test data for Message Media and Conferences                                                         |\n| 0.1.8   | 2022-08-29 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/16110"},"16110")," | Add state checkpoint interval                                                                           |\n| 0.1.7   | 2022-08-26 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/15972"},"15972")," | Shift start date for stream if it exceeds 400 days                                                      |\n| 0.1.6   | 2022-06-22 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/14000"},"14000")," | Update Records stream schema and align tests with connectors' best practices                            |\n| 0.1.5   | 2022-06-22 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/13896"},"13896")," | Add lookback window parameters to fetch messages with a rolling window and catch status updates         |\n| 0.1.4   | 2022-04-22 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/12157"},"12157")," | Use Retry-After header for backoff                                                                      |\n| 0.1.3   | 2022-04-20 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/12183"},"12183")," | Add new subresource on the call stream + declare a valid primary key for conference_participants stream |\n| 0.1.2   | 2021-12-23 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/9092"},"9092"),"   | Correct specification doc URL                                                                           |\n| 0.1.1   | 2021-10-18 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/7034"},"7034"),"   | Update schemas and transform data types according to the API schema                                     |\n| 0.1.0   | 2021-07-02 | ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/airbytehq/airbyte/pull/4070"},"4070"),"   | Native Twilio connector implemented                                                                     |"))}u.isMDXComponent=!0},3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>h});var a=r(67294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},i=Object.keys(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var s=a.createContext({}),p=function(e){var t=a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},c=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},m="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,i=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),m=p(r),d=n,h=m["".concat(s,".").concat(d)]||m[d]||u[d]||i;return r?a.createElement(h,o(o({ref:t},c),{},{components:r})):a.createElement(h,o({ref:t},c))}));function h(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=r.length,o=new Array(i);o[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[m]="string"==typeof e?e:n,o[1]=l;for(var p=2;p<i;p++)o[p]=r[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}d.displayName="MDXCreateElement"}}]);