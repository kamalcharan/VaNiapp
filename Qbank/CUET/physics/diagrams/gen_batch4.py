"""Batch 4: potentiometer-24, power-21 to 24 (5 images)"""
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
# 1. cuet-phy-current-potentiometer-24.png
#    Kelvin double bridge: wire PQ, standard S, unknown X, galv G
# ─────────────────────────────────────────────────────────
def img1():
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.set_xlim(-2, 12)
    ax.set_ylim(-3, 5)
    ax.set_aspect('equal')
    ax.axis('off')

    # Potentiometer wire PQ
    ax.plot([0, 10], [0, 0], color='brown', lw=4, solid_capstyle='round')
    ax.plot(0, 0, 'ko', ms=8)
    ax.plot(10, 0, 'ko', ms=8)
    ax.text(0, 0.5, 'P', fontsize=13, fontweight='bold', ha='center', color='darkred')
    ax.text(10, 0.5, 'Q', fontsize=13, fontweight='bold', ha='center', color='darkred')

    # Current source (ammeter) at bottom
    ax.plot([0, 0], [0, -2], 'k-', lw=2)
    ax.plot([10, 10], [0, -2], 'k-', lw=2)
    ax.plot([0, 10], [-2, -2], 'k-', lw=2)
    circle_a = plt.Circle((5, -2), 0.4, fill=True, fc='#e3f2fd', ec='blue', lw=2)
    ax.add_patch(circle_a)
    ax.text(5, -2, 'A', fontsize=10, ha='center', va='center', fontweight='bold', color='blue')

    # Standard resistance S
    rect_s = patches.FancyBboxPatch((1, 2.5), 2.5, 1.2, boxstyle="round,pad=0.1",
                                     ec='k', fc='#e8f5e9', lw=2)
    ax.add_patch(rect_s)
    ax.text(2.25, 3.1, 'S (std)', fontsize=11, ha='center', va='center', fontweight='bold')
    ax.plot([0, 2.25], [0, 2.5], 'k-', lw=2)

    # Unknown resistance X
    rect_x = patches.FancyBboxPatch((6.5, 2.5), 2.5, 1.2, boxstyle="round,pad=0.1",
                                     ec='k', fc='#fff3e0', lw=2)
    ax.add_patch(rect_x)
    ax.text(7.75, 3.1, 'X (unknown)', fontsize=11, ha='center', va='center', fontweight='bold')
    ax.plot([10, 7.75], [0, 2.5], 'k-', lw=2)

    # Galvanometer between ratio arms
    ax.plot([2.25, 7.75], [3.7, 3.7], 'g--', lw=2)
    circle_g = plt.Circle((5, 3.7), 0.4, fill=True, fc='#e8f5e9', ec='green', lw=2)
    ax.add_patch(circle_g)
    ax.text(5, 3.7, 'G', fontsize=10, ha='center', va='center', fontweight='bold', color='green')

    ax.set_title('Kelvin Double Bridge', fontsize=13, fontweight='bold', pad=10)
    save(fig, 'cuet-phy-current-potentiometer-24.png')

# ─────────────────────────────────────────────────────────
# 2. cuet-phy-current-power-21.png
#    Simple circuit: 6V battery + 3Ω resistor
# ─────────────────────────────────────────────────────────
def img2():
    fig, ax = plt.subplots(figsize=(5, 4))
    ax.set_xlim(-1, 6)
    ax.set_ylim(-1, 5)
    ax.set_aspect('equal')
    ax.axis('off')

    # Rectangle circuit
    ax.plot([0, 5], [0, 0], 'k-', lw=2)
    ax.plot([5, 5], [0, 4], 'k-', lw=2)
    ax.plot([0, 5], [4, 4], 'k-', lw=2)
    ax.plot([0, 0], [0, 4], 'k-', lw=2)

    # Battery on left
    ax.plot([-0.3, 0.3], [2.3, 2.3], 'k-', lw=3)
    ax.plot([-0.15, 0.15], [1.7, 1.7], 'k-', lw=5)
    ax.text(-0.8, 2, '6 V', fontsize=12, fontweight='bold', ha='right')

    # 3Ω on right
    rect = patches.FancyBboxPatch((4.2, 1.2), 1.6, 1.6, boxstyle="round,pad=0.1",
                                   ec='k', fc='#fff3e0', lw=2)
    ax.add_patch(rect)
    ax.text(5, 2, '3 Ω', fontsize=12, ha='center', va='center', fontweight='bold')

    ax.set_title('Simple Circuit', fontsize=13, fontweight='bold', pad=10)
    save(fig, 'cuet-phy-current-power-21.png')

