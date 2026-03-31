import { none, some, type Maybe } from '../../../utils';

export function nameValidationStatus(name: string): Maybe<string> {
  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return some('Name is required');
  }

  if (trimmed.length < 2) {
    return some('Name must be at least 2 characters long');
  }

  if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
    return some('Name can only contain letters and spaces');
  }

  return none();
}

export function emailValidationStatus(email: string): Maybe<string> {
  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return some('Email is required');
  }

  // Simple, practical email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return some('Invalid email format');
  }

  return none();
}

export function telephoneValidationStatus(telephone: string): Maybe<string> {
  const trimmed = telephone.trim();

  if (trimmed.length === 0) {
    return some('Telephone number is required');
  }

  // Allow digits, +, and -
  if (!/^[\d+-]+$/.test(trimmed)) {
    return some("Telephone can only contain digits, '+' and '-'");
  }

  // '+' should appear at most once and only at the start
  if (
    (trimmed.match(/\+/g) || []).length > 1 ||
    (trimmed.includes('+') && !trimmed.startsWith('+'))
  ) {
    return some("'+'' is only allowed at the beginning");
  }

  // Count digits only for length validation
  const digitsOnly = trimmed.replace(/[^\d]/g, '');

  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return some('Telephone number must contain between 7 and 15 digits');
  }

  return none();
}
