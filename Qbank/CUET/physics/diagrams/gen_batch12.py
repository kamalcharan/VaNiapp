"""Batch 12: force-24, devices-21 to 24 (5 images)"""
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
# 1. cuet-phy-mag-force-31.png
#    +q moving right, E⃗ upward, B⃗ into page, both fields present
# ─────────────────────────────────────────────────────────
def img1():
    fig, ax = plt.subplots(figsize=(7, 5))
    ax.set_xlim(-2, 8)
    ax.set_ylim(-2, 5)
    ax.set_aspect('equal')
    ax.axis('off')

    # B into page (crosses)
    for x in range(0, 7):
        for y in range(0, 4):
            ax.text(x, y, '×', fontsize=9, ha='center', va='center', color='blue', alpha=0.4)

    # E field arrows (upward)
    for x in [1, 3, 5]:
        ax.annotate('', xy=(x, 4.5), xytext=(x, 3.5),
                    arrowprops=dict(arrowstyle='->', color='orange', lw=2, alpha=0.7))
    ax.text(6, 4.2, 'E⃗ ↑', fontsize=12, fontweight='bold', color='orange')

    ax.text(7, 0.5, 'B⃗ ⊗', fontsize=12, fontweight='bold', color='blue')

    # Charge +q moving right
    circle = plt.Circle((3, 2), 0.35, fc='red', ec='k', lw=2, zorder=5)
    ax.add_patch(circle)
    ax.text(3, 2, '+q', fontsize=10, ha='center', va='center', fontweight='bold', color='white', zorder=6)

    # Velocity arrow
    ax.annotate('', xy=(5, 2), xytext=(3.5, 2),
                arrowprops=dict(arrowstyle='->', color='green', lw=3))
    ax.text(4.5, 2.5, 'v⃗', fontsize=14, fontweight='bold', color='green')

    ax.set_title('Charge in Combined E and B Fields', fontsize=12, fontweight='bold')
    save(fig, 'cuet-phy-mag-force-31.png')

# ─────────────────────────────────────────────────────────
# 2. cuet-phy-mag-devices-24-galvanometer-core.svg → .png
#    Moving coil galvanometer cross-section
# ─────────────────────────────────────────────────────────
def img2():
    fig, ax = plt.subplots(figsize=(6, 6))
    ax.set_xlim(-4, 4)
    ax.set_ylim(-4, 4)
    ax.set_aspect('equal')
    ax.axis('off')

    # Pole pieces (concave arcs on left and right)
    theta_l = np.linspace(np.pi / 2 + 0.3, 3 * np.pi / 2 - 0.3, 50)
    ax.plot(3 * np.cos(theta_l) + 0.5, 3 * np.sin(theta_l), 'gray', lw=4)
    ax.fill_between(3 * np.cos(theta_l) + 0.5, 3 * np.sin(theta_l),
                    color='lightgray', alpha=0.3)
    ax.text(-3, 0, 'N', fontsize=16, fontweight='bold', color='red', ha='center')

    theta_r = np.linspace(-np.pi / 2 + 0.3, np.pi / 2 - 0.3, 50)
    ax.plot(3 * np.cos(theta_r) - 0.5, 3 * np.sin(theta_r), 'gray', lw=4)
    ax.fill_between(3 * np.cos(theta_r) - 0.5, 3 * np.sin(theta_r),
                    color='lightgray', alpha=0.3)
    ax.text(3, 0, 'S', fontsize=16, fontweight='bold', color='blue', ha='center')

    # Cylindrical soft iron core
    core = plt.Circle((0, 0), 0.8, fc='#b0bec5', ec='k', lw=2)
    ax.add_patch(core)
    ax.text(0, 0, 'Soft\nIron\nCore', fontsize=7, ha='center', va='center', fontweight='bold')

    # Rectangular coil around core
    coil = patches.FancyBboxPatch((-1.5, -2), 3, 4, boxstyle="round,pad=0.1",
                                   ec='orange', fc='none', lw=2.5)
    ax.add_patch(coil)
    ax.text(0, -2.5, 'Coil', fontsize=10, ha='center', color='orange', fontweight='bold')

    # B field lines (radial from N to S through core)
    for y in [-1, 0, 1]:
        ax.annotate('', xy=(0.5, y), xytext=(-2, y),
                    arrowprops=dict(arrowstyle='->', color='purple', lw=1.5, alpha=0.5))

    ax.text(0, 3.5, 'Radial B field', fontsize=10, ha='center', color='purple', fontstyle='italic')

    ax.set_title('Moving Coil Galvanometer\n(Cross-Section)', fontsize=12, fontweight='bold')
    save(fig, 'cuet-phy-mag-devices-24-galvanometer-core.png')

