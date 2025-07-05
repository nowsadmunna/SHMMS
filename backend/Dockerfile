# Use Node.js LTS version (adjust if needed)
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the app code
COPY . .

# Set environment variable for production
ENV NODE_ENV=production

# Azure injects PORT=80 — your app should respect this
ENV PORT=80

# Expose the port the app will listen on (must match Azure's PORT env)
EXPOSE 80

# Start the app (adjust if your entry file isn't index.js)
CMD ["node", "index.js"]
