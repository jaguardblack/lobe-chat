import OpenAI from 'openai';

import { ILobeAgentRuntimeErrorType } from '../error';
import { ChatStreamPayload } from './chat';

export interface ChatCompletionErrorPayload {
  [key: string]: any;
  endpoint?: string;
  error: object;
  errorType: ILobeAgentRuntimeErrorType;
  provider: ModelProvider;
}

export interface CreateChatCompletionOptions {
  chatModel: OpenAI;
  payload: ChatStreamPayload;
}

export enum ModelProvider {
  Anthropic = 'anthropic',
  AzureOpenAI = 'azureOpenAI',
  Bedrock = 'bedrock',
  ChatGLM = 'chatglm',
  Google = 'google',
  Mistral = 'mistral',
  OpenAI = 'openai',
  Tongyi = 'tongyi',
  ZhiPu = 'zhipu',
}
