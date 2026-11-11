import { describe, expect, it } from 'vitest';
import { generateFallbackResponse } from './api.ts';

describe('generateFallbackResponse', () => {
  it('answers stack questions in English by default', () => {
    const reply = generateFallbackResponse('What is your tech stack?');
    expect(reply).toContain('MERN');
    expect(reply).toContain('React');
  });

  it('detects Arabic input and replies in Arabic', () => {
    const reply = generateFallbackResponse('ما هي مهاراتك التقنية؟');
    expect(reply).toMatch(/[\u0600-\u06FF]/);
  });

  it('honours the explicit language parameter', () => {
    const reply = generateFallbackResponse('Tell me about your projects', 'ar');
    expect(reply).toMatch(/[\u0600-\u06FF]/);
  });

  it('returns contact details for contact questions', () => {
    const reply = generateFallbackResponse('how can I contact you?');
    expect(reply).toContain('abdelrahmaneldamarany99@gmail.com');
  });

  it('always returns a non-empty string', () => {
    expect(generateFallbackResponse('').length).toBeGreaterThan(0);
    expect(generateFallbackResponse('asdfqwer zxcv').length).toBeGreaterThan(0);
  });
});
