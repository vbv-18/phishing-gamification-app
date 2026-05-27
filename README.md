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

3. Launch a terminal inside the backend container and run `seed_levels.py` to insert the levels into the database.
    ````bash
    docker exec -it proyecto-backend-1 /bin/bash
    python seed_levels.py
    ````

4. For local development use the correct Docker network or host IP in the `frontend/services/api.ts` (http://10.0.2.2:8000 for Android emulator).

5. Install fronted dependencies
    ````bash
    cd frontend
    npm install
    npm install expo-router #if needed
    npm install expo-secure-store
    ````
6. Start the Expo development server:

    ````bash
    npm expo start
    ````

# Folders structure

## Backend

- **backend/app** - the code of the logic's app.
    - **core/** - internal settings.
      - `security.py`
      - `config.py`
    - **crud/** - Create, Read, Update, Delete and other functions for users, levels and xp system.
      - `level.py`
      - `users.py`
      - `xp.py`
    - **database/** - settings of the PostgreSQL database.
      - `connection.py` - creation and connection of the database.
    - **models/** - tables of the database.
      - `level.py` - table that represents a level.
      - `levelProgress.py` - table that mantains the progress relationship between a level and an user.
      - `module.py` - table that represents the whole module with the id, title, theory and the levels.
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
      - `token.py`
      - `users.py` - creation of an user, user response, login request and delete an user request.
    - **utils/** - contains the gamification data
      - `badges.py`
      - `levels.py`
      - `roles.py`
    - **data/** - all the JSONs with the theory and levels for each module
      - **01_module/**
      - **02_module/**
      - **03_module/**
      - **04_module/**
    - `main.py ` - principal function.
    - `Dockerfile` - for lauch the app.
    - `seed_levels.py` - script to insert levels in the database.


## Frontend

- **frontend/**  
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
  - **assets/** - static images used all oever the app.
  - **components/** - reusable UI components. 
    - **levels/** - components for screen levels.
    - **ui/** - components for headers or generic buttons.
    - **user/** - components for profile.
  - **constants/** - app constants like colors, spacing, badges or theory. 
    - `Badges.ts`  
    - `Colors.ts`  
    - `Spacing.ts`  
    - `theoryVisuals.ts`
  - **context/** -  global contexts accessivle from any file.
    - `AuthContext.tsx` - centralizes all authentication logic.
  - **hooks/** - custom React hooks.
    - `use-color-scheme.ts`  
    - `use-theme-color.ts`  
    - `use-color-sheme.web.ts`
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
    - `level.ts`
    - `module.ts`
    - `renderer.ts`
  - `package.json` - project metadata and dependencies.  
  - `tsconfig.json` - TypeScript configuration.
  - `app.json` - Expo configuration.
  - `README.md` - project documentation.



