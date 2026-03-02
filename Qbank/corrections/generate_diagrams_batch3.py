#!/usr/bin/env python3
"""
Generate 28 diagram PNGs for Batch 3 correction questions using matplotlib.
Covers: EM Induction (4), EM Waves (2), Magnetic Effects (10), Optics (12)

Usage:
  python3 Qbank/corrections/generate_diagrams_batch3.py
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
# EM INDUCTION (remaining)
# ═══════════════════════════════════════════════════════════════════════

def emi_faraday_d01():
    """EMF vs time: magnet dropped through a coil."""
    fig, ax = plt.subplots(**STYLE)
    t = np.linspace(0, 4, 500)
    # Two Gaussian peaks: positive entering, negative exiting
    emf = 3 * np.exp(-8 * (t - 1.2)**2) - 3.5 * np.exp(-8 * (t - 2.8)**2)
    ax.plot(t, emf, 'b-', linewidth=2.5)
    ax.axhline(y=0, color='k', linewidth=0.8)
    ax.fill_between(t, emf, 0, where=(emf > 0), alpha=0.2, color='blue')
    ax.fill_between(t, emf, 0, where=(emf < 0), alpha=0.2, color='red')
    ax.text(1.2, 3.3, 'Magnet\nentering', ha='center', fontsize=9, color='blue')
    ax.text(2.8, -3.8, 'Magnet\nexiting', ha='center', fontsize=9, color='red')
    ax.set_xlabel('Time t (s)', fontsize=12)
    ax.set_ylabel('Induced EMF (V)', fontsize=12)
    ax.set_title('EMF vs Time: Magnet Through a Coil', fontsize=12, fontweight='bold')
    ax.grid(True, alpha=0.3)
    save(fig, 'cuet-phy-emi-faraday-d01.png')


def emi_faraday_d02():
    """Rectangular loop entering uniform B field region."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-1, 12)
    ax.set_ylim(-1, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Rectangular Loop Entering B Field', fontsize=12, fontweight='bold')
    # B field region (shaded)
    ax.add_patch(patches.Rectangle((5, 0.5), 6, 5.5, facecolor='lightyellow',
                                    edgecolor='orange', linewidth=2, linestyle='--'))
    ax.text(8, 5.2, 'B (into page)', fontsize=10, color='orange', fontweight='bold', ha='center')
    # X marks for B into page
    for x in [6, 7.5, 9, 10.5]:
        for y in [1.5, 3, 4.5]:
            ax.plot(x, y, 'x', color='orange', markersize=8, markeredgewidth=2)
    # Rectangular loop (partially inside)
    loop = patches.Rectangle((3.5, 1), 3, 4, fill=False, edgecolor='blue', linewidth=2.5)
    ax.add_patch(loop)
    ax.text(5, 3, 'Loop', ha='center', fontsize=10, color='blue', fontweight='bold')
    # Velocity arrow
    ax.annotate('', xy=(7.5, 0.3), xytext=(4, 0.3),
                arrowprops=dict(arrowstyle='->', lw=2.5, color='red'))
    ax.text(5.8, -0.3, 'v →', fontsize=12, color='red', fontweight='bold', ha='center')
    # Width label
    ax.annotate('', xy=(6.5, 5.3), xytext=(6.5, 1),
                arrowprops=dict(arrowstyle='<->', lw=1.5, color='green'))
    ax.text(6.9, 3.2, 'l', fontsize=14, color='green', fontweight='bold')
    # EMF label
    ax.text(2, 6, 'EMF = Blv', fontsize=12, fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.5))
    save(fig, 'cuet-phy-emi-faraday-d02.png')


def emi_induct_d01():
    """LR circuit current growth curve."""
    fig, ax = plt.subplots(**STYLE)
    t = np.linspace(0, 5, 300)
    I0 = 5
    I = I0 * (1 - np.exp(-t))
    ax.plot(t, I, 'b-', linewidth=2.5)
    ax.axhline(y=I0, color='gray', linestyle=':', alpha=0.6)
    ax.text(4, I0 + 0.2, f'I₀ = V/R = {I0} A', fontsize=10, color='gray')
    ax.axvline(x=1, color='red', linestyle='--', alpha=0.6)
    ax.axhline(y=I0 * 0.632, color='red', linestyle='--', alpha=0.6)
    ax.plot(1, I0 * 0.632, 'ro', markersize=8)
    ax.text(1.2, I0 * 0.632 + 0.3, f'0.632 I₀ = {I0 * 0.632:.2f} A',
            fontsize=10, color='red', fontweight='bold')
    ax.text(1.05, -0.5, 'τ = L/R', fontsize=10, ha='center', color='red', fontweight='bold')
    ax.set_xlabel('Time t (in units of L/R)', fontsize=12)
    ax.set_ylabel('Current I (A)', fontsize=12)
    ax.set_title('LR Circuit: Current Growth I(t) = I₀(1 − e⁻ᵗ/τ)', fontsize=11, fontweight='bold')
    ax.set_xlim(-0.2, 5.5)
    ax.set_ylim(-0.5, 6)
    ax.grid(True, alpha=0.3)
    save(fig, 'cuet-phy-emi-induct-d01.png')


