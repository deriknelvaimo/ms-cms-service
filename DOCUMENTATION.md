# Comprehensive Documentation: CMS Pages API Microservice

This document provides a comprehensive overview of the CMS Pages API Microservice project, including its architecture, API reference, deployment instructions, and contribution guidelines.

## 1. Introduction

The CMS Pages API Microservice is a high-performance, headless CMS designed to manage a large number of CMS pages, specifically as an extension for systems like Magento 2. It provides a RESTful API for full CRUD (Create, Read, Update, Delete) operations on CMS pages, backed by a PostgreSQL database.

The project includes a frontend application that serves as an interactive dashboard for API documentation and testing.

### Key Features

-   **RESTful API**: Full CRUD operations for CMS pages.
-   **Authentication**: Secure API with bearer token authentication.
-   **High-Performance**: Built with Express.js and optimized for large datasets (1M+ records) with efficient pagination and indexing.
-   **Database**: Uses PostgreSQL with Drizzle ORM for robust data management.
-   **Interactive Dashboard**: A React-based frontend for API documentation, testing, and monitoring.
-   **Containerized**: Docker-ready for easy deployment and scaling.

## 2. Architecture

The project follows a classic client-server architecture, with a separate frontend application and backend API.

```mermaid
graph TD;
    A[Client: React App] -->|HTTP Requests| B(Backend: Express.js API);
    B -->|SQL Queries| C(Database: PostgreSQL);
    B -->|Authentication| D{Bearer Token Check};
    B -->|Validation| E{Zod Schema Validation};
```

### Components

-   **Backend (`server/`)**: An Express.js application written in TypeScript. It handles all business logic, API endpoints, authentication, and database interactions.
-   **Frontend (`client/`)**: A React application built with Vite. It provides a user-friendly interface for interacting with and learning about the API.
-   **Shared (`shared/`)**: A directory containing code shared between the frontend and backend, primarily the Drizzle ORM schema and Zod validation schemas (`schema.ts`). This ensures consistency and type safety across the stack.
-   **Database**: A PostgreSQL database. The schema is defined in `shared/schema.ts` and managed via Drizzle Kit migrations.

## 3. Getting Started

This section guides you through setting up the project for local development.

### Prerequisites

-   Node.js v18+
-   Docker and Docker Compose (for database)
-   A `.env` file in the root directory (see configuration below)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd cms-pages-api-microservice
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up the database**:
    The easiest way to get a PostgreSQL database running is with Docker Compose. Create a `docker-compose.yml` file (if not already present) with a PostgreSQL service:
    ```yaml
    version: '3.8'
    services:
      postgres:
        image: postgres:15-alpine
        environment:
          POSTGRES_DB: cms_pages
          POSTGRES_USER: user
          POSTGRES_PASSWORD: password
        ports:
          - "5432:5432"
        volumes:
          - postgres_data:/var/lib/postgresql/data
    volumes:
      postgres_data:
    ```
    Then, start the database:
    ```bash
    docker-compose up -d
    ```

4.  **Configure environment variables**:
    Create a `.env` file in the root directory and add the following:
    ```env
    # API Authentication
    API_BEARER_TOKEN=your-secret-token

    # Database Connection
    DATABASE_URL="postgresql://user:password@localhost:5432/cms_pages"
    ```

5.  **Run database migrations**:
    ```bash
    npm run db:push
    ```

