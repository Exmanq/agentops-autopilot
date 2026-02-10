const secretPatterns = [/ghp_[a-zA-Z0-9]+/g, /Bearer\s+[A-Za-z0-9\-_.]+/gi, /postgres:\/\/[^\s]+/gi];

export function redact(input: string): string {
  return secretPatterns.reduce((text, pattern) => text.replace(pattern, '[REDACTED]'), input);
}
