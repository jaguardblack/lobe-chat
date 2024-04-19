// @vitest-environment node
import { Langfuse } from 'langfuse';
import { LangfuseGenerationClient, LangfuseTraceClient } from 'langfuse-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getServerConfig } from '@/config/server';
import { JWTPayload } from '@/const/auth';
import { TraceNameMap } from '@/const/trace';
import {
  ChatStreamPayload,
  LobeAnthropicAI,
  LobeAzureOpenAI,
  LobeBedrockAI,
  LobeGoogleAI,
  LobeGroq,
  LobeMistralAI,
  LobeMoonshotAI,
  LobeOllamaAI,
  LobeOpenAI,
  LobeOpenRouterAI,
  LobePerplexityAI,
  LobeRuntimeAI,
  LobeTogetherAI,
  LobeZeroOneAI,
  LobeZhipuAI,
  ModelProvider,
} from '@/libs/agent-runtime';
import { AgentRuntime } from '@/libs/agent-runtime';

import { AgentChatOptions, initializeWithUserPayload } from './agentRuntime';

// 模拟依赖项
vi.mock('@/config/server', () => ({
  getServerConfig: vi.fn(() => ({
    // 确保为每个provider提供必要的配置信息
    OPENAI_API_KEY: 'test-openai-key',
    GOOGLE_API_KEY: 'test-google-key',

    AZURE_API_KEY: 'test-azure-key',
    AZURE_ENDPOINT: 'endpoint',

    ZHIPU_API_KEY: 'test.zhipu-key',
    MOONSHOT_API_KEY: 'test-moonshot-key',
    AWS_SECRET_ACCESS_KEY: 'test-aws-secret',
    AWS_ACCESS_KEY_ID: 'test-aws-id',
    AWS_REGION: 'test-aws-region',
    OLLAMA_PROXY_URL: 'test-ollama-url',
    PERPLEXITY_API_KEY: 'test-perplexity-key',
    ANTHROPIC_API_KEY: 'test-anthropic-key',
    MISTRAL_API_KEY: 'test-mistral-key',
    OPENROUTER_API_KEY: 'test-openrouter-key',
    TOGETHERAI_API_KEY: 'test-togetherai-key',
  })),
}));

/**
 * Test cases for function initializeWithUserPayload
 * this method will use AgentRuntime from `@/libs/agent-runtime`
 * and method `getLlmOptionsFromPayload` to initialize runtime
 * with user payload. Test case below will test both the methods
 */
