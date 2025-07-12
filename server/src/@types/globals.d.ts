// Node.js 全局类型声明
declare module 'fs' {
  export * from 'node:fs';
}

declare module 'path' {
  export * from 'node:path';
}

declare module 'util' {
  export * from 'node:util';
}

declare module 'mongoose' {
  export * from '@types/mongoose';
}

declare global {
  const process: NodeJS.Process;
  const __dirname: string;
  const __filename: string;
  const Buffer: BufferConstructor;
  const global: NodeJS.Global;
}

export {};
