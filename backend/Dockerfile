FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev || npm install --omit=dev

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 3000

# Start backend server
CMD ["node", "index.js"]

