"""Generate matplotlib diagrams for Chemistry Solutions chapter (CUET)."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


def diagram_vapour_pressure_deviation():
    """Vapour pressure vs mole fraction showing ideal, positive, and negative deviation."""
    fig, ax = plt.subplots(figsize=(9, 7))

    # Mole fraction of A from 0 to 1
    x_A = np.linspace(0, 1, 200)

    # Pure component vapour pressures
    P_A_pure = 120  # mmHg (pure A)
    P_B_pure = 60   # mmHg (pure B)

    # Ideal (Raoult's law): P_total = x_A * P°A + (1 - x_A) * P°B
    P_ideal = x_A * P_A_pure + (1 - x_A) * P_B_pure

    # Positive deviation: curve above the ideal line
    # Use a symmetric bulge peaking at x_A = 0.5
    deviation_pos = 30 * np.sin(np.pi * x_A)
    P_positive = P_ideal + deviation_pos

    # Negative deviation: curve below the ideal line
    deviation_neg = 25 * np.sin(np.pi * x_A)
    P_negative = P_ideal - deviation_neg

    # Plot ideal line (dashed)
    ax.plot(x_A, P_ideal, 'k--', linewidth=2, label="Ideal (Raoult's Law)", zorder=3)

    # Plot positive deviation (red)
    ax.plot(x_A, P_positive, color='#e74c3c', linewidth=2.5,
            label='Positive Deviation', zorder=3)

    # Plot negative deviation (blue)
    ax.plot(x_A, P_negative, color='#3498db', linewidth=2.5,
            label='Negative Deviation', zorder=3)

    # Mark P°A and P°B on y-axis
    ax.plot(1, P_A_pure, 'ko', markersize=7, zorder=4)
    ax.plot(0, P_B_pure, 'ko', markersize=7, zorder=4)

    ax.annotate('P°A = {} mmHg'.format(P_A_pure),
                xy=(1, P_A_pure), xytext=(0.78, P_A_pure + 10),
                fontsize=10, fontweight='bold', color='#2c3e50',
                arrowprops=dict(arrowstyle='->', color='#2c3e50', lw=1.2))

    ax.annotate('P°B = {} mmHg'.format(P_B_pure),
                xy=(0, P_B_pure), xytext=(0.12, P_B_pure - 15),
                fontsize=10, fontweight='bold', color='#2c3e50',
                arrowprops=dict(arrowstyle='->', color='#2c3e50', lw=1.2))

    # Annotate the deviation regions
    ax.annotate('A-B interactions\nWEAKER than\nA-A and B-B',
                xy=(0.5, P_positive[100]),
                xytext=(0.15, P_positive[100] + 15),
                fontsize=8, color='#e74c3c', fontweight='bold',
                ha='center',
                arrowprops=dict(arrowstyle='->', color='#e74c3c', lw=1))

    ax.annotate('A-B interactions\nSTRONGER than\nA-A and B-B',
                xy=(0.5, P_negative[100]),
                xytext=(0.85, P_negative[100] - 18),
                fontsize=8, color='#3498db', fontweight='bold',
                ha='center',
                arrowprops=dict(arrowstyle='->', color='#3498db', lw=1))

    # Labels and title
    ax.set_xlabel('Mole Fraction of A (x_A)', fontsize=12, fontweight='bold', color='#2c3e50')
    ax.set_ylabel('Total Vapour Pressure (mmHg)', fontsize=12, fontweight='bold', color='#2c3e50')
    ax.set_title('Vapour Pressure vs Composition:\nIdeal vs Non-Ideal Solutions',
                 fontsize=14, fontweight='bold', color='#2c3e50', pad=15)

    # Set axis limits
    ax.set_xlim(-0.02, 1.02)
    ax.set_ylim(20, 170)

    # Add secondary x-axis labels
    ax.text(0, -0.07, 'Pure B', transform=ax.transAxes,
            fontsize=9, ha='left', color='#7f8c8d', fontweight='bold')
    ax.text(1, -0.07, 'Pure A', transform=ax.transAxes,
            fontsize=9, ha='right', color='#7f8c8d', fontweight='bold')

    # Legend
    ax.legend(loc='upper left', fontsize=10, framealpha=0.9,
              edgecolor='#bdc3c7')

    # Grid
    ax.grid(True, alpha=0.3, linestyle=':')
    ax.set_axisbelow(True)

    # Note at bottom
    fig.text(0.5, 0.01,
             'All curves meet at endpoints: pure components obey Raoult\'s law exactly',
             ha='center', fontsize=9, fontstyle='italic', color='#7f8c8d')

    fig.tight_layout(rect=[0, 0.03, 1, 1])
    fig.savefig(os.path.join(OUT_DIR, 'cuet-chem-soln-mixed-19.png'),
                dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-chem-soln-mixed-19.png")


def diagram_osmotic_pressure_setup():
    """U-tube osmotic pressure setup with semipermeable membrane."""
    fig, ax = plt.subplots(figsize=(9, 8))
    ax.axis('off')

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.set_aspect('equal')

    # Title
    ax.text(0.5, 0.97, 'Osmotic Pressure: U-Tube Setup',
            fontsize=14, fontweight='bold', ha='center', va='top', color='#2c3e50')

    # U-tube dimensions
    left_x = 0.20   # left limb center x
    right_x = 0.70  # right limb center x
    limb_width = 0.12
    bottom_y = 0.18
    tube_bottom = 0.22
    left_level = 0.60   # solvent level (lower at equilibrium)
    right_level = 0.72  # solution level (higher at equilibrium)
    connector_y = bottom_y

    # Draw U-tube outline
    # Left limb (outer walls)
    ax.plot([left_x - limb_width/2, left_x - limb_width/2],
            [left_level + 0.03, tube_bottom], color='#2c3e50', linewidth=2.5)
    ax.plot([left_x + limb_width/2, left_x + limb_width/2],
            [left_level + 0.03, tube_bottom], color='#2c3e50', linewidth=2.5)

    # Right limb (outer walls)
    ax.plot([right_x - limb_width/2, right_x - limb_width/2],
            [right_level + 0.03, tube_bottom], color='#2c3e50', linewidth=2.5)
    ax.plot([right_x + limb_width/2, right_x + limb_width/2],
            [right_level + 0.03, tube_bottom], color='#2c3e50', linewidth=2.5)

    # Bottom connector
    ax.plot([left_x - limb_width/2, left_x - limb_width/2],
            [tube_bottom, connector_y], color='#2c3e50', linewidth=2.5)
    ax.plot([right_x + limb_width/2, right_x + limb_width/2],
            [tube_bottom, connector_y], color='#2c3e50', linewidth=2.5)
    ax.plot([left_x - limb_width/2, right_x + limb_width/2],
            [connector_y, connector_y], color='#2c3e50', linewidth=2.5)
    ax.plot([left_x - limb_width/2, right_x + limb_width/2],
            [tube_bottom, tube_bottom], color='#2c3e50', linewidth=2.5)

    # Fill left limb with light blue (pure solvent)
    left_fill_x = [left_x - limb_width/2 + 0.005, left_x + limb_width/2 - 0.005,
                   left_x + limb_width/2 - 0.005, left_x - limb_width/2 + 0.005]
    left_fill_y = [tube_bottom + 0.005, tube_bottom + 0.005,
                   left_level, left_level]
    ax.fill(left_fill_x, left_fill_y, color='#3498db', alpha=0.25)

    # Fill right limb with light orange (solution)
    right_fill_x = [right_x - limb_width/2 + 0.005, right_x + limb_width/2 - 0.005,
                    right_x + limb_width/2 - 0.005, right_x - limb_width/2 + 0.005]
    right_fill_y = [tube_bottom + 0.005, tube_bottom + 0.005,
                    right_level, right_level]
    ax.fill(right_fill_x, right_fill_y, color='#e67e22', alpha=0.25)

    # Fill bottom connector (mixed colour)
    bottom_fill_x = [left_x - limb_width/2 + 0.005, right_x + limb_width/2 - 0.005,
                     right_x + limb_width/2 - 0.005, left_x - limb_width/2 + 0.005]
    bottom_fill_y = [connector_y + 0.005, connector_y + 0.005,
                     tube_bottom - 0.005, tube_bottom - 0.005]
    ax.fill(bottom_fill_x, bottom_fill_y, color='#95a5a6', alpha=0.2)

    # Semipermeable membrane (vertical dashed line in the middle of connector)
    membrane_x = (left_x + right_x) / 2
    ax.plot([membrane_x, membrane_x], [connector_y - 0.005, tube_bottom + 0.005],
            color='#8e44ad', linewidth=3, linestyle='-')
    # Add dots/pores on membrane
    for y_pos in np.linspace(connector_y + 0.01, tube_bottom - 0.01, 4):
        ax.plot(membrane_x, y_pos, 'o', color='white', markersize=2.5)

    ax.text(membrane_x, connector_y - 0.04, 'Semipermeable\nMembrane',
            ha='center', va='top', fontsize=8, fontweight='bold', color='#8e44ad')

    # Labels for left and right limbs
    ax.text(left_x, left_level + 0.06, 'Pure Solvent\n(e.g., Water)',
            ha='center', va='bottom', fontsize=10, fontweight='bold', color='#2980b9')
    ax.text(right_x, right_level + 0.06, 'Solution\n(Solvent + Solute)',
            ha='center', va='bottom', fontsize=10, fontweight='bold', color='#d35400')

    # Draw liquid level lines
    ax.plot([left_x - limb_width/2 + 0.005, left_x + limb_width/2 - 0.005],
            [left_level, left_level], color='#2980b9', linewidth=2)
    ax.plot([right_x - limb_width/2 + 0.005, right_x + limb_width/2 - 0.005],
            [right_level, right_level], color='#d35400', linewidth=2)

    # Height difference arrow (h)
    h_x = right_x + limb_width/2 + 0.06
    ax.annotate('', xy=(h_x, right_level), xytext=(h_x, left_level),
                arrowprops=dict(arrowstyle='<->', lw=2, color='#e74c3c'))
    ax.text(h_x + 0.03, (left_level + right_level) / 2, 'h',
            fontsize=16, fontweight='bold', color='#e74c3c',
            ha='left', va='center')

    # Dashed line from left level to right side for reference
    ax.plot([left_x + limb_width/2, h_x + 0.01],
            [left_level, left_level], color='#7f8c8d', linewidth=1, linestyle=':')
    ax.plot([right_x + limb_width/2, h_x + 0.01],
            [right_level, right_level], color='#7f8c8d', linewidth=1, linestyle=':')

    # Arrow showing direction of solvent flow
    ax.annotate('', xy=(membrane_x - 0.02, (connector_y + tube_bottom) / 2),
                xytext=(membrane_x - 0.15, (connector_y + tube_bottom) / 2),
                arrowprops=dict(arrowstyle='->', lw=2.5, color='#2ecc71'))
    ax.text(membrane_x - 0.18, (connector_y + tube_bottom) / 2 + 0.03,
            'Solvent flow\n(Osmosis)',
            ha='center', va='bottom', fontsize=8, fontweight='bold', color='#27ae60')

    # Osmotic pressure formula box
    formula_text = 'Osmotic Pressure\nπ = hρg = CRT'
    bbox_props = dict(boxstyle='round,pad=0.5', facecolor='#e74c3c',
                      alpha=0.1, edgecolor='#e74c3c', linewidth=1.5)
    ax.text(0.5, 0.88, formula_text, ha='center', va='center',
            fontsize=11, fontweight='bold', color='#c0392b',
            bbox=bbox_props)

    # Key points box at bottom
    key_text = ('Key Points:\n'
                '• Solvent flows from lower to higher solute concentration\n'
                '• Membrane allows solvent but blocks solute\n'
                '• Applying pressure > π on solution side → Reverse Osmosis')
    bbox_key = dict(boxstyle='round,pad=0.4', facecolor='#f0f3f4',
                    edgecolor='#7f8c8d', linewidth=1)
    ax.text(0.5, 0.06, key_text, ha='center', va='center',
            fontsize=8, color='#2c3e50', bbox=bbox_key)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-chem-soln-mixed-20.png'),
                dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-chem-soln-mixed-20.png")


if __name__ == '__main__':
    diagram_vapour_pressure_deviation()
    diagram_osmotic_pressure_setup()
    print("All Solutions chapter diagrams generated.")
