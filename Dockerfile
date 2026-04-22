FROM node:18-alpine

WORKDIR /app

# Copy and install
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy source
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Listen on PORT env variable or 3000
ENV PORT=3000
EXPOSE 3000

# Run
CMD ["npm", "start"]
