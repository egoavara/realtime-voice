import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/auth/login/page';

test('Page', () => {
  render(<LoginPage />);
  expect(screen.getByTestId('submit-button-testid')).toBeDefined();
});
