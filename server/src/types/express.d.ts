// 简化版 Express 类型定义

// Request 接口
interface Request {
  body: any;
  params: { [key: string]: string };
  query: { [key: string]: any };
  user?: any;
  headers: { [key: string]: string | undefined };
  method: string;
  url: string;
  path: string;
}

// Response 接口
interface Response {
  status(code: number): Response;
  json(obj: any): void;
  send(data: any): void;
  end(): void;
  setHeader(name: string, value: string): void;
  redirect(url: string): void;
}

// NextFunction 接口
interface NextFunction {
  (err?: any): void;
}

// 全局 Express 类型
declare global {
  var Request: Request;
  var Response: Response;
  var NextFunction: NextFunction;
}

// Node.js 全局变量
declare global {
  const process: {
    cwd(): string;
    env: { [key: string]: string | undefined };
  };
  const __dirname: string;
  const __filename: string;
  const Buffer: any;
  const console: {
    log(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
  };
}

export { Request, Response, NextFunction };
