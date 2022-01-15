FROM node:17-alpine

COPY ./packages/yarn /app/packages/yarn
COPY ./config /app/config
WORKDIR /app/packages/yarn

# Install packages
RUN yarn

# Transpile TypeScript code
RUN yarn build

CMD ["yarn", "start"]