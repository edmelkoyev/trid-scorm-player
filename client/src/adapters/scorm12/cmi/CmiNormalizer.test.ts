import { normalizeCmi } from './CmiNormalizer';


describe('normalizeCmi', () => {
  it('should apply default values when properties are missing', () => {
    const input: Record<string, string> = {};

    const result = normalizeCmi(input);

    expect(result).toEqual({
      'cmi._version': '3.4',
      'cmi.core.student_id': '',
      'cmi.core.student_name': '',
      'cmi.core.lesson_location': '',
      'cmi.core.credit': 'credit',
      'cmi.core.lesson_status': 'not attempted',
      'cmi.core.entry': 'ab-initio',
      'cmi.core.score.raw': '',
      'cmi.core.score.max': '',
      'cmi.core.score.min': '',
      'cmi.core.total_time': '0000:00:00.00',
      'cmi.core.lesson_mode': 'normal',
      'cmi.core.exit': '',
      'cmi.suspend_data': '',
      'cmi.launch_data': '',
    });
  });

  it('should preserve existing values from input', () => {
    const input: Record<string, string> = {
      'cmi._version': '3.3',
      'cmi.core.student_id': '123',
      'cmi.core.lesson_status': 'completed',
      'cmi.core.entry': 'resume',
      'cmi.core.total_time': '0001:10:00.00',
    };

    const result = normalizeCmi(input);

    expect(result['cmi._version']).toBe('3.3');
    expect(result['cmi.core.student_id']).toBe('123');
    expect(result['cmi.core.lesson_status']).toBe('completed');
    expect(result['cmi.core.entry']).toBe('resume');
    expect(result['cmi.core.total_time']).toBe('0001:10:00.00');
  });

  it('should default cmi.core.entry only when value is null or undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const input: Record<string, any> = {
      'cmi.core.entry': '',
    };

    const result = normalizeCmi(input);
    expect(result['cmi.core.entry']).toBe('');
  });

  it('should always reset cmi.core.exit to an empty string', () => {
    const input: Record<string, string> = {
      'cmi.core.exit': 'logout',
    };

    const result = normalizeCmi(input);

    expect(result['cmi.core.exit']).toBe('');
  });

  it('should keep extra properties untouched', () => {
    const input: Record<string, string> = {
      'custom.key': 'custom-value',
    };

    const result = normalizeCmi(input);

    expect(result['custom.key']).toBe('custom-value');
  });
});
