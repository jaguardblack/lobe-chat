// This file is for debugging purposes only.
// DON'T USE IT IN PRODUCTION.
import { DEFAULT_AGENT_CONFIG } from '@/const/settings';
import { LLMRoleType } from '@/types/llm';

import { BaseModel } from '../core';
import { DB_SessionSchema } from '../schemas/session';

class _DEBUG_MODEL extends BaseModel<'sessions'> {
  constructor() {
    super('sessions', DB_SessionSchema);
  }
  private getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  private randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).getTime();
  }

  private randomPick<T>(array: T[]): T {
    const randomIndex = this.getRandomInt(0, array.length - 1);
    return array[randomIndex];
  }

  createRandomData = async ({ sessionCount = 10, topicCount = 2000, messageCount = 10_000 }) => {
    const numberOfSessions = sessionCount;
    const numberOfTopics = topicCount;
    const numberOfMessages = messageCount;

    // Start a transaction
    await this.db.transaction(
      'rw',
      this.db.sessions,
      this.db.topics,
      this.db.messages,
      async () => {
        // Insert sessions
        for (let i = 1; i <= numberOfSessions; i++) {
          await this.db.sessions.add({
            config: DEFAULT_AGENT_CONFIG,
            createdAt: this.randomDate(new Date(2020, 0, 1), new Date()),
            group: 'default',
            id: `sess_${i}`,
            meta: {
              description: `Session Description ${i}`,
              title: `Session Title ${i}`,
            },
            type: 'agent',
            updatedAt: this.randomDate(new Date(2020, 0, 1), new Date()),
          });
        }

        // Insert topics
        for (let i = 1; i <= numberOfTopics; i++) {
          await this.db.topics.add({
            createdAt: this.randomDate(new Date(2020, 0, 1), new Date()),
            favorite: this.getRandomInt(0, 1),
            id: `topic_${i}`,
            sessionId: `sess_${this.getRandomInt(1, numberOfSessions)}`,
            title: `Topic Title ${i}`,
            updatedAt: this.randomDate(new Date(2020, 0, 1), new Date()),
          });
        }

        // Insert messages
        for (let i = 1; i <= numberOfMessages; i++) {
          await this.db.messages.add({
            content: this.randomString(300),

            createdAt: this.randomDate(new Date(2020, 0, 1), new Date()),
            favorite: this.getRandomInt(0, 1),

            fromModel: 'model',

            id: `msg_${i}`,

            // Random quota ID
            parentId: `msg_${this.getRandomInt(1, numberOfMessages)}`,

            // Assuming topic IDs are like 'topic_1', 'topic_2', etc.
            quotaId: `msg_${this.getRandomInt(1, numberOfMessages)}`,

            // Random parent ID
            role: this.randomPick<LLMRoleType>(['user', 'assistant']) as LLMRoleType,

            sessionId: `sess_${this.getRandomInt(1, numberOfSessions)}`,

            // Assuming session IDs are like 'sess_1', 'sess_2', etc.
            topicId: `topic_${this.getRandomInt(1, numberOfTopics)}`,

            updatedAt: this.randomDate(new Date(2020, 0, 1), new Date()),
          });
        }
      },
    );
  };
}

export const DEBUG_MODEL = new _DEBUG_MODEL();
