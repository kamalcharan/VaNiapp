"""Generate matplotlib diagrams for Ch12 Consumer Protection."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Wedge
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


def diagram_three_tier_redressal():
    """Pyramid: Three-tier consumer dispute redressal machinery."""
    fig, ax = plt.subplots(figsize=(10, 10))
    ax.axis('off')

    ax.text(0.5, 0.97, 'Consumer Dispute Redressal Machinery', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')
    ax.text(0.5, 0.93, 'Consumer Protection Act, 2019', fontsize=10,
            ha='center', va='top', color='#7f8c8d', style='italic')

    tiers = [
        ('National Commission', 'Above Rs 10 crore', '#e74c3c'),
        ('State Commission', 'Rs 1 crore to Rs 10 crore', '#e67e22'),
        ('District Commission', 'Up to Rs 1 crore', '#27ae60'),
    ]

    y_base = 0.18
    total_h = 0.60
    layer_h = total_h / 3

    for i, (title, jurisdiction, color) in enumerate(tiers):
        idx = 2 - i  # bottom = index 2, top = index 0
        y = y_base + idx * layer_h

        w_bottom = 0.80 - idx * 0.20
        w_top = 0.80 - (idx + 1) * 0.20

        trap_x = [0.5 - w_bottom/2, 0.5 + w_bottom/2,
                   0.5 + w_top/2, 0.5 - w_top/2]
        trap_y = [y, y, y + layer_h, y + layer_h]

        ax.fill(trap_x, trap_y, color=color, alpha=0.22, edgecolor=color, linewidth=2.5)

        mid_y = y + layer_h / 2
        ax.text(0.5, mid_y + 0.025, title, ha='center', va='center',
                fontsize=12, fontweight='bold', color=color)
        ax.text(0.5, mid_y - 0.02, jurisdiction, ha='center', va='center',
                fontsize=9, color='#555555')

        ax.text(0.08, mid_y, f'Tier {3 - idx}', ha='center', va='center',
                fontsize=8, color='#999999')

    # Appeal arrows on the right
    for i in range(2):
        y1 = y_base + i * layer_h + layer_h / 2
        y2 = y_base + (i + 1) * layer_h + layer_h / 2
        ax.annotate('', xy=(0.92, y2 - 0.02), xytext=(0.92, y1 + 0.02),
                    arrowprops=dict(arrowstyle='->', lw=2, color='#bdc3c7'))
        ax.text(0.95, (y1 + y2) / 2, 'Appeal', ha='center', va='center',
                fontsize=7, color='#999999', rotation=90)

    # Supreme Court note
    ax.text(0.5, y_base + total_h + 0.06, 'Appeal → Supreme Court',
            ha='center', va='center', fontsize=9, color='#7f8c8d', style='italic')
    ax.annotate('', xy=(0.5, y_base + total_h + 0.03),
                xytext=(0.5, y_base + total_h + 0.01),
                arrowprops=dict(arrowstyle='->', lw=1.5, color='#bdc3c7'))

    ax.set_xlim(-0.02, 1.02)
    ax.set_ylim(0.05, 1.0)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-consumer-protection-61.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-consumer-protection-61.png")


def diagram_consumer_rights():
    """Circular wheel: 6 Consumer Rights."""
    fig, ax = plt.subplots(figsize=(10, 10))
    ax.axis('off')

    ax.text(0.5, 0.98, 'Consumer Rights', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    rights = [
        ('Right to\nSafety', 'Protection from\nhazardous goods', '#e74c3c'),
        ('Right to be\nInformed', 'Full product\ninformation', '#e67e22'),
        ('Right to\nChoose', 'Access to variety\nof goods', '#f1c40f'),
        ('Right to\nbe Heard', 'Voice in\nappropriate forums', '#27ae60'),
        ('Right to Seek\nRedressal', 'Fair settlement\nof grievances', '#3498db'),
        ('Right to Consumer\nEducation', 'Knowledge of\nconsumer rights', '#9b59b6'),
    ]

    n = len(rights)
    radius = 0.30
    centre = (0.5, 0.48)

    # Centre label
    ax.text(centre[0], centre[1], 'CONSUMER\nRIGHTS', ha='center', va='center',
            fontsize=11, fontweight='bold', color='#7f8c8d', alpha=0.6)

    for i, (title, desc, color) in enumerate(rights):
        angle = 90 - i * (360 / n)
        rad = np.radians(angle)
        x = centre[0] + radius * np.cos(rad)
        y = centre[1] + radius * np.sin(rad)

        rect = FancyBboxPatch((x - 0.12, y - 0.065), 0.24, 0.13,
                               boxstyle="round,pad=0.012",
                               facecolor=color, alpha=0.15, edgecolor=color, linewidth=2)
        ax.add_patch(rect)

        ax.text(x, y + 0.02, title, ha='center', va='center',
                fontsize=8.5, fontweight='bold', color=color)
        ax.text(x, y - 0.035, desc, ha='center', va='center',
                fontsize=6.5, color='#666666')

        # Line from centre
        dx = x - centre[0]
        dy = y - centre[1]
        dist = np.sqrt(dx**2 + dy**2)
        sx = centre[0] + 0.06 * dx / dist
        sy = centre[1] + 0.06 * dy / dist
        ax.plot([sx, x], [sy, y], color=color, linewidth=2, alpha=0.4)

    ax.set_xlim(-0.02, 1.02)
    ax.set_ylim(0.0, 1.0)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-consumer-protection-62.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-consumer-protection-62.png")


def diagram_complaint_filing():
    """Vertical flowchart: Steps to file a consumer complaint."""
    fig, ax = plt.subplots(figsize=(10, 12))
    ax.axis('off')

    ax.text(0.5, 0.98, 'How to File a Consumer Complaint', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    steps = [
        ('Step 1', 'Identify the grievance\n(defective product / deficient service / unfair trade)', '#e74c3c'),
        ('Step 2', 'Gather evidence\n(bills, receipts, warranty cards, photos)', '#e67e22'),
        ('Step 3', 'Send written complaint /\nnotice to seller or manufacturer', '#f1c40f'),
        ('Step 4', 'If unresolved, file complaint with\nappropriate Commission (District/State/National)', '#27ae60'),
        ('Step 5', 'Commission examines;\nmay call for product testing', '#3498db'),
        ('Step 6', 'Order passed — replacement,\nrefund, or compensation', '#9b59b6'),
        ('Step 7', 'Appeal if unsatisfied\n(within 30 / 45 days)', '#8e44ad'),
    ]

    n = len(steps)
    y_start = 0.90
    y_step = 0.11
    box_w = 0.50
    box_h = 0.07

    for i, (step_label, desc, color) in enumerate(steps):
        y = y_start - i * y_step

        rect = FancyBboxPatch((0.5 - box_w/2, y - box_h/2), box_w, box_h,
                               boxstyle="round,pad=0.012",
                               facecolor=color, alpha=0.18, edgecolor=color, linewidth=2.5)
        ax.add_patch(rect)

        ax.text(0.5 - box_w/2 + 0.02, y, step_label, ha='left', va='center',
                fontsize=9, fontweight='bold', color=color)
        ax.text(0.5 + 0.02, y, desc, ha='center', va='center',
                fontsize=8.5, color='#2c3e50')

        if i < n - 1:
            ax.annotate('', xy=(0.5, y - box_h/2 - 0.03),
                        xytext=(0.5, y - box_h/2 - 0.003),
                        arrowprops=dict(arrowstyle='->', lw=2.5, color='#bdc3c7'))

    ax.set_xlim(0.0, 1.0)
    ax.set_ylim(0.08, 1.0)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-consumer-protection-63.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-consumer-protection-63.png")


if __name__ == '__main__':
    diagram_three_tier_redressal()
    diagram_consumer_rights()
    diagram_complaint_filing()
    print("All Ch12 Consumer Protection diagrams generated.")
