import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";
import { Task } from "../types";

export class TaskDelete extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Tasks"],
		summary: "Delete a Task",
		parameters: {
			taskSlug: Path(String, {
				description: "Task slug",
			}),
		},
		responses: {
			"200": {
				description: "Returns if the task was deleted successfully",
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
		const { taskSlug } = data.params;

		return {
			result: {
				task: {
					name: "Build something awesome with Cloudflare Workers",
					slug: taskSlug,
					description: "Lorem Ipsum",
					completed: true,
					due_date: "2022-12-24",
				},
			},
			success: true,
		};
	}
}
