import { Request, Response, NextFunction } from 'express';
import { ApiResponse, ReminderRequest, RefreshTokenRequest } from './api.types';

// Extensions des types Express pour nos besoins spécifiques
export interface TypedRequest<T = any> extends Request {
  body: T;
}

export interface TypedResponse<T = any> extends Response {
  json: (body: ApiResponse<T>) => this;
  send: (body: ApiResponse<T>) => this;
}

// Types spécifiques pour les contrôleurs
export type ReminderRequestHandler = (
  req: TypedRequest<ReminderRequest>,
  res: TypedResponse,
  next: NextFunction
) => Promise<void> | void;

export type RefreshTokenRequestHandler = (
  req: TypedRequest<RefreshTokenRequest>,
  res: TypedResponse,
  next: NextFunction
) => Promise<void> | void;

export type GenericRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

// Type pour les middlewares d'erreur
export type ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// Types pour les headers personnalisés
export interface CustomHeaders {
  'appdevice'?: 'ios' | 'android';
  'x-api-version'?: string;
  'access-control-expose-headers'?: string;
}

export interface RequestWithHeaders extends Request {
  headers: Request['headers'] & CustomHeaders;
}
