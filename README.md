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
    - **crud** — Create, Read, Update, Delete functions for users and levels.
    - **database** — settings of the PostgreSQL database.
        - `connection.py` — creation and connection of the database.
    - **models** — tables of the database.
        - `users.py` — table that represents a registered user.
        - `level.py` — table that represents a level.
        - `levelProgress.py` — table that mantains the progress relationship between a level and an user.
    - **routers** — the endpoints of the app.
        - `auth.py` — authentication endpoints.
        - `users.py` — user profile endpoints.
        - `levels.py` — levels endpoints.
    - **schemas** — for validate the input/output data.

    - `main.py ` — principal function.
    - `Dockerfile` — for lauch the app.
    - `seed_levels.py` — script to insert levels in the database.


## Frontend

- **frontend/**  
  - **.expo/** — Expo internal files  
  - **.vscode/** — VSCode workspace settings  
  - **app/** — app screens and navigation  
    - **(auth)/** — authentication-related screens  
      - `_layout.tsx` — layout for auth stack (login/register)  
      - `index.tsx` — home screen for auth  
      - `login.tsx` — login screen  
      - `register.tsx` — register screen  
      - `profile.tsx` — user profile screen 
    - **(levels)/** — authentication-related screens  
      - `_layout.tsx` — layout for level stack 
      - `home.tsx` — home screen for user registered 
      - `moduleHome.tsx` — module's levels screen  
      - `levelTheory.tsx` — theory screen  
      - `levelPlay.tsx` — interactive level screen  
    - `modal.tsx` — modal example screen  
  - **components/** — reusable UI components  
    - `PrimaryButton.tsx` — custom button component  
    - `themed-text.tsx` — text component with theming support  
    - `themed-view.tsx` — view component with theming support  
    - **levels/** — components for screen levels
  - **constants/** — app constants like colors, spacing, themes  
    - `Colors.ts`  
    - `Spacing.ts`  
    - `theme.ts`  
  - **hooks/** — custom React hooks  
    - `use-color-scheme.ts`  
    - `use-theme-color.ts`  
    - `use-color-sheme.web.ts`  
  - **services/** — API and authentication logic  
    - `api.ts` — API fetch wrapper (login, register, profile)  
    - `auth.ts` — token storage using SecureStore  
  - **assets/** — images, fonts, and other static assets  
  - **node_modules/** — NPM packages (auto-generated)  
  - `package.json` — project metadata and dependencies  
  - `tsconfig.json` — TypeScript configuration  
  - `app.json` — Expo configuration  
  - `README.md` — project documentation



