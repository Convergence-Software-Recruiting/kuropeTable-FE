import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';
import { resetMockApiState } from '@/lib/mocks/mockApi';

beforeEach(() => {
  resetMockApiState();
});
