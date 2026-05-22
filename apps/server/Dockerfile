# Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files for workspaces
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/

# Install dependencies
RUN npm install --workspace=apps/server

# Copy server source
COPY apps/server/src ./apps/server/src
COPY apps/server/tsconfig.json ./apps/server/tsconfig.json

# Build TypeScript
RUN npm run build --workspace=apps/server

# Production
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY apps/server/package*.json ./apps/server/

# Production dependencies only
RUN npm install --workspace=apps/server --omit=dev

# Copy compiled output from builder
COPY --from=builder /app/apps/server/dist ./apps/server/dist

ENV NODE_ENV=production

EXPOSE 5001

CMD ["node", "apps/server/dist/main.js"]
