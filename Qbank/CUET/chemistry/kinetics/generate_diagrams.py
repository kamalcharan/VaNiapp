#!/usr/bin/env python3
"""
Generate diagram PNGs for Chemical Kinetics question bank.

Produces two diagrams in the diagrams/ subdirectory:
  1. cuet-chem-kinetics-mixed-19.png  -- Energy profile with/without catalyst
  2. cuet-chem-kinetics-mixed-20.png  -- First-order ln[A] vs time plot
"""

import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

# ── colour palette ──────────────────────────────────────────────────────────
DARK   = "#2c3e50"
RED    = "#e74c3c"
BLUE   = "#3498db"
GREEN  = "#2ecc71"
ORANGE = "#e67e22"
GREY   = "#95a5a6"

# Ensure output directory exists
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(SCRIPT_DIR, "diagrams")
os.makedirs(OUT_DIR, exist_ok=True)


# ════════════════════════════════════════════════════════════════════════════
# DIAGRAM 1 – Energy profile (with & without catalyst)
# ════════════════════════════════════════════════════════════════════════════
def generate_energy_profile():
    fig, ax = plt.subplots(figsize=(8, 5.5))

    # Energy levels
    E_reactants = 60
    E_products  = 30
    Ea_no_cat   = 100          # peak without catalyst
    Ea_cat      = 70           # peak with catalyst

    # Smooth curves using Gaussian-like humps
    x = np.linspace(0, 10, 500)

    # Without catalyst curve
    hump1 = (Ea_no_cat - E_reactants) * np.exp(-0.5 * ((x - 4.5) / 1.2) ** 2)
    y_no_cat = np.where(
        x < 4.5,
        E_reactants + hump1,
        E_products + (Ea_no_cat - E_products) * np.exp(-0.5 * ((x - 4.5) / 1.2) ** 2),
    )
    # Smooth transition at edges
    y_no_cat[:20]  = E_reactants
    y_no_cat[-20:] = E_products

    # With catalyst curve (lower hump)
    hump2 = (Ea_cat - E_reactants) * np.exp(-0.5 * ((x - 4.5) / 1.1) ** 2)
    y_cat = np.where(
        x < 4.5,
        E_reactants + hump2,
        E_products + (Ea_cat - E_products) * np.exp(-0.5 * ((x - 4.5) / 1.1) ** 2),
    )
    y_cat[:20]  = E_reactants
    y_cat[-20:] = E_products

    # Plot curves
    ax.plot(x, y_no_cat, color=RED,  linewidth=2.5, label="Without catalyst")
    ax.plot(x, y_cat,    color=GREEN, linewidth=2.5, linestyle="--", label="With catalyst")

    # Horizontal dashed lines for reactant / product energy
    ax.axhline(y=E_reactants, xmin=0.02, xmax=0.30, color=DARK, linewidth=1, linestyle=":")
    ax.axhline(y=E_products,  xmin=0.70, xmax=0.98, color=DARK, linewidth=1, linestyle=":")

    # Annotations – Ea without catalyst
    ax.annotate(
        "", xy=(1.8, Ea_no_cat), xytext=(1.8, E_reactants),
        arrowprops=dict(arrowstyle="<->", color=RED, lw=1.5),
    )
    ax.text(0.5, (E_reactants + Ea_no_cat) / 2, r"$E_a$ (without cat.)",
            fontsize=10, color=RED, fontweight="bold", va="center")

    # Annotations – Ea with catalyst
    ax.annotate(
        "", xy=(7.2, Ea_cat), xytext=(7.2, E_reactants),
        arrowprops=dict(arrowstyle="<->", color=GREEN, lw=1.5),
    )
    ax.text(7.5, (E_reactants + Ea_cat) / 2, r"$E_a$ (with cat.)",
            fontsize=10, color=GREEN, fontweight="bold", va="center")

    # ΔH annotation
    ax.annotate(
        "", xy=(9.2, E_products), xytext=(9.2, E_reactants),
        arrowprops=dict(arrowstyle="<->", color=BLUE, lw=1.5),
    )
    ax.text(9.4, (E_reactants + E_products) / 2, r"$\Delta H$",
            fontsize=11, color=BLUE, fontweight="bold", va="center")

    # Label reactants, products, activated complex
    ax.text(0.3, E_reactants + 2, "Reactants", fontsize=11, color=DARK, fontweight="bold")
    ax.text(8.0, E_products + 2,  "Products",  fontsize=11, color=DARK, fontweight="bold")
    ax.text(4.5, Ea_no_cat + 3, "Activated\nComplex", fontsize=9, color=RED,
            ha="center", fontweight="bold")

    # Axes labels
    ax.set_xlabel("Reaction Coordinate (Progress of Reaction)", fontsize=12, color=DARK)
    ax.set_ylabel("Potential Energy", fontsize=12, color=DARK)
    ax.set_title("Energy Profile Diagram — Effect of Catalyst", fontsize=13,
                 color=DARK, fontweight="bold", pad=12)

    ax.legend(loc="upper right", fontsize=10, framealpha=0.9)
    ax.set_xlim(0, 10)
    ax.set_ylim(10, 120)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color(GREY)
    ax.spines["bottom"].set_color(GREY)

    path = os.path.join(OUT_DIR, "cuet-chem-kinetics-mixed-19.png")
    fig.savefig(path, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print(f"[OK] Saved {path}")


# ════════════════════════════════════════════════════════════════════════════
# DIAGRAM 2 – First-order kinetics: ln[A] vs time
# ════════════════════════════════════════════════════════════════════════════
def generate_ln_concentration_plot():
    fig, ax = plt.subplots(figsize=(7, 5))

    # Simulated data
    k = 0.05          # rate constant (s⁻¹)
    A0 = 1.0          # initial concentration (mol/L)
    t = np.linspace(0, 60, 300)
    lnA = np.log(A0) - k * t          # ln[A] = ln[A]₀ − kt

    ax.plot(t, lnA, color=BLUE, linewidth=2.5)

    # Mark y-intercept
    ax.plot(0, np.log(A0), "o", color=RED, markersize=8, zorder=5)
    ax.annotate(
        r"$\ln[A]_0$",
        xy=(0, np.log(A0)), xytext=(5, np.log(A0) + 0.3),
        fontsize=12, color=RED, fontweight="bold",
        arrowprops=dict(arrowstyle="->", color=RED, lw=1.2),
    )

    # Slope annotation
    t_mid = 30
    lnA_mid = np.log(A0) - k * t_mid
    ax.annotate(
        r"Slope $= -k$",
        xy=(t_mid, lnA_mid), xytext=(t_mid + 8, lnA_mid + 0.6),
        fontsize=12, color=DARK, fontweight="bold",
        arrowprops=dict(arrowstyle="->", color=DARK, lw=1.2),
    )

    # Rise-run triangle to show slope visually
    t1, t2 = 15, 40
    lnA1 = np.log(A0) - k * t1
    lnA2 = np.log(A0) - k * t2
    ax.plot([t1, t2], [lnA1, lnA1], "--", color=GREY, linewidth=1)
    ax.plot([t2, t2], [lnA1, lnA2], "--", color=GREY, linewidth=1)
    ax.text((t1 + t2) / 2, lnA1 + 0.12, r"$\Delta t$", fontsize=10,
            ha="center", color=GREY)
    ax.text(t2 + 1.5, (lnA1 + lnA2) / 2, r"$\Delta(\ln[A])$", fontsize=10,
            va="center", color=GREY)

    # Axes
    ax.set_xlabel("Time (t) / s", fontsize=12, color=DARK)
    ax.set_ylabel("ln[A]", fontsize=12, color=DARK)
    ax.set_title("First-Order Kinetics — ln[A] vs Time", fontsize=13,
                 color=DARK, fontweight="bold", pad=12)

    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color(GREY)
    ax.spines["bottom"].set_color(GREY)
    ax.tick_params(colors=DARK)
    ax.grid(True, linestyle=":", alpha=0.4)

    path = os.path.join(OUT_DIR, "cuet-chem-kinetics-mixed-20.png")
    fig.savefig(path, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print(f"[OK] Saved {path}")


# ── main ────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    generate_energy_profile()
    generate_ln_concentration_plot()
    print("\nAll diagrams generated successfully.")
