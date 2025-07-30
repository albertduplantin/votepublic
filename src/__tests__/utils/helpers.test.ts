import {
  generateId,
  isValidEmail,
  isValidPassword,
  formatRating,
  calculateAverageRating,
  cn,
} from '../../utils/helpers';

describe('Helpers', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('test+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate passwords with minimum length', () => {
      expect(isValidPassword('123456')).toBe(true);
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('a'.repeat(10))).toBe(true);
    });

    it('should reject passwords that are too short', () => {
      expect(isValidPassword('12345')).toBe(false);
      expect(isValidPassword('')).toBe(false);
      expect(isValidPassword('abc')).toBe(false);
    });
  });

  describe('formatRating', () => {
    it('should format ratings correctly', () => {
      expect(formatRating(3.5)).toBe('3.5/5');
      expect(formatRating(5)).toBe('5/5');
      expect(formatRating(1)).toBe('1/5');
    });
  });

  describe('calculateAverageRating', () => {
    it('should calculate average rating correctly', () => {
      expect(calculateAverageRating([1, 2, 3, 4, 5])).toBe(3);
      expect(calculateAverageRating([5, 5, 5])).toBe(5);
      expect(calculateAverageRating([1, 1])).toBe(1);
      expect(calculateAverageRating([])).toBe(0);
    });
  });

  describe('cn', () => {
    it('should combine class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
      expect(cn('class1', null, 'class2')).toBe('class1 class2');
      expect(cn('class1', false, 'class2')).toBe('class1 class2');
    });

    it('should handle empty values', () => {
      expect(cn()).toBe('');
      expect(cn('')).toBe('');
      expect(cn(undefined, null, false, '')).toBe('');
    });
  });
});