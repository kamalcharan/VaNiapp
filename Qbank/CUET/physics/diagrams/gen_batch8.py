"""Batch 8: gauss-24, potential-21 to 24 (5 images)"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import os

OUT = os.path.dirname(os.path.abspath(__file__))
DPI = 150

def save(fig, name):
    path = os.path.join(OUT, name)
    fig.savefig(path, dpi=DPI, bbox_inches='tight', facecolor='white')
    plt.close(fig)
    print(f"  OK: {name}")

# ─────────────────────────────────────────────────────────
# 1. cuet-phy-elec-gauss-24.png
#    Two concentric shells: inner +Q (radius a), outer −Q (radius b),
#    Gaussian sphere at r between a and b
# ─────────────────────────────────────────────────────────
def img1():
    fig, ax = plt.subplots(figsize=(5, 5))
    ax.set_xlim(-4, 4)
    ax.set_ylim(-4, 4)
    ax.set_aspect('equal')
    ax.axis('off')

    theta = np.linspace(0, 2 * np.pi, 100)
    a, b, r = 1.2, 3.0, 2.1

    # Inner shell +Q
    ax.plot(a * np.cos(theta), a * np.sin(theta), 'r-', lw=2.5)
    ax.text(a + 0.3, 0.3, 'a', fontsize=12, fontweight='bold', color='red')
    ax.text(0, 0, '+Q', fontsize=11, ha='center', fontweight='bold', color='red')

    # Outer shell −Q
    ax.plot(b * np.cos(theta), b * np.sin(theta), 'b-', lw=2.5)
    ax.text(b + 0.3, 0.3, 'b', fontsize=12, fontweight='bold', color='blue')
    ax.text(b * 0.7, -b * 0.7, '−Q', fontsize=11, fontweight='bold', color='blue')

    # Gaussian sphere (dashed)
    ax.plot(r * np.cos(theta), r * np.sin(theta), 'g--', lw=2)
    ax.text(r * 0.6, r * 0.8, 'r', fontsize=12, fontweight='bold', color='green')

    ax.set_title('Concentric Spherical Shells', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-gauss-24.png')

# ─────────────────────────────────────────────────────────
# 2. cuet-phy-elec-potential-21.png
#    Four parallel equipotential lines: 40V, 30V, 20V, 10V
# ─────────────────────────────────────────────────────────
def img2():
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.set_xlim(-1, 6)
    ax.set_ylim(-1, 5)
    ax.set_aspect('equal')
    ax.axis('off')

    voltages = [40, 30, 20, 10]
    colors = ['#d32f2f', '#e64a19', '#f57c00', '#fbc02d']

    for i, (V, color) in enumerate(zip(voltages, colors)):
        x = i * 1.2 + 0.5
        ax.plot([x, x], [0, 4], color=color, lw=3)
        ax.text(x, 4.3, f'{V} V', fontsize=12, ha='center', fontweight='bold', color=color)

    # E arrow (left to right, high V to low V)
    ax.annotate('', xy=(4.5, 2), xytext=(0.5, 2),
                arrowprops=dict(arrowstyle='->', color='blue', lw=2.5))
    ax.text(2.5, 1.3, 'E⃗ = ?', fontsize=14, ha='center', fontweight='bold', color='blue')

    ax.set_title('Equipotential Lines', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-potential-21.png')

# ─────────────────────────────────────────────────────────
# 3. cuet-phy-elec-potential-22.png
#    Three concentric circles R, 2R, 3R around +Q, labeled V₁, V₂, V₃
# ─────────────────────────────────────────────────────────
def img3():
    fig, ax = plt.subplots(figsize=(5, 5))
    ax.set_xlim(-4, 4)
    ax.set_ylim(-4, 4)
    ax.set_aspect('equal')
    ax.axis('off')

    theta = np.linspace(0, 2 * np.pi, 100)
    radii = [1, 2, 3]
    labels = ['V₁', 'V₂', 'V₃']
    rlabels = ['R', '2R', '3R']
    colors = ['#d32f2f', '#f57c00', '#1976d2']

    for R, vlabel, rlabel, color in zip(radii, labels, rlabels, colors):
        ax.plot(R * np.cos(theta), R * np.sin(theta), color=color, lw=2)
        ax.text(R * 0.7, R * 0.7, vlabel, fontsize=12, fontweight='bold', color=color)
        ax.text(R, -0.3, rlabel, fontsize=10, ha='center', color=color)

    ax.plot(0, 0, 'ro', ms=10, zorder=5)
    ax.text(0, 0, '+Q', fontsize=9, ha='center', va='center', fontweight='bold', color='white', zorder=6)

    ax.set_title('Equipotential Surfaces', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-potential-22.png')

# ─────────────────────────────────────────────────────────
# 4. cuet-phy-elec-potential-23.png
#    Four V vs r curves: (A) 1/r, (B) 1/r², (C) constant, (D) linear
# ─────────────────────────────────────────────────────────
def img4():
    fig, ax = plt.subplots(figsize=(6, 5))
    r = np.linspace(0.5, 5, 200)

    curves = [
        ('A: V ∝ 1/r', 2 / r, 'red'),
        ('B: V ∝ 1/r²', 2 / r**2, 'blue'),
        ('C: V = const', np.ones_like(r) * 1.0, 'green'),
        ('D: V ∝ r', 0.4 * r, 'purple'),
    ]

    for label, V, color in curves:
        ax.plot(r, V, color=color, lw=2.5, label=label)

    ax.set_xlabel('Distance r', fontsize=12)
    ax.set_ylabel('Potential V', fontsize=12)
    ax.set_xlim(0.5, 5)
    ax.set_ylim(0, 4)
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)
    ax.set_title('V vs r Curves', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-potential-23.png')

# ─────────────────────────────────────────────────────────
# 5. cuet-phy-elec-potential-24.png
#    V vs x: V=V₀ for 0<x<a, linear decrease a to 2a, V=0 for x>2a
# ─────────────────────────────────────────────────────────
def img5():
    fig, ax = plt.subplots(figsize=(6, 4))
    a = 2
    V0 = 3

    # Region 1: constant
    x1 = np.linspace(0, a, 50)
    ax.plot(x1, np.ones_like(x1) * V0, 'b-', lw=2.5)

    # Region 2: linear decrease
    x2 = np.linspace(a, 2 * a, 50)
    ax.plot(x2, V0 * (2 * a - x2) / a, 'b-', lw=2.5)

    # Region 3: zero
    x3 = np.linspace(2 * a, 6, 50)
    ax.plot(x3, np.zeros_like(x3), 'b-', lw=2.5)

    # Markers
    ax.plot(a, V0, 'ro', ms=6)
    ax.plot(2 * a, 0, 'ro', ms=6)

    ax.axvline(a, color='gray', ls='--', lw=1, alpha=0.5)
    ax.axvline(2 * a, color='gray', ls='--', lw=1, alpha=0.5)

    ax.set_xlabel('x', fontsize=12)
    ax.set_ylabel('V', fontsize=12)
    ax.set_xticks([0, a, 2 * a])
    ax.set_xticklabels(['0', 'a', '2a'], fontsize=11)
    ax.set_yticks([0, V0])
    ax.set_yticklabels(['0', 'V₀'], fontsize=11)
    ax.grid(True, alpha=0.3)
    ax.set_title('V vs x', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-potential-24.png')

if __name__ == '__main__':
    print("Batch 8: Generating 5 images...")
    img1()
    img2()
    img3()
    img4()
    img5()
    print("Batch 8 complete!")