def emi_induct_d02():
    """Two coils showing mutual inductance."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-1, 12)
    ax.set_ylim(-1, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Mutual Inductance', fontsize=14, fontweight='bold')
    # Primary coil
    for i in range(6):
        y = 1.5 + i * 0.65
        arc = patches.Arc((3, y), 2, 0.5, angle=0, theta1=0, theta2=360,
                          linewidth=2, color='blue')
        ax.add_patch(arc)
    ax.text(3, 0.7, 'Primary Coil', ha='center', fontsize=10, color='blue', fontweight='bold')
    ax.text(1, 3, 'AC\nSource', fontsize=9, color='blue',
            bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.5))
    # Secondary coil
    for i in range(6):
        y = 1.5 + i * 0.65
        arc = patches.Arc((8, y), 2, 0.5, angle=0, theta1=0, theta2=360,
                          linewidth=2, color='red')
        ax.add_patch(arc)
    ax.text(8, 0.7, 'Secondary Coil', ha='center', fontsize=10, color='red', fontweight='bold')
    ax.text(9.5, 3, 'Galvano-\nmeter', fontsize=9, color='red',
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.5))
    # Flux lines
    for y_off in [-0.5, 0, 0.5]:
        ax.annotate('', xy=(7, 3.5 + y_off), xytext=(4, 3.5 + y_off),
                    arrowprops=dict(arrowstyle='->', lw=1, color='green', linestyle='--'))
    ax.text(5.5, 5.5, 'Mutual flux Φ', fontsize=10, color='green', fontweight='bold', ha='center')
    ax.text(5.5, -0.3, 'EMF₂ = M × dI₁/dt', fontsize=11, ha='center', fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.5))
    save(fig, 'cuet-phy-emi-induct-d02.png')


# ═══════════════════════════════════════════════════════════════════════
# EM WAVES
# ═══════════════════════════════════════════════════════════════════════

def emwave_d01():
    """EM spectrum with wavelength ranges."""
    fig, ax = plt.subplots(figsize=(8, 4), dpi=150, facecolor='white')
    categories = ['Radio\nwaves', 'Micro-\nwaves', 'Infrared', 'Visible', 'Ultra-\nviolet', 'X-rays', 'Gamma\nrays']
    wavelengths = ['>1mm', '1mm-\n1μm', '1μm-\n700nm', '700-\n400nm', '400-\n1nm', '1nm-\n0.01nm', '<0.01nm']
    colors = ['#FFB3B3', '#FFD9B3', '#FFFE B3', '#B3FFB3', '#B3D9FF', '#D9B3FF', '#FFB3FF']
    colors = ['#FFB3B3', '#FFD9B3', '#FFFFB3', '#B3FFB3', '#B3D9FF', '#D9B3FF', '#FFB3FF']
    for i, (cat, wl, c) in enumerate(zip(categories, wavelengths, colors)):
        ax.add_patch(patches.Rectangle((i, 0), 0.95, 2, facecolor=c, edgecolor='black', linewidth=1.5))
        ax.text(i + 0.475, 1.3, cat, ha='center', va='center', fontsize=8, fontweight='bold')
        ax.text(i + 0.475, 0.5, wl, ha='center', va='center', fontsize=7, color='gray')
    ax.annotate('', xy=(7, 2.5), xytext=(0, 2.5),
                arrowprops=dict(arrowstyle='->', lw=2, color='red'))
    ax.text(3.5, 2.7, 'Increasing Frequency →', ha='center', fontsize=10, color='red')
    ax.annotate('', xy=(0, -0.5), xytext=(7, -0.5),
                arrowprops=dict(arrowstyle='->', lw=2, color='blue'))
    ax.text(3.5, -0.7, '← Increasing Wavelength', ha='center', fontsize=10, color='blue')
    ax.set_xlim(-0.3, 7.3)
    ax.set_ylim(-1, 3.2)
    ax.axis('off')
    ax.set_title('Electromagnetic Spectrum', fontsize=14, fontweight='bold')
    save(fig, 'cuet-phy-emwave-d01.png')


def emwave_d02():
    """EM wave: E and B fields perpendicular, propagating along x."""
    fig = plt.figure(figsize=(7, 4.5), dpi=150, facecolor='white')
    ax = fig.add_subplot(111, projection='3d')
    x = np.linspace(0, 4 * np.pi, 300)
    Ey = np.sin(x)
    Bz = np.sin(x)
    ax.plot(x, Ey, np.zeros_like(x), 'b-', linewidth=2, label='E (y-axis)')
    ax.plot(x, np.zeros_like(x), Bz, 'r-', linewidth=2, label='B (z-axis)')
    ax.plot(x, np.zeros_like(x), np.zeros_like(x), 'k--', linewidth=0.5, alpha=0.3)
    ax.set_xlabel('x (propagation)', fontsize=10)
    ax.set_ylabel('E field (y)', fontsize=10)
    ax.set_zlabel('B field (z)', fontsize=10)
    ax.set_title('EM Wave: E ⊥ B ⊥ Direction of Propagation', fontsize=11, fontweight='bold')
    ax.legend(fontsize=9)
    ax.view_init(elev=20, azim=-60)
    save(fig, 'cuet-phy-emwave-d02.png')


# ═══════════════════════════════════════════════════════════════════════
# MAGNETIC EFFECTS
# ═══════════════════════════════════════════════════════════════════════

def mag_biot_d01():
    """Two semicircular loops with opposite currents → B=0 at center."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_aspect('equal')
    theta1 = np.linspace(0, np.pi, 100)
    theta2 = np.linspace(np.pi, 2 * np.pi, 100)
    R = 2
    ax.plot(R * np.cos(theta1), R * np.sin(theta1), 'b-', linewidth=3, label='Semicircle 1 (I →)')
    ax.plot(R * np.cos(theta2), R * np.sin(theta2), 'r-', linewidth=3, label='Semicircle 2 (I ←)')
    # Current direction arrows
    ax.annotate('', xy=(0, 2.1), xytext=(-0.5, 2.05),
                arrowprops=dict(arrowstyle='->', lw=2, color='blue'))
    ax.annotate('', xy=(0, -2.1), xytext=(0.5, -2.05),
                arrowprops=dict(arrowstyle='->', lw=2, color='red'))
    # B vectors at center
    ax.annotate('', xy=(0, 0.6), xytext=(0, 0),
                arrowprops=dict(arrowstyle='->', lw=2, color='blue'))
    ax.text(0.2, 0.3, 'B₁↑', fontsize=10, color='blue', fontweight='bold')
    ax.annotate('', xy=(0, -0.6), xytext=(0, 0),
                arrowprops=dict(arrowstyle='->', lw=2, color='red'))
    ax.text(0.2, -0.4, 'B₂↓', fontsize=10, color='red', fontweight='bold')
    ax.plot(0, 0, 'ko', markersize=6)
    ax.text(0.3, 0, 'B_net = 0', fontsize=11, fontweight='bold', color='green',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.5))
    ax.set_xlim(-3, 3)
    ax.set_ylim(-3, 3)
    ax.set_title('Two Semicircular Loops (Opposite Currents)', fontsize=12, fontweight='bold')
    ax.legend(fontsize=9, loc='upper right')
    ax.grid(True, alpha=0.2)
    save(fig, 'cuet-phy-mag-biot-d01.png')


