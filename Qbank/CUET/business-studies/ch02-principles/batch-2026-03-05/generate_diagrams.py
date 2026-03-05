"""Generate matplotlib diagrams for Ch2 Principles of Management."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


def diagram_fayol_vs_taylor():
    """Comparison chart: Fayol vs Taylor."""
    fig, ax = plt.subplots(figsize=(10, 7))
    ax.axis('off')

    # Title
    ax.text(0.5, 0.97, 'Fayol vs Taylor: Key Differences', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    # Column headers
    headers = ['Basis', 'Henri Fayol', 'F.W. Taylor']
    header_colors = ['#34495e', '#2980b9', '#e74c3c']
    x_positions = [0.18, 0.50, 0.82]

    for x, header, color in zip(x_positions, headers, header_colors):
        rect = FancyBboxPatch((x - 0.15, 0.86), 0.30, 0.07,
                               boxstyle="round,pad=0.01",
                               facecolor=color, alpha=0.9, edgecolor='white', linewidth=1)
        ax.add_patch(rect)
        ax.text(x, 0.895, header, ha='center', va='center',
                fontsize=11, fontweight='bold', color='white')

    # Data rows
    rows = [
        ['Known as', 'Father of General\nManagement', 'Father of Scientific\nManagement'],
        ['Perspective', 'Top-level management\n(Top → Down)', 'Shop-floor level\n(Bottom → Up)'],
        ['Focus', 'Improving overall\nadministration', 'Increasing worker\nproductivity'],
        ['Applicability', 'Universal — all types\nof organisations', 'Primarily factory /\nindustrial settings'],
        ['Contribution', '14 Principles of\nManagement', 'Principles + Techniques\n(Time, Motion Study etc.)'],
        ['Background', 'French Mining\nEngineer', 'American Mechanical\nEngineer'],
        ['Unity of\nCommand', 'Strongly advocated\n(one boss)', 'Violated by Functional\nForemanship (8 bosses)'],
    ]

    y_start = 0.82
    row_height = 0.105

    for i, row in enumerate(rows):
        y = y_start - (i + 1) * row_height
        bg_color = '#ecf0f1' if i % 2 == 0 else '#ffffff'

        # Row background
        rect = FancyBboxPatch((0.01, y - 0.01), 0.98, row_height - 0.01,
                               boxstyle="round,pad=0.005",
                               facecolor=bg_color, edgecolor='#bdc3c7', linewidth=0.5)
        ax.add_patch(rect)

        for j, (x, text) in enumerate(zip(x_positions, row)):
            weight = 'bold' if j == 0 else 'normal'
            color = '#2c3e50' if j == 0 else '#34495e'
            fontsize = 8.5 if j == 0 else 8
            ax.text(x, y + (row_height - 0.01) / 2, text, ha='center', va='center',
                    fontsize=fontsize, fontweight=weight, color=color)

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-principles-61.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-principles-61.png")


def diagram_functional_foremanship():
    """Org chart: Taylor's Functional Foremanship structure."""
    fig, ax = plt.subplots(figsize=(11, 7))
    ax.axis('off')

    ax.text(0.5, 0.97, "Taylor's Functional Foremanship", fontsize=15,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    # Factory Manager (top)
    rect = FancyBboxPatch((0.35, 0.82), 0.30, 0.08,
                           boxstyle="round,pad=0.01",
                           facecolor='#8e44ad', alpha=0.85, edgecolor='white')
    ax.add_patch(rect)
    ax.text(0.5, 0.86, 'Factory Manager', ha='center', va='center',
            fontsize=11, fontweight='bold', color='white')

    # Two branches
    branches = [
        (0.25, 'Planning Incharge', '#2980b9',
         [('Route\nClerk', 'Sequence of\noperations'),
          ('Instruction\nCard Clerk', 'Detailed\ninstructions'),
          ('Time & Cost\nClerk', 'Time & cost\nrecords'),
          ('Disciplinarian', 'Rules &\ndiscipline')]),
        (0.75, 'Production Incharge', '#e74c3c',
         [('Speed\nBoss', 'Timely work\ncompletion'),
          ('Gang\nBoss', 'Machines &\ntools ready'),
          ('Repair\nBoss', 'Machine\nmaintenance'),
          ('Inspector', 'Quality\ncheck')]),
    ]

    for bx, title, color, foremen in branches:
        # Branch box
        rect = FancyBboxPatch((bx - 0.15, 0.65), 0.30, 0.08,
                               boxstyle="round,pad=0.01",
                               facecolor=color, alpha=0.85, edgecolor='white')
        ax.add_patch(rect)
        ax.text(bx, 0.69, title, ha='center', va='center',
                fontsize=10, fontweight='bold', color='white')

        # Arrow from Factory Manager to branch
        ax.annotate('', xy=(bx, 0.73), xytext=(0.5, 0.82),
                    arrowprops=dict(arrowstyle='->', lw=1.5, color='#7f8c8d'))

        # Foremen boxes
        n = len(foremen)
        spacing = 0.30 / (n - 1) if n > 1 else 0
        start_x = bx - 0.15

        for i, (name, role) in enumerate(foremen):
            fx = start_x + i * spacing
            # Foreman box
            rect = FancyBboxPatch((fx - 0.06, 0.40), 0.12, 0.16,
                                   boxstyle="round,pad=0.01",
                                   facecolor=color, alpha=0.2, edgecolor=color, linewidth=1.5)
            ax.add_patch(rect)
            ax.text(fx, 0.52, name, ha='center', va='center',
                    fontsize=7.5, fontweight='bold', color=color)
            ax.text(fx, 0.44, role, ha='center', va='center',
                    fontsize=6.5, color='#555555', style='italic')

            # Arrow from branch to foreman
            ax.annotate('', xy=(fx, 0.56), xytext=(bx, 0.65),
                        arrowprops=dict(arrowstyle='->', lw=1, color='#bdc3c7'))

    # Workers at bottom
    rect = FancyBboxPatch((0.30, 0.12), 0.40, 0.08,
                           boxstyle="round,pad=0.01",
                           facecolor='#27ae60', alpha=0.85, edgecolor='white')
    ax.add_patch(rect)
    ax.text(0.5, 0.16, 'WORKERS', ha='center', va='center',
            fontsize=12, fontweight='bold', color='white')

    # Arrows from all foremen to workers
    for bx, _, _, foremen in branches:
        start_x = bx - 0.15
        spacing = 0.30 / (len(foremen) - 1) if len(foremen) > 1 else 0
        for i in range(len(foremen)):
            fx = start_x + i * spacing
            ax.annotate('', xy=(0.5, 0.20), xytext=(fx, 0.40),
                        arrowprops=dict(arrowstyle='->', lw=0.8, color='#bdc3c7'))

    # Note
    ax.text(0.5, 0.05, '⚠ Violates Fayol\'s Unity of Command — worker reports to 8 bosses',
            ha='center', va='center', fontsize=9, fontweight='bold', color='#c0392b',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#fadbd8', edgecolor='#e74c3c'))

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-principles-62.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-principles-62.png")


def diagram_taylor_techniques():
    """Visual summary of Taylor's techniques with icons/descriptions."""
    fig, ax = plt.subplots(figsize=(10, 7))
    ax.axis('off')

    ax.text(0.5, 0.96, "Taylor's Techniques of Scientific Management", fontsize=14,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    techniques = [
        ('Time Study', 'T', 'Determines standard TIME\nfor a task using stopwatch',
         '#e74c3c', 'Sets fair day\'s work'),
        ('Motion Study', 'M', 'Studies body MOVEMENTS\nto eliminate wasteful ones',
         '#3498db', 'Increases efficiency'),
        ('Fatigue Study', 'F', 'Determines REST INTERVALS\nneeded during work',
         '#f39c12', 'Reduces exhaustion'),
        ('Method Study', 'Me', 'Finds the ONE BEST WAY\nto perform a task',
         '#2ecc71', 'Minimises cost'),
        ('Standardisation', 'S', 'Sets BENCHMARKS for\nprocess, quality, materials',
         '#9b59b6', 'Ensures uniformity'),
        ('Differential Piece\nWage System', 'D', 'Higher rate for efficient,\nlower rate for inefficient',
         '#e67e22', 'Motivates workers'),
    ]

    rows, cols = 3, 2
    for i, (name, icon, desc, color, outcome) in enumerate(techniques):
        row = i // cols
        col = i % cols
        x = 0.25 + col * 0.50
        y = 0.78 - row * 0.28

        # Card background
        rect = FancyBboxPatch((x - 0.22, y - 0.10), 0.44, 0.22,
                               boxstyle="round,pad=0.02",
                               facecolor=color, alpha=0.1, edgecolor=color, linewidth=2)
        ax.add_patch(rect)

        # Icon circle
        circle = Circle((x - 0.15, y + 0.04), 0.03, facecolor=color, alpha=0.3, edgecolor=color)
        ax.add_patch(circle)
        ax.text(x - 0.15, y + 0.04, icon, ha='center', va='center',
                fontsize=12, fontweight='bold', color='white')

        # Name
        ax.text(x + 0.03, y + 0.06, name, ha='left', va='center',
                fontsize=10, fontweight='bold', color=color)

        # Description
        ax.text(x - 0.18, y - 0.04, desc, ha='left', va='center',
                fontsize=8, color='#555555')

        # Outcome arrow
        ax.text(x + 0.12, y - 0.04, '→ ' + outcome, ha='left', va='center',
                fontsize=7.5, fontweight='bold', color=color)

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-principles-63.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-principles-63.png")


if __name__ == '__main__':
    diagram_fayol_vs_taylor()
    diagram_functional_foremanship()
    diagram_taylor_techniques()
    print("All Ch2 diagrams generated.")
