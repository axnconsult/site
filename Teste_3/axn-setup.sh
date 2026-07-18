#!/bin/bash
set -e

echo ""
echo "=== AXN — Configuracao da Infraestrutura ==="
echo ""

DOMAIN="axnconsult.com"
SERVER_IP="187.77.239.134"
EMAIL="axnconsult.contato@gmail.com"
POSTGRES_PASS="48e13e8ffad6e5249190ec1aa0438450"
N8N_KEY="8bcfedcd8675e7855c59d1863c4ee94b"
N8N_TOKEN="bec624e676c5eb482c20d893e36ad895"
EVO_KEY="evo_api_863ffa80e3c558c442d15f6d"
CHATWOOT_SECRET=$(openssl rand -hex 32)

# ── 1. Sistema ────────────────────────────────────
echo "[1/9] Atualizando sistema e configurando firewall..."
apt-get update -y && apt-get upgrade -y
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw --force enable

# ── 2. Docker ─────────────────────────────────────
echo "[2/9] Instalando Docker..."
curl -fsSL https://get.docker.com | sh

# Fix: Docker 29+ requer DOCKER_MIN_API_VERSION para compatibilidade com Traefik
mkdir -p /etc/systemd/system/docker.service.d
cat > /etc/systemd/system/docker.service.d/override.conf << 'DOCKER_OVERRIDE'
[Service]
Environment="DOCKER_MIN_API_VERSION=1.24"
DOCKER_OVERRIDE
systemctl daemon-reload
systemctl restart docker
sleep 5

# ── 3. Swarm e rede ───────────────────────────────
echo "[3/9] Inicializando Docker Swarm..."
docker swarm init --advertise-addr "$SERVER_IP"
docker network create --driver=overlay --attachable network_swarm_public
echo "[3/9] Criando volumes..."
docker volume create volume_swarm_certificates
docker volume create portainer_data
docker volume create postgres_data
docker volume create redis_n8n_data
docker volume create evolution_instances
docker volume create redis_chatwoot_data

# ── 4. Traefik ────────────────────────────────────
echo "[4/9] Subindo Traefik..."
mkdir -p /opt/stacks/traefik
cat > /opt/stacks/traefik/stack.yml << 'TRAEFIK_STACK'
version: "3.7"
services:
  traefik:
    image: traefik:v3.3
    command:
      - "--api.dashboard=true"
      - "--providers.swarm.endpoint=unix:///var/run/docker.sock"
      - "--providers.swarm.exposedbydefault=false"
      - "--providers.swarm.network=network_swarm_public"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
      - "--entrypoints.web.http.redirections.entrypoint.permanent=true"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencryptresolver.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencryptresolver.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencryptresolver.acme.email=__EMAIL__"
      - "--certificatesresolvers.letsencryptresolver.acme.storage=/etc/traefik/letsencrypt/acme.json"
      - "--log.level=INFO"
      - "--accesslog=true"
    deploy:
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.http.middlewares.redirect-https.redirectscheme.scheme=https"
        - "traefik.http.middlewares.redirect-https.redirectscheme.permanent=true"
        - "traefik.http.routers.http-catchall.rule=hostregexp(`{host:.+}`)"
        - "traefik.http.routers.http-catchall.entrypoints=web"
        - "traefik.http.routers.http-catchall.middlewares=redirect-https@swarm"
        - "traefik.http.routers.http-catchall.priority=1"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "vol_certificates:/etc/traefik/letsencrypt"
    networks:
      - network_swarm_public
    ports:
      - target: 80
        published: 80
        mode: host
      - target: 443
        published: 443
        mode: host
volumes:
  vol_certificates:
    external: true
    name: volume_swarm_certificates
networks:
  network_swarm_public:
    external: true
    name: network_swarm_public
