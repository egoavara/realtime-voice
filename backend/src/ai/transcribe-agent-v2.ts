// import { SpeechClient } from "@google-cloud/speech";
// import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import EventEmitter from "events";
// import type { VectorStoreInterface } from "@langchain/core/vectorstores";
// import { TranscribeAgentConfig, TranscribeAgentConfigHelper } from "./transcribe-agent-config";
// import { createReactAgent } from "@langchain/langgraph/prebuilt";
// import { MessageContentSingle, SpeechResponse, TranscribeEventMetadata, TranscribeSendParams, TranscribeSendResult, Transcript, TranscriptCandidate, TranscriptCandidateAlternative, TranscriptCandidatePart, TranscriptDone } from "./transcribe-agent-helpertypes";
// import { randomUUID } from "crypto";
// import { TodoToolkit } from "./toolkit-todo";
// import { RememberToolkit } from "./toolkit-remember";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { AIMessage, HumanMessage, MessageContent, MessageContentImageUrl, MessageContentText, ToolMessage } from "@langchain/core/messages";
// import { TRANSCRIBE_AGENT_AUDIO_DONE } from "./transcribe-agent-prompt";
// import { ToolCall } from "node_modules/@langchain/core/dist/messages/tool";
// import { GoogleGenAI, mcpToTool, Session } from "@google/genai";
// import { th } from "zod/locales";

// export class TranscribeAgent extends EventEmitter{
//     static STATUS_UNINIT = "uninit";
//     static STATUS_RUNNING = "running";
//     static STATUS_END = "end";

//     #config: TranscribeAgentConfigHelper;
//     #embed: GoogleGenerativeAIEmbeddings;
//     #embedLlm: ChatGoogleGenerativeAI;
//     #inMemoryVectorStore: MemoryVectorStore;
//     #genai: GoogleGenAI;
//     #liveSession: Session | null;

//     #status: string = TranscribeAgent.STATUS_UNINIT;
//     #speechStream: ReturnType<typeof SpeechClient.prototype.streamingRecognize> | null = null;
//     #bufferedAudio: Buffer[] = [];
//     #streamProcessing: boolean = false;
    
//     toolkitTodo: TodoToolkit
//     remember: RememberToolkit;

//     transcripts:Transcript[]
//     summary: string

//     constructor(config: TranscribeAgentConfig) {
//         super();
        
//         this.#config = new TranscribeAgentConfigHelper(config);
//         this.#embed = new GoogleGenerativeAIEmbeddings(this.#config.googleGenerativeAIEmbeddings());
//         this.#embedLlm = new ChatGoogleGenerativeAI(this.#config.chatGoogleGenerativeAI());
//         this.#inMemoryVectorStore = new MemoryVectorStore(this.#embed);
//         this.#genai = new GoogleGenAI(this.#config.googleGenAI());
//         this.#liveSession = null;

//         this.#status = TranscribeAgent.STATUS_UNINIT;
//         this.#speechStream =  null;
//         this.#streamProcessing = false;

//         this.toolkitTodo = new TodoToolkit();
//         this.remember = new RememberToolkit({
//             name: "remember-toolkit",
//             description: "A toolkit for remembering and forgetting information. It uses an in-memory vector store to store information.",
//             vectorStore: this.#inMemoryVectorStore,
//         }, this.#embedLlm);

