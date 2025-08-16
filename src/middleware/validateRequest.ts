// middleware/validateSchema.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

type RequestPart = 'body' | 'query' | 'params' | 'headers';

function validateRequest(schema: ZodSchema, target: RequestPart = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req[target]);

      if (!result.success) {
        res.status(400).json({
          message: 'Validation failed',
          errors: result.error.format(),
        });
        return;
      }

      if (target === 'body') {
        req.body = result.data;
      } else {
        Object.assign(req[target], result.data);
      }
      next();
    } catch (err) {
      if(err instanceof ZodError){
        const message = err?.issues.map(e => e.message).join(', ');
        return next(new Error(`Validation error: ${message}`));
      }
      next(err);
    }
  };
}

export default validateRequest;
