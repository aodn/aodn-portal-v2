## Logic Flow

```
Component → useAnalytics() → track() → trackCustomEvent() → window.gtag() → GA4
```

## Files

- `constants.ts` - Event definitions
- `customEventTracker.ts` - Core gtag function
- `useAnalytics.ts` - React hook

## Usage

```typescript
import { useAnalytics } from "./analytics/useAnalytics";
import { TRACKING_EVENTS } from "./analytics/constants";

const { track } = useAnalytics();

// Basic tracking
track(TRACKING_EVENTS.COPY_CITATION_CLICK);

// With parameters (param_name: param_value)
track(TRACKING_EVENTS.COPY_CITATION_CLICK, {
  param_name: param_value,
  param_name: param_value,
});
```

## Adding Events

1. Add to `constants.ts`:

```typescript
export const TRACKING_EVENTS = {
  COPY_CITATION_CLICK: "copy_citation_click",
  NEW_EVENT: "new_event", // ← Add here
} as const;
```

2. Use it:

```typescript
track(TRACKING_EVENTS.NEW_EVENT);
```
