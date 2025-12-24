import { z } from "zod"

export const createCognitoSchema = z.object({
  name: z.string({
      message: "name is required",
    })
    .min(1, { message: "name must be at least 1 character" })
    .max(20, { message: "name must be at most 20 characters" })
    .regex(/^[a-z0-9-]+$/i, { message: "name may contain only letters, digits, and hyphens"})
    .regex(/^[^-]/, { message: "name cannot start with a hyphen"})
    .regex(/[^-]$/, { message: "name cannot end with a hyphen"})
})

export const deleteCognitoSchema = z.object({
  id: z.string({
      message: "name is required",
    })
})


// 型の推論
export type CreateCognitoInput = z.infer<typeof createCognitoSchema>
export type DeleteCognitoInput = z.infer<typeof deleteCognitoSchema>



