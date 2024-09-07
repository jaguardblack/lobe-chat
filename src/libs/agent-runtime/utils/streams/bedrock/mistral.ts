import { InvokeModelWithResponseStreamResponse } from '@aws-sdk/client-bedrock-runtime';

import { nanoid } from '@/utils/uuid';

import { ChatStreamCallbacks } from '../../../types';
import {
  StreamProtocolChunk,
  StreamStack,
  createCallbacksTransformer,
  createSSEProtocolTransformer,
} from '../protocol';
import { createBedrockStream } from './common';

interface AmazonBedrockInvocationMetrics {
  firstByteLatency: number;
  inputTokenCount: number;
  invocationLatency: number;
  outputTokenCount: number;
}

// https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-mistral-chat-completion.html
// mistral_chunk: {"choices":[{"index":0,"message":{"role":"assistant","content":""},"stop_reason":"stop"}],"amazon-bedrock-invocationMetrics":{"inputTokenCount":63,"outputTokenCount":263,"invocationLatency":5330,"firstByteLatency":122}}
interface BedrockMistralStreamChunk {
  'amazon-bedrock-invocationMetrics'?: AmazonBedrockInvocationMetrics;
  'choices': {
    'index'?: number;
    'message': {
      'content': string;
      'role'?: string;
      'tool_calls'?: {
        'function': any;
        'id'?: string;
      }[];
    };
    'stop_reason'?: null | string;
  }[];
}

export const transformMistralStream = (
  chunk: BedrockMistralStreamChunk,
  stack: StreamStack,
): StreamProtocolChunk => {
  // remove 'amazon-bedrock-invocationMetrics' from chunk
  delete chunk['amazon-bedrock-invocationMetrics'];

  if (!chunk.choices || chunk.choices.length === 0) {
    return { data: chunk, id: stack.id, type: 'data' };
  }

  const item = chunk.choices[0];

  if (typeof item.message?.content === 'string') {
    return { data: item.message.content, id: stack.id, type: 'text' };
  }

  // mistral_chunk_tool_calls: {"choices":[{"index":0,"message":{"role":"assistant","content":"","tool_calls":[{"id":"3NcHNntdRyaHu8zisKJAhQ","function":{"name":"realtime-weather____fetchCurrentWeather","arguments":"{\"city\": \"Singapore\"}"}}]},"stop_reason":"tool_calls"}]}
  if (item.message?.tool_calls) {
    return { data: item.message.tool_calls, id: stack.id, type: 'tool_calls' }
  }

  if (item.stop_reason) {
    return { data: item.stop_reason, id: stack.id, type: 'stop' };
  }

  return {
    data: { id: stack.id, index: item.index, message: item.message },
    id: stack.id,
    type: 'data',
  };
};

export const AWSBedrockMistralStream = (
  res: InvokeModelWithResponseStreamResponse | ReadableStream,
  cb?: ChatStreamCallbacks,
): ReadableStream<string> => {
  const streamStack: StreamStack = { id: 'chat_' + nanoid() };

  const stream = res instanceof ReadableStream ? res : createBedrockStream(res);

  return stream
    .pipeThrough(createSSEProtocolTransformer(transformMistralStream, streamStack))
    .pipeThrough(createCallbacksTransformer(cb));
};