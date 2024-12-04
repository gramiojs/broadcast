# @gramio/broadcast

[![npm](https://img.shields.io/npm/v/@gramio/broadcast?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/broadcast)
[![npm downloads](https://img.shields.io/npm/dw/@gramio/broadcast?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/broadcast)
[![JSR](https://jsr.io/badges/@gramio/broadcast)](https://jsr.io/@gramio/broadcast)
[![JSR Score](https://jsr.io/badges/@gramio/broadcast/score)](https://jsr.io/@gramio/broadcast)

Simple wrapper for [jobify](https://github.com/kravetsone/jobify) ([BullMQ](https://bullmq.io/)) to make broadcast easier. Automatically handles rate limits and ignore user blocks.
Provide simple API for pre-defined broadcasts.

This implementation is ready for production use because, thanks to [Redis](http://redis.io/), it won't lose planned users during reloads and will send notifications to all of them.

```ts
import { Bot, InlineKeyboard } from "gramio";
import Redis from "ioredis";
import { initJobify } from "jobify";
import { Broadcast } from "@gramio/broadcast";

const redis = new Redis({
    maxRetriesPerRequest: null,
});

const bot = new Bot(process.env.BOT_TOKEN as string);

const broadcast = new Broadcast(redis).type("test", (chatId: number) =>
    bot.api.sendMessage({
        chat_id: chatId,
        text: "test",
    })
);

console.log("prepared to start");

const chatIds = [617580375];

await broadcast.start(
    "test",
    chatIds.map((x) => [x])
);

// graceful shutdown
process.on("beforeExit", async () => {
    await broadcast.job.queue.close();
});
```
