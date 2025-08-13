# CMS Pages API Microservice

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance headless CMS API microservice built with Express.js and PostgreSQL, designed to extend Magento 2's CMS pages system for handling 1M+ records with optimal performance.

> **For detailed information about the architecture, API reference, deployment, and contribution guidelines, please see the [Comprehensive Documentation](DOCUMENTATION.md).**

## ✨ Features

-   **RESTful API**: Full CRUD operations for CMS pages.
-   **Authentication**: Secure API with bearer token authentication.
-   **High-Performance**: Optimized for large datasets with efficient pagination and indexing.
-   **Interactive Dashboard**: A React-based frontend for API documentation, testing, and monitoring.
-   **Containerized**: Docker-ready for easy deployment.

## 🚀 Quick Start

This guide will get you up and running in a few minutes.

### Prerequisites

-   Node.js v18+
-   Docker and Docker Compose

### Steps

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd cms-pages-api-microservice
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the database**:
    This project includes a `docker-compose.yml` file to easily start a PostgreSQL database.
    ```bash
    docker-compose up -d
    ```

4.  **Configure environment variables**:
    Create a `.env` file in the root directory. You can copy the example:
    ```bash
    cp .env.example .env
    ```
    *Note: If `.env.example` does not exist, create a `.env` file with the following content:*
    ```env
    # API Authentication
    API_BEARER_TOKEN=your-secret-token

    # Database Connection
    DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/cms_pages"
    ```

5.  **Run database migrations**:
    ```bash
    npm run db:push
    ```

6.  **Start the development server**:
    ```bash
    npm run dev
    ```

The application is now running and accessible at `http://localhost:5000`.

## 🐳 Deployment

The application is designed to be deployed using Docker. For detailed instructions on building the Docker image and running it in a production environment, please refer to the [Deployment section in the documentation](DOCUMENTATION.md#6-deployment).

## 🤝 Contributing

Contributions are welcome! Please see the [Contributing Guidelines](DOCUMENTATION.md#7-contributing) for more details.
