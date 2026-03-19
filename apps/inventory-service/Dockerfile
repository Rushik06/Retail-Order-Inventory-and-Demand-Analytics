# BASE
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm turbo

# PRUNER
FROM base AS pruner
COPY . .
RUN turbo prune inventory-service --docker

# INSTALLER
FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --ignore-scripts

# BUILDER
FROM base AS builder
COPY --from=installer /app .
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=inventory-service

# RUNNER
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=builder /app/apps/inventory-service/dist ./apps/inventory-service/dist

RUN mkdir -p ./node_modules/@repo/shared
COPY --from=builder /app/packages/shared/dist ./node_modules/@repo/shared/dist
COPY --from=builder /app/packages/shared/package.json ./node_modules/@repo/shared/package.json

RUN mkdir -p ./apps/inventory-service/node_modules/@repo/shared
COPY --from=builder /app/packages/shared/dist ./apps/inventory-service/node_modules/@repo/shared/dist
COPY --from=builder /app/packages/shared/package.json ./apps/inventory-service/node_modules/@repo/shared/package.json

ENV NODE_ENV=production
EXPOSE 3002
CMD ["node", "apps/inventory-service/dist/server.js"]