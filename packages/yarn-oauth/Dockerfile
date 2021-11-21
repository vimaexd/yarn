FROM node:17-alpine

WORKDIR /app
COPY . .

RUN yarn
RUN yarn build
CMD ["yarn", "start"]