export function normalizeErrorMessage(error: unknown, fallback = 'Сталася помилка. Спробуйте ще раз.'): string {
  if (!error) {
    return fallback;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const maybeMessage = 'message' in error ? String(error.message) : '';

    if (!maybeMessage) {
      return fallback;
    }

    if (maybeMessage.includes('Invalid login credentials')) {
      return 'Невірний email або пароль.';
    }

    if (maybeMessage.includes('Email not confirmed')) {
      return 'Підтвердіть email перед входом у систему.';
    }

    if (maybeMessage.includes('duplicate key value')) {
      return 'Запис з такими даними вже існує.';
    }

    if (maybeMessage.includes('row-level security')) {
      return 'У вас немає прав для цієї дії.';
    }

    if (maybeMessage.includes('Недостатньо залишку товару')) {
      return 'Недостатньо товару на складі для завершення угоди.';
    }

    return maybeMessage;
  }

  return fallback;
}

export function toNumber(value: number | string | null | undefined): number {
  if (typeof value === 'number') {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9а-яіїєґ]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

export function getInitials(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? '')
    .join('');
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
