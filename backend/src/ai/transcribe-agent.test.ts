import { TranscribeAgent } from "./transcribe-agent";
import { convertAudioToPcm } from "./util";

const agent = new TranscribeAgent({
    apiKey:{
        llm: process.env.GEMINI_API_KEY ?? "",
        embed: process.env.GEMINI_API_KEY ?? "",
        speech: process.env.EGOAVARA_GOOGLE_CLOUD_API_KEY ?? "",
    },
    model: "gemini-2.5-flash",
    lang: "ko-kr",
})

agent.on("start", () => {
    console.log("TranscribeAgent started");
});

// agent.on("transcribe:delta", (delta) => {
//     console.log(`[${delta.requestId}] transcribe:delta: ${delta.represent}`);
// });

agent.on("stream:send", () => {
    console.log("TranscribeAgent stream send");
});

agent.on("stream:close", () => {
    console.log("TranscribeAgent stream closed");
});

agent.on("stream:queue#unsafe", () => {
    console.log("TranscribeAgent stream queue unsafe");
});



agent.on("transcribe:done", (done) => {
    console.log(`[${done.requestId}] transcribe:done : ${done.represent}`);
});

agent.on("ai:tool:call", (call, msg) => {
    console.log(`[${call.id}] ai:tool:call : ${call.name}(${JSON.stringify(call.args, undefined, 4)})`);
});

agent.on("ai:tool:result", (result, msg) => {
    console.log(`[${msg.id}] ai:tool result ${msg.name}: ${JSON.stringify(result, undefined, 4)}`);
});

agent.on("ai:response", (resp, msg) => {
    console.log(`[${msg.id}] ai:response : ${JSON.stringify(resp, undefined, 4)}`);
});


agent.on("stream:close", (stream) => {
    console.log("TranscribeAgent stream closed");
});

agent.on("end", () => {
    console.log("TranscribeAgent ended");
});

agent.on("summary:done", (summary) => {
    console.log("---\nTranscribeAgent summary done\n---\n", summary);
});


// const pcm = await convertAudioToPcm("./src/ai/sample/tts.mp3");
const pcm = await convertAudioToPcm("./src/ai/sample/news.m4a");
agent.sendAudioPartPcm(pcm);
console.log("send pcm done");