# Requirements for running the app
1. Clone the repository
    ````bash
    git clone https://github.com/vbv-18/phishing-gamification-app.git
    ````

2. Build and run the Docker containers.
    ````bash
    docker compose up --build
    ````
3. For local development use the correct Docker network or host IP in the frontend/services/api.ts (http://10.0.2.2:8000 for Android emulator).

4. Install fronted dependencies
    ````bash
    cd frontend
    npm install
    npm install expo-router #if needed
    npm install expo-secure-store
    ````
5. Start the Expo development server:

    ````bash
    npm expo start
    ````

# Folders structure

## Backend

- **backend/app** — the code of the logic's app.
    - **core** — internal settings.
      - `security.py`
      - `config.py`
    - **crud** — Create, Read, Update, Delete functions.
    - **database** — settings of the PostgreSQL database.
        - `connection.py` — creation and connection of the database.
    - **models** — tables of the database.
        - `users.py` — tables with all the registered users.
    - **routers** — the endpoints of the app.
        - `auth.py` — authentication endpoints.
        - `users.py` — user profile endpoints.
    - **schemas** — for validate the input/output data.
    - `main.py ` — principal function.
    - `Dockerfile` — for lauch the app.

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
    - `modal.tsx` — modal example screen  
  - **components/** — reusable UI components  
    - `PrimaryButton.tsx` — custom button component  
    - `themed-text.tsx` — text component with theming support  
    - `themed-view.tsx` — view component with theming support  
    - **ui/** — smaller UI components (icons, collapsible, etc.)  
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



