# docker/node/Dockerfile
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY client/package.json client/package-lock.json ./

# Install dependencies (rebuilds if package.json changes)
RUN npm install

# Copy the rest of the frontend code
COPY client/ .

# Expose Vite dev server port
EXPOSE 5173

# Run Vite dev server
CMD ["npm", "run", "dev"]