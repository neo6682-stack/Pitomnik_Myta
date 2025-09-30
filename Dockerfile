# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy backend source and root files
COPY backend/ ./backend/
COPY index.js ./

# Build TypeScript (this creates dist/ folder)
RUN npm run build

# Expose port
EXPOSE 8080

# Start application
CMD ["node", "index.js"]
