import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'destructive'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const baseClasses =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-button px-4 text-[15px] font-semibold leading-none transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-light shadow-sm hover:shadow-md',
  secondary: 'border border-primary bg-white text-primary hover:bg-primary/5 shadow-sm hover:shadow',
  // Destructive is text/outline only — never a filled red button.
  destructive: 'border border-danger bg-white text-danger hover:bg-danger/5',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props} />
}
