# @gramio/broadcast

[![npm](https://img.shields.io/npm/v/@gramio/auto-answer-callback-query?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/auto-answer-callback-query)
[![JSR](https://jsr.io/badges/@gramio/auto-answer-callback-query)](https://jsr.io/@gramio/auto-answer-callback-query)
[![JSR Score](https://jsr.io/badges/@gramio/auto-answer-callback-query/score)](https://jsr.io/@gramio/auto-answer-callback-query)

```ts
const redis = new Redis();

const defineJob = initJobify(redis);

const bot = new Bot(process.env.BOT_TOKEN as string);

const broadcast = new Broadcast(defineJob("broadcast"))
    .type("test", (a: number) => a + 1)
    .type("test2", (b: string) => `${b}a`);

broadcast.start("test", [[1]]);
```
