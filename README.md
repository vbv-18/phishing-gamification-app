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

- **backend/app** — the code of the logic's app.
    - **core** — internal settings.
      - `security.py`
      - `config.py`
    - **crud** — Create, Read, Update, Delete and other functions for users, levels and xp system.
      - `level.py`
      - `users.py`
      - `xp.py`
    - **database** — settings of the PostgreSQL database.
      - `connection.py` — creation and connection of the database.
    - **models** — tables of the database.
      - `user.py` — table that represents a registered user.
      - `userXp.py` — table that represents the total xp gain by the user.
      - `level.py` — table that represents a level.
      - `levelProgress.py` — table that mantains the progress relationship between a level and an user.
      - `refreshToken.py` — table that represents the token that mantains the user's sign in session.
    - **routers** — the endpoints of the app.
      - `auth.py` — authentication endpoints.
      - `users.py` — user profile endpoints.
      - `levels.py` — levels endpoints.
    - **schemas** — for validate the input/output data.
      - `level.py` — level base, level response, level list and an user answer.
      - `token.py`
      - `users.py` — creation of an user, user response, login request and delete an user request.
    - `main.py ` — principal function.
    - `Dockerfile` — for lauch the app.
    - `seed_levels.py` — script to insert levels in the database.


## Frontend

- **frontend/**  
  - **app/** — app screens and navigation.
    - **(auth)/** — authentication-related screens.
      - **components/** — components as BottomHeader, ConfirmPassWordDelete or ProfileHeader that auth screens use.
      - `_layout.tsx` — layout for auth stack (signIn/signUp).
      - `index.tsx` — home screen for auth.
      - `signIn.tsx` — login screen.
      - `signUp.tsx` — register screen. 
    - **(levels)/** — authentication-related screens.
      - **components/** — components as ContinueButton, DomainSegment, EmailCard, FeedbackText, LevelHeader or ZoomInspector that level screens use.
      - **exercises/** — each level screens.
      - `_layout.tsx` — layout for level stack.
      - `home.tsx` — home screen for user registered.
      - `moduleHome.tsx` — module's levels screen. 
      - `levelTheory.tsx` — theory screen.
      - `levelPlay.tsx` — interactive level screen for all the levels.
      - `levelCompleted.tsx` — interactive completed level screen for all the levels.
    - **(user)/** — authentication-related screens.
      - `_layout.tsx` — layout for user stack (profile).
      - `profile.tsx` — screen that represents the user profile with statics and configurations.
    - `modal.tsx` — modal example screen.
  - **components/** — reusable UI components. 
    - `PrimaryButton.tsx` — custom button component.
    - `themed-text.tsx` — text component with theming support.
    - `themed-view.tsx` — view component with theming support. 
    - **levels/** — components for screen levels.
  - **constants/** — app constants like colors, spacing or themes. 
    - `Colors.ts`  
    - `Spacing.ts`  
    - `theme.ts`
  - **context/** —  global contexts accessivle from any file.
    - `AuthContext.tsx` — centralizes all authentication logic.
  - **hooks/** — custom React hooks.
    - `use-color-scheme.ts`  
    - `use-theme-color.ts`  
    - `use-color-sheme.web.ts`
    - `useLevelState.ts` — controls the logic of the levels (answers, feedback, progress, animation).
    - `useLoadLevel.ts` — loads a level from the backend and controls the loading status.
    - `useUserXp.ts` — automatically updates the user's xp.
  - **services/** — API and authentication logic. 
    - `api.ts` — centralize all the backend API calls.
    - `auth.ts` — securely manage authentication tokens using expo-secure-store.
    - `authHandler.ts` — to allow handling expired tokens, invalid refresh tokens, global errors or expired sessions.
    - `client.ts` — configures automatic authentication, refresh tokens, centralizes error handling and global session closure.
  - **assets/** — static images as the icon app.
  - `package.json` — project metadata and dependencies.  
  - `tsconfig.json` — TypeScript configuration.
  - `app.json` — Expo configuration.
  - `README.md` — project documentation.



