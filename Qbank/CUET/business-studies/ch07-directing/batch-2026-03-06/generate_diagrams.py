"""Generate matplotlib diagrams for Ch7 Directing."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Circle, Wedge
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


def diagram_maslow_pyramid():
    """Pyramid: Maslow's Hierarchy of Needs."""
    fig, ax = plt.subplots(figsize=(10, 10))
    ax.axis('off')

    ax.text(0.5, 0.97, "Maslow's Hierarchy of Needs", fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    levels = [
        ('Self-Actualisation', 'Growth, fulfilment,\nreaching potential', '#9b59b6'),
        ('Esteem Needs', 'Recognition, status,\nself-respect, autonomy', '#3498db'),
        ('Social / Belonging Needs', 'Friendship, teamwork,\nlove, belonging', '#2ecc71'),
        ('Safety / Security Needs', 'Job security, insurance,\nstable income, protection', '#f1c40f'),
        ('Physiological Needs', 'Food, water, shelter,\nclothing, sleep', '#e74c3c'),
    ]

    n = len(levels)
    y_base = 0.08
    total_h = 0.78
    layer_h = total_h / n

    for i, (title, desc, color) in enumerate(levels):
        idx = n - 1 - i  # bottom = index 4, top = index 0
        y = y_base + idx * layer_h

        # Trapezoid widths: wider at bottom, narrower at top
        w_bottom = 0.90 - idx * 0.14
        w_top = 0.90 - (idx + 1) * 0.14

        trap_x = [0.5 - w_bottom/2, 0.5 + w_bottom/2,
                   0.5 + w_top/2, 0.5 - w_top/2]
        trap_y = [y, y, y + layer_h, y + layer_h]

        ax.fill(trap_x, trap_y, color=color, alpha=0.25, edgecolor=color, linewidth=2)

        mid_y = y + layer_h / 2
        ax.text(0.5, mid_y + 0.02, title, ha='center', va='center',
                fontsize=11, fontweight='bold', color=color)
        ax.text(0.5, mid_y - 0.03, desc, ha='center', va='center',
                fontsize=7.5, color='#555555')

        # Level number
        ax.text(0.05, mid_y, f'Level {n - idx}' if idx < n else '',
                ha='left', va='center', fontsize=8, color='#999999')

    # Arrow on the left
    ax.annotate('', xy=(0.03, y_base + total_h - 0.02), xytext=(0.03, y_base + 0.02),
                arrowprops=dict(arrowstyle='->', lw=2, color='#bdc3c7'))
    ax.text(0.03, y_base + total_h / 2, 'Higher\nOrder\nNeeds', ha='center', va='center',
            fontsize=7, color='#999999', rotation=90)

    ax.set_xlim(-0.05, 1.05)
    ax.set_ylim(0, 1)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-directing-61.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-directing-61.png")


def diagram_elements_of_directing():
    """Hub-and-spoke: 4 Elements of Directing."""
    fig, ax = plt.subplots(figsize=(10, 10))
    ax.axis('off')

    ax.text(0.5, 0.97, 'Elements of Directing', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    # Centre hub
    centre = Circle((0.5, 0.50), 0.10, facecolor='#2c3e50', alpha=0.9, edgecolor='white', linewidth=2)
    ax.add_patch(centre)
    ax.text(0.5, 0.50, 'DIRECTING', ha='center', va='center',
            fontsize=14, fontweight='bold', color='white')

    elements = [
        (0.5, 0.85, 'Supervision', 'Overseeing subordinates\'\nwork on the job', '#e74c3c'),
        (0.85, 0.50, 'Motivation', 'Stimulating people\nto perform better', '#3498db'),
        (0.5, 0.15, 'Leadership', 'Influencing & guiding\npeople towards goals', '#2ecc71'),
        (0.15, 0.50, 'Communication', 'Exchange of information\nfor common understanding', '#9b59b6'),
    ]

    for x, y, title, desc, color in elements:
        rect = FancyBboxPatch((x - 0.12, y - 0.08), 0.24, 0.16,
                               boxstyle="round,pad=0.015",
                               facecolor=color, alpha=0.15, edgecolor=color, linewidth=2)
        ax.add_patch(rect)

        ax.text(x, y + 0.025, title, ha='center', va='center',
                fontsize=11, fontweight='bold', color=color)
        ax.text(x, y - 0.035, desc, ha='center', va='center',
                fontsize=7.5, color='#555555')

        # Line from centre to element
        dx = x - 0.5
        dy = y - 0.5
        dist = np.sqrt(dx**2 + dy**2)
        sx = 0.5 + 0.10 * dx / dist
        sy = 0.50 + 0.10 * dy / dist
        ax.plot([sx, x], [sy, y], color=color, linewidth=2.5, alpha=0.5)

    ax.set_xlim(-0.05, 1.05)
    ax.set_ylim(-0.05, 1.05)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-directing-62.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-directing-62.png")


def diagram_communication_process():
    """Flowchart: Communication Process with feedback loop."""
    fig, ax = plt.subplots(figsize=(12, 6))
    ax.axis('off')

    ax.text(0.5, 0.95, 'The Communication Process', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    steps = [
        (0.08, 'Sender', '#e74c3c'),
        (0.24, 'Encoding', '#e67e22'),
        (0.40, '?', '#95a5a6'),       # Hidden step (Channel)
        (0.56, 'Decoding', '#2ecc71'),
        (0.72, 'Receiver', '#3498db'),
        (0.88, 'Feedback', '#9b59b6'),
    ]

    y = 0.50
    box_w = 0.12
    box_h = 0.18

    for i, (x, label, color) in enumerate(steps):
        is_hidden = (i == 2)
        rect = FancyBboxPatch((x - box_w/2, y - box_h/2), box_w, box_h,
                               boxstyle="round,pad=0.015",
                               facecolor=color, alpha=0.20 if not is_hidden else 0.40,
                               edgecolor=color, linewidth=2,
                               linestyle='--' if is_hidden else '-')
        ax.add_patch(rect)

        ax.text(x, y, label, ha='center', va='center',
                fontsize=12 if not is_hidden else 16, fontweight='bold',
                color=color if not is_hidden else '#e74c3c')

        # Step number
        ax.text(x, y + box_h/2 + 0.04, f'Step {i+1}', ha='center', va='center',
                fontsize=8, color='#999999')

        # Arrow to next (except last)
        if i < len(steps) - 1:
            ax.annotate('', xy=(steps[i+1][0] - box_w/2 - 0.01, y),
                        xytext=(x + box_w/2 + 0.01, y),
                        arrowprops=dict(arrowstyle='->', lw=2, color='#bdc3c7'))

    # Feedback loop arrow (from Feedback back to Sender)
    ax.annotate('', xy=(0.08, y - box_h/2 - 0.06),
                xytext=(0.88, y - box_h/2 - 0.06),
                arrowprops=dict(arrowstyle='->', lw=2, color='#9b59b6',
                                connectionstyle='arc3,rad=0.0'))
    ax.text(0.48, y - box_h/2 - 0.10, 'Feedback Loop', ha='center', va='center',
            fontsize=8, color='#9b59b6', style='italic')

    # Noise indicator
    ax.text(0.40, y + box_h/2 + 0.12, '~~~ Noise ~~~', ha='center', va='center',
            fontsize=9, color='#e74c3c', style='italic')

    ax.set_xlim(-0.02, 1.02)
    ax.set_ylim(0.1, 1.0)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-directing-63.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-directing-63.png")


if __name__ == '__main__':
    diagram_maslow_pyramid()
    diagram_elements_of_directing()
    diagram_communication_process()
    print("All Ch7 diagrams generated.")
