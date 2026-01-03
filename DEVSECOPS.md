# DevSecOps Implementation Guide

## Security Scanning Tools

### 1. SonarQube (Static Code Analysis)

Run SonarQube locally:
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
```

Scan product-service:
```bash
cd product-service
mvn sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=admin \
  -Dsonar.password=admin
```

Scan order-service:
```bash
cd order-service
mvn sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=admin \
  -Dsonar.password=admin
```

### 2. OWASP Dependency Check

Add to pom.xml:
```xml
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <version>8.4.0</version>
    <executions>
        <execution>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

Run check:
```bash
mvn dependency-check:check
```

### 3. Trivy (Docker Image Scanning)

Install Trivy:
```bash
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
```

Scan images:
```bash
docker-compose build
trivy image product-service:latest
trivy image order-service:latest
trivy image api-gateway:latest
trivy image frontend:latest
```

## CI/CD Pipeline Example

Create .github/workflows/main.yml:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Set up JDK 17
        uses: actions/setup-java@v2
        with:
          java-version: '17'

      - name: Build with Maven
        run: |
          cd product-service && mvn clean package
          cd ../order-service && mvn clean package

      - name: Run OWASP Dependency Check
        run: |
          cd product-service && mvn dependency-check:check
          cd ../order-service && mvn dependency-check:check

      - name: Build Docker Images
        run: docker-compose build

      - name: Scan with Trivy
        run: |
          trivy image product-service:latest
          trivy image order-service:latest
```

## Security Checklist

- [x] JWT authentication implemented
- [x] Role-based access control (RBAC)
- [x] Separate databases per service
- [x] API Gateway as single entry point
- [x] Token propagation between services
- [x] CORS configuration
- [x] Environment variables for sensitive data
- [ ] HTTPS/TLS encryption (production)
- [ ] Rate limiting (production)
- [ ] API versioning (production)

## Logging Configuration

Add to application.properties:
```properties
logging.level.org.springframework.security=DEBUG
logging.level.com.project=INFO
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
```

## Monitoring

Use Spring Boot Actuator:

Add to pom.xml:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Add to application.properties:
```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

## Security Best Practices Applied

1. No hardcoded credentials
2. Environment variables for config
3. Separate databases per service
4. JWT token expiration
5. Role-based authorization
6. Input validation
7. Error handling without sensitive info exposure
8. CORS properly configured
9. Dependencies kept updated
10. Docker images from official sources
