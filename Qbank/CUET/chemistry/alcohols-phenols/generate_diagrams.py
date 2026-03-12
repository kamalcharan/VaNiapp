#!/usr/bin/env python3
"""
Generate diagram PNGs for CUET Chemistry Alcohols, Phenols and Ethers question bank.

Produces two diagrams:
  1. cuet-chem-alcohols-mixed-19.png  – Hydrogen bonding in alcohols vs phenols
  2. cuet-chem-alcohols-mixed-20.png  – Flowchart: distinction tests for 1°, 2°, 3° alcohols
"""

import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

# ── Colour palette ──────────────────────────────────────────────────────────
DARK   = "#2c3e50"
RED    = "#e74c3c"
BLUE   = "#3498db"
GREEN  = "#2ecc71"
ORANGE = "#e67e22"
PURPLE = "#9b59b6"
GREY   = "#95a5a6"
WHITE  = "#ffffff"
LIGHT_BG = "#f8f9fa"

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "diagrams")
os.makedirs(OUT_DIR, exist_ok=True)

DPI = 150


# ═══════════════════════════════════════════════════════════════════════════
# Diagram 19: Hydrogen bonding in alcohols vs phenols
# ═══════════════════════════════════════════════════════════════════════════

def draw_diagram_19():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7), facecolor=WHITE)
    fig.suptitle("Intermolecular Hydrogen Bonding: Alcohols vs Phenols",
                 fontsize=16, fontweight="bold", color=DARK, y=0.97)

    # ── Left panel: Alcohol (ethanol) H-bonding ──
    ax1.set_xlim(-1, 10)
    ax1.set_ylim(-1, 10)
    ax1.set_aspect("equal")
    ax1.axis("off")
    ax1.set_title("Ethanol (CH₃CH₂OH)", fontsize=13, fontweight="bold",
                  color=BLUE, pad=12)

    # Molecule 1
    m1_ox, m1_oy = 2.5, 7.0  # oxygen position
    # Draw C-C-O backbone
    ax1.plot([0.5, 1.5], [7.0, 7.0], '-', color=DARK, lw=2.5)
    ax1.plot([1.5, m1_ox], [7.0, 7.0], '-', color=DARK, lw=2.5)
    ax1.plot([m1_ox, 3.8], [7.0, 7.0], '-', color=DARK, lw=2.5)

    # Atoms
    ax1.text(0.5, 7.0, "CH₃", fontsize=11, ha="center", va="center",
             bbox=dict(boxstyle="round,pad=0.2", fc=LIGHT_BG, ec=DARK, lw=1))
    ax1.text(1.5, 7.0, "CH₂", fontsize=11, ha="center", va="center",
             bbox=dict(boxstyle="round,pad=0.2", fc=LIGHT_BG, ec=DARK, lw=1))
    ax1.text(m1_ox, 7.0, "O", fontsize=13, ha="center", va="center",
             fontweight="bold", color=RED,
             bbox=dict(boxstyle="round,pad=0.2", fc="#fde8e8", ec=RED, lw=1.5))
    ax1.text(3.8, 7.0, "H", fontsize=13, ha="center", va="center",
             fontweight="bold", color=BLUE,
             bbox=dict(boxstyle="round,pad=0.2", fc="#e8f0fe", ec=BLUE, lw=1.5))

    # Partial charges on molecule 1
    ax1.text(m1_ox, 7.55, "δ⁻", fontsize=11, ha="center", color=RED, fontweight="bold")
    ax1.text(3.8, 7.55, "δ⁺", fontsize=11, ha="center", color=BLUE, fontweight="bold")

    # Molecule 2
    m2_ox, m2_oy = 6.5, 5.0
    ax1.plot([4.5, 5.5], [5.0, 5.0], '-', color=DARK, lw=2.5)
    ax1.plot([5.5, m2_ox], [5.0, 5.0], '-', color=DARK, lw=2.5)
    ax1.plot([m2_ox, 7.8], [5.0, 5.0], '-', color=DARK, lw=2.5)

    ax1.text(4.5, 5.0, "CH₃", fontsize=11, ha="center", va="center",
             bbox=dict(boxstyle="round,pad=0.2", fc=LIGHT_BG, ec=DARK, lw=1))
    ax1.text(5.5, 5.0, "CH₂", fontsize=11, ha="center", va="center",
             bbox=dict(boxstyle="round,pad=0.2", fc=LIGHT_BG, ec=DARK, lw=1))
    ax1.text(m2_ox, 5.0, "O", fontsize=13, ha="center", va="center",
             fontweight="bold", color=RED,
             bbox=dict(boxstyle="round,pad=0.2", fc="#fde8e8", ec=RED, lw=1.5))
    ax1.text(7.8, 5.0, "H", fontsize=13, ha="center", va="center",
             fontweight="bold", color=BLUE,
             bbox=dict(boxstyle="round,pad=0.2", fc="#e8f0fe", ec=BLUE, lw=1.5))

    ax1.text(m2_ox, 5.55, "δ⁻", fontsize=11, ha="center", color=RED, fontweight="bold")
    ax1.text(7.8, 5.55, "δ⁺", fontsize=11, ha="center", color=BLUE, fontweight="bold")

    # Hydrogen bond (dashed) from H of mol1 to O of mol2
    ax1.annotate("", xy=(m2_ox, 5.35), xytext=(3.8, 6.65),
                 arrowprops=dict(arrowstyle="-", linestyle="dashed",
                                 lw=2.5, color=GREEN))
    # H-bond label
    ax1.text(5.0, 6.2, "H-bond", fontsize=10, ha="center", color=GREEN,
             fontweight="bold", rotation=-30)
    ax1.text(5.0, 5.75, "~1.8 Å", fontsize=9, ha="center", color=GREEN,
             fontstyle="italic", rotation=-30)

    # Bond length annotations
    ax1.annotate("", xy=(2.5, 6.3), xytext=(3.8, 6.3),
                 arrowprops=dict(arrowstyle="<->", color=ORANGE, lw=1.5))
    ax1.text(3.15, 6.0, "O–H\n0.96 Å", fontsize=8, ha="center", color=ORANGE)

    # O···O distance
    ax1.annotate("", xy=(m1_ox, 8.0), xytext=(m2_ox, 8.0),
                 arrowprops=dict(arrowstyle="<->", color=PURPLE, lw=1.5))
    ax1.text(4.5, 8.3, "O···O ≈ 2.7–2.8 Å", fontsize=9, ha="center",
             color=PURPLE, fontweight="bold")

    # Molecule 3 for chain
    m3_ox, m3_oy = 3.0, 3.0
    ax1.plot([1.0, 2.0], [3.0, 3.0], '-', color=DARK, lw=2.5)
    ax1.plot([2.0, m3_ox], [3.0, 3.0], '-', color=DARK, lw=2.5)
    ax1.plot([m3_ox, 4.3], [3.0, 3.0], '-', color=DARK, lw=2.5)

    ax1.text(1.0, 3.0, "CH₃", fontsize=11, ha="center", va="center",
             bbox=dict(boxstyle="round,pad=0.2", fc=LIGHT_BG, ec=DARK, lw=1))
    ax1.text(2.0, 3.0, "CH₂", fontsize=11, ha="center", va="center",
             bbox=dict(boxstyle="round,pad=0.2", fc=LIGHT_BG, ec=DARK, lw=1))
    ax1.text(m3_ox, 3.0, "O", fontsize=13, ha="center", va="center",
             fontweight="bold", color=RED,
             bbox=dict(boxstyle="round,pad=0.2", fc="#fde8e8", ec=RED, lw=1.5))
    ax1.text(4.3, 3.0, "H", fontsize=13, ha="center", va="center",
             fontweight="bold", color=BLUE,
             bbox=dict(boxstyle="round,pad=0.2", fc="#e8f0fe", ec=BLUE, lw=1.5))
    ax1.text(m3_ox, 3.55, "δ⁻", fontsize=11, ha="center", color=RED, fontweight="bold")
    ax1.text(4.3, 3.55, "δ⁺", fontsize=11, ha="center", color=BLUE, fontweight="bold")

    # H-bond from mol2 H to mol3 O
    ax1.annotate("", xy=(m3_ox, 3.35), xytext=(7.8, 4.65),
                 arrowprops=dict(arrowstyle="-", linestyle="dashed",
                                 lw=2.5, color=GREEN))
    ax1.text(5.8, 3.7, "H-bond", fontsize=10, ha="center", color=GREEN,
             fontweight="bold", rotation=-20)

    # Caption
    ax1.text(5.0, 0.5, "Extensive H-bond network\nraises boiling point to 78 °C",
             fontsize=10, ha="center", color=DARK, fontstyle="italic",
             bbox=dict(boxstyle="round,pad=0.3", fc="#eaf7ea", ec=GREEN, lw=1))

    # ── Right panel: Phenol H-bonding ──
    ax2.set_xlim(-1, 10)
    ax2.set_ylim(-1, 10)
    ax2.set_aspect("equal")
    ax2.axis("off")
    ax2.set_title("Phenol (C₆H₅OH)", fontsize=13, fontweight="bold",
                  color=RED, pad=12)

    def draw_ring(ax, cx, cy, r=1.0, color=DARK):
        """Draw a stylised benzene hexagon with circle."""
        import numpy as np
        angles = np.linspace(0, 2 * np.pi, 7)
        xs = cx + r * np.cos(angles)
        ys = cy + r * np.sin(angles)
        ax.plot(xs, ys, '-', color=color, lw=2.5)
        circle = plt.Circle((cx, cy), r * 0.55, fill=False, color=color,
                             lw=1.5, linestyle='-')
        ax.add_patch(circle)

    # Phenol molecule 1
    draw_ring(ax2, 3.0, 7.0, r=1.0, color=DARK)
    # O-H coming off the ring (to the right)
    ax2.plot([4.0, 5.0], [7.0, 7.0], '-', color=DARK, lw=2.5)
    ax2.plot([5.0, 6.2], [7.0, 7.0], '-', color=DARK, lw=2.5)
    ax2.text(5.0, 7.0, "O", fontsize=13, ha="center", va="center",
             fontweight="bold", color=RED,
             bbox=dict(boxstyle="round,pad=0.2", fc="#fde8e8", ec=RED, lw=1.5))
    ax2.text(6.2, 7.0, "H", fontsize=13, ha="center", va="center",
             fontweight="bold", color=BLUE,
             bbox=dict(boxstyle="round,pad=0.2", fc="#e8f0fe", ec=BLUE, lw=1.5))
    ax2.text(5.0, 7.55, "δ⁻", fontsize=11, ha="center", color=RED, fontweight="bold")
    ax2.text(6.2, 7.55, "δ⁺", fontsize=11, ha="center", color=BLUE, fontweight="bold")

    # sp2 label
    ax2.text(4.0, 7.5, "sp²", fontsize=9, ha="center", color=PURPLE,
             fontweight="bold")

    # Phenol molecule 2
    draw_ring(ax2, 5.5, 4.0, r=1.0, color=DARK)
    ax2.plot([6.5, 7.5], [4.0, 4.0], '-', color=DARK, lw=2.5)
    ax2.plot([7.5, 8.7], [4.0, 4.0], '-', color=DARK, lw=2.5)
    ax2.text(7.5, 4.0, "O", fontsize=13, ha="center", va="center",
             fontweight="bold", color=RED,
             bbox=dict(boxstyle="round,pad=0.2", fc="#fde8e8", ec=RED, lw=1.5))
    ax2.text(8.7, 4.0, "H", fontsize=13, ha="center", va="center",
             fontweight="bold", color=BLUE,
             bbox=dict(boxstyle="round,pad=0.2", fc="#e8f0fe", ec=BLUE, lw=1.5))
    ax2.text(7.5, 4.55, "δ⁻", fontsize=11, ha="center", color=RED, fontweight="bold")
    ax2.text(8.7, 4.55, "δ⁺", fontsize=11, ha="center", color=BLUE, fontweight="bold")

    # H-bond from mol1 H to mol2 O
    ax2.annotate("", xy=(7.5, 4.35), xytext=(6.2, 6.65),
                 arrowprops=dict(arrowstyle="-", linestyle="dashed",
                                 lw=2.5, color=GREEN))
    ax2.text(7.2, 5.7, "H-bond", fontsize=10, ha="center", color=GREEN,
             fontweight="bold", rotation=-55)
    ax2.text(7.2, 5.2, "~1.7 Å", fontsize=9, ha="center", color=GREEN,
             fontstyle="italic", rotation=-55)

    # Note about phenol's more polar O-H
    ax2.text(5.0, 1.5,
             "O–H bond is more polar due to\nsp² C (more electronegative)\n"
             "→ Slightly stronger individual H-bonds\n"
             "Boiling point: 182 °C",
             fontsize=10, ha="center", color=DARK, fontstyle="italic",
             bbox=dict(boxstyle="round,pad=0.3", fc="#fde8e8", ec=RED, lw=1))

    # Resonance arrow
    ax2.annotate("Lone pair\nresonance\ninto ring",
                 xy=(3.0, 6.0), xytext=(1.0, 4.5),
                 fontsize=9, ha="center", color=PURPLE, fontweight="bold",
                 arrowprops=dict(arrowstyle="->", color=PURPLE, lw=1.5))

    fig.tight_layout(rect=[0, 0, 1, 0.94])
    out_path = os.path.join(OUT_DIR, "cuet-chem-alcohols-mixed-19.png")
    fig.savefig(out_path, dpi=DPI, bbox_inches="tight", facecolor=WHITE)
    plt.close(fig)
    print(f"  ✓ Saved {out_path}")


