/**
 * This file contains the edge router of Lobe Chat tRPC-backend
 */
import { publicProcedure, router } from '@/libs/trpc';
import { tokenizerRouter } from '@/server/routers/edge/tokenizer';

import { configRouter } from './config';
import { uploadRouter } from './upload';

export const edgeRouter = router({
  config: configRouter,
  healthcheck: publicProcedure.query(() => "i'm live!"),
  tokenizer: tokenizerRouter,
  upload: uploadRouter,
});

export type EdgeRouter = typeof edgeRouter;
