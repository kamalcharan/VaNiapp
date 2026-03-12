"""
Generate diagrams for CUET Chemistry Biomolecules question bank.

Diagram 19: Protein structure levels (primary, secondary, tertiary, quaternary)
Diagram 20: DNA double helix schematic
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Arc
import numpy as np
import os

# Color palette
DARK_BLUE = '#2c3e50'
RED = '#e74c3c'
BLUE = '#3498db'
GREEN = '#2ecc71'
ORANGE = '#e67e22'
PURPLE = '#9b59b6'
YELLOW = '#f1c40f'
TEAL = '#1abc9c'
LIGHT_GRAY = '#ecf0f1'
DARK_GRAY = '#7f8c8d'
WHITE = '#ffffff'

# Output directory
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DIAGRAM_DIR = os.path.join(SCRIPT_DIR, 'diagrams')
os.makedirs(DIAGRAM_DIR, exist_ok=True)


def draw_protein_structure_levels():
    """
    Diagram 19: Four levels of protein structure.
    Primary (linear chain), Secondary (alpha-helix and beta-sheet),
    Tertiary (folded globule), Quaternary (multi-subunit).
    """
    fig, axes = plt.subplots(1, 4, figsize=(16, 5), facecolor=WHITE)
    fig.suptitle('Four Levels of Protein Structure', fontsize=16,
                 fontweight='bold', color=DARK_BLUE, y=0.98)

    for ax in axes:
        ax.set_xlim(0, 10)
        ax.set_ylim(0, 10)
        ax.set_aspect('equal')
        ax.axis('off')

    # ---- Level 1: Primary Structure ----
    ax1 = axes[0]
    ax1.set_title('Primary Structure', fontsize=12, fontweight='bold',
                  color=DARK_BLUE, pad=10)

    # Draw a chain of amino acid circles
    aa_colors = [RED, BLUE, GREEN, ORANGE, PURPLE, TEAL, YELLOW, RED, BLUE, GREEN]
    aa_labels = ['A', 'G', 'L', 'V', 'S', 'K', 'D', 'F', 'P', 'E']
    n_aa = len(aa_colors)
    x_start, y_center = 1.5, 5.5
    spacing = 0.72

    for i in range(n_aa):
        x = x_start + (i % 5) * spacing * 2
        y = y_center + 1.2 if i < 5 else y_center - 1.2
        circle = plt.Circle((x, y), 0.55, color=aa_colors[i], ec=DARK_BLUE,
                             linewidth=1.2, zorder=3)
        ax1.add_patch(circle)
        ax1.text(x, y, aa_labels[i], ha='center', va='center',
                 fontsize=7, fontweight='bold', color=WHITE, zorder=4)

        # Draw peptide bond lines between consecutive amino acids
        if i < n_aa - 1:
            if i < 4:
                x2 = x_start + ((i + 1) % 5) * spacing * 2
                y2 = y_center + 1.2
                ax1.plot([x + 0.55, x2 - 0.55], [y, y2], color=DARK_BLUE,
                         linewidth=2, zorder=2)
            elif i == 4:
                # Connect row 1 end to row 2 start
                x2 = x_start + (0) * spacing * 2
                y2 = y_center - 1.2
                # Draw a curve down
                ax1.annotate('', xy=(x_start + 4 * spacing * 2 + 0.3, y_center - 1.2),
                             xytext=(x_start + 4 * spacing * 2 + 0.3, y_center + 1.2),
                             arrowprops=dict(arrowstyle='-', color=DARK_BLUE,
                                             lw=2, connectionstyle='arc3,rad=-0.5'))
            else:
                x2 = x_start + ((i + 1) % 5) * spacing * 2
                y2 = y_center - 1.2
                ax1.plot([x + 0.55, x2 - 0.55], [y, y2], color=DARK_BLUE,
                         linewidth=2, zorder=2)

    ax1.text(5, 1.2, 'Linear amino acid\nsequence joined by\npeptide bonds',
             ha='center', va='center', fontsize=8, color=DARK_GRAY,
             style='italic')
    ax1.text(0.5, 8.5, 'N-terminus', fontsize=7, color=RED, fontweight='bold')
    ax1.text(6.5, 2.8, 'C-terminus', fontsize=7, color=RED, fontweight='bold')

    # ---- Level 2: Secondary Structure ----
    ax2 = axes[1]
    ax2.set_title('Secondary Structure', fontsize=12, fontweight='bold',
                  color=DARK_BLUE, pad=10)

    # Draw alpha-helix as a coiled ribbon
    t = np.linspace(0, 4 * np.pi, 200)
    helix_x = 3.5 + 1.5 * np.sin(t)
    helix_y = 9.0 - t / (4 * np.pi) * 4.5

    # Draw the helix ribbon with shading
    for i in range(len(t) - 1):
        alpha_val = 0.4 + 0.6 * (0.5 + 0.5 * np.sin(t[i]))
        ax2.plot([helix_x[i], helix_x[i + 1]], [helix_y[i], helix_y[i + 1]],
                 color=RED, linewidth=4, alpha=alpha_val, solid_capstyle='round')

    # H-bond dashes on the helix
    for k in range(4):
        y_hb = 8.2 - k * 1.1
        ax2.plot([3.0, 4.0], [y_hb, y_hb], 'k--', linewidth=0.8, alpha=0.6)

    ax2.text(3.5, 3.5, r'$\alpha$-helix', ha='center', fontsize=10,
             fontweight='bold', color=RED)

    # Draw beta-sheet as flat arrows
    for i, x_pos in enumerate([7.0, 8.2, 9.2]):
        direction = 1 if i % 2 == 0 else -1
        y_start = 5.0 + direction * 1.5
        y_end = 5.0 - direction * 1.5
        ax2.annotate('', xy=(x_pos, y_end), xytext=(x_pos, y_start),
                     arrowprops=dict(arrowstyle='->', color=BLUE, lw=3,
                                     mutation_scale=15))

    # H-bonds between beta strands
    for y_hb in [4.2, 5.0, 5.8]:
        ax2.plot([7.2, 8.0], [y_hb, y_hb], 'k--', linewidth=0.8, alpha=0.6)
        ax2.plot([8.4, 9.0], [y_hb, y_hb], 'k--', linewidth=0.8, alpha=0.6)

    ax2.text(8.2, 2.8, r'$\beta$-sheet', ha='center', fontsize=10,
             fontweight='bold', color=BLUE)

    ax2.text(5, 1.2, 'Stabilized by\nH-bonds between\nbackbone atoms',
             ha='center', va='center', fontsize=8, color=DARK_GRAY,
             style='italic')

    # Dashed line label
    ax2.plot([3.5, 4.5], [1.9, 1.9], 'k--', linewidth=1)
    ax2.text(5.2, 1.9, '= H-bond', fontsize=7, va='center', color=DARK_GRAY)

    # ---- Level 3: Tertiary Structure ----
    ax3 = axes[2]
    ax3.set_title('Tertiary Structure', fontsize=12, fontweight='bold',
                  color=DARK_BLUE, pad=10)

    # Draw a folded globular protein
    theta = np.linspace(0, 2 * np.pi, 100)

    # Irregular globular shape using superposition of harmonics
    r = 2.5 + 0.4 * np.sin(3 * theta) + 0.3 * np.cos(5 * theta) + 0.2 * np.sin(7 * theta)
    glob_x = 5 + r * np.cos(theta)
    glob_y = 5.5 + r * np.sin(theta)

    ax3.fill(glob_x, glob_y, color=TEAL, alpha=0.3, zorder=1)
    ax3.plot(glob_x, glob_y, color=TEAL, linewidth=2, zorder=2)

    # Draw internal features - helices and sheets inside the globule
    # Small helix inside
    t_small = np.linspace(0, 2 * np.pi, 60)
    hx = 4.0 + 0.5 * np.sin(t_small)
    hy = 6.5 - t_small / (2 * np.pi) * 1.5
    ax3.plot(hx, hy, color=RED, linewidth=3, alpha=0.7, zorder=3)

    # Small beta arrows inside
    ax3.annotate('', xy=(6.0, 4.5), xytext=(6.0, 6.2),
                 arrowprops=dict(arrowstyle='->', color=BLUE, lw=2.5,
                                 mutation_scale=12), zorder=3)
    ax3.annotate('', xy=(6.8, 6.2), xytext=(6.8, 4.5),
                 arrowprops=dict(arrowstyle='->', color=BLUE, lw=2.5,
                                 mutation_scale=12), zorder=3)

    # Labels for interactions
    # Disulfide bond
    ax3.plot([4.5, 5.5], [4.2, 4.2], color=YELLOW, linewidth=2.5, zorder=3)
    ax3.text(5.0, 3.7, 'S—S', ha='center', fontsize=7, fontweight='bold',
             color=ORANGE, zorder=4)

    # Ionic bond label
    ax3.text(3.8, 5.2, '+', fontsize=10, color=RED, fontweight='bold',
             ha='center', zorder=4)
    ax3.text(4.8, 5.2, '–', fontsize=14, color=BLUE, fontweight='bold',
             ha='center', zorder=4)
    ax3.plot([4.0, 4.6], [5.2, 5.2], 'k:', linewidth=1, zorder=3)

    ax3.text(5, 1.2, 'R-group interactions:\nhydrophobic, ionic,\nH-bonds, S–S bonds',
             ha='center', va='center', fontsize=8, color=DARK_GRAY,
             style='italic')

    # ---- Level 4: Quaternary Structure ----
    ax4 = axes[3]
    ax4.set_title('Quaternary Structure', fontsize=12, fontweight='bold',
                  color=DARK_BLUE, pad=10)

    # Draw multiple subunits as colored blobs
    subunit_params = [
        (3.5, 6.5, 1.8, RED, r'$\alpha_1$'),
        (6.5, 6.5, 1.8, BLUE, r'$\beta_1$'),
        (3.5, 4.0, 1.8, BLUE, r'$\beta_2$'),
        (6.5, 4.0, 1.8, RED, r'$\alpha_2$'),
    ]

    for cx, cy, size, color, label in subunit_params:
        # Irregular blob for each subunit
        theta_sub = np.linspace(0, 2 * np.pi, 80)
        r_sub = size + 0.15 * np.sin(4 * theta_sub) + 0.1 * np.cos(6 * theta_sub)
        bx = cx + r_sub * np.cos(theta_sub) * 0.55
        by = cy + r_sub * np.sin(theta_sub) * 0.45
        ax4.fill(bx, by, color=color, alpha=0.35, zorder=1)
        ax4.plot(bx, by, color=color, linewidth=1.5, alpha=0.8, zorder=2)
        ax4.text(cx, cy, label, ha='center', va='center', fontsize=11,
                 fontweight='bold', color=DARK_BLUE, zorder=3)

    # Draw interaction lines between subunits
    ax4.plot([4.5, 5.5], [6.5, 6.5], 'k:', linewidth=1.5, alpha=0.5)
    ax4.plot([4.5, 5.5], [4.0, 4.0], 'k:', linewidth=1.5, alpha=0.5)
    ax4.plot([3.5, 3.5], [5.5, 5.0], 'k:', linewidth=1.5, alpha=0.5)
    ax4.plot([6.5, 6.5], [5.5, 5.0], 'k:', linewidth=1.5, alpha=0.5)

    ax4.text(5, 1.2, 'Multiple polypeptide\nsubunits assembled\n(e.g., hemoglobin)',
             ha='center', va='center', fontsize=8, color=DARK_GRAY,
             style='italic')

    plt.tight_layout(rect=[0, 0, 1, 0.93])
    output_path = os.path.join(DIAGRAM_DIR, 'cuet-chem-biomolecules-mixed-19.png')
    fig.savefig(output_path, dpi=150, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print(f"Saved: {output_path}")


def draw_dna_double_helix():
    """
    Diagram 20: DNA double helix schematic showing sugar-phosphate backbone,
    base pairing (A-T with 2 H-bonds, G-C with 3 H-bonds), major/minor grooves,
    and antiparallel strands (5'→3' and 3'→5').
    """
    fig, ax = plt.subplots(1, 1, figsize=(10, 12), facecolor=WHITE)
    ax.set_xlim(-5, 5)
    ax.set_ylim(-1, 13)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('DNA Double Helix Structure', fontsize=16, fontweight='bold',
                 color=DARK_BLUE, pad=20)

    # Parameters for the ladder-like representation
    n_pairs = 10
    y_positions = np.linspace(1.0, 11.5, n_pairs)
    backbone_x_left = -3.0
    backbone_x_right = 3.0
    base_pair_sequence = ['A-T', 'G-C', 'T-A', 'C-G', 'A-T', 'G-C', 'G-C', 'T-A', 'A-T', 'C-G']

    # Draw sugar-phosphate backbones as thick colored lines
    # Left strand (5' → 3' top to bottom)
    for i in range(n_pairs - 1):
        ax.plot([backbone_x_left, backbone_x_left],
                [y_positions[i], y_positions[i + 1]],
                color=BLUE, linewidth=6, solid_capstyle='round', zorder=1)
    # Right strand (3' → 5' top to bottom, i.e., 5' → 3' bottom to top)
    for i in range(n_pairs - 1):
        ax.plot([backbone_x_right, backbone_x_right],
                [y_positions[i], y_positions[i + 1]],
                color=RED, linewidth=6, solid_capstyle='round', zorder=1)

    # Draw sugar (S) and phosphate (P) nodes on backbones
    for i, y in enumerate(y_positions):
        # Left strand: alternating P and S
        # Phosphate circles
        circle_left = plt.Circle((backbone_x_left, y), 0.28, color=ORANGE,
                                 ec=DARK_BLUE, linewidth=1, zorder=5)
        ax.add_patch(circle_left)
        ax.text(backbone_x_left, y, 'P', ha='center', va='center',
                fontsize=6, fontweight='bold', color=WHITE, zorder=6)

        # Right strand
        circle_right = plt.Circle((backbone_x_right, y), 0.28, color=ORANGE,
                                  ec=DARK_BLUE, linewidth=1, zorder=5)
        ax.add_patch(circle_right)
        ax.text(backbone_x_right, y, 'P', ha='center', va='center',
                fontsize=6, fontweight='bold', color=WHITE, zorder=6)

        # Sugar between P nodes (offset slightly)
        if i < n_pairs:
            sy = y - 0.15
            # Left sugar
            sugar_left = plt.Circle((backbone_x_left + 0.5, sy), 0.22,
                                    color=TEAL, ec=DARK_BLUE, linewidth=0.8, zorder=4)
            ax.add_patch(sugar_left)
            ax.text(backbone_x_left + 0.5, sy, 'S', ha='center', va='center',
                    fontsize=5, fontweight='bold', color=WHITE, zorder=6)

            # Right sugar
            sugar_right = plt.Circle((backbone_x_right - 0.5, sy), 0.22,
                                     color=TEAL, ec=DARK_BLUE, linewidth=0.8, zorder=4)
            ax.add_patch(sugar_right)
            ax.text(backbone_x_right - 0.5, sy, 'S', ha='center', va='center',
                    fontsize=5, fontweight='bold', color=WHITE, zorder=6)

    # Draw base pairs
    base_colors = {'A': GREEN, 'T': PURPLE, 'G': YELLOW, 'C': ORANGE}

    for i, (y, bp) in enumerate(zip(y_positions, base_pair_sequence)):
        left_base, right_base = bp.split('-')
        n_hbonds = 2 if bp in ['A-T', 'T-A'] else 3

        # Base rectangles
        left_x_start = backbone_x_left + 0.85
        right_x_end = backbone_x_right - 0.85
        mid_x = 0.0

        # Left base box
        left_box = FancyBboxPatch((left_x_start, y - 0.25), mid_x - left_x_start - 0.15, 0.5,
                                   boxstyle="round,pad=0.05",
                                   facecolor=base_colors[left_base], alpha=0.7,
                                   edgecolor=DARK_BLUE, linewidth=0.8, zorder=3)
        ax.add_patch(left_box)
        ax.text((left_x_start + mid_x - 0.15) / 2, y, left_base,
                ha='center', va='center', fontsize=10, fontweight='bold',
                color=DARK_BLUE, zorder=4)

        # Right base box
        right_box = FancyBboxPatch((mid_x + 0.15, y - 0.25),
                                    right_x_end - mid_x - 0.15, 0.5,
                                    boxstyle="round,pad=0.05",
                                    facecolor=base_colors[right_base], alpha=0.7,
                                    edgecolor=DARK_BLUE, linewidth=0.8, zorder=3)
        ax.add_patch(right_box)
        ax.text((mid_x + 0.15 + right_x_end) / 2, y, right_base,
                ha='center', va='center', fontsize=10, fontweight='bold',
                color=DARK_BLUE, zorder=4)

        # Hydrogen bonds (dashed lines between bases)
        if n_hbonds == 2:
            for offset in [-0.08, 0.08]:
                ax.plot([mid_x - 0.12, mid_x + 0.12], [y + offset, y + offset],
                        color=DARK_BLUE, linewidth=1.5, linestyle='--', zorder=3)
        else:  # 3 H-bonds
            for offset in [-0.12, 0.0, 0.12]:
                ax.plot([mid_x - 0.12, mid_x + 0.12], [y + offset, y + offset],
                        color=DARK_BLUE, linewidth=1.5, linestyle='--', zorder=3)

    # Strand direction labels
    ax.annotate("5'", xy=(backbone_x_left - 0.1, y_positions[-1] + 0.6),
                fontsize=14, fontweight='bold', color=BLUE, ha='center')
    ax.annotate("3'", xy=(backbone_x_left - 0.1, y_positions[0] - 0.6),
                fontsize=14, fontweight='bold', color=BLUE, ha='center')
    ax.annotate("3'", xy=(backbone_x_right + 0.1, y_positions[-1] + 0.6),
                fontsize=14, fontweight='bold', color=RED, ha='center')
    ax.annotate("5'", xy=(backbone_x_right + 0.1, y_positions[0] - 0.6),
                fontsize=14, fontweight='bold', color=RED, ha='center')

    # Direction arrows along backbones
    ax.annotate('', xy=(backbone_x_left - 0.6, y_positions[0] - 0.3),
                xytext=(backbone_x_left - 0.6, y_positions[-1] + 0.3),
                arrowprops=dict(arrowstyle='->', color=BLUE, lw=2))
    ax.annotate('', xy=(backbone_x_right + 0.6, y_positions[-1] + 0.3),
                xytext=(backbone_x_right + 0.6, y_positions[0] - 0.3),
                arrowprops=dict(arrowstyle='->', color=RED, lw=2))

    # Strand labels
    ax.text(backbone_x_left - 1.2, 6.2, "Strand 1\n(5'→3')", ha='center',
            fontsize=9, fontweight='bold', color=BLUE, rotation=90)
    ax.text(backbone_x_right + 1.2, 6.2, "Strand 2\n(5'→3')", ha='center',
            fontsize=9, fontweight='bold', color=RED, rotation=-90)

    # Major and minor groove labels
    # Major groove (wider gap) - annotate between certain base pairs
    y_major = (y_positions[2] + y_positions[3]) / 2
    ax.annotate('Major\nGroove', xy=(backbone_x_right + 0.3, y_major),
                xytext=(4.2, y_major),
                fontsize=9, fontweight='bold', color=DARK_GRAY, ha='center',
                va='center',
                arrowprops=dict(arrowstyle='->', color=DARK_GRAY, lw=1.2))

    # Minor groove (narrower gap)
    y_minor = (y_positions[6] + y_positions[7]) / 2
    ax.annotate('Minor\nGroove', xy=(backbone_x_left - 0.3, y_minor),
                xytext=(-4.3, y_minor),
                fontsize=9, fontweight='bold', color=DARK_GRAY, ha='center',
                va='center',
                arrowprops=dict(arrowstyle='->', color=DARK_GRAY, lw=1.2))

    # Legend for base pair hydrogen bonds
    legend_y = -0.3
    ax.text(-3.5, legend_y, 'A—T : 2 H-bonds', fontsize=10, fontweight='bold',
            color=DARK_BLUE, va='center')
    ax.plot([-0.5, -0.1], [legend_y, legend_y], 'k--', linewidth=1.5)
    ax.plot([-0.5, -0.1], [legend_y + 0.15, legend_y + 0.15], 'k--', linewidth=1.5)

    ax.text(0.5, legend_y, 'G—C : 3 H-bonds', fontsize=10, fontweight='bold',
            color=DARK_BLUE, va='center')
    ax.plot([3.5, 3.9], [legend_y - 0.12, legend_y - 0.12], 'k--', linewidth=1.5)
    ax.plot([3.5, 3.9], [legend_y, legend_y], 'k--', linewidth=1.5)
    ax.plot([3.5, 3.9], [legend_y + 0.12, legend_y + 0.12], 'k--', linewidth=1.5)

    # Backbone legend
    legend_y2 = -0.8
    ax.plot([-3.5, -2.5], [legend_y2, legend_y2], color=BLUE, linewidth=4)
    ax.plot([-0.5, 0.5], [legend_y2, legend_y2], color=RED, linewidth=4)
    ax.text(-2.3, legend_y2, ' Sugar-phosphate backbone (Strand 1)', fontsize=8,
            color=DARK_BLUE, va='center')
    ax.text(0.7, legend_y2, ' Sugar-phosphate backbone (Strand 2)', fontsize=8,
            color=DARK_BLUE, va='center')

    # Component legend
    legend_y3 = 12.8
    p_circ = plt.Circle((-3.0, legend_y3), 0.2, color=ORANGE, ec=DARK_BLUE, linewidth=0.8)
    ax.add_patch(p_circ)
    ax.text(-3.0, legend_y3, 'P', ha='center', va='center', fontsize=6,
            fontweight='bold', color=WHITE)
    ax.text(-2.6, legend_y3, '= Phosphate', fontsize=8, color=DARK_BLUE, va='center')

    s_circ = plt.Circle((0.0, legend_y3), 0.18, color=TEAL, ec=DARK_BLUE, linewidth=0.8)
    ax.add_patch(s_circ)
    ax.text(0.0, legend_y3, 'S', ha='center', va='center', fontsize=5,
            fontweight='bold', color=WHITE)
    ax.text(0.35, legend_y3, '= Deoxyribose sugar', fontsize=8, color=DARK_BLUE, va='center')

    # Antiparallel label
    ax.text(0, 12.3, 'ANTIPARALLEL STRANDS', ha='center', fontsize=11,
            fontweight='bold', color=DARK_BLUE,
            bbox=dict(boxstyle='round,pad=0.3', facecolor=LIGHT_GRAY,
                      edgecolor=DARK_BLUE, linewidth=1.2))

    output_path = os.path.join(DIAGRAM_DIR, 'cuet-chem-biomolecules-mixed-20.png')
    fig.savefig(output_path, dpi=150, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print(f"Saved: {output_path}")


if __name__ == '__main__':
    print("Generating protein structure levels diagram...")
    draw_protein_structure_levels()

    print("Generating DNA double helix diagram...")
    draw_dna_double_helix()

    print("All diagrams generated successfully!")
