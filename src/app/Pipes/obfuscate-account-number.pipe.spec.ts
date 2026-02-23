import { ObfuscateAccountNumberPipe } from './obfuscate-account-number.pipe';

describe('ObfuscateAccountNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new ObfuscateAccountNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
