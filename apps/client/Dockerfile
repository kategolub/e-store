# Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/client/package*.json ./apps/client/

RUN npm install --workspace=apps/client

COPY apps/client ./apps/client

RUN find /app/apps/client -name "dist" -type d -not -path "*/node_modules/*" -exec rm -rf {} + 2>/dev/null || true

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=http://localhost:5001/api

RUN npm run build --workspace=apps/client

# Production
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY apps/client/package*.json ./apps/client/

RUN npm install --workspace=apps/client --omit=dev

COPY --from=builder /app/apps/client/.next ./apps/client/.next
COPY --from=builder /app/apps/client/public ./apps/client/public
COPY --from=builder /app/apps/client/next.config.ts ./apps/client/next.config.ts

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=apps/client"]