# ─────────────────────────────────────────────────────────
# 3. cuet-phy-current-power-22.png
#    12V battery, R₁=6Ω and R₂=3Ω in parallel
# ─────────────────────────────────────────────────────────
def img3():
    fig, ax = plt.subplots(figsize=(7, 5))
    ax.set_xlim(-1, 8)
    ax.set_ylim(-1, 6)
    ax.set_aspect('equal')
    ax.axis('off')

    # Battery on left
    ax.plot([0, 0], [0, 5], 'k-', lw=2)
    ax.plot([-0.3, 0.3], [2.8, 2.8], 'k-', lw=3)
    ax.plot([-0.15, 0.15], [2.2, 2.2], 'k-', lw=5)
    ax.text(-0.8, 2.5, '12 V', fontsize=11, fontweight='bold', ha='right')

    # Top/bottom rails
    ax.plot([0, 7], [5, 5], 'k-', lw=2)
    ax.plot([0, 7], [0, 0], 'k-', lw=2)

    # R₁ = 6Ω
    ax.plot([3, 3], [5, 3.5], 'k-', lw=2)
    ax.plot([3, 3], [1.5, 0], 'k-', lw=2)
    rect1 = patches.FancyBboxPatch((2.3, 1.5), 1.4, 2, boxstyle="round,pad=0.1",
                                    ec='k', fc='#fff3e0', lw=2)
    ax.add_patch(rect1)
    ax.text(3, 2.5, 'R₁\n6 Ω', fontsize=10, ha='center', va='center', fontweight='bold')

    # R₂ = 3Ω
    ax.plot([5.5, 5.5], [5, 3.5], 'k-', lw=2)
    ax.plot([5.5, 5.5], [1.5, 0], 'k-', lw=2)
    rect2 = patches.FancyBboxPatch((4.8, 1.5), 1.4, 2, boxstyle="round,pad=0.1",
                                    ec='k', fc='#fff3e0', lw=2)
    ax.add_patch(rect2)
    ax.text(5.5, 2.5, 'R₂\n3 Ω', fontsize=10, ha='center', va='center', fontweight='bold')

    # Right wire
    ax.plot([7, 7], [0, 5], 'k-', lw=2)

    ax.set_title('Parallel Circuit', fontsize=13, fontweight='bold', pad=10)
    save(fig, 'cuet-phy-current-power-22.png')

# ─────────────────────────────────────────────────────────
# 4. cuet-phy-current-power-23.png
#    3 identical R in series, one short-circuited
# ─────────────────────────────────────────────────────────
def img4():
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.set_xlim(-1, 10)
    ax.set_ylim(-1, 5)
    ax.set_aspect('equal')
    ax.axis('off')

    # Rectangle circuit
    ax.plot([0, 9], [0, 0], 'k-', lw=2)
    ax.plot([9, 9], [0, 3], 'k-', lw=2)
    ax.plot([0, 9], [3, 3], 'k-', lw=2)
    ax.plot([0, 0], [0, 3], 'k-', lw=2)

    # Battery on left
    ax.plot([-0.3, 0.3], [1.8, 1.8], 'k-', lw=3)
    ax.plot([-0.15, 0.15], [1.2, 1.2], 'k-', lw=5)
    ax.text(-0.8, 1.5, 'V', fontsize=12, fontweight='bold', ha='right')

    # Three resistors on top
    positions = [1.5, 4, 6.5]
    for i, x in enumerate(positions):
        rect = patches.FancyBboxPatch((x - 0.6, 2.4), 1.2, 1.2, boxstyle="round,pad=0.1",
                                       ec='k', fc='#fff3e0', lw=2)
        ax.add_patch(rect)
        ax.text(x, 3, 'R', fontsize=11, ha='center', va='center', fontweight='bold')

    # Short circuit wire across middle resistor
    ax.plot([3.4, 4.6], [3.8, 3.8], 'r-', lw=3)
    ax.text(4, 4.3, 'short-circuited', fontsize=9, ha='center', color='red', fontstyle='italic')

    ax.set_title('Series Circuit (one R short-circuited)', fontsize=12, fontweight='bold', pad=10)
    save(fig, 'cuet-phy-current-power-23.png')

# ─────────────────────────────────────────────────────────
# 5. cuet-phy-current-power-24.png
#    Wheatstone bridge: P=2Ω, Q=4Ω, R=3Ω, S=6Ω, 10V battery, galv
# ─────────────────────────────────────────────────────────
def img5():
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
        (A, B, 'P = 2 Ω', (1, 1)),
        (B, C, 'S = 6 Ω', (1.2, -1)),
        (A, D, 'Q = 4 Ω', (-1.5, 1)),
        (D, C, 'R = 3 Ω', (-1.5, -1)),
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

    # Battery 10V
    ax.text(3, -1.2, '10 V', fontsize=12, ha='center', color='blue', fontweight='bold')

    for pt, label, off in [(A, 'A', (0, 0.5)), (B, 'B', (0.5, 0)),
                            (C, 'C', (0, -0.5)), (D, 'D', (-0.5, 0))]:
        ax.plot(*pt, 'ko', ms=8)
        ax.text(pt[0] + off[0], pt[1] + off[1], label, fontsize=13, fontweight='bold',
                ha='center', va='center', color='darkred')

    ax.set_title('Wheatstone Bridge (10 V)', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-current-power-24.png')

if __name__ == '__main__':
    print("Batch 4: Generating 5 images...")
    img1()
    img2()
    img3()
    img4()
    img5()
    print("Batch 4 complete!")
