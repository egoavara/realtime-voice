import Ffmpeg from "fluent-ffmpeg";
import path from "path";
import { readFileSync, unlinkSync } from "fs";

// 시스템 ffmpeg 사용 (WSL/Linux 환경)
Ffmpeg.setFfmpegPath('/home/egoavara/miniconda3/bin/ffmpeg');

// MP3를 PCM으로 변환하는 함수
export async function convertAudioToPcm(audioPath: string): Promise<Buffer> {
  const tempPcmPath = path.join(path.dirname(audioPath), 'temp_audio.pcm');
  
  return new Promise((resolve, reject) => {
    Ffmpeg(audioPath)
      .outputOptions([
        '-acodec pcm_s16le',  // 16-bit PCM
        '-ar 16000',          // 16kHz 샘플링 레이트
        '-ac 1',              // 모노
        '-f s16le'            // raw PCM format
      ])
      .output(tempPcmPath)
      .on('end', () => {
        const pcmBuffer = readFileSync(tempPcmPath);
        // 임시 파일 삭제
        unlinkSync(tempPcmPath);
        resolve(pcmBuffer);
      })
      .on('error', (err) => {
        reject(err);
      })
      .run();
  });
}

// PCM 버퍼를 base64로 인코딩
export function pcmToBase64(pcmBuffer: Buffer): string {
  return pcmBuffer.toString('base64');
}

// Base64를 PCM 버퍼로 디코딩  
export function base64ToPcm(base64: string): Buffer {
  return Buffer.from(base64, 'base64');
}