import fastify from 'fastify';

import AuthTokenOsu from './services/Osu';
import AuthTokenReddit from './services/Reddit';

const version = `1.0.0`
const timeout = 1800000
const app = fastify();

let lastUpdated = new Date();

let services = new Map<string, string>();
services.set("timeout", timeout.toString());

const renewTokens = async () => {
  services.set("osu", await AuthTokenOsu());
  services.set("reddit", await AuthTokenReddit());
  console.log(`${new Date().toString()} Tokens renewed`)
}
setInterval(renewTokens, timeout)
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

  console.log(`Request from ${request.ip} (${request.headers["user-agent"]})`)
  return Object.fromEntries(services);
})

const start = async () => {
  try {
    console.log(`🧶 yarn-oauth v${version}`)
    await app.listen(9090, "0.0.0.0");
  } catch (err) {
    console.log("Error starting server on port 9090!");
    console.log(err);
  }
}

start();