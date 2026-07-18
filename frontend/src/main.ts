import { createFrontendConfig } from "./config.ts";
import { createFrontendServer } from "./server.ts";

const config = createFrontendConfig();
const server = createFrontendServer(config);

server.listen(config.port, config.host, () => {
  console.log(
    `LegacyLens frontend listening on http://${config.host}:${config.port}`,
  );
});
