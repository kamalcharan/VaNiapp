"""Batch 5: coulomb-21 to 24, field-23 (5 images)"""
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
# 1. cuet-phy-elec-coulomb-41.png
#    Four charge pair arrangements: (A) +−, (B) ++, (C) −+, (D) −− different magnitudes
# ─────────────────────────────────────────────────────────
def img1():
    fig, axes = plt.subplots(2, 2, figsize=(8, 6))
    pairs = [
        ('A', '+q', '−q', 'red', 'blue'),
        ('B', '+q', '+q', 'red', 'red'),
        ('C', '−q', '+q', 'blue', 'red'),
        ('D', '−2q', '−q', 'blue', 'blue'),
    ]
    for ax, (label, q1, q2, c1, c2) in zip(axes.flat, pairs):
        ax.set_xlim(-3, 3)
        ax.set_ylim(-1.5, 1.5)
        ax.set_aspect('equal')
        ax.axis('off')

        # Left charge
        circle1 = plt.Circle((-1.2, 0), 0.6, fc=c1, ec='k', lw=2, alpha=0.7)
        ax.add_patch(circle1)
        ax.text(-1.2, 0, q1, fontsize=12, ha='center', va='center', fontweight='bold', color='white')

        # Right charge
        circle2 = plt.Circle((1.2, 0), 0.6, fc=c2, ec='k', lw=2, alpha=0.7)
        ax.add_patch(circle2)
        ax.text(1.2, 0, q2, fontsize=12, ha='center', va='center', fontweight='bold', color='white')

        # Separation line
        ax.plot([-0.5, 0.5], [0, 0], 'k--', lw=1, alpha=0.5)

        ax.set_title(f'({label})', fontsize=13, fontweight='bold')

    fig.suptitle('Charge Pair Arrangements', fontsize=14, fontweight='bold')
    plt.tight_layout()
    save(fig, 'cuet-phy-elec-coulomb-41.png')