TRAEFIK_STACK
sed -i "s|__EMAIL__|$EMAIL|g" /opt/stacks/traefik/stack.yml
docker stack deploy -c /opt/stacks/traefik/stack.yml traefik
echo -n "Aguardando Traefik"
TRIES=0; until docker service ls --filter name=traefik_traefik --format '{{.Replicas}}' | grep -q "1/1" || [ $TRIES -ge 20 ]; do sleep 3; TRIES=$((TRIES+1)); printf "."; done; echo " OK"

# ── 5. Postgres ───────────────────────────────────
echo "[5/9] Subindo Postgres..."
mkdir -p /opt/stacks/postgres
cat > /opt/stacks/postgres/stack.yml << 'POSTGRES_STACK'
version: "3.7"
services:
  axon_postgres:
    image: pgvector/pgvector:pg16
    networks:
      - network_swarm_public
    command:
      - postgres
      - --max_connections=200
      - --port=5432
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: __POSTGRES_PASS__
      POSTGRES_INITDB_ARGS: "--auth-host=scram-sha-256"
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
volumes:
  postgres_data:
    external: true
    name: postgres_data
networks:
  network_swarm_public:
    external: true
    name: network_swarm_public
POSTGRES_STACK
sed -i "s|__POSTGRES_PASS__|$POSTGRES_PASS|g" /opt/stacks/postgres/stack.yml
docker stack deploy -c /opt/stacks/postgres/stack.yml axon_postgres
echo -n "Aguardando Postgres"
sleep 10
TRIES=0
until [ $TRIES -ge 20 ]; do
  PG=$(docker ps -qf name=axon_postgres_axon_postgres 2>/dev/null)
  [ -n "$PG" ] && docker exec "$PG" pg_isready -U postgres 2>/dev/null && break
  sleep 3; TRIES=$((TRIES+1)); printf "."
done; echo " OK"
PG=$(docker ps -qf name=axon_postgres_axon_postgres)
docker exec -t "$PG" psql -U postgres -c "CREATE DATABASE axon_ops;" || true
docker exec -t "$PG" psql -U postgres -c "CREATE USER axon_app WITH ENCRYPTED PASSWORD '$POSTGRES_PASS';" || true
docker exec -t "$PG" psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE axon_ops TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -d axon_ops -c "GRANT ALL ON SCHEMA public TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -c "CREATE DATABASE n8n;" || true
docker exec -t "$PG" psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE n8n TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -d n8n -c "GRANT ALL ON SCHEMA public TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -c "CREATE DATABASE evolution;" || true
docker exec -t "$PG" psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE evolution TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -d evolution -c "GRANT ALL ON SCHEMA public TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -c "CREATE DATABASE chatwoot;" || true
docker exec -t "$PG" psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE chatwoot TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -d chatwoot -c "GRANT ALL ON SCHEMA public TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -d chatwoot -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;" || true

# ── 7. n8n ────────────────────────────────────────
echo "[6/9] Subindo n8n (Redis + editor + webhook + worker + runners)..."

mkdir -p /opt/stacks/redis-n8n
cat > /opt/stacks/redis-n8n/stack.yml << 'REDIS_N8N_STACK'
version: "3.7"
services:
  redis_n8n:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    networks:
      - network_swarm_public
    volumes:
      - redis_n8n_data:/data
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
volumes:
  redis_n8n_data:
    external: true
    name: redis_n8n_data
networks:
  network_swarm_public:
    external: true
    name: network_swarm_public
REDIS_N8N_STACK
docker stack deploy -c /opt/stacks/redis-n8n/stack.yml redis_n8n

