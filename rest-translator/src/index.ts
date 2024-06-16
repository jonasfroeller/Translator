import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { createCors } from 'itty-router'
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";
import {AiModel} from "./endpoints/m2m100-1.2b";
import {DeeplAiModel} from "./endpoints/deepl";

export const router = OpenAPIRouter({
	docs_url: "/",
});
const { preflight, corsify } = createCors();

router.all('*', preflight);

router.get("/api/m2m100-1.2b/", AiModel);
router.get("/api/deepl/", DeeplAiModel);

router.get("/api/tasks/", TaskList);
router.post("/api/tasks/", TaskCreate);
router.get("/api/tasks/:taskSlug/", TaskFetch);
router.delete("/api/tasks/:taskSlug/", TaskDelete);

// 404 for everything else
router.all("*", () =>
	Response.json(
		{
			success: false,
			error: "Route not found",
		},
		{ status: 404 }
	)
);

export default {
  fetch: async (request, env, ctx) => {
    const response = await router.handle(request, env, ctx);
    return corsify(response);
  },
} satisfies ExportedHandler;
