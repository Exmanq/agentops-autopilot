const secretPatterns = [/ghp_[a-zA-Z0-9]+/g, /Bearer\s+[A-Za-z0-9\-_.]+/gi, /postgres:\/\/[^\s]+/gi];
export function redact(input) {
    return secretPatterns.reduce((text, pattern) => text.replace(pattern, '[REDACTED]'), input);
}
//# sourceMappingURL=redact.js.map