def mag_biot_d02():
    """B vs r from a straight wire: B = μ₀I/(2πr)."""
    fig, ax = plt.subplots(**STYLE)
    r = np.linspace(0.005, 0.1, 300)
    I = 10  # Amperes
    mu0 = 4 * np.pi * 1e-7
    B = mu0 * I / (2 * np.pi * r)
    ax.plot(r * 100, B * 1e4, 'b-', linewidth=2.5)  # r in cm, B in 10⁻⁴ T
    # Mark r=2cm point
    r_mark = 0.02
    B_mark = mu0 * I / (2 * np.pi * r_mark)
    ax.plot(r_mark * 100, B_mark * 1e4, 'ro', markersize=8)
    ax.annotate(f'B = {B_mark*1e4:.1f}×10⁻⁴ T\nat r = 2 cm',
                xy=(r_mark * 100, B_mark * 1e4), xytext=(4, 1.5),
                fontsize=10, color='red', fontweight='bold',
                arrowprops=dict(arrowstyle='->', color='red'))
    ax.set_xlabel('Distance r (cm)', fontsize=12)
    ax.set_ylabel('Magnetic Field B (×10⁻⁴ T)', fontsize=12)
    ax.set_title('B vs r: Long Straight Wire (I = 10 A)', fontsize=12, fontweight='bold')
    ax.text(6, 2.5, 'B = μ₀I/(2πr)', fontsize=11, color='blue',
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.5))
    ax.grid(True, alpha=0.3)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4)
    save(fig, 'cuet-phy-mag-biot-d02.png')


def mag_force_d01():
    """Charged particle in perpendicular B field → circular path."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_aspect('equal')
    # B field into page (X marks)
    for x in np.arange(-3, 4, 1):
        for y in np.arange(-3, 4, 1):
            ax.plot(x, y, 'x', color='orange', markersize=6, markeredgewidth=1, alpha=0.4)
    # Circular path
    theta = np.linspace(0, 2 * np.pi, 100)
    r = 2
    ax.plot(r * np.cos(theta), r * np.sin(theta), 'b-', linewidth=2.5)
    # Velocity arrow (tangential)
    ax.annotate('', xy=(0.5, 2.06), xytext=(-0.5, 1.94),
                arrowprops=dict(arrowstyle='->', lw=2, color='red'))
    ax.text(0, 2.5, 'v', fontsize=13, color='red', fontweight='bold', ha='center')
    # Force arrow (centripetal)
    ax.annotate('', xy=(0, 1.2), xytext=(0, 2),
                arrowprops=dict(arrowstyle='->', lw=2, color='green'))
    ax.text(0.3, 1.4, 'F = qvB', fontsize=10, color='green', fontweight='bold')
    # Radius
    ax.plot([0, 2], [0, 0], 'k--', linewidth=1)
    ax.text(1, -0.4, 'r = mv/(qB)', fontsize=10, fontweight='bold')
    # Proton label
    ax.plot(0, 2, 'ro', markersize=10)
    ax.text(-0.8, 2.5, 'Proton (+)', fontsize=10, color='red', fontweight='bold')
    ax.set_xlim(-4, 4)
    ax.set_ylim(-4, 4)
    ax.set_title('Proton in Perpendicular B Field (B into page)', fontsize=12, fontweight='bold')
    ax.grid(True, alpha=0.2)
    save(fig, 'cuet-phy-mag-force-d01.png')


def mag_force_d02():
    """Two parallel wires with currents in same direction → attractive."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-1, 8)
    ax.set_ylim(-1, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Force Between Parallel Current-Carrying Wires', fontsize=11, fontweight='bold')
    # Wire 1
    ax.plot([2, 2], [0.5, 6], 'b-', linewidth=3)
    ax.annotate('', xy=(2, 6), xytext=(2, 5.3),
                arrowprops=dict(arrowstyle='->', lw=2, color='blue'))
    ax.text(1.5, 6.3, 'I₁', fontsize=13, color='blue', fontweight='bold')
    # Wire 2
    ax.plot([5, 5], [0.5, 6], 'r-', linewidth=3)
    ax.annotate('', xy=(5, 6), xytext=(5, 5.3),
                arrowprops=dict(arrowstyle='->', lw=2, color='red'))
    ax.text(5.3, 6.3, 'I₂', fontsize=13, color='red', fontweight='bold')
    # Force arrows
    ax.annotate('', xy=(3, 3), xytext=(2.3, 3),
                arrowprops=dict(arrowstyle='->', lw=2.5, color='green'))
    ax.annotate('', xy=(4, 3), xytext=(4.7, 3),
                arrowprops=dict(arrowstyle='->', lw=2.5, color='green'))
    ax.text(3.5, 3.5, 'F (attract)', fontsize=11, ha='center', color='green', fontweight='bold')
    # Distance
    ax.annotate('', xy=(5, 0.3), xytext=(2, 0.3),
                arrowprops=dict(arrowstyle='<->', lw=1.5, color='black'))
    ax.text(3.5, -0.2, 'd', fontsize=12, ha='center', fontweight='bold')
    # Same direction label
    ax.text(3.5, -0.8, 'Same direction → Attractive', fontsize=10, ha='center',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.5), fontweight='bold')
    save(fig, 'cuet-phy-mag-force-d02.png')


