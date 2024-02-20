export function createDebounce<T extends (...args: any[]) => any>(this: any, fn: T, wait: number = 800): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer); // clear any pre-existing timer
    }
    const context: any = this; // get the current context
    timer = setTimeout(() => {
      fn.apply(context, args); // call the function if time expires
    }, wait);
  };
}
