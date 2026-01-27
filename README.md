# Skeleton

- __backend/app__: the code of the logic's app.
    - __core__: internal settings.
    - __database__: settings of the PostgreSQL database.
        - __connection.py__: creation and connection of the database.
    - __models__: tables of the database.
        - __users.py__: tables with all the registered users.
    - __routers__: the endpoints of the app.
        - __auth.py__: authentication.
    - __shemas__: for validate the input/output data.
    - __main.py__: principal function.
    - __Dockerfile__: for lauch the app.

# Requirements for frontend
- __Node.js__ for npm
- Execute __npx create-expo-app frontend-clean --template blank__ to create the fronted folder
- Install SecureStore to get an AuthContext secure: __npx expo install expo-secure-store__
- Launch the app with Expo: __npx expo start__
- Install npm install __@react-navigation/native__ and __npx expo install react-native-screens react-native-safe-area-context__
- Install __npm install @react-navigation/native-stack__
- Install __npm install axios__