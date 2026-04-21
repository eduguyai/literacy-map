# Simplified Dockerfile that just runs the backend API
# The frontend can be served separately or added later

FROM node:18-alpine

WORKDIR /app

# Copy and install backend only
COPY backend/package.json ./backend/
WORKDIR /app/backend

RUN npm install --omit=dev

# Copy backend source
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Build backend if needed
RUN npm run build || echo "No build script or already built"

# Expose port
EXPOSE 3000

# Start backend
CMD ["npm", "start"]
