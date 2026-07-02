FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY server/package.json server/package-lock.json* ./server/

# Install dependencies
RUN npm install --production
RUN cd server && npm install --production

# Copy all files
COPY . .

# Create uploads directory
RUN mkdir -p server/uploads/images server/uploads/videos server/uploads/temp

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "server/server.js"]
