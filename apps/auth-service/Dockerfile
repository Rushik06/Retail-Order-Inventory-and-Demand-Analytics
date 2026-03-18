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
RUN pnpm install --frozen-lockfile --config.node-linker=hoisted

# BUILD 
FROM base AS build
COPY --from=deps /app /app          
WORKDIR /app/apps/auth-service
RUN /app/node_modules/.bin/tsc

#  PRUNE 
FROM base AS prune
COPY --from=build /app /app
ENV CI=true  
RUN pnpm prune --prod --ignore-scripts

# RUNNER 
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=prune /app/apps/auth-service/dist ./dist
COPY --from=prune /app/apps/auth-service/package.json ./
COPY --from=prune /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]