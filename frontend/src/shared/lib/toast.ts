export type ToastLevel = 'info' | 'success' | 'warning' | 'error';

type Impl = (message: string, level: ToastLevel) => void;

// Default: logs to console. Swap at boot time via setImpl().
let _impl: Impl = (message, level) => {
  console.warn(`[toast:${level}]`, message);
};

export const toastBus = {
  /** Replace the default console implementation with a real toast library. */
  setImpl: (fn: Impl): void => {
    _impl = fn;
  }
};

export const toast = {
  show: (msg: string, level: ToastLevel = 'info') => _impl(msg, level),
  info: (msg: string) => _impl(msg, 'info'),
  success: (msg: string) => _impl(msg, 'success'),
  warning: (msg: string) => _impl(msg, 'warning'),
  error: (msg: string) => _impl(msg, 'error')
} as const;
