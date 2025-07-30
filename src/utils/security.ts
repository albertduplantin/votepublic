import { VALIDATION_RULES } from './constants';

/**
 * Classe pour la validation et la sécurité des données
 */
export class SecurityUtils {
  /**
   * Valide et nettoie une chaîne de caractères
   */
  static sanitizeString(input: string, maxLength: number = 1000): string {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }

    // Supprimer les caractères dangereux
    let sanitized = input
      .replace(/[<>]/g, '') // Supprimer < et >
      .replace(/javascript:/gi, '') // Supprimer javascript:
      .replace(/on\w+=/gi, '') // Supprimer les event handlers
      .trim();

    // Limiter la longueur
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  }

  /**
   * Valide une adresse email
   */
  static validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Valide un mot de passe
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!password || password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      errors.push(`Le mot de passe doit contenir au moins ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caractères`);
    }

    if (password.length > 128) {
      errors.push('Le mot de passe est trop long');
    }

    // Vérifier la complexité (optionnel)
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valide un fichier uploadé
   */
  static validateFile(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    maxWidth?: number;
    maxHeight?: number;
  } = {}): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];
    const {
      maxSize = VALIDATION_RULES.MAX_FILE_SIZE,
      allowedTypes = VALIDATION_RULES.ALLOWED_IMAGE_TYPES,
      maxWidth = 4000,
      maxHeight = 4000,
    } = options;

    // Vérifier la taille
    if (file.size > maxSize) {
      errors.push(`Le fichier est trop volumineux (max: ${Math.round(maxSize / 1024 / 1024)}MB)`);
    }

    // Vérifier le type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`);
    }

    // Vérifier les dimensions pour les images
    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (img.width > maxWidth || img.height > maxHeight) {
            errors.push(`L'image est trop grande (max: ${maxWidth}x${maxHeight}px)`);
          }
          resolve({
            isValid: errors.length === 0,
            errors,
          });
        };
        img.onerror = () => {
          errors.push('Impossible de lire les dimensions de l\'image');
          resolve({
            isValid: false,
            errors,
          });
        };
        img.src = URL.createObjectURL(file);
      });
    }

    return Promise.resolve({
      isValid: errors.length === 0,
      errors,
    });
  }

  /**
   * Génère un token CSRF
   */
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Valide un token CSRF
   */
  static validateCSRFToken(token: string, storedToken: string): boolean {
    if (!token || !storedToken) {
      return false;
    }
    return token === storedToken;
  }

  /**
   * Rate limiting simple
   */
  private static rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  static checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  /**
   * Nettoyer les données de rate limiting
   */
  static cleanupRateLimit(): void {
    const now = Date.now();
    for (const [key, record] of this.rateLimitMap.entries()) {
      if (now > record.resetTime) {
        this.rateLimitMap.delete(key);
      }
    }
  }

  /**
   * Valide les données d'un formulaire
   */
  static validateFormData<T extends Record<string, any>>(
    data: T,
    schema: Record<keyof T, {
      required?: boolean;
      type?: 'string' | 'number' | 'email' | 'date';
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
    }>
  ): {
    isValid: boolean;
    errors: Record<keyof T, string[]>;
  } {
    const errors: Record<keyof T, string[]> = {} as any;
    let isValid = true;

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      const fieldErrors: string[] = [];

      // Vérifier si requis
      if (rules.required && (!value || value === '')) {
        fieldErrors.push('Ce champ est requis');
        isValid = false;
      }

      if (value !== undefined && value !== null && value !== '') {
        // Vérifier le type
        if (rules.type === 'email' && !this.validateEmail(value)) {
          fieldErrors.push('Adresse email invalide');
          isValid = false;
        }

        if (rules.type === 'number' && isNaN(Number(value))) {
          fieldErrors.push('Valeur numérique requise');
          isValid = false;
        }

        if (rules.type === 'date' && isNaN(Date.parse(value))) {
          fieldErrors.push('Date invalide');
          isValid = false;
        }

        // Vérifier la longueur
        if (typeof value === 'string') {
          if (rules.minLength && value.length < rules.minLength) {
            fieldErrors.push(`Minimum ${rules.minLength} caractères`);
            isValid = false;
          }

          if (rules.maxLength && value.length > rules.maxLength) {
            fieldErrors.push(`Maximum ${rules.maxLength} caractères`);
            isValid = false;
          }

          // Vérifier le pattern
          if (rules.pattern && !rules.pattern.test(value)) {
            fieldErrors.push('Format invalide');
            isValid = false;
          }
        }
      }

      if (fieldErrors.length > 0) {
        errors[field as keyof T] = fieldErrors;
      }
    }

    return { isValid, errors };
  }
}

/**
 * Hook pour la validation de formulaires
 */
export const useFormValidation = <T extends Record<string, any>>(
  schema: Record<keyof T, {
    required?: boolean;
    type?: 'string' | 'number' | 'email' | 'date';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  }>
) => {
  const validate = (data: T) => {
    return SecurityUtils.validateFormData(data, schema);
  };

  const sanitize = (data: T): T => {
    const sanitized = { ...data };
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key as keyof T] = SecurityUtils.sanitizeString(value) as any;
      }
    }
    return sanitized;
  };

  return { validate, sanitize };
}; 