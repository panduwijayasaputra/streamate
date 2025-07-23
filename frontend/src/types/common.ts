// Common Types used across the application
import { ComponentType, SVGProps } from "react";

// Common Enums
export enum AlertSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum AlertType {
  SPAM = "spam",
  INAPPROPRIATE = "inappropriate",
  GAMBLING = "gambling",
  CONTEXT_MISMATCH = "context_mismatch",
  MENTION = "mention",
  TRENDING = "trending",
}

export enum AlertAction {
  WARN = "warn",
  TIMEOUT = "timeout",
  BAN = "ban",
  NONE = "none",
}

export enum WebSocketMessageType {
  CHAT_MESSAGE = "chat_message",
  AI_RESPONSE = "ai_response",
  STREAM_STATUS = "stream_status",
  ALERT = "alert",
  HEARTBEAT = "heartbeat",
  VIEWER_UPDATE = "viewer_update",
  ENGAGEMENT_UPDATE = "engagement_update",
}

export enum FormFieldType {
  TEXT = "text",
  EMAIL = "email",
  PASSWORD = "password",
  NUMBER = "number",
  SELECT = "select",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  RADIO = "radio",
}

export enum FilterOperator {
  EQUALS = "equals",
  CONTAINS = "contains",
  GREATER = "greater",
  LESS = "less",
  IN = "in",
  NOT_IN = "notIn",
}

export enum StreamEventType {
  START = "start",
  END = "end",
  PAUSE = "pause",
  RESUME = "resume",
  ERROR = "error",
}

export enum ChatEventType {
  MESSAGE = "message",
  FOLLOW = "follow",
  DONATION = "donation",
  SUBSCRIPTION = "subscription",
  RAID = "raid",
}

export enum Status {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

export enum NotificationType {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

// WebSocket Types
export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: Record<string, unknown>;
  timestamp: Date;
  id?: string;
}

export interface ChatAnalysisAlert {
  type: AlertType;
  message: string;
  severity: AlertSeverity;
  timestamp: Date;
  messageId: string;
  action?: AlertAction;
}

// UI Component Types
export interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: ComponentType<IconProps>;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

export interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  className?: string;
}

// Form Types
export interface FormOption {
  value: string;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: unknown) => string | null;
  };
  options?: FormOption[];
}

export interface FormData {
  [key: string]: unknown;
}

export interface FormErrors {
  [key: string]: string;
}

// Loading and Error States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  retry?: () => void;
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: ComponentType<IconProps>;
  badge?: string | number;
  children?: NavigationItem[];
  isActive?: boolean;
  isDisabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

// Event Types
export interface StreamEvent {
  type: StreamEventType;
  timestamp: Date;
  data?: Record<string, unknown>;
  streamId: string;
}

export interface ChatEvent {
  type: ChatEventType;
  timestamp: Date;
  data: Record<string, unknown>;
  streamId: string;
}

// Utility Types
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface FilterConfig {
  key: string;
  value: unknown;
  operator: FilterOperator;
}

// Date and Time Types
export interface TimeRange {
  start: Date;
  end: Date;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// File Types
export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  progress?: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}
