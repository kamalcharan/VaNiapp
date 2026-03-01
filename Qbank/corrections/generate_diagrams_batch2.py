#!/usr/bin/env python3
"""
Generate 20 diagram PNGs for Batch 2 correction questions using matplotlib.
Covers: Dual Nature (4), Electronic Devices (6), Electrostatics (6), EM Induction (4)

Usage:
  python3 Qbank/corrections/generate_diagrams_batch2.py
"""
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent / "diagrams"
OUT_DIR.mkdir(exist_ok=True)

STYLE = dict(figsize=(6, 4.5), dpi=150, facecolor='white')


def save(fig, name):
    path = OUT_DIR / name
    fig.savefig(path, bbox_inches='tight', facecolor='white')
    plt.close(fig)
    print(f"  OK: {name}")


# ═══════════════════════════════════════════════════════════════════════
# DUAL NATURE
# ═══════════════════════════════════════════════════════════════════════

def dual_debroglie_d01():
    """λ vs V graph: λ ∝ 1/√V (rectangular hyperbola)."""
    fig, ax = plt.subplots(**STYLE)
    V = np.linspace(5, 200, 300)
    lam = 1.226 / np.sqrt(V)  # nm
    ax.plot(V, lam, 'b-', linewidth=2)
    ax.set_xlabel('Accelerating Potential V (volts)', fontsize=12)
    ax.set_ylabel('de Broglie Wavelength λ (nm)', fontsize=12)
    ax.set_title('λ vs V for Electrons', fontsize=13, fontweight='bold')
    ax.set_xlim(0, 210)
    ax.set_ylim(0, 0.65)
    ax.axhline(y=0, color='k', linewidth=0.5)
    ax.axvline(x=0, color='k', linewidth=0.5)
    ax.annotate('λ = 1.226/√V nm', xy=(80, 0.14), fontsize=11, color='blue')
    ax.grid(True, alpha=0.3)
    save(fig, 'cuet-phy-dual-debroglie-d01.png')


