import { ObfuscateEmailPipe } from './obfuscate-email.pipe';

describe('ObfuscateEmailPipe', () => {
  it('create an instance', () => {
    const pipe = new ObfuscateEmailPipe();
    expect(pipe).toBeTruthy();
  });
});
