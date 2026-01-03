# Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   React Frontend                             │
│              (Keycloak Integration)                          │
│                   Port: 3000                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP + JWT
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   API Gateway                                │
│            (Spring Cloud Gateway)                            │
│      JWT Validation + Request Routing                        │
│                   Port: 8000                                 │
└──────────────┬─────────────────────┬────────────────────────┘
               │                     │
       ┌───────▼──────┐      ┌──────▼────────┐
       │              │      │               │
┌──────▼───────┐  ┌──▼──────▼────┐  ┌───────▼──────┐
│   Product    │  │   Keycloak    │  │    Order     │
│   Service    │  │  Auth Server  │  │   Service    │
│  Port: 8081  │  │  Port: 8080   │  │  Port: 8082  │
└──────┬───────┘  └───────────────┘  └──────┬───────┘
       │                                     │
       │                                     │
       │          REST API (JWT)             │
       │◄────────────────────────────────────┘
       │
┌──────▼───────┐                      ┌──────▼───────┐
│  PostgreSQL  │                      │  PostgreSQL  │
│  Product DB  │                      │   Order DB   │
│  Port: 5432  │                      │  Port: 5433  │
└──────────────┘                      └──────────────┘
```

## Component Responsibilities

### Frontend (React)
- User interface
- Keycloak authentication integration
- JWT token management
- Role-based UI rendering
- API calls to Gateway only

### API Gateway
- Single entry point
- JWT token validation
- Request routing to microservices
- CORS configuration
- No business logic

### Product Service
- Product CRUD operations
- Stock management
- Database: productdb
- Endpoints secured by role

### Order Service
- Order creation and management
- Stock verification via Product Service
- Inter-service communication with JWT
- Database: orderdb

### Keycloak
- OAuth2/OpenID Connect server
- User authentication
- JWT token generation
- Role management (ADMIN, CLIENT)

## Security Flow

1. User logs in via Frontend → Keycloak
2. Keycloak returns JWT token
3. Frontend stores token
4. Frontend sends requests to API Gateway with JWT
5. API Gateway validates JWT with Keycloak
6. Gateway forwards request to microservice with JWT
7. Microservice validates JWT and checks roles
8. Response flows back through Gateway to Frontend

## Data Flow - Create Order

1. Client sends order request to Frontend
2. Frontend sends POST /api/orders to Gateway (with JWT)
3. Gateway validates JWT and routes to Order Service
4. Order Service validates JWT and extracts user info
5. Order Service calls Product Service to check stock
6. Product Service validates stock availability
7. Order Service creates order and reduces stock
8. Response returns through Gateway to Frontend

## Database Isolation

Each microservice has its own database:
- Product Service → productdb
- Order Service → orderdb
- Keycloak → keycloak
- No shared databases between services