def dual_debroglie_d02():
    """Davisson-Germer experiment setup."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-1, 10)
    ax.set_ylim(-1, 8)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Davisson-Germer Experiment', fontsize=13, fontweight='bold')

    # Electron gun
    gun = patches.FancyBboxPatch((0, 3.5), 1.5, 1.2, boxstyle="round,pad=0.1",
                                  facecolor='lightblue', edgecolor='black', linewidth=1.5)
    ax.add_patch(gun)
    ax.text(0.75, 4.1, 'Electron\nGun', ha='center', va='center', fontsize=8, fontweight='bold')
    ax.text(0.75, 3.0, 'V = 54 V', ha='center', fontsize=8, color='red')

    # Beam arrow
    ax.annotate('', xy=(4, 4.1), xytext=(1.5, 4.1),
                arrowprops=dict(arrowstyle='->', lw=2, color='blue'))
    ax.text(2.7, 4.5, 'e⁻ beam', fontsize=9, color='blue')

    # Ni crystal
    crystal = patches.FancyBboxPatch((3.8, 3.3), 1.4, 1.6, boxstyle="round,pad=0.05",
                                      facecolor='silver', edgecolor='black', linewidth=2)
    ax.add_patch(crystal)
    ax.text(4.5, 4.1, 'Ni\nCrystal', ha='center', va='center', fontsize=9, fontweight='bold')

    # Scattered beam to detector
    det_x, det_y = 7.5, 6.0
    ax.annotate('', xy=(det_x, det_y), xytext=(5.2, 4.5),
                arrowprops=dict(arrowstyle='->', lw=2, color='green'))

    # Detector
    det = patches.FancyBboxPatch((7, 5.6), 1.8, 0.9, boxstyle="round,pad=0.1",
                                  facecolor='lightyellow', edgecolor='black', linewidth=1.5)
    ax.add_patch(det)
    ax.text(7.9, 6.05, 'Detector', ha='center', va='center', fontsize=9, fontweight='bold')

    # Angle annotations
    ax.annotate('', xy=(6.5, 4.1), xytext=(5.2, 4.1),
                arrowprops=dict(arrowstyle='-', lw=1, color='gray', linestyle='dashed'))
    # φ angle arc
    angle = np.linspace(0, np.radians(50), 50)
    r = 1.5
    cx, cy = 5.2, 4.1
    ax.plot(cx + r * np.cos(angle), cy + r * np.sin(angle), 'r-', linewidth=1.5)
    ax.text(6.2, 5.2, 'φ = 50°', fontsize=10, color='red', fontweight='bold')

    # Peak annotation
    ax.text(7.9, 5.2, 'Strong peak at\nφ = 50°, V = 54V', ha='center', fontsize=8, color='green')

    save(fig, 'cuet-phy-dual-debroglie-d02.png')


def dual_photo_d01():
    """V₀ vs ν graph for two metals P and Q (parallel lines)."""
    fig, ax = plt.subplots(**STYLE)
    nu = np.linspace(3, 12, 300)  # ×10¹⁴ Hz

    # Metal P: threshold ν₁ = 4, Metal Q: threshold ν₂ = 6
    slope = 0.5  # h/e in arbitrary units
    v0_P = slope * (nu - 4)
    v0_Q = slope * (nu - 6)

    ax.plot(nu, np.maximum(v0_P, -0.1), 'b-', linewidth=2, label='Metal P')
    ax.plot(nu, np.maximum(v0_Q, -0.1), 'r-', linewidth=2, label='Metal Q')

    # Show threshold frequencies
    ax.axvline(x=4, color='blue', linestyle='--', alpha=0.5)
    ax.axvline(x=6, color='red', linestyle='--', alpha=0.5)
    ax.text(4, -0.5, 'ν₁', fontsize=11, ha='center', color='blue', fontweight='bold')
    ax.text(6, -0.5, 'ν₂', fontsize=11, ha='center', color='red', fontweight='bold')

    ax.set_xlabel('Frequency ν (×10¹⁴ Hz)', fontsize=12)
    ax.set_ylabel('Stopping Potential V₀ (V)', fontsize=12)
    ax.set_title('V₀ vs ν for Two Metals', fontsize=13, fontweight='bold')
    ax.axhline(y=0, color='k', linewidth=0.8)
    ax.set_xlim(2, 12)
    ax.set_ylim(-1, 4)
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)
    save(fig, 'cuet-phy-dual-photo-d01.png')


def dual_photo_d02():
    """I-V characteristics at two intensities, same frequency."""
    fig, ax = plt.subplots(**STYLE)
    V = np.linspace(-3, 5, 500)

    # Stopping potential = -2V for both (same frequency)
    def photocurrent(V, I_sat):
        I = np.where(V >= 0,
                     I_sat * (1 - np.exp(-3 * V / I_sat)),
                     I_sat * np.exp(3 * (V + 2) / 2) * (V >= -2))
        I = np.where(V < -2, 0, I)
        return np.clip(I, 0, I_sat)

    I1 = photocurrent(V, 2.0)
    I2 = photocurrent(V, 4.0)

    ax.plot(V, I2, 'r-', linewidth=2, label='I₂ (higher intensity)')
    ax.plot(V, I1, 'b-', linewidth=2, label='I₁ (lower intensity)')

    # Mark stopping potential
    ax.axvline(x=-2, color='green', linestyle='--', linewidth=1.5)
    ax.text(-2, 4.3, '−V₀', fontsize=11, ha='center', color='green', fontweight='bold')

    # Mark saturation currents
    ax.annotate('I₂(sat)', xy=(4.5, 4.0), fontsize=10, color='red')
    ax.annotate('I₁(sat)', xy=(4.5, 2.0), fontsize=10, color='blue')

    ax.set_xlabel('Applied Voltage V (volts)', fontsize=12)
    ax.set_ylabel('Photocurrent I (μA)', fontsize=12)
    ax.set_title('I-V Characteristics (same frequency, different intensity)', fontsize=11, fontweight='bold')
    ax.axhline(y=0, color='k', linewidth=0.8)
    ax.axvline(x=0, color='k', linewidth=0.5)
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)
    ax.set_xlim(-3.5, 6)
    ax.set_ylim(-0.5, 5)
    save(fig, 'cuet-phy-dual-photo-d02.png')


# ═══════════════════════════════════════════════════════════════════════
# ELECTRONIC DEVICES
# ═══════════════════════════════════════════════════════════════════════

def semi_diode_d01():
    """Half-wave rectifier circuit diagram."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-1, 12)
    ax.set_ylim(-1, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Half-Wave Rectifier', fontsize=13, fontweight='bold')

    # AC source (circle with sine wave)
    circle = plt.Circle((1.5, 3.5), 0.8, fill=False, edgecolor='blue', linewidth=2)
    ax.add_patch(circle)
    t = np.linspace(0, 2 * np.pi, 50)
    ax.plot(1.2 + 0.4 * t / (2 * np.pi), 3.5 + 0.3 * np.sin(t), 'b-', linewidth=1.5)
    ax.text(1.5, 2.2, 'AC\n10V peak', ha='center', fontsize=8, color='blue')

    # Wires from source
    ax.plot([2.3, 4], [4.3, 4.3], 'k-', linewidth=1.5)  # top wire
    ax.plot([2.3, 4], [2.7, 2.7], 'k-', linewidth=1.5)  # bottom wire (down then right)
    ax.plot([4, 4], [2.7, 1], 'k-', linewidth=1.5)
    ax.plot([4, 9], [1, 1], 'k-', linewidth=1.5)

    # Diode symbol
    # Triangle
    tri = plt.Polygon([[4, 4.7], [4, 3.9], [5.2, 4.3]], closed=True,
                       facecolor='lightcoral', edgecolor='black', linewidth=1.5)
    ax.add_patch(tri)
    ax.plot([5.2, 5.2], [3.9, 4.7], 'k-', linewidth=2)  # cathode bar
    ax.text(4.6, 5.2, 'D (Si, 0.7V)', ha='center', fontsize=9, fontweight='bold')

    # Wire from diode to load
    ax.plot([5.2, 7], [4.3, 4.3], 'k-', linewidth=1.5)

    # Load resistor
    ax.add_patch(patches.FancyBboxPatch((7, 1.5), 2, 2.5, boxstyle="round,pad=0.1",
                                         facecolor='lightyellow', edgecolor='black', linewidth=1.5))
    ax.text(8, 2.75, 'R_L', ha='center', va='center', fontsize=12, fontweight='bold')
    ax.plot([7, 7], [4, 4.3], 'k-', linewidth=1.5)
    ax.plot([9, 9], [4, 4.3], 'k-', linewidth=1.5)
    ax.plot([9, 9], [1, 1.5], 'k-', linewidth=1.5)

    # Output annotation
    ax.text(10.5, 3, 'Output:\n9.3V peak\n(positive\nhalf only)', fontsize=9,
            color='green', fontweight='bold', ha='center',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.5))

    save(fig, 'cuet-phy-semi-diode-d01.png')