6.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5000`.

## 4. API Reference

The API provides endpoints for managing CMS pages. All endpoints are prefixed with `/api`.

**Authentication**: All endpoints under `/api/cms-pages` require a bearer token in the `Authorization` header.
`Authorization: Bearer <your-secret-token>`

---

### GET `/api/cms-pages`

Retrieves a paginated list of CMS pages.

**Query Parameters**:
-   `page` (number, optional, default: 1): The page number to retrieve.
-   `perPage` (number, optional, default: 15): The number of items per page.
-   `storeId` (number, optional): Filter pages by store ID.
-   `isActive` (boolean, optional): Filter pages by active status.

**Success Response (200 OK)**:
```json
{
  "data": [
    {
      "id": 1,
      "storeId": 1,
      "title": "About Us",
      "urlKey": "about-us",
      "isActive": true,
      ...
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "perPage": 15,
    "totalPages": 7
  }
}
```

---

### POST `/api/cms-pages`

Creates a new CMS page.

**Request Body**:
```json
{
  "storeId": 1,
  "title": "New Page",
  "urlKey": "new-page",
  "content": "<p>This is a new page.</p>",
  "isActive": true
}
```

**Success Response (201 Created)**:
```json
{
  "id": 2,
  "storeId": 1,
  "title": "New Page",
  ...
}
```

**Error Response (409 Conflict)**: If a page with the same `urlKey` already exists for the `storeId`.

---

### GET `/api/cms-pages/:id`

Retrieves a single CMS page by its ID.

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "storeId": 1,
  "title": "About Us",
  ...
}
```

**Error Response (404 Not Found)**: If the page with the specified ID does not exist.

---

### PUT `/api/cms-pages/:id`

Updates an existing CMS page.

**Request Body**: (all fields are optional)
```json
{
  "title": "Updated Page Title",
  "isActive": false
}
```

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "title": "Updated Page Title",
  "isActive": false,
  ...
}
```

---

### DELETE `/api/cms-pages/:id`

Deletes a CMS page.

**Success Response (204 No Content)**

---

### GET `/api/cms-pages/stats`

Retrieves statistics about the CMS pages.

**Success Response (200 OK)**:
```json
{
  "totalPages": 120,
  "activePages": 100,
  "inactivePages": 20
}
```

---

### GET `/api/health`

A public endpoint to check the health of the service, including the database connection.

**Success Response (200 OK)**:
```json
{
  "status": "healthy",
  "timestamp": "2023-10-27T10:00:00.000Z",
  "service": "CMS Pages API",
  "version": "1.0.0"
}
```

## 5. Database Schema

The database schema is defined using Drizzle ORM in `shared/schema.ts`.

**`cms_pages` Table**:
| Column      | Type      | Constraints              | Description                               |
|-------------|-----------|--------------------------|-------------------------------------------|
| `id`        | bigserial | Primary Key              | Unique identifier for the page.           |
| `storeId`   | integer   | Not Null                 | ID of the store the page belongs to.      |
| `title`     | text      | Not Null                 | The title of the page.                    |
| `layout`    | text      | Default: '1column'       | The layout of the page.                   |
| `urlKey`    | text      | Not Null                 | URL-friendly key for the page.            |
| `content`   | text      |                          | The HTML content of the page.             |
| `isActive`  | boolean   | Not Null, Default: true  | Whether the page is active or not.        |
| `createdAt` | timestamp | Not Null, Default: NOW() | Timestamp of page creation.               |
| `updatedAt` | timestamp | Not Null, Default: NOW() | Timestamp of last page update.            |

**Indexes**:
-   `idx_store_active`: On `(storeId, isActive)` for efficient filtering.
-   `idx_store_url`: Unique index on `(storeId, urlKey)` to prevent duplicate URLs per store.
-   `idx_created_at`: On `createdAt` for time-based sorting.
-   `idx_title`: On `title` for searching by title.

## 6. Deployment

The application is designed to be deployed using Docker.

### Building the Docker Image
```bash
docker build -t cms-pages-api .
```

### Running the Container
You can run the container using environment variables directly or by mounting an environment file.

```bash
docker run -d \
  --name cms-pages-api \
  -p 5000:5000 \
  -e API_BEARER_TOKEN=your-super-secret-token \
  -e DATABASE_URL="postgresql://user:password@db-host:5432/cms_pages" \
  cms-pages-api
```

### Docker Compose
For a full stack deployment (application + database), you can use the `docker-compose.yml` file provided in the `README.md`.

## 7. Contributing

We welcome contributions to the project! Please follow these guidelines:

-   **Branching**: Create a new branch for each feature or bug fix (`feature/my-new-feature` or `fix/issue-123`).
-   **Commits**: Write clear and concise commit messages.
-   **Code Style**: Follow the existing code style. The project is set up with Prettier and ESLint (to be configured).
-   **Pull Requests**: Open a pull request with a detailed description of the changes.

---

*This document was generated by Jules, an AI software engineer.*
