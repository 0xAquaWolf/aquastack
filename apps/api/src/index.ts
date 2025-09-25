import { cors } from '@elysiajs/cors'
import { treaty } from '@elysiajs/eden'
import { Elysia, t } from 'elysia'

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
    () => {
      return [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    },
    {
      response: t.Array(UserSchema),
    },
  )

  .get(
    '/users/:id',
    ({ params: { id } }) => {
      return {
        id,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: UserSchema,
    },
  )

  // Quest endpoints
  .get(
    '/quests',
    () => {
      return [
        {
          id: '1',
          title: 'Complete API Integration',
          description: 'Integrate Elysia API with web and mobile apps',
          status: 'in_progress' as const,
          userId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Set up Type Safety',
          description: 'Ensure end-to-end type safety with Eden Treaty',
          status: 'pending' as const,
          userId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    },
    {
      response: t.Array(QuestSchema),
    },
  )

  .get(
    '/quests/:id',
    ({ params: { id } }) => {
      return {
        id,
        title: 'Complete API Integration',
        description: 'Integrate Elysia API with web and mobile apps',
        status: 'in_progress' as const,
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
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
    ({ body }) => {
      return {
        id: Math.random().toString(36),
        ...body,
        status: 'pending' as const,
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
    {
      body: CreateQuestSchema,
      response: QuestSchema,
    },
  )

  .put(
    '/quests/:id',
    ({ params: { id }, body }) => {
      return {
        id,
        title: body.title || 'Updated Quest',
        description: body.description || 'Updated description',
        status: body.status || ('pending' as const),
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
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
    ({ params: { id } }) => {
      return { success: true, message: `Quest ${id} deleted` }
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