# ═══════════════════════════════════════════════════════════════════════════
# Diagram 20: Flowchart – distinction tests for 1°, 2°, 3° alcohols
# ═══════════════════════════════════════════════════════════════════════════

def _box(ax, x, y, w, h, text, fc=WHITE, ec=DARK, fs=10, tc=DARK, lw=2, bold=False):
    """Draw a rounded rectangle with centred text."""
    box = FancyBboxPatch((x - w / 2, y - h / 2), w, h,
                          boxstyle="round,pad=0.15", facecolor=fc,
                          edgecolor=ec, linewidth=lw, zorder=2)
    ax.add_patch(box)
    weight = "bold" if bold else "normal"
    ax.text(x, y, text, fontsize=fs, ha="center", va="center",
            color=tc, fontweight=weight, zorder=3)


def _arrow(ax, x1, y1, x2, y2, label="", color=DARK, lw=1.8, label_offset=(0, 0)):
    """Draw an arrow between two points with optional label."""
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="-|>", color=color, lw=lw),
                zorder=1)
    if label:
        mx = (x1 + x2) / 2 + label_offset[0]
        my = (y1 + y2) / 2 + label_offset[1]
        ax.text(mx, my, label, fontsize=8, ha="center", va="center",
                color=color, fontweight="bold",
                bbox=dict(boxstyle="round,pad=0.15", fc=WHITE, ec=color, lw=0.8))


