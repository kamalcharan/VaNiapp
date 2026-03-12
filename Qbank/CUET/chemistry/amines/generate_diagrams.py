#!/usr/bin/env python3
"""
Generate diagrams for CUET Chemistry Amines question bank.

Diagram 19: Basicity comparison bar chart (pKb values of methylamine,
            dimethylamine, trimethylamine, and aniline)
Diagram 20: Flowchart for Hinsberg test to distinguish 1°, 2°, and 3° amines
"""

import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

# Ensure output directory exists
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "diagrams")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ─────────────────────────────────────────────────────────────────────
# Diagram 19 — Basicity comparison bar chart (pKb values)
# ─────────────────────────────────────────────────────────────────────

def generate_diagram_19():
    amines = ["Methylamine\n(CH₃NH₂)", "Dimethylamine\n((CH₃)₂NH)",
              "Trimethylamine\n((CH₃)₃N)", "Aniline\n(C₆H₅NH₂)"]
    pkb_values = [3.36, 3.27, 4.19, 9.38]
    colors = ["#2196F3", "#4CAF50", "#FF9800", "#E91E63"]

    fig, ax = plt.subplots(figsize=(8, 5))
    bars = ax.bar(amines, pkb_values, color=colors, width=0.55,
                  edgecolor="#333333", linewidth=0.8)

    # Add value labels on each bar
    for bar, val in zip(bars, pkb_values):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.15,
                f"pKb = {val}", ha="center", va="bottom",
                fontsize=10, fontweight="bold", color="#222222")

    ax.set_ylabel("pKb Value", fontsize=12, fontweight="bold")
    ax.set_title("Basicity Comparison of Amines (pKb Values in Aqueous Solution)",
                 fontsize=13, fontweight="bold", pad=12)
    ax.set_ylim(0, 11)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.tick_params(axis="x", labelsize=9)
    ax.tick_params(axis="y", labelsize=10)

    # Add annotation
    ax.annotate("Lower pKb = Stronger base",
                xy=(0.02, 0.95), xycoords="axes fraction",
                fontsize=9, fontstyle="italic", color="#555555",
                bbox=dict(boxstyle="round,pad=0.3", facecolor="#FFF9C4",
                          edgecolor="#FBC02D", alpha=0.9))

    fig.tight_layout()
    out_path = os.path.join(OUTPUT_DIR, "cuet-chem-amines-mixed-19.png")
    fig.savefig(out_path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"Saved: {out_path}")


# ─────────────────────────────────────────────────────────────────────
# Diagram 20 — Flowchart: Hinsberg test for 1°, 2°, 3° amines
# ─────────────────────────────────────────────────────────────────────

def generate_diagram_20():
    fig, ax = plt.subplots(figsize=(10, 7))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis("off")
    ax.set_title("Hinsberg Test — Flowchart for Distinguishing 1°, 2°, and 3° Amines",
                 fontsize=13, fontweight="bold", pad=15)

    # Helper to draw a rounded rectangle with text
    def draw_box(x, y, w, h, text, facecolor="#E3F2FD", edgecolor="#1565C0",
                 fontsize=9, fontweight="normal", text_color="#000000"):
        rect = mpatches.FancyBboxPatch(
            (x - w / 2, y - h / 2), w, h,
            boxstyle="round,pad=0.15", facecolor=facecolor,
            edgecolor=edgecolor, linewidth=1.5)
        ax.add_patch(rect)
        ax.text(x, y, text, ha="center", va="center", fontsize=fontsize,
                fontweight=fontweight, color=text_color, wrap=True,
                multialignment="center")

    # Helper to draw a diamond (decision node)
    def draw_diamond(x, y, w, h, text, facecolor="#FFF9C4",
                     edgecolor="#F57F17", fontsize=8.5):
        diamond = plt.Polygon(
            [(x, y + h / 2), (x + w / 2, y), (x, y - h / 2), (x - w / 2, y)],
            closed=True, facecolor=facecolor, edgecolor=edgecolor,
            linewidth=1.5)
        ax.add_patch(diamond)
        ax.text(x, y, text, ha="center", va="center", fontsize=fontsize,
                fontweight="bold", multialignment="center")

    # Helper for arrows
    def arrow(x1, y1, x2, y2, label="", label_side="left"):
        ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="-|>", color="#333333",
                                    lw=1.5))
        if label:
            mx = (x1 + x2) / 2
            my = (y1 + y2) / 2
            offset = (-0.35, 0) if label_side == "left" else (0.35, 0)
            ax.text(mx + offset[0], my + offset[1], label, fontsize=8.5,
                    fontweight="bold", color="#D32F2F", ha="center", va="center")

    # ── Nodes ──

    # Step 1: Starting reagent box
    draw_box(5, 9.2, 5.5, 0.8,
             "Unknown Amine  +  C₆H₅SO₂Cl  +  aq. NaOH",
             facecolor="#BBDEFB", edgecolor="#1565C0",
             fontsize=10, fontweight="bold")

    # Decision 1: Precipitate formed?
    draw_diamond(5, 7.2, 3.4, 1.2, "Precipitate\nformed?")

    # Arrow from start to decision 1
    arrow(5, 8.8, 5, 7.85)

    # No branch → 3° amine
    draw_box(1.5, 5.5, 2.8, 1.0,
             "3° Amine\n(No reaction;\nno N-H bond)",
             facecolor="#FFCDD2", edgecolor="#C62828",
             fontsize=9, fontweight="bold", text_color="#B71C1C")
    arrow(3.3, 7.2, 2.2, 6.05, label="No", label_side="left")

    # Yes branch → Decision 2
    draw_diamond(7, 5.2, 3.6, 1.2, "Precipitate\nsoluble in NaOH?")
    arrow(6.7, 7.2, 7, 5.85, label="Yes", label_side="right")

    # Yes branch from decision 2 → 1° amine
    draw_box(3.5, 2.8, 3.4, 1.2,
             "1° Amine\n(R-NH-SO₂C₆H₅\nhas acidic N-H,\ndissolves in alkali)",
             facecolor="#C8E6C9", edgecolor="#2E7D32",
             fontsize=8.5, fontweight="bold", text_color="#1B5E20")
    arrow(5.8, 5.0, 4.2, 3.45, label="Yes", label_side="left")

    # No branch from decision 2 → 2° amine
    draw_box(8.5, 2.8, 2.8, 1.2,
             "2° Amine\n(R₂N-SO₂C₆H₅\nhas no N-H,\ninsoluble in alkali)",
             facecolor="#FFE0B2", edgecolor="#E65100",
             fontsize=8.5, fontweight="bold", text_color="#BF360C")
    arrow(8.2, 5.0, 8.5, 3.45, label="No", label_side="right")

    fig.tight_layout()
    out_path = os.path.join(OUTPUT_DIR, "cuet-chem-amines-mixed-20.png")
    fig.savefig(out_path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"Saved: {out_path}")


# ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    generate_diagram_19()
    generate_diagram_20()
    print("All diagrams generated successfully.")
