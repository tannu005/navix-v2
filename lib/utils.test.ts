import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn (Tailwind Class Merge)', () => {
  it('merges basic classes', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('resolves tailwind conflicts', () => {
    // text-white and text-black conflict, tailwind-merge resolves to the last one
    expect(cn('text-white', 'text-black')).toBe('text-black');
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });

  it('handles conditional classes', () => {
    expect(cn('px-4', true && 'py-4', false && 'opacity-0')).toBe('px-4 py-4');
  });

  it('handles arrays and objects via clsx', () => {
    expect(cn('text-sm', { 'font-bold': true, 'italic': false }, ['flex', 'items-center'])).toBe('text-sm font-bold flex items-center');
  });
});
