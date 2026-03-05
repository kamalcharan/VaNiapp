"""Batch 2: kirchhoff-22 to 24, wheatstone-21 to 22 (5 images)"""
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
# 1. cuet-phy-current-kirchhoff-30.png
#    Two-loop circuit: Loop 1 (10V, 3Ω), shared 5Ω, Loop 2 (6V, 2Ω)
# ─────────────────────────────────────────────────────────
def img1():
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.set_xlim(-1, 10)
    ax.set_ylim(-1, 6)
    ax.set_aspect('equal')
    ax.axis('off')

    # Loop 1 (left): 0,0 → 4,0 → 4,4 → 0,4 → 0,0
    ax.plot([0, 4], [0, 0], 'k-', lw=2)
    ax.plot([0, 0], [0, 4], 'k-', lw=2)
    ax.plot([0, 4], [4, 4], 'k-', lw=2)

    # Loop 2 (right): 4,0 → 8,0 → 8,4 → 4,4
    ax.plot([4, 8], [0, 0], 'k-', lw=2)
    ax.plot([8, 8], [0, 4], 'k-', lw=2)
    ax.plot([4, 8], [4, 4], 'k-', lw=2)

    # Shared branch
    ax.plot([4, 4], [0, 4], 'k-', lw=2)

    # Battery 10V on left side
    ax.plot([-0.3, 0.3], [2.3, 2.3], 'k-', lw=3)
    ax.plot([-0.15, 0.15], [1.7, 1.7], 'k-', lw=5)
    ax.text(-0.8, 2, '10 V', fontsize=11, fontweight='bold', ha='right')

    # 3Ω on top of loop 1
    rect = patches.FancyBboxPatch((1.2, 3.5), 1.6, 1, boxstyle="round,pad=0.1",
                                   ec='k', fc='#fff3e0', lw=2)
    ax.add_patch(rect)
    ax.text(2, 4, '3 Ω', fontsize=11, ha='center', va='center', fontweight='bold')

    # 5Ω on shared branch (center)
    rect2 = patches.FancyBboxPatch((3.2, 1.2), 1.6, 1.6, boxstyle="round,pad=0.1",
                                    ec='k', fc='#e8f5e9', lw=2)
    ax.add_patch(rect2)
    ax.text(4, 2, '5 Ω', fontsize=11, ha='center', va='center', fontweight='bold')

    # Battery 6V on right side
    ax.plot([7.7, 8.3], [2.3, 2.3], 'k-', lw=3)
    ax.plot([7.85, 8.15], [1.7, 1.7], 'k-', lw=5)
    ax.text(8.8, 2, '6 V', fontsize=11, fontweight='bold', ha='left')

    # 2Ω on top of loop 2
    rect3 = patches.FancyBboxPatch((5.2, 3.5), 1.6, 1, boxstyle="round,pad=0.1",
                                    ec='k', fc='#fff3e0', lw=2)
    ax.add_patch(rect3)
    ax.text(6, 4, '2 Ω', fontsize=11, ha='center', va='center', fontweight='bold')

    # Current arrows
    ax.annotate('', xy=(1, 0.3), xytext=(3, 0.3),
                arrowprops=dict(arrowstyle='<-', color='red', lw=2))
    ax.text(2, -0.5, 'I₁', fontsize=12, ha='center', color='red', fontweight='bold')

    ax.annotate('', xy=(5, 0.3), xytext=(7, 0.3),
                arrowprops=dict(arrowstyle='<-', color='blue', lw=2))
    ax.text(6, -0.5, 'I₂', fontsize=12, ha='center', color='blue', fontweight='bold')

    ax.set_title('Two-Loop Kirchhoff Circuit', fontsize=13, fontweight='bold', pad=10)
    save(fig, 'cuet-phy-current-kirchhoff-30.png')

