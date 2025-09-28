import process from 'node:process'

export default {
  providers: [
    {
      // @ts-expect-ignore
      domain: process.env.CONVEX_SITE_URL,
      applicationID: 'convex',
    },
  ],
}
