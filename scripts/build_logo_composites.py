#!/usr/bin/env python3
"""Build composite logo SVGs (foreignObject + positioned imgs) from vendored Figma SVG parts."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOG = ROOT / "assets" / "images" / "logos"

# Tailwind inset-[top_right_bottom_left] from Figma MCP (Knight Frank 474:6159)
KF_INSETS = [
    (18.29, 21.55, 44.37, 69.34),
    (65.24, 33.08, 7.09, 57.33),
    (9.57, 79.97, 49.33, 2.99),
    (50.67, 79.97, 8.19, 2.99),
    (50.67, 63.0, 8.19, 20.03),
    (9.57, 63.0, 49.33, 20.03),
    (11.66, 2.68, 54.68, 90.88),
    (9.57, 46.5, 55.35, 42.46),
    (18.36, 37.27, 55.35, 54.29),
    (18.25, 32.32, 55.35, 64.85),
    (8.93, 10.58, 55.32, 80.51),
    (7.48, 31.98, 84.09, 64.55),
    (56.59, 49.71, 8.37, 42.43),
    (65.13, 43.16, 8.37, 50.7),
    (56.17, 18.4, 8.37, 78.79),
    (65.77, 11.44, 8.37, 81.6),
    (65.34, 23.32, 8.37, 68.22),
]

# JLL 474:6134 — leaf img nodes in document order
JLL_INSETS = [
    (19.99, 39.37, 18.49, 43.67),
    (19.99, 18.8, 20.13, 62.33),
    (19.99, 0.0, 20.13, 81.13),
    (15.34, 73.73, 0.07, 13.13),
    (5.24, 66.8, 0.0, 20.03),
    (0.0, 59.83, 0.0, 27.0),
    (0.0, 72.97, 15.49, 13.87),
    (0.0, 79.93, 5.24, 6.93),
    (0.0, 86.87, 0.07, 0.0),
    (87.05, 77.1, 5.16, 20.07),
    (96.11, 73.0, 0.07, 23.53),
    (96.26, 79.93, 0.07, 16.6),
    (5.16, 79.9, 87.05, 17.27),
    (0.0, 83.4, 96.11, 13.13),
    (0.0, 76.47, 96.26, 20.07),
]

# Keller Williams 474:6043 — masked regions (image slices kw-2 … kw-18)
KW_INSETS = [
    (96.65, 0.61, 0.95, 98.69),
    (95.64, 0.0, 0.0, 98.01),
    (77.52, 45.99, 0.19, 40.01),
    (77.61, 37.75, 0.37, 57.34),
    (77.61, 31.42, 0.37, 63.68),
    (77.62, 29.28, 0.37, 69.95),
    (77.62, 44.08, 0.37, 55.13),
    (77.5, 19.51, 0.37, 71.82),
    (77.66, 9.25, 0.37, 81.57),
    (77.43, 2.39, 0.03, 92.01),
    (77.68, 79.9, 0.31, 14.95),
    (77.68, 73.82, 0.31, 21.03),
    (77.68, 67.08, 0.31, 27.1),
    (77.68, 59.68, 0.31, 33.86),
    (77.68, 85.99, 0.34, 8.2),
    (77.68, 92.57, 0.38, 0.01),
    (0.0, 54.19, 33.42, 0.0),
]


def fo_svg(
    name: str,
    width: int,
    height: int,
    insets: list[tuple[float, float, float, float]],
    file_index: list[int] | None = None,
) -> str:
    imgs = []
    for i, (t, r, b, l) in enumerate(insets):
        idx = file_index[i] if file_index is not None else i
        imgs.append(
            "<div "
            f'style="position:absolute;top:{t}%;right:{r}%;bottom:{b}%;left:{l}%;overflow:visible">'
            f'<img alt="" src="{name}-{idx}.svg" '
            'style="position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block"/>'
            "</div>"
        )
    body = "\n      ".join(imgs)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <foreignObject width="{width}" height="{height}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;width:{width}px;height:{height}px;margin:0;padding:0;overflow:visible">
      {body}
    </div>
  </foreignObject>
</svg>
"""


def main() -> None:
    (LOG / "knight-frank-composite.svg").write_text(fo_svg("kf", 112, 56, KF_INSETS), encoding="utf-8")
    (LOG / "jll-composite.svg").write_text(fo_svg("jll", 112, 56, JLL_INSETS), encoding="utf-8")
    kw_idx = list(range(2, 2 + len(KW_INSETS)))
    (LOG / "keller-williams-composite.svg").write_text(fo_svg("kw", 112, 56, KW_INSETS, file_index=kw_idx), encoding="utf-8")
    print("wrote knight-frank-composite.svg, jll-composite.svg, keller-williams-composite.svg")


if __name__ == "__main__":
    main()
