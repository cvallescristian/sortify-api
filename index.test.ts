import { describe, it, expect } from 'bun:test';

describe('Hello World API', () => {
  it('should return hello message', () => {
    const message = 'Hello World';
    expect(message).toBe('Hello World');
  });
});
