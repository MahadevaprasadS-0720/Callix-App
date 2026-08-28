import { createClient, DeepgramClient } from '@deepgram/sdk';
import { env } from '../config/envConfig';
import { logger } from '../utils/logger';
import { TranscriptSegment, SpeakerRole } from '../types/backend.types';

export class DeepgramService {
  private deepgram: DeepgramClient | null = null;

  constructor() {
    if (env.DEEPGRAM_API_KEY) {
      this.deepgram = createClient(env.DEEPGRAM_API_KEY);
    }
  }

  /**
   * Transcribe real audio buffer using Deepgram nova-2 model with diarization & timestamps
   */
  public async transcribeAudioBuffer(
    audioBuffer: any,
    mimetype: string = 'audio/wav'
  ): Promise<{ segments: TranscriptSegment[]; fullTranscript: string; duration: number }> {
    if (!this.deepgram) {
      logger.warn('DEEPGRAM_API_KEY is not configured in backend.');
      return { segments: [], fullTranscript: '', duration: 0 };
    }

    try {
      const response = await this.deepgram.listen.prerecorded.transcribeFile(
        audioBuffer,
        {
          model: 'nova-2',
          smart_format: true,
          detect_language: true,
          diarize: true,
          punctuate: true,
          utterances: true,
          keywords: [
            'OTP:3',
            'UPI:3',
            'AnyDesk:3',
            'Customs:3',
            'Digital Arrest:3',
            'KYC:2',
            'PAN card:2',
            'QuickSupport:2',
            'MDMA:3',
          ],
        }
      );

      const segments: TranscriptSegment[] = [];
      const utterances = response.result?.results?.utterances;
      let duration = 0;

      if (utterances && utterances.length > 0) {
        for (let i = 0; i < utterances.length; i++) {
          const u = utterances[i];
          const speakerRole: SpeakerRole = u.speaker === 0 ? 'caller' : 'user';
          segments.push({
            segmentId: `seg_${Date.now()}_${i}`,
            speaker: speakerRole,
            text: u.transcript,
            timestampOffset: u.start,
            confidence: u.confidence,
          });
          if (u.end && u.end > duration) {
            duration = Math.ceil(u.end);
          }
        }
      } else {
        const primaryTranscript = response.result?.results?.channels[0]?.alternatives[0]?.transcript;
        if (primaryTranscript) {
          segments.push({
            segmentId: `seg_${Date.now()}_0`,
            speaker: 'caller',
            text: primaryTranscript,
            timestampOffset: 0,
            confidence: response.result?.results?.channels[0]?.alternatives[0]?.confidence || 0.95,
          });
        }
      }

      const fullTranscript = segments.map(s => `${s.speaker.toUpperCase()}: ${s.text}`).join('\n');

      return {
        segments,
        fullTranscript,
        duration,
      };
    } catch (err) {
      logger.error('Deepgram STT transcription error', { error: String(err) });
      throw err;
    }
  }
}

export const deepgramService = new DeepgramService();
