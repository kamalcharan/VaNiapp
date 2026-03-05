"""Batch 11: ampere-23 to 24, force-21 to 23 (5 images)"""
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
# 1. solenoid-rectangular-amperian-loop.png
#    Solenoid cross-section + rectangular ABCD Amperian loop
# ─────────────────────────────────────────────────────────
def img1():
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.set_xlim(-1, 10)
    ax.set_ylim(-3, 4)
    ax.set_aspect('equal')
    ax.axis('off')

    # Solenoid turns (top and bottom rows of circles)
    for x in np.linspace(1, 8, 15):
        ax.plot(x, 1.5, 'ko', ms=4)   # top wire (current out)
        ax.plot(x, -1.5, 'kx', ms=5)  # bottom wire (current in)

    # Solenoid body outline
    ax.plot([1, 8], [1.5, 1.5], 'gray', lw=1, alpha=0.5)
    ax.plot([1, 8], [-1.5, -1.5], 'gray', lw=1, alpha=0.5)

    # Rectangular Amperian loop ABCD
    # AB inside (horizontal), CD outside (horizontal)
    A = (2, 0)
    B = (7, 0)
    C = (7, 3)
    D = (2, 3)

    loop = plt.Polygon([A, B, C, D], fill=False, ec='red', lw=2.5, ls='--')
    ax.add_patch(loop)

    # Labels
    for pt, label, off in [(A, 'A', (-0.4, -0.4)), (B, 'B', (0.4, -0.4)),
                            (C, 'C', (0.4, 0.3)), (D, 'D', (-0.4, 0.3))]:
        ax.plot(*pt, 'ro', ms=6)
        ax.text(pt[0] + off[0], pt[1] + off[1], label, fontsize=12,
                fontweight='bold', color='red', ha='center')

    # B field arrow inside
    ax.annotate('', xy=(6, 0), xytext=(3, 0),
                arrowprops=dict(arrowstyle='->', color='blue', lw=2.5))
    ax.text(4.5, -0.5, 'B⃗ (inside)', fontsize=10, ha='center', fontweight='bold', color='blue')

    # B ≈ 0 outside label
    ax.text(4.5, 3.3, 'B ≈ 0 (outside)', fontsize=9, ha='center', color='gray', fontstyle='italic')

    ax.text(0.3, 0, '⊙', fontsize=12, color='green')
    ax.text(0.3, -2, '⊗', fontsize=12, color='green')
    ax.text(-0.5, -0.5, 'I out', fontsize=8, color='green')
    ax.text(-0.5, -2.3, 'I in', fontsize=8, color='green')

    ax.set_title('Solenoid with Amperian Loop ABCD', fontsize=12, fontweight='bold')
    save(fig, 'solenoid-rectangular-amperian-loop.png')

# ─────────────────────────────────────────────────────────
# 2. thick-conductor-B-vs-r-graph.png
#    Four B vs r graphs
# ─────────────────────────────────────────────────────────
def img2():
    fig, axes = plt.subplots(2, 2, figsize=(8, 7))
    R = 2
    r = np.linspace(0.1, 5, 200)
    r_in = np.linspace(0, R, 50)
    r_out = np.linspace(R, 5, 150)

    titles = ['(A) Linear then 1/r', '(B) Constant then 1/r',
              '(C) 1/r everywhere', '(D) Linear everywhere']

    for ax, title in zip(axes.flat, titles):
        ax.set_xlabel('r', fontsize=10)
        ax.set_ylabel('B', fontsize=10)
        ax.set_xlim(0, 5)
        ax.set_title(title, fontsize=10, fontweight='bold')
        ax.grid(True, alpha=0.3)
        ax.axvline(R, color='gray', ls='--', lw=0.8, alpha=0.5)
        ax.text(R, -0.05, 'R', fontsize=9, ha='center', color='gray',
                transform=ax.get_xaxis_transform())

    # A: linear inside, 1/r outside (CORRECT for thick conductor)
    axes[0, 0].plot(r_in, r_in / R, 'b-', lw=2.5)
    axes[0, 0].plot(r_out, R / r_out, 'b-', lw=2.5)
    axes[0, 0].plot(R, 1, 'ro', ms=6)
    axes[0, 0].set_ylim(0, 1.5)

    # B: constant inside, 1/r outside
    axes[0, 1].plot(r_in, np.ones_like(r_in), 'b-', lw=2.5)
    axes[0, 1].plot(r_out, R / r_out, 'b-', lw=2.5)
    axes[0, 1].set_ylim(0, 1.5)

    # C: 1/r everywhere
    axes[1, 0].plot(r, 1 / r, 'b-', lw=2.5)
    axes[1, 0].set_ylim(0, 3)

    # D: linear everywhere
    axes[1, 1].plot(r, 0.3 * r, 'b-', lw=2.5)
    axes[1, 1].set_ylim(0, 2)

    plt.tight_layout()
    save(fig, 'thick-conductor-B-vs-r-graph.png')

