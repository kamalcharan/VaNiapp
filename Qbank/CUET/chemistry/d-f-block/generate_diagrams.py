#!/usr/bin/env python3
"""
Generate diagrams for CUET Chemistry d-and f-Block Elements question bank.

Produces two PNG files in the diagrams/ subdirectory:
  - cuet-chem-dfblock-mixed-19.png : Bar chart of oxidation states across 3d series
  - cuet-chem-dfblock-mixed-20.png : Atomic and ionic radii trend across 3d series
"""

import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

# Ensure output directory exists
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "diagrams")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Professional colour palette
DARK_BLUE = "#2c3e50"
RED = "#e74c3c"
BLUE = "#3498db"
GREEN = "#2ecc71"
ORANGE = "#e67e22"
PURPLE = "#9b59b6"
TEAL = "#1abc9c"
GREY = "#95a5a6"
LIGHT_BG = "#f8f9fa"

# ──────────────────────────────────────────────────────────────────────
# Diagram 1 – Oxidation states bar chart (Q19)
# ──────────────────────────────────────────────────────────────────────

elements = ["Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn"]

# Common oxidation states for each element
oxidation_states = {
    "Sc": [3],
    "Ti": [2, 3, 4],
    "V":  [2, 3, 4, 5],
    "Cr": [2, 3, 6],
    "Mn": [2, 3, 4, 6, 7],
    "Fe": [2, 3],
    "Co": [2, 3],
    "Ni": [2],
    "Cu": [1, 2],
    "Zn": [2],
}

# Colour map for oxidation states
os_colours = {
    1: TEAL,
    2: BLUE,
    3: GREEN,
    4: ORANGE,
    5: PURPLE,
    6: RED,
    7: DARK_BLUE,
}

fig1, ax1 = plt.subplots(figsize=(12, 6.5))
fig1.patch.set_facecolor("white")
ax1.set_facecolor(LIGHT_BG)

bar_width = 0.09
x_positions = np.arange(len(elements))

for idx, elem in enumerate(elements):
    states = oxidation_states[elem]
    n = len(states)
    # Centre the group of bars on the element position
    offsets = np.linspace(-bar_width * (n - 1) / 2, bar_width * (n - 1) / 2, n)
    for j, os_val in enumerate(states):
        colour = os_colours.get(os_val, GREY)
        bar = ax1.bar(
            x_positions[idx] + offsets[j],
            os_val,
            width=bar_width,
            color=colour,
            edgecolor="white",
            linewidth=0.6,
            zorder=3,
        )
        # Label the oxidation state on top of each bar
        ax1.text(
            x_positions[idx] + offsets[j],
            os_val + 0.15,
            f"+{os_val}",
            ha="center",
            va="bottom",
            fontsize=7,
            fontweight="bold",
            color=DARK_BLUE,
        )

# Highlight Mn with a subtle background rectangle
mn_idx = elements.index("Mn")
ax1.axvspan(mn_idx - 0.45, mn_idx + 0.45, color=RED, alpha=0.07, zorder=1)
ax1.annotate(
    "Maximum\noxidation states",
    xy=(mn_idx, 7.15),
    xytext=(mn_idx + 1.8, 7.5),
    fontsize=9,
    fontweight="bold",
    color=RED,
    ha="center",
    arrowprops=dict(arrowstyle="->", color=RED, lw=1.5),
)

ax1.set_xticks(x_positions)
ax1.set_xticklabels(elements, fontsize=11, fontweight="bold", color=DARK_BLUE)
ax1.set_ylabel("Oxidation State", fontsize=12, fontweight="bold", color=DARK_BLUE)
ax1.set_xlabel("3d Transition Element", fontsize=12, fontweight="bold", color=DARK_BLUE)
ax1.set_title(
    "Common Oxidation States Across the 3d Transition Series (Sc → Zn)",
    fontsize=13,
    fontweight="bold",
    color=DARK_BLUE,
    pad=15,
)
ax1.set_ylim(0, 8.5)
ax1.set_yticks(range(0, 9))
ax1.yaxis.grid(True, linestyle="--", alpha=0.4, zorder=0)
ax1.set_axisbelow(True)

# Legend
legend_patches = [
    mpatches.Patch(color=os_colours[k], label=f"+{k}")
    for k in sorted(os_colours.keys())
]
ax1.legend(
    handles=legend_patches,
    title="Oxidation State",
    fontsize=8,
    title_fontsize=9,
    loc="upper right",
    framealpha=0.9,
    edgecolor=GREY,
)