def mag_device_d01():
    """Moving coil galvanometer schematic."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-1, 10)
    ax.set_ylim(-1, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Moving Coil Galvanometer', fontsize=13, fontweight='bold')
    # Magnet poles
    ax.add_patch(patches.Rectangle((1, 1.5), 1.2, 3.5, facecolor='lightcoral', edgecolor='red', linewidth=2))
    ax.text(1.6, 3.25, 'N', ha='center', va='center', fontsize=14, fontweight='bold', color='white')
    ax.add_patch(patches.Rectangle((7, 1.5), 1.2, 3.5, facecolor='lightblue', edgecolor='blue', linewidth=2))
    ax.text(7.6, 3.25, 'S', ha='center', va='center', fontsize=14, fontweight='bold', color='white')
    # Coil
    coil = patches.Rectangle((3, 2), 3.2, 2.5, fill=False, edgecolor='green', linewidth=2.5)
    ax.add_patch(coil)
    ax.text(4.6, 3.25, 'Coil\nN turns\nArea A', ha='center', va='center', fontsize=9, color='green', fontweight='bold')
    # Spring
    ax.plot([4.6, 4.6], [4.5, 5.5], 'k-', linewidth=1.5)
    spring_x = np.linspace(4.6, 5.5, 20)
    spring_y = 5.5 + 0.3 * np.sin(np.linspace(0, 4 * np.pi, 20))
    ax.plot(spring_x, spring_y, 'k-', linewidth=1.5)
    ax.text(5.2, 6, 'Spring (k)', fontsize=9, fontweight='bold')
    # Pointer
    ax.plot([4.6, 6.5], [5.5, 6.5], 'k-', linewidth=1.5)
    ax.text(6.8, 6.5, 'Pointer', fontsize=9)
    # Formula
    ax.text(4.6, 0.5, 'Sensitivity = NAB/k', fontsize=11, ha='center', fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8))
    save(fig, 'cuet-phy-mag-device-d01.png')


def mag_device_d02():
    """Cyclotron top view."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_aspect('equal')
    # Two dees
    theta1 = np.linspace(np.pi / 2, 3 * np.pi / 2, 100)
    theta2 = np.linspace(-np.pi / 2, np.pi / 2, 100)
    R = 3
    ax.fill(R * np.cos(theta1), R * np.sin(theta1), alpha=0.2, color='lightblue')
    ax.plot(R * np.cos(theta1), R * np.sin(theta1), 'b-', linewidth=2)
    ax.plot([0, 0], [-R, R], 'b-', linewidth=2)
    ax.fill(R * np.cos(theta2), R * np.sin(theta2), alpha=0.2, color='lightyellow')
    ax.plot(R * np.cos(theta2), R * np.sin(theta2), 'r-', linewidth=2)
    ax.plot([0.15, 0.15], [-R, R], 'r-', linewidth=2)
    ax.text(-1.5, 0, 'Dee 1', fontsize=11, ha='center', fontweight='bold', color='blue')
    ax.text(1.5, 0, 'Dee 2', fontsize=11, ha='center', fontweight='bold', color='red')
    # Gap label
    ax.text(0.07, -3.5, 'AC gap', fontsize=9, ha='center', color='gray')
    # Spiral path
    for i in range(4):
        r_i = 0.4 + i * 0.6
        t1 = np.linspace(np.pi / 2, 3 * np.pi / 2, 50)
        ax.plot(r_i * np.cos(t1), r_i * np.sin(t1), 'g-', linewidth=1, alpha=0.5)
        r_j = r_i + 0.3
        t2 = np.linspace(-np.pi / 2, np.pi / 2, 50)
        ax.plot(r_j * np.cos(t2), r_j * np.sin(t2), 'g-', linewidth=1, alpha=0.5)
    # B field label
    ax.text(0, 3.5, 'B ⊗ (into page)', fontsize=11, ha='center', fontweight='bold', color='purple')
    # Formula
    ax.text(0, -4.2, 'f = qB/(2πm)', fontsize=11, ha='center', fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.5))
    ax.set_xlim(-4, 4)
    ax.set_ylim(-5, 4.5)
    ax.set_title('Cyclotron (Top View)', fontsize=13, fontweight='bold')
    ax.axis('off')
    save(fig, 'cuet-phy-mag-device-d02.png')


def mag_dipole_d01():
    """Bar magnet in uniform field showing torque."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-4, 4)
    ax.set_ylim(-3, 4)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Magnetic Dipole in Uniform Field', fontsize=13, fontweight='bold')
    # Uniform B field arrows
    for y in [-2, -1, 0, 1, 2]:
        ax.annotate('', xy=(3.5, y), xytext=(-3.5, y),
                    arrowprops=dict(arrowstyle='->', lw=1, color='lightblue'))
    ax.text(3.5, 2.5, 'B →', fontsize=12, color='blue', fontweight='bold')
    # Bar magnet at angle
    angle = 40
    rad = np.radians(angle)
    length = 2.5
    dx, dy = length * np.cos(rad), length * np.sin(rad)
    ax.add_patch(patches.FancyBboxPatch((-dx / 2, -dy / 2), dx, dy, boxstyle="round,pad=0.1",
                                         facecolor='lightgray', edgecolor='black', linewidth=2,
                                         mutation_aspect=0.3))
    ax.text(-0.7, 0.5, 'N', fontsize=12, color='red', fontweight='bold')
    ax.text(0.5, -0.5, 'S', fontsize=12, color='blue', fontweight='bold')
    # Angle
    arc = patches.Arc((0, 0), 2, 2, angle=0, theta1=0, theta2=angle,
                      linewidth=2, color='red')
    ax.add_patch(arc)
    ax.text(1.2, 0.4, f'θ = {angle}°', fontsize=11, color='red', fontweight='bold')
    # Torque arrow
    ax.annotate('', xy=(0.3, 2.5), xytext=(-0.3, 2.5),
                arrowprops=dict(arrowstyle='->', lw=2.5, connectionstyle='arc3,rad=-0.5', color='green'))
    ax.text(0, 3.2, 'τ = MB sinθ', fontsize=12, color='green', fontweight='bold', ha='center')
    ax.text(0, -2.5, 'τ_max when θ = 90°', fontsize=11, ha='center',
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8), fontweight='bold')
    save(fig, 'cuet-phy-mag-dipole-d01.png')


def mag_dipole_d02():
    """Magnetic field lines of bar magnet."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_aspect('equal')
    # Bar magnet
    ax.add_patch(patches.Rectangle((-1, -0.3), 1, 0.6, facecolor='lightcoral', edgecolor='black', linewidth=2))
    ax.add_patch(patches.Rectangle((0, -0.3), 1, 0.6, facecolor='lightblue', edgecolor='black', linewidth=2))
    ax.text(-0.5, 0, 'S', ha='center', va='center', fontsize=14, fontweight='bold')
    ax.text(0.5, 0, 'N', ha='center', va='center', fontsize=14, fontweight='bold')
    # Field lines (dipole pattern)
    for spread in [0.3, 0.7, 1.2, 1.8]:
        # Top lines
        t = np.linspace(-1, 1, 100)
        x = 3 * t
        y = spread * np.sqrt(1 - t ** 2) * (1 + 0.3 * t)
        ax.plot(x, y, 'g-', linewidth=1.5, alpha=0.7)
        ax.plot(x, -y, 'g-', linewidth=1.5, alpha=0.7)
        # Arrow at midpoint
        mid = len(x) // 2 + 10
        if mid < len(x) - 1:
            ax.annotate('', xy=(x[mid + 1], y[mid + 1]), xytext=(x[mid], y[mid]),
                        arrowprops=dict(arrowstyle='->', color='green', lw=1.5))
    ax.text(1.5, -2, 'Field lines densest\nnear poles', fontsize=10, color='green',
            fontweight='bold', ha='center',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.3))
    ax.set_xlim(-4, 4)
    ax.set_ylim(-3, 3)
    ax.set_title('Magnetic Field Lines of a Bar Magnet', fontsize=12, fontweight='bold')
    ax.grid(True, alpha=0.1)
    ax.axis('off')
    save(fig, 'cuet-phy-mag-dipole-d02.png')


