"""Generate matplotlib diagrams for Ch10 Financial Markets."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


def diagram_financial_market_structure():
    """Tree diagram: Indian Financial Market structure."""
    fig, ax = plt.subplots(figsize=(12, 10))
    ax.axis('off')

    ax.text(0.5, 0.97, 'Structure of the Indian Financial Market', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    # Root
    root_rect = FancyBboxPatch((0.30, 0.82), 0.40, 0.08,
                                boxstyle="round,pad=0.015",
                                facecolor='#2c3e50', alpha=0.9, edgecolor='white', linewidth=2)
    ax.add_patch(root_rect)
    ax.text(0.5, 0.86, 'Indian Financial Market', ha='center', va='center',
            fontsize=13, fontweight='bold', color='white')

    # Two branches
    branches = [
        (0.22, 0.68, 'Money Market', 'Short-term (up to 1 year)', '#e74c3c'),
        (0.78, 0.68, 'Capital Market', 'Long-term (more than 1 year)', '#3498db'),
    ]

    for x, y, title, desc, color in branches:
        rect = FancyBboxPatch((x - 0.14, y - 0.04), 0.28, 0.08,
                               boxstyle="round,pad=0.012",
                               facecolor=color, alpha=0.20, edgecolor=color, linewidth=2.5)
        ax.add_patch(rect)
        ax.text(x, y + 0.01, title, ha='center', va='center',
                fontsize=11, fontweight='bold', color=color)
        ax.text(x, y - 0.02, desc, ha='center', va='center',
                fontsize=7.5, color='#666666')

    # Lines from root to branches
    ax.plot([0.5, 0.22], [0.82, 0.72], color='#bdc3c7', linewidth=2)
    ax.plot([0.5, 0.78], [0.82, 0.72], color='#bdc3c7', linewidth=2)

    # Money Market instruments
    mm_items = [
        (0.07, 0.50, 'Treasury\nBills'),
        (0.19, 0.50, 'Commercial\nPaper'),
        (0.31, 0.50, 'Call\nMoney'),
        (0.43, 0.50, 'Certificate\nof Deposit'),
    ]

    for x, y, label in mm_items:
        rect = FancyBboxPatch((x - 0.055, y - 0.035), 0.11, 0.07,
                               boxstyle="round,pad=0.008",
                               facecolor='#e74c3c', alpha=0.12, edgecolor='#e74c3c', linewidth=1.5)
        ax.add_patch(rect)
        ax.text(x, y, label, ha='center', va='center',
                fontsize=7.5, fontweight='bold', color='#c0392b')
        ax.plot([0.22, x], [0.64, y + 0.035], color='#e74c3c', linewidth=1, alpha=0.4)

    # Capital Market sub-branches
    cm_branches = [
        (0.65, 0.52, 'Primary Market', '(New Issues / IPO)', '#2980b9'),
        (0.91, 0.52, 'Secondary Market', '(Stock Exchange)', '#2980b9'),
    ]

    for x, y, title, desc, color in cm_branches:
        rect = FancyBboxPatch((x - 0.10, y - 0.035), 0.20, 0.07,
                               boxstyle="round,pad=0.010",
                               facecolor=color, alpha=0.15, edgecolor=color, linewidth=2)
        ax.add_patch(rect)
        ax.text(x, y + 0.01, title, ha='center', va='center',
                fontsize=9, fontweight='bold', color=color)
        ax.text(x, y - 0.018, desc, ha='center', va='center',
                fontsize=7, color='#666666')
        ax.plot([0.78, x], [0.64, y + 0.035], color='#3498db', linewidth=1.5, alpha=0.4)

    ax.set_xlim(-0.02, 1.02)
    ax.set_ylim(0.35, 1.0)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-financial-markets-61.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-financial-markets-61.png")


def diagram_money_market_instruments():
    """Comparison table: Money Market instruments."""
    fig, ax = plt.subplots(figsize=(12, 7))
    ax.axis('off')

    ax.text(0.5, 0.97, 'Money Market Instruments — Comparison', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    headers = ['Instrument', 'Issuer', 'Maturity', 'Min. Amount']
    rows = [
        ['Treasury Bills', 'RBI (on behalf of Govt)', '14 / 91 / 182 / 364 days', 'Rs 25,000'],
        ['Commercial Paper', 'Large corporates', '15 days to 1 year', 'Rs 5 lakh'],
        ['Call Money', 'Banks (inter-bank)', '1 day to 15 days', 'No fixed minimum'],
        ['Certificate of Deposit', 'Banks / FIs', '91 days to 1 year', 'Rs 1 lakh'],
    ]

    row_colors = ['#e74c3c', '#e67e22', '#27ae60', '#3498db']
    col_x = [0.14, 0.38, 0.62, 0.86]
    col_w = [0.22, 0.22, 0.22, 0.22]
    cell_h = 0.10
    table_top = 0.82

    # Header row
    for j, header in enumerate(headers):
        rect = FancyBboxPatch((col_x[j] - col_w[j]/2, table_top - cell_h/2), col_w[j], cell_h,
                               boxstyle="round,pad=0.006",
                               facecolor='#2c3e50', alpha=0.9, edgecolor='white', linewidth=1)
        ax.add_patch(rect)
        ax.text(col_x[j], table_top, header, ha='center', va='center',
                fontsize=10, fontweight='bold', color='white')

    # Data rows
    for i, (row, color) in enumerate(zip(rows, row_colors)):
        y = table_top - (i + 1) * cell_h
        for j, cell in enumerate(row):
            bg = color if j == 0 else '#f8f9fa' if i % 2 == 0 else '#ffffff'
            alpha = 0.18 if j == 0 else 0.9
            rect = FancyBboxPatch((col_x[j] - col_w[j]/2, y - cell_h/2), col_w[j], cell_h,
                                   boxstyle="round,pad=0.004",
                                   facecolor=bg, alpha=alpha,
                                   edgecolor='#ddd', linewidth=1)
            ax.add_patch(rect)

            text_color = color if j == 0 else '#2c3e50'
            weight = 'bold' if j == 0 else 'normal'
            ax.text(col_x[j], y, cell, ha='center', va='center',
                    fontsize=9, fontweight=weight, color=text_color)

    ax.set_xlim(-0.02, 1.02)
    ax.set_ylim(0.25, 1.0)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-financial-markets-62.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-financial-markets-62.png")


def diagram_trading_procedure():
    """Vertical flowchart: Trading procedure on stock exchange."""
    fig, ax = plt.subplots(figsize=(10, 12))
    ax.axis('off')

    ax.text(0.5, 0.98, 'Trading Procedure on a Stock Exchange', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    steps = [
        ('Step 1', 'Open Demat + Trading\nAccount with broker', '#e74c3c'),
        ('Step 2', 'Place buy/sell order\nthrough broker', '#e67e22'),
        ('Step 3', 'Broker matches buy\n& sell orders on exchange', '#f1c40f'),
        ('Step 4', 'Trade confirmation\nsent to both parties', '#2ecc71'),
        ('Step 5', 'Settlement: Clearing house\nsettles trades (T+2 days)', '#3498db'),
        ('Step 6', 'Shares credited to buyer\'s\nDemat a/c, money debited', '#9b59b6'),
    ]

    n = len(steps)
    y_start = 0.90
    y_step = 0.13
    box_w = 0.40
    box_h = 0.08

    for i, (step_label, desc, color) in enumerate(steps):
        y = y_start - i * y_step

        rect = FancyBboxPatch((0.5 - box_w/2, y - box_h/2), box_w, box_h,
                               boxstyle="round,pad=0.015",
                               facecolor=color, alpha=0.18, edgecolor=color, linewidth=2.5)
        ax.add_patch(rect)

        ax.text(0.5 - box_w/2 + 0.02, y, step_label, ha='left', va='center',
                fontsize=9, fontweight='bold', color=color)
        ax.text(0.5 + 0.02, y, desc, ha='center', va='center',
                fontsize=9, color='#2c3e50')

        if i < n - 1:
            ax.annotate('', xy=(0.5, y - box_h/2 - 0.04),
                        xytext=(0.5, y - box_h/2 - 0.005),
                        arrowprops=dict(arrowstyle='->', lw=2.5, color='#bdc3c7'))

    ax.set_xlim(0.0, 1.0)
    ax.set_ylim(0.1, 1.0)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-financial-markets-63.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-financial-markets-63.png")


if __name__ == '__main__':
    diagram_financial_market_structure()
    diagram_money_market_instruments()
    diagram_trading_procedure()
    print("All Ch10 Financial Markets diagrams generated.")
