export function healthLabel(ok: boolean): string {
  return ok ? 'API ready' : 'API unreachable';
}
