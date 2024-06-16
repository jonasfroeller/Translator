import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Query
} from "@cloudflare/itty-router-openapi";

export class DeeplAiModel extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["AI Translation"],
		summary: "Translate text",
		parameters: {
      "text": Query(String, {
        required: true
      }),
      "source_lang": Query(String, {
        "default": "EN"
      }),
      "target_lang": Query(String, {
        "default": "DE"
      })
		},
		responses: {
			"200": {
				description: "Returns a translation",
				schema: {
          "type": "object",
          "contentType": "application/json",
          "properties": {
            "translations": [
              {
                "detected_source_language": {
                  "type": "string"
                },
                "text": {
                  "type": "string"
                }
              }
            ]
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
    const API_HOST = env.DeepL_API_Key;

    let response;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000;

    const headers = new Headers();
    headers.append("X-Source", "Cloudflare-Workers");
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    headers.append("Authorization", `DeepL-Auth-Key ${API_HOST}`);

    while (retryCount < maxRetries) { // Error 525
      try {
        response = await fetch("https://api-free.deepl.com/v2/translate", {
          method: "POST",
          headers,
          body: JSON.stringify({
            text: [text],
            source_lang,
            target_lang
          }),
          redirect: "follow"
        });

        if (!response.ok) {
          if (String(response.status).startsWith("5")) { // HTTP 456: quota exceeded, HTTP 429: too many requests.
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue;
          } else {
            throw new Error(`API response error: ${response.status}`);
          }
        }

        break;
      } catch (error) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    if (retryCount >= maxRetries) {
      throw new Error(`Failed to retrieve translation after max retries (${response.status}, ${response.ok}, ${await response.text()})`);
    }

    const json = await response.json();
    return new Response(JSON.stringify(json));
  }
}
