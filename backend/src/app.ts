import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/error";
import { authRouter } from "./routes/auth.routes";
import { bankAccountsRouter } from "./routes/bank-accounts.routes";
import { cardsRouter } from "./routes/cards.routes";
import { transactionsRouter } from "./routes/transactions.routes";
import { contactsRouter, usersRouter } from "./routes/users.routes";

export function buildApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  if (env.NODE_ENV !== "test") {
    app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  }

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/cards", cardsRouter);
  app.use("/transactions", transactionsRouter);
  app.use("/contacts", contactsRouter);
  app.use("/bank-accounts", bankAccountsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
