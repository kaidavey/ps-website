# Image placeholders

Every file here is a generated grey placeholder at the exact pixel dimensions
of the corresponding Figma layer. They exist so the layout renders and can be
verified; none of them is artwork.

`figma.com` is blocked by this workspace's network policy, so the exported
assets could not be downloaded automatically.

## Replacing them

Export each layer from Figma at 2x, drop it in this folder, then point the
matching record in `src/content/generated/*.json` at the new filename. Nothing
in `src/` hardcodes these paths — they are content, so a swap is a data edit.

| Placeholder             | Figma layer                                         | Size (1x) |
| ----------------------- | --------------------------------------------------- | --------- |
| `hero-group.svg`        | `_DSC6418 2`                                        | 986 x 563 |
| `gallery-1.svg`         | `_DSC6528 1`                                        | 508 x 337 |
| `gallery-2.svg`         | `DCDBD6B5-5A3A-4092-8ADF-099578ADFA5C 1`            | 508 x 337 |
| `gallery-3.svg`         | `IMG_3507 1`                                        | 508 x 337 |
| `gallery-4.svg`         | `_DSC6550 1`                                        | 508 x 337 |
| `gallery-5.svg`         | `4E0EA1A3-DBB2-49CE-8AAE-87C72C16E6D2 1`            | 508 x 337 |
| `pillar-community.svg`  | `IMG_1654 2 1`                                      | 446 x 300 |
| `pillar-fellowship.svg` | `image 2`                                           | 428 x 300 |
| `pillar-projects.svg`   | `Project Image Container` (flatten the whole group) | 421 x 303 |
| `events-luma.svg`       | `Screenshot 2026-08-31 at 10.36.33 PM 1`            | 764 x 411 |

Prefer `.webp` or `.jpg` for the photographs — they are the largest assets on
the page. Keep the aspect ratios above; the intrinsic `width`/`height` in the
content JSON is what reserves layout space, so update those too if a crop
changes.

The hero background gradient (`Gradient`, 2296 x 1262) is reproduced in CSS in
`src/components/sections/Hero.module.css` rather than shipped as a 2296px-wide
image. Swap it for the export if you want an exact match.
