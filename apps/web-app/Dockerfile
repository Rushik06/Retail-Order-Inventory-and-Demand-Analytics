# BASE
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm turbo

# PRUNER
FROM base AS pruner
COPY . .
RUN turbo prune web-app --docker

# INSTALLER
FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --ignore-scripts

# BUILDER
FROM base AS builder
COPY --from=installer /app .
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=web-app

# SERVE
FROM nginx:alpine
COPY --from=builder /app/apps/web-app/dist /usr/share/nginx/html

RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    include /etc/nginx/mime.types;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]