# ─────────────────────────────────────────────────────────
# 3. cuet-phy-mag-devices-33-ammeter-shunt.svg → .png
#    Galvanometer G (20Ω, 10mA) parallel with shunt S, total 100mA
# ─────────────────────────────────────────────────────────
def img3():
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.set_xlim(-1, 9)
    ax.set_ylim(-1, 5)
    ax.set_aspect('equal')
    ax.axis('off')

    # Input
    ax.plot([0, 2], [3, 3], 'k-', lw=2)
    ax.annotate('', xy=(1, 3), xytext=(0, 3),
                arrowprops=dict(arrowstyle='->', color='red', lw=2))
    ax.text(1, 3.5, '100 mA', fontsize=10, fontweight='bold', color='red')

    # Split point
    ax.plot(2, 3, 'ko', ms=6)

    # Top branch: Galvanometer G (20Ω)
    ax.plot([2, 2], [3, 4], 'k-', lw=2)
    ax.plot([2, 6], [4, 4], 'k-', lw=2)
    circle_g = plt.Circle((4, 4), 0.5, fill=True, fc='#e8f5e9', ec='green', lw=2)
    ax.add_patch(circle_g)
    ax.text(4, 4, 'G', fontsize=12, ha='center', va='center', fontweight='bold', color='green')
    ax.text(4, 4.8, '20 Ω', fontsize=9, ha='center', fontweight='bold')
    ax.text(2.5, 4.3, '10 mA', fontsize=9, fontweight='bold', color='green')
    ax.plot([6, 6], [4, 3], 'k-', lw=2)

    # Bottom branch: Shunt S
    ax.plot([2, 2], [3, 2], 'k-', lw=2)
    ax.plot([2, 6], [2, 2], 'k-', lw=2)
    rect = patches.FancyBboxPatch((3.2, 1.4), 1.6, 1.2, boxstyle="round,pad=0.1",
                                   ec='k', fc='#fff3e0', lw=2)
    ax.add_patch(rect)
    ax.text(4, 2, 'S', fontsize=12, ha='center', va='center', fontweight='bold')
    ax.text(2.5, 1.3, '90 mA', fontsize=9, fontweight='bold', color='orange')
    ax.plot([6, 6], [2, 3], 'k-', lw=2)

    # Join point
    ax.plot(6, 3, 'ko', ms=6)

    # Output
    ax.plot([6, 8], [3, 3], 'k-', lw=2)

    ax.set_title('Ammeter (Galvanometer + Shunt)', fontsize=12, fontweight='bold')
    save(fig, 'cuet-phy-mag-devices-33-ammeter-shunt.png')

