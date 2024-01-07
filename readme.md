# Employees

This project includes a frontend application built with Next.js and TypeScript, and a backend application built with Express, TypeScript, Sequelize, and MySQL.

## Running the Frontend

To run the frontend application, follow these steps:

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Run the application:

   ```bash
   npm run dev
   ```

The frontend application should start at [`localhost:3000`](http://localhost:3000)

## Running the Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Go to your DBMS:

   ```bash
   CREATE DATABASE employees;
   ```

4. Run the migrations:

   ```bash
   npx sequelize-cli db:migrate
   ```

5. Run the seeders:

   ```bash
   npx sequelize-cli db:seed:all
   ```

6. Run the application:

   ```bash
   npm run dev
   ```

The backend application should start at [`localhost:8080`](http://localhost:8080)
