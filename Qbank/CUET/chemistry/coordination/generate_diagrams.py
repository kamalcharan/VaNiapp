"""
Generate diagrams for coordination compounds question bank.
Produces two PNG files in the diagrams/ subdirectory:
  - cuet-chem-coord-mixed-19.png: Crystal field splitting (octahedral, d6 low-spin)
  - cuet-chem-coord-mixed-20.png: Geometric isomerism in square planar [MA2B2]
"""

import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyArrowPatch

# ── Colour palette ──────────────────────────────────────────────────────────
DARK = "#2c3e50"
RED = "#e74c3c"
BLUE = "#3498db"
GREEN = "#2ecc71"
ORANGE = "#e67e22"
PURPLE = "#9b59b6"
LIGHT_BG = "#f8f9fa"

# ── Output directory ────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DIAGRAM_DIR = os.path.join(SCRIPT_DIR, "diagrams")
os.makedirs(DIAGRAM_DIR, exist_ok=True)


# ═══════════════════════════════════════════════════════════════════════════
# Diagram 19 – Crystal field splitting for octahedral d6 low-spin
# ═══════════════════════════════════════════════════════════════════════════
def draw_cfs_diagram():
    fig, ax = plt.subplots(figsize=(7, 5.5))
    fig.patch.set_facecolor(LIGHT_BG)
    ax.set_facecolor(LIGHT_BG)

    # Energy parameters
    bary_y = 3.0          # barycentre
    delta = 2.0           # Δo visual size
    t2g_y = bary_y - 0.4 * delta   # 2.2
    eg_y = bary_y + 0.6 * delta    # 4.2
    free_y = bary_y                 # unsplit level

    # ── Free-ion level (left) ───────────────────────────────────────────
    ax.plot([0.5, 1.5], [free_y, free_y], color=DARK, lw=2.5)
    ax.text(1.0, free_y + 0.15, "Free-ion\nd orbitals", ha="center", va="bottom",
            fontsize=8, color=DARK, fontweight="bold")

    # ── Splitting arrows from free-ion to t2g / eg ─────────────────────
    ax.annotate("", xy=(2.8, t2g_y), xytext=(1.5, free_y),
                arrowprops=dict(arrowstyle="->", color=BLUE, lw=1.5, ls="--"))
    ax.annotate("", xy=(2.8, eg_y), xytext=(1.5, free_y),
                arrowprops=dict(arrowstyle="->", color=RED, lw=1.5, ls="--"))

    # ── t2g level (3 orbitals) ──────────────────────────────────────────
    t2g_xs = [3.0, 4.0, 5.0]
    for x in t2g_xs:
        ax.plot([x - 0.35, x + 0.35], [t2g_y, t2g_y], color=BLUE, lw=2.5)

    # ── eg level (2 orbitals) ───────────────────────────────────────────
    eg_xs = [3.5, 4.5]
    for x in eg_xs:
        ax.plot([x - 0.35, x + 0.35], [eg_y, eg_y], color=RED, lw=2.5)

    # ── Barycentre dashed line ──────────────────────────────────────────
    ax.plot([2.5, 5.5], [bary_y, bary_y], color=DARK, lw=1, ls=":")
    ax.text(5.6, bary_y, "barycentre", ha="left", va="center",
            fontsize=7, color=DARK, style="italic")

    # ── Δo double-headed arrow ──────────────────────────────────────────
    arrow_x = 6.0
    ax.annotate("", xy=(arrow_x, eg_y), xytext=(arrow_x, t2g_y),
                arrowprops=dict(arrowstyle="<->", color=DARK, lw=2))
    ax.text(arrow_x + 0.15, bary_y, r"$\Delta_o$", ha="left", va="center",
            fontsize=16, fontweight="bold", color=DARK)

    # ── Energy labels from barycentre ───────────────────────────────────
    ax.text(5.55, (bary_y + t2g_y) / 2, r"$-0.4\Delta_o$", ha="left",
            va="center", fontsize=8, color=BLUE, fontweight="bold")
    ax.text(5.55, (bary_y + eg_y) / 2, r"$+0.6\Delta_o$", ha="left",
            va="center", fontsize=8, color=RED, fontweight="bold")

    # ── Fill electrons (d6 low-spin: t2g^6, eg^0) ──────────────────────
    arrow_len = 0.28
    arrow_gap = 0.10
    for x in t2g_xs:
        # spin-up arrow
        ax.annotate("", xy=(x - arrow_gap, t2g_y + arrow_len),
                    xytext=(x - arrow_gap, t2g_y + 0.02),
                    arrowprops=dict(arrowstyle="-|>", color=GREEN, lw=1.8))
        # spin-down arrow
        ax.annotate("", xy=(x + arrow_gap, t2g_y + 0.02),
                    xytext=(x + arrow_gap, t2g_y + arrow_len),
                    arrowprops=dict(arrowstyle="-|>", color=PURPLE, lw=1.8))

    # ── Orbital labels ──────────────────────────────────────────────────
    ax.text(4.0, t2g_y - 0.3, r"$t_{2g}$  ($d_{xy},\ d_{xz},\ d_{yz}$)",
            ha="center", va="top", fontsize=9, color=BLUE, fontweight="bold")
    ax.text(4.0, eg_y + 0.15, r"$e_g$  ($d_{x^2-y^2},\ d_{z^2}$)",
            ha="center", va="bottom", fontsize=9, color=RED, fontweight="bold")

    # ── Configuration annotation ────────────────────────────────────────
    ax.text(4.0, 1.0,
            r"$d^6$ low-spin:  $t_{2g}^{\ 6}\ e_g^{\ 0}$"
            "\nDiamagnetic (0 unpaired electrons)"
            "\nCFSE = $-2.4\\Delta_o + 2P$",
            ha="center", va="center", fontsize=9, color=DARK,
            bbox=dict(boxstyle="round,pad=0.4", facecolor="white",
                      edgecolor=DARK, alpha=0.9))

    # ── Title ───────────────────────────────────────────────────────────
    ax.set_title("Crystal Field Splitting — Octahedral Complex (d⁶ Low-Spin)",
                 fontsize=12, fontweight="bold", color=DARK, pad=12)

    # ── Axes cosmetics ──────────────────────────────────────────────────
    ax.set_xlim(0, 7)
    ax.set_ylim(0.3, 5.2)
    ax.set_ylabel("Energy  →", fontsize=10, color=DARK, fontweight="bold")
    ax.set_xticks([])
    ax.set_yticks([])
    for spine in ax.spines.values():
        spine.set_visible(False)
    ax.spines["left"].set_visible(True)
    ax.spines["left"].set_color(DARK)

    out_path = os.path.join(DIAGRAM_DIR, "cuet-chem-coord-mixed-19.png")
    fig.savefig(out_path, dpi=150, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    print(f"Saved: {out_path}")


# ═══════════════════════════════════════════════════════════════════════════
# Diagram 20 – Geometric isomerism in square planar [MA₂B₂]
# ═══════════════════════════════════════════════════════════════════════════
def draw_geometric_isomerism():
    fig, axes = plt.subplots(1, 2, figsize=(10, 5))
    fig.patch.set_facecolor(LIGHT_BG)

    bond_len = 1.4  # distance from metal to ligand position

    def draw_square_planar(ax, title, positions, subtitle=""):
        """
        positions: dict mapping direction ('top','bottom','left','right')
                   to ligand label ('A' or 'B')
        """
        ax.set_facecolor(LIGHT_BG)
        cx, cy = 0, 0  # metal centre

        # Coordinates for each position
        coords = {
            "top": (0, bond_len),
            "bottom": (0, -bond_len),
            "left": (-bond_len, 0),
            "right": (bond_len, 0),
        }

        colour_map = {"A": BLUE, "B": RED}
        label_map = {"A": "A", "B": "B"}

        # Draw bonds
        for pos, (lx, ly) in coords.items():
            ax.plot([cx, lx], [cy, ly], color=DARK, lw=2, zorder=1)

        # Draw ligand circles
        for pos, (lx, ly) in coords.items():
            lig = positions[pos]
            col = colour_map[lig]
            circle = plt.Circle((lx, ly), 0.25, color=col, ec=DARK, lw=1.5, zorder=3)
            ax.add_patch(circle)
            ax.text(lx, ly, label_map[lig], ha="center", va="center",
                    fontsize=14, fontweight="bold", color="white", zorder=4)

        # Draw metal centre
        metal_circle = plt.Circle((cx, cy), 0.3, color=ORANGE, ec=DARK, lw=2, zorder=3)
        ax.add_patch(metal_circle)
        ax.text(cx, cy, "M", ha="center", va="center",
                fontsize=14, fontweight="bold", color="white", zorder=4)

        # 90° angle arc for adjacent ligands — show between top and right
        angle_arc = mpatches.Arc((0, 0), 0.8, 0.8, angle=0,
                                 theta1=0, theta2=90, color=DARK, lw=1, ls="--")
        ax.add_patch(angle_arc)
        ax.text(0.35, 0.35, "90°", ha="center", va="center", fontsize=8, color=DARK)

        # Title
        ax.set_title(title, fontsize=12, fontweight="bold", color=DARK, pad=10)

        # Subtitle (dipole info)
        if subtitle:
            ax.text(0, -2.1, subtitle, ha="center", va="center", fontsize=9,
                    color=DARK, style="italic",
                    bbox=dict(boxstyle="round,pad=0.3", facecolor="white",
                              edgecolor=DARK, alpha=0.85))

        ax.set_xlim(-2.2, 2.2)
        ax.set_ylim(-2.5, 2.2)
        ax.set_aspect("equal")
        ax.set_xticks([])
        ax.set_yticks([])
        for spine in ax.spines.values():
            spine.set_visible(False)

    # ── cis isomer: A top & left, B right & bottom ──────────────────────
    draw_square_planar(axes[0], "cis-[MA₂B₂]",
                       {"top": "A", "left": "A", "right": "B", "bottom": "B"},
                       subtitle="Net dipole moment ≠ 0")

    # ── trans isomer: A top & bottom, B left & right ────────────────────
    draw_square_planar(axes[1], "trans-[MA₂B₂]",
                       {"top": "A", "bottom": "A", "left": "B", "right": "B"},
                       subtitle="Net dipole moment = 0")

    # ── Legend ───────────────────────────────────────────────────────────
    legend_elements = [
        mpatches.Patch(facecolor=BLUE, edgecolor=DARK, label="Ligand A"),
        mpatches.Patch(facecolor=RED, edgecolor=DARK, label="Ligand B"),
        mpatches.Patch(facecolor=ORANGE, edgecolor=DARK, label="Metal M"),
    ]
    fig.legend(handles=legend_elements, loc="lower center", ncol=3,
               fontsize=9, frameon=True, edgecolor=DARK, facecolor="white")

    fig.suptitle("Geometric Isomerism in Square Planar [MA₂B₂] Complex",
                 fontsize=13, fontweight="bold", color=DARK, y=0.98)
    fig.subplots_adjust(bottom=0.14, top=0.88, wspace=0.3)

    out_path = os.path.join(DIAGRAM_DIR, "cuet-chem-coord-mixed-20.png")
    fig.savefig(out_path, dpi=150, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    print(f"Saved: {out_path}")


# ═══════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    draw_cfs_diagram()
    draw_geometric_isomerism()
    print("All diagrams generated successfully.")
