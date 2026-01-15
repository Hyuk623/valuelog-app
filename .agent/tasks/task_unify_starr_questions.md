# Task: Unify STARR Questions and Keep Examples

## Objective
The goal was to modify the "New Experience Record" page so that the STARR questions (labels and placeholders) are generic across all categories, preventing confusing questions like "What did you draw?" for non-drawing art activities. However, the category-specific examples needed to be preserved to assist users in writing.

## Changes Applied

### `src/pages/experiences/NewExperiencePage.tsx`
- **Logic Update**: Modified the STARR preset selection logic within the rendering loop of the STARR form (Step 3).
- **Generic Questions**: Explicitly fetches `genericPreset` (from `STARR_PRESETS[ageGroup]['generic']`) to populate the `label` and `placeholder`.
- **Specific Examples**: Explicitly fetches `topicPreset` (from `STARR_PRESETS[ageGroup][topicGroup]`) to populate the `example` field.
- **Merge**: Combines these into a `preset` object used for rendering the UI.

## Result
- **Before**: Selecting 'Art' category changed the question to "What did you make or draw?".
- **After**: Selecting 'Art' category keeps the question as "What happened?" (generic) but shows the example related to drawing/making if available. This fixes the issue for activities like music while keeping helpful context.

## Verification
- **Build**: valid (tsc passed).
- **Code Logic**: Reviewed and confirmed separation of concerns between Question Text (Generic) and Example Text (Specific).
