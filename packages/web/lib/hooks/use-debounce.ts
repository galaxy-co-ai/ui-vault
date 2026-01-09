import { useCallback, useRef } from "react";

/**
 * Creates a debounced function that delays invoking the callback
 * until after the specified wait time has elapsed since the last call.
 *
 * @param callback - The function to debounce
 * @param delay - The number of milliseconds to delay (default: 300ms)
 * @returns A debounced version of the callback
 *
 * @example
 * const debouncedSearch = useDebounce((query: string) => {
 *   searchAPI(query);
 * }, 300);
 *
 * // In an input handler
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 */
export function useDebounce<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay = 300
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref on each render to avoid stale closures
  callbackRef.current = callback;

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  return debouncedCallback;
}

/**
 * A standalone debounce utility function (not a hook).
 * Useful for debouncing in Zustand stores or non-React contexts.
 *
 * @param fn - The function to debounce
 * @param delay - The number of milliseconds to delay (default: 300ms)
 * @returns A debounced version of the function with a cancel method
 *
 * @example
 * const debouncedLoad = debounce(() => {
 *   loadData();
 * }, 300);
 *
 * // Call it
 * debouncedLoad();
 *
 * // Cancel pending execution
 * debouncedLoad.cancel();
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay = 300
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };

  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFn;
}
