# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy backend source
COPY backend/ ./backend/
COPY dist/ ./dist/
COPY index.js ./

# Build backend
WORKDIR /app/backend
RUN npm install typescript && npx tsc
WORKDIR /app

# Expose port
EXPOSE 8080

# Start application
CMD ["node", "index.js"]
