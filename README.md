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

SECRET_KEY generada con openssl -hex 32

