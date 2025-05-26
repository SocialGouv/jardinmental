import { PrismaClient } from '@prisma/client';

// Export du client Prisma typé
export type PrismaClientType = PrismaClient;

// Types étendus pour les modèles Prisma (basés sur le schéma)
export interface AnonymisedUser {
  id: string;
  pushNotifToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reminder {
  id: string;
  userId: string;
  type: string;
  localId?: string;
  utcTimeHours?: number;
  utcTimeMinutes?: number;
  disabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: AnonymisedUser;
  utcDaysOfWeek?: UtcDaysOfWeek;
}

export interface UtcDaysOfWeek {
  id: string;
  reminderId: string;
  sunday?: boolean;
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les opérations Prisma
export interface CreateReminderData {
  user: { connect: { id: string } };
  type: string;
  localId?: string;
  utcTimeHours?: number;
  utcTimeMinutes?: number;
  disabled?: boolean;
  utcDaysOfWeek?: {
    create?: Omit<UtcDaysOfWeek, 'id' | 'reminderId' | 'createdAt' | 'updatedAt'>;
  };
}

export interface UpdateReminderData {
  utcTimeHours?: number;
  utcTimeMinutes?: number;
  disabled?: boolean;
  utcDaysOfWeek?: {
    upsert?: {
      create: Omit<UtcDaysOfWeek, 'id' | 'reminderId' | 'createdAt' | 'updatedAt'>;
      update: Omit<UtcDaysOfWeek, 'id' | 'reminderId' | 'createdAt' | 'updatedAt'>;
    };
  };
}
