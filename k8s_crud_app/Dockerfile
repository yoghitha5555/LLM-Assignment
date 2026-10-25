# Use official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install application dependencies
RUN npm install --production

# Bundle app source
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Define the command to run the app
CMD [ "npm", "start" ]
