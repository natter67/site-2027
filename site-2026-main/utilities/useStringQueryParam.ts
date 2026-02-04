"use client";

// This replicates useQueryParam without using that library, since use-query-param does not support Next 16
// Make sure to test this once exhibits and special events are populated

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useStringQueryParam(
  key: string,
  defaultValue = ""
): [string, (value: string) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const value = useMemo(() => {
    return searchParams.get(key) ?? defaultValue;
  }, [searchParams, key, defaultValue]);

  const setValue = useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newValue === defaultValue || newValue === "") {
        params.delete(key);
      } else {
        params.set(key, newValue);
      }

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [key, defaultValue, pathname, router, searchParams]
  );

  return [value, setValue];
}