describe('initializeWithUserPayload method', () => {
  describe('should initialize with options correctly', () => {
    it('OpenAI provider: with apikey and endpoint', async () => {
      const jwtPayload: JWTPayload = { apiKey: 'user-openai-key', endpoint: 'user-endpoint' };
      const runtime = await initializeWithUserPayload(ModelProvider.OpenAI, jwtPayload);
      expect(runtime).toBeInstanceOf(AgentRuntime);
      expect(runtime['_runtime']).toBeInstanceOf(LobeOpenAI);
      expect(runtime['_runtime'].baseURL).toBe(jwtPayload.endpoint);
    });

    it('Azure AI provider: with apikey, endpoint and apiversion', async () => {
      const jwtPayload: JWTPayload = {
        apiKey: 'user-azure-key',
        endpoint: 'user-azure-endpoint',
        azureApiVersion: '2024-02-01',
      };
      const runtime = await initializeWithUserPayload(ModelProvider.Azure, jwtPayload);
      expect(runtime).toBeInstanceOf(AgentRuntime);
      expect(runtime['_runtime']).toBeInstanceOf(LobeAzureOpenAI);
      expect(runtime['_runtime'].baseURL).toBe(jwtPayload.endpoint);
    });

    it('ZhiPu AI provider: with apikey', async () => {
      const jwtPayload: JWTPayload = { apiKey: 'zhipu.user-key' };
      const runtime = await initializeWithUserPayload(ModelProvider.ZhiPu, jwtPayload);
      expect(runtime).toBeInstanceOf(AgentRuntime);
      expect(runtime['_runtime']).toBeInstanceOf(LobeZhipuAI);
    });

    it('Google provider: with apikey', async () => {
      const jwtPayload: JWTPayload = { apiKey: 'user-google-key' };
      const runtime = await initializeWithUserPayload(ModelProvider.Google, jwtPayload);
      expect(runtime).toBeInstanceOf(AgentRuntime);
      expect(runtime['_runtime']).toBeInstanceOf(LobeGoogleAI);
    });

    it('Moonshot AI provider: with apikey', async () => {
      const jwtPayload: JWTPayload = { apiKey: 'user-moonshot-key' };
      const runtime = await initializeWithUserPayload(ModelProvider.Moonshot, jwtPayload);
      expect(runtime).toBeInstanceOf(AgentRuntime);
      expect(runtime['_runtime']).toBeInstanceOf(LobeMoonshotAI);
    });

    it('Bedrock AI provider: with apikey, awsAccessKeyId, awsSecretAccessKey, awsRegion', async () => {
      const jwtPayload: JWTPayload = {
        apiKey: 'user-bedrock-key',
        awsAccessKeyId: 'user-aws-id',
        awsSecretAccessKey: 'user-aws-secret',
        awsRegion: 'user-aws-region',
      };
      const runtime = await initializeWithUserPayload(ModelProvider.Bedrock, jwtPayload);
      expect(runtime).toBeInstanceOf(AgentRuntime);
      expect(runtime['_runtime']).toBeInstanceOf(LobeBedrockAI);
    });

    it('Ollama provider: with endpoint', async () => {
      const jwtPayload: JWTPayload = { endpoint: 'user-ollama-url' };
      const runtime = await initializeWithUserPayload(ModelProvider.Ollama, jwtPayload);
      expect(runtime).toBeInstanceOf(AgentRuntime);
      expect(runtime['_runtime']).toBeInstanceOf(LobeOllamaAI);
    });

    it('Perplexity AI provider: with apikey', async () => {
      const jwtPayload: JWTPayload = { apiKey: 'user-perplexity-key' };
      const runtime = await initializeWithUserPayload(ModelProvider.Perplexity, jwtPayload);
      expect(runtime).toBeInstanceOf(AgentRuntime);
      expect(runtime['_runtime']).toBeInstanceOf(LobePerplexityAI);
    });

    it('Anthropic AI provider: with apikey', async () => {
      const jwtPayload: JWTPayload = { apiKey: 'user-anthropic-key' };
      const runtime = await initializeWithUserPayload(ModelProvider.Anthropic, jwtPayload);
      expect(runtime).toBeInstanceOf(AgentRuntime);
      expect(runtime['_runtime']).toBeInstanceOf(LobeAnthropicAI);
    });

    it('Mistral AI provider: with apikey', async () => {
      const jwtPayload: JWTPayload = { apiKey: 'user-mistral-key' };
      const runtime = await initializeWithUserPayload(ModelProvider.Mistral, jwtPayload);
      expect(runtime).toBeInstanceOf(AgentRuntime);
      expect(runtime['_runtime']).toBeInstanceOf(LobeMistralAI);
    });

    it('OpenRouter AI provider: with apikey', async () => {
      const jwtPayload: JWTPayload = { apiKey: 'user-openrouter-key' };
      const runtime = await initializeWithUserPayload(ModelProvider.OpenRouter, jwtPayload);
      expect(runtime).toBeInstanceOf(AgentRuntime);
      expect(runtime['_runtime']).toBeInstanceOf(LobeOpenRouterAI);
    });

    it('Together AI provider: with apikey', async () => {
      const jwtPayload: JWTPayload = { apiKey: 'user-togetherai-key' };
      const runtime = await initializeWithUserPayload(ModelProvider.TogetherAI, jwtPayload);
      expect(runtime).toBeInstanceOf(AgentRuntime);
      expect(runtime['_runtime']).toBeInstanceOf(LobeTogetherAI);
    });

    it('ZeroOne AI provider: with apikey', async () => {
      const jwtPayload = { apiKey: 'user-zeroone-key' };
      const runtime = await initializeWithUserPayload(ModelProvider.ZeroOne, jwtPayload);
      expect(runtime).toBeInstanceOf(AgentRuntime);
      expect(runtime['_runtime']).toBeInstanceOf(LobeZeroOneAI);
    });

    it('Groq AI provider: with apikey', async () => {
      const jwtPayload = { apiKey: 'user-zeroone-key' };
      const runtime = await initializeWithUserPayload(ModelProvider.Groq, jwtPayload);
      expect(runtime).toBeInstanceOf(AgentRuntime);
      expect(runtime['_runtime']).toBeInstanceOf(LobeGroq);
    });

    it('Unknown Provider: with apikey and endpoint, should initialize to OpenAi', async () => {
      const jwtPayload: JWTPayload = {
        apiKey: 'user-unknown-key',
        endpoint: 'user-unknown-endpoint',
      };
      const runtime = await initializeWithUserPayload('unknown', jwtPayload);
      expect(runtime).toBeInstanceOf(AgentRuntime);
      expect(runtime['_runtime']).toBeInstanceOf(LobeOpenAI);
      expect(runtime['_runtime'].baseURL).toBe(jwtPayload.endpoint);
    });
  });

  describe('should initialize without some options', () => {
    it('OpenAI provider: without apikey', async () => {
      const jwtPayload: JWTPayload = {};
      const runtime = await initializeWithUserPayload(ModelProvider.OpenAI, jwtPayload);
      expect(runtime['_runtime']).toBeInstanceOf(LobeOpenAI);
    });

    it('Azure AI Provider: without apikey', async () => {
      const jwtPayload: JWTPayload = {};
      const runtime = await initializeWithUserPayload(ModelProvider.Azure, jwtPayload);

      expect(runtime['_runtime']).toBeInstanceOf(LobeAzureOpenAI);
    });

    it('ZhiPu AI provider: without apikey', async () => {
      const jwtPayload: JWTPayload = {};
      const runtime = await initializeWithUserPayload(ModelProvider.ZhiPu, jwtPayload);

      // 假设 LobeZhipuAI 是 ZhiPu 提供者的实现类
      expect(runtime['_runtime']).toBeInstanceOf(LobeZhipuAI);
    });

    it('Google provider: without apikey', async () => {
      const runtime = await initializeWithUserPayload(ModelProvider.Google, {});

      // 假设 LobeGoogleAI 是 Google 提供者的实现类
      expect(runtime['_runtime']).toBeInstanceOf(LobeGoogleAI);
    });

    it('Moonshot AI provider: without apikey', async () => {
      const jwtPayload: JWTPayload = {};
      const runtime = await initializeWithUserPayload(ModelProvider.Moonshot, jwtPayload);

      // 假设 LobeMoonshotAI 是 Moonshot 提供者的实现类
      expect(runtime['_runtime']).toBeInstanceOf(LobeMoonshotAI);
    });

    it('Bedrock AI provider: without apikey', async () => {
      const jwtPayload = {};
      const runtime = await initializeWithUserPayload(ModelProvider.Bedrock, jwtPayload);

      // 假设 LobeBedrockAI 是 Bedrock 提供者的实现类
      expect(runtime['_runtime']).toBeInstanceOf(LobeBedrockAI);
    });

    it('Ollama provider: without endpoint', async () => {
      const jwtPayload = {};
      const runtime = await initializeWithUserPayload(ModelProvider.Ollama, jwtPayload);

      // 假设 LobeOllamaAI 是 Ollama 提供者的实现类
      expect(runtime['_runtime']).toBeInstanceOf(LobeOllamaAI);
    });

    it('Perplexity AI provider: without apikey', async () => {
      const jwtPayload = {};
      const runtime = await initializeWithUserPayload(ModelProvider.Perplexity, jwtPayload);

      // 假设 LobePerplexityAI 是 Perplexity 提供者的实现类
      expect(runtime['_runtime']).toBeInstanceOf(LobePerplexityAI);
    });

    it('Anthropic AI provider: without apikey', async () => {
      const jwtPayload = {};
      const runtime = await initializeWithUserPayload(ModelProvider.Anthropic, jwtPayload);

      // 假设 LobeAnthropicAI 是 Anthropic 提供者的实现类
      expect(runtime['_runtime']).toBeInstanceOf(LobeAnthropicAI);
    });

    it('Mistral AI provider: without apikey', async () => {
      const jwtPayload = {};
      const runtime = await initializeWithUserPayload(ModelProvider.Mistral, jwtPayload);

      // 假设 LobeMistralAI 是 Mistral 提供者的实现类
      expect(runtime['_runtime']).toBeInstanceOf(LobeMistralAI);
    });

    it('OpenRouter AI provider: without apikey', async () => {
      const jwtPayload = {};
      const runtime = await initializeWithUserPayload(ModelProvider.OpenRouter, jwtPayload);

      // 假设 LobeOpenRouterAI 是 OpenRouter 提供者的实现类
      expect(runtime['_runtime']).toBeInstanceOf(LobeOpenRouterAI);
    });

    it('Together AI provider: without apikey', async () => {
      const jwtPayload = {};
      const runtime = await initializeWithUserPayload(ModelProvider.TogetherAI, jwtPayload);

      // 假设 LobeTogetherAI 是 TogetherAI 提供者的实现类
      expect(runtime['_runtime']).toBeInstanceOf(LobeTogetherAI);
    });

    it('Unknown Provider', async () => {
      const jwtPayload = {};
      const runtime = await initializeWithUserPayload('unknown', jwtPayload);

      // 根据实际实现，你可能需要检查是否返回了默认的 runtime 实例，或者是否抛出了异常
      // 例如，如果默认使用 OpenAI:
      expect(runtime['_runtime']).toBeInstanceOf(LobeOpenAI);
    });
  });
});