# ─────────────────────────────────────────────────────────
# 3. cuet-phy-mag-force-29.png
#    Horizontal conductor I left→right, B into page (crosses), force?
# ─────────────────────────────────────────────────────────
def img3():
    fig, ax = plt.subplots(figsize=(7, 5))
    ax.set_xlim(-2, 8)
    ax.set_ylim(-2, 5)
    ax.set_aspect('equal')
    ax.axis('off')

    # Conductor
    ax.plot([0, 6], [2, 2], 'k-', lw=4)
    ax.annotate('', xy=(6, 2), xytext=(5, 2),
                arrowprops=dict(arrowstyle='->', color='red', lw=3))
    ax.text(3, 2.5, 'I →', fontsize=14, fontweight='bold', color='red', ha='center')

    # B into page (crosses)
    for x in range(0, 7):
        for y in [0, 1, 3, 4]:
            ax.text(x, y, '×', fontsize=10, ha='center', va='center', color='blue', alpha=0.6)

    ax.text(7, 4, 'B⃗ (into page)', fontsize=11, fontweight='bold', color='blue')

    # Force arrow (upward by F = IL × B)
    ax.annotate('', xy=(3, 4.5), xytext=(3, 2.5),
                arrowprops=dict(arrowstyle='->', color='green', lw=3))
    ax.text(3.5, 3.5, 'F⃗ = ?', fontsize=12, fontweight='bold', color='green')

    ax.set_title('Force on Current-Carrying Conductor', fontsize=12, fontweight='bold')
    save(fig, 'cuet-phy-mag-force-29.png')

