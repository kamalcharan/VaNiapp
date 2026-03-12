"""Generate matplotlib diagrams for Haloalkanes and Haloarenes chapter (CUET Chemistry)."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle, Rectangle
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


def diagram_sn2_mechanism():
    """SN2 mechanism: backside attack, transition state, Walden inversion."""
    fig, ax = plt.subplots(figsize=(14, 7))
    ax.axis('off')

    ax.text(0.50, 0.97, 'SN2 Mechanism — Backside Attack and Walden Inversion',
            fontsize=15, fontweight='bold', ha='center', va='top', color='#2c3e50')

    # ── Stage 1: Substrate with nucleophile approaching ──
    # Central carbon
    cx1, cy1 = 0.15, 0.50
    ax.plot(cx1, cy1, 'o', color='#2c3e50', markersize=14, zorder=5)
    ax.text(cx1, cy1, 'C', ha='center', va='center', fontsize=10,
            fontweight='bold', color='white', zorder=6)

    # Br leaving group (right side)
    ax.plot(cx1 + 0.06, cy1, 'o', color='#e74c3c', markersize=12, zorder=5)
    ax.text(cx1 + 0.06, cy1, 'Br', ha='center', va='center', fontsize=8,
            fontweight='bold', color='white', zorder=6)
    ax.plot([cx1 + 0.015, cx1 + 0.045], [cy1, cy1], '-', color='#2c3e50', linewidth=2.5, zorder=4)

    # Three substituents (H, CH₃, C₂H₅) arranged tetrahedrally
    ax.plot([cx1, cx1 - 0.02], [cy1 + 0.01, cy1 + 0.10], '-', color='#2c3e50', linewidth=2, zorder=3)
    ax.text(cx1 - 0.02, cy1 + 0.12, 'H', ha='center', fontsize=9, fontweight='bold', color='#7f8c8d')

    ax.plot([cx1, cx1 + 0.02], [cy1 + 0.01, cy1 + 0.10], '-', color='#2c3e50', linewidth=2, zorder=3)
    ax.text(cx1 + 0.025, cy1 + 0.12, 'CH₃', ha='center', fontsize=9, fontweight='bold', color='#7f8c8d')

    ax.plot([cx1, cx1], [cy1 - 0.01, cy1 - 0.10], '-', color='#2c3e50', linewidth=2, zorder=3)
    ax.text(cx1, cy1 - 0.13, 'C₂H₅', ha='center', fontsize=9, fontweight='bold', color='#7f8c8d')

    # OH⁻ nucleophile approaching from backside (left)
    ax.annotate('', xy=(cx1 - 0.04, cy1), xytext=(cx1 - 0.11, cy1),
                arrowprops=dict(arrowstyle='->', lw=2.5, color='#3498db'))
    ax.text(cx1 - 0.13, cy1, 'OH⁻', ha='center', va='center', fontsize=10,
            fontweight='bold', color='#3498db',
            bbox=dict(boxstyle='round,pad=0.2', facecolor='#d6eaf8', edgecolor='#3498db'))

    # Label
    ax.text(cx1, cy1 - 0.25, '(R)-2-Bromobutane\n+ OH⁻ approaching',
            ha='center', fontsize=9, fontweight='bold', color='#2c3e50',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#fef9e7', edgecolor='#f39c12'))

    ax.text(cx1, cy1 + 0.25, 'BEFORE\n(Substrate)', ha='center', fontsize=10,
            fontweight='bold', color='#8e44ad')

    # ── Arrow between stage 1 and 2 ──
    ax.annotate('', xy=(0.31, 0.50), xytext=(0.26, 0.50),
                arrowprops=dict(arrowstyle='->', lw=3, color='#2c3e50'))

    # ── Stage 2: Transition State ──
    cx2, cy2 = 0.48, 0.50

    # Bracket left
    ax.text(cx2 - 0.09, cy2, '[', ha='center', va='center', fontsize=36,
            fontweight='bold', color='#e67e22')
    # Bracket right + double dagger
    ax.text(cx2 + 0.09, cy2, ']‡', ha='center', va='center', fontsize=28,
            fontweight='bold', color='#e67e22')

    # Central carbon
    ax.plot(cx2, cy2, 'o', color='#2c3e50', markersize=14, zorder=5)
    ax.text(cx2, cy2, 'C', ha='center', va='center', fontsize=10,
            fontweight='bold', color='white', zorder=6)

    # Partial bond to OH (left) - dashed
    ax.plot([cx2 - 0.01, cx2 - 0.05], [cy2, cy2], '--', color='#3498db',
            linewidth=2.5, zorder=4, dashes=(3, 3))
    ax.text(cx2 - 0.065, cy2, 'OH', ha='center', va='center', fontsize=9,
            fontweight='bold', color='#3498db')
    ax.text(cx2 - 0.065, cy2 + 0.05, 'δ⁻', ha='center', fontsize=10,
            fontweight='bold', color='#3498db')

    # Partial bond to Br (right) - dashed
    ax.plot([cx2 + 0.01, cx2 + 0.05], [cy2, cy2], '--', color='#e74c3c',
            linewidth=2.5, zorder=4, dashes=(3, 3))
    ax.text(cx2 + 0.065, cy2, 'Br', ha='center', va='center', fontsize=9,
            fontweight='bold', color='#e74c3c')
    ax.text(cx2 + 0.065, cy2 + 0.05, 'δ⁻', ha='center', fontsize=10,
            fontweight='bold', color='#e74c3c')

    # Three equatorial substituents (in vertical plane)
    ax.plot([cx2, cx2], [cy2 + 0.01, cy2 + 0.10], '-', color='#2c3e50', linewidth=2, zorder=3)
    ax.text(cx2, cy2 + 0.13, 'H', ha='center', fontsize=9, fontweight='bold', color='#7f8c8d')

    ax.plot([cx2, cx2 + 0.03], [cy2 - 0.01, cy2 - 0.09], '-', color='#2c3e50', linewidth=2, zorder=3)
    ax.text(cx2 + 0.04, cy2 - 0.12, 'CH₃', ha='center', fontsize=9, fontweight='bold', color='#7f8c8d')

    ax.plot([cx2, cx2 - 0.03], [cy2 - 0.01, cy2 - 0.09], '-', color='#2c3e50', linewidth=2, zorder=3)
    ax.text(cx2 - 0.04, cy2 - 0.12, 'C₂H₅', ha='center', fontsize=9, fontweight='bold', color='#7f8c8d')

    # Label
    ax.text(cx2, cy2 - 0.25, 'Trigonal Bipyramidal\nTransition State',
            ha='center', fontsize=9, fontweight='bold', color='#e67e22',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#fdebd0', edgecolor='#e67e22'))

    ax.text(cx2, cy2 + 0.25, 'TRANSITION STATE\n(‡)', ha='center', fontsize=10,
            fontweight='bold', color='#e67e22')

    # ── Arrow between stage 2 and 3 ──
    ax.annotate('', xy=(0.66, 0.50), xytext=(0.61, 0.50),
                arrowprops=dict(arrowstyle='->', lw=3, color='#2c3e50'))

    # ── Stage 3: Product with inverted configuration ──
    cx3, cy3 = 0.82, 0.50

    # Central carbon
    ax.plot(cx3, cy3, 'o', color='#2c3e50', markersize=14, zorder=5)
    ax.text(cx3, cy3, 'C', ha='center', va='center', fontsize=10,
            fontweight='bold', color='white', zorder=6)

    # OH bonded (left side — now it's attached)
    ax.plot([cx3 - 0.015, cx3 - 0.045], [cy3, cy3], '-', color='#3498db', linewidth=2.5, zorder=4)
    ax.text(cx3 - 0.06, cy3, 'OH', ha='center', va='center', fontsize=9,
            fontweight='bold', color='#3498db')

    # Br⁻ departed (right side, far away)
    ax.text(cx3 + 0.09, cy3, 'Br⁻', ha='center', va='center', fontsize=10,
            fontweight='bold', color='#e74c3c', alpha=0.5,
            bbox=dict(boxstyle='round,pad=0.2', facecolor='#fadbd8', edgecolor='#e74c3c', alpha=0.4))

    # Inverted substituents (now flipped compared to stage 1)
    ax.plot([cx3, cx3 + 0.02], [cy3 + 0.01, cy3 + 0.10], '-', color='#2c3e50', linewidth=2, zorder=3)
    ax.text(cx3 + 0.02, cy3 + 0.12, 'H', ha='center', fontsize=9, fontweight='bold', color='#7f8c8d')

    ax.plot([cx3, cx3 - 0.02], [cy3 + 0.01, cy3 + 0.10], '-', color='#2c3e50', linewidth=2, zorder=3)
    ax.text(cx3 - 0.025, cy3 + 0.12, 'CH₃', ha='center', fontsize=9, fontweight='bold', color='#7f8c8d')

    ax.plot([cx3, cx3], [cy3 - 0.01, cy3 - 0.10], '-', color='#2c3e50', linewidth=2, zorder=3)
    ax.text(cx3, cy3 - 0.13, 'C₂H₅', ha='center', fontsize=9, fontweight='bold', color='#7f8c8d')

    # Label
    ax.text(cx3, cy3 - 0.25, '(S)-2-Butanol\n(Inverted configuration)',
            ha='center', fontsize=9, fontweight='bold', color='#2ecc71',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#d5f5e3', edgecolor='#2ecc71'))

    ax.text(cx3, cy3 + 0.25, 'AFTER\n(Product)', ha='center', fontsize=10,
            fontweight='bold', color='#2ecc71')

    # ── Bottom annotation ──
    ax.text(0.50, 0.06,
            'Walden Inversion: The nucleophile attacks from the backside (180° to leaving group).\n'
            'The three substituents flip like an umbrella inverting in the wind → complete inversion of configuration.',
            ha='center', va='center', fontsize=10, color='#2c3e50', style='italic',
            bbox=dict(boxstyle='round,pad=0.5', facecolor='#eaf2f8', edgecolor='#2980b9', linewidth=1.5))

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.set_aspect('equal')

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-chem-haloalkanes-mixed-19.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-chem-haloalkanes-mixed-19.png")


def diagram_energy_profile_sn1_vs_sn2():
    """Energy profile diagram comparing SN1 (two-step) vs SN2 (one-step) mechanisms."""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))

    fig.suptitle('Energy Profile: SN1 vs SN2 Mechanisms', fontsize=15,
                 fontweight='bold', color='#2c3e50', y=0.98)

    # ── LEFT PANEL: SN1 (two-step) ──
    # Reaction coordinate points for SN1
    x_sn1 = np.array([0, 1, 2, 3, 4, 5, 6])
    y_sn1 = np.array([30, 30, 85, 55, 70, 25, 25])

    # Smooth the curve with numpy polynomial interpolation
    x_smooth = np.linspace(0, 6, 300)
    coeffs = np.polyfit(x_sn1, y_sn1, 6)
    y_smooth = np.polyval(coeffs, x_smooth)

    ax1.plot(x_smooth, y_smooth, color='#e74c3c', linewidth=3, zorder=3)
    ax1.fill_between(x_smooth, 0, y_smooth, alpha=0.08, color='#e74c3c')

    # Reactants level
    ax1.plot([0, 1], [30, 30], '--', color='#7f8c8d', linewidth=1, alpha=0.6)
    ax1.text(0.3, 27, 'Reactants\n(R−X + Nu⁻)', fontsize=9, fontweight='bold',
             color='#2c3e50', ha='center')

    # First transition state (TS1) - highest peak
    ax1.plot(2, 85, 'o', color='#e74c3c', markersize=8, zorder=5)
    ax1.text(2, 89, 'TS1', fontsize=10, fontweight='bold', color='#e74c3c', ha='center')
    ax1.text(2, 94, '(C−X bond\nbreaking)', fontsize=8, color='#c0392b',
             ha='center', style='italic')

    # Activation energy Ea1
    ax1.annotate('', xy=(1.2, 85), xytext=(1.2, 30),
                 arrowprops=dict(arrowstyle='<->', lw=1.5, color='#8e44ad'))
    ax1.text(0.8, 57, 'Ea1\n(rate\ndetermining)', fontsize=8, fontweight='bold',
             color='#8e44ad', ha='center')

    # Carbocation intermediate (energy minimum)
    ax1.plot(3, 55, 'o', color='#f39c12', markersize=8, zorder=5)
    ax1.text(3, 48, 'Carbocation\nIntermediate\n(R⁺)', fontsize=8, fontweight='bold',
             color='#f39c12', ha='center',
             bbox=dict(boxstyle='round,pad=0.2', facecolor='#fef9e7', edgecolor='#f39c12'))

    # Second transition state (TS2)
    ax1.plot(4, 70, 'o', color='#e74c3c', markersize=8, zorder=5)
    ax1.text(4, 74, 'TS2', fontsize=10, fontweight='bold', color='#e74c3c', ha='center')
    ax1.text(4, 79, '(Nu⁻ attacks\nR⁺)', fontsize=8, color='#c0392b',
             ha='center', style='italic')

    # Activation energy Ea2
    ax1.annotate('', xy=(3.5, 70), xytext=(3.5, 55),
                 arrowprops=dict(arrowstyle='<->', lw=1.5, color='#8e44ad'))
    ax1.text(3.9, 62, 'Ea2', fontsize=8, fontweight='bold', color='#8e44ad')

    # Products level
    ax1.plot([5, 6], [25, 25], '--', color='#7f8c8d', linewidth=1, alpha=0.6)
    ax1.text(5.7, 22, 'Products\n(R−Nu + X⁻)', fontsize=9, fontweight='bold',
             color='#2c3e50', ha='center')

    ax1.set_xlabel('Reaction Coordinate →', fontsize=12, fontweight='bold', color='#2c3e50')
    ax1.set_ylabel('Potential Energy →', fontsize=12, fontweight='bold', color='#2c3e50')
    ax1.set_title('SN1 Mechanism (Two-Step)', fontsize=13, fontweight='bold',
                  color='#e74c3c', pad=10)
    ax1.set_xlim(-0.5, 6.5)
    ax1.set_ylim(0, 105)
    ax1.set_xticks([])
    ax1.set_yticks([])
    ax1.spines['top'].set_visible(False)
    ax1.spines['right'].set_visible(False)
    ax1.spines['left'].set_color('#7f8c8d')
    ax1.spines['bottom'].set_color('#7f8c8d')

    # Key features box
    ax1.text(5.0, 95, 'Key: Two transition\nstates, one intermediate',
             fontsize=8, fontweight='bold', color='#c0392b',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='#fadbd8', edgecolor='#e74c3c'))

    # ── RIGHT PANEL: SN2 (one-step concerted) ──
    x_sn2 = np.array([0, 1, 3, 5, 6])
    y_sn2 = np.array([30, 30, 75, 25, 25])

    x_smooth2 = np.linspace(0, 6, 300)
    coeffs2 = np.polyfit(x_sn2, y_sn2, 4)
    y_smooth2 = np.polyval(coeffs2, x_smooth2)

    ax2.plot(x_smooth2, y_smooth2, color='#3498db', linewidth=3, zorder=3)
    ax2.fill_between(x_smooth2, 0, y_smooth2, alpha=0.08, color='#3498db')

    # Reactants level
    ax2.plot([0, 1], [30, 30], '--', color='#7f8c8d', linewidth=1, alpha=0.6)
    ax2.text(0.3, 27, 'Reactants\n(R−X + Nu⁻)', fontsize=9, fontweight='bold',
             color='#2c3e50', ha='center')

    # Single transition state
    ax2.plot(3, 75, 'o', color='#3498db', markersize=8, zorder=5)
    ax2.text(3, 79, 'TS', fontsize=10, fontweight='bold', color='#3498db', ha='center')
    ax2.text(3, 89, '[Nu···C···X]‡', fontsize=11, fontweight='bold', color='#2980b9',
             ha='center',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='#d6eaf8', edgecolor='#3498db'))

    # Activation energy Ea
    ax2.annotate('', xy=(1.5, 75), xytext=(1.5, 30),
                 arrowprops=dict(arrowstyle='<->', lw=1.5, color='#8e44ad'))
    ax2.text(1.1, 52, 'Ea', fontsize=10, fontweight='bold', color='#8e44ad', ha='center')

    # Products level
    ax2.plot([5, 6], [25, 25], '--', color='#7f8c8d', linewidth=1, alpha=0.6)
    ax2.text(5.7, 22, 'Products\n(R−Nu + X⁻)', fontsize=9, fontweight='bold',
             color='#2c3e50', ha='center')

    # No intermediate annotation
    ax2.text(3, 45, 'No intermediate\n(concerted step)', fontsize=9,
             fontweight='bold', color='#2980b9', ha='center', style='italic',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='#eaf2f8', edgecolor='#3498db'))

    ax2.set_xlabel('Reaction Coordinate →', fontsize=12, fontweight='bold', color='#2c3e50')
    ax2.set_ylabel('Potential Energy →', fontsize=12, fontweight='bold', color='#2c3e50')
    ax2.set_title('SN2 Mechanism (One-Step Concerted)', fontsize=13, fontweight='bold',
                  color='#3498db', pad=10)
    ax2.set_xlim(-0.5, 6.5)
    ax2.set_ylim(0, 105)
    ax2.set_xticks([])
    ax2.set_yticks([])
    ax2.spines['top'].set_visible(False)
    ax2.spines['right'].set_visible(False)
    ax2.spines['left'].set_color('#7f8c8d')
    ax2.spines['bottom'].set_color('#7f8c8d')

    # Key features box
    ax2.text(5.0, 95, 'Key: Single transition\nstate, no intermediate',
             fontsize=8, fontweight='bold', color='#2980b9',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='#d6eaf8', edgecolor='#3498db'))

    fig.tight_layout(rect=[0, 0, 1, 0.95])
    fig.savefig(os.path.join(OUT_DIR, 'cuet-chem-haloalkanes-mixed-20.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-chem-haloalkanes-mixed-20.png")


if __name__ == '__main__':
    diagram_sn2_mechanism()
    diagram_energy_profile_sn1_vs_sn2()
    print("All Haloalkanes and Haloarenes diagrams generated.")
