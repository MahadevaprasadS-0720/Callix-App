import { z } from 'zod';
import * as dotenv from 'dotenv';

declare const process: {
  env: Record<string, string | undefined>;
};

dotenv.config();

const envSchema = z.object({
  FIREBASE_PROJECT_ID: z.string().default('audio-guardian-dev'),
  DEEPGRAM_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_PHONE: z.string().optional(),
  HIGH_RISK_THRESHOLD: z.coerce.number().default(75),
  CRITICAL_RISK_THRESHOLD: z.coerce.number().default(90),
});

export const env = envSchema.parse(process.env);
