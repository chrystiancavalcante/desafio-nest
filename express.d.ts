// Arquivo: @types/express/index.d.ts

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Response } from 'express';

declare module 'express' {
  interface Response {
    [x: string]: any;
    render(
      view: string,
      locals?: Record<string, any>,
      callback?: (err: Error | null, html: string) => void,
    ): void;
  }
}
