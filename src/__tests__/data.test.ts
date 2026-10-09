import { describe, expect, test } from 'vitest';
import { createTestPresentation } from '../data';

describe('test presentation data', () => {
  test('creates three populated slides with their backgrounds', () => {
    const presentation = createTestPresentation();

    expect(presentation.name).toBe('Тестовая презентация');
    expect(presentation.slides).toHaveLength(3);
    expect(presentation.slides.map(slide => slide.name)).toEqual([
      'Title',
      'Список',
      'Итоги'
    ]);
    expect(presentation.slides.map(slide => slide.objects.length)).toEqual([2, 4, 2]);
    expect(presentation.slides.map(slide => slide.background)).toEqual([
      { type: 'color', color: '#f0f0f0' },
      { type: 'color', color: '#ffffff' },
      { type: 'color', color: '#e8f5e9' }
    ]);
  });
});