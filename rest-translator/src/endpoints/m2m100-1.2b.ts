import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Query
} from "@cloudflare/itty-router-openapi";

export class AiModel extends OpenAPIRoute { // implements ExportedHandler<Env>
	static schema: OpenAPIRouteSchema = {
		tags: ["AI Translation"],
		summary: "Translate text",
		parameters: {
      "text": Query(String, {
        required: true
      }),
      "source_lang": Query(String, {
        "default": "english"
      }),
      "target_lang": Query(String, {
        "default": "german"
      })
		},
		responses: {
			"200": {
				description: "Returns a translation",
				schema: {
          "type": "object",
          "contentType": "application/json",
          "properties": {
            "translated_text": {
              "type": "string"
            }
          }
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
    // Retrieve the validated parameters
    const { source_lang, target_lang, text } = data.query;

    if (!env.AI ||!env.AI.run) {
      throw new Error("env.AI is not defined or does not have a run method");
    }

    const response = await env.AI.run(
      "@cf/meta/m2m100-1.2b",
      {
        text: text,
        source_lang: source_lang,
        target_lang: target_lang,
      }
    );

    return new Response(JSON.stringify(response));
  }

  /* using handle instead, because of `extends OpenAPIRoute` type
  async fetch(request: Request, env: any, context: any): Promise<Response> {
    // context.data.query
    const text = new URL(request.url).searchParams.get("text");
    const source_lang = new URL(request.url).searchParams.get("source_lang");
    const target_lang = new URL(request.url).searchParams.get("target_lang");

    const data = {
      query: {
        text,
        source_lang,
        target_lang
      }
    }

    return await this.handle(request, env, context, data);
  }
  */
}