mkdir -p /opt/stacks/n8n-editor
cat > /opt/stacks/n8n-editor/stack.yml << 'N8N_EDITOR_STACK'
version: "3.7"
services:
  n8n_editor:
    image: n8nio/n8n:2.16.1
    hostname: "{{.Service.Name}}.{{.Task.Slot}}"
    command: start
    networks:
      - network_swarm_public
    environment:
      - N8N_ENCRYPTION_KEY=__N8N_KEY__
      - NODE_ENV=production
      - N8N_METRICS=true
      - N8N_DIAGNOSTICS_ENABLED=false
      - N8N_PAYLOAD_SIZE_MAX=16
      - N8N_LOG_LEVEL=info
      - GENERIC_TIMEZONE=America/Sao_Paulo
      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
      - N8N_RUNNERS_ENABLED=true
      - N8N_RUNNERS_MODE=external
      - N8N_RUNNERS_BROKER_LISTEN_ADDRESS=0.0.0.0
      - N8N_RUNNERS_AUTH_TOKEN=__N8N_TOKEN__
      - N8N_NATIVE_PYTHON_RUNNER=true
      - OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS=true
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_HOST=axon_postgres_axon_postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_USER=axon_app
      - DB_POSTGRESDB_PASSWORD=__POSTGRES_PASS__
      - N8N_PORT=5678
      - N8N_HOST=workflows.__DOMAIN__
      - N8N_EDITOR_BASE_URL=https://workflows.__DOMAIN__/
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://webhooks.__DOMAIN__/
      - N8N_ENDPOINT_WEBHOOK=webhook
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis_n8n_redis_n8n
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_BULL_REDIS_DB=2
      - EXECUTIONS_TIMEOUT=3600
      - EXECUTIONS_TIMEOUT_MAX=7200
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=336
      - EXECUTIONS_DATA_PRUNE_MAX_COUNT=10000
      - EXECUTIONS_DATA_SAVE_ON_ERROR=all
      - EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
      - EXECUTIONS_DATA_SAVE_ON_PROGRESS=true
      - EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=true
      - NODE_FUNCTION_ALLOW_BUILTIN=*
      - NODE_FUNCTION_ALLOW_EXTERNAL=lodash
      - N8N_COMMUNITY_PACKAGES_ENABLED=true
      - N8N_REINSTALL_MISSING_PACKAGES=true
      - N8N_NODE_PATH=/home/node/.n8n/nodes
      - N8N_AI_ENABLED=false
      - N8N_ONBOARDING_FLOW_DISABLED=true
      - N8N_EMAIL_MODE=smtp
      - N8N_SMTP_HOST=smtp.mailersend.net
      - N8N_SMTP_PORT=587
      - N8N_SMTP_USER=MAILERSEND_SMTP_USER_AQUI
      - N8N_SMTP_PASS=MAILERSEND_SMTP_PASS_AQUI
      - N8N_SMTP_SENDER=contato@__DOMAIN__
      - N8N_SMTP_SSL=false
      - N8N_SECURE_COOKIE=false
      - N8N_BLOCK_ENV_ACCESS_IN_NODE=false
      - N8N_RESTRICT_FILE_ACCESS_TO=~/.n8n-files
      - N8N_DEFAULT_BINARY_DATA_MODE=default
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      labels:
        - traefik.enable=true
        - traefik.http.routers.n8n_editor.rule=Host(`workflows.__DOMAIN__`)
        - traefik.http.routers.n8n_editor.entrypoints=websecure
        - traefik.http.routers.n8n_editor.tls.certresolver=letsencryptresolver
        - traefik.http.routers.n8n_editor.service=n8n_editor
        - traefik.http.services.n8n_editor.loadbalancer.server.port=5678
        - traefik.http.services.n8n_editor.loadbalancer.passHostHeader=true
networks:
  network_swarm_public:
    name: network_swarm_public
    external: true
