"""Batch 3: wheatstone-23 to 24, potentiometer-21 to 23 (5 images)"""
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
# 1. cuet-phy-current-wheatstone-31.png
#    Wheatstone: P=100Ω, Q=100Ω, R=47Ω (variable), S=unknown
# ─────────────────────────────────────────────────────────
def img1():
    fig, ax = plt.subplots(figsize=(6, 6))
    ax.set_xlim(-2, 8)
    ax.set_ylim(-2, 8)
    ax.set_aspect('equal')
    ax.axis('off')

    A = (3, 7)
    B = (6, 3.5)
    C = (3, 0)
    D = (0, 3.5)

    arms = [
        (A, B, 'P = 100 Ω', (1.2, 1)),
        (B, C, 'S = ?', (1.2, -1)),
        (A, D, 'Q = 100 Ω', (-1.8, 1)),
        (D, C, 'R = 47 Ω\n(variable)', (-2, -1)),
    ]

    for p1, p2, label, off in arms:
        ax.plot([p1[0], p2[0]], [p1[1], p2[1]], 'k-', lw=2)
        mx = (p1[0] + p2[0]) / 2 + off[0]
        my = (p1[1] + p2[1]) / 2 + off[1]
        ax.text(mx, my, label, fontsize=10, fontweight='bold', ha='center', va='center',
                bbox=dict(boxstyle='round,pad=0.3', fc='#fff3e0', ec='orange'))

    # Galvanometer
    ax.plot([D[0], B[0]], [D[1], B[1]], 'g--', lw=2)
    ax.text(3, 3.5, 'G', fontsize=14, ha='center', va='center', fontweight='bold',
            color='green', bbox=dict(boxstyle='circle,pad=0.3', fc='#e8f5e9', ec='green'))

    # Battery
    ax.text(3, -1.2, 'Battery', fontsize=10, ha='center', color='blue', fontweight='bold')

    for pt, label, off in [(A, 'A', (0, 0.5)), (B, 'B', (0.5, 0)),
                            (C, 'C', (0, -0.5)), (D, 'D', (-0.5, 0))]:
        ax.plot(*pt, 'ko', ms=8)
        ax.text(pt[0] + off[0], pt[1] + off[1], label, fontsize=13, fontweight='bold',
                ha='center', va='center', color='darkred')

    ax.set_title('Wheatstone Bridge (P = Q = 100 Ω)', fontsize=12, fontweight='bold')
    save(fig, 'cuet-phy-current-wheatstone-31.png')

# ─────────────────────────────────────────────────────────
# 2. cuet-phy-current-wheatstone-32.png
#    Unbalanced Wheatstone: P=1000, Q=100, R=200, S=50, G=200Ω, 10V
# ─────────────────────────────────────────────────────────
def img2():
    fig, ax = plt.subplots(figsize=(6, 6))
    ax.set_xlim(-2, 8)
    ax.set_ylim(-2, 8)
    ax.set_aspect('equal')
    ax.axis('off')

    A = (3, 7)
    B = (6, 3.5)
    C = (3, 0)
    D = (0, 3.5)

    arms = [
        (A, B, 'P = 1000 Ω', (1.2, 1)),
        (B, C, 'S = 50 Ω', (1.5, -1)),
        (A, D, 'Q = 100 Ω', (-1.8, 1)),
        (D, C, 'R = 200 Ω', (-1.8, -1)),
    ]

    for p1, p2, label, off in arms:
        ax.plot([p1[0], p2[0]], [p1[1], p2[1]], 'k-', lw=2)
        mx = (p1[0] + p2[0]) / 2 + off[0]
        my = (p1[1] + p2[1]) / 2 + off[1]
        ax.text(mx, my, label, fontsize=10, fontweight='bold', ha='center', va='center',
                bbox=dict(boxstyle='round,pad=0.3', fc='#fff3e0', ec='orange'))

    # Galvanometer with resistance
    ax.plot([D[0], B[0]], [D[1], B[1]], 'g--', lw=2)
    ax.text(3, 3.5, 'G\n200 Ω', fontsize=11, ha='center', va='center', fontweight='bold',
            color='green', bbox=dict(boxstyle='round,pad=0.3', fc='#e8f5e9', ec='green'))

    # Battery 10V
    ax.text(3, -1.2, 'E = 10 V', fontsize=11, ha='center', color='blue', fontweight='bold')

    for pt, label, off in [(A, 'A', (0, 0.5)), (B, 'B', (0.5, 0)),
                            (C, 'C', (0, -0.5)), (D, 'D', (-0.5, 0))]:
        ax.plot(*pt, 'ko', ms=8)
        ax.text(pt[0] + off[0], pt[1] + off[1], label, fontsize=13, fontweight='bold',
                ha='center', va='center', color='darkred')

    ax.set_title('Unbalanced Wheatstone Bridge', fontsize=12, fontweight='bold')
    save(fig, 'cuet-phy-current-wheatstone-32.png')