# ─────────────────────────────────────────────────────────
# 4. cuet-phy-mag-force-30.png
#    Rectangular loop ABCD in xz-plane, I anticlockwise, B along +x
# ─────────────────────────────────────────────────────────
def img4():
    fig, ax = plt.subplots(figsize=(7, 5))
    ax.set_xlim(-2, 8)
    ax.set_ylim(-2, 6)
    ax.set_aspect('equal')
    ax.axis('off')

    # Rectangle ABCD
    A, B_pt, C, D = (1, 1), (5, 1), (5, 4), (1, 4)
    loop = plt.Polygon([A, B_pt, C, D], fill=False, ec='k', lw=2.5)
    ax.add_patch(loop)

    # Labels
    for pt, label, off in [(A, 'A', (-0.5, -0.4)), (B_pt, 'B', (0.5, -0.4)),
                            (C, 'C', (0.5, 0.4)), (D, 'D', (-0.5, 0.4))]:
        ax.plot(*pt, 'ko', ms=6)
        ax.text(pt[0] + off[0], pt[1] + off[1], label, fontsize=12, fontweight='bold', color='darkred')

    # Current direction (anticlockwise): A→D→C→B→A
    mid_points = [
        ((A[0], (A[1] + D[1]) / 2), '↑'),      # A to D (left, up)
        (((D[0] + C[0]) / 2, D[1]), '→'),        # D to C (top, right)
        ((C[0], (C[1] + B_pt[1]) / 2), '↓'),    # C to B (right, down)
        (((B_pt[0] + A[0]) / 2, A[1]), '←'),     # B to A (bottom, left)
    ]
    arrows = [
        (A, D, 'red'), (D, C, 'red'), (C, B_pt, 'red'), (B_pt, A, 'red')
    ]
    for (p1, p2, color) in arrows:
        mx = (p1[0] + p2[0]) / 2
        my = (p1[1] + p2[1]) / 2
        dx = (p2[0] - p1[0]) * 0.15
        dy = (p2[1] - p1[1]) * 0.15
        ax.annotate('', xy=(mx + dx, my + dy), xytext=(mx - dx, my - dy),
                    arrowprops=dict(arrowstyle='->', color=color, lw=2))

    ax.text(3, 0.3, 'I (anticlockwise)', fontsize=10, ha='center', color='red', fontweight='bold')

    # B field along +x
    for y in [0, 2.5, 5]:
        ax.annotate('', xy=(7.5, y), xytext=(6, y),
                    arrowprops=dict(arrowstyle='->', color='blue', lw=2, alpha=0.5))
    ax.text(7.5, 5.3, 'B⃗', fontsize=14, fontweight='bold', color='blue')

    # Axes
    ax.annotate('', xy=(7, -1.5), xytext=(6, -1.5),
                arrowprops=dict(arrowstyle='->', color='gray', lw=1.5))
    ax.text(7.2, -1.5, 'x', fontsize=11, color='gray')
    ax.annotate('', xy=(6, -0.5), xytext=(6, -1.5),
                arrowprops=dict(arrowstyle='->', color='gray', lw=1.5))
    ax.text(6, -0.3, 'z', fontsize=11, color='gray')

    ax.set_title('Rectangular Loop in Magnetic Field', fontsize=12, fontweight='bold')
    save(fig, 'cuet-phy-mag-force-30.png')

# ─────────────────────────────────────────────────────────
# 5. cuet-phy-mag-force-32.png
#    Two parallel wires P(I₁) and Q(I₂), both current upward, distance d
# ─────────────────────────────────────────────────────────
def img5():
    fig, ax = plt.subplots(figsize=(6, 6))
    ax.set_xlim(-2, 8)
    ax.set_ylim(-2, 7)
    ax.set_aspect('equal')
    ax.axis('off')

    # Wire P
    ax.plot([1, 1], [0, 6], 'k-', lw=3)
    ax.annotate('', xy=(1, 6), xytext=(1, 5),
                arrowprops=dict(arrowstyle='->', color='red', lw=2.5))
    ax.text(0.3, 3, 'I₁', fontsize=14, fontweight='bold', color='red')
    ax.text(1, -0.7, 'P', fontsize=14, fontweight='bold', ha='center', color='darkred')

    # Wire Q
    ax.plot([5, 5], [0, 6], 'k-', lw=3)
    ax.annotate('', xy=(5, 6), xytext=(5, 5),
                arrowprops=dict(arrowstyle='->', color='blue', lw=2.5))
    ax.text(5.7, 3, 'I₂', fontsize=14, fontweight='bold', color='blue')
    ax.text(5, -0.7, 'Q', fontsize=14, fontweight='bold', ha='center', color='darkred')

    # Distance d
    ax.annotate('', xy=(1, -0.2), xytext=(5, -0.2),
                arrowprops=dict(arrowstyle='<->', color='purple', lw=1.5))
    ax.text(3, -0.6, 'd', fontsize=14, fontweight='bold', ha='center', color='purple')

    # Force arrows (attractive — toward each other)
    ax.annotate('', xy=(2, 3), xytext=(1.3, 3),
                arrowprops=dict(arrowstyle='->', color='green', lw=2.5))
    ax.annotate('', xy=(4, 3), xytext=(4.7, 3),
                arrowprops=dict(arrowstyle='->', color='green', lw=2.5))
    ax.text(3, 3.5, 'F (attract)', fontsize=10, ha='center', color='green', fontweight='bold')

    ax.set_title('Force Between Parallel Wires', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-mag-force-32.png')

if __name__ == '__main__':
    print("Batch 11: Generating 5 images...")
    img1()
    img2()
    img3()
    img4()
    img5()
    print("Batch 11 complete!")