def draw_diagram_20():
    fig, ax = plt.subplots(figsize=(15, 10), facecolor=WHITE)
    ax.set_xlim(0, 15)
    ax.set_ylim(0, 10)
    ax.axis("off")
    ax.set_title("Distinction Tests for 1°, 2°, and 3° Alcohols",
                 fontsize=16, fontweight="bold", color=DARK, pad=20)

    # ── TOP: Unknown alcohol ──
    _box(ax, 7.5, 9.2, 3.5, 0.8, "Unknown Alcohol\n(R–OH)",
         fc="#eaf2f8", ec=BLUE, fs=11, tc=DARK, bold=True)

    # ── LUCAS TEST branch ──
    _arrow(ax, 7.5, 8.8, 7.5, 7.9, label="Add Lucas Reagent\n(anhyd. ZnCl₂ + conc. HCl)",
           color=BLUE, label_offset=(0, 0))

    _box(ax, 7.5, 7.5, 3.0, 0.7, "LUCAS TEST", fc=BLUE, ec=DARK,
         fs=12, tc=WHITE, bold=True)

    # Three branches from Lucas test
    # Left: 3° alcohol (immediate)
    _arrow(ax, 6.0, 7.15, 2.5, 6.3, label="Immediate\nturbidity", color=RED,
           label_offset=(-0.3, 0))
    _box(ax, 2.5, 5.8, 2.8, 0.8, "3° Alcohol\n(e.g., tert-butanol)",
         fc="#fde8e8", ec=RED, fs=10, tc=DARK, bold=True)

    # Centre: 2° alcohol (5-20 min)
    _arrow(ax, 7.5, 7.15, 7.5, 6.3, label="Turbidity in\n5–20 min", color=ORANGE,
           label_offset=(0, 0))
    _box(ax, 7.5, 5.8, 2.8, 0.8, "2° Alcohol\n(e.g., propan-2-ol)",
         fc="#fef5e7", ec=ORANGE, fs=10, tc=DARK, bold=True)

    # Right: 1° alcohol (no turbidity)
    _arrow(ax, 9.0, 7.15, 12.5, 6.3, label="No turbidity\nat RT", color=GREEN,
           label_offset=(0.3, 0))
    _box(ax, 12.5, 5.8, 2.8, 0.8, "1° Alcohol\n(e.g., propan-1-ol)",
         fc="#eaf7ea", ec=GREEN, fs=10, tc=DARK, bold=True)

    # ── OXIDATION TEST branch (below each) ──
    # 3° alcohol: no oxidation
    _arrow(ax, 2.5, 5.4, 2.5, 4.5, label="K₂Cr₂O₇ / H⁺", color=GREY)
    _box(ax, 2.5, 4.0, 2.6, 0.8, "No Reaction\n(resistant to oxidation)",
         fc="#f2f3f4", ec=GREY, fs=9, tc=DARK, bold=False)

    # 2° alcohol: ketone
    _arrow(ax, 7.5, 5.4, 7.5, 4.5, label="K₂Cr₂O₇ / H⁺", color=ORANGE)
    _box(ax, 7.5, 4.0, 2.6, 0.8, "Ketone\n(e.g., CH₃COCH₃)",
         fc="#fef5e7", ec=ORANGE, fs=10, tc=DARK, bold=True)

    # 1° alcohol: aldehyde → carboxylic acid
    _arrow(ax, 12.5, 5.4, 12.5, 4.5, label="K₂Cr₂O₇ / H⁺", color=GREEN)
    _box(ax, 12.5, 4.0, 2.6, 0.8, "Aldehyde → Carboxylic Acid\n(e.g., CH₃CHO → CH₃COOH)",
         fc="#eaf7ea", ec=GREEN, fs=9, tc=DARK, bold=True)

    # ── Summary boxes at bottom ──
    # 3° summary
    _box(ax, 2.5, 2.5, 3.2, 1.2,
         "3° Alcohol Summary\n━━━━━━━━━━━━━━━\nLucas: Immediate turbidity\nOxidation: No reaction\nSN1 mechanism (stable 3° carbocation)",
         fc="#fde8e8", ec=RED, fs=8, tc=DARK, bold=False)

    # 2° summary
    _box(ax, 7.5, 2.5, 3.2, 1.2,
         "2° Alcohol Summary\n━━━━━━━━━━━━━━━\nLucas: 5–20 min turbidity\nOxidation: → Ketone\nIodoform test +ve (if CH₃CHOH–)",
         fc="#fef5e7", ec=ORANGE, fs=8, tc=DARK, bold=False)

    # 1° summary
    _box(ax, 12.5, 2.5, 3.2, 1.2,
         "1° Alcohol Summary\n━━━━━━━━━━━━━━━\nLucas: No turbidity at RT\nOxidation: → Aldehyde → Acid\nTollens/Fehling +ve (aldehyde stage)",
         fc="#eaf7ea", ec=GREEN, fs=8, tc=DARK, bold=False)

    # Arrows from oxidation to summary
    _arrow(ax, 2.5, 3.6, 2.5, 3.15, color=GREY)
    _arrow(ax, 7.5, 3.6, 7.5, 3.15, color=ORANGE)
    _arrow(ax, 12.5, 3.6, 12.5, 3.15, color=GREEN)

    # Legend / note
    ax.text(7.5, 0.7,
            "Carbocation stability order: 3° > 2° > 1°  →  Rate of Lucas test: 3° > 2° > 1°",
            fontsize=11, ha="center", va="center", color=DARK, fontweight="bold",
            bbox=dict(boxstyle="round,pad=0.3", fc="#eaf2f8", ec=BLUE, lw=1.5))

    fig.tight_layout()
    out_path = os.path.join(OUT_DIR, "cuet-chem-alcohols-mixed-20.png")
    fig.savefig(out_path, dpi=DPI, bbox_inches="tight", facecolor=WHITE)
    plt.close(fig)
    print(f"  ✓ Saved {out_path}")


# ═══════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("Generating diagrams for Alcohols, Phenols and Ethers …")
    draw_diagram_19()
    draw_diagram_20()
    print("Done.")
