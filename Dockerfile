# Base image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the React app
RUN npm run build

# Expose the port your React app will be running on
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
