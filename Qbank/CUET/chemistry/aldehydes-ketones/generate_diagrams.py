#!/usr/bin/env python3
"""
Generate diagram PNGs for CUET Chemistry - Aldehydes, Ketones and Carboxylic Acids question bank.

Diagram 19: Nucleophilic addition mechanism (step-by-step)
Diagram 20: Comparison chart of distinction tests for carbonyl compounds
"""

import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyArrowPatch
import numpy as np

# Ensure output directory exists
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DIAGRAM_DIR = os.path.join(SCRIPT_DIR, "diagrams")
os.makedirs(DIAGRAM_DIR, exist_ok=True)

# Professional color palette
DARK_BLUE = "#2c3e50"
RED = "#e74c3c"
BLUE = "#3498db"
GREEN = "#2ecc71"
ORANGE = "#e67e22"
PURPLE = "#9b59b6"
LIGHT_GRAY = "#ecf0f1"
MEDIUM_GRAY = "#bdc3c7"
WHITE = "#ffffff"
DARK_GRAY = "#7f8c8d"


def generate_diagram_19():
    """
    Nucleophilic addition mechanism diagram.
    Shows step-by-step: nucleophile attack on carbonyl carbon,
    tetrahedral intermediate, and product formation.
    """
    fig, ax = plt.subplots(1, 1, figsize=(14, 7), dpi=150)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 7)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)

    # Title
    ax.text(7, 6.6, "Nucleophilic Addition to a Carbonyl Compound",
            fontsize=16, fontweight='bold', color=DARK_BLUE,
            ha='center', va='top',
            bbox=dict(boxstyle='round,pad=0.4', facecolor=LIGHT_GRAY, edgecolor=DARK_BLUE, linewidth=1.5))

    # ============ STEP 1: Reactant + Nucleophile ============
    # Box for Step 1
    step1_x = 2.0
    step1_y = 4.2

    ax.text(step1_x, 5.8, "Step 1: Nucleophilic Attack",
            fontsize=11, fontweight='bold', color=RED, ha='center')

    # Carbonyl group C=O
    ax.text(step1_x - 0.3, step1_y, r"R$_1$", fontsize=11, ha='center', va='center', color=DARK_BLUE)
    ax.plot([step1_x - 0.05, step1_x + 0.4], [step1_y + 0.05, step1_y + 0.35],
            color=DARK_BLUE, linewidth=2)
    ax.text(step1_x + 0.55, step1_y + 0.5, "C", fontsize=13, fontweight='bold',
            ha='center', va='center', color=DARK_BLUE)
    # delta+ on C
    ax.text(step1_x + 0.55, step1_y + 0.9, r"$\delta^+$", fontsize=10,
            ha='center', va='center', color=RED)

    # Double bond C=O
    ax.plot([step1_x + 0.8, step1_x + 1.4], [step1_y + 0.5, step1_y + 0.5],
            color=DARK_BLUE, linewidth=2)
    ax.plot([step1_x + 0.8, step1_x + 1.4], [step1_y + 0.35, step1_y + 0.35],
            color=DARK_BLUE, linewidth=2)
    ax.text(step1_x + 1.6, step1_y + 0.45, "O", fontsize=13, fontweight='bold',
            ha='center', va='center', color=RED)
    # delta- on O
    ax.text(step1_x + 1.6, step1_y + 0.85, r"$\delta^-$", fontsize=10,
            ha='center', va='center', color=BLUE)

    # R2 below C
    ax.plot([step1_x + 0.4, step1_x + 0.05], [step1_y + 0.35, step1_y - 0.35 + 0.5],
            color=DARK_BLUE, linewidth=2)
    ax.text(step1_x - 0.3, step1_y - 0.1, r"R$_2$", fontsize=11,
            ha='center', va='center', color=DARK_BLUE)

    # Nucleophile approaching
    ax.text(step1_x + 0.55, step1_y - 0.8, r"Nu$^-$", fontsize=13, fontweight='bold',
            ha='center', va='center', color=BLUE,
            bbox=dict(boxstyle='round,pad=0.2', facecolor='#d6eaf8', edgecolor=BLUE, linewidth=1))

    # Curved arrow from Nu to C
    arrow1 = FancyArrowPatch((step1_x + 0.55, step1_y - 0.5),
                              (step1_x + 0.55, step1_y + 0.2),
                              arrowstyle='->', mutation_scale=15,
                              color=BLUE, linewidth=2,
                              connectionstyle='arc3,rad=-0.3')
    ax.add_patch(arrow1)

    # ============ Arrow between Step 1 and Step 2 ============
    ax.annotate('', xy=(4.8, step1_y + 0.2), xytext=(3.8, step1_y + 0.2),
                arrowprops=dict(arrowstyle='->', color=DARK_GRAY, lw=2.5))

    # ============ STEP 2: Tetrahedral Intermediate ============
    step2_x = 6.5
    step2_y = 4.2

    ax.text(step2_x, 5.8, "Step 2: Tetrahedral Intermediate",
            fontsize=11, fontweight='bold', color=PURPLE, ha='center')

    # Central C (now sp3)
    ax.text(step2_x, step2_y + 0.3, "C", fontsize=13, fontweight='bold',
            ha='center', va='center', color=DARK_BLUE)

    # R1 upper-left
    ax.plot([step2_x - 0.2, step2_x - 0.7], [step2_y + 0.5, step2_y + 0.9],
            color=DARK_BLUE, linewidth=2)
    ax.text(step2_x - 0.9, step2_y + 1.0, r"R$_1$", fontsize=11,
            ha='center', va='center', color=DARK_BLUE)

    # R2 lower-left
    ax.plot([step2_x - 0.2, step2_x - 0.7], [step2_y + 0.1, step2_y - 0.3],
            color=DARK_BLUE, linewidth=2)
    ax.text(step2_x - 0.9, step2_y - 0.4, r"R$_2$", fontsize=11,
            ha='center', va='center', color=DARK_BLUE)

    # O⁻ upper-right (single bond now)
    ax.plot([step2_x + 0.2, step2_x + 0.7], [step2_y + 0.5, step2_y + 0.9],
            color=RED, linewidth=2)
    ax.text(step2_x + 0.95, step2_y + 1.0, r"O$^-$", fontsize=13, fontweight='bold',
            ha='center', va='center', color=RED)

    # Nu lower-right
    ax.plot([step2_x + 0.2, step2_x + 0.7], [step2_y + 0.1, step2_y - 0.3],
            color=BLUE, linewidth=2)
    ax.text(step2_x + 0.9, step2_y - 0.4, "Nu", fontsize=12, fontweight='bold',
            ha='center', va='center', color=BLUE)

    # Label: sp3 hybridized
    ax.text(step2_x, step2_y - 1.0, r"(sp$^3$ hybridized C)",
            fontsize=9, ha='center', va='center', color=DARK_GRAY, style='italic')

    # Electron shift annotation
    ax.text(step2_x, step2_y + 1.6, r"$\pi$ electrons shift to O",
            fontsize=9, ha='center', va='center', color=PURPLE, style='italic')

    # ============ Arrow between Step 2 and Step 3 ============
    ax.annotate('', xy=(9.2, step2_y + 0.2), xytext=(8.2, step2_y + 0.2),
                arrowprops=dict(arrowstyle='->', color=DARK_GRAY, lw=2.5))
    ax.text(8.7, step2_y + 0.6, r"H$^+$", fontsize=11, fontweight='bold',
            ha='center', va='center', color=GREEN)
    ax.text(8.7, step2_y - 0.2, "(protonation)", fontsize=8,
            ha='center', va='center', color=DARK_GRAY)

    # ============ STEP 3: Final Product ============
    step3_x = 11.0
    step3_y = 4.2

    ax.text(step3_x, 5.8, "Step 3: Product Formation",
            fontsize=11, fontweight='bold', color=GREEN, ha='center')

    # Central C
    ax.text(step3_x, step3_y + 0.3, "C", fontsize=13, fontweight='bold',
            ha='center', va='center', color=DARK_BLUE)

    # R1 upper-left
    ax.plot([step3_x - 0.2, step3_x - 0.7], [step3_y + 0.5, step3_y + 0.9],
            color=DARK_BLUE, linewidth=2)
    ax.text(step3_x - 0.9, step3_y + 1.0, r"R$_1$", fontsize=11,
            ha='center', va='center', color=DARK_BLUE)

    # R2 lower-left
    ax.plot([step3_x - 0.2, step3_x - 0.7], [step3_y + 0.1, step3_y - 0.3],
            color=DARK_BLUE, linewidth=2)
    ax.text(step3_x - 0.9, step3_y - 0.4, r"R$_2$", fontsize=11,
            ha='center', va='center', color=DARK_BLUE)

    # OH upper-right
    ax.plot([step3_x + 0.2, step3_x + 0.7], [step3_y + 0.5, step3_y + 0.9],
            color=RED, linewidth=2)
    ax.text(step3_x + 0.95, step3_y + 1.0, "OH", fontsize=13, fontweight='bold',
            ha='center', va='center', color=GREEN)

    # Nu lower-right
    ax.plot([step3_x + 0.2, step3_x + 0.7], [step3_y + 0.1, step3_y - 0.3],
            color=BLUE, linewidth=2)
    ax.text(step3_x + 0.9, step3_y - 0.4, "Nu", fontsize=12, fontweight='bold',
            ha='center', va='center', color=BLUE)

    # Product box
    ax.add_patch(mpatches.FancyBboxPatch(
        (step3_x - 1.3, step3_y - 1.2), 2.6, 3.0,
        boxstyle="round,pad=0.1", facecolor='none',
        edgecolor=GREEN, linewidth=1.5, linestyle='--'))

    ax.text(step3_x, step3_y - 1.0, "Addition Product",
            fontsize=10, ha='center', va='center', color=GREEN, fontweight='bold')

    # ============ Summary Box at bottom ============
    summary_y = 1.2
    ax.add_patch(mpatches.FancyBboxPatch(
        (1.0, 0.3), 12, 1.6,
        boxstyle="round,pad=0.3", facecolor=LIGHT_GRAY,
        edgecolor=DARK_BLUE, linewidth=1.5))

    ax.text(7, 1.55, "Key Points:", fontsize=11, fontweight='bold',
            color=DARK_BLUE, ha='center', va='center')
    ax.text(7, 1.1,
            r"1. Nu$^-$ attacks electrophilic C ($\delta^+$)  |  "
            r"2. C=O $\pi$ bond breaks, electrons shift to O  |  "
            r"3. sp$^2$ $\rightarrow$ sp$^3$ at carbon center",
            fontsize=9, color=DARK_BLUE, ha='center', va='center')
    ax.text(7, 0.7,
            "Aldehydes are more reactive than ketones (less steric hindrance, less +I effect)",
            fontsize=9, color=RED, ha='center', va='center', style='italic')

    plt.tight_layout()
    output_path = os.path.join(DIAGRAM_DIR, "cuet-chem-aldehydes-mixed-19.png")
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor=WHITE)
    plt.close()
    print(f"Generated: {output_path}")


