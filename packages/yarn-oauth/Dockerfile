FROM node:17-alpine

COPY ./packages/yarn-oauth /app/packages/yarn-oauth
COPY ./config /app/config

WORKDIR /app/packages/yarn-oauth

RUN yarn
RUN yarn build
CMD ["yarn", "start"]