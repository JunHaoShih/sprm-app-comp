# Frontend Compiler
FROM node:lts-alpine as builder

RUN npm install -g @quasar/cli

COPY package.json /sprm-app/package.json

WORKDIR /sprm-app

RUN npm install

COPY . /sprm-app/

RUN quasar build

# Copy files in spa to nginx and build image
FROM nginx:latest

WORKDIR /sprm-app

COPY --from=builder /sprm-app/dist/spa .

CMD ["nginx", "-g", "daemon off;"]
