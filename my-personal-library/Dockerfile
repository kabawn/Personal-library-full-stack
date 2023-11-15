# Use an official Node runtime as the parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app



# Copy package.json and package-lock.json
COPY package*.json ./

# Install any dependencies
RUN npm install

# Bundle the source code inside the Docker image
COPY . .

# Make port available to the world outside the container
EXPOSE 3000

# Run the container as the root user
USER root

# Define the command to run the app
CMD ["node", "server.js"]
