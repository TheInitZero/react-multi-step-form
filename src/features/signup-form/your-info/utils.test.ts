import { describe, it, expect } from 'vitest';
import { nameValidationStatus, emailValidationStatus, telephoneValidationStatus } from './utils';

describe('nameValidationStatus', () => {
  it('returns error for empty string', () => {
    const result = nameValidationStatus('');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe('Name is required');
    }
  });

  it('returns error for whitespace-only string', () => {
    const result = nameValidationStatus('   ');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe('Name is required');
    }
  });

  it('returns error for single character', () => {
    const result = nameValidationStatus('A');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe('Name must be at least 2 characters long');
    }
  });

  it('returns error for name with numbers', () => {
    const result = nameValidationStatus('John123');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe('Name can only contain letters and spaces');
    }
  });

  it('returns error for name with special characters', () => {
    const result = nameValidationStatus('John@Doe');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe('Name can only contain letters and spaces');
    }
  });

  it('returns none for valid two-character name', () => {
    const result = nameValidationStatus('Jo');
    expect(result.kind).toBe('None');
  });

  it('returns none for valid name with spaces', () => {
    const result = nameValidationStatus('John Doe');
    expect(result.kind).toBe('None');
  });

  it('returns none for valid name with leading/trailing spaces', () => {
    const result = nameValidationStatus('  John Doe  ');
    expect(result.kind).toBe('None');
  });

  it('returns none for valid long name', () => {
    const result = nameValidationStatus('Christopher Alexander');
    expect(result.kind).toBe('None');
  });
});

describe('emailValidationStatus', () => {
  it('returns error for empty string', () => {
    const result = emailValidationStatus('');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe('Email is required');
    }
  });

  it('returns error for whitespace-only string', () => {
    const result = emailValidationStatus('   ');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe('Email is required');
    }
  });

  it('returns error for missing @ symbol', () => {
    const result = emailValidationStatus('testexample.com');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe('Invalid email format');
    }
  });

  it('returns error for missing domain extension', () => {
    const result = emailValidationStatus('test@example');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe('Invalid email format');
    }
  });

  it('returns error for missing username', () => {
    const result = emailValidationStatus('@example.com');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe('Invalid email format');
    }
  });

  it('returns error for spaces in email', () => {
    const result = emailValidationStatus('test @example.com');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe('Invalid email format');
    }
  });

  it('returns none for valid simple email', () => {
    const result = emailValidationStatus('test@example.com');
    expect(result.kind).toBe('None');
  });

  it('returns none for valid email with subdomain', () => {
    const result = emailValidationStatus('user@mail.example.com');
    expect(result.kind).toBe('None');
  });

  it('returns none for valid email with plus', () => {
    const result = emailValidationStatus('user+tag@example.com');
    expect(result.kind).toBe('None');
  });

  it('returns none for valid email with leading/trailing spaces', () => {
    const result = emailValidationStatus('  user@example.com  ');
    expect(result.kind).toBe('None');
  });
});

describe('telephoneValidationStatus', () => {
  it('returns error for empty string', () => {
    const result = telephoneValidationStatus('');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe('Telephone number is required');
    }
  });

  it('returns error for whitespace-only string', () => {
    const result = telephoneValidationStatus('   ');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe('Telephone number is required');
    }
  });

  it('returns error for letters in telephone', () => {
    const result = telephoneValidationStatus('123abc');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe("Telephone can only contain digits, '+' and '-'");
    }
  });

  it('returns error for special characters other than + and -', () => {
    const result = telephoneValidationStatus('123@456');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe("Telephone can only contain digits, '+' and '-'");
    }
  });

  it('returns error for multiple plus signs', () => {
    const result = telephoneValidationStatus('++1234567');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe("'+'' is only allowed at the beginning");
    }
  });

  it('returns error for plus sign not at beginning', () => {
    const result = telephoneValidationStatus('123+4567');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe("'+'' is only allowed at the beginning");
    }
  });

  it('returns error for too few digits (less than 7)', () => {
    const result = telephoneValidationStatus('123456');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe('Telephone number must contain between 7 and 15 digits');
    }
  });

  it('returns error for too many digits (more than 15)', () => {
    const result = telephoneValidationStatus('1234567890123456');
    expect(result.kind).toBe('Some');
    if (result.kind === 'Some') {
      expect(result.value).toBe('Telephone number must contain between 7 and 15 digits');
    }
  });

  it('returns none for valid 7-digit number', () => {
    const result = telephoneValidationStatus('1234567');
    expect(result.kind).toBe('None');
  });

  it('returns none for valid 15-digit number', () => {
    const result = telephoneValidationStatus('123456789012345');
    expect(result.kind).toBe('None');
  });

  it('returns none for valid number with dashes', () => {
    const result = telephoneValidationStatus('123-456-7890');
    expect(result.kind).toBe('None');
  });

  it('returns none for valid international number with plus', () => {
    const result = telephoneValidationStatus('+1-234-567-8901');
    expect(result.kind).toBe('None');
  });

  it('returns none for valid number with leading/trailing spaces', () => {
    const result = telephoneValidationStatus('  1234567890  ');
    expect(result.kind).toBe('None');
  });

  it('returns none for valid number with mixed formatting', () => {
    const result = telephoneValidationStatus('+44-20-1234-5678');
    expect(result.kind).toBe('None');
  });
});