def mag_mat_d01():
    """B-H hysteresis curve for ferromagnetic material."""
    fig, ax = plt.subplots(**STYLE)
    # Hysteresis loop parametric
    t = np.linspace(0, 2 * np.pi, 500)
    H_max, B_max = 5, 1.5
    Br = 1.0  # retentivity
    Hc = 2.0  # coercivity
    H = H_max * np.sin(t) + 0.3 * np.sin(2 * t)
    B = B_max * np.sin(t - 0.4) + 0.2 * np.sin(2 * t - 0.3)
    ax.plot(H, B, 'b-', linewidth=2)
    ax.fill(H, B, alpha=0.1, color='blue')
    # Mark key points
    ax.plot(0, Br, 'ro', markersize=8)
    ax.text(0.3, Br + 0.1, f'Br = {Br}', fontsize=10, color='red', fontweight='bold')
    ax.plot(-Hc, 0, 'go', markersize=8)
    ax.text(-Hc - 0.3, 0.2, f'−Hc', fontsize=10, color='green', fontweight='bold')
    ax.plot(Hc, 0, 'go', markersize=8)
    ax.text(Hc + 0.1, 0.2, f'Hc', fontsize=10, color='green', fontweight='bold')
    ax.axhline(y=0, color='k', linewidth=0.8)
    ax.axvline(x=0, color='k', linewidth=0.8)
    ax.set_xlabel('H (A/m)', fontsize=12)
    ax.set_ylabel('B (T)', fontsize=12)
    ax.set_title('B-H Hysteresis Loop (Ferromagnetic)', fontsize=12, fontweight='bold')
    ax.text(2, -1.2, 'Area = Energy\nloss/cycle/vol', fontsize=10,
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8), fontweight='bold')
    ax.grid(True, alpha=0.3)
    save(fig, 'cuet-phy-mag-mat-d01.png')


def mag_mat_d02():
    """Susceptibility χ vs T for paramagnetic material (Curie's law)."""
    fig, ax = plt.subplots(**STYLE)
    T = np.linspace(50, 800, 300)
    C = 5000  # Curie constant
    chi = C / T
    ax.plot(T, chi, 'b-', linewidth=2.5)
    ax.set_xlabel('Temperature T (K)', fontsize=12)
    ax.set_ylabel('Magnetic Susceptibility χ', fontsize=12)
    ax.set_title('χ vs T: Paramagnetic Material (Curie\'s Law)', fontsize=12, fontweight='bold')
    ax.text(400, 40, 'χ = C/T\n(Curie\'s Law)', fontsize=12, color='blue',
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.5), fontweight='bold')
    ax.grid(True, alpha=0.3)
    ax.set_xlim(0, 850)
    ax.set_ylim(0, 120)
    save(fig, 'cuet-phy-mag-mat-d02.png')


# ═══════════════════════════════════════════════════════════════════════
# OPTICS
# ═══════════════════════════════════════════════════════════════════════

def ray_reflect_d01():
    """Concave mirror: object between F and C, image beyond C."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-8, 4)
    ax.set_ylim(-3, 3)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Concave Mirror: Object Between F and C', fontsize=12, fontweight='bold')
    # Mirror (arc)
    theta = np.linspace(-0.5, 0.5, 100)
    R = 6
    ax.plot(R * np.cos(theta) - R, R * np.sin(theta), 'b-', linewidth=3)
    # Principal axis
    ax.plot([-8, 1], [0, 0], 'k-', linewidth=0.8)
    # Mark F and C
    f = -R / 2
    ax.plot(f, 0, 'r^', markersize=8)
    ax.text(f, -0.4, 'F', fontsize=11, ha='center', fontweight='bold', color='red')
    ax.plot(-R, 0, 'bs', markersize=8)
    ax.text(-R, -0.4, 'C', fontsize=11, ha='center', fontweight='bold', color='blue')
    ax.plot(0, 0, 'ko', markersize=5)
    ax.text(0.2, -0.3, 'P', fontsize=10)
    # Object (between F and C)
    obj_x = -4.5
    obj_h = 1.2
    ax.annotate('', xy=(obj_x, obj_h), xytext=(obj_x, 0),
                arrowprops=dict(arrowstyle='->', lw=2, color='green'))
    ax.text(obj_x - 0.3, obj_h / 2, 'Object', fontsize=9, color='green', fontweight='bold', rotation=90, va='center')
    # Image (beyond C, inverted, magnified)
    img_x = -7
    img_h = -2.0
    ax.annotate('', xy=(img_x, img_h), xytext=(img_x, 0),
                arrowprops=dict(arrowstyle='->', lw=2, color='red'))
    ax.text(img_x - 0.3, img_h / 2, 'Image', fontsize=9, color='red', fontweight='bold', rotation=90, va='center')
    # Rays
    ax.plot([obj_x, 0, img_x], [obj_h, obj_h, img_h], 'orange', linewidth=1.5, linestyle='--')
    ax.plot([obj_x, 0, img_x], [obj_h, 0, img_h], 'purple', linewidth=1.5, linestyle='--')
    ax.text(-2, 2.2, 'Real, Inverted,\nMagnified', fontsize=10,
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8), fontweight='bold')
    save(fig, 'cuet-phy-ray-reflect-d01.png')


def ray_reflect_d02():
    """1/v vs 1/u for concave mirror: straight line, slope = -1."""
    fig, ax = plt.subplots(**STYLE)
    f = -10  # focal length in cm
    inv_f = 1 / f  # = -0.1
    # 1/v + 1/u = 1/f => 1/v = -1/u + 1/f
    inv_u = np.linspace(-0.25, -0.05, 100)
    inv_v = -inv_u + inv_f
    ax.plot(inv_u, inv_v, 'b-', linewidth=2.5)
    ax.axhline(y=0, color='k', linewidth=0.8)
    ax.axvline(x=0, color='k', linewidth=0.8)
    # Mark intercept
    ax.plot(0, inv_f, 'ro', markersize=8)
    ax.text(0.02, inv_f, '1/f', fontsize=11, color='red', fontweight='bold')
    ax.plot(inv_f, 0, 'ro', markersize=8)
    ax.text(inv_f, 0.02, '1/f', fontsize=11, color='red', fontweight='bold')
    ax.set_xlabel('1/u (cm⁻¹)', fontsize=12)
    ax.set_ylabel('1/v (cm⁻¹)', fontsize=12)
    ax.set_title('1/v vs 1/u for Concave Mirror (slope = −1)', fontsize=12, fontweight='bold')
    ax.text(-0.15, -0.02, 'Slope = −1', fontsize=11, color='blue', fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.5))
    ax.grid(True, alpha=0.3)
    save(fig, 'cuet-phy-ray-reflect-d02.png')


def ray_prism_d01():
    """Prism at minimum deviation."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-1, 10)
    ax.set_ylim(-1, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Prism at Minimum Deviation (A=60°, δ=30°)', fontsize=11, fontweight='bold')
    # Prism (equilateral triangle)
    prism = plt.Polygon([[5, 6], [2, 1], [8, 1]], closed=True,
                         facecolor='lightyellow', edgecolor='black', linewidth=2)
    ax.add_patch(prism)
    ax.text(5, 2.5, 'A = 60°', ha='center', fontsize=11, fontweight='bold')
    # Incident ray
    ax.plot([0, 3.2], [3, 3.8], 'r-', linewidth=2)
    ax.annotate('', xy=(3.2, 3.8), xytext=(1.5, 3.3),
                arrowprops=dict(arrowstyle='->', lw=1.5, color='red'))
    # Ray inside prism
    ax.plot([3.2, 6.8], [3.8, 3.8], 'r-', linewidth=2)
    # Emergent ray
    ax.plot([6.8, 10], [3.8, 3], 'r-', linewidth=2)
    ax.annotate('', xy=(9.5, 3.1), xytext=(8, 3.4),
                arrowprops=dict(arrowstyle='->', lw=1.5, color='red'))
    # Deviation angle
    ax.plot([3.2, 3.2 + 3], [3.8, 3.8 + 1], 'k--', linewidth=1, alpha=0.5)
    angle_arc = patches.Arc((6.8, 3.8), 3, 3, angle=0, theta1=-15, theta2=15,
                            linewidth=1.5, color='green')
    ax.add_patch(angle_arc)
    ax.text(9, 4.2, 'δ = 30°', fontsize=11, color='green', fontweight='bold')
    # i = e label
    ax.text(1, 4.5, 'i = e\n(symmetric)', fontsize=10, color='blue', fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.3))
    # Formula
    ax.text(5, -0.3, 'μ = sin((A+δ)/2) / sin(A/2) = √2', fontsize=10, ha='center',
            fontweight='bold', bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.5))
    save(fig, 'cuet-phy-ray-prism-d01.png')


