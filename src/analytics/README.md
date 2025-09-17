# Google Analytics Integration

## Usage

```typescript
import { trackCustomEvent } from "./analytics/customEventTracker";
import { CustomEvent } from "./analytics/constants";

// In your component
const handleClick = () => {
  trackCustomEvent(CustomEvent.COPY_CITATION_CLICK);
};
```

## Adding New Events

1. Add to `constants.ts`:

```typescript
export enum CustomEvent {
  COPY_CITATION_CLICK = "copy_citation_click",
  YOUR_NEW_EVENT = "your_new_event", // ← Add here
}
```

2. Use it:

```typescript
trackCustomEvent(CustomEvent.YOUR_NEW_EVENT);
```

## Naming Rules

- Use underscores (not hyphens): `copy_citation_click` ✅ not `copy-citation-click` ❌
- Keep names descriptive and consistent
