// 全局类型定义文件，补充缺失的类型定义

// Node.js 全局变量类型扩展
declare global {
  var require: NodeRequire;
  var module: NodeModule;
  var process: NodeJS.Process & {
    exit(code?: number): never;
  };
  var global: typeof globalThis;
  var console: Console;
  var Buffer: BufferConstructor;
  var __dirname: string;
  var __filename: string;
}

// Express 类型定义扩展
declare module 'express' {
  export interface Request {
    body: any;
    params: any;
    query: any;
    user?: any;
    headers: any;
  }
  
  export interface Response {
    status(code: number): this;
    json(obj: any): this;
    send(data: any): this;
    setHeader(name: string, value: string): this;
  }
  
  export interface NextFunction {
    (err?: any): void;
  }
  
  export interface Router {
    get(path: string, ...handlers: Function[]): void;
    post(path: string, ...handlers: Function[]): void;
    put(path: string, ...handlers: Function[]): void;
    delete(path: string, ...handlers: Function[]): void;
    patch(path: string, ...handlers: Function[]): void;
    use(path: string, router: Router): void;
    use(handler: Function): void;
    use(path: string, ...handlers: Function[]): void;
  }
  
  export interface Application {
    get(path: string, ...handlers: Function[]): void;
    post(path: string, ...handlers: Function[]): void;
    put(path: string, ...handlers: Function[]): void;
    delete(path: string, ...handlers: Function[]): void;
    patch(path: string, ...handlers: Function[]): void;
    use(...handlers: Function[]): void;
    listen(port: number, callback?: Function): void;
  }
  
  function express(): Application;
  namespace express {
    function Router(): Router;
  }
  export = express;
}

// dotenv 模块声明
declare module 'dotenv' {
  export interface DotenvParseOutput {
    [name: string]: string;
  }
  
  export interface DotenvConfigOptions {
    path?: string;
    encoding?: string;
    debug?: boolean;
  }
  
  export interface DotenvConfigOutput {
    error?: Error;
    parsed?: DotenvParseOutput;
  }
  
  export function config(options?: DotenvConfigOptions): DotenvConfigOutput;
  export function parse(src: string | Buffer): DotenvParseOutput;
}

// Node.js 模块声明
declare module 'fs' {
  export function readFile(path: string, encoding: string, callback: (err: any, data: any) => void): void;
  export function writeFile(path: string, data: any, callback: (err: any) => void): void;
  export function readdir(path: string, callback: (err: any, files: string[]) => void): void;
  export function mkdir(path: string, options: any, callback: (err: any) => void): void;
  export const promises: {
    readFile(path: string, encoding?: string): Promise<any>;
    writeFile(path: string, data: any): Promise<void>;
    readdir(path: string): Promise<string[]>;
    mkdir(path: string, options?: any): Promise<void>;
  };
}

declare module 'path' {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
  export function dirname(path: string): string;
  export function basename(path: string): string;
  export function extname(path: string): string;
}

declare module 'util' {
  export function promisify<T extends Function>(fn: T): T;
}

declare module 'mongoose' {
  export interface Document {
    _id?: any;
    id?: any;
    save(): Promise<this>;
    toObject(): any;
    toJSON(): any;
    isModified(path?: string): boolean;
    markModified(path: string): void;
  }
  
  export interface SchemaDefinition {
    [path: string]: any;
  }
  
  export interface SchemaOptions {
    _id?: boolean;
    id?: boolean;
    timestamps?: boolean;
    versionKey?: string | boolean;
    [key: string]: any;
  }
  
  export class Schema<T = any> {
    constructor(definition?: SchemaDefinition, options?: SchemaOptions);
    add(obj: SchemaDefinition): void;
    pre(method: string, fn: Function): void;
    post(method: string, fn: Function): void;
    static Types: {
      ObjectId: any;
      String: any;
      Number: any;
      Date: any;
      Boolean: any;
      Array: any;
      Mixed: any;
    };
  }
  
  export interface Model<T extends Document> {
    find(filter?: any): Query<T[]>;
    findOne(filter?: any): Query<T | null>;
    findById(id: any): Query<T | null>;
    findByIdAndUpdate(id: any, update: any, options?: any): Query<T | null>;
    findOneAndUpdate(filter: any, update: any, options?: any): Query<T | null>;
    create(doc: any): Promise<T>;
    insertMany(docs: any[]): Promise<T[]>;
    updateOne(filter: any, update: any): Promise<any>;
    updateMany(filter: any, update: any): Promise<any>;
    deleteOne(filter: any): Promise<any>;
    deleteMany(filter: any): Promise<any>;
    countDocuments(filter?: any): Query<number>;
    new (doc?: any): T;
  }
  
  export interface Query<T> {
    select(fields: string | object): Query<T>;
    populate(path: string | object): Query<T>;
    sort(fields: string | object): Query<T>;
    limit(val: number): Query<T>;
    skip(val: number): Query<T>;
    exec(): Promise<T>;
    then<U>(onFulfilled?: (value: T) => U, onRejected?: (reason: any) => U): Promise<U>;
    catch<U>(onRejected?: (reason: any) => U): Promise<T | U>;
  }
  
  export interface Connection {
    readyState: number;
    on(event: string, listener: Function): void;
    once(event: string, listener: Function): void;
  }
  
  export function model<T extends Document>(name: string, schema?: Schema<T>, collection?: string): Model<T>;
  export function connect(uri: string, options?: any): Promise<Connection>;
  export function disconnect(): Promise<void>;
  
  export const connection: Connection;
  export { Schema as default };
}

declare global {
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

export {};
