// wrapper for process.env
export function getEnvVar(varName: string): string {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`Environment variable ${varName} not found`);
  }
  return value;
}