def semi_diode_d02():
    """Zener diode voltage regulator circuit."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-1, 12)
    ax.set_ylim(-1, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Zener Voltage Regulator', fontsize=13, fontweight='bold')

    # Input voltage source
    ax.add_patch(patches.FancyBboxPatch((0.3, 2), 1.8, 2.5, boxstyle="round,pad=0.1",
                                         facecolor='lightblue', edgecolor='black', linewidth=1.5))
    ax.text(1.2, 3.25, 'Vin\n9-15V', ha='center', va='center', fontsize=10, fontweight='bold')

    # Series resistor
    ax.plot([2.1, 3.5], [4.5, 4.5], 'k-', linewidth=1.5)
    ax.add_patch(patches.Rectangle((3.5, 4.1), 2, 0.8, facecolor='wheat', edgecolor='black', linewidth=1.5))
    ax.text(4.5, 4.5, 'Rs', ha='center', va='center', fontsize=11, fontweight='bold')
    ax.plot([5.5, 7], [4.5, 4.5], 'k-', linewidth=1.5)

    # Bottom wire
    ax.plot([2.1, 10], [2, 2], 'k-', linewidth=1.5)

    # Junction point
    ax.plot([7, 7], [4.5, 2], 'k-', linewidth=1.5)

    # Zener diode (between junction and ground)
    ax.plot([6.6, 7.4], [3.6, 3.6], 'k-', linewidth=2)  # cathode bar with bends
    ax.plot([6.6, 6.6], [3.6, 3.4], 'k-', linewidth=2)  # left bend
    tri_z = plt.Polygon([[6.6, 3.0], [7.4, 3.0], [7.0, 3.6]], closed=True,
                         facecolor='lightyellow', edgecolor='black', linewidth=1.5)
    ax.add_patch(tri_z)
    ax.text(6, 3.3, 'Vz\n=6V', ha='center', fontsize=9, color='red', fontweight='bold')

    # Load resistor
    ax.plot([7, 9], [4.5, 4.5], 'k-', linewidth=1.5)
    ax.add_patch(patches.FancyBboxPatch((8.5, 2.3), 1.5, 2, boxstyle="round,pad=0.1",
                                         facecolor='lightyellow', edgecolor='black', linewidth=1.5))
    ax.text(9.25, 3.3, 'R_L', ha='center', va='center', fontsize=11, fontweight='bold')
    ax.plot([9.25, 9.25], [2, 2.3], 'k-', linewidth=1.5)

    # Output label
    ax.text(10.5, 4.5, 'Vout = 6V\n(constant)', fontsize=10, color='green', fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.5))

    save(fig, 'cuet-phy-semi-diode-d02.png')


def semi_pn_d01():
    """I-V characteristic of p-n junction diode."""
    fig, ax = plt.subplots(**STYLE)

    # Forward bias
    V_f = np.linspace(0, 1.2, 300)
    I_f = np.where(V_f < 0.7, 0.1 * (np.exp(5 * V_f) - 1) * 0.001,
                   (V_f - 0.7) / 0.02 + 0.5)
    I_f = np.clip(I_f, 0, 50)

    # Reverse bias
    V_r = np.linspace(-5, 0, 200)
    I_r = -0.01 * np.ones_like(V_r)

    ax.plot(V_f, I_f, 'b-', linewidth=2)
    ax.plot(V_r, I_r, 'b-', linewidth=2)

    # Mark knee voltage
    ax.axvline(x=0.7, color='red', linestyle='--', alpha=0.6)
    ax.text(0.73, 20, 'Vk = 0.7V', fontsize=10, color='red', fontweight='bold')

    # Mark regions
    ax.annotate('Forward\nbias', xy=(0.9, 35), fontsize=10, color='blue')
    ax.annotate('Reverse bias', xy=(-4, -2), fontsize=10, color='blue')

    ax.set_xlabel('Voltage V (volts)', fontsize=12)
    ax.set_ylabel('Current I (mA)', fontsize=12)
    ax.set_title('I-V Characteristic of p-n Junction Diode', fontsize=12, fontweight='bold')
    ax.axhline(y=0, color='k', linewidth=0.8)
    ax.axvline(x=0, color='k', linewidth=0.8)
    ax.set_xlim(-5.5, 1.5)
    ax.set_ylim(-5, 50)
    ax.grid(True, alpha=0.3)
    save(fig, 'cuet-phy-semi-pn-d01.png')


def semi_pn_d02():
    """Energy band diagram of p-n junction at equilibrium."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-5, 5)
    ax.set_ylim(-1, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Energy Band Diagram of p-n Junction (Equilibrium)', fontsize=11, fontweight='bold')

    # p-side bands (left)
    ax.plot([-4.5, -0.5], [5, 5], 'b-', linewidth=2)  # conduction band p
    ax.plot([-4.5, -0.5], [2, 2], 'r-', linewidth=2)  # valence band p
    ax.plot([-4.5, -0.5], [3.2, 3.2], 'g--', linewidth=1.5)  # Fermi level p

    # n-side bands (right, shifted down by Vbi)
    ax.plot([0.5, 4.5], [3.5, 3.5], 'b-', linewidth=2)  # conduction band n
    ax.plot([0.5, 4.5], [0.5, 0.5], 'r-', linewidth=2)  # valence band n
    ax.plot([0.5, 4.5], [3.2, 3.2], 'g--', linewidth=1.5)  # Fermi level n (aligned)

    # Transition region (curved bands)
    x_trans = np.linspace(-0.5, 0.5, 50)
    # Conduction band curves from 5 to 3.5
    cb_trans = 5 + (3.5 - 5) * (x_trans + 0.5)
    ax.plot(x_trans, cb_trans, 'b-', linewidth=2)
    # Valence band curves from 2 to 0.5
    vb_trans = 2 + (0.5 - 2) * (x_trans + 0.5)
    ax.plot(x_trans, vb_trans, 'r-', linewidth=2)

    # Labels
    ax.text(-3.5, 5.3, 'Ec (p)', fontsize=9, color='blue')
    ax.text(-3.5, 1.5, 'Ev (p)', fontsize=9, color='red')
    ax.text(2, 3.8, 'Ec (n)', fontsize=9, color='blue')
    ax.text(2, 0.0, 'Ev (n)', fontsize=9, color='red')
    ax.text(-4.5, 3.5, 'EF', fontsize=10, color='green', fontweight='bold')

    # Depletion region
    ax.annotate('', xy=(0.5, -0.5), xytext=(-0.5, -0.5),
                arrowprops=dict(arrowstyle='<->', lw=2, color='purple'))
    ax.text(0, -0.9, 'W (depletion)', ha='center', fontsize=9, color='purple', fontweight='bold')

    # Built-in potential
    ax.annotate('', xy=(1.5, 5), xytext=(1.5, 3.5),
                arrowprops=dict(arrowstyle='<->', lw=1.5, color='orange'))
    ax.text(2.0, 4.25, 'eVbi', fontsize=10, color='orange', fontweight='bold')

    # Side labels
    ax.text(-3, 6, 'p-type', fontsize=12, fontweight='bold', ha='center')
    ax.text(3, 6, 'n-type', fontsize=12, fontweight='bold', ha='center')

    save(fig, 'cuet-phy-semi-pn-d02.png')


def semi_transistor_d01():
    """NPN transistor output characteristics (Ic vs Vce)."""
    fig, ax = plt.subplots(**STYLE)

    Vce = np.linspace(0, 10, 300)

    # Two Ib curves
    Ib1, Ib2 = 20, 40  # μA
    Ic1 = 2.0 * (1 - np.exp(-3 * Vce)) + 0.05 * Vce   # mA, β=100
    Ic2 = 4.0 * (1 - np.exp(-3 * Vce)) + 0.08 * Vce

    ax.plot(Vce, Ic1, 'b-', linewidth=2, label=f'Ib₁ = {Ib1} μA')
    ax.plot(Vce, Ic2, 'r-', linewidth=2, label=f'Ib₂ = {Ib2} μA')

    # Mark Ic = 2 mA for Ib1
    ax.axhline(y=2.0, color='blue', linestyle=':', alpha=0.5)
    ax.text(8, 2.3, 'Ic = 2 mA', fontsize=9, color='blue')

    # Regions
    ax.axvline(x=0.5, color='gray', linestyle='--', alpha=0.5)
    ax.text(0.1, 4.5, 'Sat.', fontsize=8, color='gray')
    ax.text(3, 4.8, 'Active Region', fontsize=10, color='gray', fontstyle='italic')

    ax.set_xlabel('Vce (V)', fontsize=12)
    ax.set_ylabel('Ic (mA)', fontsize=12)
    ax.set_title('NPN Transistor Output Characteristics (CE)', fontsize=12, fontweight='bold')
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)
    ax.set_xlim(-0.5, 11)
    ax.set_ylim(-0.5, 6)
    save(fig, 'cuet-phy-semi-transistor-d01.png')