# ─────────────────────────────────────────────────────────
# 3. cuet-phy-current-potentiometer-21.png
#    Basic potentiometer: driver cell E across wire AB,
#    secondary cell E₁ via galv G to jockey J at distance l
# ─────────────────────────────────────────────────────────
def img3():
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.set_xlim(-2, 12)
    ax.set_ylim(-3, 5)
    ax.set_aspect('equal')
    ax.axis('off')

    # Wire AB
    ax.plot([0, 10], [0, 0], color='brown', lw=4, solid_capstyle='round')
    ax.plot(0, 0, 'ko', ms=8)
    ax.plot(10, 0, 'ko', ms=8)
    ax.text(0, 0.5, 'A', fontsize=13, fontweight='bold', ha='center', color='darkred')
    ax.text(10, 0.5, 'B', fontsize=13, fontweight='bold', ha='center', color='darkred')

    # Driver cell E across AB (top circuit)
    ax.plot([0, 0], [0, 3], 'k-', lw=2)
    ax.plot([0, 10], [3, 3], 'k-', lw=2)
    ax.plot([10, 10], [3, 0], 'k-', lw=2)
    # Battery E
    ax.plot([4.7, 5.3], [3.2, 3.2], 'k-', lw=3)
    ax.plot([4.85, 5.15], [2.8, 2.8], 'k-', lw=5)
    ax.text(5, 3.8, 'E', fontsize=12, fontweight='bold', color='blue')

    # Jockey J at distance l from A (say at x=6)
    jx = 6
    ax.plot(jx, 0, 'rv', ms=14, zorder=5)
    ax.text(jx, -0.7, 'J', fontsize=12, fontweight='bold', ha='center', color='red')

    # Secondary cell E₁ circuit
    ax.plot([0, 0], [0, -2], 'k-', lw=2)
    ax.plot([0, 3], [-2, -2], 'k-', lw=2)
    # Battery E₁
    ax.plot([1.2, 1.8], [-1.8, -1.8], 'k-', lw=3)
    ax.plot([1.35, 1.65], [-2.2, -2.2], 'k-', lw=5)
    ax.text(1.5, -1.2, 'E₁', fontsize=11, fontweight='bold', color='blue')

    # Galvanometer
    ax.plot([3, 4.5], [-2, -2], 'k-', lw=2)
    circle_g = plt.Circle((3.75, -2), 0.4, fill=True, fc='#e8f5e9', ec='green', lw=2)
    ax.add_patch(circle_g)
    ax.text(3.75, -2, 'G', fontsize=10, ha='center', va='center', fontweight='bold', color='green')

    # Wire from galv to jockey
    ax.plot([4.5, jx], [-2, -2], 'k-', lw=2)
    ax.plot([jx, jx], [-2, 0], 'k--', lw=1.5, color='gray')

    # Distance marker l
    ax.annotate('', xy=(0, -0.3), xytext=(jx, -0.3),
                arrowprops=dict(arrowstyle='<->', color='purple', lw=1.5))
    ax.text(jx / 2, -0.2, 'l', fontsize=13, fontweight='bold', ha='center', va='bottom', color='purple')

    ax.set_title('Potentiometer – Basic Circuit', fontsize=13, fontweight='bold', pad=10)
    save(fig, 'cuet-phy-current-potentiometer-21.png')

