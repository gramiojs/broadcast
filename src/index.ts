import type { initJobify } from "jobify";

// TODO: export it
type Job = ReturnType<ReturnType<typeof initJobify>>;
type IsNever<T> = [T] extends [never] ? true : false;

// TODO: replace it
type Action = Function;

export class Broadcast<
	Types extends Record<
		string,
		{
			action: Function;
		}
	> = {},
> {
	job: Job;

	types: {
		name: keyof Types;
		action: Action;
	}[] = [];

	constructor(job: Job) {
		this.job = job;
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

		return this;
	}

	start<Type extends keyof Types>(
		name: Type,
		// a: Types[Type]["action"],
		args: Parameters<Types[Type]["action"]>[],
	) {}
}
