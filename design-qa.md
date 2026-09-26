# Design QA — Level completion chest screen

- Source visual truth: `C:\Users\Admin\.codex\generated_images\01a0db4c-75fd-7593-a4e5-99300865e1fa\exec-d4816608-040d-4963-8901-ddae12ff97c9.png`
- Implementation capture: Codex in-app Browser, tab 1, desktop capture at `1175 × 728` CSS px and mobile capture at `390 × 844` CSS px.
- Source pixels: `1592 × 992`; implementation desktop pixels: `1175 × 728`; implementation mobile pixels: `390 × 844`.
- Density normalization: browser captures used device scale factor 1; the source was assessed by composition and proportional layout rather than pixel overlay because its generated pixel dimensions differ from the requested viewport.
- State: assessment passed, chest closed and ready to open. The open-chest dialog was also tested.

## Full-view comparison evidence

The selected mock and the browser-rendered desktop capture were inspected in the same design pass. Both use a slim white product header, centered completion heading, one compact learning-proof row, one pale-lavender reward surface, a dominant indigo/gold chest, and one primary CTA. The implementation intentionally omits the mock's faint A/B/C background ornaments so the screen feels more like an English-learning product and less like an illustrated game scene.

## Focused-region comparison evidence

The reward stage and CTA were checked at desktop and mobile sizes. The generated transparent chest keeps the selected indigo/gold/paw-lock art direction, remains sharp at both sizes, and does not crop. The CTA remains fully visible and opens the existing pet-reveal dialog. No additional focused crop was needed because the browser captures made the type, chest edges, CTA, and learning-proof labels readable.

## Required fidelity surfaces

- Fonts and typography: hierarchy matches the mock; the existing product font stack is retained for consistency. Vietnamese headings and English skill labels wrap correctly.
- Spacing and layout rhythm: centered 820px content column, compact proof row, and single 760px reward surface preserve the intended focus. Desktop and 390px mobile layouts do not overflow.
- Colors and visual tokens: pale blue page, white product chrome, lavender reward surface, violet CTA, and restrained gold completion accents match the approved direction.
- Image quality and asset fidelity: the chest is a dedicated transparent PNG generated for this screen, not CSS art or a placeholder. Its crop, transparency, and responsive scaling were verified.
- Copy and content: one completion message, three learning signals, one reward message, and one primary action. Score is demoted to a small confirmation chip.

## Findings

- No actionable P0, P1, or P2 mismatch remains.
- P3: the production font renders slightly narrower than the generated mock's display face; preserving the app's existing typography is preferable to introducing a one-screen font dependency.

## Interaction and console checks

- Primary interaction tested: `Mở rương linh vật` opens the reveal dialog with the random companion and `Nhận linh vật` action.
- Responsive state tested at `390 × 844`.
- Browser console errors and warnings checked: none.

## Comparison history

- Initial coded pass: no P0/P1/P2 findings. Desktop hierarchy, chest focus, primary action, and mobile reflow matched the approved product-first direction.

## Implementation checklist

- [x] Replace the dashboard-style result layout with one focused reward flow.
- [x] Keep learning outcomes visible but secondary.
- [x] Use a real chest asset with clean transparency.
- [x] Keep one primary CTA.
- [x] Verify desktop, mobile, open state, and console.

final result: passed