# ─────────────────────────────────────────────────────────
# 4. cuet-phy-current-potentiometer-22.png
#    Comparing two cells: E₀ driver, two-way key, balance at l₁ and l₂
# ─────────────────────────────────────────────────────────
def img4():
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.set_xlim(-2, 12)
    ax.set_ylim(-4, 5)
    ax.set_aspect('equal')
    ax.axis('off')

    # Wire AB
    ax.plot([0, 10], [0, 0], color='brown', lw=4, solid_capstyle='round')
    ax.plot(0, 0, 'ko', ms=8)
    ax.plot(10, 0, 'ko', ms=8)
    ax.text(0, 0.5, 'A', fontsize=13, fontweight='bold', ha='center', color='darkred')
    ax.text(10, 0.5, 'B', fontsize=13, fontweight='bold', ha='center', color='darkred')

    # Driver cell E₀
    ax.plot([0, 0], [0, 3], 'k-', lw=2)
    ax.plot([0, 10], [3, 3], 'k-', lw=2)
    ax.plot([10, 10], [3, 0], 'k-', lw=2)
    ax.plot([4.7, 5.3], [3.2, 3.2], 'k-', lw=3)
    ax.plot([4.85, 5.15], [2.8, 2.8], 'k-', lw=5)
    ax.text(5, 3.8, 'E₀ (r₀)', fontsize=11, fontweight='bold', color='blue')

    # Balance point markers
    l1x, l2x = 4, 7
    ax.plot(l1x, 0, 'g^', ms=10, zorder=5)
    ax.text(l1x, 0.5, 'l₁', fontsize=12, fontweight='bold', color='green', ha='center')
    ax.plot(l2x, 0, 'b^', ms=10, zorder=5)
    ax.text(l2x, 0.5, 'l₂', fontsize=12, fontweight='bold', color='blue', ha='center')

    # Two cells E₁, E₂ with two-way key
    ax.plot([0, 0], [0, -2], 'k-', lw=2)

    # E₁
    ax.plot([0, 2], [-2, -2], 'k-', lw=2)
    ax.plot([1.7, 2.3], [-1.8, -1.8], 'k-', lw=3)
    ax.plot([1.85, 2.15], [-2.2, -2.2], 'k-', lw=5)
    ax.text(2, -1.2, 'E₁', fontsize=10, fontweight='bold', color='green')

    # E₂
    ax.plot([0, 2], [-3, -3], 'k-', lw=2)
    ax.plot([1.7, 2.3], [-2.8, -2.8], 'k-', lw=3)
    ax.plot([1.85, 2.15], [-3.2, -3.2], 'k-', lw=5)
    ax.text(2, -3.7, 'E₂', fontsize=10, fontweight='bold', color='blue')

    # Two-way key
    ax.plot([2.5, 3.5], [-2, -2.5], 'k-', lw=2)
    ax.plot([2.5, 3.5], [-3, -2.5], 'k-', lw=2)
    rect = patches.FancyBboxPatch((3, -3), 1, 1, boxstyle="round,pad=0.1",
                                   ec='gray', fc='#f5f5f5', lw=2)
    ax.add_patch(rect)
    ax.text(3.5, -2.5, 'Key', fontsize=9, ha='center', va='center')

    # Galvanometer
    ax.plot([4, 5.5], [-2.5, -2.5], 'k-', lw=2)
    circle_g = plt.Circle((4.75, -2.5), 0.4, fill=True, fc='#e8f5e9', ec='green', lw=2)
    ax.add_patch(circle_g)
    ax.text(4.75, -2.5, 'G', fontsize=10, ha='center', va='center', fontweight='bold', color='green')

    # Jockey
    ax.plot([5.5, 6], [-2.5, 0], 'k--', lw=1.5, color='gray')

    ax.set_title('Potentiometer – Comparing Two Cells', fontsize=13, fontweight='bold', pad=10)
    save(fig, 'cuet-phy-current-potentiometer-22.png')