plt.tight_layout()
path1 = os.path.join(OUTPUT_DIR, "cuet-chem-dfblock-mixed-19.png")
fig1.savefig(path1, dpi=150, bbox_inches="tight", facecolor="white")
plt.close(fig1)
print(f"Saved: {path1}")


# ──────────────────────────────────────────────────────────────────────
# Diagram 2 – Atomic / ionic radii trend (Q20)
# ──────────────────────────────────────────────────────────────────────

# Atomic radii (pm) – approximate experimental values
atomic_radii = {
    "Sc": 164, "Ti": 147, "V": 135, "Cr": 129, "Mn": 137,
    "Fe": 126, "Co": 125, "Ni": 125, "Cu": 128, "Zn": 133,
}

# M²⁺ ionic radii (pm) – approximate crystal radii (6-coordinate)
ionic_radii = {
    "Sc": 75, "Ti": 86, "V": 79, "Cr": 80, "Mn": 83,
    "Fe": 78, "Co": 75, "Ni": 69, "Cu": 73, "Zn": 74,
}

ar_values = [atomic_radii[e] for e in elements]
ir_values = [ionic_radii[e] for e in elements]

fig2, ax2 = plt.subplots(figsize=(11, 6))
fig2.patch.set_facecolor("white")
ax2.set_facecolor(LIGHT_BG)

# Plot atomic radii
ax2.plot(
    x_positions, ar_values,
    marker="o", markersize=9, linewidth=2.5,
    color=BLUE, markerfacecolor=BLUE, markeredgecolor="white",
    markeredgewidth=1.5, label="Atomic Radii", zorder=4,
)
for i, (x, y) in enumerate(zip(x_positions, ar_values)):
    ax2.annotate(
        f"{y}",
        (x, y),
        textcoords="offset points",
        xytext=(0, 12),
        ha="center",
        fontsize=8,
        fontweight="bold",
        color=BLUE,
    )

# Plot ionic radii
ax2.plot(
    x_positions, ir_values,
    marker="s", markersize=8, linewidth=2.5,
    color=RED, markerfacecolor=RED, markeredgecolor="white",
    markeredgewidth=1.5, label="M²⁺ Ionic Radii", zorder=4,
)
for i, (x, y) in enumerate(zip(x_positions, ir_values)):
    ax2.annotate(
        f"{y}",
        (x, y),
        textcoords="offset points",
        xytext=(0, -15),
        ha="center",
        fontsize=8,
        fontweight="bold",
        color=RED,
    )

# Highlight Zn anomaly
zn_idx = elements.index("Zn")
ax2.annotate(
    "Zn: slight increase\n(3d¹⁰ repulsion)",
    xy=(zn_idx, atomic_radii["Zn"]),
    xytext=(zn_idx - 2.2, atomic_radii["Zn"] + 18),
    fontsize=9,
    fontweight="bold",
    color=DARK_BLUE,
    ha="center",
    arrowprops=dict(arrowstyle="->", color=DARK_BLUE, lw=1.5),
)

# Highlight Mn anomaly
mn_idx_r = elements.index("Mn")
ax2.annotate(
    "Mn: anomaly\n(half-filled 3d⁵)",
    xy=(mn_idx_r, atomic_radii["Mn"]),
    xytext=(mn_idx_r + 1.8, atomic_radii["Mn"] + 16),
    fontsize=9,
    fontweight="bold",
    color=DARK_BLUE,
    ha="center",
    arrowprops=dict(arrowstyle="->", color=DARK_BLUE, lw=1.5),
)

ax2.set_xticks(x_positions)
ax2.set_xticklabels(elements, fontsize=11, fontweight="bold", color=DARK_BLUE)
ax2.set_ylabel("Radius (pm)", fontsize=12, fontweight="bold", color=DARK_BLUE)
ax2.set_xlabel("3d Transition Element", fontsize=12, fontweight="bold", color=DARK_BLUE)
ax2.set_title(
    "Atomic and M²⁺ Ionic Radii Across the 3d Transition Series (Sc → Zn)",
    fontsize=13,
    fontweight="bold",
    color=DARK_BLUE,
    pad=15,
)
ax2.set_ylim(50, 190)
ax2.yaxis.grid(True, linestyle="--", alpha=0.4, zorder=0)
ax2.set_axisbelow(True)
ax2.legend(fontsize=10, loc="upper right", framealpha=0.9, edgecolor=GREY)

plt.tight_layout()
path2 = os.path.join(OUTPUT_DIR, "cuet-chem-dfblock-mixed-20.png")
fig2.savefig(path2, dpi=150, bbox_inches="tight", facecolor="white")
plt.close(fig2)
print(f"Saved: {path2}")

print("\nAll diagrams generated successfully.")
