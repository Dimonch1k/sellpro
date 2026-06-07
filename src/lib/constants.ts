import type { DealStatus, PaymentMethod, MovementType, UserRole, PaymentStatus } from './types';

export const DEAL_STATUS_LABELS: Record<DealStatus, string> = {
  draft: 'Чернетка',
  completed: 'Завершено',
  cancelled: 'Скасовано',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Готівка',
  card: 'Картка',
  bank_transfer: 'Банківський переказ',
  other: 'Інше',
};

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  income: 'Надходження',
  sale: 'Продаж',
  return: 'Повернення',
  write_off: 'Списання',
  correction: 'Коригування',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Адміністратор',
  manager: 'Менеджер',
  accountant: 'Бухгалтер',
  viewer: 'Спостерігач',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: 'Оплачено',
  partial: 'Частково',
  unpaid: 'Не оплачено',
};

export const UNITS = ['шт', 'кг', 'л', 'м', 'упак', 'пал'];