def semi_transistor_d02():
    """NAND gate symbol with truth table."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-2, 10)
    ax.set_ylim(-1, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('NAND Gate', fontsize=14, fontweight='bold')

    # Gate body (rounded rectangle shape)
    # Left flat side
    ax.plot([2, 2], [2, 5], 'k-', linewidth=2)
    # Curved right side (arc)
    theta = np.linspace(-np.pi / 2, np.pi / 2, 100)
    r = 1.5
    cx, cy = 3.5, 3.5
    ax.plot(cx + r * np.cos(theta), cy + r * np.sin(theta), 'k-', linewidth=2)
    # Top and bottom
    ax.plot([2, 3.5], [5, 5], 'k-', linewidth=2)
    ax.plot([2, 3.5], [2, 2], 'k-', linewidth=2)

    # Small circle (NOT bubble)
    bubble = plt.Circle((5.2, 3.5), 0.2, fill=False, edgecolor='black', linewidth=2)
    ax.add_patch(bubble)

    # Input lines
    ax.plot([0, 2], [4.2, 4.2], 'k-', linewidth=1.5)
    ax.plot([0, 2], [2.8, 2.8], 'k-', linewidth=1.5)
    ax.text(-0.3, 4.2, 'A', fontsize=12, fontweight='bold', ha='right', va='center')
    ax.text(-0.3, 2.8, 'B', fontsize=12, fontweight='bold', ha='right', va='center')

    # Output line
    ax.plot([5.4, 7], [3.5, 3.5], 'k-', linewidth=1.5)
    ax.text(7.3, 3.5, 'Y = A·B', fontsize=12, fontweight='bold', va='center')

    # Truth table
    tt_x, tt_y = 1, -0.5
    table_data = [['A', 'B', 'Y'],
                  ['0', '0', '1'],
                  ['0', '1', '1'],
                  ['1', '0', '1'],
                  ['1', '1', '0']]

    table = ax.table(cellText=table_data[1:], colLabels=table_data[0],
                     cellLoc='center', loc='lower center',
                     bbox=[0.25, -0.15, 0.5, 0.35])
    table.auto_set_font_size(False)
    table.set_fontsize(10)
    for key, cell in table.get_celld().items():
        cell.set_edgecolor('black')
        if key[0] == 0:
            cell.set_facecolor('lightblue')
            cell.set_text_props(fontweight='bold')
        elif key[0] == 4:  # Last row (1,1 -> 0)
            cell.set_facecolor('lightyellow')

    save(fig, 'cuet-phy-semi-transistor-d02.png')


# ═══════════════════════════════════════════════════════════════════════
# ELECTROSTATICS
# ═══════════════════════════════════════════════════════════════════════

def pot_cap_d01():
    """Parallel plate capacitor with separation changing."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-1, 10)
    ax.set_ylim(-1, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Parallel Plate Capacitor', fontsize=13, fontweight='bold')

    # Left capacitor (original, d)
    ax.add_patch(patches.Rectangle((0.5, 1), 0.3, 4.5, facecolor='lightblue', edgecolor='blue', linewidth=2))
    ax.add_patch(patches.Rectangle((3.2, 1), 0.3, 4.5, facecolor='lightcoral', edgecolor='red', linewidth=2))
    ax.text(0.65, 5.8, '+Q', fontsize=11, ha='center', color='blue', fontweight='bold')
    ax.text(3.35, 5.8, '−Q', fontsize=11, ha='center', color='red', fontweight='bold')

    # E field arrows
    for y in [2, 3.25, 4.5]:
        ax.annotate('', xy=(3, y), xytext=(1, y),
                    arrowprops=dict(arrowstyle='->', lw=1.5, color='green'))
    ax.text(1.8, 1.2, 'E', fontsize=12, color='green', fontweight='bold')

    # d label
    ax.annotate('', xy=(3.2, 0.5), xytext=(0.8, 0.5),
                arrowprops=dict(arrowstyle='<->', lw=1.5, color='black'))
    ax.text(2, 0.1, 'd', fontsize=12, ha='center', fontweight='bold')

    # Arrow showing separation increase
    ax.annotate('', xy=(8, 3.25), xytext=(5, 3.25),
                arrowprops=dict(arrowstyle='->', lw=2.5, color='purple'))
    ax.text(6.5, 3.8, 'd → 2d', fontsize=12, color='purple', fontweight='bold', ha='center')

    # Right capacitor (2d)
    ax.add_patch(patches.Rectangle((6.5, 1), 0.3, 4.5, facecolor='lightblue', edgecolor='blue', linewidth=2))
    ax.add_patch(patches.Rectangle((9.8, 1), 0.3, 4.5, facecolor='lightcoral', edgecolor='red', linewidth=2))

    # 2d label (right side, below)
    ax.annotate('', xy=(9.8, 0.5), xytext=(6.8, 0.5),
                arrowprops=dict(arrowstyle='<->', lw=1.5, color='black'))
    ax.text(8.3, 0.1, '2d', fontsize=12, ha='center', fontweight='bold')

    # Q constant label
    ax.text(5, 6.2, 'Charge Q = constant', fontsize=11, ha='center',
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8), fontweight='bold')

    save(fig, 'cuet-phy-pot-cap-d01.png')