# ─────────────────────────────────────────────────────────
# 2. cuet-phy-current-kirchhoff-31.png
#    Wheatstone bridge: P=10Ω, Q=20Ω, R=15Ω, S=? Galvanometer B-D
# ─────────────────────────────────────────────────────────
def img2():
    fig, ax = plt.subplots(figsize=(6, 6))
    ax.set_xlim(-2, 8)
    ax.set_ylim(-2, 8)
    ax.set_aspect('equal')
    ax.axis('off')

    # Diamond: A(top), B(right), C(bottom), D(left)
    A = (3, 7)
    B = (6, 3.5)
    C = (3, 0)
    D = (0, 3.5)

    # Draw arms
    for p1, p2, label, off in [
        (A, B, 'P = 10 Ω', (1.2, 1)),
        (A, D, 'Q = 20 Ω', (-1.8, 1)),
        (D, C, 'R = 15 Ω', (-1.8, -1)),
        (B, C, 'S = ?', (1.2, -1)),
    ]:
        ax.plot([p1[0], p2[0]], [p1[1], p2[1]], 'k-', lw=2)
        mx = (p1[0] + p2[0]) / 2 + off[0]
        my = (p1[1] + p2[1]) / 2 + off[1]
        ax.text(mx, my, label, fontsize=11, fontweight='bold', ha='center', va='center',
                bbox=dict(boxstyle='round,pad=0.3', fc='#fff3e0', ec='orange'))

    # Galvanometer B-D
    ax.plot([D[0], B[0]], [D[1], B[1]], 'g--', lw=2)
    ax.text(3, 3.5, 'G', fontsize=14, ha='center', va='center', fontweight='bold',
            color='green', bbox=dict(boxstyle='circle,pad=0.3', fc='#e8f5e9', ec='green'))

    # Node labels
    for pt, label, off in [(A, 'A', (0, 0.5)), (B, 'B', (0.5, 0)),
                            (C, 'C', (0, -0.5)), (D, 'D', (-0.5, 0))]:
        ax.plot(*pt, 'ko', ms=8)
        ax.text(pt[0] + off[0], pt[1] + off[1], label, fontsize=13, fontweight='bold',
                ha='center', va='center', color='darkred')

    # Battery at top/bottom
    ax.text(3, 7.8, 'Battery', fontsize=10, ha='center', color='blue')

    ax.set_title('Wheatstone Bridge', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-current-kirchhoff-31.png')

# ─────────────────────────────────────────────────────────
# 3. cuet-phy-current-kirchhoff-32.png
#    Y-to-Delta: 3 arms of 6Ω each from central node O to A, B, C
# ─────────────────────────────────────────────────────────
def img3():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

    for ax in [ax1, ax2]:
        ax.set_xlim(-3, 3)
        ax.set_ylim(-2.5, 3)
        ax.set_aspect('equal')
        ax.axis('off')

    # Y (Star) configuration
    O = (0, 0)
    A = (0, 2.5)
    B = (-2.2, -1.5)
    C = (2.2, -1.5)

    for pt, label in [(A, 'A'), (B, 'B'), (C, 'C')]:
        ax1.plot([O[0], pt[0]], [O[1], pt[1]], 'k-', lw=2)
        ax1.plot(*pt, 'ko', ms=8)
        off_x = 0.4 * np.sign(pt[0]) if pt[0] != 0 else 0
        off_y = 0.4 if pt[1] > 0 else -0.4
        ax1.text(pt[0] + off_x, pt[1] + off_y, label, fontsize=13, fontweight='bold',
                 ha='center', color='darkred')
        mx = (O[0] + pt[0]) / 2
        my = (O[1] + pt[1]) / 2
        ax1.text(mx + 0.4, my, '6 Ω', fontsize=10, fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.2', fc='#fff3e0', ec='orange'))

    ax1.plot(*O, 'ko', ms=10)
    ax1.text(0.4, 0, 'O', fontsize=13, fontweight='bold', color='darkblue')
    ax1.set_title('Y (Star)', fontsize=13, fontweight='bold')

    # Delta configuration
    A2 = (0, 2.5)
    B2 = (-2.2, -1.5)
    C2 = (2.2, -1.5)

    for p1, p2, label in [(A2, B2, 'R_AB = ?'), (B2, C2, 'R_BC = ?'), (C2, A2, 'R_CA = ?')]:
        ax2.plot([p1[0], p2[0]], [p1[1], p2[1]], 'b-', lw=2.5)
        ax2.plot(*p1, 'ko', ms=8)
        mx = (p1[0] + p2[0]) / 2
        my = (p1[1] + p2[1]) / 2
        off_x = 0.6 * np.sign(mx) if abs(mx) > 0.1 else 0
        off_y = 0.5 if my > 0 else -0.5
        ax2.text(mx + off_x, my + off_y, label, fontsize=10, fontweight='bold',
                 ha='center', color='blue',
                 bbox=dict(boxstyle='round,pad=0.2', fc='#e3f2fd', ec='steelblue'))

    for pt, label in [(A2, 'A'), (B2, 'B'), (C2, 'C')]:
        off_x = 0.4 * np.sign(pt[0]) if pt[0] != 0 else 0
        off_y = 0.4 if pt[1] > 0 else -0.4
        ax2.text(pt[0] + off_x, pt[1] + off_y, label, fontsize=13, fontweight='bold',
                 ha='center', color='darkred')

    ax2.set_title('Δ (Delta)', fontsize=13, fontweight='bold')

    fig.suptitle('Y → Δ Conversion', fontsize=14, fontweight='bold', y=1.02)
    save(fig, 'cuet-phy-current-kirchhoff-32.png')

# ─────────────────────────────────────────────────────────
# 4. cuet-phy-current-wheatstone-29.png
#    Standard Wheatstone: P=2Ω, Q=4Ω, R=3Ω, S=6Ω, galv B-D, battery A-C
# ─────────────────────────────────────────────────────────
def img4():
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
        (B, C, 'S = 6 Ω', (1, -1)),
        (A, D, 'Q = 4 Ω', (-1.5, 1)),
        (D, C, 'R = 3 Ω', (-1.5, -1)),
    ]

    for p1, p2, label, off in arms:
        ax.plot([p1[0], p2[0]], [p1[1], p2[1]], 'k-', lw=2)
        mx = (p1[0] + p2[0]) / 2 + off[0]
        my = (p1[1] + p2[1]) / 2 + off[1]
        ax.text(mx, my, label, fontsize=11, fontweight='bold', ha='center', va='center',
                bbox=dict(boxstyle='round,pad=0.3', fc='#fff3e0', ec='orange'))

    # Galvanometer
    ax.plot([D[0], B[0]], [D[1], B[1]], 'g--', lw=2)
    ax.text(3, 3.5, 'G', fontsize=14, ha='center', va='center', fontweight='bold',
            color='green', bbox=dict(boxstyle='circle,pad=0.3', fc='#e8f5e9', ec='green'))

    # Battery between A and C
    ax.plot([3, 3], [7, 7.5], 'k-', lw=2)
    ax.plot([3, 3], [0, -0.5], 'k-', lw=2)
    ax.text(3, -1, 'Battery', fontsize=10, ha='center', color='blue', fontweight='bold')

    for pt, label, off in [(A, 'A', (0, 0.5)), (B, 'B', (0.5, 0)),
                            (C, 'C', (0, -0.5)), (D, 'D', (-0.5, 0))]:
        ax.plot(*pt, 'ko', ms=8)
        ax.text(pt[0] + off[0], pt[1] + off[1], label, fontsize=13, fontweight='bold',
                ha='center', va='center', color='darkred')

    ax.set_title('Wheatstone Bridge (Balanced)', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-current-wheatstone-29.png')

# ─────────────────────────────────────────────────────────
# 5. cuet-phy-current-wheatstone-30.png
#    Metre bridge: 1m wire A-C, X (left gap), R=12Ω (right gap),
#    galv at D=60cm from A
# ─────────────────────────────────────────────────────────
def img5():
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.set_xlim(-1, 11)
    ax.set_ylim(-2, 6)
    ax.set_aspect('equal')
    ax.axis('off')

    # Wire from A(0,0) to C(10,0)
    ax.plot([0, 10], [0, 0], 'b-', lw=3)
    ax.text(0, -0.5, 'A', fontsize=13, fontweight='bold', ha='center', color='darkred')
    ax.text(10, -0.5, 'C', fontsize=13, fontweight='bold', ha='center', color='darkred')
    ax.plot(0, 0, 'ko', ms=8)
    ax.plot(10, 0, 'ko', ms=8)

    # Jockey at D = 60cm (= 6 on our scale)
    ax.plot(6, 0, 'rv', ms=12, zorder=5)
    ax.text(6, -0.7, 'D\n(60 cm)', fontsize=10, ha='center', color='red', fontweight='bold')

    # Top rail
    ax.plot([0, 10], [4, 4], 'k-', lw=2)

    # Left gap: X (unknown)
    ax.plot([0, 0], [0, 4], 'k-', lw=2)
    ax.plot([5, 5], [0, 0], 'k-', lw=1, alpha=0)  # placeholder
    rect_x = patches.FancyBboxPatch((1, 3.2), 2.5, 1.6, boxstyle="round,pad=0.1",
                                     ec='k', fc='#e3f2fd', lw=2)
    ax.add_patch(rect_x)
    ax.text(2.25, 4, 'X = ?', fontsize=12, ha='center', va='center', fontweight='bold')
    ax.plot([2.25, 2.25], [4.8, 4], 'k-', lw=2)
    ax.plot([0, 2.25], [4, 4.8], 'k-', lw=2)

    # Right gap: R = 12 Ω
    ax.plot([10, 10], [0, 4], 'k-', lw=2)
    rect_r = patches.FancyBboxPatch((6.5, 3.2), 2.5, 1.6, boxstyle="round,pad=0.1",
                                     ec='k', fc='#fff3e0', lw=2)
    ax.add_patch(rect_r)
    ax.text(7.75, 4, 'R = 12 Ω', fontsize=12, ha='center', va='center', fontweight='bold')
    ax.plot([7.75, 7.75], [4.8, 4], 'k-', lw=2)
    ax.plot([10, 7.75], [4, 4.8], 'k-', lw=2)

    # Galvanometer from center terminal to jockey
    ax.plot([5, 6], [4.8, 0.5], 'g--', lw=2)
    ax.text(5, 5.2, 'G', fontsize=13, ha='center', fontweight='bold', color='green',
            bbox=dict(boxstyle='circle,pad=0.3', fc='#e8f5e9', ec='green'))

    # Battery
    ax.plot([0, 0], [-0.5, -1.2], 'k-', lw=2)
    ax.plot([10, 10], [-0.5, -1.2], 'k-', lw=2)
    ax.plot([0, 10], [-1.2, -1.2], 'k-', lw=2)
    ax.text(5, -1.5, 'Battery', fontsize=10, ha='center', color='blue', fontweight='bold')

    # Length markers
    ax.annotate('', xy=(0, -0.2), xytext=(6, -0.2),
                arrowprops=dict(arrowstyle='<->', color='gray', lw=1.5))
    ax.text(3, -0.1, '60 cm', fontsize=9, ha='center', va='bottom', color='gray')

    ax.set_title('Metre Bridge', fontsize=13, fontweight='bold', pad=10)
    save(fig, 'cuet-phy-current-wheatstone-30.png')

if __name__ == '__main__':
    print("Batch 2: Generating 5 images...")
    img1()
    img2()
    img3()
    img4()
    img5()
    print("Batch 2 complete!")
