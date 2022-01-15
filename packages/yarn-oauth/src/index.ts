import fs from 'fs';
import path from 'path';
import fastify from 'fastify';
import Log from './utils/Log';

const config = {
  "version": `1.2.1`,
  "timeout": 1800000,
  "servicesPath": path.join(__dirname, 'services')
}
const log = new Log({prefix: "OAuth", "color": "green"});
const app = fastify();

interface Service {
  name: string;
  isRecurring?: boolean;
  renew: () => string | undefined;
}

/* Globals */
let services: Service[] = [];
let credentials = new Map<string, string>();
let lastUpdated = new Date();

/**
 * Service discovery 
 * Registers services in the global services array
 * @returns {number} Number of services registered
 */
const discover = async (): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    const serviceFiles = fs.readdirSync(config.servicesPath)
    for(const _service of serviceFiles){
      const service = _service.replace(path.extname(_service), "");
      let file: {default: Service};
      try {
        file = await import(path.join(config.servicesPath, service)) 
      } catch(err){
        log.log(`Error registering service ${service}!`)
        console.log(err);
      }
      services.push(file.default);
    }
    log.log(`Discovered ${services.length} services! (${services.map(s => (s.name)).join(", ")})`)
    resolve(services.length)
  })
}

/**
 * Renew All
 * Renews all OAuth tokens from all registered services
 * @returns {void}
 */
const renewAll = async () => {
  for(const service of services){
    if(!service.isRecurring) return;
    credentials.set(service.name, await service.renew());
  }
  log.log(`Tokens renewed`)
  setTimeout(renewAll, config.timeout)
}



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
  return Object.fromEntries(credentials);
})

const start = async () => {
  try {
    console.log(`🧶 yarn-oauth v${config.version}`)
    await app.listen(9090, "0.0.0.0");

    await discover();
    renewAll();

  } catch (err) {
    console.log("Error starting server on port 9090!");
    console.log(err);
  }
}

start();