def pot_cap_d02():
    """RC charging curve."""
    fig, ax = plt.subplots(**STYLE)
    t = np.linspace(0, 5, 300)  # in units of RC
    V0 = 10
    V = V0 * (1 - np.exp(-t))

    ax.plot(t, V, 'b-', linewidth=2.5)

    # Mark τ = RC
    ax.axvline(x=1, color='red', linestyle='--', alpha=0.6)
    ax.axhline(y=V0 * 0.632, color='red', linestyle='--', alpha=0.6)
    ax.plot(1, V0 * 0.632, 'ro', markersize=8)

    ax.text(1.1, 7.5, f'V = 0.632 V₀\n= {V0 * 0.632:.1f} V', fontsize=10, color='red', fontweight='bold')
    ax.text(1.05, -0.7, 'τ = RC', fontsize=10, ha='center', color='red', fontweight='bold')

    # Asymptote
    ax.axhline(y=V0, color='gray', linestyle=':', alpha=0.6)
    ax.text(4, V0 + 0.3, f'V₀ = {V0} V', fontsize=10, color='gray')

    ax.set_xlabel('Time t (in units of RC)', fontsize=12)
    ax.set_ylabel('Voltage V (volts)', fontsize=12)
    ax.set_title('RC Charging Curve: V(t) = V₀(1 − e⁻ᵗ/ᴿᶜ)', fontsize=12, fontweight='bold')
    ax.set_xlim(-0.2, 5.5)
    ax.set_ylim(-1, 11.5)
    ax.grid(True, alpha=0.3)
    save(fig, 'cuet-phy-pot-cap-d02.png')


