"""Generate matplotlib diagrams for Electrochemistry chapter (CUET Chemistry)."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle, Rectangle
import numpy as np
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)


def diagram_daniell_cell():
    """Daniell cell (galvanic cell) with labeled components."""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.axis('off')

    ax.text(0.5, 0.97, 'Daniell Cell (Galvanic Cell)', fontsize=16,
            fontweight='bold', ha='center', va='top', color='#2c3e50')

    # --- Left beaker (Anode - Zn) ---
    # Beaker outline
    beaker_left = FancyBboxPatch((0.05, 0.15), 0.30, 0.45,
                                  boxstyle="round,pad=0.01",
                                  facecolor='#d5e8f0', alpha=0.5,
                                  edgecolor='#2c3e50', linewidth=2)
    ax.add_patch(beaker_left)

    # ZnSO4 solution label
    ax.text(0.20, 0.22, 'ZnSO\u2084 solution\n(1 M)', ha='center', va='center',
            fontsize=9, color='#2980b9', fontweight='bold')

    # Zinc electrode (gray rectangle)
    zn_electrode = FancyBboxPatch((0.17, 0.30), 0.06, 0.35,
                                   boxstyle="round,pad=0.005",
                                   facecolor='#95a5a6', alpha=0.9,
                                   edgecolor='#7f8c8d', linewidth=2)
    ax.add_patch(zn_electrode)
    ax.text(0.20, 0.48, 'Zn', ha='center', va='center',
            fontsize=12, fontweight='bold', color='white')

    # Anode label
    ax.text(0.20, 0.70, 'ANODE (−)', ha='center', va='center',
            fontsize=11, fontweight='bold', color='#e74c3c')
    ax.text(0.20, 0.66, 'Oxidation', ha='center', va='center',
            fontsize=9, fontweight='bold', color='#e74c3c')

    # Half-reaction below left beaker
    ax.text(0.20, 0.08, 'Zn(s) \u2192 Zn\u00b2\u207a(aq) + 2e\u207b', ha='center', va='center',
            fontsize=10, fontweight='bold', color='#c0392b',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#fadbd8', edgecolor='#e74c3c', linewidth=1))

    # --- Right beaker (Cathode - Cu) ---
    beaker_right = FancyBboxPatch((0.60, 0.15), 0.30, 0.45,
                                   boxstyle="round,pad=0.01",
                                   facecolor='#d5f5e3', alpha=0.5,
                                   edgecolor='#2c3e50', linewidth=2)
    ax.add_patch(beaker_right)

    # CuSO4 solution label
    ax.text(0.75, 0.22, 'CuSO\u2084 solution\n(1 M)', ha='center', va='center',
            fontsize=9, color='#27ae60', fontweight='bold')

    # Copper electrode (orange-brown rectangle)
    cu_electrode = FancyBboxPatch((0.72, 0.30), 0.06, 0.35,
                                   boxstyle="round,pad=0.005",
                                   facecolor='#e67e22', alpha=0.9,
                                   edgecolor='#d35400', linewidth=2)
    ax.add_patch(cu_electrode)
    ax.text(0.75, 0.48, 'Cu', ha='center', va='center',
            fontsize=12, fontweight='bold', color='white')

    # Cathode label
    ax.text(0.75, 0.70, 'CATHODE (+)', ha='center', va='center',
            fontsize=11, fontweight='bold', color='#27ae60')
    ax.text(0.75, 0.66, 'Reduction', ha='center', va='center',
            fontsize=9, fontweight='bold', color='#27ae60')

    # Half-reaction below right beaker
    ax.text(0.75, 0.08, 'Cu\u00b2\u207a(aq) + 2e\u207b \u2192 Cu(s)', ha='center', va='center',
            fontsize=10, fontweight='bold', color='#1e8449',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#d5f5e3', edgecolor='#27ae60', linewidth=1))

    # --- Salt bridge ---
    # Draw salt bridge as a U-tube connecting the two beakers
    salt_bridge_x = [0.30, 0.32, 0.38, 0.47, 0.56, 0.62, 0.64]
    salt_bridge_y = [0.45, 0.55, 0.62, 0.64, 0.62, 0.55, 0.45]
    ax.plot(salt_bridge_x, salt_bridge_y, color='#8e44ad', linewidth=8, alpha=0.3,
            solid_capstyle='round')
    ax.plot(salt_bridge_x, salt_bridge_y, color='#8e44ad', linewidth=3, alpha=0.8,
            solid_capstyle='round')

    # Salt bridge label
    ax.text(0.47, 0.68, 'Salt Bridge', ha='center', va='center',
            fontsize=10, fontweight='bold', color='#8e44ad')
    ax.text(0.47, 0.73, '(KCl in agar-agar)', ha='center', va='center',
            fontsize=8, color='#8e44ad')

    # Ion flow in salt bridge
    ax.annotate('Cl\u207b', xy=(0.36, 0.56), xytext=(0.44, 0.58),
                fontsize=8, fontweight='bold', color='#8e44ad',
                arrowprops=dict(arrowstyle='->', lw=1.5, color='#8e44ad'))
    ax.annotate('K\u207a', xy=(0.58, 0.56), xytext=(0.50, 0.58),
                fontsize=8, fontweight='bold', color='#8e44ad',
                arrowprops=dict(arrowstyle='->', lw=1.5, color='#8e44ad'))

    # --- External wire and electron flow ---
    wire_x = [0.20, 0.20, 0.35, 0.47, 0.60, 0.75, 0.75]
    wire_y = [0.65, 0.82, 0.87, 0.88, 0.87, 0.82, 0.65]
    ax.plot(wire_x, wire_y, color='#2c3e50', linewidth=2.5, solid_capstyle='round')

    # Electron flow arrow on wire (from Zn to Cu)
    ax.annotate('', xy=(0.58, 0.87), xytext=(0.36, 0.87),
                arrowprops=dict(arrowstyle='->', lw=2.5, color='#e74c3c'))
    ax.text(0.47, 0.91, 'e\u207b flow', ha='center', va='center',
            fontsize=10, fontweight='bold', color='#e74c3c')

    # --- Voltmeter ---
    voltmeter = Circle((0.47, 0.82), 0.035, facecolor='#f1c40f', alpha=0.9,
                        edgecolor='#f39c12', linewidth=2)
    ax.add_patch(voltmeter)
    ax.text(0.47, 0.82, 'V', ha='center', va='center',
            fontsize=10, fontweight='bold', color='#2c3e50')
    ax.text(0.47, 0.77, '~1.1 V', ha='center', va='center',
            fontsize=9, fontweight='bold', color='#f39c12')

    # --- Overall reaction at bottom ---
    ax.text(0.50, 0.02, 'Overall: Zn(s) + Cu\u00b2\u207a(aq) \u2192 Zn\u00b2\u207a(aq) + Cu(s)    E\u00b0cell = +1.10 V',
            ha='center', va='center', fontsize=11, fontweight='bold', color='#2c3e50',
            bbox=dict(boxstyle='round,pad=0.4', facecolor='#fdebd0', edgecolor='#e67e22', linewidth=1.5))

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.set_aspect('equal')

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-chem-electrochem-mixed-19.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-chem-electrochem-mixed-19.png")


def diagram_molar_conductivity():
    """Molar conductivity vs sqrt(c) graph for strong and weak electrolytes."""
    fig, ax = plt.subplots(figsize=(10, 7))

    # Generate data for strong electrolyte (NaCl) - nearly linear decrease
    sqrt_c_strong = np.linspace(0, 0.35, 200)
    lambda_m_strong_inf = 126.5  # Limiting molar conductivity for NaCl (S cm2/mol)
    slope_strong = -90
    lambda_m_strong = lambda_m_strong_inf + slope_strong * sqrt_c_strong

    # Generate data for weak electrolyte (CH3COOH) - sharp rise at low concentration
    sqrt_c_weak = np.linspace(0.01, 0.35, 200)
    # Simulate weak electrolyte behavior: steep rise at low c, very low at higher c
    lambda_m_weak_inf = 390.5  # Limiting molar conductivity for CH3COOH
    # Use an exponential decay model to simulate the sharp curve
    lambda_m_weak = lambda_m_weak_inf * (0.012 / sqrt_c_weak)**0.7
    # Cap at some maximum value below infinity
    lambda_m_weak = np.clip(lambda_m_weak, 0, 350)
    # Make it start low at high concentration and rise sharply
    lambda_m_weak = 7 + 45 * np.exp(-8 * sqrt_c_weak) + 5 / (sqrt_c_weak + 0.02)

    # Plot strong electrolyte
    ax.plot(sqrt_c_strong, lambda_m_strong, color='#2980b9', linewidth=3,
            label='NaCl (Strong electrolyte)', zorder=3)

    # Plot weak electrolyte
    ax.plot(sqrt_c_weak, lambda_m_weak, color='#e74c3c', linewidth=3,
            label='CH\u2083COOH (Weak electrolyte)', zorder=3)

    # Extrapolation dashed line for strong electrolyte
    sqrt_c_extrap = np.linspace(-0.05, 0.1, 50)
    lambda_extrap = lambda_m_strong_inf + slope_strong * sqrt_c_extrap
    ax.plot(sqrt_c_extrap, lambda_extrap, color='#2980b9', linewidth=2,
            linestyle='--', alpha=0.6, zorder=2)

    # Mark Lambda_m_inf for strong electrolyte on y-axis
    ax.plot(0, lambda_m_strong_inf, 'o', color='#2980b9', markersize=10, zorder=5)
    ax.annotate('\u039b\u00b0m (NaCl) = 126.5',
                xy=(0, lambda_m_strong_inf), xytext=(0.06, lambda_m_strong_inf + 15),
                fontsize=10, fontweight='bold', color='#2980b9',
                arrowprops=dict(arrowstyle='->', lw=1.5, color='#2980b9'),
                bbox=dict(boxstyle='round,pad=0.3', facecolor='#d6eaf8', edgecolor='#2980b9'))

    # Annotation for weak electrolyte - cannot extrapolate
    ax.annotate('Cannot extrapolate\nto find \u039b\u00b0m',
                xy=(0.04, lambda_m_weak[lambda_m_weak.size // 8]),
                xytext=(0.12, 280),
                fontsize=10, fontweight='bold', color='#e74c3c',
                arrowprops=dict(arrowstyle='->', lw=1.5, color='#e74c3c'),
                bbox=dict(boxstyle='round,pad=0.3', facecolor='#fadbd8', edgecolor='#e74c3c'))

    # Annotation: use Kohlrausch's law for weak electrolytes
    ax.text(0.20, 310, "For weak electrolytes:\n\u039b\u00b0m found using\nKohlrausch's law",
            fontsize=9, color='#c0392b', style='italic',
            bbox=dict(boxstyle='round,pad=0.4', facecolor='#fef9e7', edgecolor='#f39c12', linewidth=1))

    # Labels and formatting
    ax.set_xlabel('\u221ac  (\u221a(mol/L))', fontsize=13, fontweight='bold', color='#2c3e50')
    ax.set_ylabel('\u039bm  (S cm\u00b2 mol\u207b\u00b9)', fontsize=13, fontweight='bold', color='#2c3e50')
    ax.set_title('Variation of Molar Conductivity (\u039bm) with \u221ac', fontsize=14,
                 fontweight='bold', color='#2c3e50', pad=15)

    ax.set_xlim(-0.02, 0.38)
    ax.set_ylim(0, 360)

    ax.legend(fontsize=11, loc='center right',
              frameon=True, fancybox=True, shadow=True,
              edgecolor='#bdc3c7')

    ax.grid(True, alpha=0.3, linestyle='--')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#7f8c8d')
    ax.spines['bottom'].set_color('#7f8c8d')
    ax.tick_params(colors='#7f8c8d')

    # Add key observation note at the bottom
    ax.text(0.18, 30, 'Strong electrolyte: slight, linear decrease (\u039bm = \u039b\u00b0m \u2212 A\u221ac)',
            fontsize=9, color='#2980b9', fontweight='bold')
    ax.text(0.18, 15, 'Weak electrolyte: sharp increase at low concentration (increased ionization)',
            fontsize=9, color='#e74c3c', fontweight='bold')

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, 'cuet-chem-electrochem-mixed-20.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("Generated: cuet-chem-electrochem-mixed-20.png")


if __name__ == '__main__':
    diagram_daniell_cell()
    diagram_molar_conductivity()
    print("All Electrochemistry diagrams generated.")