# ─────────────────────────────────────────────────────────
# 2. cuet-phy-elec-coulomb-42.png
#    Graph: P (linear decrease), Q (steep 1/r²), R (gradual 1/r), S (horizontal)
# ─────────────────────────────────────────────────────────
def img2():
    fig, ax = plt.subplots(figsize=(6, 5))
    r = np.linspace(0.5, 5, 200)

    # P: linear decrease
    ax.plot(r, 5 - 0.8 * r, 'r-', lw=2.5, label='P (linear decrease)')
    # Q: steep 1/r²
    ax.plot(r, 3 / r**2, 'b-', lw=2.5, label='Q (∝ 1/r²)')
    # R: gradual 1/r
    ax.plot(r, 2 / r, 'g-', lw=2.5, label='R (∝ 1/r)')
    # S: horizontal
    ax.plot(r, np.ones_like(r) * 1.5, 'm-', lw=2.5, label='S (constant)')

    ax.set_xlabel('Distance r', fontsize=12)
    ax.set_ylabel('F or E', fontsize=12)
    ax.set_xlim(0.5, 5)
    ax.set_ylim(0, 6)
    ax.legend(fontsize=10, loc='upper right')
    ax.grid(True, alpha=0.3)
    ax.set_title('Force/Field vs Distance Curves', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-coulomb-42.png')

# ─────────────────────────────────────────────────────────
# 3. cuet-phy-elec-coulomb-43.png
#    Square ABCD: +q at A (top-left), +q at B (top-right),
#    −q at C (bottom-right), −q at D (bottom-left)
# ─────────────────────────────────────────────────────────
def img3():
    fig, ax = plt.subplots(figsize=(5, 5))
    ax.set_xlim(-2, 6)
    ax.set_ylim(-2, 6)
    ax.set_aspect('equal')
    ax.axis('off')

    corners = {
        'A': (0, 4, '+q', 'red'),
        'B': (4, 4, '+q', 'red'),
        'C': (4, 0, '−q', 'blue'),
        'D': (0, 0, '−q', 'blue'),
    }

    # Draw square
    sq = plt.Polygon([(0, 0), (4, 0), (4, 4), (0, 4)], fill=False, ec='gray', lw=1.5, ls='--')
    ax.add_patch(sq)

    for label, (x, y, charge, color) in corners.items():
        circle = plt.Circle((x, y), 0.45, fc=color, ec='k', lw=2, alpha=0.7)
        ax.add_patch(circle)
        ax.text(x, y, charge, fontsize=11, ha='center', va='center', fontweight='bold', color='white')
        # Label outside
        ox = -0.7 if x == 0 else 0.7
        oy = 0.7 if y == 4 else -0.7
        ax.text(x + ox, y + oy, label, fontsize=13, fontweight='bold', color='darkred', ha='center')

    # Side label
    ax.annotate('', xy=(4.5, 0), xytext=(4.5, 4),
                arrowprops=dict(arrowstyle='<->', color='gray', lw=1.5))
    ax.text(5, 2, 'a', fontsize=13, fontweight='bold', ha='center', color='gray')

    ax.set_title('Square with Charges', fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-coulomb-43.png')

# ─────────────────────────────────────────────────────────
# 4. cuet-phy-elec-coulomb-44.png
#    Log-log plot: log F vs log r, slope = −2.05 ± 0.03
# ─────────────────────────────────────────────────────────
def img4():
    fig, ax = plt.subplots(figsize=(5, 4))
    np.random.seed(42)

    log_r = np.linspace(-1, 1, 20)
    log_F = -2.05 * log_r + 1.5 + np.random.normal(0, 0.06, 20)

    ax.errorbar(log_r, log_F, yerr=0.08, fmt='ro', ms=5, capsize=3, label='Experimental data')

    # Best fit line
    r_fit = np.linspace(-1.2, 1.2, 100)
    F_fit = -2.05 * r_fit + 1.5
    ax.plot(r_fit, F_fit, 'b-', lw=2, label='Best fit: slope = −2.05 ± 0.03')

    ax.set_xlabel('log r', fontsize=12)
    ax.set_ylabel('log F', fontsize=12)
    ax.legend(fontsize=9, loc='upper right')
    ax.grid(True, alpha=0.3)
    ax.set_title("Coulomb's Law Verification", fontsize=13, fontweight='bold')
    save(fig, 'cuet-phy-elec-coulomb-44.png')

# ─────────────────────────────────────────────────────────
# 5. cuet-phy-elec-field-23.png
#    Four field line patterns: (A) converging inward, (B) radial outward,
#    (C) closed loops, (D) parallel straight lines
# ─────────────────────────────────────────────────────────
def img5():
    fig, axes = plt.subplots(2, 2, figsize=(8, 8))

    titles = ['(A) Converging Inward', '(B) Radial Outward',
              '(C) Closed Loops', '(D) Parallel Lines']

    for ax, title in zip(axes.flat, titles):
        ax.set_xlim(-2, 2)
        ax.set_ylim(-2, 2)
        ax.set_aspect('equal')
        ax.axis('off')
        ax.set_title(title, fontsize=11, fontweight='bold')

    # A: converging inward (negative charge)
    ax = axes[0, 0]
    for angle in np.linspace(0, 2 * np.pi, 12, endpoint=False):
        x_start = 1.8 * np.cos(angle)
        y_start = 1.8 * np.sin(angle)
        ax.annotate('', xy=(0.3 * np.cos(angle), 0.3 * np.sin(angle)),
                    xytext=(x_start, y_start),
                    arrowprops=dict(arrowstyle='->', color='blue', lw=1.5))
    ax.plot(0, 0, 'bo', ms=10)
    ax.text(0, 0, '−', fontsize=14, ha='center', va='center', color='white', fontweight='bold')

    # B: radial outward (positive charge)
    ax = axes[0, 1]
    for angle in np.linspace(0, 2 * np.pi, 12, endpoint=False):
        x_end = 1.8 * np.cos(angle)
        y_end = 1.8 * np.sin(angle)
        ax.annotate('', xy=(x_end, y_end),
                    xytext=(0.3 * np.cos(angle), 0.3 * np.sin(angle)),
                    arrowprops=dict(arrowstyle='->', color='red', lw=1.5))
    ax.plot(0, 0, 'ro', ms=10)
    ax.text(0, 0, '+', fontsize=14, ha='center', va='center', color='white', fontweight='bold')

    # C: closed circular loops (magnetic-like, not valid for E)
    ax = axes[1, 0]
    for r in [0.5, 1.0, 1.5]:
        theta = np.linspace(0, 2 * np.pi, 100)
        ax.plot(r * np.cos(theta), r * np.sin(theta), 'purple', lw=1.5)
        # Arrow at top
        ax.annotate('', xy=(r * 0.05, r), xytext=(-r * 0.05, r),
                    arrowprops=dict(arrowstyle='->', color='purple', lw=1.5))
    ax.plot(0, 0, 'ko', ms=6)

    # D: parallel straight lines
    ax = axes[1, 1]
    for y in np.linspace(-1.5, 1.5, 7):
        ax.annotate('', xy=(1.5, y), xytext=(-1.5, y),
                    arrowprops=dict(arrowstyle='->', color='green', lw=1.5))

    plt.tight_layout()
    save(fig, 'cuet-phy-elec-field-23.png')

if __name__ == '__main__':
    print("Batch 5: Generating 5 images...")
    img1()
    img2()
    img3()
    img4()
    img5()
    print("Batch 5 complete!")
