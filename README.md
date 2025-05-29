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
