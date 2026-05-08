# System GS - Spring Boot Backend

This is the Java Spring Boot version of the Gestion de Stock backend.

## Prerequisites
- Java 17 or higher
- Maven
- MySQL Database

## Getting Started
1. Create a MySQL database named `gestion_stock_gs`.
2. Update `src/main/resources/application.properties` with your database credentials, Cloudinary API keys, and SMTP settings.
3. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```

## API Endpoints
- `POST /api/auth/login`: Authenticate and get JWT.
- `GET /api/products`: List all products.
- `POST /api/products`: Create a product (supports multipart/form-data for image).
- `GET /api/categories`: List all categories.
- `GET /api/suppliers`: List all suppliers.
- `GET /api/dashboard/stats`: Get dashboard statistics.
- `GET /api/movements`: List stock movements.

## Security
- JWT based authentication.
- Include `Authorization: Bearer <token>` in the headers for protected routes.
