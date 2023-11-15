# Step 1: Build the Angular app in production mode
FROM node:18-alpine as build

# Set the working directory in the container
WORKDIR /app

# Install Angular CLI globally in the container
RUN npm install -g @angular/cli

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install all npm dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Angular app in production mode
RUN ng build

# Step 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist/my-personal-librarypro /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Run the container as the root user
USER root

# Expose port 80
EXPOSE 80

# No need for a CMD instruction since it's inherited from the Nginx base image,
# which already has CMD ["nginx", "-g", "daemon off;"]
