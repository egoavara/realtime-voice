/**
 * 미들웨어
 * 특정 페이지에 대한 접근을 제한 (ex: 로그인한 사용자만 접근 가능)
 */

import { type NextRequest, NextResponse } from 'next/server';

// 보호할 경로 목록 (예: 대시보드, 설정 페이지 등)
const protectedRoutes = ['/dashboard', '/settings'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 세션(쿠키, 토큰 등) 검사 (예제에서는 쿠키 사용)
  const token = req.cookies.get('auth-token');

  // 로그인하지 않은 사용자가 보호된 경로 접근 시 로그인 페이지로 리디렉트
  if (protectedRoutes.includes(pathname) && !token) {
    const loginUrl = new URL('/auth/login', req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// `matcher`를 사용하여 특정 경로에서만 미들웨어 실행
export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};
