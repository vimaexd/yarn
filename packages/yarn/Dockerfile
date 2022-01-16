FROM node:17-alpine

COPY ./packages/yarn /app/packages/yarn
COPY ./config /app/config
WORKDIR /app/packages/yarn

# Install packages
RUN npm i

# Transpile TypeScript code
RUN npm run build

CMD ["npm", "run", "start"]