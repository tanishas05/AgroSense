export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/market/:path*',
    '/advisory/:path*',
    '/profile/:path*',
  ],
}