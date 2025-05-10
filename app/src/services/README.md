# Documentation des Événements de Log

Ce document répertorie tous les événements de log gérés par l'application via le service `logEvents.js`.

## Aperçu

L'application utilise Matomo pour le suivi analytique. Chaque événement de log se compose de :
- **Category** : Le groupe principal auquel appartient l'événement
- **Action** : L'action spécifique enregistrée
- **Name** (optionnel) : Nom du paramètre supplémentaire
- **Value** (optionnel) : Valeur du paramètre supplémentaire

## Tableau des Événements de Log

| Catégorie | Action | Paramètres Supplémentaires | Description |
|----------|--------|----------------------|-------------|
| APP | APP_OPEN | - | Enregistre quand l'application est ouverte |
| APP | APP_CLOSE | - | Enregistre quand l'application est fermée |
| ONBOARDING | NEXT_CLICK | page (valeur) | Enregistre quand l'utilisateur passe à la page suivante d'intégration |
| FEELING | FEELING_START | - | Enregistre quand l'utilisateur commence à ajouter un ressenti |
| FEELING | FEELING_START_FLOATING_PLUS | - | Enregistre quand l'utilisateur commence à ajouter un ressenti via le bouton flottant plus |
| FEELING | FEELING_START_FROM_RECAP | offset (valeur) | Enregistre quand l'utilisateur commence à ajouter un ressenti depuis le récapitulatif |
| FEELING | FEELING_DATE_CHOOSE | date (nom) | Enregistre quand l'utilisateur choisit une date pour un ressenti |
| FEELING | FEELING_START_YESTERDAY | valeur (nom) | Enregistre quand l'utilisateur commence à ajouter un ressenti pour hier |
| FEELING | FEELING_ADD | - | Enregistre quand l'utilisateur ajoute un ressenti |
| FEELING | FEELING_ADD_SURVEY | indicateur (valeur) | Enregistre quand l'utilisateur soumet un sondage de ressenti |
| FEELING | FEELING_ADD_COMMENT | comment (valeur) | Enregistre quand l'utilisateur ajoute un commentaire à un ressenti |
| FEELING | FEELING_ADD_CONTEXT | context (valeur) | Enregistre quand l'utilisateur ajoute un contexte à un ressenti |
| FEELING | FEELING_RESPONSE_TOXIC | toxic (valeur) | Enregistre quand l'utilisateur fournit une réponse toxique |
| FEELING | FEELING_EDIT_BUTTON_CLICK | - | Enregistre quand l'utilisateur clique sur le bouton d'édition d'un ressenti |
| PARAMETERS | REMINDER_ADD | - | Enregistre quand l'utilisateur ajoute un rappel |
| PARAMETERS | REMINDER_CANCEL | - | Enregistre quand l'utilisateur annule un rappel |
| SYMPTOM | SYMPTOM_SETTING_FROM_SURVEY | - | Enregistre quand l'utilisateur accède aux paramètres de symptômes depuis le sondage |
| SYMPTOM | SYMPTOM_ADD | symptom (valeur) | Enregistre quand l'utilisateur ajoute un symptôme |
| SYMPTOM | SYMPTOM_CANCEL | symptom (valeur) | Enregistre quand l'utilisateur annule un symptôme |
| CUSTOM_SYMPTOM | CUSTOM_SYMPTOM_ADD | - | Enregistre quand l'utilisateur ajoute un symptôme personnalisé |
| CALENDAR | CALENDAR_OPEN | - | Enregistre quand l'utilisateur ouvre le calendrier |
| INFOS | INFOS_OPEN | - | Enregistre quand l'utilisateur ouvre la section d'informations |
| INFOS | INFOS_CLICK | link (nom) | Enregistre quand l'utilisateur clique sur un lien d'information |
| CONTACT | CONTACT_OPEN | - | Enregistre quand l'utilisateur ouvre la section de contact |
| DATA_EXPORT | DATA_EXPORT | - | Enregistre quand l'utilisateur exporte des données |
| NPS | NPS_OPEN | - | Enregistre quand l'utilisateur ouvre le NPS (Net Promoter Score) |
| NPS | NPS_SEND | notes (valeur) | Enregistre quand l'utilisateur envoie un retour NPS |
| NPS | NPS_SEND | notes-useful (valeur) | Enregistre quand l'utilisateur envoie une évaluation d'utilité |
| NPS | NPS_SEND | notes-reco (valeur) | Enregistre quand l'utilisateur envoie une évaluation de recommandation |
| NPS | PRO_NPS_SEND | - | Enregistre quand un professionnel envoie un retour NPS |
| NPS | PRO_NPS_CONTACT_SEND | - | Enregistre quand un professionnel envoie un contact via NPS |
| SUPPORTED | SUPPORTED_CHOOSE | supported (nom) | Enregistre quand l'utilisateur sélectionne une option de support |
| EXPLANATION | EXPLANATION_OPEN | - | Enregistre quand l'utilisateur ouvre une explication |
| EXPLANATION | EXPLANATION_NEXT | page (valeur) | Enregistre quand l'utilisateur navigue vers la page d'explication suivante |
| EXPLANATION | EXPLANATION_START | - | Enregistre quand l'utilisateur démarre une explication |
| DRUG | DRUG_OPEN | - | Enregistre quand l'utilisateur ouvre la section des médicaments |
| DRUG | DRUG_NOT_FOUND | value (nom) | Enregistre quand un traitement n'est pas trouvé |
| DRUG | DRUG_ADD | drug (valeur) | Enregistre quand l'utilisateur ajoute un médicament |
| DRUG | DRUG_INPUT_SURVEY | numberOfInput (valeur) | Enregistre le nombre d'entrées dans le sondage sur les médicaments |
| DRUG | DRUG_INPUT_SURVEY_PRISE_DE_TRAITEMENT | - | Enregistre quand l'utilisateur saisit une prise de traitement |
| DRUG | DRUG_INPUT_SURVEY_PRISE_DE_TRAITEMENT_SI_BESOIN | - | Enregistre quand l'utilisateur saisit une prise de traitement si besoin |
| BECK | BECK_ACTIVATE | value (nom) | Enregistre quand l'utilisateur active la fonctionnalité Beck |
| BECK | BECK_ADD_CUSTOM_ELEMENT_IN_WHERE_LIST | value (nom) | Enregistre quand l'utilisateur ajoute un lieu personnalisé dans Beck |
| BECK | BECK_ADD_CUSTOM_ELEMENT_IN_WHO_LIST | value (nom) | Enregistre quand l'utilisateur ajoute une personne personnalisée dans Beck |
| BECK | BECK_ADD_CUSTOM_ELEMENT_IN_EMOTION_LIST | value (nom) | Enregistre quand l'utilisateur ajoute une émotion personnalisée dans Beck |
| BECK | BECK_ADD_CUSTOM_ELEMENT_IN_SENSATION_LIST | value (nom) | Enregistre quand l'utilisateur ajoute une sensation personnalisée dans Beck |
| BECK | BECK_STEP_OPEN | step (nom) | Enregistre quand l'utilisateur ouvre une étape Beck |
| BECK | BECK_VIEW_OPEN | - | Enregistre quand l'utilisateur ouvre la vue Beck |
| BECK | BECK_EDIT_CLICK | - | Enregistre quand l'utilisateur clique sur éditer dans Beck |
| BECK | BECK_DELETE | - | Enregistre quand l'utilisateur supprime une entrée Beck |
| DIARY | DIARY_ADD_NOTE | - | Enregistre quand l'utilisateur ajoute une note au journal |
| DIARY | DIARY_EDIT_NOTE | - | Enregistre quand l'utilisateur modifie une note du journal |
| DIARY | DIARY_DELETE_NOTE | - | Enregistre quand l'utilisateur supprime une note du journal |
| OPEN_TAB | [CATEGORY]_OPEN | - | Enregistre quand l'utilisateur ouvre un onglet |
| OPEN_SUB_TAB_STATUS | [TAB]_OPEN | - | Enregistre quand l'utilisateur ouvre un sous-onglet de statut |
| OPEN_SUB_TAB_SUIVI | [TAB]_OPEN | - | Enregistre quand l'utilisateur ouvre un sous-onglet de suivi |
| SUIVI | EDIT_DATE_FROM | - | Enregistre quand l'utilisateur modifie la date de début dans le suivi |
| SUIVI | EDIT_DATE_TO | - | Enregistre quand l'utilisateur modifie la date de fin dans le suivi |
| SUIVI | EDIT_SCORE_FRISE | score (nom) | Enregistre quand l'utilisateur modifie le score dans la frise chronologique |
| SUIVI | EDIT_SCORE_EVENTS | score (nom) | Enregistre quand l'utilisateur modifie le score dans les événements |
| SUIVI | EDIT_SYMPTOM_EVENTS | - | Enregistre quand l'utilisateur modifie un symptôme dans les événements |
| SUIVI | SHOW_DETAIL_STATISTICS | - | Enregistre quand l'utilisateur consulte les statistiques détaillées |
| SUIVI | SHOW_INFORMATIONS_LEGENDE_PRISE_DE_TRAITEMENT | affichage (valeur) | Enregistre quand l'utilisateur consulte la légende de prise de traitement |
| SUIVI | SHOW_PRISE_DE_TRAITEMENT | affichage (valeur) | Enregistre quand l'utilisateur consulte la prise de traitement |
| RECOMMEND | SHOW_MODAL | - | Enregistre quand la fenêtre de recommandation d'application est affichée |
| RECOMMEND | SENT | type (nom) | Enregistre quand une recommandation d'application est envoyée |
| RECOMMEND | DISMISSED | - | Enregistre quand une recommandation d'application est ignorée |
| RECOMMEND | ERROR | - | Enregistre quand une recommandation d'application rencontre une erreur |
| PUSH_NOTIFICATION_TOKEN_REGISTER | SUCCESS | - | Enregistre l'enregistrement réussi du jeton de notification push |
| PUSH_NOTIFICATION_TOKEN_REGISTER | ERROR | - | Enregistre l'échec d'enregistrement du jeton de notification push |
| PUSH_NOTIFICATION_RECEIVE | CLICKED | - | Enregistre quand l'utilisateur clique sur une notification push reçue |
