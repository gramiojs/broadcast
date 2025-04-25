import { TelegramError } from "gramio";
import {
	type DefinedJobsOptions,
	type Job,
	type OptionsData,
	initJobify,
} from "jobify";
// TODO: re-export this from jobify
import { Worker } from "jobify/bullmq";

// TODO: replace it
type Action = Function;

export class Broadcast<
	Types extends Record<
		string,
		{
			action: Action;
		}
	> = {},
> {
	types: {
		name: keyof Types;
		action: Action;
	}[] = [];
	job: Job<{ type: keyof Types; args: any[] }>;

	constructor(
		redis: Parameters<typeof initJobify>[0],
		options?: DefinedJobsOptions,
		workerOptions?: OptionsData,
	) {
		const defineJob = initJobify(redis);

		this.job = defineJob("@gramio/broadcast", {
			...options,
			queue: {
				...options?.queue,
				defaultJobOptions: {
					...options?.queue?.defaultJobOptions,
					attempts: 5,
					backoff: {
						type: "fixed",
						delay: 1000,
						...(typeof options?.queue?.defaultJobOptions?.backoff === "object"
							? options?.queue?.defaultJobOptions?.backoff
							: {}),
					},
				},
			},
		})
			.options({
				limiter: {
					max: 25,
					duration: 1000,
				},
				...workerOptions,
			})
			// TODO: вынести в интерфейс
			.input<{ type: keyof Types; args: any[] }>()
			.action(async ({ data }) => {
				try {
					const type = this.types.find((x) => x.name === data.type);

					await type?.action(...data.args);
				} catch (error) {
					if (error instanceof TelegramError) {
						if (error.payload?.retry_after) {
							await this.job.queue.rateLimit(error.payload.retry_after * 1000);

							throw Worker.RateLimitError();
						}
						// TODO: hooks to catch it
						if (error.code === 403) return;
					}

					throw error;
				}
			});
	}

	type<const T extends string, F extends Function>(
		type: T,
		action: F,
	): Broadcast<
		Types & {
			[K in T]: {
				action: F;
			};
		}
	> {
		this.types.push({
			name: type,
			action,
		});

		// @ts-expect-error
		return this;
	}

	start<Type extends keyof Types>(
		name: Type,
		// a: Types[Type]["action"],
		// TODO: fix this
		// @ts-expect-error
		args: Parameters<Types[Type]["action"]>[],
	) {
		return this.job.addBulk(
			args.map((x) => ({
				name: "@gramio/broadcast",
				data: { type: name, args: x },
			})),
		);
	}
}
