"""Generate matplotlib diagrams for Ch11 Marketing."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Circle
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


def diagram_marketing_mix():
    """Hub-and-spoke: 4 Ps of Marketing Mix."""
    fig, ax = plt.subplots(figsize=(10, 10))
    ax.axis('off')

    ax.text(0.5, 0.97, 'Marketing Mix — The 4 Ps', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    # Centre hub
    centre = Circle((0.5, 0.50), 0.11, facecolor='#2c3e50', alpha=0.9,
                     edgecolor='white', linewidth=2)
    ax.add_patch(centre)
    ax.text(0.5, 0.51, 'MARKETING', ha='center', va='center',
            fontsize=12, fontweight='bold', color='white')
    ax.text(0.5, 0.47, 'MIX', ha='center', va='center',
            fontsize=12, fontweight='bold', color='white')

    elements = [
        (0.5, 0.87, 'Product', 'Branding, Packaging,\nLabelling', '#e74c3c'),
        (0.87, 0.50, 'Price', 'Pricing strategies,\nFactors affecting price', '#3498db'),
        (0.5, 0.13, 'Place', 'Channels of distribution,\nPhysical distribution', '#2ecc71'),
        (0.13, 0.50, 'Promotion', 'Advertising, Personal selling,\nSales promotion, Publicity', '#9b59b6'),
    ]

    for x, y, title, desc, color in elements:
        rect = FancyBboxPatch((x - 0.13, y - 0.08), 0.26, 0.16,
                               boxstyle="round,pad=0.015",
                               facecolor=color, alpha=0.15, edgecolor=color, linewidth=2.5)
        ax.add_patch(rect)

        ax.text(x, y + 0.025, title, ha='center', va='center',
                fontsize=12, fontweight='bold', color=color)
        ax.text(x, y - 0.035, desc, ha='center', va='center',
                fontsize=7.5, color='#555555')

        # Line from centre to element
        dx = x - 0.5
        dy = y - 0.50
        dist = np.sqrt(dx**2 + dy**2)
        sx = 0.5 + 0.11 * dx / dist
        sy = 0.50 + 0.11 * dy / dist
        ax.plot([sx, x], [sy, y], color=color, linewidth=2.5, alpha=0.5)

    ax.set_xlim(-0.05, 1.05)
    ax.set_ylim(-0.05, 1.05)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-marketing-61.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-marketing-61.png")


def diagram_channels_of_distribution():
    """Horizontal flowcharts: 4 channels of distribution."""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.axis('off')

    ax.text(0.5, 0.97, 'Channels of Distribution', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    channels = [
        ('Channel A\n(Zero-level)', ['Manufacturer', 'Consumer'], '#27ae60'),
        ('Channel B\n(One-level)', ['Manufacturer', 'Retailer', 'Consumer'], '#3498db'),
        ('Channel C\n(Two-level)', ['Manufacturer', 'Wholesaler', 'Retailer', 'Consumer'], '#e67e22'),
        ('Channel D\n(Three-level)', ['Manufacturer', 'Agent', 'Wholesaler', 'Retailer', 'Consumer'], '#e74c3c'),
    ]

    n_channels = len(channels)
    y_start = 0.82
    y_step = 0.20
    box_w = 0.12
    box_h = 0.08

    for i, (label, steps, color) in enumerate(channels):
        y = y_start - i * y_step

        # Channel label on left
        ax.text(0.06, y, label, ha='center', va='center',
                fontsize=9, fontweight='bold', color=color)

        n_steps = len(steps)
        # Distribute boxes from x=0.18 to x=0.95
        total_width = 0.77
        if n_steps > 1:
            x_positions = [0.18 + j * total_width / (n_steps - 1) for j in range(n_steps)]
        else:
            x_positions = [0.55]

        for j, (x, step_label) in enumerate(zip(x_positions, steps)):
            rect = FancyBboxPatch((x - box_w/2, y - box_h/2), box_w, box_h,
                                   boxstyle="round,pad=0.012",
                                   facecolor=color, alpha=0.18, edgecolor=color, linewidth=2)
            ax.add_patch(rect)

            ax.text(x, y, step_label, ha='center', va='center',
                    fontsize=8.5, fontweight='bold', color=color)

            # Arrow to next box
            if j < n_steps - 1:
                next_x = x_positions[j + 1]
                ax.annotate('', xy=(next_x - box_w/2 - 0.005, y),
                            xytext=(x + box_w/2 + 0.005, y),
                            arrowprops=dict(arrowstyle='->', lw=2, color='#bdc3c7'))

        # Intermediaries count
        intermediaries = n_steps - 2  # exclude manufacturer and consumer
        label_text = f'{intermediaries} intermediar{"y" if intermediaries == 1 else "ies"}'
        if intermediaries == 0:
            label_text = 'Direct (no intermediary)'
        ax.text(0.95, y - box_h/2 - 0.025, label_text, ha='right', va='center',
                fontsize=7, color='#999999', style='italic')

    ax.set_xlim(-0.02, 1.02)
    ax.set_ylim(0.0, 1.0)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-marketing-62.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-marketing-62.png")


def diagram_product_label():
    """Annotated product label showing mandatory vs optional info."""
    fig, ax = plt.subplots(figsize=(10, 10))
    ax.axis('off')

    ax.text(0.5, 0.97, 'Product Labelling — Mandatory vs Optional', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    # Main label box
    label_rect = FancyBboxPatch((0.15, 0.18), 0.70, 0.70,
                                 boxstyle="round,pad=0.02",
                                 facecolor='#fdfefe', edgecolor='#2c3e50', linewidth=3)
    ax.add_patch(label_rect)

    # Mandatory items (green)
    mandatory = [
        (0.50, 0.82, 'Brand Name', '#27ae60'),
        (0.30, 0.72, 'Net Weight / Quantity', '#27ae60'),
        (0.70, 0.72, 'MRP (Max Retail Price)', '#27ae60'),
        (0.30, 0.62, 'Date of Manufacture', '#27ae60'),
        (0.70, 0.62, 'Expiry / Best Before', '#27ae60'),
        (0.50, 0.52, 'Ingredients / Composition', '#27ae60'),
        (0.30, 0.42, 'Manufacturer\'s Name\n& Address', '#27ae60'),
        (0.70, 0.42, 'Batch / Lot Number', '#27ae60'),
        (0.30, 0.32, 'FSSAI License No.', '#27ae60'),
        (0.70, 0.32, 'Bar Code', '#27ae60'),
    ]

    for x, y, text, color in mandatory:
        rect = FancyBboxPatch((x - 0.12, y - 0.03), 0.24, 0.06,
                               boxstyle="round,pad=0.008",
                               facecolor=color, alpha=0.12, edgecolor=color, linewidth=1.5)
        ax.add_patch(rect)
        ax.text(x, y, text, ha='center', va='center',
                fontsize=8, fontweight='bold', color=color)

    # Optional item (yellow/orange)
    opt_x, opt_y = 0.50, 0.22
    opt_rect = FancyBboxPatch((opt_x - 0.14, opt_y - 0.03), 0.28, 0.06,
                               boxstyle="round,pad=0.008",
                               facecolor='#f39c12', alpha=0.20, edgecolor='#f39c12',
                               linewidth=1.5, linestyle='--')
    ax.add_patch(opt_rect)
    ax.text(opt_x, opt_y, 'Customer Testimonial', ha='center', va='center',
            fontsize=8, fontweight='bold', color='#e67e22')
    ax.text(opt_x + 0.17, opt_y, '★ Optional', ha='left', va='center',
            fontsize=7, color='#e67e22', style='italic')

    # Legend
    legend_elements = [
        mpatches.Patch(facecolor='#27ae60', alpha=0.3, edgecolor='#27ae60', label='Mandatory'),
        mpatches.Patch(facecolor='#f39c12', alpha=0.3, edgecolor='#f39c12',
                       linestyle='--', label='Optional'),
    ]
    ax.legend(handles=legend_elements, loc='lower center', ncol=2,
              fontsize=10, bbox_to_anchor=(0.5, 0.02), frameon=True,
              fancybox=True, shadow=True)

    ax.set_xlim(0.0, 1.0)
    ax.set_ylim(0.0, 1.0)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-marketing-63.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-bst-marketing-63.png")


if __name__ == '__main__':
    diagram_marketing_mix()
    diagram_channels_of_distribution()
    diagram_product_label()
    print("All Ch11 Marketing diagrams generated.")
