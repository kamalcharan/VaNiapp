"""Batch 1: cuet-phy-current-ohm-21 to 24, kirchhoff-21 (5 images)"""
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
# 1. cuet-phy-current-ohm-29.png
#    V-I graph: straight line through origin, passes (2,10), axes 0-4A, 0-20V
# ─────────────────────────────────────────────────────────
def img1():
    fig, ax = plt.subplots(figsize=(5, 4))
    I = np.linspace(0, 4, 100)
    V = 5 * I  # slope = 5 ohm
    ax.plot(I, V, 'b-', lw=2)
    ax.plot(2, 10, 'ro', ms=8, zorder=5)
    ax.annotate('(2 A, 10 V)', (2, 10), textcoords="offset points", xytext=(10, 10), fontsize=10)
    ax.set_xlabel('Current I (A)', fontsize=12)
    ax.set_ylabel('Voltage V (V)', fontsize=12)
    ax.set_xlim(0, 4)
    ax.set_ylim(0, 20)
    ax.set_title('V–I Characteristic', fontsize=13, fontweight='bold')
    ax.grid(True, alpha=0.3)
    ax.set_xticks(range(5))
    ax.set_yticks(range(0, 25, 5))
    save(fig, 'cuet-phy-current-ohm-29.png')

# ─────────────────────────────────────────────────────────
# 2. cuet-phy-current-ohm-30.png
#    24V battery + R1=4Ω, R2=6Ω, R3=12Ω in parallel, ammeter in series
# ─────────────────────────────────────────────────────────
def img2():
    fig, ax = plt.subplots(figsize=(7, 5))
    ax.set_xlim(-1, 8)
    ax.set_ylim(-1, 6)
    ax.set_aspect('equal')
    ax.axis('off')

    # Battery
    ax.plot([0, 0], [0, 5], 'k-', lw=2)
    # Battery symbol
    ax.plot([-0.3, 0.3], [2.8, 2.8], 'k-', lw=3)  # long line (+)
    ax.plot([-0.15, 0.15], [2.2, 2.2], 'k-', lw=5)  # short line (-)
    ax.text(-0.7, 2.5, '24 V', fontsize=11, fontweight='bold', ha='right')
    ax.text(0.4, 2.9, '+', fontsize=10, color='red')
    ax.text(0.4, 2.0, '−', fontsize=12, color='blue')

    # Top wire
    ax.plot([0, 7], [5, 5], 'k-', lw=2)
    # Bottom wire
    ax.plot([0, 1.5], [0, 0], 'k-', lw=2)
    ax.plot([2.5, 7], [0, 0], 'k-', lw=2)

    # Ammeter
    circle_a = plt.Circle((2, 0), 0.5, fill=False, ec='blue', lw=2)
    ax.add_patch(circle_a)
    ax.text(2, 0, 'A', fontsize=12, ha='center', va='center', fontweight='bold', color='blue')

    # Three parallel resistors
    for i, (r_val, y_top) in enumerate([(4, 4), (6, 2.5), (12, 1)]):
        x = 4 + i * 1.2
        # Vertical wires from top and bottom rails
        ax.plot([x, x], [5, y_top + 0.8], 'k-', lw=2)
        ax.plot([x, x], [0, y_top - 0.8], 'k-', lw=2)
        # Resistor box
        rect = patches.FancyBboxPatch((x - 0.3, y_top - 0.8), 0.6, 1.6,
                                       boxstyle="round,pad=0.05", ec='k', fc='#fff3e0', lw=2)
        ax.add_patch(rect)
        ax.text(x, y_top, f'R{i+1}\n{r_val} Ω', fontsize=9, ha='center', va='center', fontweight='bold')

    # Right vertical wire
    ax.plot([7, 7], [0, 5], 'k-', lw=2)

    ax.set_title('Parallel Resistor Circuit', fontsize=13, fontweight='bold', pad=10)
    save(fig, 'cuet-phy-current-ohm-30.png')

# ─────────────────────────────────────────────────────────
# 3. cuet-phy-current-ohm-31.png
#    R vs T graph: Curve P (semiconductor, decreasing), Curve Q (metal, increasing)
# ─────────────────────────────────────────────────────────
def img3():
    fig, ax = plt.subplots(figsize=(5, 4))
    T = np.linspace(100, 600, 200)

    # Semiconductor: R decreases exponentially
    R_semi = 50 * np.exp(-0.008 * (T - 100))
    ax.plot(T, R_semi, 'r-', lw=2.5, label='P (Semiconductor)')

    # Metal: R increases linearly
    R_metal = 2 + 0.05 * (T - 100)
    ax.plot(T, R_metal, 'b-', lw=2.5, label='Q (Metal)')

    ax.set_xlabel('Temperature T (K)', fontsize=12)
    ax.set_ylabel('Resistance R (Ω)', fontsize=12)
    ax.set_title('R–T Characteristics', fontsize=13, fontweight='bold')
    ax.legend(fontsize=10, loc='center right')
    ax.grid(True, alpha=0.3)
    ax.set_xlim(100, 600)
    ax.set_ylim(0, 55)
    save(fig, 'cuet-phy-current-ohm-31.png')

