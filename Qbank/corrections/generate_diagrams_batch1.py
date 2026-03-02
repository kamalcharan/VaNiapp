#!/usr/bin/env python3
"""
Generate all 14 diagram PNGs for Batch 1 correction questions.
Each diagram is physics-accurate and exam-ready.
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import matplotlib.lines as mlines
import numpy as np
from pathlib import Path
import os

OUT = Path(__file__).resolve().parent / "diagrams"
OUT.mkdir(exist_ok=True)

DPI = 200
FIG_W, FIG_H = 6, 4.5

def save(fig, name):
    path = OUT / name
    fig.savefig(path, dpi=DPI, bbox_inches='tight', facecolor='white', edgecolor='none')
    plt.close(fig)
    print(f"  OK: {name} ({os.path.getsize(path)//1024} KB)")


# ═══════════════════════════════════════════════════════════════════
# 1. cuet-phy-atom-bohr-d01 — Energy level transitions
# ═══════════════════════════════════════════════════════════════════
def diagram_atom_bohr_d01():
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))

    # Energy levels E_n = -13.6/n^2
    levels = {1: -13.6, 2: -3.4, 3: -1.51, 4: -0.85, 5: -0.54}

    for n, e in levels.items():
        ax.hlines(e, 0.5, 5.5, colors='black', linewidth=1.5)
        ax.text(0.2, e, f'n={n}', va='center', ha='right', fontsize=11, fontweight='bold')
        ax.text(5.7, e, f'{e:.2f} eV', va='center', ha='left', fontsize=9, color='gray')

    # Transitions: P(4→2), Q(3→1), R(5→3), S(3→2)
    transitions = [
        ('P', 4, 2, 1.2, 'red'),
        ('Q', 3, 1, 2.4, 'blue'),
        ('R', 5, 3, 3.6, 'green'),
        ('S', 3, 2, 4.8, 'orange'),
    ]

    for label, n_upper, n_lower, x, color in transitions:
        e_upper = levels[n_upper]
        e_lower = levels[n_lower]
        ax.annotate('', xy=(x, e_lower+0.15), xytext=(x, e_upper-0.15),
                     arrowprops=dict(arrowstyle='->', color=color, lw=2.5))
        ax.text(x, (e_upper + e_lower)/2, f' {label}\n n={n_upper}→{n_lower}',
                ha='center', va='center', fontsize=9, fontweight='bold', color=color,
                bbox=dict(boxstyle='round,pad=0.2', facecolor='white', edgecolor=color, alpha=0.9))

    ax.set_ylabel('Energy (eV)', fontsize=12)
    ax.set_title('Energy Level Diagram of Hydrogen Atom', fontsize=13, fontweight='bold')
    ax.set_xlim(-0.3, 6.5)
    ax.set_ylim(-15, 0.5)
    ax.set_xticks([])
    ax.spines['top'].set_visible(False)
    ax.spines['bottom'].set_visible(False)
    ax.spines['right'].set_visible(False)

    save(fig, 'cuet-phy-atom-bohr-d01.png')


# ═══════════════════════════════════════════════════════════════════
# 2. cuet-phy-atom-bohr-d02 — Concentric Bohr orbits
# ═══════════════════════════════════════════════════════════════════
def diagram_atom_bohr_d02():
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))
    ax.set_aspect('equal')

    # Nucleus
    nucleus = plt.Circle((0, 0), 0.15, color='red', zorder=5)
    ax.add_patch(nucleus)
    ax.text(0, 0, '+', ha='center', va='center', fontsize=14, fontweight='bold', color='white', zorder=6)

    # Orbits: r_n = n^2 * r1
    r1 = 1.0
    colors = ['#2196F3', '#4CAF50', '#FF9800']
    for n in [1, 2, 3]:
        r = n**2 * r1
        orbit = plt.Circle((0, 0), r, fill=False, edgecolor=colors[n-1], linewidth=2, linestyle='--')
        ax.add_patch(orbit)
        ax.text(r + 0.3, 0.3, f'n={n}', fontsize=12, fontweight='bold', color=colors[n-1])

        # Electron on orbit
        angle = np.radians(45 + (n-1)*90)
        ex, ey = r * np.cos(angle), r * np.sin(angle)
        electron = plt.Circle((ex, ey), 0.2, color=colors[n-1], zorder=5)
        ax.add_patch(electron)
        ax.text(ex, ey, 'e⁻', ha='center', va='center', fontsize=8, color='white', zorder=6)

    # Radius labels
    ax.annotate('', xy=(r1, -0.5), xytext=(0, -0.5),
                arrowprops=dict(arrowstyle='<->', color='black', lw=1.5))
    ax.text(r1/2, -0.9, 'r₁', ha='center', fontsize=12, fontweight='bold')

    ax.annotate('', xy=(9*r1, -1.5), xytext=(0, -1.5),
                arrowprops=dict(arrowstyle='<->', color='black', lw=1.5))
    ax.text(9*r1/2, -2.0, 'r₃ = ?', ha='center', fontsize=13, fontweight='bold', color='#FF9800')

    ax.set_xlim(-11, 12)
    ax.set_ylim(-3, 11)
    ax.set_title("Bohr's Model — Electron Orbits", fontsize=13, fontweight='bold')
    ax.axis('off')

    save(fig, 'cuet-phy-atom-bohr-d02.png')


# ═══════════════════════════════════════════════════════════════════
# 3. cuet-phy-atom-spectra-d01 — Emission vs Absorption spectrum
# ═══════════════════════════════════════════════════════════════════
def diagram_atom_spectra_d01():
    fig, axes = plt.subplots(2, 1, figsize=(FIG_W, 3.5), gridspec_kw={'hspace': 0.5})

    # Sodium D-lines approximate positions (normalized)
    d1_pos, d2_pos = 0.589, 0.5896  # in terms of fraction across visible

    # Emission spectrum (bright lines on dark background)
    ax = axes[0]
    ax.set_facecolor('black')
    ax.set_xlim(380, 750)
    ax.set_ylim(0, 1)
    # Bright yellow D-lines
    for pos, label in [(589.0, 'D₁'), (589.6, 'D₂')]:
        ax.axvline(pos, color='#FFD700', linewidth=4, alpha=0.95)
        ax.text(pos, 1.05, label, ha='center', fontsize=9, color='#FFD700', fontweight='bold')
    ax.set_title('Emission Spectrum (Sodium Vapour)', fontsize=11, fontweight='bold')
    ax.set_yticks([])
    ax.set_xlabel('Wavelength (nm)', fontsize=9)

    # Absorption spectrum (dark lines on continuous background)
    ax = axes[1]
    # Create continuous rainbow background
    gradient = np.linspace(0, 1, 500).reshape(1, -1)
    from matplotlib.colors import LinearSegmentedColormap
    colors_list = ['#8B00FF', '#4B0082', '#0000FF', '#00BFFF', '#00FF00', '#FFFF00', '#FF8C00', '#FF0000']
    cmap = LinearSegmentedColormap.from_list('visible', colors_list, N=500)
    ax.imshow(gradient, aspect='auto', cmap=cmap, extent=[380, 750, 0, 1])

    # Dark absorption lines at same positions
    for pos, label in [(589.0, 'D₁'), (589.6, 'D₂')]:
        ax.axvline(pos, color='black', linewidth=4)
        ax.text(pos, 1.05, label, ha='center', fontsize=9, color='black', fontweight='bold')
    ax.set_title('Absorption Spectrum (White light through Na vapour)', fontsize=11, fontweight='bold')
    ax.set_yticks([])
    ax.set_xlabel('Wavelength (nm)', fontsize=9)

    save(fig, 'cuet-phy-atom-spectra-d01.png')


# ═══════════════════════════════════════════════════════════════════
# 4. cuet-phy-atom-spectra-d02 — 1/λ vs 1/n² graph (Balmer)
# ═══════════════════════════════════════════════════════════════════
def diagram_atom_spectra_d02():
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))

    R = 1.097e7  # Rydberg constant in m^-1
    # Balmer series: 1/λ = R(1/4 - 1/n²) for n = 3,4,5,6,7
    ns = [3, 4, 5, 6, 7]
    inv_n2 = [1/n**2 for n in ns]
    inv_lambda = [R * (1/4 - 1/n**2) for n in ns]

    # Scale for readability
    inv_n2_arr = np.array(inv_n2)
    inv_lambda_arr = np.array(inv_lambda) / 1e6  # in units of 10^6 m^-1
    R_scaled = R / 1e6

    ax.scatter(inv_n2_arr, inv_lambda_arr, color='blue', s=80, zorder=5)
    for i, n in enumerate(ns):
        ax.annotate(f'n={n}', (inv_n2_arr[i], inv_lambda_arr[i]),
                    textcoords="offset points", xytext=(8, 8), fontsize=10, color='blue')

    # Best fit line (should be perfect line: 1/λ = R/4 - R/n²)
    x_fit = np.linspace(0, 0.15, 100)
    y_fit = R_scaled/4 - R_scaled * x_fit
    ax.plot(x_fit, y_fit, 'r-', linewidth=2, label=f'1/λ = R/4 − R/n²')

    # Mark y-intercept
    ax.plot(0, R_scaled/4, 'ro', markersize=10, zorder=5)
    ax.annotate(f'y-intercept = R/4\n≈ {R_scaled/4:.2f} × 10⁶ m⁻¹',
                xy=(0, R_scaled/4), xytext=(0.03, R_scaled/4 + 0.1),
                fontsize=10, fontweight='bold', color='red',
                arrowprops=dict(arrowstyle='->', color='red'))

    # Mark slope
    ax.text(0.06, 0.8, f'Slope = −R ≈ −{R_scaled:.2f} × 10⁶ m⁻¹',
            fontsize=10, color='gray', style='italic')

    ax.set_xlabel('1/n²', fontsize=12)
    ax.set_ylabel('1/λ  (× 10⁶ m⁻¹)', fontsize=12)
    ax.set_title('Balmer Series: 1/λ vs 1/n²', fontsize=13, fontweight='bold')
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)
    ax.set_xlim(-0.01, 0.14)
    ax.set_ylim(0, 3.2)

    save(fig, 'cuet-phy-atom-spectra-d02.png')


# ═══════════════════════════════════════════════════════════════════
# 5. cuet-phy-nuclei-decay-d01 — Radioactive decay curve
# ═══════════════════════════════════════════════════════════════════
def diagram_nuclei_decay_d01():
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))

    half_life = 10  # minutes
    t = np.linspace(0, 40, 200)
    N = np.exp(-np.log(2) * t / half_life)

    ax.plot(t, N, 'b-', linewidth=2.5)

    # Mark key points
    key_points = [(0, 1), (10, 0.5), (20, 0.25), (30, 0.125)]
    for t_val, n_val in key_points:
        ax.plot(t_val, n_val, 'ro', markersize=8, zorder=5)
        ax.hlines(n_val, 0, t_val, colors='gray', linestyles='dashed', alpha=0.5)
        ax.vlines(t_val, 0, n_val, colors='gray', linestyles='dashed', alpha=0.5)
        label = f'({t_val}, {n_val})'
        if n_val == 0.25:
            label = f'({t_val}, 1/4)'
            ax.annotate(label, (t_val, n_val), textcoords="offset points",
                        xytext=(10, 10), fontsize=11, fontweight='bold', color='red',
                        bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.8))
        else:
            ax.annotate(label, (t_val, n_val), textcoords="offset points",
                        xytext=(10, 5), fontsize=9)

    # Question annotation
    ax.annotate('After 20 min, N/N₀ = 1/4\nWhat is t₁/₂ = ?',
                xy=(25, 0.6), fontsize=12, fontweight='bold', color='darkred',
                bbox=dict(boxstyle='round', facecolor='lightyellow', edgecolor='red'))

    ax.set_xlabel('Time t (minutes)', fontsize=12)
    ax.set_ylabel('N / N₀', fontsize=12)
    ax.set_title('Radioactive Decay Curve', fontsize=13, fontweight='bold')
    ax.set_xlim(-1, 42)
    ax.set_ylim(-0.02, 1.1)
    ax.grid(True, alpha=0.3)

    save(fig, 'cuet-phy-nuclei-decay-d01.png')


# ═══════════════════════════════════════════════════════════════════
# 6. cuet-phy-nuclei-decay-d02 — N-Z plot decay chain
# ═══════════════════════════════════════════════════════════════════
def diagram_nuclei_decay_d02():
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))

    # Starting nucleus X: (Z=92, N=146)
    # α-decay: Z-2, N-2 → (90, 144)
    # β⁻ decay 1: Z+1, N-1 → (91, 143)
    # β⁻ decay 2: Z+1, N-1 → (92, 142) = Y

    points = [
        (92, 146, 'X\n(Z=92, N=146)', 'red'),
        (90, 144, '(90, 144)', '#2196F3'),
        (91, 143, '(91, 143)', '#2196F3'),
        (92, 142, 'Y = ?', '#4CAF50'),
    ]

    # Plot points
    for z, n, label, color in points:
        ax.plot(z, n, 'o', color=color, markersize=15, zorder=5)
        offset = (12, 8) if 'X' in label else (-12, -15) if 'Y' in label else (12, -5)
        ax.annotate(label, (z, n), textcoords="offset points", xytext=offset,
                    fontsize=11, fontweight='bold', color=color,
                    bbox=dict(boxstyle='round,pad=0.3', facecolor='white', edgecolor=color, alpha=0.9))

    # Arrows for decays
    # α-decay: (92,146) → (90,144)
    ax.annotate('', xy=(90.1, 144.1), xytext=(91.9, 145.9),
                arrowprops=dict(arrowstyle='->', color='red', lw=2.5))
    ax.text(90.7, 145.3, 'α', fontsize=14, fontweight='bold', color='red',
            bbox=dict(boxstyle='round', facecolor='white', edgecolor='red'))

    # β⁻ decay 1: (90,144) → (91,143)
    ax.annotate('', xy=(90.9, 143.1), xytext=(90.1, 143.9),
                arrowprops=dict(arrowstyle='->', color='blue', lw=2.5))
    ax.text(90.1, 143.2, 'β⁻', fontsize=12, fontweight='bold', color='blue',
            bbox=dict(boxstyle='round', facecolor='white', edgecolor='blue'))

    # β⁻ decay 2: (91,143) → (92,142)
    ax.annotate('', xy=(91.9, 142.1), xytext=(91.1, 142.9),
                arrowprops=dict(arrowstyle='->', color='blue', lw=2.5))
    ax.text(91.1, 142.2, 'β⁻', fontsize=12, fontweight='bold', color='blue',
            bbox=dict(boxstyle='round', facecolor='white', edgecolor='blue'))

    ax.set_xlabel('Proton Number (Z)', fontsize=12)
    ax.set_ylabel('Neutron Number (N)', fontsize=12)
    ax.set_title('Decay Chain on N-Z Plot', fontsize=13, fontweight='bold')
    ax.grid(True, alpha=0.3)
    ax.set_xlim(88.5, 94)
    ax.set_ylim(140.5, 147.5)

    save(fig, 'cuet-phy-nuclei-decay-d02.png')


# ═══════════════════════════════════════════════════════════════════
# 7. cuet-phy-nuclei-prop-d01 — BE/A vs mass number curve
# ═══════════════════════════════════════════════════════════════════
def diagram_nuclei_prop_d01():
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))

    # Approximate BE/A curve
    A = np.linspace(2, 260, 500)
    # Semi-empirical approximation
    BE_per_A = 15.56 - 17.23 * A**(-1/3) - 0.7 * (A/2)**2 * A**(-4/3) - 23.285 * (A - 2*(A/2))**2 / A**2
    # Simplified smooth curve
    BE_per_A = 8.5 * (1 - np.exp(-A/25)) * (1 - 0.0008*(A - 60)**2 / (A + 50))
    BE_per_A = np.clip(BE_per_A, 0, 9)

    # Manual key points for accuracy
    key_nuclei = {
        'H-2': (2, 1.1), 'He-4': (4, 7.07), 'Li-7': (7, 5.6),
        'C-12': (12, 7.68), 'O-16': (16, 7.98), 'Fe-56': (56, 8.79),
        'Ni-62': (62, 8.79), 'Kr-84': (84, 8.72), 'Sn-120': (120, 8.51),
        'U-235': (235, 7.59), 'U-238': (238, 7.57),
    }

    # Plot smooth curve through key points using numpy interp
    a_pts = [v[0] for v in key_nuclei.values()]
    be_pts = [v[1] for v in key_nuclei.values()]
    a_smooth = np.linspace(2, 240, 300)
    be_smooth = np.interp(a_smooth, a_pts, be_pts)

    ax.plot(a_smooth, be_smooth, 'b-', linewidth=2.5)

    # Mark key nuclei
    for name, (a, be) in key_nuclei.items():
        ax.plot(a, be, 'ko', markersize=4, zorder=5)
        if name in ('He-4', 'Fe-56', 'U-235'):
            offset = (5, 8) if name != 'He-4' else (-5, 8)
            ax.annotate(name, (a, be), textcoords="offset points", xytext=offset,
                        fontsize=10, fontweight='bold', color='darkblue')

    # Shade regions
    ax.axvspan(2, 30, alpha=0.08, color='blue', label='Light nuclei (Fusion)')
    ax.axvspan(40, 80, alpha=0.08, color='green', label='Most stable')
    ax.axvspan(200, 245, alpha=0.12, color='red', label='Heavy nuclei (Fission)')

    # Annotations
    ax.annotate('FUSION\nregion', xy=(15, 4), fontsize=11, ha='center', color='blue', fontweight='bold')
    ax.annotate('Peak\n(Fe-56)', xy=(56, 8.79), xytext=(80, 9.2),
                fontsize=10, fontweight='bold', color='green',
                arrowprops=dict(arrowstyle='->', color='green'))
    ax.annotate('FISSION\nregion', xy=(220, 6.5), fontsize=11, ha='center', color='red', fontweight='bold')

    ax.set_xlabel('Mass Number (A)', fontsize=12)
    ax.set_ylabel('Binding Energy per Nucleon (MeV)', fontsize=12)
    ax.set_title('BE/A vs Mass Number', fontsize=13, fontweight='bold')
    ax.set_xlim(0, 250)
    ax.set_ylim(0, 10)
    ax.grid(True, alpha=0.3)
    ax.legend(loc='lower right', fontsize=9)

    save(fig, 'cuet-phy-nuclei-prop-d01.png')


# ═══════════════════════════════════════════════════════════════════
# 8. cuet-phy-nuclei-prop-d02 — Nucleus composition (C-14)
# ═══════════════════════════════════════════════════════════════════
def diagram_nuclei_prop_d02():
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))
    ax.set_aspect('equal')

    # Draw nucleons in a roughly circular arrangement
    np.random.seed(42)
    n_protons = 6
    n_neutrons = 8

    # Arrange in concentric rings
    positions = []
    # Inner ring (4 nucleons)
    for i in range(4):
        angle = i * 2 * np.pi / 4 + np.pi/4
        positions.append((0.8 * np.cos(angle), 0.8 * np.sin(angle)))
    # Outer ring (10 nucleons)
    for i in range(10):
        angle = i * 2 * np.pi / 10
        positions.append((1.8 * np.cos(angle), 1.8 * np.sin(angle)))

    # Assign: first 6 are protons, next 8 are neutrons (interleaved)
    proton_indices = [0, 2, 4, 6, 9, 12]
    neutron_indices = [1, 3, 5, 7, 8, 10, 11, 13]

    for i, (x, y) in enumerate(positions):
        if i in proton_indices:
            circle = plt.Circle((x, y), 0.35, color='red', ec='darkred', linewidth=1.5, zorder=5)
            ax.add_patch(circle)
            ax.text(x, y, '+', ha='center', va='center', fontsize=16, fontweight='bold', color='white', zorder=6)
        elif i in neutron_indices:
            circle = plt.Circle((x, y), 0.35, color='#555555', ec='#333333', linewidth=1.5, zorder=5)
            ax.add_patch(circle)
            ax.text(x, y, 'n', ha='center', va='center', fontsize=13, fontweight='bold', color='white', zorder=6)

    # Boundary
    boundary = plt.Circle((0, 0), 2.4, fill=False, edgecolor='black', linewidth=2, linestyle='--')
    ax.add_patch(boundary)

    # Legend
    ax.text(3.2, 1.5, f'Protons (+) = 6', fontsize=12, fontweight='bold', color='red',
            bbox=dict(boxstyle='round', facecolor='lightyellow'))
    ax.text(3.2, 0.5, f'Neutrons (n) = 8', fontsize=12, fontweight='bold', color='#555',
            bbox=dict(boxstyle='round', facecolor='lightyellow'))
    ax.text(3.2, -0.7, 'Which element?\nMass number = ?', fontsize=12, fontweight='bold', color='darkblue',
            bbox=dict(boxstyle='round', facecolor='lightblue', edgecolor='blue'))

    ax.set_xlim(-3.2, 6.5)
    ax.set_ylim(-3.2, 3.2)
    ax.set_title('Nuclear Composition', fontsize=13, fontweight='bold')
    ax.axis('off')

    save(fig, 'cuet-phy-nuclei-prop-d02.png')


# ═══════════════════════════════════════════════════════════════════
# 9. cuet-phy-current-ohm-d01 — V-I characteristics
# ═══════════════════════════════════════════════════════════════════
def diagram_current_ohm_d01():
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))

    I = np.linspace(0, 5, 100)
    # Conductor A: steeper slope (higher R)
    V_A = 4 * I  # R_A = 4 Ω
    # Conductor B: gentler slope (lower R)
    V_B = 2 * I  # R_B = 2 Ω

    ax.plot(I, V_A, 'r-', linewidth=2.5, label='Conductor A')
    ax.plot(I, V_B, 'b-', linewidth=2.5, label='Conductor B')

    # Mark slopes
    ax.annotate('A (steeper slope)', xy=(3, 12), fontsize=12, fontweight='bold', color='red')
    ax.annotate('B (gentler slope)', xy=(4, 8), fontsize=12, fontweight='bold', color='blue')

    ax.set_xlabel('Current I (A)', fontsize=12)
    ax.set_ylabel('Voltage V (V)', fontsize=12)
    ax.set_title('V-I Characteristics of Two Conductors', fontsize=13, fontweight='bold')
    ax.set_xlim(0, 5.5)
    ax.set_ylim(0, 22)
    ax.legend(fontsize=11)
    ax.grid(True, alpha=0.3)
    ax.axhline(0, color='black', linewidth=0.5)
    ax.axvline(0, color='black', linewidth=0.5)

    save(fig, 'cuet-phy-current-ohm-d01.png')


# ═══════════════════════════════════════════════════════════════════
# 10. cuet-phy-current-ohm-d02 — Series-parallel circuit
# ═══════════════════════════════════════════════════════════════════
def diagram_current_ohm_d02():
    fig, ax = plt.subplots(figsize=(FIG_W, 3.5))
    ax.set_aspect('equal')

    # Battery
    ax.plot([0.5, 0.5], [1, 3], 'k-', linewidth=2)
    ax.plot([0.3, 0.7], [3, 3], 'k-', linewidth=3)  # positive terminal (longer)
    ax.plot([0.35, 0.65], [2.8, 2.8], 'k-', linewidth=1.5)  # negative terminal
    ax.text(0.1, 2.9, '+', fontsize=12, fontweight='bold', color='red')
    ax.text(0.1, 2.6, '−', fontsize=14, fontweight='bold', color='blue')
    ax.text(0.5, 1.6, '12V', ha='center', fontsize=11, fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightyellow', edgecolor='orange'))

    # Wires from battery
    ax.plot([0.5, 0.5, 2, 2], [3, 3.5, 3.5, 3], 'k-', linewidth=2)  # top wire to R3
    ax.plot([0.5, 0.5, 6, 6], [1, 0.5, 0.5, 1], 'k-', linewidth=2)  # bottom return

    # R3 in series
    rect_r3 = patches.FancyBboxPatch((1.5, 2.5), 1, 0.6, boxstyle="round,pad=0.05",
                                      facecolor='#FF9800', edgecolor='black', linewidth=1.5)
    ax.add_patch(rect_r3)
    ax.text(2, 2.8, 'R₃=3Ω', ha='center', va='center', fontsize=11, fontweight='bold')

    # Wire from R3 to parallel junction
    ax.plot([2.5, 4, 4], [3, 3, 3], 'k-', linewidth=2)  # to junction

    # Junction splits
    ax.plot([4, 4], [3, 3.5], 'k-', linewidth=2)  # up to R1
    ax.plot([4, 4], [3, 1], 'k-', linewidth=2)  # down to R2

    # R1 (top parallel)
    ax.plot([4, 4.5], [3.5, 3.5], 'k-', linewidth=2)
    rect_r1 = patches.FancyBboxPatch((4.5, 3.2), 1, 0.6, boxstyle="round,pad=0.05",
                                      facecolor='#2196F3', edgecolor='black', linewidth=1.5)
    ax.add_patch(rect_r1)
    ax.text(5, 3.5, 'R₁=2Ω', ha='center', va='center', fontsize=11, fontweight='bold', color='white')
    ax.plot([5.5, 6, 6], [3.5, 3.5, 3], 'k-', linewidth=2)

    # R2 (bottom parallel)
    ax.plot([4, 4.5], [1, 1], 'k-', linewidth=2)
    rect_r2 = patches.FancyBboxPatch((4.5, 0.7), 1, 0.6, boxstyle="round,pad=0.05",
                                      facecolor='#4CAF50', edgecolor='black', linewidth=1.5)
    ax.add_patch(rect_r2)
    ax.text(5, 1, 'R₂=4Ω', ha='center', va='center', fontsize=11, fontweight='bold', color='white')
    ax.plot([5.5, 6, 6], [1, 1, 1], 'k-', linewidth=2)

    # Right junction
    ax.plot([6, 6], [1, 3.5], 'k-', linewidth=2)

    # Junction dots
    for x, y in [(4, 3), (6, 2)]:
        ax.plot(x, y, 'ko', markersize=6, zorder=5)

    # Labels
    ax.text(3, 4.2, 'Series', fontsize=10, ha='center', color='#FF9800', fontweight='bold')
    ax.text(5, 4.2, 'Parallel', fontsize=10, ha='center', color='purple', fontweight='bold')

    ax.set_xlim(-0.5, 7)
    ax.set_ylim(-0.2, 4.8)
    ax.set_title('Circuit: R₃ in series with (R₁ ∥ R₂)', fontsize=13, fontweight='bold')
    ax.axis('off')

    save(fig, 'cuet-phy-current-ohm-d02.png')


# ═══════════════════════════════════════════════════════════════════
# 11. cuet-phy-current-kirch-d01 — Wheatstone bridge
# ═══════════════════════════════════════════════════════════════════
def diagram_current_kirch_d01():
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))
    ax.set_aspect('equal')

    # Diamond layout
    # Top: A, Right: B, Bottom: C, Left: D
    A = (3, 5)   # top
    B = (5.5, 3) # right
    C = (3, 1)   # bottom
    D = (0.5, 3) # left

    # Draw diamond edges
    for start, end in [(A, B), (A, D), (B, C), (D, C)]:
        ax.plot([start[0], end[0]], [start[1], end[1]], 'k-', linewidth=2)

    # Galvanometer (D to B)
    ax.plot([D[0]+0.3, B[0]-0.3], [3, 3], 'k-', linewidth=1.5, linestyle='--')
    ax.text(3, 3, 'G', ha='center', va='center', fontsize=14, fontweight='bold',
            bbox=dict(boxstyle='circle', facecolor='lightyellow', edgecolor='black', linewidth=2))

    # Junction dots
    for pt, label in [(A, 'A'), (B, 'B'), (C, 'C'), (D, 'D')]:
        ax.plot(pt[0], pt[1], 'ko', markersize=8, zorder=5)
        offset = {'A': (0, 0.4), 'B': (0.4, 0), 'C': (0, -0.5), 'D': (-0.5, 0)}
        ax.text(pt[0]+offset[label][0], pt[1]+offset[label][1], label,
                fontsize=12, fontweight='bold', ha='center', va='center')

    # Resistor labels on edges
    ax.text(1.3, 4.3, 'P = 100Ω', fontsize=11, fontweight='bold', color='blue', rotation=30,
            bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.8))
    ax.text(4.5, 4.3, 'Q = 200Ω', fontsize=11, fontweight='bold', color='blue', rotation=-30,
            bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.8))
    ax.text(1.3, 1.5, 'R = 150Ω', fontsize=11, fontweight='bold', color='blue', rotation=-30,
            bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.8))
    ax.text(4.5, 1.5, 'S = ?', fontsize=13, fontweight='bold', color='red', rotation=30,
            bbox=dict(boxstyle='round', facecolor='lightyellow', edgecolor='red'))

    # Battery connection (top to bottom)
    ax.plot([A[0], A[0]], [A[1], A[1]+0.8], 'k-', linewidth=2)
    ax.plot([C[0], C[0]], [C[1], C[1]-0.8], 'k-', linewidth=2)
    ax.text(A[0]+0.5, A[1]+0.5, '+', fontsize=14, fontweight='bold', color='red')
    ax.text(C[0]+0.5, C[1]-0.5, '−', fontsize=14, fontweight='bold', color='blue')

    # Zero deflection note
    ax.text(3, 0, 'Galvanometer shows zero deflection\n(Bridge is balanced)',
            ha='center', fontsize=10, style='italic', color='gray')

    ax.set_xlim(-1, 7)
    ax.set_ylim(-0.8, 6.5)
    ax.set_title('Wheatstone Bridge', fontsize=13, fontweight='bold')
    ax.axis('off')

    save(fig, 'cuet-phy-current-kirch-d01.png')


# ═══════════════════════════════════════════════════════════════════
# 12. cuet-phy-current-kirch-d02 — Two-loop KVL circuit
# ═══════════════════════════════════════════════════════════════════
def diagram_current_kirch_d02():
    fig, ax = plt.subplots(figsize=(FIG_W, 3.5))
    ax.set_aspect('equal')

    # Loop 1 (left rectangle)
    # Corners: (0,0), (3,0), (3,3), (0,3)
    ax.plot([0, 3], [3, 3], 'k-', linewidth=2)  # top
    ax.plot([0, 0], [0, 3], 'k-', linewidth=2)  # left
    ax.plot([0, 3], [0, 0], 'k-', linewidth=2)  # bottom
    ax.plot([3, 3], [0, 3], 'k-', linewidth=2)  # shared branch

    # Loop 2 (right rectangle)
    ax.plot([3, 6], [3, 3], 'k-', linewidth=2)  # top
    ax.plot([6, 6], [0, 3], 'k-', linewidth=2)  # right
    ax.plot([3, 6], [0, 0], 'k-', linewidth=2)  # bottom

    # Battery 1 (10V) on left side
    ax.plot([0, 0], [1.2, 1.8], 'k-', linewidth=3)
    ax.text(-0.6, 1.5, '10V', fontsize=11, fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightyellow', edgecolor='orange'))
    ax.text(-0.2, 1.9, '+', fontsize=10, fontweight='bold', color='red')
    ax.text(-0.2, 1.0, '−', fontsize=12, fontweight='bold', color='blue')

    # R=2Ω on top of loop 1
    rect = patches.FancyBboxPatch((0.8, 2.7), 1.4, 0.6, boxstyle="round,pad=0.05",
                                   facecolor='#2196F3', edgecolor='black', linewidth=1.5)
    ax.add_patch(rect)
    ax.text(1.5, 3, '2Ω', ha='center', va='center', fontsize=12, fontweight='bold', color='white')

    # R=3Ω on shared branch (middle)
    rect2 = patches.FancyBboxPatch((2.7, 1.2), 0.6, 1.2, boxstyle="round,pad=0.05",
                                    facecolor='#FF9800', edgecolor='black', linewidth=1.5)
    ax.add_patch(rect2)
    ax.text(3, 1.8, '3Ω', ha='center', va='center', fontsize=11, fontweight='bold')

    # Battery 2 (5V) on right side
    ax.plot([6, 6], [1.2, 1.8], 'k-', linewidth=3)
    ax.text(6.3, 1.5, '5V', fontsize=11, fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightyellow', edgecolor='orange'))
    ax.text(6.2, 1.9, '+', fontsize=10, fontweight='bold', color='red')
    ax.text(6.2, 1.0, '−', fontsize=12, fontweight='bold', color='blue')

    # R=4Ω on top of loop 2
    rect3 = patches.FancyBboxPatch((3.8, 2.7), 1.4, 0.6, boxstyle="round,pad=0.05",
                                    facecolor='#4CAF50', edgecolor='black', linewidth=1.5)
    ax.add_patch(rect3)
    ax.text(4.5, 3, '4Ω', ha='center', va='center', fontsize=12, fontweight='bold', color='white')

    # Current directions (loop arrows)
    from matplotlib.patches import FancyArrowPatch
    # Loop 1 arrow
    ax.annotate('', xy=(1.2, 1.2), xytext=(1.8, 1.8),
                arrowprops=dict(arrowstyle='->', color='red', lw=2))
    ax.text(1.5, 1.0, 'I₁', fontsize=13, fontweight='bold', color='red')
    ax.text(0.5, 0.4, 'Loop 1', fontsize=10, color='red', style='italic')

    # Loop 2 arrow
    ax.annotate('', xy=(4.2, 1.2), xytext=(4.8, 1.8),
                arrowprops=dict(arrowstyle='->', color='blue', lw=2))
    ax.text(4.5, 1.0, 'I₂', fontsize=13, fontweight='bold', color='blue')
    ax.text(3.7, 0.4, 'Loop 2', fontsize=10, color='blue', style='italic')

    ax.set_xlim(-1.2, 7.2)
    ax.set_ylim(-0.5, 4)
    ax.set_title('Two-Loop Circuit (Kirchhoff\'s Voltage Law)', fontsize=13, fontweight='bold')
    ax.axis('off')

    save(fig, 'cuet-phy-current-kirch-d02.png')


# ═══════════════════════════════════════════════════════════════════
# 13. cuet-phy-current-instr-d01 — Meter bridge
# ═══════════════════════════════════════════════════════════════════
def diagram_current_instr_d01():
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))
    ax.set_aspect('equal')

    # Meter bridge wire (0 to 100 cm)
    ax.plot([1, 9], [1, 1], 'k-', linewidth=3)
    ax.text(1, 0.6, '0 cm', ha='center', fontsize=10)
    ax.text(9, 0.6, '100 cm', ha='center', fontsize=10)

    # Scale marks
    for cm in range(0, 101, 10):
        x = 1 + cm * 8 / 100
        ax.plot([x, x], [0.9, 1.1], 'k-', linewidth=1)

    # Balance point at 40 cm
    bp_x = 1 + 40 * 8 / 100  # = 4.2
    ax.plot(bp_x, 1, 'rv', markersize=15, zorder=5)
    ax.text(bp_x, 0.4, '40 cm', ha='center', fontsize=12, fontweight='bold', color='red')

    # Jockey line to galvanometer
    ax.plot([bp_x, bp_x], [1, 2.5], 'k--', linewidth=1.5)

    # Galvanometer
    ax.text(bp_x, 2.7, 'G', ha='center', va='center', fontsize=14, fontweight='bold',
            bbox=dict(boxstyle='circle', facecolor='lightyellow', edgecolor='black', linewidth=2))

    # R on left gap
    ax.plot([1, 1], [1, 3.5], 'k-', linewidth=2)
    ax.plot([1, 3], [3.5, 3.5], 'k-', linewidth=2)
    rect_r = patches.FancyBboxPatch((1.5, 3.2), 1, 0.6, boxstyle="round,pad=0.05",
                                     facecolor='#2196F3', edgecolor='black', linewidth=1.5)
    ax.add_patch(rect_r)
    ax.text(2, 3.5, 'R=6Ω', ha='center', va='center', fontsize=11, fontweight='bold', color='white')

    # Wire from R to galvanometer
    ax.plot([3, bp_x], [3.5, 2.9], 'k-', linewidth=1.5)

    # X on right gap
    ax.plot([9, 9], [1, 3.5], 'k-', linewidth=2)
    ax.plot([9, 7], [3.5, 3.5], 'k-', linewidth=2)
    rect_x = patches.FancyBboxPatch((7, 3.2), 1, 0.6, boxstyle="round,pad=0.05",
                                     facecolor='#FF9800', edgecolor='black', linewidth=1.5)
    ax.add_patch(rect_x)
    ax.text(7.5, 3.5, 'X = ?', ha='center', va='center', fontsize=11, fontweight='bold')

    # Wire from X to galvanometer
    ax.plot([7, bp_x], [3.5, 2.9], 'k-', linewidth=1.5)

    # Battery at top
    ax.plot([3, 7], [4.5, 4.5], 'k-', linewidth=2)
    ax.plot([3, 3], [3.5, 4.5], 'k-', linewidth=2)
    ax.plot([7, 7], [3.5, 4.5], 'k-', linewidth=2)
    ax.text(5, 4.5, 'E', ha='center', va='bottom', fontsize=12, fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightyellow', edgecolor='orange'))

    # Length labels
    ax.annotate('', xy=(1, 0.1), xytext=(bp_x, 0.1),
                arrowprops=dict(arrowstyle='<->', color='red', lw=1.5))
    ax.text((1+bp_x)/2, -0.2, 'l = 40 cm', ha='center', fontsize=11, fontweight='bold', color='red')

    ax.annotate('', xy=(bp_x, 0.1), xytext=(9, 0.1),
                arrowprops=dict(arrowstyle='<->', color='blue', lw=1.5))
    ax.text((bp_x+9)/2, -0.2, '100−l = 60 cm', ha='center', fontsize=11, fontweight='bold', color='blue')

    ax.set_xlim(-0.5, 10.5)
    ax.set_ylim(-0.8, 5.5)
    ax.set_title('Meter Bridge (Balanced)', fontsize=13, fontweight='bold')
    ax.axis('off')

    save(fig, 'cuet-phy-current-instr-d01.png')


# ═══════════════════════════════════════════════════════════════════
# 14. cuet-phy-current-instr-d02 — Potentiometer
# ═══════════════════════════════════════════════════════════════════
def diagram_current_instr_d02():
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))
    ax.set_aspect('equal')

    # Potentiometer wire (A to B)
    ax.plot([1, 9], [4, 4], 'k-', linewidth=3)
    ax.text(0.7, 4, 'A', fontsize=12, fontweight='bold')
    ax.text(9.2, 4, 'B', fontsize=12, fontweight='bold')

    # Scale marks
    for cm in range(0, 101, 10):
        x = 1 + cm * 8 / 100
        ax.plot([x, x], [3.9, 4.1], 'k-', linewidth=1)

    # Driver cell at top
    ax.plot([1, 1], [4, 5], 'k-', linewidth=2)
    ax.plot([9, 9], [4, 5], 'k-', linewidth=2)
    ax.plot([1, 4], [5, 5], 'k-', linewidth=2)
    ax.plot([5, 9], [5, 5], 'k-', linewidth=2)
    ax.text(4.5, 5, 'E₀', ha='center', va='center', fontsize=12, fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightyellow', edgecolor='orange'))
    ax.text(4.0, 5.3, '+', fontsize=10, color='red', fontweight='bold')
    ax.text(5.1, 5.3, '−', fontsize=12, color='blue', fontweight='bold')

    # Standard cell (balances at 51 cm)
    std_x = 1 + 51 * 8 / 100  # ≈ 5.08
    ax.plot([1, 1], [4, 2.5], 'k-', linewidth=1.5)
    ax.plot([1, 2.5], [2.5, 2.5], 'k-', linewidth=1.5)
    ax.text(2.5, 2.5, 'E_std\n1.02V', ha='center', va='center', fontsize=10, fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightgreen', edgecolor='green'))
    ax.plot([3.5, std_x], [2.5, 2.5], 'k-', linewidth=1.5)

    # Galvanometer 1
    ax.text(std_x, 2.5, 'G', ha='center', va='center', fontsize=11, fontweight='bold',
            bbox=dict(boxstyle='circle', facecolor='lightyellow', edgecolor='black', linewidth=1.5))
    ax.plot([std_x, std_x], [2.8, 4], 'g--', linewidth=1.5)
    ax.plot(std_x, 4, 'gv', markersize=10, zorder=5)
    ax.text(std_x, 3.5, '51 cm', fontsize=10, fontweight='bold', color='green', rotation=90, va='center')

    # Unknown cell (balances at 75 cm)
    unk_x = 1 + 75 * 8 / 100  # = 7.0
    ax.plot([1, 1], [2.5, 1], 'k-', linewidth=1.5)
    ax.plot([1, 2.5], [1, 1], 'k-', linewidth=1.5)
    ax.text(2.5, 1, 'E_?\n??V', ha='center', va='center', fontsize=10, fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='lightyellow', edgecolor='red'))
    ax.plot([3.5, unk_x], [1, 1], 'k-', linewidth=1.5)

    # Galvanometer 2
    ax.text(unk_x, 1, 'G', ha='center', va='center', fontsize=11, fontweight='bold',
            bbox=dict(boxstyle='circle', facecolor='lightyellow', edgecolor='black', linewidth=1.5))
    ax.plot([unk_x, unk_x], [1.3, 4], 'r--', linewidth=1.5)
    ax.plot(unk_x, 4, 'rv', markersize=10, zorder=5)
    ax.text(unk_x+0.2, 3.2, '75 cm', fontsize=10, fontweight='bold', color='red', rotation=90, va='center')

    ax.set_xlim(-0.5, 10.5)
    ax.set_ylim(-0.2, 6)
    ax.set_title('Potentiometer — Comparing EMFs', fontsize=13, fontweight='bold')
    ax.axis('off')

    save(fig, 'cuet-phy-current-instr-d02.png')


# ═══════════════════════════════════════════════════════════════════
# RUN ALL
# ═══════════════════════════════════════════════════════════════════
if __name__ == '__main__':
    print("Generating Batch 1 diagrams...")
    print()

    print("[Atoms & Nuclei — Bohr Model]")
    diagram_atom_bohr_d01()
    diagram_atom_bohr_d02()

    print("[Atoms & Nuclei — Spectra]")
    diagram_atom_spectra_d01()
    diagram_atom_spectra_d02()

    print("[Atoms & Nuclei — Decay]")
    diagram_nuclei_decay_d01()
    diagram_nuclei_decay_d02()

    print("[Atoms & Nuclei — Properties]")
    diagram_nuclei_prop_d01()
    diagram_nuclei_prop_d02()

    print("[Current Electricity — Ohm's Law]")
    diagram_current_ohm_d01()
    diagram_current_ohm_d02()

    print("[Current Electricity — Kirchhoff's Laws]")
    diagram_current_kirch_d01()
    diagram_current_kirch_d02()

    print("[Current Electricity — Instruments]")
    diagram_current_instr_d01()
    diagram_current_instr_d02()

    print()
    print(f"Done! All diagrams saved to: {OUT}")
