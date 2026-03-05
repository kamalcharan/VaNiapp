"""Generate matplotlib diagrams for Ch3 Business Environment."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Circle
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


def diagram_five_dimensions():
    """Radial diagram showing 5 dimensions of business environment."""
    fig, ax = plt.subplots(figsize=(9, 9))
    ax.axis('off')

    ax.text(0.5, 0.97, 'Five Dimensions of Business Environment', fontsize=15,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    # Center circle — Business
    center = Circle((0.5, 0.50), 0.10, facecolor='#2c3e50', alpha=0.9, edgecolor='white', linewidth=2)
    ax.add_patch(center)
    ax.text(0.5, 0.50, 'BUSINESS\nENTERPRISE', ha='center', va='center',
            fontsize=10, fontweight='bold', color='white')

    # 5 dimensions around center
    dimensions = [
        ('Economic', '#e74c3c', 90,
         ['Interest rates', 'Inflation / GDP', 'Per capita income', 'Fiscal & monetary policy']),
        ('Social', '#3498db', 162,
         ['Demographics', 'Culture & values', 'Consumer attitudes', 'Health consciousness']),
        ('Technological', '#2ecc71', 234,
         ['R&D / Innovation', 'Digital payments', 'Automation / AI', 'E-commerce']),
        ('Political', '#f39c12', 306,
         ['Political stability', 'Govt ideology', 'Trade policy', 'Defence policy']),
        ('Legal', '#9b59b6', 18,
         ['Companies Act', 'GST / Tax laws', 'Consumer Protection', 'Environmental laws']),
    ]

    radius = 0.32
    for name, color, angle_deg, examples in dimensions:
        angle = np.radians(angle_deg)
        x = 0.5 + radius * np.cos(angle)
        y = 0.50 + radius * np.sin(angle)

        # Dimension circle
        dim_circle = Circle((x, y), 0.08, facecolor=color, alpha=0.2, edgecolor=color, linewidth=2.5)
        ax.add_patch(dim_circle)
        ax.text(x, y + 0.02, name.upper(), ha='center', va='center',
                fontsize=9, fontweight='bold', color=color)

        # Arrow from center to dimension
        ax.annotate('', xy=(x - 0.06 * np.cos(angle), y - 0.06 * np.sin(angle)),
                    xytext=(0.5 + 0.10 * np.cos(angle), 0.50 + 0.10 * np.sin(angle)),
                    arrowprops=dict(arrowstyle='<->', lw=1.5, color=color, alpha=0.6))

        # Examples list
        ex_x = 0.5 + (radius + 0.18) * np.cos(angle)
        ex_y = 0.50 + (radius + 0.18) * np.sin(angle)

        example_text = '\n'.join(['- ' + e for e in examples])
        ax.text(ex_x, ex_y, example_text, ha='center', va='center',
                fontsize=7.5, color='#555555',
                bbox=dict(boxstyle='round,pad=0.3', facecolor=color, alpha=0.08,
                          edgecolor=color, linewidth=0.8))

    # Note at bottom
    ax.text(0.5, 0.04, 'All 5 dimensions are INTER-RELATED - a change in one affects others',
            ha='center', va='center', fontsize=9, fontweight='bold', color='#7f8c8d',
            style='italic')

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.set_aspect('equal')

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-environment-61.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-environment-61.png")


def diagram_lpg_pillars():
    """Three-pillar diagram of LPG reforms."""
    fig, ax = plt.subplots(figsize=(10, 7))
    ax.axis('off')

    ax.text(0.5, 0.96, 'New Economic Policy 1991: Three Pillars (LPG)', fontsize=14,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    # Base
    rect = FancyBboxPatch((0.10, 0.08), 0.80, 0.06,
                           boxstyle="round,pad=0.01",
                           facecolor='#34495e', alpha=0.9, edgecolor='white')
    ax.add_patch(rect)
    ax.text(0.5, 0.11, 'NEW ECONOMIC POLICY 1991 (Balance of Payments Crisis)', ha='center', va='center',
            fontsize=10, fontweight='bold', color='white')

    # Three pillars
    pillars = [
        ('LIBERALISATION', '#e74c3c', 0.20,
         ['Abolition of Licence Raj', 'De-regulation of industries',
          'Freedom to import technology', 'Reduced import duties',
          'Increased FDI limits']),
        ('PRIVATISATION', '#2980b9', 0.50,
         ['Disinvestment of PSUs', 'Private sector entry in\nreserved sectors',
          'Sale of govt equity', 'Reduced public sector role',
          'E.g. Air India to Tata']),
        ('GLOBALISATION', '#27ae60', 0.80,
         ['Integration with\nworld economy', 'Free flow of trade\nand investment',
          'Reduced tariff barriers', 'MNC entry into India',
          'Indian companies\ngo global']),
    ]

    for name, color, cx, features in pillars:
        # Pillar rectangle
        rect = FancyBboxPatch((cx - 0.12, 0.14), 0.24, 0.55,
                               boxstyle="round,pad=0.01",
                               facecolor=color, alpha=0.12, edgecolor=color, linewidth=2.5)
        ax.add_patch(rect)

        # Pillar header
        header_rect = FancyBboxPatch((cx - 0.12, 0.62), 0.24, 0.07,
                                      boxstyle="round,pad=0.01",
                                      facecolor=color, alpha=0.9, edgecolor='white')
        ax.add_patch(header_rect)
        ax.text(cx, 0.655, name, ha='center', va='center',
                fontsize=10, fontweight='bold', color='white')

        # Features
        y_start = 0.57
        for i, feature in enumerate(features):
            y = y_start - i * 0.085
            ax.text(cx, y, feature, ha='center', va='center',
                    fontsize=8, color='#34495e')
            if i < len(features) - 1:
                ax.axhline(y=y - 0.04, xmin=cx - 0.10, xmax=cx + 0.10,
                           color='#bdc3c7', linewidth=0.5, linestyle=':')

    # Top result
    rect = FancyBboxPatch((0.15, 0.78), 0.70, 0.06,
                           boxstyle="round,pad=0.01",
                           facecolor='#f39c12', alpha=0.85, edgecolor='white')
    ax.add_patch(rect)
    ax.text(0.5, 0.81, 'RESULT: Increased competition, consumer choice, efficiency & growth',
            ha='center', va='center', fontsize=9, fontweight='bold', color='white')

    # Arrows from pillars to result
    for cx in [0.20, 0.50, 0.80]:
        ax.annotate('', xy=(cx, 0.78), xytext=(cx, 0.69),
                    arrowprops=dict(arrowstyle='->', lw=1.5, color='#7f8c8d'))

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-environment-62.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-environment-62.png")


def diagram_demonetisation_impact():
    """Flowchart showing impacts of demonetisation."""
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.axis('off')

    ax.text(0.5, 0.97, 'Demonetisation (8 Nov 2016): Impact on Business', fontsize=14,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    # Central event box
    rect = FancyBboxPatch((0.25, 0.82), 0.50, 0.08,
                           boxstyle="round,pad=0.01",
                           facecolor='#c0392b', alpha=0.9, edgecolor='white')
    ax.add_patch(rect)
    ax.text(0.5, 0.86, 'Rs 500 & Rs 1000 notes demonetised', ha='center', va='center',
            fontsize=11, fontweight='bold', color='white')

    # Two branches: Negative (left) and Positive (right)
    branches = [
        (0.22, 'SHORT-TERM\nNEGATIVE', '#e74c3c',
         ['Cash shortage in economy',
          'Informal sector badly hit',
          'Small businesses suffered',
          'Agricultural distress\n(cash-dependent)',
          'GDP growth slowed\ntemporarily']),
        (0.78, 'POSITIVE\nIMPACTS', '#27ae60',
         ['Massive growth of\ndigital payments (UPI)',
          'Increased bank deposits',
          'Tax base widened',
          'Counterfeit currency\nreduced',
          'Shift towards formal\neconomy']),
    ]

    for cx, title, color, impacts in branches:
        # Branch header
        rect = FancyBboxPatch((cx - 0.15, 0.68), 0.30, 0.08,
                               boxstyle="round,pad=0.01",
                               facecolor=color, alpha=0.85, edgecolor='white')
        ax.add_patch(rect)
        ax.text(cx, 0.72, title, ha='center', va='center',
                fontsize=9, fontweight='bold', color='white')

        # Arrow from center to branch
        ax.annotate('', xy=(cx, 0.76), xytext=(0.5, 0.82),
                    arrowprops=dict(arrowstyle='->', lw=2, color=color))

        # Impact items
        y = 0.62
        for impact in impacts:
            rect = FancyBboxPatch((cx - 0.16, y - 0.03), 0.32, 0.07,
                                   boxstyle="round,pad=0.008",
                                   facecolor=color, alpha=0.08, edgecolor=color, linewidth=1)
            ax.add_patch(rect)
            ax.text(cx, y, impact, ha='center', va='center',
                    fontsize=7.5, color='#34495e')
            y -= 0.095

    # Bottom note
    ax.text(0.5, 0.08, 'KEY LESSON: Same environmental change can be a THREAT\n'
            'for one business and an OPPORTUNITY for another',
            ha='center', va='center', fontsize=9, fontweight='bold', color='#8e44ad',
            bbox=dict(boxstyle='round,pad=0.4', facecolor='#f4ecf7', edgecolor='#8e44ad'))

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-environment-63.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-environment-63.png")


if __name__ == '__main__':
    diagram_five_dimensions()
    diagram_lpg_pillars()
    diagram_demonetisation_impact()
    print("All Ch3 diagrams generated.")
