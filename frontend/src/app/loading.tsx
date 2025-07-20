/**
 * 글로벌 로딩 핸들링
 */

import { Progress } from '@radix-ui/react-progress';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-gray-500 text-lg font-medium">로딩 중...</p>
      <Progress
        className="mt-4 w-40 h-2 bg-gray-200 rounded-full"
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="h-full bg-blue-500 rounded-full animate-pulse w-2/3" />
      </Progress>
    </div>
  );
}
