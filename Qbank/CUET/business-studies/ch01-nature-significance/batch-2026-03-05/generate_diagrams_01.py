"""Generate matplotlib diagrams for Ch1 Nature & Significance of Management (Q18, Q19)."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


def diagram_q18_efficiency_effectiveness_matrix():
    """Q18: 2x2 Efficiency vs Effectiveness matrix."""
    fig, ax = plt.subplots(figsize=(7, 6))

    # Draw quadrants
    colors = ['#2ecc71', '#f39c12', '#e74c3c', '#95a5a6']
    labels = [
        'Quadrant I\nHigh Efficiency\nHigh Effectiveness\n(IDEAL)',
        'Quadrant II\nLow Efficiency\nHigh Effectiveness',
        'Quadrant III\nHigh Efficiency\nLow Effectiveness',
        'Quadrant IV\nLow Efficiency\nLow Effectiveness\n(WORST)',
    ]
    positions = [(0.75, 0.75), (0.25, 0.75), (0.75, 0.25), (0.25, 0.25)]

    for (x, y), color, label in zip(positions, colors, labels):
        rect = mpatches.FancyBboxPatch(
            (x - 0.23, y - 0.23), 0.46, 0.46,
            boxstyle="round,pad=0.02",
            facecolor=color, alpha=0.3, edgecolor=color, linewidth=2
        )
        ax.add_patch(rect)
        fontsize = 10 if 'IDEAL' not in label else 11
        fontweight = 'bold' if 'IDEAL' in label or 'WORST' in label else 'normal'
        ax.text(x, y, label, ha='center', va='center',
                fontsize=fontsize, fontweight=fontweight)

    # Axes
    ax.annotate('', xy=(1.02, 0.0), xytext=(0.0, 0.0),
                arrowprops=dict(arrowstyle='->', lw=2, color='#2c3e50'))
    ax.annotate('', xy=(0.0, 1.02), xytext=(0.0, 0.0),
                arrowprops=dict(arrowstyle='->', lw=2, color='#2c3e50'))

    ax.text(0.5, -0.07, 'EFFICIENCY  →', ha='center', va='center',
            fontsize=13, fontweight='bold', color='#2c3e50')
    ax.text(-0.07, 0.5, 'EFFECTIVENESS  →', ha='center', va='center',
            fontsize=13, fontweight='bold', color='#2c3e50', rotation=90)

    ax.text(0.0, -0.03, 'Low', ha='center', fontsize=9, color='#7f8c8d')
    ax.text(1.0, -0.03, 'High', ha='center', fontsize=9, color='#7f8c8d')
    ax.text(-0.03, 0.0, 'Low', ha='right', fontsize=9, color='#7f8c8d')
    ax.text(-0.03, 1.0, 'High', ha='right', fontsize=9, color='#7f8c8d')

    # Dividing lines
    ax.axhline(y=0.5, color='#bdc3c7', linewidth=1, linestyle='--')
    ax.axvline(x=0.5, color='#bdc3c7', linewidth=1, linestyle='--')

    ax.set_xlim(-0.12, 1.1)
    ax.set_ylim(-0.12, 1.1)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Efficiency vs Effectiveness Matrix', fontsize=14, fontweight='bold', pad=15)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-nature-mgmt-18.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-nature-mgmt-18.png")


def diagram_q19_art_science_profession_venn():
    """Q19: Venn diagram — Art, Science, Profession with restricted entry crossed out."""
    fig, ax = plt.subplots(figsize=(9, 7))

    from matplotlib.patches import Circle

    # Three circles
    circle_params = [
        (0.3, 0.55, 0.28, '#3498db', 'ART'),
        (0.7, 0.55, 0.28, '#e74c3c', 'SCIENCE'),
        (0.5, 0.25, 0.28, '#2ecc71', 'PROFESSION'),
    ]

    for cx, cy, r, color, label in circle_params:
        circle = Circle((cx, cy), r, facecolor=color, alpha=0.15,
                         edgecolor=color, linewidth=2.5)
        ax.add_patch(circle)
        # Label position outside
        if label == 'ART':
            ax.text(cx - 0.15, cy + 0.22, label, fontsize=14, fontweight='bold',
                    color=color, ha='center')
        elif label == 'SCIENCE':
            ax.text(cx + 0.15, cy + 0.22, label, fontsize=14, fontweight='bold',
                    color=color, ha='center')
        else:
            ax.text(cx, cy - 0.30, label, fontsize=14, fontweight='bold',
                    color=color, ha='center')

    # Art features
    ax.text(0.14, 0.60, '• Personal skill', fontsize=8.5, ha='left')
    ax.text(0.14, 0.55, '• Creativity', fontsize=8.5, ha='left')
    ax.text(0.14, 0.50, '• Practice-based', fontsize=8.5, ha='left')

    # Science features
    ax.text(0.72, 0.60, '• Systematic', fontsize=8.5, ha='left')
    ax.text(0.72, 0.55, '  knowledge', fontsize=8.5, ha='left')
    ax.text(0.72, 0.50, '• Cause-effect', fontsize=8.5, ha='left')
    ax.text(0.72, 0.45, '• Universal', fontsize=8.5, ha='left')

    # Profession features
    ax.text(0.36, 0.18, '• Ethical code', fontsize=8.5, ha='left', color='#27ae60')
    ax.text(0.36, 0.13, '• Professional body', fontsize=8.5, ha='left', color='#27ae60')
    ax.text(0.36, 0.08, '• Service motive', fontsize=8.5, ha='left', color='#27ae60')

    # Restricted entry — with cross mark (the key feature NOT met)
    ax.text(0.36, 0.03, '• Restricted entry', fontsize=9, ha='left',
            color='red', fontweight='bold')
    # Cross mark
    ax.plot([0.34, 0.62], [0.04, 0.02], color='red', linewidth=2.5)
    ax.plot([0.34, 0.62], [0.02, 0.04], color='red', linewidth=2.5)

    # Label for the cross
    ax.text(0.65, 0.03, '← NOT fully met\n    by Management',
            fontsize=8, color='red', fontweight='bold', ha='left', va='center')

    # Center overlap — MANAGEMENT
    ax.text(0.5, 0.42, 'MANAGEMENT', fontsize=11, fontweight='bold',
            ha='center', va='center',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#f9e79f', edgecolor='#f1c40f', linewidth=1.5))

    ax.set_xlim(-0.05, 1.05)
    ax.set_ylim(-0.08, 0.95)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Management: Art, Science & Profession', fontsize=14, fontweight='bold', pad=10)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-nature-mgmt-19.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-nature-mgmt-19.png")


if __name__ == '__main__':
    diagram_q18_efficiency_effectiveness_matrix()
    diagram_q19_art_science_profession_venn()
    print("All diagrams for batch 01 generated.")
