"""Generate matplotlib diagrams for Ch1 batch 3 (Q49, Q58)."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


def diagram_q49_coordination_essence():
    """Q49: Coordination spanning across all 5 management functions."""
    fig, ax = plt.subplots(figsize=(10, 5))

    functions = ['Planning', 'Organising', 'Staffing', 'Directing', 'Controlling']
    colors = ['#3498db', '#9b59b6', '#e67e22', '#e74c3c', '#2ecc71']

    box_w = 0.14
    box_h = 0.22
    y_top = 0.65
    gap = 0.04
    total_w = len(functions) * box_w + (len(functions) - 1) * gap
    x_start = (1.0 - total_w) / 2

    for i, (func, color) in enumerate(zip(functions, colors)):
        x = x_start + i * (box_w + gap)
        rect = mpatches.FancyBboxPatch(
            (x, y_top), box_w, box_h,
            boxstyle="round,pad=0.015", facecolor=color, alpha=0.25,
            edgecolor=color, linewidth=2.5
        )
        ax.add_patch(rect)
        ax.text(x + box_w / 2, y_top + box_h / 2, func,
                fontsize=10, fontweight='bold', ha='center', va='center')

        # Dotted line from coordination bar into each box
        ax.plot([x + box_w / 2, x + box_w / 2],
                [0.42, y_top], linestyle=':', color=color, linewidth=1.8, alpha=0.7)

    # Coordination bar below
    coord_x = x_start - 0.02
    coord_w = total_w + 0.04
    coord_rect = mpatches.FancyBboxPatch(
        (coord_x, 0.28), coord_w, 0.14,
        boxstyle="round,pad=0.02", facecolor='#f1c40f', alpha=0.3,
        edgecolor='#f39c12', linewidth=3
    )
    ax.add_patch(coord_rect)

    # Double-headed arrow inside coordination bar
    arrow_y = 0.35
    ax.annotate('', xy=(coord_x + coord_w - 0.03, arrow_y),
                xytext=(coord_x + 0.03, arrow_y),
                arrowprops=dict(arrowstyle='<->', lw=2.5, color='#d35400'))

    ax.text(0.5, 0.35, 'COORDINATION — The Essence of Management',
            fontsize=12, fontweight='bold', ha='center', va='center', color='#d35400')

    # Subtitle
    ax.text(0.5, 0.15, 'Coordination is NOT a separate function.\n'
            'It permeates and binds all five functions together.',
            fontsize=9, ha='center', va='center', style='italic', color='#7f8c8d')

    ax.set_xlim(0, 1)
    ax.set_ylim(0.05, 0.95)
    ax.set_aspect('auto')
    ax.axis('off')
    ax.set_title('Coordination Across Management Functions', fontsize=13, fontweight='bold', pad=10)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-nature-mgmt-49.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-nature-mgmt-49.png")


def diagram_q58_venn_mgmt_admin():
    """Q58: Venn diagram — Management vs Administration."""
    fig, ax = plt.subplots(figsize=(9, 6.5))

    # Two overlapping circles
    circle_admin = plt.Circle((0.35, 0.55), 0.25, facecolor='#aed6f1', alpha=0.4,
                               edgecolor='#2980b9', linewidth=2.5)
    circle_mgmt = plt.Circle((0.65, 0.55), 0.25, facecolor='#abebc6', alpha=0.4,
                              edgecolor='#27ae60', linewidth=2.5)
    ax.add_patch(circle_admin)
    ax.add_patch(circle_mgmt)

    # Labels
    ax.text(0.22, 0.75, 'ADMINISTRATION', fontsize=11, fontweight='bold',
            ha='center', va='center', color='#2980b9')
    ax.text(0.78, 0.75, 'MANAGEMENT', fontsize=11, fontweight='bold',
            ha='center', va='center', color='#27ae60')

    # Left-only content (Administration)
    admin_items = ['Policy formulation', 'Objective setting', 'Strategic decisions', 'Top-level activity']
    for i, item in enumerate(admin_items):
        ax.text(0.18, 0.62 - i * 0.06, f'• {item}', fontsize=8.5, ha='left', va='center', color='#2c3e50')

    # Right-only content (Management)
    mgmt_items = ['Policy implementation', 'Execution through people', 'Operational decisions', 'All levels of activity']
    for i, item in enumerate(mgmt_items):
        ax.text(0.63, 0.62 - i * 0.06, f'• {item}', fontsize=8.5, ha='left', va='center', color='#2c3e50')

    # Overlap content
    overlap_items = ['Planning', 'Organising', 'Coordinating', 'Both needed for\norganisational success']
    for i, item in enumerate(overlap_items):
        y = 0.63 - i * 0.065
        ax.text(0.50, y, item, fontsize=8, ha='center', va='center',
                color='#8e44ad', fontweight='bold')

    # Modern view note at bottom
    ax.text(0.50, 0.18, 'Modern View: Every manager both administers and manages.',
            fontsize=10, ha='center', va='center', style='italic', fontweight='bold',
            color='#e74c3c',
            bbox=dict(boxstyle='round,pad=0.4', facecolor='#fef9e7', edgecolor='#f39c12', linewidth=1.5))

    ax.set_xlim(0, 1)
    ax.set_ylim(0.05, 0.92)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Management vs Administration — Venn Diagram', fontsize=13, fontweight='bold', pad=10)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-nature-mgmt-58.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-nature-mgmt-58.png")


if __name__ == '__main__':
    diagram_q49_coordination_essence()
    diagram_q58_venn_mgmt_admin()
    print("All diagrams for batch 03 generated.")
