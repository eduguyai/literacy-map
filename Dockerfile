FROM node:18-alpine

WORKDIR /app

# Copy and install backend
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy backend source
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Expose port
EXPOSE 3000

# Start backend with ts-node (no build required)
CMD ["npm", "start"]
