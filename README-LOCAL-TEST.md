# Local testing

1. Start the Spring Boot backend first. Open the backend folder and run `mvnw.cmd spring-boot:run` on Windows (or `./mvnw spring-boot:run` on macOS/Linux). It listens on `http://localhost:9090`.
2. Make sure MySQL is running and the database settings in `src/main/resources/application.properties` match your local MySQL setup.
3. Open the frontend folder in a second terminal and run `npm install`, then `npm run dev`.
4. Open the Vite URL shown in the terminal (normally `http://localhost:5173`). The Vite `/backend` proxy forwards API requests to Spring Boot on port 9090.

The Employee ID field is now included in the save/search API and in the generated letter. Hibernate is configured with `ddl-auto=update`, so it will add the new employee_id column to the existing appraisal table when the backend starts.
