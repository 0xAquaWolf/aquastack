import type { NewQuest, NewUser } from './db/schema'
import { cors } from '@elysiajs/cors'
import { treaty } from '@elysiajs/eden'
import { eq, ilike, or } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { db } from './db'
import { quests, users } from './db/schema'

// Define types for SelfVision Quest app
const UserSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
})

const QuestSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.String(),
  status: t.Union([
    t.Literal('pending'),
    t.Literal('in_progress'),
    t.Literal('completed'),
  ]),
  userId: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
})

const CreateQuestSchema = t.Object({
  title: t.String(),
  description: t.String(),
})

const UpdateQuestSchema = t.Partial(
  t.Object({
    title: t.String(),
    description: t.String(),
    status: t.Union([
      t.Literal('pending'),
      t.Literal('in_progress'),
      t.Literal('completed'),
    ]),
  }),
)

const CreateUserSchema = t.Object({
  name: t.String(),
  email: t.String(),
})

const UpdateUserSchema = t.Partial(
  t.Object({
    name: t.String(),
    email: t.String(),
  }),
)

const app = new Elysia()
  .use(
    cors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  )
  // Health check
  .get('/health', () => 'SelfVision Quest API is running')

  // User endpoints
  .get(
    '/users',
    async () => {
      const result = await db.select().from(users)
      console.log({ result })
      return result
    },
    {
      response: t.Array(UserSchema),
    },
  )

  .get(
    '/users/:id',
    async ({ params: { id } }) => {
      const result = await db.select().from(users).where(eq(users.id, id))
      console.log({ result })
      return result[0] || { error: 'User not found' }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: UserSchema,
    },
  )

  .post(
    '/users',
    async ({ body }) => {
      const newUser: NewUser = {
        ...body,
      }

      const result = await db.insert(users).values(newUser).returning()
      console.log({ result })
      return result[0]
    },
    {
      body: CreateUserSchema,
      response: UserSchema,
    },
  )

  .put(
    '/users/:id',
    async ({ params: { id }, body }) => {
      const result = await db
        .update(users)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning()
      console.log({ result })
      return result[0] || { error: 'User not found' }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: UpdateUserSchema,
      response: UserSchema,
    },
  )

  .delete(
    '/users/:id',
    async ({ params: { id } }) => {
      const result = await db.delete(users).where(eq(users.id, id)).returning()
      console.log({ result })
      return {
        success: result.length > 0,
        message: result.length > 0 ? `User ${id} deleted` : 'User not found',
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
      }),
    },
  )

  // Quest endpoints
  .get(
    '/quests',
    async ({ query }) => {
      let result = await db.select().from(quests)

      // Apply filters if provided
      if (query?.status) {
        result = await db.select().from(quests).where(eq(quests.status, query.status as any))
      }

      if (query?.search) {
        result = await db.select().from(quests).where(
          or(
            ilike(quests.title, `%${query.search}%`),
            ilike(quests.description, `%${query.search}%`),
          ),
        )
      }

      if (query?.userId) {
        result = await db.select().from(quests).where(eq(quests.userId, query.userId))
      }

      console.log({ result })
      return result
    },
    {
      query: t.Object({
        status: t.Optional(t.Union([t.Literal('pending'), t.Literal('in_progress'), t.Literal('completed')])),
        search: t.Optional(t.String()),
        userId: t.Optional(t.String()),
      }),
      response: t.Array(QuestSchema),
    },
  )

  .get(
    '/quests/:id',
    async ({ params: { id } }) => {
      const result = await db.select().from(quests).where(eq(quests.id, id))
      console.log({ result })
      return result[0] || { error: 'Quest not found' }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: QuestSchema,
    },
  )

  .post(
    '/quests',
    async ({ body }) => {
      const newQuest: NewQuest = {
        ...body,
        userId: '1', // Default user for now
      }

      const result = await db.insert(quests).values(newQuest).returning()
      console.log({ result })
      return result[0]
    },
    {
      body: CreateQuestSchema,
      response: QuestSchema,
    },
  )

  .put(
    '/quests/:id',
    async ({ params: { id }, body }) => {
      const result = await db
        .update(quests)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(quests.id, id))
        .returning()

      console.log({ result })
      return result[0] || { error: 'Quest not found' }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: UpdateQuestSchema,
      response: QuestSchema,
    },
  )

  .delete(
    '/quests/:id',
    async ({ params: { id } }) => {
      const result = await db.delete(quests).where(eq(quests.id, id)).returning()
      console.log({ result })
      return {
        success: result.length > 0,
        message: result.length > 0 ? `Quest ${id} deleted` : 'Quest not found',
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
      }),
    },
  )

  .listen(3333)

// Export app type for Eden Treaty client
export type App = typeof app

export const Treaty = treaty

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
