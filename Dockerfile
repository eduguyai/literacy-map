# Use official Node.js runtime as base image
FROM node:18-alpine

WORKDIR /app

# Copy everything from repo
COPY . .

# Install backend dependencies
WORKDIR /app/backend
RUN npm install --omit=dev

# Install frontend dependencies and build
WORKDIR /app/frontend
RUN npm install && npm run build

# Expose port
EXPOSE 3000

# Start backend server (which serves frontend static files)
WORKDIR /app/backend
CMD ["npm", "start"]
