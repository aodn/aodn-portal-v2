# Icon

Reusable icon components.

## Folder structure

```
icon/
├── <Name>Icon.tsx        Inline SVG icon, one per file.
├── OrganizationLogo.tsx  Image-based logo with default fallback.
├── IconContainer.tsx     Shared wrapper.
├── types.ts              Shared IconProps (width, height, color).
├── organisation/         Organisation icon set.
├── platform/             Platform icon set.
└── tabs/                 Tab icon set.
```

## Conventions

- Name components `<Name>Icon` in PascalCase; accept `IconProps` from `types.ts`.
- File name follows the export name (`FooIcon.tsx` exports `FooIcon`), one per file.
- Cohesive sets get a subfolder; shared icons stay top-level.
- New icons go here, not in `src/assets/` (legacy `.tsx` there: see its README).
- Prefer `currentColor` for fills so color is controlled by the caller.