def ray_prism_d02():
    """White light dispersion through prism: VIBGYOR."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-1, 12)
    ax.set_ylim(-1, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Dispersion of White Light by Prism', fontsize=13, fontweight='bold')
    # Prism
    prism = plt.Polygon([[4, 5.5], [2, 1.5], [6, 1.5]], closed=True,
                         facecolor='lightyellow', edgecolor='black', linewidth=2, alpha=0.5)
    ax.add_patch(prism)
    # White light incident
    ax.plot([0, 2.8], [3, 3.2], 'k-', linewidth=3)
    ax.annotate('', xy=(2.8, 3.2), xytext=(1, 3.05),
                arrowprops=dict(arrowstyle='->', lw=2, color='black'))
    ax.text(0.5, 3.5, 'White\nlight', fontsize=10, fontweight='bold')
    # Dispersed colors
    colors_list = [('Violet', '#8B00FF', -0.3), ('Indigo', '#4B0082', -0.2),
                   ('Blue', '#0000FF', -0.1), ('Green', '#00FF00', 0),
                   ('Yellow', '#FFFF00', 0.1), ('Orange', '#FF8C00', 0.2),
                   ('Red', '#FF0000', 0.3)]
    for name, color, offset in colors_list:
        end_y = 2.5 + offset * 8
        ax.plot([5.2, 10], [3.2 + offset, end_y], '-', color=color, linewidth=2)
        ax.text(10.2, end_y, name, fontsize=8, color=color, fontweight='bold', va='center')
    ax.text(7, 5.5, 'Violet deviates most\nRed deviates least', fontsize=10,
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8), fontweight='bold')
    save(fig, 'cuet-phy-ray-prism-d02.png')


def ray_instr_d01():
    """Compound microscope ray diagram."""
    fig, ax = plt.subplots(figsize=(8, 4.5), dpi=150, facecolor='white')
    ax.set_xlim(-1, 16)
    ax.set_ylim(-3, 3.5)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Compound Microscope', fontsize=13, fontweight='bold')
    # Object
    ax.annotate('', xy=(1, 0.5), xytext=(1, 0),
                arrowprops=dict(arrowstyle='->', lw=2, color='green'))
    ax.text(0.5, 0.7, 'Object', fontsize=8, color='green')
    # Objective lens
    ax.plot([3, 3], [-1.5, 1.5], 'b-', linewidth=2)
    ax.text(3, 1.8, 'Objective\n(fo=1cm)', fontsize=8, ha='center', color='blue', fontweight='bold')
    # Real intermediate image
    ax.annotate('', xy=(8, -1.5), xytext=(8, 0),
                arrowprops=dict(arrowstyle='->', lw=2, color='red'))
    ax.text(7.2, -1.8, 'Real image', fontsize=8, color='red')
    # Eyepiece lens
    ax.plot([10, 10], [-2, 2], 'r-', linewidth=2)
    ax.text(10, 2.3, 'Eyepiece\n(fe=5cm)', fontsize=8, ha='center', color='red', fontweight='bold')
    # Rays through objective
    ax.plot([1, 3, 8], [0.5, 0.5, -1.5], 'orange', linewidth=1, linestyle='--')
    ax.plot([1, 3, 8], [0.5, 0, -1.5], 'purple', linewidth=1, linestyle='--')
    # Tube length
    ax.annotate('', xy=(10, -2.5), xytext=(3, -2.5),
                arrowprops=dict(arrowstyle='<->', lw=1.5, color='black'))
    ax.text(6.5, -2.8, 'L = 20 cm', fontsize=9, ha='center', fontweight='bold')
    # Formula
    ax.text(8, 2.8, 'm ≈ (L/fo)(D/fe) = (20/1)(25/5) = 100', fontsize=9,
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.5), fontweight='bold')
    save(fig, 'cuet-phy-ray-instr-d01.png')


def ray_instr_d02():
    """Astronomical telescope in normal adjustment."""
    fig, ax = plt.subplots(figsize=(8, 4.5), dpi=150, facecolor='white')
    ax.set_xlim(-1, 16)
    ax.set_ylim(-3, 3.5)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Astronomical Telescope (Normal Adjustment)', fontsize=12, fontweight='bold')
    # Parallel rays from infinity
    for y in [0.5, 1.0, 1.5]:
        ax.annotate('', xy=(2, y), xytext=(0, y),
                    arrowprops=dict(arrowstyle='->', lw=1, color='orange'))
    ax.text(0, 2, 'From ∞', fontsize=9, color='orange')
    # Objective lens (large)
    ax.plot([3, 3], [-2, 2], 'b-', linewidth=3)
    ax.text(3, 2.3, 'Objective\n(large fo)', fontsize=9, ha='center', color='blue', fontweight='bold')
    # Eyepiece lens (small)
    ax.plot([10, 10], [-1.2, 1.2], 'r-', linewidth=3)
    ax.text(10, 1.5, 'Eyepiece\n(small fe)', fontsize=9, ha='center', color='red', fontweight='bold')
    # Rays converge at common focus then diverge
    ax.plot([3, 8], [1.5, 0], 'orange', linewidth=1, linestyle='--')
    ax.plot([3, 8], [0.5, 0], 'orange', linewidth=1, linestyle='--')
    ax.plot([8, 10, 14], [0, 0.8, 2], 'purple', linewidth=1, linestyle='--')
    ax.plot([8, 10, 14], [0, -0.8, -2], 'purple', linewidth=1, linestyle='--')
    ax.plot(8, 0, 'ko', markersize=5)
    ax.text(8, -0.4, 'Common F', fontsize=8)
    # Parallel rays exit
    ax.text(13, 2.3, 'To eye', fontsize=9, color='purple')
    # Formula
    ax.text(7, -2.5, 'M = fo/fe', fontsize=12, ha='center', fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8))
    save(fig, 'cuet-phy-ray-instr-d02.png')


def waveopt_interf_d01():
    """Young's double slit setup with fringe pattern."""
    fig, ax = plt.subplots(figsize=(8, 4.5), dpi=150, facecolor='white')
    ax.set_xlim(-1, 14)
    ax.set_ylim(-3, 3.5)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title("Young's Double Slit Experiment", fontsize=13, fontweight='bold')
    # Source
    ax.plot(0, 0, 'yo', markersize=10)
    ax.text(0, -0.5, 'S', fontsize=10, ha='center', fontweight='bold')
    # Barrier with slits
    ax.plot([3, 3], [-3, -0.3], 'k-', linewidth=2)
    ax.plot([3, 3], [0.3, 3], 'k-', linewidth=2)
    ax.plot([3, 3], [-0.1, 0.1], 'k-', linewidth=0.5, alpha=0)  # gap (slit area)
    ax.plot(3, 0.5, 'go', markersize=5)
    ax.text(2.5, 0.7, 'S₁', fontsize=9, color='green', fontweight='bold')
    ax.plot(3, -0.5, 'go', markersize=5)
    ax.text(2.5, -0.7, 'S₂', fontsize=9, color='green', fontweight='bold')
    # d label
    ax.annotate('', xy=(2.7, 0.5), xytext=(2.7, -0.5),
                arrowprops=dict(arrowstyle='<->', lw=1.5, color='red'))
    ax.text(2.2, 0, 'd', fontsize=12, color='red', fontweight='bold')
    # Screen
    ax.plot([11, 11], [-3, 3], 'k-', linewidth=2)
    ax.text(11.3, 2.5, 'Screen', fontsize=10, fontweight='bold')
    # Fringe pattern
    y_screen = np.linspace(-2.5, 2.5, 200)
    intensity = np.cos(np.pi * y_screen / 0.5) ** 2
    ax.barh(y_screen, intensity * 0.8, height=0.05, left=11, color='blue', alpha=0.6)
    # β label
    ax.annotate('', xy=(12, 0.5), xytext=(12, 0),
                arrowprops=dict(arrowstyle='<->', lw=1.5, color='green'))
    ax.text(12.3, 0.25, 'β', fontsize=12, color='green', fontweight='bold')
    # D label
    ax.annotate('', xy=(11, -2.8), xytext=(3, -2.8),
                arrowprops=dict(arrowstyle='<->', lw=1.5, color='purple'))
    ax.text(7, -3.2, 'D', fontsize=12, color='purple', fontweight='bold', ha='center')
    # Formula
    ax.text(7, 3, 'β = λD/d', fontsize=12, fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.5))
    save(fig, 'cuet-phy-waveopt-interf-d01.png')


