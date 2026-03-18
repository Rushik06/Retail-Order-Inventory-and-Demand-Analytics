# BASE 
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# DEPS 
FROM base AS deps
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps ./apps
RUN pnpm install --frozen-lockfile --config.node-linker=hoisted --ignore-scripts

# BUILD 
FROM base AS build
COPY --from=deps /app /app
WORKDIR /app/apps/inventory-service
RUN /app/node_modules/.bin/tsc

# RUNNER 
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm

COPY apps/inventory-service/package.json ./apps/inventory-service/package.json
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./

RUN pnpm install --config.node-linker=hoisted --prod --ignore-scripts

COPY --from=build /app/apps/inventory-service/dist ./dist

ENV NODE_ENV=production
EXPOSE 3002
CMD ["node", "dist/server.js"]