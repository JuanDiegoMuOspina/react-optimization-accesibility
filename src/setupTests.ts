/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';

// Mock IntersectionObserver
(global as any).IntersectionObserver = class MockIntersectionObserver {
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock fetch
(global as any).fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock import.meta.env for Vite
(global as any).import = {
  meta: {
    env: {
      VITE_USE_MOCK_API: 'false'
    }
  }
};