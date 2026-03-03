#!/usr/bin/env python3
"""
Generate 4 diagram PNGs for the sample V2 questions (v2-db-001 to v2-db-004).
These questions currently use placeholder:// URIs and need real images.

Output: Qbank/corrections/diagrams/sample/
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
from pathlib import Path
import os

OUT = Path(__file__).resolve().parent / "diagrams" / "sample"
OUT.mkdir(parents=True, exist_ok=True)

DPI = 200
FIG_W, FIG_H = 6, 4.5

def save(fig, name):
    path = OUT / name
    fig.savefig(path, dpi=DPI, bbox_inches='tight', facecolor='white', edgecolor='none')
    plt.close(fig)
    print(f"  OK: {name} ({os.path.getsize(path)//1024} KB)")


# ═══════════════════════════════════════════════════════════════════
# 1. v2-db-001: Free-body diagram — 5 kg block on surface with 10N force
# ═══════════════════════════════════════════════════════════════════
def diagram_free_body():
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))
    ax.set_aspect('equal')

    # Surface
    ax.hlines(0, -2, 6, colors='#444', linewidth=2)
    for x in np.arange(-2, 6, 0.4):
        ax.plot([x, x - 0.3], [0, -0.3], color='#888', linewidth=0.8)

    # Block
    block = patches.FancyBboxPatch((1, 0.05), 2, 1.5, boxstyle="round,pad=0.05",
                                    facecolor='#3B82F6', edgecolor='#1E40AF', linewidth=2)
    ax.add_patch(block)
    ax.text(2, 0.8, '5 kg', ha='center', va='center', fontsize=14,
            fontweight='bold', color='white')

    # Force arrows
    cx, cy = 2, 0.8  # center of block

    # Applied force → 10 N to the right
    ax.annotate('', xy=(4.5, cy), xytext=(3.05, cy),
                arrowprops=dict(arrowstyle='->', color='#EF4444', lw=3))
    ax.text(4.7, cy, 'F = 10 N', ha='left', va='center', fontsize=12,
            fontweight='bold', color='#EF4444')

    # Normal force ↑
    ax.annotate('', xy=(cx, 2.8), xytext=(cx, 1.6),
                arrowprops=dict(arrowstyle='->', color='#22C55E', lw=3))
    ax.text(cx + 0.15, 3.0, 'N', ha='left', va='bottom', fontsize=12,
            fontweight='bold', color='#22C55E')

    # Weight ↓
    ax.annotate('', xy=(cx, -1.3), xytext=(cx, 0.0),
                arrowprops=dict(arrowstyle='->', color='#8B5CF6', lw=3))
    ax.text(cx + 0.15, -1.5, 'W = mg', ha='left', va='top', fontsize=12,
            fontweight='bold', color='#8B5CF6')

    ax.set_xlim(-2.5, 6.5)
    ax.set_ylim(-2.5, 4)
    ax.set_title('Free-Body Diagram', fontsize=14, fontweight='bold', pad=10)
    ax.axis('off')

    save(fig, 'free-body-diagram-block.png')


# ═══════════════════════════════════════════════════════════════════
# 2. v2-db-002: Atwood machine — pulley with 2 kg and 3 kg masses
# ═══════════════════════════════════════════════════════════════════
def diagram_atwood():
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))
    ax.set_aspect('equal')

    # Support beam
    ax.hlines(5, 0, 6, colors='#444', linewidth=3)
    for x in np.arange(0, 6.1, 0.4):
        ax.plot([x, x - 0.2], [5, 5.25], color='#888', linewidth=0.8)

    # Pulley
    pulley = plt.Circle((3, 4.3), 0.5, facecolor='#E2E8F0', edgecolor='#334155', linewidth=2)
    ax.add_patch(pulley)
    ax.plot(3, 4.3, 'o', color='#334155', markersize=4)

    # Left string + mass (2 kg)
    ax.plot([2.5, 2.5], [4.3, 1.5], color='#334155', linewidth=1.5)
    left_mass = patches.FancyBboxPatch((1.8, 0.3), 1.4, 1.2, boxstyle="round,pad=0.05",
                                        facecolor='#3B82F6', edgecolor='#1E40AF', linewidth=2)
    ax.add_patch(left_mass)
    ax.text(2.5, 0.9, '2 kg', ha='center', va='center', fontsize=13,
            fontweight='bold', color='white')

    # Right string + mass (3 kg)
    ax.plot([3.5, 3.5], [4.3, 0.8], color='#334155', linewidth=1.5)
    right_mass = patches.FancyBboxPatch((2.8, -0.4), 1.4, 1.2, boxstyle="round,pad=0.05",
                                         facecolor='#EF4444', edgecolor='#B91C1C', linewidth=2)
    ax.add_patch(right_mass)
    ax.text(3.5, 0.2, '3 kg', ha='center', va='center', fontsize=13,
            fontweight='bold', color='white')

    # g label
    ax.text(5, 2.5, 'g = 10 m/s²', ha='center', va='center', fontsize=11,
            fontweight='bold', color='#64748B',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#F1F5F9', edgecolor='#CBD5E1'))

    ax.set_xlim(-0.5, 6.5)
    ax.set_ylim(-1.5, 6)
    ax.set_title('Atwood Machine', fontsize=14, fontweight='bold', pad=10)
    ax.axis('off')

    save(fig, 'atwood-machine.png')


# ═══════════════════════════════════════════════════════════════════
# 3. v2-db-003: Plant cell with part "X" pointing to central vacuole
# ═══════════════════════════════════════════════════════════════════
def diagram_plant_cell():
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))
    ax.set_aspect('equal')

    # Cell wall (outer rectangle)
    wall = patches.FancyBboxPatch((-3, -2.2), 6, 4.4, boxstyle="round,pad=0.15",
                                   facecolor='#F0FDF4', edgecolor='#166534', linewidth=3)
    ax.add_patch(wall)

    # Cell membrane (inner rectangle)
    membrane = patches.FancyBboxPatch((-2.7, -1.9), 5.4, 3.8, boxstyle="round,pad=0.15",
                                       facecolor='#DCFCE7', edgecolor='#16A34A', linewidth=1.5,
                                       linestyle='--')
    ax.add_patch(membrane)

    # Central vacuole (large — occupies most of the cell)
    vacuole = patches.Ellipse((0, 0), 3.8, 2.6, facecolor='#DBEAFE', edgecolor='#2563EB',
                               linewidth=2)
    ax.add_patch(vacuole)
    ax.text(0, 0, 'Central\nVacuole', ha='center', va='center', fontsize=10,
            color='#1E40AF', fontweight='bold')

    # Nucleus (small, upper-left)
    nucleus = plt.Circle((-1.8, 1.2), 0.45, facecolor='#FEF3C7', edgecolor='#D97706', linewidth=1.5)
    ax.add_patch(nucleus)
    nucleolus = plt.Circle((-1.8, 1.2), 0.15, facecolor='#F59E0B', edgecolor='#B45309', linewidth=1)
    ax.add_patch(nucleolus)
    ax.text(-1.8, 0.6, 'Nucleus', ha='center', fontsize=7, color='#92400E')

    # Chloroplasts (small green ovals, scattered around vacuole)
    for (cx, cy, angle) in [(1.8, 1.2, 30), (2.0, -0.8, -20), (-2.0, -1.0, 45), (1.5, -1.5, 10)]:
        chloro = patches.Ellipse((cx, cy), 0.6, 0.25, angle=angle,
                                  facecolor='#22C55E', edgecolor='#15803D', linewidth=1)
        ax.add_patch(chloro)

    # Mitochondria (small red-orange ovals)
    for (cx, cy, angle) in [(-1.5, -1.3, 60), (2.2, 0.5, -30)]:
        mito = patches.Ellipse((cx, cy), 0.5, 0.2, angle=angle,
                                facecolor='#FECACA', edgecolor='#DC2626', linewidth=1)
        ax.add_patch(mito)

    # Label "X" pointing to vacuole
    ax.annotate('X', xy=(0.5, 0.5), xytext=(3.5, 2.5),
                fontsize=22, fontweight='bold', color='#DC2626',
                arrowprops=dict(arrowstyle='->', color='#DC2626', lw=2.5),
                bbox=dict(boxstyle='round,pad=0.2', facecolor='white', edgecolor='#DC2626', linewidth=2))

    # Labels
    ax.text(-3.3, 0, 'Cell\nWall', ha='right', va='center', fontsize=8, color='#166534', fontweight='bold')

    ax.set_xlim(-4, 5)
    ax.set_ylim(-3, 3.5)
    ax.set_title('Plant Cell Diagram', fontsize=14, fontweight='bold', pad=10)
    ax.axis('off')

    save(fig, 'plant-cell-labeled.png')


# ═══════════════════════════════════════════════════════════════════
# 4. v2-db-004: Mitosis — Metaphase stage (chromosomes at equator)
# ═══════════════════════════════════════════════════════════════════
def diagram_mitosis_metaphase():
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))
    ax.set_aspect('equal')

    # Cell outline (elongating)
    cell = patches.Ellipse((0, 0), 5, 3.5, facecolor='#FFF7ED', edgecolor='#C2410C', linewidth=2)
    ax.add_patch(cell)

    # Centrioles / poles
    ax.plot(-2, 0, '*', color='#7C3AED', markersize=12)
    ax.plot(2, 0, '*', color='#7C3AED', markersize=12)
    ax.text(-2, -0.35, 'Pole', ha='center', fontsize=8, color='#7C3AED', fontweight='bold')
    ax.text(2, -0.35, 'Pole', ha='center', fontsize=8, color='#7C3AED', fontweight='bold')

    # Metaphase plate (vertical line at equator)
    ax.axvline(0, ymin=0.15, ymax=0.85, color='#94A3B8', linewidth=1, linestyle=':')
    ax.text(0, -2.0, 'Metaphase Plate', ha='center', fontsize=9, color='#64748B',
            fontweight='bold', fontstyle='italic')

    # Chromosomes at the equator (X shapes)
    chrom_positions = [0.9, 0.3, -0.3, -0.9]
    for y in chrom_positions:
        # Each chromosome as an X
        ax.plot([-0.15, 0.15], [y - 0.15, y + 0.15], color='#1E40AF', linewidth=3, solid_capstyle='round')
        ax.plot([-0.15, 0.15], [y + 0.15, y - 0.15], color='#1E40AF', linewidth=3, solid_capstyle='round')
        # Centromere dot
        ax.plot(0, y, 'o', color='#DC2626', markersize=4, zorder=5)

    # Spindle fibers from poles to centromeres
    for y in chrom_positions:
        ax.plot([-2, 0], [0, y], color='#A78BFA', linewidth=0.8, alpha=0.6)
        ax.plot([2, 0], [0, y], color='#A78BFA', linewidth=0.8, alpha=0.6)

    # Labels
    ax.annotate('Chromosomes\naligned at equator', xy=(0.2, 0.9), xytext=(1.5, 1.8),
                fontsize=9, fontweight='bold', color='#1E40AF',
                arrowprops=dict(arrowstyle='->', color='#1E40AF', lw=1.5))
    ax.annotate('Spindle\nfibers', xy=(-1, 0.4), xytext=(-2.5, 1.5),
                fontsize=9, fontweight='bold', color='#7C3AED',
                arrowprops=dict(arrowstyle='->', color='#7C3AED', lw=1.5))

    ax.set_xlim(-3.5, 3.5)
    ax.set_ylim(-2.5, 2.8)
    ax.set_title('Mitosis — Metaphase', fontsize=14, fontweight='bold', pad=10)
    ax.axis('off')

    save(fig, 'mitosis-metaphase.png')


# ═══════════════════════════════════════════════════════════════════
# Generate all 4
# ═══════════════════════════════════════════════════════════════════
if __name__ == '__main__':
    print(f"Generating 4 sample diagram PNGs → {OUT}/\n")
    diagram_free_body()
    diagram_atwood()
    diagram_plant_cell()
    diagram_mitosis_metaphase()
    print(f"\nDone! {len(list(OUT.glob('*.png')))} PNGs generated.")
