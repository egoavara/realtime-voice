import { protos } from "@google-cloud/speech";
import { MessageContentImageUrl, MessageContentText } from "@langchain/core/messages";


export type SpeechAlternative = {
  transcript: string;
  confidence: number;
  words: protos.google.cloud.speech.v1.IWordInfo[];
}

export type SchemeResult = {
  alternatives: Required<SpeechAlternative>[];
  channelTag: number;
  resultEndTime: protos.google.protobuf.IDuration;
  languageCode: string;
  isFinal: boolean;
  stability: number;
}

export type SpeechResponse = {
  results: SchemeResult[];
  speechEventType: string
  totalBilledTime: protos.google.protobuf.IDuration,
  speechEventTime: protos.google.protobuf.IDuration,
  speechAdaptationInfo: protos.google.cloud.speech.v1.ISpeechAdaptationInfo,
  requestId: string
}

export interface TranscriptCandidateAlternative {
    represent: string;
    confidence: number;
}

export interface TranscriptCandidatePart {
    alternatives: TranscriptCandidateAlternative[];
}

export interface TranscriptCandidate{
    requestId: string;
    represent: string;
    stableRepresent?: string;
    parts: TranscriptCandidatePart[]
}

export interface TranscriptDone{
    requestId: string;
    represent: string;
}

export interface TranscribeSendParams{
    requestId?: string;
}

export interface TranscribeSendResult{
    requestId: string;
}

export interface TranscribeEventMetadata {
    requestId?: string;
}

export interface Transcript {
    requestId: string;
    transcriptId: string;
    text: string;
}

export type MessageContentSingle = string | MessageContentText | MessageContentImageUrl | (Record<string, any> & {
    type?: "text" | "image_url" | string;
}) | (Record<string, any> & {
    type?: never;
});