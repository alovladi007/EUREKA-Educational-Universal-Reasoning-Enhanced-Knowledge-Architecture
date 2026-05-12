# Port Map

Single source of truth. Generated from `eureka/docker-compose.yml` — keep in sync.

## Infrastructure
| Service | Host → Container | URL |
|---|---|---|
| Postgres + pgvector | 5434 → 5432 | `postgresql://eureka:eureka_dev_password@localhost:5434/eureka` |
| Redis | 6381 → 6379 | `redis://localhost:6381` |
| MinIO (S3 API) | 9004 → 9000 | <http://localhost:9004> |
| MinIO console | 9005 → 9001 | <http://localhost:9005> |
| OpenSearch | 9200 → 9200 | <http://localhost:9200> *(profile: full)* |
| Kafka | 9092 → 9092 | `localhost:9092` *(profile: full)* |
| Neo4j | 7474 → 7474 | <http://localhost:7474> *(profile: full)* |
| Qdrant | 6333 → 6333 | <http://localhost:6333> *(profile: full)* |

## Frontends
| Service | Port | URL |
|---|---|---|
| web (learner) | 3000 | <http://localhost:3000> |
| admin | 3001 | <http://localhost:3001> |

## Core services
| Service | Port |
|---|---|
| api-core (gateway) | 8000 |
| tutor-llm | 8001 |
| assess | 8002 |
| adaptive | 8003 |
| content | 8004 |
| analytics | 8006 |

## Academic tiers
| Service | Port |
|---|---|
| tier-hs | 8010 |
| tier-ug | 8011 |
| tier-grad | 8012 |

## Professional schools
| Service | Port |
|---|---|
| pro-law | 8021 |
| pro-mba | 8022 |
| pro-eng | 8023 |
| pro-med | 8025 |
| medical-school (NestJS) | 8030 |

## Horizontal / Phase 2
| Service | Port |
|---|---|
| pedagogy | 8040 |
| marketplace | 8050 |
| ai-research | 8060 |
| xr-labs | 8070 |
| ethics-security | 8080 |
| data-fabric | 8090 |
| institutions | 8100 |
| futures | 8110 |
| notebook | 8120 |
| test-prep | 8200 |
