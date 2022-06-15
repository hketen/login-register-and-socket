FROM node:16.14.0
WORKDIR /server

ARG ENV_VARS
RUN touch .env
RUN printf $ENV_VARS >> .env

RUN npm -g install npm
COPY . .
RUN npm install
RUN npm run migration:up

EXPOSE 8080
CMD npm start
