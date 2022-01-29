import express from "express";
import { config } from "dotenv";
config();
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import { graphqlHTTP } from "express-graphql";
import { UserResolver } from "./schemas/user";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createAccessToken, validateRefreshToken } from "./auth";
import ps from "./prisma-client";
import { OrdersResolver } from "./schemas/orders";

// import { ExpressContext } from "./interfaces/req-res";

const app = express();
const PORT = process.env.PORT || 9000;
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);
app.use(cookieParser());

const schema = buildSchemaSync({
  resolvers: [UserResolver, OrdersResolver],
});

app.get("/", (_, res) => {
  res.send("hello");
});

app.post("/refresh-token", async (req, res) => {
  const cookie = req.cookies.gasMonkey;
  if (!cookie) return res.send({ ok: false, accessToken: "" });
  let payload: any = null;
  try {
    payload = validateRefreshToken(cookie);
    const id: number = payload.UserId;
    const user = await ps.user.findUnique({ where: { id } });
    if (!user) return res.send({ ok: false, accessToken: "" });
    return res.send({ ok: true, accessToken: createAccessToken(user) });
  } catch (err) {
    console.log(err);
    return res.send({ ok: false, accessToken: "" });
  }
});

app.post("/logout", async (_, res) => {
  res.clearCookie("gasMonkey");
  res.send({ ok: true });
});

app.use(
  "/graphql",
  graphqlHTTP(async (req, res) => ({
    schema,
    graphiql: { headerEditorEnabled: true },
    context: { req, res },
  }))
);

app.listen(PORT, () => {
  console.log("server listening on " + PORT);
});
