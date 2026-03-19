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
WORKDIR /app/apps/web-app
RUN /app/node_modules/.bin/tsc -b && /app/node_modules/.bin/vite build  

#  SERVE 
FROM nginx:alpine

COPY --from=build /app/apps/web-app/dist /usr/share/nginx/html

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