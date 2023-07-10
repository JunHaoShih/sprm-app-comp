# Frontend Compiler
FROM node:lts-alpine AS builder

RUN npm install --ignore-scripts -g @quasar/cli

COPY package.json /sprm-app/package.json

WORKDIR /sprm-app

RUN npm install --ignore-scripts

COPY . /sprm-app/

RUN quasar build

# Copy files in spa to nginx and build image
FROM nginx:latest

LABEL maintainer="CompileError victor5517@gmail.com"

WORKDIR /sprm-app

COPY --from=builder /sprm-app/dist/spa .

CMD ["nginx", "-g", "daemon off;"]
