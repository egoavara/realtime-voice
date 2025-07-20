import { protos } from "@google-cloud/speech";


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
