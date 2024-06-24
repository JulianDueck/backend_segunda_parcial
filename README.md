# Backend Segunda Parcial

## Integrantes

+ Julian Dueck
+ Fabiola Ortiz
+ Esteban Manuel Leguizamón
+ Hector Gimenez
+ Ariel Rejala

## Pre-requisitos

+ Tener instalado Node.js: <https://nodejs.org/es>
+ Tener instalado Postgres: <https://www.postgresql.org/download/>
+ Tener instalado NPM: <https://www.npmjs.com/get-npm>

## Instalación y ejecución del proyecto

### Servidor

1. Crear una base de datos en Postgres llamada `pwb2p`
2. Ingresar a la carpeta `server`

   ```sh
   cd server
   ```

3. Instalar las dependencias

   ```sh
   npm install
   ```

4. Crear un archivo `.env` en la carpeta `server` y rellenar con los siguientes datos:

   ```env
    DB_NAME=pwb2p
    DB_USER=postgres
    DB_PASS=postgres
    DB_HOST=localhost
    DB_URL=postgres://user:pass@localhost:5432/dbname
    # En caso de que el metodo sea URL, se utiliza la variable DB_URL, caso contrario se usa DB_NAME, DB_USER, DB_PASS, DB_HOST
    SEQUELIZE_METHOD_CONNECTION=URL
    ```

5. Ejecutar el proyecto

    ```sh
    npm start
    ```

6. El servidor ya está iniciado

### Cliente

1. Ingresar a la carpeta `frontend`

   ```sh
   cd frontend
   ```

2. Instalar las dependencias

    ```sh
    npm install
    ```

3. Crear un archivo .env en la carpeta /frontend/ para definir las configuraciones de las variables de entorno

    ```env
    # URL de nuestro backend 
    VITE_API_BASE_URL=http://localhost:8000
    ```

4. Ejecutar el proyecto del cliente

    ```sh
    npm run dev
    ```

5. El cliente ya está iniciado

## Endpoints de la API

host: `http://localhost:8000/api`

+ Se puede importar el archivo `Postman/postman_collection.json` en Postman para poder probar la API rapidamente.

### Rutas de la API `/restaurante`

+ `GET` /restaurante
+ `GET` /restaurante/:id
+ `POST` /restaurante
+ `PUT` /restaurante/:id
+ `DELETE` /restaurante/:id

### Rutas de la API `/mesa`

+ `GET` /mesa
+ `GET` /mesa/:id
+ `POST` /mesa
+ `PUT` /mesa/:id
+ `DELETE` /mesa/:id

### Rutas de la API `/cliente`

+ `GET` /cliente
+ `POST` /cliente

### Rutas de la API `/reserva`

+ `GET` /reserva
+ `GET` /reserva/:idRestaurante/:fecha/:horaInicio/:horaFin
+ `POST` /reserva
