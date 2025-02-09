# Use an official Node runtime as a parent image
FROM node:16

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source code
COPY . .

# Expose the port your app runs on (adjust if needed)
EXPOSE 5000

# Define environment variable for production if needed
ENV NODE_ENV=production

# Start the app
CMD [ "npm", "start" ]