//         // this.#agent = createReactAgent({
//         //     llm: this.#llm,
//         //     tools: [
//         //         ...this.toolkitTodo.getTools(),
//         //         ...this.remember.getTools(),
//         //     ],
//         //     prompt:this.#config.agentSystemPrompt,
//         //     postModelHook: async (event) => {
//         //         for(const message of event.messages) {
//         //             if (message instanceof ToolMessage) {
//         //                 this.emit("ai:tool:result", message.content, message);
//         //             }
//         //             if (message instanceof HumanMessage) {
//         //                 this.emit("ai:request", message);
//         //             }
//         //             if (message instanceof AIMessage) {
//         //                 if(typeof message.content === "string") {
//         //                     this.emit("ai:response", message.content, message);
//         //                 }else{
//         //                     for (const content of message.content) {
//         //                         if(typeof content === "string") {
//         //                             this.emit("ai:response", content, message);
//         //                             continue;
//         //                         }else if(typeof content === "object") {
//         //                             if (typeof content.type==='undefined') {
//         //                                 // 타입이 없으면 보통 function call 입니다.
//         //                                 continue;
//         //                             }
//         //                             this.emit("ai:response", content, message);
//         //                         }
//         //                         this.emit("ai:response", content, message);
//         //                     }
//         //                 }
//         //                 if(message.tool_calls){
//         //                     for (const toolCall of message.tool_calls) {
//         //                         this.emit("ai:tool:call", toolCall, message);
//         //                     }
//         //                 }
//         //             }
//         //         }
//         //         return event;
//         //     }
//         // })

//         this.transcripts = [];
//         this.summary = "";

//         if (!this.#config.lazy) {
//             this.start();
//         }
//     }

//     get status(): string {
//         return this.#status;
//     }

//     async start(){
//         if (this.#status !== TranscribeAgent.STATUS_UNINIT) {
//             throw new Error("TranscribeAgent is already started or ended.");
//         }
//         this.#status = TranscribeAgent.STATUS_RUNNING;

//         this.emit("start");

//         this.toolkitTodo.mcpServer

//         this.#liveSession = await this.#genai.live.connect({
//             model: this.#config.llmModel,
//             callbacks:{
//                 onopen: () => {
//                     this.emit("start");
//                 },
//                 onmessage: (message) => {
//                     message.serverContent?.inputTranscription
//                 },
//                 onclose: () => {
//                     this.emit("end");
//                 },
//                 onerror: (error) => {
//                     this.emit("error", error, this.#prepareMetadata(undefined));
//                 }
//             },
            
//             // config: this.#config.liveConnectConfig({
//             //     mcp: [
//             //         this.toolkitTodo,
//             //         this.toolkitTodo
//             //     ]
//             // }),
//         })









//         this.on("transcribe:done", (done)=>{
//             (async()=>{
//                 this.transcripts.push({
//                     requestId: done.requestId,
//                     transcriptId: randomUUID(),
//                     text: done.represent
//                 })
//                 this.#agent.invoke({
//                     messages: [
//                         new HumanMessage(`<speech>\n${done.represent}\n</speech>`)
//                     ]
//                 })
//             })()
//         })
//         this.on("stream:queue#unsafe", (meta) => {
//             if (this.#bufferedAudio.length === 0) {
//                 this.#streamProcessing = false;
//                 this.emit("stream:done", meta);
//                 return;
//             }
//             this.#streamProcessing = true;
//             let sumBuffer = 0;
//             // 현재 이벤트에서 처리할 오디오 청크를 모읍니다.
//             const thisEventBufferedAudio: Buffer[] = [];
//             let i = 0;
//             for (; i < this.#bufferedAudio.length; i++) {
//                 const part = this.#bufferedAudio[i] as Buffer;
//                 if (sumBuffer + part.length > this.#config.googleMaxStreamSizeBytes) {
//                     break;
//                 }
//                 sumBuffer += part.length;
//                 thisEventBufferedAudio.push(part);
//             }
//             this.#bufferedAudio = this.#bufferedAudio.slice(i);