def pot_dielec_d01():
    """Parallel plate capacitor with half-thickness dielectric."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-1, 8)
    ax.set_ylim(-1, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Capacitor with Partial Dielectric (K=3)', fontsize=12, fontweight='bold')

    # Plates
    ax.add_patch(patches.Rectangle((1, 0.5), 0.2, 5, facecolor='lightblue', edgecolor='blue', linewidth=2))
    ax.add_patch(patches.Rectangle((5.8, 0.5), 0.2, 5, facecolor='lightcoral', edgecolor='red', linewidth=2))

    # Dielectric (bottom half)
    ax.add_patch(patches.Rectangle((1.2, 0.5), 4.6, 2.5,
                                    facecolor='lightyellow', edgecolor='orange', linewidth=1.5, alpha=0.7))
    ax.text(3.5, 1.75, 'K = 3', fontsize=14, ha='center', va='center',
            fontweight='bold', color='orange')

    # Air (top half)
    ax.text(3.5, 4.0, 'Air (K=1)', fontsize=11, ha='center', va='center', color='gray')

    # d labels
    # Total d
    ax.annotate('', xy=(6.5, 5.5), xytext=(6.5, 0.5),
                arrowprops=dict(arrowstyle='<->', lw=1.5, color='black'))
    ax.text(6.8, 3, 'd', fontsize=13, fontweight='bold')

    # d/2 labels
    ax.annotate('', xy=(0.5, 3), xytext=(0.5, 0.5),
                arrowprops=dict(arrowstyle='<->', lw=1, color='purple'))
    ax.text(-0.3, 1.75, 'd/2', fontsize=10, color='purple', fontweight='bold')

    ax.annotate('', xy=(0.5, 5.5), xytext=(0.5, 3),
                arrowprops=dict(arrowstyle='<->', lw=1, color='purple'))
    ax.text(-0.3, 4.25, 'd/2', fontsize=10, color='purple', fontweight='bold')

    # Dividing line
    ax.plot([1.2, 5.8], [3, 3], 'k--', linewidth=1, alpha=0.5)

    # Formula
    ax.text(3.5, -0.5, 'C = 2KC₀/(1+K) = 1.5C₀', fontsize=11, ha='center',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.5), fontweight='bold')

    save(fig, 'cuet-phy-pot-dielec-d01.png')


def pot_dielec_d02():
    """Capacitor circuit: C1,C2 series in parallel with C3."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-1, 12)
    ax.set_ylim(-1, 8)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Capacitor Circuit', fontsize=13, fontweight='bold')

    # Battery
    ax.plot([1, 1], [1, 6], 'k-', linewidth=1.5)  # left wire
    ax.plot([0.5, 1.5], [6, 6], 'k-', linewidth=3)  # long plate (+)
    ax.plot([0.7, 1.3], [5.5, 5.5], 'k-', linewidth=1.5)  # short plate (−)
    ax.text(0.3, 6.2, '+', fontsize=12, fontweight='bold', color='red')
    ax.text(0.3, 5.2, '−', fontsize=12, fontweight='bold', color='blue')
    ax.text(0, 5.7, '10V', fontsize=10, ha='right')

    # Top wire
    ax.plot([1, 10], [6, 6], 'k-', linewidth=1.5)

    # Bottom wire
    ax.plot([1, 10], [1, 1], 'k-', linewidth=1.5)

    # Series branch (C1 and C2 on top path)
    # C1
    ax.plot([3, 3], [6, 5.5], 'k-', linewidth=1.5)
    ax.plot([2.5, 3.5], [5.5, 5.5], 'b-', linewidth=3)
    ax.plot([2.5, 3.5], [5.0, 5.0], 'b-', linewidth=3)
    ax.plot([3, 3], [5.0, 4.3], 'k-', linewidth=1.5)
    ax.text(3.8, 5.25, 'C₁=2μF', fontsize=10, color='blue', fontweight='bold')

    # C2
    ax.plot([3, 3], [4.3, 3.8], 'k-', linewidth=1.5)
    ax.plot([2.5, 3.5], [3.8, 3.8], 'b-', linewidth=3)
    ax.plot([2.5, 3.5], [3.3, 3.3], 'b-', linewidth=3)
    ax.plot([3, 3], [3.3, 1], 'k-', linewidth=1.5)
    ax.text(3.8, 3.55, 'C₂=3μF', fontsize=10, color='blue', fontweight='bold')

    # C3 (parallel branch)
    ax.plot([8, 8], [6, 4.8], 'k-', linewidth=1.5)
    ax.plot([7.5, 8.5], [4.8, 4.8], 'r-', linewidth=3)
    ax.plot([7.5, 8.5], [4.3, 4.3], 'r-', linewidth=3)
    ax.plot([8, 8], [4.3, 1], 'k-', linewidth=1.5)
    ax.text(8.8, 4.55, 'C₃=4μF', fontsize=10, color='red', fontweight='bold')

    # Result annotation
    ax.text(6, -0.2, 'Q₃ = C₃ × V = 4μF × 10V = 40 μC', fontsize=10, ha='center',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.5), fontweight='bold')

    save(fig, 'cuet-phy-pot-dielec-d02.png')