# ─────────────────────────────────────────────────────────
# 4. cuet-phy-mag-devices-27-voltmeter-circuit.svg → .png
#    Galvanometer G (100Ω) in series with high R, 10V
# ─────────────────────────────────────────────────────────
def img4():
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.set_xlim(-1, 10)
    ax.set_ylim(-1, 4)
    ax.set_aspect('equal')
    ax.axis('off')

    # Series circuit
    ax.plot([0, 2], [2, 2], 'k-', lw=2)

    # Galvanometer
    circle_g = plt.Circle((3, 2), 0.5, fill=True, fc='#e8f5e9', ec='green', lw=2)
    ax.add_patch(circle_g)
    ax.text(3, 2, 'G', fontsize=12, ha='center', va='center', fontweight='bold', color='green')
    ax.text(3, 2.8, '100 Ω', fontsize=9, ha='center', fontweight='bold')

    ax.plot([3.5, 5], [2, 2], 'k-', lw=2)

    # High resistance R
    rect = patches.FancyBboxPatch((5, 1.3), 2, 1.4, boxstyle="round,pad=0.1",
                                   ec='k', fc='#fff3e0', lw=2)
    ax.add_patch(rect)
    ax.text(6, 2, 'R', fontsize=12, ha='center', va='center', fontweight='bold')

    ax.plot([7, 8.5], [2, 2], 'k-', lw=2)

    # Voltmeter terminals
    ax.plot(0, 2, 'ko', ms=8)
    ax.plot(8.5, 2, 'ko', ms=8)
    ax.text(0, 1.3, 'V−', fontsize=11, ha='center', fontweight='bold', color='blue')
    ax.text(8.5, 1.3, 'V+', fontsize=11, ha='center', fontweight='bold', color='red')

    # Bracket showing voltmeter
    ax.annotate('', xy=(0, 0.5), xytext=(8.5, 0.5),
                arrowprops=dict(arrowstyle='<->', color='purple', lw=2))
    ax.text(4.25, 0.1, 'Voltmeter (0–10 V)', fontsize=10, ha='center',
            fontweight='bold', color='purple')

    ax.set_title('Voltmeter = Galvanometer + High Resistance', fontsize=12, fontweight='bold')
    save(fig, 'cuet-phy-mag-devices-27-voltmeter-circuit.png')

# ─────────────────────────────────────────────────────────
# 5. cuet-phy-mag-devices-38-two-galvanometers.svg → .png
#    Two galvanometers P and Q, same coil params, P has stiffer spring
# ─────────────────────────────────────────────────────────
def img5():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

    for ax, label, k_label, deflection in [(ax1, 'P', 'k_P = 2k', 25),
                                            (ax2, 'Q', 'k_Q = k', 45)]:
        ax.set_xlim(-3, 3)
        ax.set_ylim(-2, 3)
        ax.set_aspect('equal')
        ax.axis('off')

        # Galvanometer body
        arc = patches.Arc((0, 0), 4, 4, angle=0, theta1=0, theta2=180,
                          ec='k', lw=2.5)
        ax.add_patch(arc)

        # Scale markings
        for angle in np.linspace(0, np.pi, 11):
            x = 2.2 * np.cos(angle)
            y = 2.2 * np.sin(angle)
            ax.plot(x, y, 'k|', ms=6)

        # Needle
        needle_angle = np.radians(90 - deflection)
        ax.plot([0, 1.8 * np.cos(needle_angle)], [0, 1.8 * np.sin(needle_angle)],
                'r-', lw=2.5)
        ax.plot(0, 0, 'ko', ms=6)

        # Labels
        ax.set_title(f'Galvanometer {label}\n{k_label}', fontsize=12, fontweight='bold')
        ax.text(0, -0.5, f'Deflection = {deflection}°', fontsize=10, ha='center',
                fontweight='bold', color='blue')
        ax.text(0, -1.2, 'Same N, A, B', fontsize=9, ha='center', color='gray')

    fig.suptitle('Two Galvanometers (Different Spring Constants)', fontsize=13, fontweight='bold', y=1.02)
    plt.tight_layout()
    save(fig, 'cuet-phy-mag-devices-38-two-galvanometers.png')

if __name__ == '__main__':
    print("Batch 12: Generating 5 images...")
    img1()
    img2()
    img3()
    img4()
    img5()
    print("Batch 12 complete!")
