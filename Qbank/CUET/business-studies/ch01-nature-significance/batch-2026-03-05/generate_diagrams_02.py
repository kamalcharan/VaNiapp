"""Generate matplotlib diagrams for Ch1 batch 2 (Q26, Q27, Q39)."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.patheffects as pe
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


def diagram_q26_management_pyramid():
    """Q26: Management hierarchy pyramid with time-allocation bars."""
    fig, ax = plt.subplots(figsize=(9, 7))

    # Pyramid shape
    levels = [
        {'y': 0.72, 'width': 0.30, 'height': 0.22, 'color': '#e74c3c',
         'label': 'TOP LEVEL\nCEO, MD, Board',
         'bars': {'Planning': 70, 'Organising': 20, 'Supervising': 10}},
        {'y': 0.42, 'width': 0.55, 'height': 0.22, 'color': '#f39c12',
         'label': 'MIDDLE LEVEL\nDept Heads, Plant Managers',
         'bars': {'Planning': 40, 'Organising': 35, 'Supervising': 25}},
        {'y': 0.12, 'width': 0.80, 'height': 0.22, 'color': '#2ecc71',
         'label': 'OPERATIONAL LEVEL\nSupervisors, Foremen',
         'bars': {'Planning': 10, 'Organising': 20, 'Supervising': 70}},
    ]

    bar_colors = {'Planning': '#3498db', 'Organising': '#9b59b6', 'Supervising': '#e67e22'}

    for lvl in levels:
        x = 0.5 - lvl['width'] / 2
        rect = mpatches.FancyBboxPatch(
            (x, lvl['y']), lvl['width'], lvl['height'],
            boxstyle="round,pad=0.01", facecolor=lvl['color'], alpha=0.25,
            edgecolor=lvl['color'], linewidth=2
        )
        ax.add_patch(rect)

        # Level label
        ax.text(0.28, lvl['y'] + lvl['height'] / 2, lvl['label'],
                fontsize=9, fontweight='bold', ha='center', va='center')

        # Mini horizontal bar chart on the right
        bar_x = 0.58
        bar_y_start = lvl['y'] + 0.04
        bar_h = 0.045
        for i, (key, val) in enumerate(lvl['bars'].items()):
            bx = bar_x
            by = bar_y_start + i * (bar_h + 0.01)
            bw = val / 100 * 0.35
            rect_bar = mpatches.FancyBboxPatch(
                (bx, by), bw, bar_h,
                boxstyle="round,pad=0.005", facecolor=bar_colors[key], alpha=0.7,
                edgecolor='none'
            )
            ax.add_patch(rect_bar)
            ax.text(bx - 0.01, by + bar_h / 2, key, fontsize=7, ha='right', va='center')
            ax.text(bx + bw + 0.01, by + bar_h / 2, f'{val}%', fontsize=7,
                    ha='left', va='center', fontweight='bold')

    ax.set_xlim(-0.05, 1.05)
    ax.set_ylim(0.0, 1.02)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Management Hierarchy — Time Allocation at Each Level',
                 fontsize=13, fontweight='bold', pad=10)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-nature-mgmt-26.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-nature-mgmt-26.png")


def diagram_q27_authority_flow():
    """Q27: Organisational hierarchy with authority & communication flow arrows."""
    fig, ax = plt.subplots(figsize=(8, 7))

    # Boxes for each level
    box_params = [
        {'x': 0.5, 'y': 0.82, 'text': 'TOP LEVEL\nCEO, Board of Directors', 'color': '#e74c3c'},
        {'x': 0.5, 'y': 0.52, 'text': 'MIDDLE LEVEL\nDepartment Heads,\nPlant Managers', 'color': '#f39c12'},
        {'x': 0.5, 'y': 0.22, 'text': 'OPERATIONAL LEVEL\nSupervisors, Foremen', 'color': '#2ecc71'},
    ]

    for bp in box_params:
        rect = mpatches.FancyBboxPatch(
            (bp['x'] - 0.18, bp['y'] - 0.06), 0.36, 0.12,
            boxstyle="round,pad=0.02", facecolor=bp['color'], alpha=0.2,
            edgecolor=bp['color'], linewidth=2
        )
        ax.add_patch(rect)
        ax.text(bp['x'], bp['y'], bp['text'], fontsize=9, fontweight='bold',
                ha='center', va='center')

    # Workers box at bottom
    rect_w = mpatches.FancyBboxPatch(
        (0.32, 0.02), 0.36, 0.08,
        boxstyle="round,pad=0.02", facecolor='#bdc3c7', alpha=0.3,
        edgecolor='#7f8c8d', linewidth=1.5
    )
    ax.add_patch(rect_w)
    ax.text(0.5, 0.06, 'WORKERS', fontsize=9, ha='center', va='center', color='#2c3e50')

    # Downward arrows (Authority flow) — left side
    for y_start, y_end in [(0.76, 0.58), (0.46, 0.28), (0.16, 0.10)]:
        ax.annotate('', xy=(0.28, y_end), xytext=(0.28, y_start),
                    arrowprops=dict(arrowstyle='->', lw=2.5, color='#c0392b'))

    # Labels for downward arrows
    ax.text(0.10, 0.67, 'Policies,\nObjectives,\nStrategies', fontsize=7.5,
            ha='center', va='center', color='#c0392b', fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.2', facecolor='#fadbd8', edgecolor='none'))
    ax.text(0.15, 0.37, 'Plans,\nInstructions', fontsize=7.5,
            ha='center', va='center', color='#c0392b',
            bbox=dict(boxstyle='round,pad=0.2', facecolor='#fadbd8', edgecolor='none'))

    # Upward arrows (Feedback flow) — right side
    for y_start, y_end in [(0.10, 0.16), (0.28, 0.46), (0.58, 0.76)]:
        ax.annotate('', xy=(0.72, y_end), xytext=(0.72, y_start),
                    arrowprops=dict(arrowstyle='->', lw=2.5, color='#27ae60'))

    # Labels for upward arrows
    ax.text(0.90, 0.67, 'Feedback,\nReports', fontsize=7.5,
            ha='center', va='center', color='#27ae60', fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.2', facecolor='#d5f5e3', edgecolor='none'))
    ax.text(0.88, 0.37, 'Grievances,\nSuggestions', fontsize=7.5,
            ha='center', va='center', color='#27ae60',
            bbox=dict(boxstyle='round,pad=0.2', facecolor='#d5f5e3', edgecolor='none'))

    # Side note: Middle as link
    ax.text(0.5, 0.44, 'Middle Level = LINK between Top & Operational',
            fontsize=8, ha='center', va='center', style='italic',
            color='#8e44ad', fontweight='bold')

    # Legend
    ax.plot([0.05], [0.97], 'v', color='#c0392b', markersize=10)
    ax.text(0.08, 0.97, 'Authority Flow (Downward)', fontsize=8, va='center', color='#c0392b')
    ax.plot([0.55], [0.97], '^', color='#27ae60', markersize=10)
    ax.text(0.58, 0.97, 'Feedback Flow (Upward)', fontsize=8, va='center', color='#27ae60')

    ax.set_xlim(-0.02, 1.02)
    ax.set_ylim(-0.02, 1.02)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Authority & Communication Flow in Management Hierarchy',
                 fontsize=12, fontweight='bold', pad=5)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-nature-mgmt-27.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-nature-mgmt-27.png")


def diagram_q39_posdc_cycle():
    """Q39: Circular POSDC cycle with feedback loop."""
    fig, ax = plt.subplots(figsize=(8, 8))

    # 5 functions in a circle
    n = 5
    labels = ['Planning\n(Y)', 'Organising', 'Staffing', 'Directing', 'Controlling\n(X)']
    colors = ['#3498db', '#9b59b6', '#e67e22', '#e74c3c', '#2ecc71']
    angles = [90, 90 - 72, 90 - 144, 90 - 216, 90 - 288]  # start from top
    radius = 0.32

    positions = []
    for angle in angles:
        rad = np.radians(angle)
        x = 0.5 + radius * np.cos(rad)
        y = 0.5 + radius * np.sin(rad)
        positions.append((x, y))

    # Draw boxes
    box_w, box_h = 0.18, 0.09
    for i, ((x, y), label, color) in enumerate(zip(positions, labels, colors)):
        highlight = (i == 0 or i == 4)
        lw = 3 if highlight else 2
        rect = mpatches.FancyBboxPatch(
            (x - box_w/2, y - box_h/2), box_w, box_h,
            boxstyle="round,pad=0.015", facecolor=color, alpha=0.25 if not highlight else 0.4,
            edgecolor=color, linewidth=lw
        )
        ax.add_patch(rect)
        fs = 9.5 if highlight else 9
        fw = 'bold'
        ax.text(x, y, label, fontsize=fs, fontweight=fw, ha='center', va='center')

    # Arrows between consecutive boxes
    for i in range(n):
        j = (i + 1) % n
        x1, y1 = positions[i]
        x2, y2 = positions[j]
        # Shorten arrow to not overlap boxes
        dx = x2 - x1
        dy = y2 - y1
        dist = np.sqrt(dx**2 + dy**2)
        shrink = 0.10
        sx = x1 + dx * shrink / dist * 1.2
        sy = y1 + dy * shrink / dist * 1.2
        ex = x2 - dx * shrink / dist * 1.2
        ey = y2 - dy * shrink / dist * 1.2

        if i == 4:  # Controlling → Planning = feedback loop
            ax.annotate('', xy=(ex, ey), xytext=(sx, sy),
                        arrowprops=dict(arrowstyle='->', lw=3,
                                        color='#e74c3c', linestyle='dashed',
                                        connectionstyle='arc3,rad=0.3'))
            # Label the feedback arrow
            mid_x = (sx + ex) / 2 + 0.12
            mid_y = (sy + ey) / 2 + 0.05
            ax.text(mid_x, mid_y, 'Feedback\nLoop', fontsize=9, fontweight='bold',
                    color='#e74c3c', ha='center', va='center',
                    bbox=dict(boxstyle='round,pad=0.2', facecolor='#fadbd8', edgecolor='#e74c3c'))
        else:
            ax.annotate('', xy=(ex, ey), xytext=(sx, sy),
                        arrowprops=dict(arrowstyle='->', lw=2, color='#2c3e50'))

    # Center label
    ax.text(0.5, 0.5, 'MANAGEMENT\nFUNCTIONS\nCYCLE', fontsize=10, fontweight='bold',
            ha='center', va='center', color='#2c3e50',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#fef9e7', edgecolor='#f1c40f', linewidth=1.5))

    ax.set_xlim(0.0, 1.0)
    ax.set_ylim(0.05, 0.95)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('POSDC Cycle — Management Functions', fontsize=13, fontweight='bold', pad=10)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-nature-mgmt-39.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-nature-mgmt-39.png")


if __name__ == '__main__':
    diagram_q26_management_pyramid()
    diagram_q27_authority_flow()
    diagram_q39_posdc_cycle()
    print("All diagrams for batch 02 generated.")