# ─────────────────────────────────────────────────────────
# 4. cuet-phy-current-ohm-32.png
#    Wheatstone bridge with 5 identical resistors R
# ─────────────────────────────────────────────────────────
def img4():
    fig, ax = plt.subplots(figsize=(5, 5))
    ax.set_xlim(-2, 6)
    ax.set_ylim(-2, 6)
    ax.set_aspect('equal')
    ax.axis('off')

    # Diamond nodes: A(left), B(top), C(right), D(bottom)
    # Using a square rotated 45 degrees
    A = (0, 2)
    B = (2, 4)
    C = (4, 2)
    D = (2, 0)

    # Draw connections
    for p1, p2, label, offset in [
        (A, B, 'R', (-1.2, 0.5)),
        (B, C, 'R', (0.5, 0.5)),
        (A, D, 'R', (-1.2, -0.5)),
        (D, C, 'R', (0.5, -0.5)),
        (B, D, 'R', (0.5, 0)),
    ]:
        ax.plot([p1[0], p2[0]], [p1[1], p2[1]], 'k-', lw=2)
        mx = (p1[0] + p2[0]) / 2 + offset[0]
        my = (p1[1] + p2[1]) / 2 + offset[1]
        ax.text(mx, my, label, fontsize=12, fontweight='bold',
                ha='center', va='center',
                bbox=dict(boxstyle='round,pad=0.2', fc='#e3f2fd', ec='steelblue'))

    # Node labels
    for pt, label, off in [(A, 'A', (-0.6, 0)), (B, 'B', (0, 0.5)),
                            (C, 'C', (0.6, 0)), (D, 'D', (0, -0.5))]:
        ax.plot(*pt, 'ko', ms=8)
        ax.text(pt[0] + off[0], pt[1] + off[1], label, fontsize=13, fontweight='bold',
                ha='center', va='center', color='darkred')

    ax.set_title('Wheatstone Bridge\n(5 identical resistors R)', fontsize=12, fontweight='bold')
    save(fig, 'cuet-phy-current-ohm-32.png')

# ─────────────────────────────────────────────────────────
# 5. cuet-phy-current-kirchhoff-29.png
#    Simple series: 6V battery + 2Ω + 4Ω, clockwise current
# ─────────────────────────────────────────────────────────
def img5():
    fig, ax = plt.subplots(figsize=(6, 4))
    ax.set_xlim(-1, 7)
    ax.set_ylim(-1, 5)
    ax.set_aspect('equal')
    ax.axis('off')

    # Rectangle circuit
    # Bottom wire
    ax.plot([0, 6], [0, 0], 'k-', lw=2)
    # Right wire
    ax.plot([6, 6], [0, 4], 'k-', lw=2)
    # Top wire
    ax.plot([0, 6], [4, 4], 'k-', lw=2)
    # Left wire
    ax.plot([0, 0], [0, 4], 'k-', lw=2)

    # Battery on left side
    ax.plot([-0.3, 0.3], [2.3, 2.3], 'k-', lw=3)  # + plate
    ax.plot([-0.15, 0.15], [1.7, 1.7], 'k-', lw=5)  # - plate
    ax.text(-0.8, 2, '6 V', fontsize=12, fontweight='bold', ha='right')
    ax.text(0.4, 2.4, '+', fontsize=10, color='red')
    ax.text(0.4, 1.5, '−', fontsize=10, color='blue')

    # 2 Ω resistor on top
    rect1 = patches.FancyBboxPatch((2.2, 3.5), 1.6, 1, boxstyle="round,pad=0.1",
                                    ec='k', fc='#fff3e0', lw=2)
    ax.add_patch(rect1)
    ax.text(3, 4, '2 Ω', fontsize=11, ha='center', va='center', fontweight='bold')

    # 4 Ω resistor on bottom
    rect2 = patches.FancyBboxPatch((2.2, -0.5), 1.6, 1, boxstyle="round,pad=0.1",
                                    ec='k', fc='#fff3e0', lw=2)
    ax.add_patch(rect2)
    ax.text(3, 0, '4 Ω', fontsize=11, ha='center', va='center', fontweight='bold')

    # Current arrow (clockwise) on right side
    ax.annotate('', xy=(6, 1), xytext=(6, 3),
                arrowprops=dict(arrowstyle='->', color='red', lw=2))
    ax.text(6.5, 2, 'I', fontsize=13, fontweight='bold', color='red')

    ax.set_title('Series Circuit', fontsize=13, fontweight='bold', pad=10)
    save(fig, 'cuet-phy-current-kirchhoff-29.png')

if __name__ == '__main__':
    print("Batch 1: Generating 5 images...")
    img1()
    img2()
    img3()
    img4()
    img5()
    print("Batch 1 complete!")
