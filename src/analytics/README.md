# Google Analytics Integration

## Usage

```typescript
import { trackCustomEvent } from "./analytics/customEventTracker";
import { AnalyticsEvent } from "./analytics/analyticsEvents";

// In your component
const handleClick = () => {
  trackCustomEvent(AnalyticsEvent.COPY_CITATION_CLICK);
};

// With additional parameters
const handleDownload = () => {
  trackCustomEvent(AnalyticsEvent.COPY_CITATION_CLICK, {
    file_type: "pdf",
    user_id: "123",
  });
};
```

## Adding New Events

1. Add to `analyticsEvents.ts`:

```typescript
export enum AnalyticsEvent {
  COPY_CITATION_CLICK = "copy_citation_click",
  YOUR_NEW_EVENT = "your_new_event", // ← Add here
}
```

2. Use it:

```typescript
trackCustomEvent(AnalyticsEvent.YOUR_NEW_EVENT);
```

## File Structure

```
analytics/
├── customEventTracker.ts    # Tracking function
└── analyticsEvents.ts       # Event definitions
```

## Naming Rules

- Use underscores (not hyphens): `copy_citation_click` ✅ not `copy-citation-click` ❌
- Keep names descriptive and consistent
- Follow GA4 event naming best practices