N8N_EDITOR_STACK
sed -i "s|__DOMAIN__|$DOMAIN|g" /opt/stacks/n8n-editor/stack.yml
sed -i "s|__N8N_KEY__|$N8N_KEY|g" /opt/stacks/n8n-editor/stack.yml
sed -i "s|__N8N_TOKEN__|$N8N_TOKEN|g" /opt/stacks/n8n-editor/stack.yml
sed -i "s|__POSTGRES_PASS__|$POSTGRES_PASS|g" /opt/stacks/n8n-editor/stack.yml
docker stack deploy -c /opt/stacks/n8n-editor/stack.yml n8n_editor
echo -n "Aguardando n8n editor (migrations)"
TRIES=0; until docker service ls --filter name=n8n_editor_n8n_editor --format '{{.Replicas}}' | grep -q "1/1" || [ $TRIES -ge 40 ]; do sleep 5; TRIES=$((TRIES+1)); printf "."; done; echo " OK"

mkdir -p /opt/stacks/n8n-webhook
cat > /opt/stacks/n8n-webhook/stack.yml << 'N8N_WEBHOOK_STACK'
version: "3.7"
services:
  n8n_webhook:
    image: n8nio/n8n:2.16.1
    hostname: "{{.Service.Name}}.{{.Task.Slot}}"
    command: webhook
    networks:
      - network_swarm_public
    environment:
      - N8N_ENCRYPTION_KEY=__N8N_KEY__
      - NODE_ENV=production
      - N8N_DIAGNOSTICS_ENABLED=false
      - N8N_PAYLOAD_SIZE_MAX=16
      - N8N_LOG_LEVEL=info
      - GENERIC_TIMEZONE=America/Sao_Paulo
      - N8N_RUNNERS_AUTH_TOKEN=__N8N_TOKEN__
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_HOST=axon_postgres_axon_postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_USER=axon_app
      - DB_POSTGRESDB_PASSWORD=__POSTGRES_PASS__
      - N8N_PORT=5678
      - N8N_HOST=workflows.__DOMAIN__
      - N8N_EDITOR_BASE_URL=https://workflows.__DOMAIN__/
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://webhooks.__DOMAIN__/
      - N8N_ENDPOINT_WEBHOOK=webhook
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis_n8n_redis_n8n
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_BULL_REDIS_DB=2
    deploy:
      mode: replicated
      replicas: 3
      placement:
        constraints:
          - node.role == manager
      labels:
        - traefik.enable=true
        - traefik.http.routers.n8n_webhook.rule=Host(`webhooks.__DOMAIN__`)
        - traefik.http.routers.n8n_webhook.entrypoints=websecure
        - traefik.http.routers.n8n_webhook.tls.certresolver=letsencryptresolver
        - traefik.http.routers.n8n_webhook.service=n8n_webhook
        - traefik.http.services.n8n_webhook.loadbalancer.server.port=5678
        - traefik.http.services.n8n_webhook.loadbalancer.passHostHeader=true
networks:
  network_swarm_public:
    name: network_swarm_public
    external: true
N8N_WEBHOOK_STACK
sed -i "s|__DOMAIN__|$DOMAIN|g" /opt/stacks/n8n-webhook/stack.yml
sed -i "s|__N8N_KEY__|$N8N_KEY|g" /opt/stacks/n8n-webhook/stack.yml
sed -i "s|__N8N_TOKEN__|$N8N_TOKEN|g" /opt/stacks/n8n-webhook/stack.yml
sed -i "s|__POSTGRES_PASS__|$POSTGRES_PASS|g" /opt/stacks/n8n-webhook/stack.yml
docker stack deploy -c /opt/stacks/n8n-webhook/stack.yml n8n_webhook

