# Use an official Node.js LTS image for the build stage
# Stage 1: Build the Node.js application
FROM node:lts AS build

# Set the working directory in the container
WORKDIR /app

# Copy the application source code to the working directory
COPY app.js .

# Use a smaller, optimized Node.js image for production
# Stage 2: Create the production image
FROM node:slim

# Set environment variables
# Avoid hardcoding sensitive information like HOSTNAME
ENV HOSTNAME=TheToriqul

# Set the working directory in the production image
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app .

# Expose the application port
EXPOSE 3000

# Define the command to run the application
CMD ["node", "app.js"]
