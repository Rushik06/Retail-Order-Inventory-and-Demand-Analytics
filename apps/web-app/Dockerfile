# ---------- BUILD ----------
FROM node:20-alpine AS build
WORKDIR /app

RUN npm install -g pnpm

COPY . .
RUN pnpm install
RUN pnpm --filter web-app build

# ---------- SERVE ----------
FROM nginx:alpine

COPY --from=build /app/apps/web-app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]