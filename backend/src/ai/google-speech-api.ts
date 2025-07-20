import {SpeechClient, protos}  from "@google-cloud/speech"
import { convertAudioToPcm } from "./util";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import z from "zod";
import { TRANSCRIBE_AGENT_SYSTEM_PROMPT } from "./transcribe-agent-prompt";

const speech = new SpeechClient({
  apiKey: process.env.EGOAVARA_GOOGLE_CLOUD_API_KEY,
});


const request:protos.google.cloud.speech.v1.IStreamingRecognitionConfig = {
  config: {
    encoding: "LINEAR16",
    sampleRateHertz: 16000, // Adjust this based on your audio input
    languageCode: "ko-KR",
  
  },
  interimResults: true, // If you want interim results, set this to true
};

const summaryFulltext: string[] = [];

const appendSummary = tool(
  ({ appendData }: { appendData: string }): string => {
    console.log("appendSummary called with data:", appendData);
    summaryFulltext.push(appendData);
    return "appendSummary: success";
  },
  {
    name: "appendSummary",
    description: "Append data to the summary",
    schema: z.object({
      appendData: z.string(),
    }),
  }
);

const readAllSummary = tool(
  (): string => {
    /**
     * Read all data from the summary.
     */
    return summaryFulltext.join("\n");
  },
  {
    name: "readAllSummary",
    description: "Read all data from the summary",
    schema: z.object({}),
  }
);
const lastSummary = tool(
  (): string => {
    /**
     * Read last data from the summary.
     */
    return summaryFulltext[summaryFulltext.length - 1] || "<nodata>";
  },
  {
    name: "lastSummary",
    description: "Read last data from the summary",
    schema: z.object({}),
  }
);



const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature:0.3,
    maxRetries:3,
    apiKey: process.env.GEMINI_API_KEY
})

const agent = createReactAgent({
    llm: gemini,
    tools:[
        appendSummary,
        readAllSummary,
        lastSummary
    ],
    prompt: new SystemMessage(TRANSCRIBE_AGENT_SYSTEM_PROMPT),
})

type SpeechAlternative = {
  transcript: string;
  confidence: number;
  words: protos.google.cloud.speech.v1.IWordInfo[];
}

type SchemeResult = {
  alternatives: Required<SpeechAlternative>[];
  channelTag: number;
  resultEndTime: protos.google.protobuf.IDuration;
  languageCode: string;
  isFinal: boolean;
  stability: number;
}

type SpeechResponse = {
  results: SchemeResult[];
  speechEventType: string
  totalBilledTime: protos.google.protobuf.IDuration,
  speechEventTime: protos.google.protobuf.IDuration,
  speechAdaptationInfo: protos.google.cloud.speech.v1.ISpeechAdaptationInfo,
  requestId: string
}

const locks:Promise<any>[] = [];

// Create a recognize stream
const recognizeStream = speech
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', (data: SpeechResponse) =>{
    if (data.results ===  null) {
      return;
    }
    console.log("---")
    for (const result of data.results) {
      const first = result.alternatives.length > 0 ? result.alternatives[0] : undefined;
      const firstTranscript = first ? first.transcript : "";
      if (!result.isFinal) {
        console.log("Interim result received", result);
        console.log(`Interim result: ${firstTranscript}`);
        continue;
      }
      if (!first) {
        continue
      }
      if (firstTranscript.trim() === "") {
        continue;
      }
      console.log("Final result received", result);
      console.log(`Final result: ${firstTranscript}`);
      let unlock: (value: any) => void;
      const lock = new Promise((res) => {
        unlock = res;
      });
      locks.push(lock);
      agent.invoke({
        messages: [
          new HumanMessage(`<speech>
${firstTranscript}
</speech>`)
        ]
      }).then((result) => {
        console.log("Agent invoked with speech result:", firstTranscript);
        console.log("Agent response:", result.messages.at(-1)?.content || "<nodata>");
        unlock({});
      })
    }
  });

const pcm = await convertAudioToPcm("./src/ai/sample/tts.mp3");
// const pcm = await convertAudioToPcm("./src/ai/sample/news.m4a");

// PCM 데이터를 작은 청크로 나누어 전송 (최대 8MB)
const chunkSize = 8 * 1024 * 1024; // 8MB
let offset = 0;

while (offset < pcm.length) {
  const chunk = pcm.subarray(offset, Math.min(offset + chunkSize, pcm.length));
  recognizeStream.write(chunk);
  offset += chunkSize;
}

// 스트림 종료 (모든 데이터 전송 완료 시)
recognizeStream.end();

const lock = new Promise((res) => {
  setTimeout(() => {
    res(null);
  }, 3000);
});
await lock; // Wait for the stream to finish processing
await Promise.all(locks);

const finalResult = await agent.invoke({
  messages: [
    new HumanMessage(`<end_of_stream>
모든 전사문이 전송되었습니다.
현재까지 진행된 모든 대화를 툴을 통해 요약해 주세요.
</end_of_stream>`) // End of transcript signal
  ]
})
console.log("Final agent response:", finalResult.messages.at(-1)?.content || "<nodata>");

console.log("Streaming recognition end");
for (const summary of summaryFulltext) {
  console.log("------------");
  console.log(summary);
}