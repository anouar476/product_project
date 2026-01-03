import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'microservices',
  clientId: 'microservices-client',
});

export default keycloak;
