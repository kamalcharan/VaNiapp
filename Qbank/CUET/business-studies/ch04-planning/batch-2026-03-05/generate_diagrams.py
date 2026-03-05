"""Generate matplotlib diagrams for Ch4 Planning."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Circle
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


def diagram_planning_process():
    """Flowchart: 7 steps of the Planning Process."""
    fig, ax = plt.subplots(figsize=(8, 11))
    ax.axis('off')

    ax.text(0.5, 0.97, 'The Planning Process', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    steps = [
        ('1. Setting Objectives', 'Define what the organisation\nwants to achieve', '#e74c3c'),
        ('2. Developing Premises', 'Make assumptions about\nfuture conditions', '#e67e22'),
        ('3. Identifying Alternatives', 'Explore all possible\ncourses of action', '#f1c40f'),
        ('4. Evaluating Alternatives', 'Weigh pros & cons\nof each option', '#2ecc71'),
        ('5. Selecting an Alternative', 'Choose the best\ncourse of action', '#3498db'),
        ('6. Implementing the Plan', 'Put the plan into action\nwith derivative plans', '#9b59b6'),
        ('7. Follow-up Action', 'Monitor progress &\ntake corrective action', '#1abc9c'),
    ]

    y_start = 0.90
    step_height = 0.08
    gap = 0.035

    for i, (title, desc, color) in enumerate(steps):
        y = y_start - i * (step_height + gap)

        # Step box
        rect = FancyBboxPatch((0.15, y - step_height), 0.70, step_height,
                               boxstyle="round,pad=0.015",
                               facecolor=color, alpha=0.15, edgecolor=color, linewidth=2)
        ax.add_patch(rect)

        # Step number circle
        circle = Circle((0.22, y - step_height / 2), 0.025, facecolor=color, alpha=0.9)
        ax.add_patch(circle)
        ax.text(0.22, y - step_height / 2, str(i + 1), ha='center', va='center',
                fontsize=11, fontweight='bold', color='white')

        # Title
        ax.text(0.30, y - step_height / 2 + 0.012, title, ha='left', va='center',
                fontsize=10, fontweight='bold', color=color)

        # Description
        ax.text(0.30, y - step_height / 2 - 0.015, desc, ha='left', va='center',
                fontsize=7.5, color='#555555')

        # Arrow to next step
        if i < len(steps) - 1:
            arrow_y = y - step_height - gap / 2
            ax.annotate('', xy=(0.5, arrow_y + 0.005), xytext=(0.5, arrow_y + gap - 0.005),
                        arrowprops=dict(arrowstyle='->', lw=2, color='#bdc3c7'))

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-planning-61.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-planning-61.png")


def diagram_types_of_plans():
    """Tree diagram: Types of Plans classification."""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.axis('off')

    ax.text(0.5, 0.96, 'Types of Plans', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    # Top-level types
    top_types = [
        (0.20, 'Objectives', '#e74c3c', 'Desired end results'),
        (0.80, 'Strategy', '#8e44ad', 'Comprehensive plan\nconsidering competition'),
    ]

    for x, name, color, desc in top_types:
        rect = FancyBboxPatch((x - 0.12, 0.82), 0.24, 0.08,
                               boxstyle="round,pad=0.01",
                               facecolor=color, alpha=0.85, edgecolor='white')
        ax.add_patch(rect)
        ax.text(x, 0.86, name, ha='center', va='center',
                fontsize=10, fontweight='bold', color='white')
        ax.text(x, 0.79, desc, ha='center', va='top',
                fontsize=7, color='#666666', style='italic')

    # Main branches
    branches = [
        (0.30, 'Single-Use Plans', '#2980b9', [
            ('Programme', 'Comprehensive plan for\na specific activity'),
            ('Budget', 'Expected results in\nnumerical terms'),
        ]),
        (0.70, 'Standing Plans', '#27ae60', [
            ('Policy', 'General guide for\ndecision-making'),
            ('Procedure', 'Step-by-step sequence\nfor routine activity'),
            ('Method', 'Standardised way of\ndoing a task'),
            ('Rule', 'Specific do/don\'t\ndirective — rigid'),
        ]),
    ]

    for bx, title, color, items in branches:
        # Branch header
        rect = FancyBboxPatch((bx - 0.15, 0.62), 0.30, 0.08,
                               boxstyle="round,pad=0.01",
                               facecolor=color, alpha=0.85, edgecolor='white')
        ax.add_patch(rect)
        ax.text(bx, 0.66, title, ha='center', va='center',
                fontsize=11, fontweight='bold', color='white')

        # Arrow from top
        ax.annotate('', xy=(bx, 0.70), xytext=(0.5, 0.82),
                    arrowprops=dict(arrowstyle='->', lw=1.5, color='#bdc3c7'))

        # Leaf items
        n = len(items)
        total_width = 0.30
        spacing = total_width / (n - 1) if n > 1 else 0
        start_x = bx - total_width / 2

        for i, (name, desc) in enumerate(items):
            ix = start_x + i * spacing
            rect = FancyBboxPatch((ix - 0.07, 0.30), 0.14, 0.22,
                                   boxstyle="round,pad=0.01",
                                   facecolor=color, alpha=0.12, edgecolor=color, linewidth=1.5)
            ax.add_patch(rect)
            ax.text(ix, 0.47, name, ha='center', va='center',
                    fontsize=8.5, fontweight='bold', color=color)
            ax.text(ix, 0.38, desc, ha='center', va='center',
                    fontsize=6.5, color='#555555')

            # Arrow from branch header
            ax.annotate('', xy=(ix, 0.52), xytext=(bx, 0.62),
                        arrowprops=dict(arrowstyle='->', lw=1, color='#bdc3c7'))

    ax.set_xlim(0, 1)
    ax.set_ylim(0.2, 1)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-planning-62.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-planning-62.png")


def diagram_limitations_mindmap():
    """Mind-map: 6 Limitations of Planning."""
    fig, ax = plt.subplots(figsize=(10, 10))
    ax.axis('off')

    ax.text(0.5, 0.98, 'Limitations of Planning', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    # Centre circle
    centre = Circle((0.5, 0.5), 0.10, facecolor='#2c3e50', alpha=0.9, edgecolor='white', linewidth=2)
    ax.add_patch(centre)
    ax.text(0.5, 0.52, 'Limitations', ha='center', va='center',
            fontsize=12, fontweight='bold', color='white')
    ax.text(0.5, 0.47, 'of Planning', ha='center', va='center',
            fontsize=12, fontweight='bold', color='white')

    limitations = [
        (0.5, 0.88, 'Rigidity', 'Plans may become\ninflexible', '#e74c3c'),
        (0.88, 0.70, 'Dynamic\nEnvironment', 'Rapid changes make\nplans outdated', '#e67e22'),
        (0.88, 0.30, 'Reduces\nCreativity', 'Subordinates only\nfollow, don\'t innovate', '#f1c40f'),
        (0.5, 0.12, 'Huge Costs', 'Research, data,\nexpert fees', '#2ecc71'),
        (0.12, 0.30, 'Time-\nConsuming', 'Data collection &\nanalysis delay action', '#3498db'),
        (0.12, 0.70, 'No Guarantee\nof Success', 'External factors\naffect outcomes', '#9b59b6'),
    ]

    for x, y, title, desc, color in limitations:
        # Branch box
        rect = FancyBboxPatch((x - 0.11, y - 0.07), 0.22, 0.14,
                               boxstyle="round,pad=0.015",
                               facecolor=color, alpha=0.15, edgecolor=color, linewidth=2)
        ax.add_patch(rect)

        ax.text(x, y + 0.02, title, ha='center', va='center',
                fontsize=9, fontweight='bold', color=color)
        ax.text(x, y - 0.04, desc, ha='center', va='center',
                fontsize=7, color='#555555')

        # Line from centre to branch
        dx = x - 0.5
        dy = y - 0.5
        dist = np.sqrt(dx**2 + dy**2)
        # Start from edge of centre circle
        sx = 0.5 + 0.10 * dx / dist
        sy = 0.5 + 0.10 * dy / dist
        ax.plot([sx, x], [sy, y], color=color, linewidth=2, alpha=0.5)

    ax.set_xlim(-0.05, 1.05)
    ax.set_ylim(-0.05, 1.05)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-planning-63.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-planning-63.png")


if __name__ == '__main__':
    diagram_planning_process()
    diagram_types_of_plans()
    diagram_limitations_mindmap()
    print("All Ch4 diagrams generated.")
