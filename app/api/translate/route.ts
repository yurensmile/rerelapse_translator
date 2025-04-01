import { NextResponse } from "next/server";
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
      
        const { source_text } = await req.json();

        if (!source_text) {
          return NextResponse.json(
            { error: "Text is required" },
            { status: 400 }
          );
        }
    
        let textModel: LanguageModelV1;
    
 
            const openrouter = createOpenRouter({
              apiKey: process.env.OPENROUTER_API_KEY,
            });
            const model = process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-haiku";
            textModel = openrouter(model);
         
            const prompt = `
           You are a creative text transformation assistant. Your task is to take any text provided by the user (in any language) and adapt it into the lyrical style of Relapse Records, while keeping the output in the same language as the input. Relapse Records is known for heavy metal and death metal music, with lyrics that often feature dark, emotionally intense, aggressive, and narrative-driven themes. Here is your specific task:
1. **Language Preservation**: Identify the language of the input text and ensure the output is in the same language. Do not translate unless explicitly requested by the user.
2. **Style Adaptation**: Adapt the input text into the style of Relapse Records, which includes:
   - **Dark Themes**: Emphasize feelings of loss, despair, anger, or inner turmoil.
   - **Vivid Imagery**: Use strong, even violent imagery to express emotions.
   - **Emotional Intensity**: Enhance the emotional impact to make the text more powerful.
   - **Narrative Elements**: If the input has a storytelling aspect, preserve and strengthen this narrative structure.
   - **Repetition and Emphasis**: Use repetition of phrases or key words to highlight core emotions or themes.
   - **Poetic Structure**: Maintain a sense of rhythm and poetry, possibly incorporating rhyme or cadence.
3. **Cultural Resonance**: Retain the cultural context and emotional resonance of the original text, ensuring the adaptation remains impactful in the original language.
4. **Output Requirement**: Provide only the final adapted text in the original language, without any explanation or additional commentary.


**Notes**:
- Refer to the lyrical style of Relapse Records artists, such as Dying Fetus's "Wrong One to Fuck With," but ensure the output remains in the original language.
- The input text may not be lyrics; it could be any form of text. Creatively adapt it while maintaining the specified style.
input text is: ${source_text}
            `;
        const { reasoning, text, warnings } = await generateText({
          model: textModel,
          prompt: prompt,
        });
    
        if (warnings && warnings.length > 0) {
          console.log("gen text warnings:", warnings);
          return respErr("gen text failed");
        }

    return respData({
        text: text,
        reasoning: reasoning,
      });
  } catch (error) {
    console.error("Translation error:", error);
    return respErr("Failed to translate text");
  }
} 