import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { HumanMessage, trimMessages } from "@langchain/core/messages";
import { readFileSync } from "fs";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";

const multiply = tool(
  ({ a, b }: { a: number; b: number }): number => {
    /**
     * Multiply two numbers.
     */
    return a * b;
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro",
    temperature:0.3,
    maxRetries:3,
    apiKey: process.env.GEMINI_API_KEY
})

const chatHistory = new InMemoryChatMessageHistory(); 
const checkpointer = new MemorySaver();

const agent = createReactAgent({
    llm: gemini,
    tools:[
        multiply
    ],
    checkpointer: checkpointer,
    // checkpointSaver: checkpointer
})

const result = await agent.invoke({
    messages: [
        new HumanMessage({
            content:[
                {
                    type:"audio",
                    source_type:"base64",
                    mime_type: "audio/mpeg",
                    data: readFileSync("./src/ai/sample/tts.mp3", "base64")
                }
            ]
        })
    ]
})
console.log(result)