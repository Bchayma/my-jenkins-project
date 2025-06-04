# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build your Next.js app for production
RUN npm run build

# Expose port 3000 for the app
EXPOSE 3000

# Command to start the app
CMD ["npm", "start"]
