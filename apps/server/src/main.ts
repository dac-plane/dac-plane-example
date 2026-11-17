import { setGlobalDispatcher } from "undici";
import { buildApp } from "./app.ts";
import { loadConfig } from "./config.ts";
import { createDispatcher } from "./dispatcher.ts";
import { ClientCredentials } from "./token.ts";

const config = loadConfig();
// Every outgoing request goes to dac-plane or its issuer, so the agent that
// carries the deployment's CA and address mapping is the process-wide
// dispatcher, which Node's fetch uses.
setGlobalDispatcher(
  createDispatcher({ ...(config.ca ? { ca: config.ca } : {}), connectTo: config.connectTo }),
);

const app = await buildApp({
  surfaceURL: config.surfaceURL,
  tenant: config.tenant,
  defaults: config.defaults,
  fetch,
  tokens: new ClientCredentials({
    tokenURL: config.tokenURL,
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    scope: config.scope,
    fetch,
  }),
  server: {
    logger: { redact: ["req.headers.authorization", "req.headers.cookie"] },
  },
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    app.close().then(
      () => process.exit(0),
      (error: unknown) => {
        app.log.error(error, "shutdown failed");
        process.exit(1);
      },
    );
  });
}

await app.listen({ host: config.host, port: config.port });
