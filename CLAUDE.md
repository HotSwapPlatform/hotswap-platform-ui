# hotswap-platform-ui — projektikonteksti

## Tarkoitus

React + TypeScript -hallintakonsoli HotSwapPlatform-sovelluksille. Adapterienhallinta ja tilan reaaliaikaseuranta.

---

## Tekninen stack

- React 19, TypeScript
- Vite (bundler + dev server)
- Vitest + Testing Library (testit)
- Codecov (koodikattavuus)

---

## Yhteys backendiin

Ottaa yhteyttä `hotswap-finance-ai`:n REST-endpointteihin:
- AI-adapterien hallinta (`/api/ai/...`)
- DB-adapterien hallinta (`/api/db/...`)
- UI-adapterien hallinta (`/api/ui/...`)

---

## Testien tila

- 13 testiä, kaikki vihreitä
- Coverage: `npm run test:run -- --coverage`
- CI: GitHub Actions + Codecov

---

Työskentelyperiaatteet ja commit-käytäntö: katso `../hotswap-framework/CLAUDE.md`.
