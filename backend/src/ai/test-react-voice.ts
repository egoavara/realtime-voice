import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { readFileSync, writeFileSync, unlinkSync } from "fs";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { promisify } from "util";
import { exec } from "child_process";
import { convertAudioToPcm, pcmToBase64 } from "./util";

import * as fs from "node:fs";
import { EndSensitivity, GoogleGenAI, LiveConnectConfig, LiveServerMessage, MediaResolution, Modality, StartSensitivity } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
// WARNING: Do not use API keys in client-side (browser based) applications
// Consider using Ephemeral Tokens instead
// More information at: https://ai.google.dev/gemini-api/docs/ephemeral-tokens

// Half cascade model:
// const model = "gemini-live-2.5-flash-preview"

// Native audio output model:
const model = "gemini-live-2.5-flash-preview"

const config:LiveConnectConfig = {
  responseModalities: [Modality.TEXT],
  mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
  outputAudioTranscription: true,
  systemInstruction: "You are a helpful assistant and answer in a friendly tone.",
//   speechConfig: {
//     voiceConfig: {
//       prebuiltVoiceConfig: {
//         voiceName: 'Zephyr',
//       }
//     }
//   },
    inputAudioTranscription: {},
  contextWindowCompression: {
      triggerTokens: '25600',
      slidingWindow: { targetTokens: '12800' },
  },
  realtimeInputConfig: {
    automaticActivityDetection: {disabled: true},
    // automaticActivityDetection: {
    //   disabled: false, // default
    //   startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_LOW,
    //   endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
    //   prefixPaddingMs: 20,
    //   silenceDurationMs: 100,
    // }
  }
};

async function live() {
    console.log("1. live() 함수 시작");
    const responseQueue: LiveServerMessage[] = [];

    async function waitMessage() {
        let done = false;
        let message = undefined;
        while (!done) {
            message = responseQueue.shift();
            if (message) {
                done = true;
            } else {
                console.log("No message yet, waiting...");
                await new Promise((resolve) => setTimeout(resolve, 800));
            }
        }
        console.log("Received message:", message);
        return message;
    }

    async function handleTurn() {
        const turns = [];
        let done = false;
        while (!done) {
            const message = await waitMessage();
            turns.push(message);
            console.log("Received turn:", message);
            if (message?.serverContent && message.serverContent.turnComplete) {
                done = true;
            }
        }
        console.log("All turns received:", turns);
        return turns;
    }

    console.log("2. AI 연결 시도 중...");
    const session = await ai.live.connect({
        model: model,
        callbacks: {
            onopen: function () {
                console.log('3. 연결 열림 (Opened)');
            },
            onmessage: function (message) {
                console.log("---------------")
                console.log('4. 메시지 수신:', );
                console.log(JSON.stringify(message, undefined, 4));
                console.log("---------------")
                responseQueue.push(message);
            },
            onerror: function (e) {
                console.log('5. 에러 발생:', e.message);
            },
            onclose: function (e) {
                console.error(e)
                console.log('6. 연결 종료:', e.reason);
            },
        },
        config: config,
    });

    console.log("7. 세션 연결 완료");

    // Ensure audio conforms to API requirements (16-bit PCM, 16kHz, mono)
    console.log("8. MP3 to PCM 변환 시작");
    // const pcm = await convertAudioToPcm("./src/ai/sample/tts.mp3");
    const pcm = await convertAudioToPcm("./src/ai/sample/test.mp3");
    console.log("9. PCM 변환 완료, 크기:", pcm.length);
    
    const base64Audio = pcmToBase64(pcm);
    console.log("10. Base64 변환 완료, 길이:", base64Audio.length);

    // If already in correct format, you can use this:
    // const fileBuffer = fs.readFileSync("sample.pcm");
    // const base64Audio = Buffer.from(fileBuffer).toString('base64');

    console.log("11. 오디오 데이터 전송 시도");
    session.sendRealtimeInput({activityStart:{}})
    session.sendRealtimeInput(
        {
            audio: {
                data: base64Audio,
                mimeType: "audio/pcm;rate=16000"
            }
        }
    );
    session.sendRealtimeInput({activityEnd:{}})
    console.log("12. 오디오 데이터 전송 완료");

    console.log("13. 응답 대기 중...");
    const turns = await handleTurn();
    console.log("14. 응답 받음:", turns);
    session.close();
}

async function main() {
    await live().catch((e) => console.error('got error', e));
    process.exit(0);
}

main();