def pot_potential_d01():
    """Equipotential surfaces around a point charge."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_aspect('equal')

    # Concentric circles (equipotential surfaces)
    r_vals = [1, 2, 3]
    v_vals = [60, 30, 20]
    colors = ['red', 'orange', 'blue']

    for r, v, c in zip(r_vals, v_vals, colors):
        circle = plt.Circle((0, 0), r, fill=False, edgecolor=c, linewidth=2, linestyle='-')
        ax.add_patch(circle)
        ax.text(r * 0.707 + 0.15, r * 0.707 + 0.15, f'{v}V', fontsize=11,
                color=c, fontweight='bold')

    # Point charge at center
    ax.plot(0, 0, 'ko', markersize=10)
    ax.text(0.2, -0.3, '+Q', fontsize=12, fontweight='bold')

    # Radii labels
    ax.annotate('', xy=(1, 0), xytext=(0, 0),
                arrowprops=dict(arrowstyle='->', lw=1, color='gray'))
    ax.text(0.4, -0.5, 'r₁', fontsize=10, color='gray')

    ax.annotate('', xy=(2, 0), xytext=(0, 0),
                arrowprops=dict(arrowstyle='->', lw=1, color='gray'))
    ax.text(1.1, -0.5, 'r₂', fontsize=10, color='gray')

    ax.annotate('', xy=(3, 0), xytext=(0, 0),
                arrowprops=dict(arrowstyle='->', lw=1, color='gray'))
    ax.text(2.0, -0.5, 'r₃', fontsize=10, color='gray')

    ax.set_xlim(-4, 4)
    ax.set_ylim(-4, 4)
    ax.set_title('Equipotential Surfaces (r₁:r₂:r₃ = 1:2:3)', fontsize=12, fontweight='bold')
    ax.grid(True, alpha=0.2)
    ax.set_xlabel('x', fontsize=11)
    ax.set_ylabel('y', fontsize=11)
    save(fig, 'cuet-phy-pot-potential-d01.png')


def pot_potential_d02():
    """V vs x for two equal positive charges at ±a."""
    fig, ax = plt.subplots(**STYLE)
    a = 2.0
    x = np.linspace(-6, 6, 500)
    # V = kQ/|x-a| + kQ/|x+a| (normalized, kQ=1)
    V = 1.0 / np.maximum(np.abs(x - a), 0.15) + 1.0 / np.maximum(np.abs(x + a), 0.15)
    V = np.clip(V, 0, 8)

    ax.plot(x, V, 'b-', linewidth=2.5)

    # Mark charge positions
    ax.axvline(x=-a, color='red', linestyle='--', alpha=0.5)
    ax.axvline(x=a, color='red', linestyle='--', alpha=0.5)
    ax.text(-a, -0.5, '−a', fontsize=12, ha='center', fontweight='bold', color='red')
    ax.text(a, -0.5, '+a', fontsize=12, ha='center', fontweight='bold', color='red')

    # Mark midpoint
    V_mid = 2.0 / a  # = 2kQ/a (normalized kQ=1)
    ax.plot(0, V_mid, 'go', markersize=8)
    ax.text(0.3, V_mid + 0.3, f'V(0) = 2kQ/a', fontsize=10, color='green', fontweight='bold')

    # Mark local minimum at x=0
    ax.annotate('Local minimum\n(still positive)', xy=(0, V_mid), xytext=(2, 2),
                fontsize=9, color='green',
                arrowprops=dict(arrowstyle='->', color='green'))

    ax.set_xlabel('Position x', fontsize=12)
    ax.set_ylabel('Potential V (arb. units)', fontsize=12)
    ax.set_title('V vs x for Two Equal Positive Charges at x = ±a', fontsize=11, fontweight='bold')
    ax.axhline(y=0, color='k', linewidth=0.8)
    ax.set_xlim(-6, 6)
    ax.set_ylim(-1, 8.5)
    ax.grid(True, alpha=0.3)
    save(fig, 'cuet-phy-pot-potential-d02.png')


# ═══════════════════════════════════════════════════════════════════════
# EM INDUCTION AND AC
# ═══════════════════════════════════════════════════════════════════════

def ac_circuits_d01():
    """Phasor diagram for series LCR circuit (VL > VC)."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-3, 8)
    ax.set_ylim(-4, 6)
    ax.set_aspect('equal')
    ax.set_title('Phasor Diagram: Series LCR (VL > VC)', fontsize=12, fontweight='bold')

    # VR (horizontal, in phase with I)
    VR = 4
    ax.annotate('', xy=(VR, 0), xytext=(0, 0),
                arrowprops=dict(arrowstyle='->', lw=2.5, color='blue'))
    ax.text(VR / 2, -0.6, 'VR', fontsize=12, color='blue', fontweight='bold', ha='center')

    # VL (upward, 90° ahead of I)
    VL = 4.5
    ax.annotate('', xy=(0, VL), xytext=(0, 0),
                arrowprops=dict(arrowstyle='->', lw=2.5, color='red'))
    ax.text(-0.6, VL / 2, 'VL', fontsize=12, color='red', fontweight='bold')

    # VC (downward, 90° behind I)
    VC = 2.0
    ax.annotate('', xy=(0, -VC), xytext=(0, 0),
                arrowprops=dict(arrowstyle='->', lw=2.5, color='green'))
    ax.text(-0.7, -VC / 2, 'VC', fontsize=12, color='green', fontweight='bold')

    # Net reactive voltage VL - VC
    VL_VC = VL - VC
    ax.annotate('', xy=(VR, VL_VC), xytext=(VR, 0),
                arrowprops=dict(arrowstyle='->', lw=1.5, color='purple', linestyle='dashed'))
    ax.text(VR + 0.3, VL_VC / 2, 'VL−VC', fontsize=10, color='purple')

    # Resultant V
    V_mag = np.sqrt(VR ** 2 + VL_VC ** 2)
    phi = np.degrees(np.arctan2(VL_VC, VR))
    ax.annotate('', xy=(VR, VL_VC), xytext=(0, 0),
                arrowprops=dict(arrowstyle='->', lw=3, color='black'))
    ax.text(VR / 2 + 0.5, VL_VC / 2 + 0.5, f'V (resultant)', fontsize=11,
            fontweight='bold')

    # Phase angle
    angle = np.linspace(0, np.radians(phi), 50)
    r_arc = 1.5
    ax.plot(r_arc * np.cos(angle), r_arc * np.sin(angle), 'k-', linewidth=1.5)
    ax.text(1.8, 0.4, f'φ = {phi:.0f}°', fontsize=10, fontweight='bold')

    # Current reference
    ax.annotate('', xy=(5, 0), xytext=(4.5, 0),
                arrowprops=dict(arrowstyle='->', lw=1.5, color='orange'))
    ax.text(5.2, -0.3, 'I', fontsize=12, color='orange', fontweight='bold')

    ax.axhline(y=0, color='k', linewidth=0.5, alpha=0.3)
    ax.axvline(x=0, color='k', linewidth=0.5, alpha=0.3)
    ax.grid(True, alpha=0.2)
    save(fig, 'cuet-phy-ac-circuits-d01.png')


def ac_circuits_d02():
    """Impedance Z vs frequency f for series LCR circuit."""
    fig, ax = plt.subplots(**STYLE)

    f = np.linspace(50, 1000, 500)
    f0 = 500  # resonant frequency
    R = 50
    L = R / (2 * np.pi * 20)  # chosen so bandwidth ~ 20 Hz
    C = 1 / (4 * np.pi ** 2 * f0 ** 2 * L)

    XL = 2 * np.pi * f * L
    XC = 1 / (2 * np.pi * f * C)
    Z = np.sqrt(R ** 2 + (XL - XC) ** 2)

    ax.plot(f, Z, 'b-', linewidth=2.5)

    # Mark resonance
    ax.axvline(x=f0, color='red', linestyle='--', alpha=0.6)
    ax.plot(f0, R, 'ro', markersize=8)
    ax.text(f0 + 10, R + 20, f'Z_min = R = {R}Ω\nat f₀ = {f0} Hz', fontsize=10,
            color='red', fontweight='bold')

    ax.set_xlabel('Frequency f (Hz)', fontsize=12)
    ax.set_ylabel('Impedance Z (Ω)', fontsize=12)
    ax.set_title('Z vs f for Series LCR Circuit', fontsize=13, fontweight='bold')
    ax.grid(True, alpha=0.3)
    ax.set_xlim(0, 1050)
    save(fig, 'cuet-phy-ac-circuits-d02.png')


