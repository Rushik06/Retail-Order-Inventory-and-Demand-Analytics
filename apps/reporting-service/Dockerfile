# BASE
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm turbo

# PRUNER
FROM base AS pruner
COPY . .
RUN turbo prune reporting-service --docker

# INSTALLER
FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --ignore-scripts

# BUILDER
FROM base AS builder
COPY --from=installer /app .
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=reporting-service

# DEPLOYER
FROM base AS deployer
WORKDIR /app
COPY --from=builder /app .
RUN pnpm deploy --filter=reporting-service --prod /app/deployed

# RUNNER
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=deployer /app/deployed .
ENV NODE_ENV=production
EXPOSE 3003
CMD ["node", "dist/server.js"]