mkdir -p /opt/stacks/n8n-worker
cat > /opt/stacks/n8n-worker/stack.yml << 'N8N_WORKER_STACK'
version: "3.7"
services:
  n8n_worker:
    image: n8nio/n8n:2.16.1
    hostname: "{{.Service.Name}}.{{.Task.Slot}}"
    command: worker --concurrency=10
    networks:
      - network_swarm_public
    environment:
      - N8N_ENCRYPTION_KEY=__N8N_KEY__
      - NODE_ENV=production
      - N8N_DIAGNOSTICS_ENABLED=false
      - N8N_PAYLOAD_SIZE_MAX=16
      - N8N_LOG_LEVEL=info
      - GENERIC_TIMEZONE=America/Sao_Paulo
      - N8N_RUNNERS_ENABLED=true
      - N8N_RUNNERS_MODE=external
      - N8N_RUNNERS_BROKER_LISTEN_ADDRESS=0.0.0.0
      - N8N_RUNNERS_AUTH_TOKEN=__N8N_TOKEN__
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_HOST=axon_postgres_axon_postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_USER=axon_app
      - DB_POSTGRESDB_PASSWORD=__POSTGRES_PASS__
      - N8N_PORT=5678
      - N8N_HOST=workflows.__DOMAIN__
      - N8N_EDITOR_BASE_URL=https://workflows.__DOMAIN__/
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://webhooks.__DOMAIN__/
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis_n8n_redis_n8n
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_BULL_REDIS_DB=2
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
networks:
  network_swarm_public:
    name: network_swarm_public
    external: true
N8N_WORKER_STACK
sed -i "s|__DOMAIN__|$DOMAIN|g" /opt/stacks/n8n-worker/stack.yml
sed -i "s|__N8N_KEY__|$N8N_KEY|g" /opt/stacks/n8n-worker/stack.yml
sed -i "s|__N8N_TOKEN__|$N8N_TOKEN|g" /opt/stacks/n8n-worker/stack.yml
sed -i "s|__POSTGRES_PASS__|$POSTGRES_PASS|g" /opt/stacks/n8n-worker/stack.yml
docker stack deploy -c /opt/stacks/n8n-worker/stack.yml n8n_worker

mkdir -p /opt/stacks/n8n-runners
cat > /opt/stacks/n8n-runners/stack.yml << 'N8N_RUNNERS_STACK'
version: "3.7"
services:
  n8n_runners:
    image: n8nio/runners:2.16.1
    hostname: "{{.Service.Name}}.{{.Task.Slot}}"
    command: ["javascript", "python"]
    networks:
      - network_swarm_public
    environment:
      N8N_RUNNERS_TASK_BROKER_URI: http://n8n_worker_n8n_worker:5679
      N8N_RUNNERS_AUTH_TOKEN: __N8N_TOKEN__
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
networks:
  network_swarm_public:
    external: true
    name: network_swarm_public
N8N_RUNNERS_STACK
sed -i "s|__N8N_TOKEN__|$N8N_TOKEN|g" /opt/stacks/n8n-runners/stack.yml
docker stack deploy -c /opt/stacks/n8n-runners/stack.yml n8n_runners

# ── 8. Chatwoot ───────────────────────────────────
echo "[7/9] Subindo Chatwoot (Redis + web + worker)..."
mkdir -p /opt/stacks/chatwoot
cat > /opt/stacks/chatwoot/stack.yml << 'CHATWOOT_STACK'
version: "3.7"
services:
  redis-chatwoot:
    image: redis:7-alpine
    volumes:
      - redis_chatwoot_data:/data
    networks:
      - network_swarm_public
    deploy:
      mode: replicated
      replicas: 1
  chatwoot-web:
    image: chatwoot/chatwoot:v3.11.0
    environment:
      - SECRET_KEY_BASE=__CHATWOOT_SECRET__
      - FRONTEND_URL=https://chat.__DOMAIN__
      - DEFAULT_LOCALE=pt_BR
      - RAILS_ENV=production
      - RAILS_LOG_TO_STDOUT=true
      - REDIS_URL=redis://redis-chatwoot:6379
      - POSTGRES_HOST=axon_postgres_axon_postgres
      - POSTGRES_PORT=5432
      - POSTGRES_DATABASE=chatwoot
      - POSTGRES_USERNAME=axon_app
      - POSTGRES_PASSWORD=__POSTGRES_PASS__
    command: sh -c "bundle exec rails db:chatwoot_prepare && bundle exec rails s -p 3000 -b 0.0.0.0"
    networks:
      - network_swarm_public
    deploy:
      mode: replicated
      replicas: 1
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.chatwoot.rule=Host(`chat.__DOMAIN__`)"
        - "traefik.http.routers.chatwoot.entrypoints=websecure"
        - "traefik.http.routers.chatwoot.tls=true"
        - "traefik.http.routers.chatwoot.tls.certresolver=letsencryptresolver"
        - "traefik.http.services.chatwoot.loadbalancer.server.port=3000"
  chatwoot-worker:
    image: chatwoot/chatwoot:v3.11.0
    environment:
      - SECRET_KEY_BASE=__CHATWOOT_SECRET__
      - FRONTEND_URL=https://chat.__DOMAIN__
      - RAILS_ENV=production
      - REDIS_URL=redis://redis-chatwoot:6379
      - POSTGRES_HOST=axon_postgres_axon_postgres
      - POSTGRES_PORT=5432
      - POSTGRES_DATABASE=chatwoot
      - POSTGRES_USERNAME=axon_app
      - POSTGRES_PASSWORD=__POSTGRES_PASS__
    command: bundle exec sidekiq -C config/sidekiq.yml
    networks:
      - network_swarm_public
    deploy:
      mode: replicated
      replicas: 1
