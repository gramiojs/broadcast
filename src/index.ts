import type { initJobify } from "jobify";

// TODO: export it
type Job = ReturnType<ReturnType<typeof initJobify>>;

export class Broadcast {
	job: Job;

	constructor(job: Job) {
		this.job = job;
	}
}
