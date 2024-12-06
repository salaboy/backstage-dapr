import { daprPlugin } from './plugin';

describe('dapr', () => {
  it('should export plugin', () => {
    expect(daprPlugin).toBeDefined();
  });
});
