import { createBackendConfig } from "./config.ts";
import { createBackendServer } from "./server.ts";

const config = createBackendConfig();
const server = createBackendServer(config);

server.listen(config.port, config.host, () => {
  console.log(
    `${config.serviceName} listening on http://${config.host}:${config.port}`,
  );
});
