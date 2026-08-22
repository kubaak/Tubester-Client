import '@testing-library/jest-dom';

// React Router uses these browser APIs, but Jest's jsdom environment does not provide them.
// Use Node's implementations so tests can render routes through MemoryRouter.
declare const require: (moduleName: string) => {
  TextDecoder: typeof globalThis.TextDecoder;
  TextEncoder: typeof globalThis.TextEncoder;
};

const { TextDecoder, TextEncoder } = require('util');
Object.assign(globalThis, { TextDecoder, TextEncoder });
