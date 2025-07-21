import { protos, SpeechClient } from "@google-cloud/speech";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIChatInput, GoogleGenerativeAIEmbeddings, GoogleGenerativeAIEmbeddingsParams } from "@langchain/google-genai";
import EventEmitter from "events";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TRANSCRIBE_AGENT_SYSTEM_PROMPT } from "./transcribe-agent-prompt";
import { EndSensitivity, GoogleGenAIOptions, LiveConnectConfig, mcpToTool, MediaResolution, Modality, StartSensitivity } from "@google/genai";

export interface TranscribeAgentConfig {
    lazy?: boolean;
    apiKey?: string | { llm: string, embed: string, speech: string };
    model?: string;
    embed?: string;
    lang?: string;
    speechChunkSize?: number; // in bytes
    streamAutoClose?: number
}

export class TranscribeAgentConfigHelper {
    #userConfig: TranscribeAgentConfig;
    constructor(config: TranscribeAgentConfig) {
        this.#userConfig = config;
    }

    get lazy(): boolean {
        return this.#userConfig.lazy ?? false;
    }

    get llmApiKey(): string {
        const temp = (this.#userConfig.apiKey) ?? process.env.GOOGLE_API_KEY;
        if (temp === undefined) {
            throw new Error("API key is not defined. Please set GOOGLE_API_KEY environment variable or provide it in the config.");
        }
        if (typeof temp === "string") {
            return temp;
        } else {
            return temp.llm;
        }
    }

    get embedApiKey(): string {
        const temp = (this.#userConfig.apiKey) ?? process.env.GOOGLE_API_KEY;
        if (temp === undefined) {
            throw new Error("API key is not defined. Please set GOOGLE_API_KEY environment variable or provide it in the config.");
        }
        if (typeof temp === "string") {
            return temp;
        } else {
            return temp.embed;
        }
    }

    get speechApiKey(): string {
        const temp = (this.#userConfig.apiKey) ?? process.env.GOOGLE_API_KEY;
        if (temp === undefined) {
            throw new Error("API key is not defined. Please set GOOGLE_API_KEY environment variable or provide it in the config.");
        }
        if (typeof temp === "string") {
            return temp;
        } else {
            return temp.speech;
        }
    }

    get speechChunkSize(): number {
        // PCM 데이터를 작은 청크로 나누어 전송하기 위해 사용, google speech-to-text API는 최대 10MB의 청크를 지원
        return this.#userConfig.speechChunkSize ?? 16000 * 2 * 30; // 30초 분량의 PCM 데이터, 16kHz, 16bit 모노
    }
    get streamAutoClose(): number {
        return this.#userConfig.streamAutoClose ?? 1000; // 1초 동안 아무런 데이터가 없으면 스트림을 자동으로 종료
    }
    get googleMaxStreamSizeBytes(): number {
        return 16000 * 2 * 180;
    }
    get llmModel(): string {
        return this.#userConfig.model ?? "gemini-2.5-flash";
    }
    
    chatGoogleGenerativeAI(): GoogleGenerativeAIChatInput {
        return {
            apiKey: this.llmApiKey,
            model: this.#userConfig.model ?? "gemini-2.5-flash",
            temperature: 0.3,
            maxRetries: 3,
        };
    }
    
    googleGenAI(): GoogleGenAIOptions {
        return {
            apiKey: this.llmApiKey,
        };
    }

    liveConnectConfig(): LiveConnectConfig {
        
        return {
            responseModalities: [Modality.AUDIO],
            mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
            outputAudioTranscription: true,
            // generationConfig:{},
            tools:[

            ],
            inputAudioTranscription: {},
            systemInstruction: "You are a helpful assistant and answer in a friendly tone.",
            contextWindowCompression: {
                triggerTokens: '25600',
                slidingWindow: { targetTokens: '12800' },
            },
            realtimeInputConfig: {
            //   automaticActivityDetection: {disabled: true},
              automaticActivityDetection: {
                disabled: false, // default
                startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_LOW,
                endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
                prefixPaddingMs: 20,
                silenceDurationMs: 100,
              }
            }
        };
    }

    googleGenerativeAIEmbeddings(): GoogleGenerativeAIEmbeddingsParams {
        return {
            apiKey: this.embedApiKey,
            model: this.#userConfig.embed ?? "gemini-embedding-exp-03-07",
            maxRetries: 3,
        }
    }

    speechClient(): ConstructorParameters<typeof SpeechClient>[0] {
        return {
            apiKey: this.speechApiKey,
            
        };
    }
    
    speechSessionConfig(): protos.google.cloud.speech.v1.IStreamingRecognitionConfig {
        return {
            config: {
                encoding: "LINEAR16",
                sampleRateHertz: 16000,
                languageCode: this.#userConfig.lang ?? "ko-KR",
            },
            interimResults: true,
            singleUtterance: true,
        }
    }
    
    get agentSystemPrompt(): string {
        return TRANSCRIBE_AGENT_SYSTEM_PROMPT;
    }
}