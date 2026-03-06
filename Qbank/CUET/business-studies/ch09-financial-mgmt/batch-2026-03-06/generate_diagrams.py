"""Generate matplotlib diagrams for Ch9 Financial Management."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Circle, FancyArrowPatch
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


def diagram_operating_cycle():
    """Circular flowchart: Operating Cycle of a manufacturing company."""
    fig, ax = plt.subplots(figsize=(10, 10))
    ax.axis('off')

    ax.text(0.5, 0.97, 'Operating Cycle of a Manufacturing Company', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    # Centre label
    ax.text(0.5, 0.50, 'Operating\nCycle', ha='center', va='center',
            fontsize=14, fontweight='bold', color='#7f8c8d', alpha=0.6)
    ax.text(0.5, 0.43, 'Longer cycle =\nMore working capital', ha='center', va='center',
            fontsize=8, color='#95a5a6', style='italic')

    stages = [
        ('Cash', '#27ae60'),
        ('Raw\nMaterials', '#e67e22'),
        ('Work-in-\nProgress', '#3498db'),
        ('Finished\nGoods', '#9b59b6'),
        ('Debtors /\nReceivables', '#e74c3c'),
        ('Cash', '#27ae60'),
    ]

    n = 6
    radius = 0.30
    angles = [90 - i * (360 / n) for i in range(n)]

    positions = []
    for i, angle in enumerate(angles):
        rad = np.radians(angle)
        x = 0.5 + radius * np.cos(rad)
        y = 0.50 + radius * np.sin(rad)
        positions.append((x, y))

    box_w = 0.14
    box_h = 0.10

    for i, ((x, y), (label, color)) in enumerate(zip(positions, stages)):
        rect = FancyBboxPatch((x - box_w/2, y - box_h/2), box_w, box_h,
                               boxstyle="round,pad=0.015",
                               facecolor=color, alpha=0.20, edgecolor=color, linewidth=2.5)
        ax.add_patch(rect)

        ax.text(x, y, label, ha='center', va='center',
                fontsize=9, fontweight='bold', color=color)

        ax.text(x, y + box_h/2 + 0.025, f'Stage {i+1}', ha='center', va='center',
                fontsize=7, color='#999999')

    # Draw arrows between stages
    for i in range(n - 1):
        x1, y1 = positions[i]
        x2, y2 = positions[i + 1]
        dx = x2 - x1
        dy = y2 - y1
        dist = np.sqrt(dx**2 + dy**2)
        # Shorten arrow
        sx = x1 + 0.08 * dx / dist
        sy = y1 + 0.08 * dy / dist
        ex = x2 - 0.08 * dx / dist
        ey = y2 - 0.08 * dy / dist
        ax.annotate('', xy=(ex, ey), xytext=(sx, sy),
                    arrowprops=dict(arrowstyle='->', lw=2.5, color='#bdc3c7'))

    ax.set_xlim(0.0, 1.0)
    ax.set_ylim(0.05, 1.0)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-financial-mgmt-66.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-financial-mgmt-66.png")


def diagram_capital_structure_pies():
    """Two pie charts comparing capital structure of Company X and Y."""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))

    fig.suptitle('Capital Structure Comparison', fontsize=16,
                 fontweight='bold', color='#2c3e50', y=0.98)

    colors = ['#3498db', '#e74c3c']
    explode = (0.03, 0.03)

    # Company X
    ax1.pie([70, 30], labels=['Equity\n70%', 'Debt\n30%'], colors=colors,
            explode=explode, autopct='', startangle=90, textprops={'fontsize': 12, 'fontweight': 'bold'},
            wedgeprops=dict(alpha=0.8, edgecolor='white', linewidth=2))
    ax1.set_title('Company X', fontsize=14, fontweight='bold', color='#2c3e50', pad=10)
    ax1.text(0, -1.35, 'Low Leverage\nLower Financial Risk', ha='center', va='center',
             fontsize=10, color='#27ae60', fontweight='bold')

    # Company Y
    ax2.pie([30, 70], labels=['Equity\n30%', 'Debt\n70%'], colors=colors,
            explode=explode, autopct='', startangle=90, textprops={'fontsize': 12, 'fontweight': 'bold'},
            wedgeprops=dict(alpha=0.8, edgecolor='white', linewidth=2))
    ax2.set_title('Company Y', fontsize=14, fontweight='bold', color='#2c3e50', pad=10)
    ax2.text(0, -1.35, 'High Leverage\nHigher Financial Risk', ha='center', va='center',
             fontsize=10, color='#e74c3c', fontweight='bold')

    fig.text(0.5, 0.02, 'ROI = 15%,  Cost of Debt = 10%  for both companies',
             ha='center', va='center', fontsize=11, color='#7f8c8d', style='italic')

    # Legend
    legend_elements = [
        mpatches.Patch(facecolor='#3498db', alpha=0.8, label='Equity (Owners\' Funds)'),
        mpatches.Patch(facecolor='#e74c3c', alpha=0.8, label='Debt (Borrowed Funds)'),
    ]
    fig.legend(handles=legend_elements, loc='lower center', ncol=2,
               fontsize=10, bbox_to_anchor=(0.5, 0.08), frameon=False)

    fig.tight_layout(rect=[0, 0.15, 1, 0.95])
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-financial-mgmt-67.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-financial-mgmt-67.png")


def diagram_trading_on_equity_table():
    """Table: Trading on Equity comparison of two plans."""
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.axis('off')

    ax.text(0.5, 0.97, 'Trading on Equity — Two Financing Plans', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    headers = ['', 'Plan A\n(100% Equity)', 'Plan B\n(50% Equity + 50% Debt)']
    rows = [
        ['Total Capital',   'Rs 20,00,000',    'Rs 20,00,000'],
        ['Equity',           'Rs 20,00,000',    'Rs 10,00,000'],
        ['Debt (@ 10%)',     'Nil',              'Rs 10,00,000'],
        ['EBIT',             'Rs 4,00,000',      'Rs 4,00,000'],
        ['Less: Interest',   'Nil',              'Rs 1,00,000'],
        ['EBT',              'Rs 4,00,000',      'Rs 3,00,000'],
        ['Less: Tax (30%)',  'Rs 1,20,000',      'Rs 90,000'],
        ['PAT',              'Rs 2,80,000',      'Rs 2,10,000'],
        ['ROE (PAT/Equity)', '14%',              '?'],
    ]

    n_rows = len(rows) + 1  # +1 for header
    n_cols = 3
    cell_h = 0.065
    table_top = 0.88
    col_x = [0.10, 0.40, 0.72]
    col_w = [0.25, 0.28, 0.32]

    # Draw header
    for j, header in enumerate(headers):
        x = col_x[j]
        y = table_top
        rect = FancyBboxPatch((x - col_w[j]/2, y - cell_h/2), col_w[j], cell_h,
                               boxstyle="round,pad=0.005",
                               facecolor='#2c3e50', alpha=0.9, edgecolor='white', linewidth=1)
        ax.add_patch(rect)
        ax.text(x, y, header, ha='center', va='center',
                fontsize=9, fontweight='bold', color='white')

    # Draw rows
    for i, row in enumerate(rows):
        y = table_top - (i + 1) * cell_h
        is_result_row = (i == len(rows) - 1)  # ROE row
        is_pat_row = (i == len(rows) - 2)

        for j, cell in enumerate(row):
            x = col_x[j]
            is_hidden = (j == 2 and is_result_row)  # The ? cell

            if j == 0:
                bg = '#ecf0f1' if i % 2 == 0 else '#f8f9fa'
            elif is_result_row:
                bg = '#e8f8f5' if not is_hidden else '#fdebd0'
            elif is_pat_row:
                bg = '#eaf2f8'
            else:
                bg = '#f0f4f8' if i % 2 == 0 else '#ffffff'

            rect = FancyBboxPatch((x - col_w[j]/2, y - cell_h/2), col_w[j], cell_h,
                                   boxstyle="round,pad=0.003",
                                   facecolor=bg, alpha=0.9,
                                   edgecolor='#bdc3c7', linewidth=1)
            ax.add_patch(rect)

            if is_hidden:
                ax.text(x, y, '?', ha='center', va='center',
                        fontsize=18, fontweight='bold', color='#e74c3c')
            else:
                color = '#2c3e50'
                weight = 'bold' if j == 0 or is_result_row or is_pat_row else 'normal'
                if is_result_row and j == 1:
                    color = '#27ae60'
                    weight = 'bold'
                ax.text(x, y, cell, ha='center', va='center',
                        fontsize=9, fontweight=weight, color=color)

    # Bottom note
    ax.text(0.5, 0.08, 'Note: Higher debt → Lower absolute PAT but Higher ROE (%) when ROI > Cost of Debt',
            ha='center', va='center', fontsize=9, color='#7f8c8d', style='italic')

    ax.set_xlim(-0.05, 1.05)
    ax.set_ylim(0.0, 1.0)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-financial-mgmt-68.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-financial-mgmt-68.png")


if __name__ == '__main__':
    diagram_operating_cycle()
    diagram_capital_structure_pies()
    diagram_trading_on_equity_table()
    print("All Ch9 Financial Management diagrams generated.")
