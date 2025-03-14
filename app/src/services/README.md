# Log Events Documentation

This document lists all the log events managed by the application through the `logEvents.js` service.

## Overview

The application uses Matomo for analytics tracking. Each log event consists of:
- **Category**: The main group the event belongs to
- **Action**: The specific action being logged
- **Name** (optional): Additional parameter name
- **Value** (optional): Additional parameter value

## Log Events Table

| Category | Action | Additional Parameters | Description |
|----------|--------|----------------------|-------------|
| APP | APP_OPEN | - | Logs when the app is opened |
| APP | APP_CLOSE | - | Logs when the app is closed |
| ONBOARDING | NEXT_CLICK | page (value) | Logs when user swipes to next onboarding page |
| FEELING | FEELING_START | - | Logs when user starts adding a feeling |
| FEELING | FEELING_START_FLOATING_PLUS | - | Logs when user starts adding a feeling via floating plus button |
| FEELING | FEELING_START_FROM_RECAP | offset (value) | Logs when user starts adding a feeling from recap |
| FEELING | FEELING_DATE_CHOOSE | date (name) | Logs when user chooses a date for a feeling |
| FEELING | FEELING_START_YESTERDAY | value (name) | Logs when user starts adding a feeling for yesterday |
| FEELING | FEELING_ADD | - | Logs when user adds a feeling |
| FEELING | FEELING_ADD_SURVEY | indicateur (value) | Logs when user submits a feeling survey |
| FEELING | FEELING_ADD_COMMENT | comment (value) | Logs when user adds a comment to a feeling |
| FEELING | FEELING_ADD_CONTEXT | context (value) | Logs when user adds context to a feeling |
| FEELING | FEELING_RESPONSE_TOXIC | toxic (value) | Logs when user provides a toxic response |
| FEELING | FEELING_EDIT_BUTTON_CLICK | - | Logs when user clicks the edit button for a feeling |
| PARAMETERS | REMINDER_ADD | - | Logs when user adds a reminder |
| PARAMETERS | REMINDER_CANCEL | - | Logs when user cancels a reminder |
| SYMPTOM | SYMPTOM_SETTING_FROM_SURVEY | - | Logs when user accesses symptom settings from survey |
| SYMPTOM | SYMPTOM_ADD | symptom (value) | Logs when user adds a symptom |
| SYMPTOM | SYMPTOM_CANCEL | symptom (value) | Logs when user cancels a symptom |
| CUSTOM_SYMPTOM | CUSTOM_SYMPTOM_ADD | - | Logs when user adds a custom symptom |
| CALENDAR | CALENDAR_OPEN | - | Logs when user opens the calendar |
| INFOS | INFOS_OPEN | - | Logs when user opens the info section |
| INFOS | INFOS_CLICK | link (name) | Logs when user clicks on an info link |
| CONTACT | CONTACT_OPEN | - | Logs when user opens the contact section |
| DATA_EXPORT | DATA_EXPORT | - | Logs when user exports data |
| NPS | NPS_OPEN | - | Logs when user opens NPS (Net Promoter Score) |
| NPS | NPS_SEND | notes (value) | Logs when user sends NPS feedback |
| NPS | NPS_SEND | notes-useful (value) | Logs when user sends usefulness rating |
| NPS | NPS_SEND | notes-reco (value) | Logs when user sends recommendation rating |
| NPS | PRO_NPS_SEND | - | Logs when professional sends NPS feedback |
| NPS | PRO_NPS_CONTACT_SEND | - | Logs when professional sends contact through NPS |
| SUPPORTED | SUPPORTED_CHOOSE | supported (name) | Logs when user selects supported option |
| EXPLANATION | EXPLANATION_OPEN | - | Logs when user opens explanation |
| EXPLANATION | EXPLANATION_NEXT | page (value) | Logs when user navigates to next explanation page |
| EXPLANATION | EXPLANATION_START | - | Logs when user starts explanation |
| DRUG | DRUG_OPEN | - | Logs when user opens drug section |
| DRUG | DRUG_NOT_FOUND | value (name) | Logs when a treatment is not found |
| DRUG | DRUG_ADD | drug (value) | Logs when user adds a drug |
| DRUG | DRUG_INPUT_SURVEY | numberOfInput (value) | Logs number of inputs in drug survey |
| DRUG | DRUG_INPUT_SURVEY_PRISE_DE_TRAITEMENT | - | Logs when user inputs treatment intake |
| DRUG | DRUG_INPUT_SURVEY_PRISE_DE_TRAITEMENT_SI_BESOIN | - | Logs when user inputs as-needed treatment intake |
| BECK | BECK_ACTIVATE | value (name) | Logs when user activates Beck feature |
| BECK | BECK_ADD_CUSTOM_ELEMENT_IN_WHERE_LIST | value (name) | Logs when user adds custom location in Beck |
| BECK | BECK_ADD_CUSTOM_ELEMENT_IN_WHO_LIST | value (name) | Logs when user adds custom person in Beck |
| BECK | BECK_ADD_CUSTOM_ELEMENT_IN_EMOTION_LIST | value (name) | Logs when user adds custom emotion in Beck |
| BECK | BECK_ADD_CUSTOM_ELEMENT_IN_SENSATION_LIST | value (name) | Logs when user adds custom sensation in Beck |
| BECK | BECK_STEP_OPEN | step (name) | Logs when user opens a Beck step |
| BECK | BECK_VIEW_OPEN | - | Logs when user opens Beck view |
| BECK | BECK_EDIT_CLICK | - | Logs when user clicks edit in Beck |
| BECK | BECK_DELETE | - | Logs when user deletes a Beck entry |
| DIARY | DIARY_ADD_NOTE | - | Logs when user adds a diary note |
| DIARY | DIARY_EDIT_NOTE | - | Logs when user edits a diary note |
| DIARY | DIARY_DELETE_NOTE | - | Logs when user deletes a diary note |
| OPEN_TAB | [CATEGORY]_OPEN | - | Logs when user opens a tab |
| OPEN_SUB_TAB_STATUS | [TAB]_OPEN | - | Logs when user opens a status sub-tab |
| OPEN_SUB_TAB_SUIVI | [TAB]_OPEN | - | Logs when user opens a follow-up sub-tab |
| SUIVI | EDIT_DATE_FROM | - | Logs when user edits start date in follow-up |
| SUIVI | EDIT_DATE_TO | - | Logs when user edits end date in follow-up |
| SUIVI | EDIT_SCORE_FRISE | score (name) | Logs when user edits score in timeline |
| SUIVI | EDIT_SCORE_EVENTS | score (name) | Logs when user edits score in events |
| SUIVI | EDIT_SYMPTOM_EVENTS | - | Logs when user edits symptom in events |
| SUIVI | SHOW_DETAIL_STATISTICS | - | Logs when user views detailed statistics |
| SUIVI | SHOW_INFORMATIONS_LEGENDE_PRISE_DE_TRAITEMENT | affichage (value) | Logs when user views treatment intake legend |
| SUIVI | SHOW_PRISE_DE_TRAITEMENT | affichage (value) | Logs when user views treatment intake |
| RECOMMEND | SHOW_MODAL | - | Logs when app recommendation modal is shown |
| RECOMMEND | SENT | type (name) | Logs when app recommendation is sent |
| RECOMMEND | DISMISSED | - | Logs when app recommendation is dismissed |
| RECOMMEND | ERROR | - | Logs when app recommendation encounters an error |
| PUSH_NOTIFICATION_TOKEN_REGISTER | SUCCESS | - | Logs successful push notification token registration |
| PUSH_NOTIFICATION_TOKEN_REGISTER | ERROR | - | Logs failed push notification token registration |
| PUSH_NOTIFICATION_RECEIVE | CLICKED | - | Logs when user clicks on a received push notification |
