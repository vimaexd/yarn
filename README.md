# Yarn
Source for my discord bot named Yarn.

*yes we use the yarn package manager*

## How to run (Docker)
```yaml
# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

| Run with the `--build` flag when switching between environments|