//             // 다른 javascript 이벤트 루프에서 처리할 수 있도록 비동기적으로 실행합니다.
//             (async () => {
//                 const requestId = randomUUID();
//                 const speechStream = this.#speech.streamingRecognize(this.#config.speechSessionConfig())
//                     .on("close", () => {
//                         this.emit("stream:close", speechStream, this.#prepareMetadata(requestId));
//                         this.#speechStream = null;
//                         this.emit("stream:queue#unsafe", this.#prepareMetadata(requestId));
//                     })
//                     .on("finish", () => {
//                         speechStream.destroy();
//                     })
//                     .on('error', this.#handlerFatalError(requestId))
//                     .on('data', this.#handlerSpeechOnData(requestId))
//                 this.emit("stream:open", speechStream, this.#prepareMetadata(requestId));
//                 this.#speechStream = speechStream;

//                 for (const part of thisEventBufferedAudio) {
//                     this.emit("stream:send", this.#speechStream, part, meta);
//                     this.#speechStream.write(part);
//                 }
//                 this.#speechStream.end();
//             })()
//         })
//     }

//     // 16000Hz, 16bit, mono PCM 오디오 데이터를 전송
//     sendAudioPartPcm(pcm16k16bitMono: Buffer, params?: TranscribeSendParams): TranscribeSendResult {
//         const requestId = params?.requestId ?? randomUUID();
//         if (this.#status !== TranscribeAgent.STATUS_RUNNING) {
//             const err = new Error("TranscribeAgent is not running.")
//             this.#emitError(err, requestId);
//             throw err;
//         }
//         if (this.#speechStream) {
//             const err = new Error("TranscribeAgent already has an active speech stream.");
//             this.#emitError(err, requestId);
//             throw err;
//         }

//         this.#bufferedAudio.push(...this.splitAudioPartPcm(pcm16k16bitMono));
//         if (!this.#streamProcessing){
//             this.emit("stream:queue#unsafe", this.#prepareMetadata(requestId))
//         }

//         return {
//             requestId,
//         };
//     }

//     canSendByOnceAudioPartPcm(pcm16k16bitMono: Buffer): boolean {
//         return pcm16k16bitMono.length <= this.#config.speechChunkSize;
//     }

//     splitAudioPartPcm(pcm16k16bitMono: Buffer): Buffer[] {
//         const chunkSize = this.#config.speechChunkSize;
//         const chunks: Buffer[] = [];
//         for (let i = 0; i < pcm16k16bitMono.length; i += chunkSize) {
//             chunks.push(pcm16k16bitMono.subarray(i, Math.min(i + chunkSize, pcm16k16bitMono.length)));
//         }
//         return chunks;
//     }
    
//     async summarize(){
//         const result = await this.#agent.invoke({
//             messages: [
//                 new HumanMessage(TRANSCRIBE_AGENT_AUDIO_DONE)
//             ]
//         })
//         const lastMessage = result.messages[result.messages.length - 1];
//         this.summary = lastMessage.content;
//         this.emit("summary:done", this.summary, this.#prepareMetadata(undefined));
//         return this.summary;
//     }

//     close(){
//         console.log("TranscribeAgent close called");
//         if (this.#status !== TranscribeAgent.STATUS_RUNNING) {
//             throw new Error("TranscribeAgent is not running.");
//         }
//         if (this.#speechStream) {
//             this.#speechStream.destroy();
//             this.#speechStream = null;
//             this.#streamProcessing = false;
//         }
//         this.#status = TranscribeAgent.STATUS_END;
//         this.emit("end");
//     }

//     on(event: "start", listener: () => void): this;
//     on(event: "end", listener: () => void): this;
//     on(event: "ai:request", listener: (request: HumanMessage) => void): this;
//     on(event: "ai:tool:call", listener: (call: ToolCall, raw: AIMessage) => void): this;
//     on(event: "ai:tool:result", listener: (content: MessageContentSingle, tool: ToolMessage) => void): this;
//     on(event: "ai:response", listener: (content: MessageContentSingle, raw: AIMessage) => void): this;
//     on(event: "summary:done", listener: (summary:string, meta:TranscribeEventMetadata) => void): this;
//     // on(event: "transcribe:delta", listener: (delta: TranscriptCandidate, meta:TranscribeEventMetadata) => void): this;
//     on(event: "transcribe:done", listener: (done: TranscriptDone, meta:TranscribeEventMetadata) => void): this;
//     on(event: "error", listener: (error: Error, meta:TranscribeEventMetadata) => void): this;
//     on(event: "fatal", listener: (error: Error, meta:TranscribeEventMetadata) => void): this;
//     on(event: string | symbol, listener: (...args: any[]) => void): this {
//         this.#ensureHandlerStart(event, listener);
//         return super.on(event, listener.bind(this));
//     }

