import { createApp } from "./app";
import { env } from "./config/env";

export function startServer() {
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
}
