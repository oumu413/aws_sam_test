import { Request, Response, NextFunction } from "express"
import { z } from "zod"
import logger from '@commons/logger'

export const validate =
  (schema: z.ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      next()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : `Unknown error: ${String(error)}`
      if (error instanceof z.ZodError) {
        logger.warn(`[Validation Failed] method="${req.method}" path="${req.path}" message="${message}"`)
        console.log(req.body)
        console.log(req.query)
        console.log(req.params)
        return res.status(400).json({
          error: "Validation failed",
          details: error.issues.map((issue) => ({
            method: req.method,
            path: issue.path.join("."),
            message: issue.message,
          })),
        })
      }
      logger.error(`[Validation Unexpected Error] method="${req.method}" path="${req.path}" message="${message}"`)
      next(error)
    }
  }


  