# ─────────────────────────────────────────────────────────
# 5. cuet-phy-current-potentiometer-23.png
#    Internal resistance measurement: cell E with r, external R, key K
#    Balance points l₁ (open) and l₂ (closed)
# ─────────────────────────────────────────────────────────
def img5():
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.set_xlim(-2, 12)
    ax.set_ylim(-4, 5)
    ax.set_aspect('equal')
    ax.axis('off')

    # Wire AB
    ax.plot([0, 10], [0, 0], color='brown', lw=4, solid_capstyle='round')
    ax.plot(0, 0, 'ko', ms=8)
    ax.plot(10, 0, 'ko', ms=8)
    ax.text(0, 0.5, 'A', fontsize=13, fontweight='bold', ha='center', color='darkred')
    ax.text(10, 0.5, 'B', fontsize=13, fontweight='bold', ha='center', color='darkred')

    # Driver cell (top)
    ax.plot([0, 0], [0, 3], 'k-', lw=2)
    ax.plot([0, 10], [3, 3], 'k-', lw=2)
    ax.plot([10, 10], [3, 0], 'k-', lw=2)
    ax.plot([4.7, 5.3], [3.2, 3.2], 'k-', lw=3)
    ax.plot([4.85, 5.15], [2.8, 2.8], 'k-', lw=5)
    ax.text(5, 3.8, 'E (driver)', fontsize=11, fontweight='bold', color='blue')

    # Balance points
    ax.plot(5, 0, 'g^', ms=10, zorder=5)
    ax.text(5, 0.5, 'l₁', fontsize=12, fontweight='bold', color='green', ha='center')
    ax.plot(3.5, 0, 'r^', ms=10, zorder=5)
    ax.text(3.5, 0.5, 'l₂', fontsize=12, fontweight='bold', color='red', ha='center')

    # Cell E with internal resistance r
    ax.plot([0, 0], [0, -1.5], 'k-', lw=2)
    ax.plot([0, 2], [-1.5, -1.5], 'k-', lw=2)
    ax.plot([1.7, 2.3], [-1.3, -1.3], 'k-', lw=3)
    ax.plot([1.85, 2.15], [-1.7, -1.7], 'k-', lw=5)
    ax.text(2, -0.8, 'E (r)', fontsize=10, fontweight='bold', color='purple')

    # Galvanometer
    ax.plot([2.5, 4], [-1.5, -1.5], 'k-', lw=2)
    circle_g = plt.Circle((3.25, -1.5), 0.35, fill=True, fc='#e8f5e9', ec='green', lw=2)
    ax.add_patch(circle_g)
    ax.text(3.25, -1.5, 'G', fontsize=9, ha='center', va='center', fontweight='bold', color='green')
    ax.plot([4, 5], [-1.5, 0], 'k--', lw=1.5, color='gray')

    # External resistance R with key K
    ax.plot([2.5, 2.5], [-1.5, -3], 'k-', lw=2)
    ax.plot([2.5, 5], [-3, -3], 'k-', lw=2)
    rect_r = patches.FancyBboxPatch((3.2, -3.5), 1.6, 1, boxstyle="round,pad=0.1",
                                     ec='k', fc='#fff3e0', lw=2)
    ax.add_patch(rect_r)
    ax.text(4, -3, 'R', fontsize=11, ha='center', va='center', fontweight='bold')

    ax.plot([5, 7], [-3, -3], 'k-', lw=2)

    # Key K
    ax.plot([6, 6.8], [-3, -3.3], 'k-', lw=2)
    ax.plot(6, -3, 'ko', ms=6)
    ax.plot(7, -3, 'ko', ms=6)
    ax.text(6.5, -3.7, 'K', fontsize=11, fontweight='bold', ha='center', color='red')

    ax.plot([7, 7], [-3, -1.5], 'k-', lw=2)
    ax.plot([7, 2.5], [-1.5, -1.5], 'k-', lw=1, alpha=0)  # connects back

    ax.set_title('Potentiometer – Internal Resistance', fontsize=13, fontweight='bold', pad=10)
    save(fig, 'cuet-phy-current-potentiometer-23.png')

if __name__ == '__main__':
    print("Batch 3: Generating 5 images...")
    img1()
    img2()
    img3()
    img4()
    img5()
    print("Batch 3 complete!")
