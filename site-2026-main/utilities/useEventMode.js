import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FORCED_MODE, MODES, getEventMode } from "./eventConfig";

// The current lifecycle mode ("pre", "event" or "post"; see utilities/eventConfig.js).
// Pages are built ahead of time, so the first render uses the forced mode or "pre" (matching the
// server HTML); the browser then checks today's date and any ?mode= override.
export function useEventMode() {
  const { query } = useRouter();
  const [mode, setMode] = useState(FORCED_MODE || "pre");
  useEffect(() => {
    setMode(MODES.includes(query.mode) ? query.mode : getEventMode());
  }, [query.mode]);
  return mode;
}