def waveopt_interf_d02():
    """Intensity distribution in YDSE."""
    fig, ax = plt.subplots(**STYLE)
    x = np.linspace(-4 * np.pi, 4 * np.pi, 500)
    I0 = 1
    I = 4 * I0 * np.cos(x / 2) ** 2
    ax.plot(x, I, 'b-', linewidth=2)
    ax.fill_between(x, I, alpha=0.15, color='blue')
    # Mark path difference = λ/3
    pd_point = 2 * np.pi / 3  # phase diff for Δ = λ/3
    I_at_point = 4 * I0 * np.cos(pd_point / 2) ** 2
    ax.plot(pd_point, I_at_point, 'ro', markersize=8)
    ax.annotate(f'Δ = λ/3\nI = I₀', xy=(pd_point, I_at_point),
                xytext=(pd_point + 2, I_at_point + 1),
                fontsize=10, color='red', fontweight='bold',
                arrowprops=dict(arrowstyle='->', color='red'))
    ax.set_xlabel('Phase difference (rad)', fontsize=12)
    ax.set_ylabel('Intensity I', fontsize=12)
    ax.set_title('Intensity Distribution in YDSE: I = 4I₀cos²(δ/2)', fontsize=11, fontweight='bold')
    ax.axhline(y=0, color='k', linewidth=0.8)
    ax.set_ylim(-0.5, 5)
    ax.grid(True, alpha=0.3)
    save(fig, 'cuet-phy-waveopt-interf-d02.png')


def waveopt_diff_d01():
    """Single slit diffraction pattern."""
    fig, ax = plt.subplots(**STYLE)
    theta = np.linspace(-0.03, 0.03, 500)
    a = 0.1e-3  # slit width 0.1 mm
    lam = 500e-9  # wavelength 500 nm
    beta = np.pi * a * np.sin(theta) / lam
    beta = np.where(np.abs(beta) < 1e-10, 1e-10, beta)
    I = (np.sin(beta) / beta) ** 2
    ax.plot(np.degrees(theta) * 1000, I, 'b-', linewidth=2.5)
    ax.fill_between(np.degrees(theta) * 1000, I, alpha=0.15, color='blue')
    # Mark first minima
    theta_min = np.degrees(np.arcsin(lam / a)) * 1000
    ax.axvline(x=theta_min, color='red', linestyle='--', alpha=0.5)
    ax.axvline(x=-theta_min, color='red', linestyle='--', alpha=0.5)
    ax.text(theta_min + 0.5, 0.5, '1st min\na sinθ = λ', fontsize=9, color='red', fontweight='bold')
    ax.set_xlabel('Angle (mrad)', fontsize=12)
    ax.set_ylabel('Relative Intensity I/I₀', fontsize=12)
    ax.set_title('Single Slit Diffraction Pattern', fontsize=13, fontweight='bold')
    ax.grid(True, alpha=0.3)
    save(fig, 'cuet-phy-waveopt-diff-d01.png')


