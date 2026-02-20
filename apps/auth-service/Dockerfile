# Use Node 20
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source
COPY . .

# Build if using TS
RUN pnpm build || true

EXPOSE 3000

CMD ["pnpm", "dev"]