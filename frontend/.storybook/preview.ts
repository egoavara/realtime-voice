import type { Preview } from '@storybook/react';
import '../src/app/globals.css'; // Tailwind가 적용된 CSS 파일
// import 'tailwindcss/tailwind.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