def ac_transform_d01():
    """Step-up transformer diagram."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-1, 12)
    ax.set_ylim(-1, 8)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Step-Up Transformer', fontsize=14, fontweight='bold')

    # Iron core (two vertical bars)
    ax.add_patch(patches.Rectangle((3, 1), 0.6, 5.5, facecolor='gray', edgecolor='black', linewidth=2, alpha=0.5))
    ax.add_patch(patches.Rectangle((7.4, 1), 0.6, 5.5, facecolor='gray', edgecolor='black', linewidth=2, alpha=0.5))
    # Top and bottom connecting bars
    ax.add_patch(patches.Rectangle((3, 6), 5, 0.5, facecolor='gray', edgecolor='black', linewidth=2, alpha=0.5))
    ax.add_patch(patches.Rectangle((3, 1), 5, 0.5, facecolor='gray', edgecolor='black', linewidth=2, alpha=0.5))

    # Primary coil (fewer turns - left side)
    for i in range(5):
        y = 2 + i * 0.8
        # Simple coil representation
        arc = patches.Arc((3, y), 1.5, 0.6, angle=0, theta1=90, theta2=270,
                          linewidth=2, color='blue')
        ax.add_patch(arc)
    ax.text(1.5, 3.5, 'Np = 100', fontsize=10, color='blue', fontweight='bold', ha='center')

    # Secondary coil (more turns - right side)
    for i in range(8):
        y = 1.8 + i * 0.55
        arc = patches.Arc((8, y), 1.5, 0.5, angle=0, theta1=-90, theta2=90,
                          linewidth=2, color='red')
        ax.add_patch(arc)
    ax.text(9.5, 3.5, 'Ns = 500', fontsize=10, color='red', fontweight='bold', ha='center')

    # Input label
    ax.text(1.5, 0.3, 'Vp = 220 V\n(Input)', fontsize=10, color='blue',
            ha='center', fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.5))

    # Output label
    ax.text(9.5, 0.3, 'Vs = ?\n(Output)', fontsize=10, color='red',
            ha='center', fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.5))

    # Formula
    ax.text(5.5, -0.5, 'Vs/Vp = Ns/Np → Vs = 220 × 500/100 = 1100 V', fontsize=9,
            ha='center', fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.5))

    # Iron core label
    ax.text(5.5, 7, 'Iron Core', fontsize=10, ha='center', color='gray', fontweight='bold')

    save(fig, 'cuet-phy-ac-transform-d01.png')


def ac_transform_d02():
    """Resonance curve: I vs f with half-power bandwidth."""
    fig, ax = plt.subplots(**STYLE)

    f = np.linspace(400, 600, 500)
    f0 = 500
    gamma = 10  # half-width
    I_max = 5

    # Lorentzian-like resonance curve
    I = I_max * gamma ** 2 / ((f - f0) ** 2 + gamma ** 2)

    ax.plot(f, I, 'b-', linewidth=2.5)

    # Half-power level
    I_half = I_max / np.sqrt(2)
    ax.axhline(y=I_half, color='red', linestyle='--', alpha=0.6)
    ax.text(405, I_half + 0.15, f'Imax/√2 = {I_half:.2f}', fontsize=9, color='red')

    # Half-power frequencies
    f1, f2 = 490, 510
    ax.axvline(x=f1, color='green', linestyle='--', alpha=0.6)
    ax.axvline(x=f2, color='green', linestyle='--', alpha=0.6)
    ax.text(f1 - 2, -0.5, f'f₁={f1}', fontsize=9, color='green', ha='right', fontweight='bold')
    ax.text(f2 + 2, -0.5, f'f₂={f2}', fontsize=9, color='green', fontweight='bold')

    # Resonant frequency
    ax.axvline(x=f0, color='blue', linestyle=':', alpha=0.5)
    ax.plot(f0, I_max, 'bo', markersize=8)
    ax.text(f0 + 3, I_max + 0.2, f'f₀={f0} Hz\nImax={I_max}', fontsize=9,
            color='blue', fontweight='bold')

    # Bandwidth annotation
    ax.annotate('', xy=(f2, I_half - 0.5), xytext=(f1, I_half - 0.5),
                arrowprops=dict(arrowstyle='<->', lw=2, color='purple'))
    ax.text(f0, I_half - 1.0, 'Δf = 20 Hz', fontsize=10, ha='center',
            color='purple', fontweight='bold')

    # Q factor
    ax.text(420, 4, f'Q = f₀/Δf = {f0}/20 = 25', fontsize=11,
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8), fontweight='bold')

    ax.set_xlabel('Frequency f (Hz)', fontsize=12)
    ax.set_ylabel('Current I (A)', fontsize=12)
    ax.set_title('Resonance Curve: I vs f (Series LCR)', fontsize=12, fontweight='bold')
    ax.grid(True, alpha=0.3)
    ax.set_xlim(395, 605)
    ax.set_ylim(-0.5, 6)
    save(fig, 'cuet-phy-ac-transform-d02.png')


# ═══════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════
ALL_GENERATORS = [
    # Dual Nature (4)
    dual_debroglie_d01,
    dual_debroglie_d02,
    dual_photo_d01,
    dual_photo_d02,
    # Electronic Devices (6)
    semi_diode_d01,
    semi_diode_d02,
    semi_pn_d01,
    semi_pn_d02,
    semi_transistor_d01,
    semi_transistor_d02,
    # Electrostatics (6)
    pot_cap_d01,
    pot_cap_d02,
    pot_dielec_d01,
    pot_dielec_d02,
    pot_potential_d01,
    pot_potential_d02,
    # EM Induction (4)
    ac_circuits_d01,
    ac_circuits_d02,
    ac_transform_d01,
    ac_transform_d02,
]

def main():
    print(f"\nBatch 2 Diagram Generator")
    print(f"{'═' * 50}")
    print(f"Output dir: {OUT_DIR}")
    print(f"Diagrams to generate: {len(ALL_GENERATORS)}\n")

    errors = 0
    for gen_fn in ALL_GENERATORS:
        try:
            gen_fn()
        except Exception as e:
            print(f"  FAIL: {gen_fn.__name__}: {e}")
            errors += 1

    print(f"\n{'═' * 50}")
    print(f"Generated: {len(ALL_GENERATORS) - errors}, Errors: {errors}")
    if errors:
        sys.exit(1)
    print("All 20 diagrams generated successfully!")


if __name__ == "__main__":
    main()
