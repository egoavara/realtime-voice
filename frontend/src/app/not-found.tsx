/**
 * 404 페이지
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@radix-ui/react-alert-dialog';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
      <AlertDialog open>
        <AlertDialogContent className="max-w-md p-6 bg-white shadow-lg rounded-lg">
          <AlertDialogTitle className="text-2xl font-bold text-gray-900">
            페이지를 찾을 수 없습니다 🧐
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-gray-600">
            존재하지 않는 페이지를 요청하셨거나, 이동되었을 수 있습니다.
          </AlertDialogDescription>
          <div className="mt-4 flex justify-center">
            <AlertDialogAction asChild>
              <Link
                href="/"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                홈으로 돌아가기
              </Link>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
