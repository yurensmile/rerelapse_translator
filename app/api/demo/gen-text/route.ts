import {
  LanguageModelV1,
  extractReasoningMiddleware,
  generateText,
  wrapLanguageModel,
} from "ai";
import { respData, respErr } from "@/lib/resp";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export async function POST(req: Request) {
  try {
    const { prompt, provider, model } = await req.json();
    if (!prompt || !provider || !model) {
      return respErr("invalid params");
    }

    let textModel: LanguageModelV1;

    switch (provider) {
      case "openrouter":
        const openrouter = createOpenRouter({
          apiKey: process.env.OPENROUTER_API_KEY,
        });
        textModel = openrouter(model);

        if (model === "deepseek/deepseek-r1") {
          const enhancedModel = wrapLanguageModel({
            model: textModel,
            middleware: extractReasoningMiddleware({
              tagName: "think",
            }),
          });
          textModel = enhancedModel;
        }
        break;
      default:
        return respErr("invalid provider");
    }

    const { reasoning, text, warnings } = await generateText({
      model: textModel,
      prompt: prompt,
    });

    if (warnings && warnings.length > 0) {
      console.log("gen text warnings:", provider, warnings);
      return respErr("gen text failed");
    }

    return respData({
      text: text,
      reasoning: reasoning,
    });
  } catch (err) {
    console.log("gen text failed:", err);
    return respErr("gen text failed");
  }
}