def generate_diagram_20():
    """
    Comparison chart showing distinction tests and which functional groups
    give positive/negative results.
    """
    fig, ax = plt.subplots(1, 1, figsize=(12, 7), dpi=150)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)

    # Title
    ax.text(0.5, 0.95, "Distinction Tests for Carbonyl Compounds & Carboxylic Acids",
            fontsize=15, fontweight='bold', color=DARK_BLUE,
            ha='center', va='top', transform=ax.transAxes,
            bbox=dict(boxstyle='round,pad=0.4', facecolor=LIGHT_GRAY,
                      edgecolor=DARK_BLUE, linewidth=1.5))

    # Table data
    col_headers = [
        "Test / Reagent",
        "Aliphatic\nAldehyde\n(CH₃CHO)",
        "Aromatic\nAldehyde\n(C₆H₅CHO)",
        "Methyl\nKetone\n(CH₃COCH₃)",
        "Carboxylic\nAcid\n(CH₃COOH)"
    ]

    row_data = [
        ["Tollens' Test\n(Ammoniacal AgNO₃)", "+", "+", "−", "−"],
        ["Fehling's Test\n(Cu²⁺ tartrate, alk.)", "+", "−", "−", "−"],
        ["Iodoform Test\n(I₂ / NaOH)", "+", "−", "+", "−"],
        ["2,4-DNP Test\n(Brady's reagent)", "+", "+", "+", "−"],
        ["NaHCO₃ Test\n(Effervescence)", "−", "−", "−", "+"],
    ]

    observations = [
        "Silver mirror",
        "Red ppt. (Cu₂O)",
        "Yellow ppt. (CHI₃)",
        "Orange/yellow ppt.",
        "Brisk CO₂ gas"
    ]

    n_rows = len(row_data)
    n_cols = len(col_headers)

    # Table dimensions
    table_left = 0.02
    table_right = 0.82
    table_top = 0.82
    table_bottom = 0.12
    obs_col_left = 0.82
    obs_col_right = 0.98

    row_height = (table_top - table_bottom) / (n_rows + 1)
    col_width = (table_right - table_left) / n_cols

    # Draw header row
    for j, header in enumerate(col_headers):
        x = table_left + j * col_width
        rect = mpatches.FancyBboxPatch(
            (x, table_top - row_height), col_width, row_height,
            boxstyle="square,pad=0", facecolor=DARK_BLUE,
            edgecolor=WHITE, linewidth=1.5, transform=ax.transAxes)
        ax.add_patch(rect)
        ax.text(x + col_width / 2, table_top - row_height / 2,
                header, fontsize=8.5, fontweight='bold', color=WHITE,
                ha='center', va='center', transform=ax.transAxes)

    # Observation header
    rect = mpatches.FancyBboxPatch(
        (obs_col_left, table_top - row_height), obs_col_right - obs_col_left, row_height,
        boxstyle="square,pad=0", facecolor=PURPLE,
        edgecolor=WHITE, linewidth=1.5, transform=ax.transAxes)
    ax.add_patch(rect)
    ax.text((obs_col_left + obs_col_right) / 2, table_top - row_height / 2,
            "Positive\nObservation", fontsize=8.5, fontweight='bold', color=WHITE,
            ha='center', va='center', transform=ax.transAxes)

    # Draw data rows
    for i, row in enumerate(row_data):
        y = table_top - (i + 2) * row_height
        row_bg = LIGHT_GRAY if i % 2 == 0 else WHITE

        for j, cell in enumerate(row):
            x = table_left + j * col_width

            if j == 0:
                # Test name column
                cell_bg = '#d5e8f0'
                rect = mpatches.FancyBboxPatch(
                    (x, y), col_width, row_height,
                    boxstyle="square,pad=0", facecolor=cell_bg,
                    edgecolor=MEDIUM_GRAY, linewidth=0.8, transform=ax.transAxes)
                ax.add_patch(rect)
                ax.text(x + col_width / 2, y + row_height / 2,
                        cell, fontsize=8, fontweight='bold', color=DARK_BLUE,
                        ha='center', va='center', transform=ax.transAxes)
            else:
                # Result cells
                if cell == "+":
                    cell_bg = '#d5f5e3'  # light green
                    cell_color = GREEN
                    display_text = "✓  (+)"
                else:
                    cell_bg = '#fadbd8'  # light red
                    cell_color = RED
                    display_text = "✗  (−)"

                rect = mpatches.FancyBboxPatch(
                    (x, y), col_width, row_height,
                    boxstyle="square,pad=0", facecolor=cell_bg,
                    edgecolor=MEDIUM_GRAY, linewidth=0.8, transform=ax.transAxes)
                ax.add_patch(rect)
                ax.text(x + col_width / 2, y + row_height / 2,
                        display_text, fontsize=10, fontweight='bold',
                        color=cell_color,
                        ha='center', va='center', transform=ax.transAxes)

        # Observation column
        obs_bg = '#e8daef' if i % 2 == 0 else '#f4ecf7'
        rect = mpatches.FancyBboxPatch(
            (obs_col_left, y), obs_col_right - obs_col_left, row_height,
            boxstyle="square,pad=0", facecolor=obs_bg,
            edgecolor=MEDIUM_GRAY, linewidth=0.8, transform=ax.transAxes)
        ax.add_patch(rect)
        ax.text((obs_col_left + obs_col_right) / 2, y + row_height / 2,
                observations[i], fontsize=7.5, color=PURPLE, fontweight='bold',
                ha='center', va='center', transform=ax.transAxes, style='italic')

    # Legend / notes at bottom
    ax.text(0.5, 0.06,
            "Key: ✓ (+) = Positive result  |  ✗ (−) = Negative result  |  "
            "Note: Acetaldehyde (CH₃CHO) gives positive iodoform test due to CH₃CO− group",
            fontsize=8, color=DARK_GRAY, ha='center', va='center',
            transform=ax.transAxes, style='italic')

    ax.text(0.5, 0.02,
            "Benzaldehyde gives (+) Tollens' but (−) Fehling's — a key distinction from aliphatic aldehydes",
            fontsize=8, color=RED, ha='center', va='center',
            transform=ax.transAxes, fontweight='bold')

    plt.tight_layout()
    output_path = os.path.join(DIAGRAM_DIR, "cuet-chem-aldehydes-mixed-20.png")
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor=WHITE)
    plt.close()
    print(f"Generated: {output_path}")


if __name__ == "__main__":
    print("Generating diagrams for Aldehydes, Ketones and Carboxylic Acids...")
    generate_diagram_19()
    generate_diagram_20()
    print("All diagrams generated successfully!")
