# Stage 1: Build the Node.js application
FROM node:latest AS build

WORKDIR /app

COPY app.js .

# Stage 2: Create the production image
FROM node:slim

ENV HOSTNAME=TheToriqul

WORKDIR /app

COPY --from=build /app .

EXPOSE 3000

CMD ["node", "app.js"]
