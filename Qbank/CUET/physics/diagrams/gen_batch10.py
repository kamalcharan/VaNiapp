"""Batch 10: biot-22 to 24, ampere-21 to 22 (5 images)"""
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
# 1. cuet-phy-mag-biot-30.png
#    Wire: left → semicircular arc (radius R, upper half) → right. Centre O.
# ─────────────────────────────────────────────────────────
def img1():
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.set_xlim(-4, 4)
    ax.set_ylim(-1.5, 3)
    ax.set_aspect('equal')
    ax.axis('off')

    R = 2
    # Left straight wire
    ax.annotate('', xy=(-R, 0), xytext=(-3.5, 0),
                arrowprops=dict(arrowstyle='->', color='k', lw=2))

    # Semicircular arc (upper half)
    theta = np.linspace(np.pi, 0, 100)
    ax.plot(R * np.cos(theta), R * np.sin(theta), 'k-', lw=2.5)

    # Right straight wire
    ax.annotate('', xy=(3.5, 0), xytext=(R, 0),
                arrowprops=dict(arrowstyle='->', color='k', lw=2))

    # Current label
    ax.text(-3.5, 0.4, 'I', fontsize=14, fontweight='bold', color='red')
    ax.text(3.5, 0.4, 'I', fontsize=14, fontweight='bold', color='red')

    # Centre O
    ax.plot(0, 0, 'ko', ms=8, zorder=5)
    ax.text(0.3, -0.5, 'O', fontsize=14, fontweight='bold', color='darkblue')

    # Radius R
    ax.plot([0, 0], [0, R], 'g--', lw=1.5)
    ax.text(0.3, R / 2, 'R', fontsize=12, fontweight='bold', color='green')

    ax.set_title('Current Through Semicircular Arc', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-mag-biot-30.png')

# ─────────────────────────────────────────────────────────
# 2. cuet-phy-mag-biot-31.png
#    Two concentric coplanar loops: inner R (I clockwise),
#    outer 2R (2I anticlockwise), centre O
# ─────────────────────────────────────────────────────────
def img2():
    fig, ax = plt.subplots(figsize=(5, 5))
    ax.set_xlim(-4, 4)
    ax.set_ylim(-4, 4)
    ax.set_aspect('equal')
    ax.axis('off')

    theta = np.linspace(0, 2 * np.pi, 100)

    # Inner loop R
    R = 1.5
    ax.plot(R * np.cos(theta), R * np.sin(theta), 'r-', lw=2.5)
    ax.text(R + 0.3, 0, 'R', fontsize=12, fontweight='bold', color='red')
    # Clockwise arrow
    ax.annotate('', xy=(0, -R + 0.05), xytext=(0.3, -R),
                arrowprops=dict(arrowstyle='->', color='red', lw=2))
    ax.text(0.6, -R - 0.4, 'I (CW)', fontsize=9, color='red', fontweight='bold')

    # Outer loop 2R
    R2 = 3
    ax.plot(R2 * np.cos(theta), R2 * np.sin(theta), 'b-', lw=2.5)
    ax.text(R2 + 0.3, 0, '2R', fontsize=12, fontweight='bold', color='blue')
    # Anticlockwise arrow
    ax.annotate('', xy=(0.3, R2), xytext=(0, R2 - 0.05),
                arrowprops=dict(arrowstyle='->', color='blue', lw=2))
    ax.text(0.6, R2 + 0.3, '2I (ACW)', fontsize=9, color='blue', fontweight='bold')

    # Centre O
    ax.plot(0, 0, 'ko', ms=8, zorder=5)
    ax.text(0.3, 0.3, 'O', fontsize=14, fontweight='bold', color='darkgreen')

    ax.set_title('Two Concentric Coplanar Loops', fontsize=12, fontweight='bold')
    save(fig, 'cuet-phy-mag-biot-31.png')

# ─────────────────────────────────────────────────────────
# 3. cuet-phy-mag-biot-32.png
#    Wire: inner semicircular arc R₁ (upper), outer semicircular arc R₂ (lower),
#    connected by radial segments, centre O
# ─────────────────────────────────────────────────────────
def img3():
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.set_xlim(-4, 4)
    ax.set_ylim(-3, 3)
    ax.set_aspect('equal')
    ax.axis('off')

    R1, R2 = 1.2, 2.5

    # Inner semicircle (upper half)
    theta_upper = np.linspace(np.pi, 0, 100)
    ax.plot(R1 * np.cos(theta_upper), R1 * np.sin(theta_upper), 'r-', lw=2.5)

    # Outer semicircle (lower half)
    theta_lower = np.linspace(0, -np.pi, 100)
    ax.plot(R2 * np.cos(theta_lower), R2 * np.sin(theta_lower), 'b-', lw=2.5)

    # Radial segments
    ax.plot([-R1, -R2], [0, 0], 'k-', lw=2)
    ax.plot([R1, R2], [0, 0], 'k-', lw=2)

    # Current direction
    ax.annotate('', xy=(-0.5, R1 - 0.1), xytext=(0.5, R1 - 0.1),
                arrowprops=dict(arrowstyle='->', color='red', lw=2))
    ax.text(0, R1 + 0.4, 'I', fontsize=12, fontweight='bold', color='red')

    # Labels
    ax.text(0.3, R1 / 2, 'R₁', fontsize=12, fontweight='bold', color='red')
    ax.text(0.3, -R2 / 2, 'R₂', fontsize=12, fontweight='bold', color='blue')

    # Centre O
    ax.plot(0, 0, 'ko', ms=8, zorder=5)
    ax.text(0.4, 0.3, 'O', fontsize=14, fontweight='bold', color='darkgreen')

    ax.set_title('Two Semicircular Arcs', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-mag-biot-32.png')

# ─────────────────────────────────────────────────────────
# 4. cuet-phy-mag-ampere-21 (four-amperian-loops-around-wire.png)
#    Wire perpendicular (⊙), 4 loops: P(circle), Q(square), R(ellipse), S(irregular)
# ─────────────────────────────────────────────────────────
def img4():
    fig, ax = plt.subplots(figsize=(6, 6))
    ax.set_xlim(-5, 5)
    ax.set_ylim(-5, 5)
    ax.set_aspect('equal')
    ax.axis('off')

    # Wire (out of page)
    ax.plot(0, 0, 'ko', ms=14, zorder=5)
    ax.plot(0, 0, 'o', ms=8, color='yellow', zorder=6)  # dot
    ax.text(0.5, 0.5, 'I (out)', fontsize=10, fontweight='bold')

    theta = np.linspace(0, 2 * np.pi, 200)

    # P: circle
    ax.plot(1.5 * np.cos(theta), 1.5 * np.sin(theta), 'r-', lw=2)
    ax.text(1.5, 1.7, 'P', fontsize=13, fontweight='bold', color='red')

    # Q: square
    sq = plt.Polygon([(-2.5, -2.5), (2.5, -2.5), (2.5, 2.5), (-2.5, 2.5)],
                     fill=False, ec='blue', lw=2)
    ax.add_patch(sq)
    ax.text(2.7, 2.7, 'Q', fontsize=13, fontweight='bold', color='blue')

    # R: ellipse
    ax.plot(3.5 * np.cos(theta), 2 * np.sin(theta), 'g-', lw=2)
    ax.text(3.5, 2.2, 'R', fontsize=13, fontweight='bold', color='green')

    # S: irregular (wobbly circle)
    r_s = 4 + 0.5 * np.sin(5 * theta) + 0.3 * np.cos(3 * theta)
    ax.plot(r_s * np.cos(theta), r_s * np.sin(theta), 'm-', lw=2)
    ax.text(4, 3.5, 'S', fontsize=13, fontweight='bold', color='purple')

    ax.set_title("Ampere's Law: Different Loop Shapes", fontsize=12, fontweight='bold')
    save(fig, 'four-amperian-loops-around-wire.png')

# ─────────────────────────────────────────────────────────
# 5. cuet-phy-mag-ampere-22 (three-parallel-wires-amperian-loop.png)
#    Wire 1 (3A in), Wire 2 (5A out), Wire 3 (2A in), loop encloses 1 & 2
# ─────────────────────────────────────────────────────────
def img5():
    fig, ax = plt.subplots(figsize=(7, 5))
    ax.set_xlim(-3, 9)
    ax.set_ylim(-3, 4)
    ax.set_aspect('equal')
    ax.axis('off')

    wires = [
        (1, 0, '3 A', '×', 'into page', 'red'),
        (4, 0, '5 A', '⊙', 'out of page', 'blue'),
        (7, 0, '2 A', '×', 'into page', 'red'),
    ]

    for x, y, current, sym, direction, color in wires:
        circle = plt.Circle((x, y), 0.4, fc='lightyellow', ec=color, lw=2.5)
        ax.add_patch(circle)
        ax.text(x, y, sym, fontsize=16, ha='center', va='center', fontweight='bold', color=color)
        ax.text(x, -1, f'{current}\n({direction})', fontsize=9, ha='center',
                fontweight='bold', color=color)

    # Amperian loop enclosing wires 1 and 2 only
    loop = patches.FancyBboxPatch((-0.5, -1.5), 6, 3.5, boxstyle="round,pad=0.5",
                                   ec='green', fc='none', lw=2.5, ls='--')
    ax.add_patch(loop)
    ax.text(2.5, 2.5, 'Amperian loop', fontsize=11, ha='center', fontweight='bold', color='green')

    # Wire 3 is outside
    ax.text(7, 1.5, '(outside loop)', fontsize=9, ha='center', color='gray', fontstyle='italic')

    ax.set_title("Ampere's Law: Three Parallel Wires", fontsize=12, fontweight='bold')
    save(fig, 'three-parallel-wires-amperian-loop.png')

if __name__ == '__main__':
    print("Batch 10: Generating 5 images...")
    img1()
    img2()
    img3()
    img4()
    img5()
    print("Batch 10 complete!")