//     once(event: "start", listener: () => void): this;
//     once(event: "error", listener: (error: Error) => void): this;
//     once(event: "fatal", listener: (error: Error) => void): this;
//     once(event: string | symbol, listener: (...args: any[]) => void): this {
//         this.#ensureHandlerStart(event, listener);
//         return super.once(event, listener);
//     }

//     #prepareMetadata(requestId: string | undefined): TranscribeEventMetadata {
//         return {
//             requestId,
//         };
//     }

//     #ensureHandlerStart(eventName: string | symbol, listener: (...args: any[]) => void): void {
//         if (eventName === "start" && this.#status === TranscribeAgent.STATUS_RUNNING) {
//             listener();
//         }
//     }

//     #handlerFatalError(requestId?: string): (error: Error) => void {
//         return (error: Error) => {
//             console.error("TranscribeAgent error:", error);
//             this.emit("error", error);
//             this.emit("fatal", error, { requestId });
//         };
//     }

//     #handlerError(requestId?: string): (error: Error) => void {
//         return (error: Error) => {
//             console.error("TranscribeAgent error:", error);
//             this.emit("error", error);
//         };
//     }

//     #handlerSpeechOnData(requestId: string): (data: SpeechResponse) => void {
//         return (data: SpeechResponse) => {
//             if(data.speechEventType === 'END_OF_SINGLE_UTTERANCE') {
//                 return;
//             }
//             if (data.results.length === 0) {
//                 console.warn("No results in speech response, skipping.", data);
//                 return;
//             }
//             const isFinal =data.results[0]?.isFinal ?? false;
//             if (isFinal) {
//                 const resultDone: TranscriptDone = {
//                     requestId,
//                     represent: data.results[0]?.alternatives[0]?.transcript || "",
//                 };
//                 this.emit("transcribe:done", resultDone, this.#prepareMetadata(requestId));
//                 return
//             }
//             const delta: TranscriptCandidate = {
//                 requestId,
//                 represent: "",
//                 parts: []
//             }

//             for (const result of data.results) {
//                 const mostPosibleAlternative = result.alternatives[0];
//                 if (!mostPosibleAlternative) {
//                     this.#emitError(new Error("No alternatives found in the result."), requestId);
//                     return
//                 }

//                 // 100% 확실한 경우, stableRepresent에 저장
//                 if (result.stability === 1.0){
//                     delta.stableRepresent = delta.stableRepresent?.concat(mostPosibleAlternative.transcript) ?? mostPosibleAlternative.transcript;
//                 }

//                 delta.represent = delta.represent.concat(mostPosibleAlternative.transcript);
//                 const part: TranscriptCandidatePart = {
//                     alternatives: []
//                 };
//                 for (const resultAlternative of result.alternatives) {
//                     const partAlternative: TranscriptCandidateAlternative = {
//                         represent: resultAlternative.transcript,
//                         confidence: resultAlternative.confidence
//                     };
//                     part.alternatives.push(partAlternative);
//                 }
//                 delta.parts.push(part);
//             }
//             this.emit("transcribe:delta", delta, this.#prepareMetadata(requestId));
//         }
//     }

//     #emitError(error: Error, requestId: string | undefined): void {
//         console.error("TranscribeAgent error:", error);
//         this.emit("error", error, { requestId });
//     }
// }