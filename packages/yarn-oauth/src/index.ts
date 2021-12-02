import fastify from 'fastify';
import Log from './utils/Log';

import AuthTokenOsu from './services/Osu';
import AuthTokenReddit from './services/Reddit';

const config = {
  "version": `1.1.0`,
  "timeout": 1800000
}
const log = new Log({prefix: "OAuth", "color": "green"});
const app = fastify();

let lastUpdated = new Date();

// Services
let services = new Map<string, string>();
services.set("timeout", config.timeout.toString());

// Renew loop
const renewTokens = async () => {
  services.set("osu", await AuthTokenOsu());
  services.set("reddit", await AuthTokenReddit());
  log.log(`Tokens renewed`)
  setTimeout(renewTokens, config.timeout)
}
renewTokens();



// HTTP Server
app.get('/', async (request, reply) => {
  if(
    !request.headers["user-agent"] ||
    !(request.headers["user-agent"] as string).startsWith("yarn/")
  ) {
    reply.statusCode = 403;
    return "Unauthorized";
  };

  log.log(`Request from ${request.ip} (${request.headers["user-agent"]})`)
  return Object.fromEntries(services);
})

const start = async () => {
  try {
    console.log(`🧶 yarn-oauth v${config.version}`)
    await app.listen(9090, "0.0.0.0");
  } catch (err) {
    console.log("Error starting server on port 9090!");
    console.log(err);
  }
}

start();