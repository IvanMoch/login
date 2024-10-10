import z from 'zod'

const userSchema = z.object({
  username: z.string().max(255),
  password: z.string()
})

export function validateUser (newMovie) {
  return userSchema.safeParse(newMovie)
}