def waveopt_diff_d02():
    """Comparison: narrow vs wide slit diffraction."""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(8, 4), dpi=150, facecolor='white')
    theta = np.linspace(-0.04, 0.04, 500)
    lam = 500e-9
    for ax, a, title in [(ax1, 0.05e-3, 'Narrow slit (a)'),
                          (ax2, 0.1e-3, 'Wide slit (2a)')]:
        beta = np.pi * a * np.sin(theta) / lam
        beta = np.where(np.abs(beta) < 1e-10, 1e-10, beta)
        I = (np.sin(beta) / beta) ** 2
        ax.plot(np.degrees(theta) * 1000, I, 'b-', linewidth=2)
        ax.fill_between(np.degrees(theta) * 1000, I, alpha=0.15, color='blue')
        ax.set_title(title, fontsize=11, fontweight='bold')
        ax.set_xlabel('Angle (mrad)', fontsize=10)
        ax.set_ylabel('I/I₀', fontsize=10)
        ax.grid(True, alpha=0.3)
        ax.set_ylim(-0.1, 1.1)
    fig.suptitle('Half slit width → Double angular width of central max', fontsize=11,
                 fontweight='bold', y=0.02)
    fig.tight_layout()
    save(fig, 'cuet-phy-waveopt-diff-d02.png')


def waveopt_polar_d01():
    """Brewster's angle: reflected ray polarized."""
    fig, ax = plt.subplots(**STYLE)
    ax.set_xlim(-2, 10)
    ax.set_ylim(-3, 6)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title("Polarization by Reflection (Brewster's Angle)", fontsize=11, fontweight='bold')
    # Interface
    ax.plot([-1, 9], [1, 1], 'k-', linewidth=2)
    ax.add_patch(patches.Rectangle((-1, -3), 10, 4, facecolor='lightblue', alpha=0.3))
    ax.text(7, -1, 'Glass\n(μ = tan iB)', fontsize=10, color='blue', fontweight='bold')
    ax.text(7, 2, 'Air', fontsize=10)
    # Incident ray
    ax.plot([1, 4], [5, 1], 'r-', linewidth=2)
    ax.annotate('', xy=(3.5, 1.5), xytext=(2, 3.5),
                arrowprops=dict(arrowstyle='->', lw=1.5, color='red'))
    ax.text(1, 4, 'Incident', fontsize=9, color='red')
    # Reflected ray (polarized)
    ax.plot([4, 7], [1, 5], 'g-', linewidth=2)
    ax.annotate('', xy=(6.5, 4.5), xytext=(5, 2.5),
                arrowprops=dict(arrowstyle='->', lw=1.5, color='green'))
    ax.text(6.5, 4, 'Reflected\n(polarized)', fontsize=9, color='green', fontweight='bold')
    # Refracted ray
    ax.plot([4, 6], [1, -2], 'b-', linewidth=2)
    ax.annotate('', xy=(5.5, -1.5), xytext=(4.5, 0),
                arrowprops=dict(arrowstyle='->', lw=1.5, color='blue'))
    ax.text(5.5, -2.5, 'Refracted', fontsize=9, color='blue')
    # Normal
    ax.plot([4, 4], [-2, 5.5], 'k--', linewidth=1, alpha=0.5)
    ax.text(4.2, 5, 'Normal', fontsize=8, color='gray')
    # Angle
    arc = patches.Arc((4, 1), 2, 2, angle=90, theta1=0, theta2=57,
                      linewidth=1.5, color='red')
    ax.add_patch(arc)
    ax.text(3, 2.5, 'iB = 57°', fontsize=10, color='red', fontweight='bold')
    # 90° between reflected and refracted
    ax.text(5, 0.5, '90°', fontsize=10, color='purple', fontweight='bold')
    # Formula
    ax.text(1, -2.5, 'tan(iB) = μ = 1.54', fontsize=11, fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8))
    save(fig, 'cuet-phy-waveopt-polar-d01.png')


def waveopt_polar_d02():
    """Malus's law: I = I₀cos²θ."""
    fig, ax = plt.subplots(**STYLE)
    theta = np.linspace(0, 180, 300)
    I = np.cos(np.radians(theta)) ** 2
    ax.plot(theta, I, 'b-', linewidth=2.5)
    ax.fill_between(theta, I, alpha=0.15, color='blue')
    # Mark key points
    for ang, val, label in [(0, 1.0, 'I₀'), (60, 0.25, 'I₀/4'), (90, 0, '0')]:
        ax.plot(ang, val, 'ro', markersize=8)
        ax.text(ang + 3, val + 0.05, f'θ={ang}°\nI={label}', fontsize=9, color='red', fontweight='bold')
    ax.set_xlabel('Angle θ between polarizer and analyzer (°)', fontsize=11)
    ax.set_ylabel('I/I₀', fontsize=12)
    ax.set_title("Malus's Law: I = I₀ cos²θ", fontsize=13, fontweight='bold')
    ax.set_xlim(-5, 185)
    ax.set_ylim(-0.1, 1.2)
    ax.grid(True, alpha=0.3)
    save(fig, 'cuet-phy-waveopt-polar-d02.png')


# ═══════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════
ALL_GENERATORS = [
    # EM Induction (4)
    emi_faraday_d01, emi_faraday_d02, emi_induct_d01, emi_induct_d02,
    # EM Waves (2)
    emwave_d01, emwave_d02,
    # Magnetic Effects (10)
    mag_biot_d01, mag_biot_d02, mag_force_d01, mag_force_d02,
    mag_device_d01, mag_device_d02, mag_dipole_d01, mag_dipole_d02,
    mag_mat_d01, mag_mat_d02,
    # Optics (12)
    ray_reflect_d01, ray_reflect_d02, ray_prism_d01, ray_prism_d02,
    ray_instr_d01, ray_instr_d02,
    waveopt_interf_d01, waveopt_interf_d02, waveopt_diff_d01, waveopt_diff_d02,
    waveopt_polar_d01, waveopt_polar_d02,
]

def main():
    print(f"\nBatch 3 Diagram Generator")
    print(f"{'=' * 50}")
    print(f"Output dir: {OUT_DIR}")
    print(f"Diagrams to generate: {len(ALL_GENERATORS)}\n")

    import sys
    errors = 0
    for gen_fn in ALL_GENERATORS:
        try:
            gen_fn()
        except Exception as e:
            print(f"  FAIL: {gen_fn.__name__}: {e}")
            errors += 1

    print(f"\n{'=' * 50}")
    print(f"Generated: {len(ALL_GENERATORS) - errors}, Errors: {errors}")
    if errors:
        sys.exit(1)
    print("All 28 diagrams generated successfully!")


if __name__ == "__main__":
    main()
