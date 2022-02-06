// eslint-disable-next-line @typescript-eslint/naming-convention
interface JQuery {
  fileDrop(callback: (file: Record<string, string>) => void): JQuery;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface JQueryStatic {
  snack(
    content: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    delay = 3000,
  ): void;
}
