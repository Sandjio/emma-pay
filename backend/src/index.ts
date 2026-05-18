import { buildApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./db/prisma";

const app = buildApp();

const server = app.listen(env.PORT, () => {
  console.log(`[emmapay-backend] listening on http://0.0.0.0:${env.PORT} (${env.NODE_ENV})`);
});

async function shutdown(signal: string) {
  console.log(`\n[emmapay-backend] received ${signal}, shutting down...`);
  server.close(() => {
    console.log("[emmapay-backend] http server closed");
  });
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
