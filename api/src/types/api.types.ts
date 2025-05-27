// Types génériques pour les réponses API
export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

// Types pour les requêtes de rappels
export interface ReminderRequest {
  pushNotifToken: string;
  type: 'Main' | 'Goal' | 'Inactivity';
  timeHours?: number;
  timeMinutes?: number;
  localId?: string;
  daysOfWeek?: DaysOfWeek;
  timezone?: string;
  disabled?: boolean;
}

export interface DaysOfWeek {
  sunday?: boolean;
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
}

export interface RefreshTokenRequest {
  newPushNotifToken: string;
  oldPushNotifToken: string;
}

// Types pour les données UTC
export interface UtcData {
  utcTimeHours?: number;
  utcTimeMinutes?: number;
  utcDaysOfWeek?: DaysOfWeek;
}

// Types pour les événements
export interface EventRequest {
  [key: string]: any; // À définir selon les besoins spécifiques
}

// Types pour les emails
export interface MailRequest {
  [key: string]: any; // À définir selon les besoins spécifiques
}
