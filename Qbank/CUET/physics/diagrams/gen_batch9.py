"""Batch 9: capacitor-21 to 24, mag-biot-21 (5 images)"""
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
# 1. cuet-phy-elec-capacitor-21.png
#    Two parallel plates, battery, uniform E field arrows
# ─────────────────────────────────────────────────────────
def img1():
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.set_xlim(-3, 7)
    ax.set_ylim(-2, 5)
    ax.set_aspect('equal')
    ax.axis('off')

    # Left plate (+)
    ax.plot([0, 0], [0, 4], 'r-', lw=5)
    ax.text(-0.5, 2, '+', fontsize=16, ha='center', va='center', color='red', fontweight='bold')

    # Right plate (−)
    ax.plot([4, 4], [0, 4], 'b-', lw=5)
    ax.text(4.5, 2, '−', fontsize=16, ha='center', va='center', color='blue', fontweight='bold')

    # E field arrows between plates
    for y in np.linspace(0.5, 3.5, 5):
        ax.annotate('', xy=(3.5, y), xytext=(0.5, y),
                    arrowprops=dict(arrowstyle='->', color='darkorange', lw=2))

    ax.text(2, -0.5, 'E⃗', fontsize=14, fontweight='bold', color='darkorange', ha='center')

    # Battery wires
    ax.plot([0, 0], [0, -1], 'k-', lw=2)
    ax.plot([0, 1.5], [-1, -1], 'k-', lw=2)
    ax.plot([4, 4], [0, -1], 'k-', lw=2)
    ax.plot([4, 2.5], [-1, -1], 'k-', lw=2)
    # Battery
    ax.plot([1.7, 2.3], [-0.8, -0.8], 'k-', lw=3)
    ax.plot([1.85, 2.15], [-1.2, -1.2], 'k-', lw=5)
    ax.text(2, -1.7, 'Battery', fontsize=10, ha='center', color='gray')

    ax.set_title('Parallel Plate Capacitor', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-capacitor-21.png')

# ─────────────────────────────────────────────────────────
# 2. cuet-phy-elec-capacitor-22.png
#    Three capacitors C₁=2μF, C₂=3μF, C₃=6μF in parallel, 12V
# ─────────────────────────────────────────────────────────
def img2():
    fig, ax = plt.subplots(figsize=(7, 5))
    ax.set_xlim(-1, 9)
    ax.set_ylim(-2, 6)
    ax.set_aspect('equal')
    ax.axis('off')

    # Top and bottom rails
    ax.plot([0, 8], [5, 5], 'k-', lw=2)
    ax.plot([0, 8], [0, 0], 'k-', lw=2)

    # Three capacitors in parallel
    caps = [(2, '2 μF', 'C₁'), (4, '3 μF', 'C₂'), (6, '6 μF', 'C₃')]
    for x, val, label in caps:
        ax.plot([x, x], [5, 3.5], 'k-', lw=2)
        ax.plot([x, x], [1.5, 0], 'k-', lw=2)
        # Capacitor symbol (two parallel lines)
        ax.plot([x - 0.5, x + 0.5], [3.5, 3.5], 'k-', lw=3)
        ax.plot([x - 0.5, x + 0.5], [1.5, 1.5], 'k-', lw=3)
        ax.text(x + 0.7, 2.5, f'{label}\n{val}', fontsize=10, fontweight='bold', ha='left')

    # Battery
    ax.plot([0, 0], [0, 5], 'k-', lw=2)
    ax.plot([-0.3, 0.3], [2.8, 2.8], 'k-', lw=3)
    ax.plot([-0.15, 0.15], [2.2, 2.2], 'k-', lw=5)
    ax.text(-0.8, 2.5, '12 V', fontsize=11, fontweight='bold', ha='right')

    # Right wire
    ax.plot([8, 8], [0, 5], 'k-', lw=2)

    ax.set_title('Capacitors in Parallel', fontsize=13, fontweight='bold', pad=10)
    save(fig, 'cuet-phy-elec-capacitor-22.png')

# ─────────────────────────────────────────────────────────
# 3. cuet-phy-elec-capacitor-23.png
#    C₁=4μF and C₂=6μF in series, 20V battery
# ─────────────────────────────────────────────────────────
def img3():
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.set_xlim(-1, 10)
    ax.set_ylim(-1, 4)
    ax.set_aspect('equal')
    ax.axis('off')

    # Horizontal circuit
    ax.plot([0, 2], [2, 2], 'k-', lw=2)
    # C₁
    ax.plot([2, 2], [1.2, 2.8], 'k-', lw=3)
    ax.plot([2.6, 2.6], [1.2, 2.8], 'k-', lw=3)
    ax.text(2.3, 3.2, 'C₁ = 4 μF', fontsize=11, ha='center', fontweight='bold')

    ax.plot([2.6, 5.4], [2, 2], 'k-', lw=2)

    # C₂
    ax.plot([5.4, 5.4], [1.2, 2.8], 'k-', lw=3)
    ax.plot([6, 6], [1.2, 2.8], 'k-', lw=3)
    ax.text(5.7, 3.2, 'C₂ = 6 μF', fontsize=11, ha='center', fontweight='bold')

    ax.plot([6, 8], [2, 2], 'k-', lw=2)

    # Battery
    ax.plot([0, 0], [2, 0], 'k-', lw=2)
    ax.plot([0, 8], [0, 0], 'k-', lw=2)
    ax.plot([8, 8], [0, 2], 'k-', lw=2)
    ax.plot([3.7, 4.3], [0.2, 0.2], 'k-', lw=3)
    ax.plot([3.85, 4.15], [-0.2, -0.2], 'k-', lw=5)
    ax.text(4, -0.7, '20 V', fontsize=11, ha='center', fontweight='bold', color='blue')

    ax.set_title('Capacitors in Series', fontsize=13, fontweight='bold', pad=10)
    save(fig, 'cuet-phy-elec-capacitor-23.png')

# ─────────────────────────────────────────────────────────
# 4. cuet-phy-elec-capacitor-24.png
#    Parallel plates with dielectric slab (K, thickness t) between them
# ─────────────────────────────────────────────────────────
def img4():
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.set_xlim(-2, 7)
    ax.set_ylim(-1, 5)
    ax.set_aspect('equal')
    ax.axis('off')

    # Left plate
    ax.plot([0, 0], [0, 4], 'k-', lw=5)
    ax.text(-0.5, 2, '+', fontsize=14, color='red', ha='center', fontweight='bold')

    # Right plate
    ax.plot([5, 5], [0, 4], 'k-', lw=5)
    ax.text(5.5, 2, '−', fontsize=14, color='blue', ha='center', fontweight='bold')

    # Dielectric slab
    rect = patches.FancyBboxPatch((1.5, 0.2), 2, 3.6, boxstyle="round,pad=0.05",
                                   ec='green', fc='#c8e6c9', lw=2, alpha=0.8)
    ax.add_patch(rect)
    ax.text(2.5, 2, 'K', fontsize=16, ha='center', va='center', fontweight='bold', color='darkgreen')

    # Dimension markers
    # d (full gap)
    ax.annotate('', xy=(0, -0.5), xytext=(5, -0.5),
                arrowprops=dict(arrowstyle='<->', color='gray', lw=1.5))
    ax.text(2.5, -0.8, 'd', fontsize=12, ha='center', fontweight='bold', color='gray')

    # t (slab thickness)
    ax.annotate('', xy=(1.5, 4.5), xytext=(3.5, 4.5),
                arrowprops=dict(arrowstyle='<->', color='green', lw=1.5))
    ax.text(2.5, 4.7, 't', fontsize=12, ha='center', fontweight='bold', color='green')

    # Air gaps
    ax.text(0.75, 2, 'air', fontsize=9, ha='center', color='gray', fontstyle='italic')
    ax.text(4.25, 2, 'air', fontsize=9, ha='center', color='gray', fontstyle='italic')

    ax.set_title('Capacitor with Dielectric Slab', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-capacitor-24.png')

# ─────────────────────────────────────────────────────────
# 5. cuet-phy-mag-biot-29.png
#    Vertical wire carrying I upward, point P at distance d to the right
# ─────────────────────────────────────────────────────────
def img5():
    fig, ax = plt.subplots(figsize=(5, 5))
    ax.set_xlim(-3, 5)
    ax.set_ylim(-3, 4)
    ax.set_aspect('equal')
    ax.axis('off')

    # Wire (vertical)
    ax.plot([0, 0], [-2.5, 3.5], 'k-', lw=3)
    ax.annotate('', xy=(0, 3.5), xytext=(0, 3),
                arrowprops=dict(arrowstyle='->', color='red', lw=2.5))
    ax.text(-0.8, 3, 'I', fontsize=14, fontweight='bold', color='red')

    # Point P
    d = 3
    ax.plot(d, 0, 'ko', ms=10, zorder=5)
    ax.text(d + 0.4, 0.3, 'P', fontsize=14, fontweight='bold', color='darkblue')

    # Distance d
    ax.annotate('', xy=(d, -0.3), xytext=(0, -0.3),
                arrowprops=dict(arrowstyle='<->', color='purple', lw=1.5))
    ax.text(d / 2, -0.7, 'd', fontsize=13, fontweight='bold', ha='center', color='purple')

    # B field direction (into page at P, shown by cross)
    ax.text(d, -1.2, '⊗ B', fontsize=13, fontweight='bold', ha='center', color='blue')

    ax.set_title('Magnetic Field Near a Wire', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-mag-biot-29.png')

if __name__ == '__main__':
    print("Batch 9: Generating 5 images...")
    img1()
    img2()
    img3()
    img4()
    img5()
    print("Batch 9 complete!")
