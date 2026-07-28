# Assets

Static files imported as URLs (png, jpg, raw svg). No React components.

```
assets/
├── images/                  General images.
├── logos/                   Site and partner logos.
├── icons/                   PNG icons.
├── topics-panel-icons/      ⚠ Legacy .tsx
├── filter-organisations/    ⚠ Legacy .tsx
└── filter-platforms/        ⚠ Legacy .tsx
```

SVG icons are components — put them in `src/components/icon/`, not here.

## TODO: migrate legacy `.tsx` to `src/components/icon/`

- [ ] `icons/map/`
- [ ] `icons/download/`, `icons/details/`, `icons/search/`, loose `.tsx`
- [ ] `filter-platforms/`, `filter-organisations/` (inline into existing wrappers)
- [ ] `topics-panel-icons/`

Delete this section when done.