networks:
  network_swarm_public:
    external: true
    name: network_swarm_public
volumes:
  redis_chatwoot_data:
    external: true
    name: redis_chatwoot_data
CHATWOOT_STACK
sed -i "s|__DOMAIN__|$DOMAIN|g" /opt/stacks/chatwoot/stack.yml
sed -i "s|__CHATWOOT_SECRET__|$CHATWOOT_SECRET|g" /opt/stacks/chatwoot/stack.yml
sed -i "s|__POSTGRES_PASS__|$POSTGRES_PASS|g" /opt/stacks/chatwoot/stack.yml
docker stack deploy -c /opt/stacks/chatwoot/stack.yml chatwoot
echo -n "Aguardando Chatwoot"
TRIES=0; until docker service ls --filter name=chatwoot_chatwoot-web --format '{{.Replicas}}' | grep -q "1/1" || [ $TRIES -ge 40 ]; do sleep 5; TRIES=$((TRIES+1)); printf "."; done; echo " OK"

# ── 9. Evolution API ──────────────────────────────
echo "[8/9] Subindo Evolution API..."
mkdir -p /opt/stacks/evolution
cat > /opt/stacks/evolution/stack.yml << 'EVOLUTION_STACK'
version: "3.7"
services:
  evolution:
    image: evoapicloud/evolution-api:v2.3.7
    environment:
      - SERVER_URL=https://evo.__DOMAIN__
      - AUTHENTICATION_API_KEY=__EVO_KEY__
      - DATABASE_ENABLED=true
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=postgresql://axon_app:__POSTGRES_PASS__@axon_postgres_axon_postgres:5432/evolution
      - DATABASE_URL=postgresql://axon_app:__POSTGRES_PASS__@axon_postgres_axon_postgres:5432/evolution
      - REDIS_ENABLED=true
      - REDIS_URI=redis://chatwoot_redis-chatwoot:6379
      - CACHE_REDIS_ENABLED=true
      - CACHE_REDIS_URI=redis://chatwoot_redis-chatwoot:6379
      - CACHE_REDIS_PREFIX_KEY=evolution
      - CACHE_REDIS_SAVE_INSTANCES=true
      - CACHE_LOCAL_ENABLED=false
      - CHATWOOT_ENABLED=true
      - CHATWOOT_MESSAGE_READ=true
      - LOG_LEVEL=ERROR
      - DEL_INSTANCE=false
    volumes:
      - evolution_instances:/evolution/instances
    networks:
      - network_swarm_public
    deploy:
      mode: replicated
      replicas: 1
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.evolution.rule=Host(`evo.__DOMAIN__`)"
        - "traefik.http.routers.evolution.entrypoints=websecure"
        - "traefik.http.routers.evolution.tls=true"
        - "traefik.http.routers.evolution.tls.certresolver=letsencryptresolver"
        - "traefik.http.routers.evolution.middlewares=evolution-ws"
        - "traefik.http.services.evolution.loadbalancer.server.port=8080"
        - "traefik.http.middlewares.evolution-ws.headers.customrequestheaders.Upgrade=websocket"
        - "traefik.http.middlewares.evolution-ws.headers.customrequestheaders.Connection=Upgrade"
