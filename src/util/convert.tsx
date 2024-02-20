export function pascalToCamel(input: string): string {
  return input.charAt(0).toLowerCase() + input.slice(1);
}
