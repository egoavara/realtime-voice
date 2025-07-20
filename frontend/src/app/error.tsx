/**
 * 글로벌 에러 핸들링
 * 페이지에서 에러가 발생했을 때 사용자에게 친절한 메시지를 제공하기 위함
 */

'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Page Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-500">문제가 발생했습니다!</h1>
      <p className="mt-2 text-gray-600">잠시 후 다시 시도해주세요.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        다시 시도하기
      </button>
    </div>
  );
}
