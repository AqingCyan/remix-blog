import { createCookieSessionStorage } from '@remix-run/node'

export interface UserSessionData {
  username: string
}

export const userSessionStorage = createCookieSessionStorage<UserSessionData>({
  cookie: {
    name: '__session',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
    secrets: [process.env.SESSION_SECRET as string],
    secure: true,
  },
})

export async function auth(request: Request) {
  const session = await userSessionStorage.getSession(request.headers.get('Cookie'))
  return {
    username: session.get('username'),
  } as UserSessionData
}
