"""Batch 6: field-24 to 26, dipole-21 to 22 (5 images)"""
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
# 1. cuet-phy-elec-field-24.png
#    Field lines: + charge on left, − charge on right, curved lines between
# ─────────────────────────────────────────────────────────
def img1():
    fig, ax = plt.subplots(figsize=(7, 5))
    ax.set_xlim(-4, 4)
    ax.set_ylim(-3, 3)
    ax.set_aspect('equal')
    ax.axis('off')

    # Charges
    q_pos = (-2, 0)
    q_neg = (2, 0)

    ax.plot(*q_pos, 'ro', ms=15, zorder=5)
    ax.text(q_pos[0], q_pos[1], '+', fontsize=14, ha='center', va='center',
            fontweight='bold', color='white', zorder=6)
    ax.plot(*q_neg, 'bo', ms=15, zorder=5)
    ax.text(q_neg[0], q_neg[1], '−', fontsize=16, ha='center', va='center',
            fontweight='bold', color='white', zorder=6)

    # Field lines from + to −
    for offset in [0, 0.5, -0.5, 1.0, -1.0, 1.5, -1.5]:
        # Simple curved paths
        t = np.linspace(0, 1, 50)
        x = q_pos[0] + (q_neg[0] - q_pos[0]) * t
        y = offset * 4 * t * (1 - t)  # parabolic curve
        ax.plot(x, y, 'darkorange', lw=1.2, alpha=0.8)
        # Arrow at midpoint
        mid = len(t) // 2
        dx = x[mid + 1] - x[mid]
        dy = y[mid + 1] - y[mid]
        ax.annotate('', xy=(x[mid] + dx * 2, y[mid] + dy * 2),
                    xytext=(x[mid], y[mid]),
                    arrowprops=dict(arrowstyle='->', color='darkorange', lw=1.5))

    ax.set_title('Electric Field Lines (+q and −q)', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-field-24.png')

# ─────────────────────────────────────────────────────────
# 2. cuet-phy-elec-field-25.png
#    E vs r: linear rise 0 to R, then 1/r² decay for r > R
# ─────────────────────────────────────────────────────────
def img2():
    fig, ax = plt.subplots(figsize=(6, 4))
    R = 2
    r_in = np.linspace(0, R, 100)
    r_out = np.linspace(R, 6, 200)

    E_in = r_in / R  # linear
    E_out = (R / r_out)**2  # 1/r²

    ax.plot(r_in, E_in, 'b-', lw=2.5)
    ax.plot(r_out, E_out, 'b-', lw=2.5)
    ax.plot(R, 1, 'ro', ms=8, zorder=5)

    ax.axvline(R, color='gray', ls='--', lw=1, alpha=0.5)
    ax.text(R, -0.12, 'R', fontsize=13, fontweight='bold', ha='center', color='red')

    ax.text(R / 2, 0.3, 'E ∝ r', fontsize=11, ha='center', color='blue', fontstyle='italic')
    ax.text(R + 2, 0.4, 'E ∝ 1/r²', fontsize=11, ha='center', color='blue', fontstyle='italic')

    ax.set_xlabel('Distance r', fontsize=12)
    ax.set_ylabel('Electric Field E', fontsize=12)
    ax.set_xlim(0, 6)
    ax.set_ylim(0, 1.2)
    ax.grid(True, alpha=0.3)
    ax.set_title('E vs r (Uniformly Charged Sphere)', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-field-25.png')

# ─────────────────────────────────────────────────────────
# 3. cuet-phy-elec-field-26.png
#    Three concentric equipotential circles: V₁ > V₂ > V₃
# ─────────────────────────────────────────────────────────
def img3():
    fig, ax = plt.subplots(figsize=(5, 5))
    ax.set_xlim(-4, 4)
    ax.set_ylim(-4, 4)
    ax.set_aspect('equal')
    ax.axis('off')

    radii = [1.0, 2.0, 3.0]
    labels = ['V₁', 'V₂', 'V₃']
    colors = ['#d32f2f', '#f57c00', '#fbc02d']

    for r, label, color in zip(radii, labels, colors):
        theta = np.linspace(0, 2 * np.pi, 100)
        ax.plot(r * np.cos(theta), r * np.sin(theta), color=color, lw=2.5)
        ax.text(r * 0.7, r * 0.7, label, fontsize=13, fontweight='bold', color=color)

    # Central charge
    ax.plot(0, 0, 'ro', ms=10)
    ax.text(0, 0, '+Q', fontsize=10, ha='center', va='center', fontweight='bold', color='white')

    ax.text(0, -3.7, 'V₁ > V₂ > V₃', fontsize=12, ha='center', fontweight='bold', color='gray')

    ax.set_title('Concentric Equipotential Surfaces', fontsize=12, fontweight='bold')
    save(fig, 'cuet-phy-elec-field-26.png')

# ─────────────────────────────────────────────────────────
# 4. cuet-phy-elec-dipole-21.png
#    Dipole: −q left, +q right, separation 2a, arrow p⃗
# ─────────────────────────────────────────────────────────
def img4():
    fig, ax = plt.subplots(figsize=(7, 3))
    ax.set_xlim(-4, 4)
    ax.set_ylim(-1.5, 1.5)
    ax.set_aspect('equal')
    ax.axis('off')

    # −q on left
    circle1 = plt.Circle((-2, 0), 0.4, fc='blue', ec='k', lw=2, alpha=0.8)
    ax.add_patch(circle1)
    ax.text(-2, 0, '−q', fontsize=12, ha='center', va='center', fontweight='bold', color='white')

    # +q on right
    circle2 = plt.Circle((2, 0), 0.4, fc='red', ec='k', lw=2, alpha=0.8)
    ax.add_patch(circle2)
    ax.text(2, 0, '+q', fontsize=12, ha='center', va='center', fontweight='bold', color='white')

    # Separation line
    ax.plot([-2, 2], [0, 0], 'k--', lw=1, alpha=0.5)

    # Dipole moment arrow p⃗
    ax.annotate('', xy=(1.3, -0.8), xytext=(-1.3, -0.8),
                arrowprops=dict(arrowstyle='->', color='green', lw=3))
    ax.text(0, -1.1, 'p⃗', fontsize=16, ha='center', fontweight='bold', color='green')

    # Distance markers
    ax.annotate('', xy=(-2, 0.8), xytext=(0, 0.8),
                arrowprops=dict(arrowstyle='<->', color='gray', lw=1.5))
    ax.text(-1, 1.1, 'a', fontsize=12, ha='center', color='gray', fontweight='bold')
    ax.annotate('', xy=(0, 0.8), xytext=(2, 0.8),
                arrowprops=dict(arrowstyle='<->', color='gray', lw=1.5))
    ax.text(1, 1.1, 'a', fontsize=12, ha='center', color='gray', fontweight='bold')

    ax.set_title('Electric Dipole', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-dipole-21.png')

# ─────────────────────────────────────────────────────────
# 5. cuet-phy-elec-dipole-22.png
#    Dipole in uniform E field at angle θ, torque shown
# ─────────────────────────────────────────────────────────
def img5():
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.set_xlim(-3, 5)
    ax.set_ylim(-3, 3)
    ax.set_aspect('equal')
    ax.axis('off')

    # Uniform E field arrows
    for y in np.linspace(-2.5, 2.5, 6):
        ax.annotate('', xy=(4.5, y), xytext=(3, y),
                    arrowprops=dict(arrowstyle='->', color='orange', lw=1.5, alpha=0.5))
    ax.text(4.5, 2.8, 'E⃗', fontsize=14, fontweight='bold', color='orange')

    # Dipole at angle θ
    theta = np.radians(40)
    length = 2
    cx, cy = 1, 0  # center

    # −q (lower-left)
    x1 = cx - length / 2 * np.cos(theta)
    y1 = cy - length / 2 * np.sin(theta)
    # +q (upper-right)
    x2 = cx + length / 2 * np.cos(theta)
    y2 = cy + length / 2 * np.sin(theta)

    ax.plot([x1, x2], [y1, y2], 'k-', lw=2)

    circle1 = plt.Circle((x1, y1), 0.3, fc='blue', ec='k', lw=2, alpha=0.8)
    ax.add_patch(circle1)
    ax.text(x1, y1, '−q', fontsize=10, ha='center', va='center', fontweight='bold', color='white')

    circle2 = plt.Circle((x2, y2), 0.3, fc='red', ec='k', lw=2, alpha=0.8)
    ax.add_patch(circle2)
    ax.text(x2, y2, '+q', fontsize=10, ha='center', va='center', fontweight='bold', color='white')

    # Angle θ arc
    arc_angles = np.linspace(0, theta, 30)
    arc_r = 1.2
    ax.plot(cx + arc_r * np.cos(arc_angles), cy + arc_r * np.sin(arc_angles), 'purple', lw=2)
    ax.text(cx + 1.5, cy + 0.3, 'θ', fontsize=14, fontweight='bold', color='purple')

    # Horizontal reference (E direction)
    ax.plot([cx - 1.5, cx + 1.5], [cy, cy], 'orange', lw=1, ls='--', alpha=0.5)

    # Torque arrow (clockwise)
    arc2 = patches.Arc((cx, cy), 3, 3, angle=0, theta1=50, theta2=90, color='green', lw=2.5)
    ax.add_patch(arc2)
    ax.annotate('', xy=(cx - 0.2, cy + 1.5), xytext=(cx + 0.3, cy + 1.5),
                arrowprops=dict(arrowstyle='->', color='green', lw=2))
    ax.text(cx - 1, cy + 1.8, 'τ⃗', fontsize=14, fontweight='bold', color='green')

    ax.set_title('Dipole in Uniform Electric Field', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-dipole-22.png')

if __name__ == '__main__':
    print("Batch 6: Generating 5 images...")
    img1()
    img2()
    img3()
    img4()
    img5()
    print("Batch 6 complete!")
