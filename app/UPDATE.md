# What's new

- adding expo@51
- - running expo-doctor to see package needed to be updated
- updating react-natigation to v6
- - review some of the code to match the new version
- made the project Continuous Native Generation (CNG) https://docs.expo.dev/workflow/continuous-native-generation/
- - means that /ios and /android are generated automatically from the code - so no need to have them in the repo

# What's changed

- react-native-cli
- change react-native-permissions to package that works with expo https://docs.expo.dev/guides/permissions/
- - mostly the notification permission had to be changed, so I changed for expo-notifications --> TO CHECK
- sentry was not working, so it need to be re-install use @sentry/react-native and follow the instructions https://docs.expo.dev/guides/using-sentry/
- chabge react-native-dotenv to built in expo https://docs.expo.dev/guides/using-environment-variables/
- In the code the Button2.js, Card.js Collapsable.js and InputText.js (searh for // FIX-EVAL: ) were not working, so I make a quick win fix but a refactoring is needed
- the pdf viewer was not working, so I use the WebView component from expo-web-browser (presentation/index.js)
- the pie chart was not working, so I use the react-native-pie-chart package (scenes/suivi/chartPie.js)
- - scenes/suivi/chartPie.js
- - scenes/goals/suivi/GoalsChartPie.js

- asset moved
- - fonts to assets/fonts
- - - all the `fontFamily: "Karla"` style were changed to `fontFamily: "Karla-Regular"` (follow the best practices of expo naming file https://docs.expo.dev/develop/user-interface/fonts/#how-to-determine-which-font-family-name-to-use)
- - images to assets/imgs
- status/DiaryList.js was not working having a warning, so I use forwardRef to fix it
- scenes/indicateurs/settings/IndicatorsSettingsMore.js and goals/settings/GoalsSettingsMore.js were crashing the app cause of incompatible version of react-native-draggable-flatlist (v3) and react-native-reanimated, so I use the react-native-draggable-flatlist@4

# What's removed

- removed the /ios and /android folders, as they are now generated automatically from the code
- all @babel packages except for @babel/core
- unused packages: react-test-renderer, react-native-masked-view/masked-view

# To do

- P0
- - fix the pdf viewer for android not working
- - check the notification system
- - add sentry
- - check if assets are how they were before (icons, fonts and splash screen)
- P1
- - Safe Area View badly handled (android the top is cut and ios with not rectangle screen the bottom is hidden)
- - Use nativewind
- P2
- - change the pie chart react-native-pie (5y not maintained) package for react-native-pie-chart or else
