// wrapper for process.env
export function getEnvVar(varName: string): string {
  // @ts-ignore
  let value;
  console.log(varName);
  if (varName === 'VITE_API_URL') {
    // @ts-ignore
    value = import.meta.env.VITE_API_URL;
  } else {
    // very annoying that viteVars[varName] doesn't work
    console.log(value);
    throw new Error(`Environment variable ${varName} not found`);
  }
  if (!value) {
    throw new Error(`Environment variable ${varName} not found`);
  }
  return value;
}
