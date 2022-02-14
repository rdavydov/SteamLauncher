type SnackTypeArg = 'info' | 'warning' | 'success' | 'error';

// eslint-disable-next-line @typescript-eslint/naming-convention
interface JQueryStatic {
  snack(content: string, type: SnackTypeArg, delay = 3000): void;
}
