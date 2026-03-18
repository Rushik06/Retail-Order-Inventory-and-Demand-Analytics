# ---------- BASE ----------
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# ---------- DEPS ----------
FROM base AS deps
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps ./apps
RUN pnpm install --frozen-lockfile --config.node-linker=hoisted --ignore-scripts

# ---------- BUILD ----------
FROM base AS build
COPY --from=deps /app /app
WORKDIR /app/apps/auth-service
RUN /app/node_modules/.bin/tsc

# ---------- RUNNER ----------
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm

COPY apps/auth-service/package.json ./apps/auth-service/package.json
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./

RUN pnpm install --config.node-linker=hoisted --prod --ignore-scripts

COPY --from=build /app/apps/auth-service/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/server.js"]