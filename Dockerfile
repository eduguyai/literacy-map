# Multi-stage build for Railway deployment
# This builds both frontend and backend in one Docker image

FROM node:18-alpine AS builder

WORKDIR /app

# Copy both backend and frontend
COPY backend ./backend
COPY frontend ./frontend

# Build backend
WORKDIR /app/backend
RUN npm install
RUN npm run build || echo "No build script in backend"

# Build frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy backend from builder
COPY --from=builder /app/backend ./backend
# Copy frontend build from builder
COPY --from=builder /app/frontend/build ./frontend-build

# Install only production dependencies for backend
WORKDIR /app/backend
RUN npm install --only=production

# Expose ports
EXPOSE 3000 3001

# Start script
RUN echo '#!/bin/sh\n\
cd /app/backend && npm start' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
