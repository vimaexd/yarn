FROM node:17-alpine

WORKDIR /app
CMD ["yarn", "start:prod"]