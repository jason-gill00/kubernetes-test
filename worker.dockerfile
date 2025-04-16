# Dockerfile for Temporal worker
# Use a glibc-compatible base image
FROM node:20-slim

# Install required system packages (including CA certs)
RUN apt-get update && apt-get install -y \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the project
RUN npm run build

# Start the Temporal worker
CMD ["node", "dist/temporal/worker.js"]

