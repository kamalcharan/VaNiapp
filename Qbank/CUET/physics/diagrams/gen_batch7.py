"""Batch 7: dipole-23 to 24, gauss-21 to 23 (5 images)"""
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
# 1. cuet-phy-elec-dipole-23.png
#    E vs r: 4 curves: (A) 1/r, (B) 1/r², (C) 1/r³, (D) constant
# ─────────────────────────────────────────────────────────
def img1():
    fig, ax = plt.subplots(figsize=(6, 5))
    r = np.linspace(0.5, 5, 200)

    curves = [
        ('A: E ∝ 1/r', 2 / r, 'red'),
        ('B: E ∝ 1/r²', 2 / r**2, 'blue'),
        ('C: E ∝ 1/r³', 2 / r**3, 'green'),
        ('D: E = const', np.ones_like(r) * 0.5, 'purple'),
    ]

    for label, E, color in curves:
        ax.plot(r, E, color=color, lw=2.5, label=label)

    ax.set_xlabel('Distance r', fontsize=12)
    ax.set_ylabel('Electric Field E', fontsize=12)
    ax.set_xlim(0.5, 5)
    ax.set_ylim(0, 4)
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)
    ax.set_title('E vs r for Different Dependencies', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-dipole-23.png')

# ─────────────────────────────────────────────────────────
# 2. cuet-phy-elec-dipole-24.png
#    Non-uniform field: arrows increasing right, dipole aligned +x
# ─────────────────────────────────────────────────────────
def img2():
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.set_xlim(-4, 6)
    ax.set_ylim(-2, 2)
    ax.set_aspect('equal')
    ax.axis('off')

    # Non-uniform field arrows (increasing length)
    for y in np.linspace(-1.5, 1.5, 5):
        for x_start in [-3, -1, 1, 3]:
            length = 0.5 + 0.2 * (x_start + 3)
            ax.annotate('', xy=(x_start + length, y), xytext=(x_start, y),
                        arrowprops=dict(arrowstyle='->', color='orange', lw=1 + 0.15 * (x_start + 3), alpha=0.5))

    ax.text(5, 1.5, 'E⃗\n(increasing →)', fontsize=10, color='orange', fontweight='bold', ha='center')

    # Dipole: −q left, +q right
    circle1 = plt.Circle((-1, 0), 0.35, fc='blue', ec='k', lw=2, alpha=0.8)
    ax.add_patch(circle1)
    ax.text(-1, 0, '−q', fontsize=10, ha='center', va='center', fontweight='bold', color='white')

    circle2 = plt.Circle((1, 0), 0.35, fc='red', ec='k', lw=2, alpha=0.8)
    ax.add_patch(circle2)
    ax.text(1, 0, '+q', fontsize=10, ha='center', va='center', fontweight='bold', color='white')

    ax.plot([-0.6, 0.6], [0, 0], 'k-', lw=2)

    # Net force arrow (to right, where field is stronger)
    ax.annotate('', xy=(2.5, 0), xytext=(1.5, 0),
                arrowprops=dict(arrowstyle='->', color='green', lw=3))
    ax.text(2.5, 0.4, 'F_net', fontsize=11, fontweight='bold', color='green')

    ax.set_title('Dipole in Non-Uniform Field', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-dipole-24.png')

# ─────────────────────────────────────────────────────────
# 3. cuet-phy-elec-gauss-21.png
#    Sphere radius R, +Q at center, radial arrows outward
# ─────────────────────────────────────────────────────────
def img3():
    fig, ax = plt.subplots(figsize=(5, 5))
    ax.set_xlim(-3, 3)
    ax.set_ylim(-3, 3)
    ax.set_aspect('equal')
    ax.axis('off')

    # Sphere (dashed)
    R = 2
    theta = np.linspace(0, 2 * np.pi, 100)
    ax.plot(R * np.cos(theta), R * np.sin(theta), 'b--', lw=2, alpha=0.6)
    ax.text(1.5, 1.8, 'R', fontsize=12, fontweight='bold', color='blue')

    # Central charge
    ax.plot(0, 0, 'ro', ms=12, zorder=5)
    ax.text(0, 0, '+Q', fontsize=10, ha='center', va='center', fontweight='bold', color='white', zorder=6)

    # Radial arrows from surface outward
    for angle in np.linspace(0, 2 * np.pi, 16, endpoint=False):
        x_s = R * np.cos(angle)
        y_s = R * np.sin(angle)
        x_e = 2.7 * np.cos(angle)
        y_e = 2.7 * np.sin(angle)
        ax.annotate('', xy=(x_e, y_e), xytext=(x_s, y_s),
                    arrowprops=dict(arrowstyle='->', color='red', lw=1.5))

    ax.set_title('Gaussian Surface (Sphere)', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-gauss-21.png')

# ─────────────────────────────────────────────────────────
# 4. cuet-phy-elec-gauss-22.png
#    Infinite charged plane with cylindrical Gaussian surface (pillbox)
# ─────────────────────────────────────────────────────────
def img4():
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.set_xlim(-4, 4)
    ax.set_ylim(-3, 3)
    ax.set_aspect('equal')
    ax.axis('off')

    # Infinite plane (horizontal)
    ax.plot([-3.5, 3.5], [0, 0], 'b-', lw=3)
    for x in np.linspace(-3, 3, 13):
        ax.text(x, 0, '+', fontsize=8, ha='center', va='center', color='red', fontweight='bold')

    ax.text(-3.8, 0, 'σ', fontsize=14, fontweight='bold', color='blue')

    # Cylindrical pillbox (rectangle cross-section)
    rect = patches.FancyBboxPatch((-1.5, -2), 3, 4, boxstyle="round,pad=0.1",
                                   ec='green', fc='none', lw=2, ls='--')
    ax.add_patch(rect)

    # Top face arrows (E pointing up)
    for x in [-0.8, 0, 0.8]:
        ax.annotate('', xy=(x, 2.8), xytext=(x, 2),
                    arrowprops=dict(arrowstyle='->', color='red', lw=2))
    ax.text(1.8, 2.4, 'E⃗', fontsize=12, fontweight='bold', color='red')

    # Bottom face arrows (E pointing down)
    for x in [-0.8, 0, 0.8]:
        ax.annotate('', xy=(x, -2.8), xytext=(x, -2),
                    arrowprops=dict(arrowstyle='->', color='red', lw=2))
    ax.text(1.8, -2.4, 'E⃗', fontsize=12, fontweight='bold', color='red')

    ax.text(2, 1, 'Gaussian\npillbox', fontsize=10, color='green', fontweight='bold')

    ax.set_title('Gauss\'s Law: Infinite Charged Plane', fontsize=12, fontweight='bold')
    save(fig, 'cuet-phy-elec-gauss-22.png')

# ─────────────────────────────────────────────────────────
# 5. cuet-phy-elec-gauss-23.png
#    Four E vs r graphs for different charge distributions
# ─────────────────────────────────────────────────────────
def img5():
    fig, axes = plt.subplots(2, 2, figsize=(8, 7))
    R = 2

    titles = [
        '(A) E constant',
        '(B) E = kQ/r² (point charge)',
        '(C) Conducting sphere',
        '(D) Uniformly charged sphere',
    ]

    for ax, title in zip(axes.flat, titles):
        ax.set_xlabel('r', fontsize=10)
        ax.set_ylabel('E', fontsize=10)
        ax.set_xlim(0, 5)
        ax.set_title(title, fontsize=10, fontweight='bold')
        ax.grid(True, alpha=0.3)
        ax.axvline(R, color='gray', ls='--', lw=0.8, alpha=0.5)
        ax.text(R, -0.05, 'R', fontsize=9, ha='center', color='gray',
                transform=ax.get_xaxis_transform())

    # A: constant
    r = np.linspace(0.1, 5, 200)
    axes[0, 0].plot(r, np.ones_like(r), 'b-', lw=2)
    axes[0, 0].set_ylim(0, 2)

    # B: 1/r² everywhere
    axes[0, 1].plot(r, 1 / r**2, 'b-', lw=2)
    axes[0, 1].set_ylim(0, 3)

    # C: conducting sphere (E=0 inside, E=kQ/r² outside)
    r_in = np.linspace(0, R, 50)
    r_out = np.linspace(R, 5, 150)
    axes[1, 0].plot(r_in, np.zeros_like(r_in), 'b-', lw=2)
    axes[1, 0].plot(r_out, (R / r_out)**2, 'b-', lw=2)
    axes[1, 0].plot(R, 1, 'ro', ms=6)
    axes[1, 0].set_ylim(-0.1, 1.5)

    # D: uniformly charged sphere (linear inside, 1/r² outside)
    axes[1, 1].plot(r_in, r_in / R, 'b-', lw=2)
    axes[1, 1].plot(r_out, (R / r_out)**2, 'b-', lw=2)
    axes[1, 1].plot(R, 1, 'ro', ms=6)
    axes[1, 1].set_ylim(0, 1.3)

    plt.tight_layout()
    save(fig, 'cuet-phy-elec-gauss-23.png')

if __name__ == '__main__':
    print("Batch 7: Generating 5 images...")
    img1()
    img2()
    img3()
    img4()
    img5()
    print("Batch 7 complete!")
