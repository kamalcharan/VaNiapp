"""Generate matplotlib diagrams for Ch6 Staffing."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Circle
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


def diagram_staffing_process():
    """Flowchart: Steps of the Staffing Process."""
    fig, ax = plt.subplots(figsize=(8, 12))
    ax.axis('off')

    ax.text(0.5, 0.97, 'The Staffing Process', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    steps = [
        ('1. Estimating Manpower\n    Requirements', 'Determine number & type\nof personnel needed', '#e74c3c'),
        ('2. Recruitment', 'Search for and stimulate\ncandidates to apply', '#e67e22'),
        ('3. Selection', 'Choose the best candidates\nthrough tests & interviews', '#f1c40f'),
        ('4. Placement &\n    Orientation', 'Assign to the right job\n& introduce to organisation', '#2ecc71'),
        ('5. Training &\n    Development', 'Improve skills for current\njob & future growth', '#3498db'),
        ('6. Performance\n    Appraisal', 'Evaluate employee\nperformance against standards', '#9b59b6'),
        ('7. Promotion &\n    Career Planning', 'Advance employees &\nplan career paths', '#1abc9c'),
        ('8. Compensation', 'Determine salary,\nincentives & benefits', '#e91e63'),
    ]

    y_start = 0.90
    step_height = 0.07
    gap = 0.03

    for i, (title, desc, color) in enumerate(steps):
        y = y_start - i * (step_height + gap)

        rect = FancyBboxPatch((0.15, y - step_height), 0.70, step_height,
                               boxstyle="round,pad=0.015",
                               facecolor=color, alpha=0.15, edgecolor=color, linewidth=2)
        ax.add_patch(rect)

        circle = Circle((0.22, y - step_height / 2), 0.022, facecolor=color, alpha=0.9)
        ax.add_patch(circle)
        ax.text(0.22, y - step_height / 2, str(i + 1), ha='center', va='center',
                fontsize=10, fontweight='bold', color='white')

        ax.text(0.30, y - step_height / 2 + 0.010, title, ha='left', va='center',
                fontsize=9, fontweight='bold', color=color)

        ax.text(0.58, y - step_height / 2, desc, ha='left', va='center',
                fontsize=7, color='#555555')

        if i < len(steps) - 1:
            arrow_y = y - step_height - gap / 2
            ax.annotate('', xy=(0.5, arrow_y + 0.004), xytext=(0.5, arrow_y + gap - 0.004),
                        arrowprops=dict(arrowstyle='->', lw=2, color='#bdc3c7'))

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-staffing-61.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-staffing-61.png")


def diagram_sources_of_recruitment():
    """Comparison diagram: Internal vs External Sources of Recruitment."""
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.axis('off')

    ax.text(0.5, 0.96, 'Sources of Recruitment', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    # Header arrow
    ax.annotate('', xy=(0.25, 0.87), xytext=(0.5, 0.91),
                arrowprops=dict(arrowstyle='->', lw=2, color='#2c3e50'))
    ax.annotate('', xy=(0.75, 0.87), xytext=(0.5, 0.91),
                arrowprops=dict(arrowstyle='->', lw=2, color='#2c3e50'))

    # Internal Sources column
    int_color = '#27ae60'
    rect = FancyBboxPatch((0.05, 0.78), 0.38, 0.08,
                           boxstyle="round,pad=0.01",
                           facecolor=int_color, alpha=0.85, edgecolor='white')
    ax.add_patch(rect)
    ax.text(0.24, 0.82, 'Internal Sources', ha='center', va='center',
            fontsize=12, fontweight='bold', color='white')

    internal = ['Transfer', 'Promotion']
    for i, item in enumerate(internal):
        y = 0.68 - i * 0.12
        rect = FancyBboxPatch((0.08, y), 0.32, 0.08,
                               boxstyle="round,pad=0.01",
                               facecolor=int_color, alpha=0.12, edgecolor=int_color, linewidth=1.5)
        ax.add_patch(rect)
        ax.text(0.24, y + 0.04, item, ha='center', va='center',
                fontsize=10, fontweight='bold', color=int_color)

    # External Sources column
    ext_color = '#2980b9'
    rect = FancyBboxPatch((0.55, 0.78), 0.40, 0.08,
                           boxstyle="round,pad=0.01",
                           facecolor=ext_color, alpha=0.85, edgecolor='white')
    ax.add_patch(rect)
    ax.text(0.75, 0.82, 'External Sources', ha='center', va='center',
            fontsize=12, fontweight='bold', color='white')

    external = [
        'Direct Recruitment', 'Casual Callers', 'Advertisement',
        'Employment Exchange', 'Campus Recruitment',
        'Placement Agencies', 'Web Publishing', 'Labour Contractors',
    ]
    for i, item in enumerate(external):
        y = 0.68 - i * 0.08
        rect = FancyBboxPatch((0.58, y), 0.34, 0.06,
                               boxstyle="round,pad=0.01",
                               facecolor=ext_color, alpha=0.12, edgecolor=ext_color, linewidth=1)
        ax.add_patch(rect)
        ax.text(0.75, y + 0.03, item, ha='center', va='center',
                fontsize=8.5, fontweight='bold', color=ext_color)

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-staffing-62.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-staffing-62.png")


def diagram_selection_process():
    """Vertical flowchart: Steps of the Selection Process."""
    fig, ax = plt.subplots(figsize=(8, 11))
    ax.axis('off')

    ax.text(0.5, 0.97, 'The Selection Process', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    steps = [
        ('1. Preliminary Screening', '#e74c3c'),
        ('2. Selection Tests', '#e67e22'),
        ('3. Employment Interview', '#f1c40f'),
        ('4. ?', '#95a5a6'),  # Hidden step
        ('5. Selection Decision', '#3498db'),
        ('6. Medical Examination', '#9b59b6'),
        ('7. Job Offer', '#1abc9c'),
        ('8. Contract of Employment', '#e91e63'),
    ]

    y_start = 0.90
    step_height = 0.065
    gap = 0.03

    for i, (title, color) in enumerate(steps):
        y = y_start - i * (step_height + gap)

        rect = FancyBboxPatch((0.20, y - step_height), 0.60, step_height,
                               boxstyle="round,pad=0.015",
                               facecolor=color, alpha=0.20 if i != 3 else 0.40,
                               edgecolor=color, linewidth=2,
                               linestyle='--' if i == 3 else '-')
        ax.add_patch(rect)

        ax.text(0.50, y - step_height / 2, title, ha='center', va='center',
                fontsize=11 if i != 3 else 14, fontweight='bold',
                color=color if i != 3 else '#e74c3c')

        if i < len(steps) - 1:
            arrow_y = y - step_height - gap / 2
            ax.annotate('', xy=(0.5, arrow_y + 0.004), xytext=(0.5, arrow_y + gap - 0.004),
                        arrowprops=dict(arrowstyle='->', lw=2, color='#bdc3c7'))

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-staffing-63.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-staffing-63.png")


if __name__ == '__main__':
    diagram_staffing_process()
    diagram_sources_of_recruitment()
    diagram_selection_process()
    print("All Ch6 diagrams generated.")
