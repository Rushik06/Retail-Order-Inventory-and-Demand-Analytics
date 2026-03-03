FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm
ENV CI=true

COPY . .

RUN pnpm install

EXPOSE 3002

CMD ["pnpm", "--filter", "inventory-service", "dev"]