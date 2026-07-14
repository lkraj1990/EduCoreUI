import { ReactNode } from "react";

export interface EduGridColumn<T = Record<string, unknown>> {
  key: Extract<keyof T, string | number> | string;
  label: string;
  sortable?: boolean;
  type?: 'badge' | 'link';
  badgeClass?: string;
  onClick?: (row: T) => void;
  render?: (value: unknown, row: T) => ReactNode;
}

export interface EduGridAction<T = Record<string, unknown>> {
  label: string;
  onClick: (row: T) => void;
  tooltip?: string;
  ariaLabel?: string;
  renderIcon?: () => ReactNode;
  icon?: ReactNode;
  iconOnly?: boolean;
  className?: string;
  isVisible?: (row: T) => boolean;
}

export interface EduGridProps<T = Record<string, unknown>> {
  columns: Array<EduGridColumn<T>>;
  data: T[];
  onRowClick?: (row: T) => void;
  actions?: Array<EduGridAction<T>>;
}
export interface EduModalOption {
  value: string;
  label: string;
}

export interface EduModalField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  rows?: number;
  helpText?: string;
  options?: EduModalOption[];
}

export interface EduModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, unknown>) => void;
  fields: EduModalField[];
  initialValues?: Record<string, unknown>;
  description?: string;
  submitButtonText?: string;
  cancelButtonText?: string;
  submitButtonVariant?: string;
  isSubmitting?: boolean;
  errorMessage?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  dialogClassName?: string;
}