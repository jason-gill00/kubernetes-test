# Dockerfile for Temporal worker

FROM node:20-alpine

# Install CA certificates for TLS
RUN apk add --no-cache ca-certificates

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Build app
RUN npm run build

# Start worker
CMD ["node", "dist/temporal/worker.js"]