networks:
  network_swarm_public:
    external: true
    name: network_swarm_public
volumes:
  evolution_instances:
    external: true
    name: evolution_instances
EVOLUTION_STACK
sed -i "s|__DOMAIN__|$DOMAIN|g" /opt/stacks/evolution/stack.yml
sed -i "s|__EVO_KEY__|$EVO_KEY|g" /opt/stacks/evolution/stack.yml
sed -i "s|__POSTGRES_PASS__|$POSTGRES_PASS|g" /opt/stacks/evolution/stack.yml
docker stack deploy -c /opt/stacks/evolution/stack.yml evolution
echo -n "Aguardando Evolution"
TRIES=0; until docker service ls --filter name=evolution_evolution --format '{{.Replicas}}' | grep -q "1/1" || [ $TRIES -ge 20 ]; do sleep 3; TRIES=$((TRIES+1)); printf "."; done; echo " OK"

# ── 9. Portainer ──────────────────────────────────
echo "[9/9] Subindo Portainer..."
mkdir -p /opt/stacks/portainer
cat > /opt/stacks/portainer/stack.yml << 'PORTAINER_STACK'
version: "3.7"
services:
  agent:
    image: portainer/agent:sts
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/volumes:/var/lib/docker/volumes
    networks:
      - network_swarm_public
    deploy:
      mode: global
      placement:
        constraints:
          - node.platform.os == linux
  portainer:
    image: portainer/portainer-ce:sts
    command: -H tcp://tasks.agent:9001 --tlsskipverify --no-setup-token
    volumes:
      - portainer_data:/data
    networks:
      - network_swarm_public
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.portainer.rule=Host(`painel.__DOMAIN__`)"
        - "traefik.http.routers.portainer.entrypoints=websecure"
        - "traefik.http.routers.portainer.tls.certresolver=letsencryptresolver"
        - "traefik.http.routers.portainer.service=portainer"
        - "traefik.http.services.portainer.loadbalancer.server.port=9000"
networks:
  network_swarm_public:
    external: true
    attachable: true
    name: network_swarm_public
volumes:
  portainer_data:
    external: true
    name: portainer_data
PORTAINER_STACK
sed -i "s|__DOMAIN__|$DOMAIN|g" /opt/stacks/portainer/stack.yml
docker stack deploy -c /opt/stacks/portainer/stack.yml portainer
echo -n "Aguardando Portainer"
TRIES=0; until docker service ls --filter name=portainer_portainer --format '{{.Replicas}}' | grep -q "1/1" || [ $TRIES -ge 20 ]; do sleep 3; TRIES=$((TRIES+1)); printf "."; done; echo " OK"

echo ""
echo "============================================"
echo "  Infraestrutura no ar!"
echo ""
echo "  Portainer  : https://painel.$DOMAIN"
echo "  n8n        : https://workflows.$DOMAIN"
echo "  Chatwoot   : https://chat.$DOMAIN"
echo "  Evolution  : https://evo.$DOMAIN/manager"
echo ""
echo "  Chave Evolution API : $EVO_KEY"
echo "  (anote no documento de infra do modulo 3)"
echo "============================================"
echo ""
echo "Proximo passo: abra https://painel.$DOMAIN e crie o usuario admin."
echo "  Se aparecer timeout: docker service update --force portainer_portainer"
