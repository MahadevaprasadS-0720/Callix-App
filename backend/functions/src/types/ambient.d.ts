declare const Buffer: {
  from: (data: string | any, encoding?: string) => any;
};

declare module 'firebase-functions' {
  export interface Request {
    body: any;
    query: any;
    params: any;
    headers: any;
    method: string;
  }
  export interface Response {
    status: (code: number) => Response;
    json: (body: any) => void;
    send: (body: any) => void;
  }
  export const https: {
    onRequest: (handler: (req: any, res: any) => any) => any;
  };
  export const firestore: {
    document: (path: string) => {
      onUpdate: (handler: (change: any, context: any) => any) => any;
      onCreate: (handler: (snap: any, context: any) => any) => any;
    };
  };
}

declare module 'cors' {
  function cors(options?: any): (req: any, res: any, next: () => void) => void;
  export default cors;
}

declare module '@anthropic-ai/sdk' {
  export default class Anthropic {
    constructor(options?: { apiKey?: string });
    messages: {
      create: (params: any) => Promise<{
        content: Array<{ type: string; text?: string }>;
      }>;
    };
  }
}

declare module '@deepgram/sdk' {
  export interface DeepgramClient {
    listen: {
      prerecorded: {
        transcribeFile: (buffer: any, options: any) => Promise<{
          result: {
            results: {
              channels: Array<{ alternatives: Array<{ transcript: string; confidence: number }> }>;
              utterances?: Array<{ speaker: number; transcript: string; start: number; end?: number; confidence: number }>;
            };
          };
        }>;
      };
    };
  }
  export function createClient(apiKey: string): DeepgramClient;
}

declare module 'firebase-admin' {
  export const apps: any[];
  export function initializeApp(options?: any): any;
  export const credential: {
    applicationDefault: () => any;
    cert: (serviceAccount: any) => any;
  };
  export function firestore(): any;
  export function messaging(): any;
}
