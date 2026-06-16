# Requirements for running the app
1. Clone the repository
    ````bash
    git clone https://github.com/vbv-18/phishing-gamification-app.git
    ````

2. Build and run the Docker containers.
    ````bash
    docker compose up --build
    docker exec -it proyecto-backend-1 /bin/bash
    ````

3. For local development use the correct Docker network or host IP in the `frontend/services/client.ts` (http://10.0.2.2:8000 for Android emulator).

4. Install frontend dependencies.
    ````bash
    cd frontend
    npm install
    npm install expo-router #if needed
    npm install expo-secure-store
    ````
5. Start the Expo development server:

    ````bash
    npm expo start -c #-c to clean cache
    ````

# Folders structure

## Backend

- **/app** - the code of the logic's app.
  - `main.py ` - entrypoint of the app. 
  - **core/** - internal settings.
    - `security.py`
    - `config.py`
    - `middleware.py`
  - **crud/** - Create, Read, Update, Delete and other functions for users, levels and xp system.
    - `level.py`
    - `users.py`
    - `xp.py`
  - **database/** - settings of the PostgreSQL database.
    - `connection.py` - creation and connection of the database.
  - **models/** - tables of the database.
    - `access_registry.py` - table to audit.
    - `level.py` - table that represents a level.
    - `levelProgress.py` - table that mantains the progress relationship between a level and an user.
    - `module.py` - table that represents the whole module.
    - `refreshToken.py` - table that represents the token that mantains the user's sign in session.
    - `theoryProgress.py` - table that mantains the progress relationship between a theory level and an user.
    - `user.py` - table that represents a registered user.
    - `userXp.py` - table that represents the total xp gain by the user.
  - **routers/** - the endpoints of the app.
    - `auth.py` - authentication endpoints.
    - `users.py` - user profile endpoints.
    - `levels.py` - levels endpoints.
  - **schemas/** - for validate the input/output data.
    - `level.py` - level base, level response, level list and an user answer.
    - `token.py` - access and refresh tokens.
    - `users.py` - creation of an user, user response, login request and delete an user request.
    - `validators.py` - helpers to filter auth errors.
  - **utils/** - contains the gamification data and an error handler.
    - `badges.py`
    - `levels.py`
    - `roles.py`
    - `errors.py` - to clean the sign in errors.
- **data/** - all the JSONs with the theory and levels for each module
  - **01_module/**
  - **02_module/**
  - **03_module/**
  - **04_module/**
- `Dockerfile` - for build the backend.
- `entrypoint.sh` - insert data and launch app.
- `seed_levels.py` - script to insert levels in the database.


## Frontend

- **frontend/** 
  - `package.json` - project metadata and dependencies.  
  - `tsconfig.json` - TypeScript configuration.
  - `eas.json` - configuration to build the apk.
  - `app.json` - Expo configuration.
  - **app/** - app screens and navigation.
    - **(auth)/** - authentication-related screens.
      - `_layout.tsx` - layout for auth stack (signIn/signUp).
      - `index.tsx` - home screen for auth.
      - `signIn.tsx` - login screen.
      - `signUp.tsx` - register screen. 
    - **(levels)/** - authentication-related screens.
      - `_layout.tsx` - layout for level stack.
      - `home.tsx` - home screen for user registered.
      - `levelCompleted.tsx` - interactive completed level screen for all the levels.
      - `levelPlay.tsx` - interactive level screen for all the levels.
      - `moduleHome.tsx` - module's levels screen.
      - `theoryView.tsx` - interactive theory screen for all the theories.
    - **(user)/** - authentication-related screens.
      - `_layout.tsx` - layout for user stack (profile).
      - `profile.tsx` - screen that represents the user profile with statics and configurations.
  - **assets/images** - static images used all over the app.
  - **components/** - reusable UI components. 
    - **levels/** - components for screen levels.
    - **ui/** - components for headers or generic buttons.
    - **user/** - components for profile.
  - **constants/** - app constants like colors, spacing, badges or theory. 
    - `Badges.ts`  
    - `Colors.ts`  
    - `Spacing.ts`  
    - `theoryVisuals.ts`
  - **context/** - global contexts accessible from any file.
    - `AuthContext.tsx` - centralizes all authentication logic.
    - `LevelAnswersContext.tsx` - to not send the answers as a URL parameter.
  - **hooks/** - custom React hooks.
    - `useLevelState.ts` - controls the logic of the levels (answers, feedback, progress, animation).
    - `useLoadLevel.ts` - loads a level from the backend and controls the loading status.
    - `useLoadLevelsByModule.ts` - load every level of a module.
    - `useLoadModules.ts` - load the module.
    - `useLoadTheory.ts` - load the theory of a module.
    - `useUserXp.ts` - automatically updates the user's xp.
  - **renders/** - link each mechanic to the corresponding level component.
    - `mechanicsMap.ts`
  - **services/** - API and authentication logic. 
    - `api.ts` - centralize all the backend API calls.
    - `auth.ts` - securely manage authentication tokens using expo-secure-store.
    - `authHandler.ts` - to allow handling expired tokens, invalid refresh tokens, global errors or expired sessions.
    - `client.ts` - configures automatic authentication, refresh tokens, centralizes error handling and global session closure.
  - **types/** - all the interfaces for the defined types
    - `exercise.ts`
    - `gamification.ts`
    - `level.ts`
    - `module.ts`
    - `renderer.ts`
    - `user.ts`



