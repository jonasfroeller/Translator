import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
} from "@cloudflare/itty-router-openapi";
import { Task } from "../types";

export class TaskCreate extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Tasks"],
		summary: "Create a new Task",
		requestBody: Task,
		responses: {
			"200": {
				description: "Returns the created task",
				schema: {
					success: Boolean,
					result: {
						task: Task,
					},
				},
			},
		},
	};

	async handle(
		request: Request,
		env: any,
		context: any,
		data: Record<string, any>
	) {
		const taskToCreate = data.body;

		return {
			success: true,
			task: {
				name: taskToCreate.name,
				slug: taskToCreate.slug,
				description: taskToCreate.description,
				completed: taskToCreate.completed,
				due_date: taskToCreate.due_date,
			},
		};
	}
}
