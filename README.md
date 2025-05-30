# CMS Pages API Microservice

A high-performance headless CMS API microservice built with Express.js and PostgreSQL, designed to extend Magento 2's CMS pages system for handling 1M+ records with optimal performance.

## 🚀 Features

- **RESTful API** with full CRUD operations for CMS pages
- **Bearer token authentication** via environment variable validation
- **PostgreSQL database** with optimized schema and indexing
- **High-performance pagination** designed for large datasets
- **Comprehensive error handling** and validation
- **Interactive documentation** and API testing interface
- **Swagger/OpenAPI** documentation
- **Docker-ready** self-contained application

## 📋 Requirements

- Node.js 18+ 
- PostgreSQL 12+
- Environment variables for configuration

## 🛠 Installation & Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd cms-pages-api
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

#### Required Configuration

```bash
# Bearer token for API authentication
API_BEARER_TOKEN=your_secret_token_here

# Database Configuration (Option 1: Connection String)
DATABASE_URL=postgresql://username:password@host:port/database

# Database Configuration (Option 2: Individual Parameters)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cms_pages
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false

# Optional Database Pool Settings
DB_MAX_CONNECTIONS=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000
```

#### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `API_BEARER_TOKEN` | Bearer token for API authentication | `default-token` | Yes |
| `DATABASE_URL` | Complete PostgreSQL connection string | - | Yes (if individual params not set) |
| `DB_HOST` | Database host | `localhost` | No |
| `DB_PORT` | Database port | `5432` | No |
| `DB_NAME` | Database name | `cms_pages` | No |
| `DB_USER` | Database username | `postgres` | No |
| `DB_PASSWORD` | Database password | - | Yes |
| `DB_SSL` | Enable SSL connection | `false` | No |
| `DB_MAX_CONNECTIONS` | Maximum connection pool size | `20` | No |
| `DB_IDLE_TIMEOUT` | Connection idle timeout (ms) | `30000` | No |
| `DB_CONNECTION_TIMEOUT` | Connection timeout (ms) | `2000` | No |

### 3. Database Setup

```bash
# Run database migrations
npm run db:push
```

### 4. Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t cms-pages-api .
```

### Run with Docker

#### Option 1: Using DATABASE_URL

```bash
docker run -d \
  --name cms-pages-api \
  -p 5000:5000 \
  -e API_BEARER_TOKEN=your_secret_token_here \
  -e DATABASE_URL=postgresql://username:password@host:port/database \
  cms-pages-api
```

#### Option 2: Using Individual Database Parameters

```bash
docker run -d \
  --name cms-pages-api \
  -p 5000:5000 \
  -e API_BEARER_TOKEN=your_secret_token_here \
  -e DB_HOST=your_db_host \
  -e DB_PORT=5432 \
  -e DB_NAME=cms_pages \
  -e DB_USER=postgres \
  -e DB_PASSWORD=your_db_password \
  -e DB_SSL=false \
  cms-pages-api
```

#### Option 3: Using Environment File

Create a `.env.production` file:
```bash
API_BEARER_TOKEN=your_secret_token_here
DATABASE_URL=postgresql://username:password@host:port/database
DB_MAX_CONNECTIONS=50
DB_IDLE_TIMEOUT=30000
```

Run with environment file:
```bash
docker run -d \
  --name cms-pages-api \
  -p 5000:5000 \
  --env-file .env.production \
  cms-pages-api
```

### Docker Compose (Recommended)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  cms-api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - API_BEARER_TOKEN=your_secret_token_here
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=cms_pages
      - DB_USER=postgres
      - DB_PASSWORD=postgres123
      - DB_MAX_CONNECTIONS=50
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=cms_pages
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_data:
```

Start with Docker Compose:
```bash
docker-compose up -d
```

### Health Check

The container includes a health check that monitors the `/api/health` endpoint. Check container health:

```bash
docker ps
# Look for "healthy" status

# Or check health directly
curl http://localhost:5000/api/health
```

## API Endpoints

- **GET /api/cms-pages**: Retrieve a paginated list of CMS pages with optional filtering.
- **POST /api/cms-pages**: Create a new CMS page or multiple pages. Accepts a single page object or an array of page objects.
- **GET /api/cms-pages/:id**: Retrieve a specific CMS page by ID.
- **PUT /api/cms-pages/:id**: Update an existing CMS page by ID.
- **DELETE /api/cms-pages/:id**: Delete a CMS page by ID.
- **GET /api/cms-pages/stats**: Get statistics about CMS pages.
- **GET /api/health**: Health check endpoint.
- **GET /postman-collection.json**: Download the Postman collection for API testing.
