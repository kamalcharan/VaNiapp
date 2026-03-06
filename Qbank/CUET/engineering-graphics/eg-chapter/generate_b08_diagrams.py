"""
Generate 4 diagram images for CUET EG B08 (Orthographic Projection).
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
os.makedirs(OUT, exist_ok=True)

plt.rcParams.update({
    'font.size': 11,
    'font.family': 'serif',
    'axes.linewidth': 1.2,
    'figure.dpi': 180,
})


# =============================================================================
# IMAGE 1 — First Angle vs Third Angle Projection Symbols (Easy)
# =============================================================================
def draw_projection_symbols():
    fig, axes = plt.subplots(1, 2, figsize=(13, 5.5))
    fig.patch.set_facecolor('white')

    # ── Left: First Angle ──
    ax = axes[0]
    ax.set_xlim(-1, 7)
    ax.set_ylim(-1, 5)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('First Angle Projection', fontsize=12, pad=10, fontweight='bold', color='blue')

    # Symbol: truncated cone with circle on right
    # Cone (side view = trapezoid)
    trap_x = [1, 3, 3, 1, 1]
    trap_y = [1, 0.5, 3.5, 3, 1]
    ax.fill(trap_x, trap_y, color='#c0d8ff', alpha=0.5)
    ax.plot(trap_x, trap_y, 'b-', lw=2)

    # Center lines
    ax.plot([0.5, 3.5], [2, 2], 'k-.', lw=0.5)

    # Circle (end view) on the RIGHT
    circle = plt.Circle((5, 2), 1.2, fill=False, edgecolor='blue', lw=2)
    ax.add_patch(circle)
    # Inner circle (smaller end)
    circle_inner = plt.Circle((5, 2), 0.6, fill=False, edgecolor='blue', lw=1.5, ls='--')
    ax.add_patch(circle_inner)
    ax.plot([3.8, 6.2], [2, 2], 'k-.', lw=0.5)
    ax.plot([5, 5], [0.5, 3.5], 'k-.', lw=0.5)

    ax.text(3, -0.5, 'FV', fontsize=10, color='blue', ha='center', fontweight='bold')
    ax.text(5, -0.5, 'LSV', fontsize=10, color='blue', ha='center', fontweight='bold')

    ax.text(3, 4.3,
            "Object between observer and plane\n"
            "FV on left, side view on RIGHT",
            ha='center', fontsize=8, style='italic',
            bbox=dict(boxstyle='round,pad=0.2', facecolor='#e0e8ff', alpha=0.8))

    # ── Right: Third Angle ──
    ax2 = axes[1]
    ax2.set_xlim(-1, 7)
    ax2.set_ylim(-1, 5)
    ax2.set_aspect('equal')
    ax2.axis('off')
    ax2.set_title('Third Angle Projection', fontsize=12, pad=10, fontweight='bold', color='red')

    # Same cone
    trap_x2 = [3, 5, 5, 3, 3]
    trap_y2 = [1, 0.5, 3.5, 3, 1]
    ax2.fill(trap_x2, trap_y2, color='#ffe0e0', alpha=0.5)
    ax2.plot(trap_x2, trap_y2, 'r-', lw=2)

    ax2.plot([2.5, 5.5], [2, 2], 'k-.', lw=0.5)

    # Circle on the LEFT
    circle2 = plt.Circle((1, 2), 1.2, fill=False, edgecolor='red', lw=2)
    ax2.add_patch(circle2)
    circle2_inner = plt.Circle((1, 2), 0.6, fill=False, edgecolor='red', lw=1.5, ls='--')
    ax2.add_patch(circle2_inner)
    ax2.plot([-0.5, 2.5], [2, 2], 'k-.', lw=0.5)
    ax2.plot([1, 1], [0.5, 3.5], 'k-.', lw=0.5)

    ax2.text(1, -0.5, 'LSV', fontsize=10, color='red', ha='center', fontweight='bold')
    ax2.text(4, -0.5, 'FV', fontsize=10, color='red', ha='center', fontweight='bold')

    ax2.text(3, 4.3,
             "Plane between observer and object\n"
             "FV on right, side view on LEFT",
             ha='center', fontsize=8, style='italic',
             bbox=dict(boxstyle='round,pad=0.2', facecolor='#ffe8e0', alpha=0.8))

    fig.suptitle('First Angle vs Third Angle Projection Symbols', fontsize=13, y=0.98)
    fig.tight_layout(rect=[0, 0, 1, 0.93])
    fig.savefig(os.path.join(OUT, "cuet-eg-orthographic-81-angle-symbols.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-orthographic-81-angle-symbols.png")


# =============================================================================
# IMAGE 2 — Three Views of an L-shaped Block (Medium)
# =============================================================================
def draw_three_views():
    fig, axes = plt.subplots(2, 2, figsize=(11, 10))
    fig.patch.set_facecolor('white')

    # Layout: [FV | SV]
    #         [TV | blank/3D]

    # L-shaped block: base 40×30×10, step on left: 20×30×20

    # ── Front View (top-left) ──
    ax_fv = axes[0][0]
    ax_fv.set_xlim(-5, 50)
    ax_fv.set_ylim(-5, 35)
    ax_fv.set_aspect('equal')
    ax_fv.axis('off')
    ax_fv.set_title('Front View (FV)', fontsize=11, color='blue', fontweight='bold')

    # L-shape in front view
    fv_x = [0, 40, 40, 20, 20, 0, 0]
    fv_y = [0, 0, 10, 10, 30, 30, 0]
    ax_fv.fill(fv_x, fv_y, color='#e0e8ff', alpha=0.5)
    ax_fv.plot(fv_x, fv_y, 'b-', lw=2)

    # Dimensions
    ax_fv.annotate('', xy=(40, -3), xytext=(0, -3),
                   arrowprops=dict(arrowstyle='<->', color='gray', lw=0.8))
    ax_fv.text(20, -4.5, '40', fontsize=9, ha='center', color='gray')

    ax_fv.annotate('', xy=(43, 10), xytext=(43, 0),
                   arrowprops=dict(arrowstyle='<->', color='gray', lw=0.8))
    ax_fv.text(46, 5, '10', fontsize=8, color='gray')

    ax_fv.annotate('', xy=(-3, 30), xytext=(-3, 0),
                   arrowprops=dict(arrowstyle='<->', color='gray', lw=0.8))
    ax_fv.text(-5, 15, '30', fontsize=8, color='gray', ha='right')

    ax_fv.annotate('', xy=(20, 32), xytext=(0, 32),
                   arrowprops=dict(arrowstyle='<->', color='gray', lw=0.8))
    ax_fv.text(10, 33, '20', fontsize=8, ha='center', color='gray')

    # ── Side View (top-right) ──
    ax_sv = axes[0][1]
    ax_sv.set_xlim(-5, 40)
    ax_sv.set_ylim(-5, 35)
    ax_sv.set_aspect('equal')
    ax_sv.axis('off')
    ax_sv.set_title('Right Side View (RSV)', fontsize=11, color='green', fontweight='bold')

    # Side view of L-block (rectangle showing depth × height)
    # From right side: shows full height profile
    sv_x = [0, 30, 30, 0, 0]
    sv_y = [0, 0, 10, 10, 0]
    ax_sv.fill(sv_x, sv_y, color='#e0ffe0', alpha=0.5)
    ax_sv.plot(sv_x, sv_y, 'g-', lw=2)

    # Upper step (visible from side)
    sv2_x = [0, 30, 30, 0, 0]
    sv2_y = [10, 10, 30, 30, 10]
    ax_sv.fill(sv2_x, sv2_y, color='#e0ffe0', alpha=0.5)
    ax_sv.plot(sv2_x, sv2_y, 'g-', lw=2)

    ax_sv.annotate('', xy=(30, -3), xytext=(0, -3),
                   arrowprops=dict(arrowstyle='<->', color='gray', lw=0.8))
    ax_sv.text(15, -4.5, '30', fontsize=9, ha='center', color='gray')

    ax_sv.annotate('', xy=(33, 30), xytext=(33, 0),
                   arrowprops=dict(arrowstyle='<->', color='gray', lw=0.8))
    ax_sv.text(36, 15, '30', fontsize=8, color='gray')

    # ── Top View (bottom-left) ──
    ax_tv = axes[1][0]
    ax_tv.set_xlim(-5, 50)
    ax_tv.set_ylim(-5, 40)
    ax_tv.set_aspect('equal')
    ax_tv.axis('off')
    ax_tv.set_title('Top View (TV)', fontsize=11, color='red', fontweight='bold')

    # Top view: full rectangle (40 × 30)
    tv_x = [0, 40, 40, 0, 0]
    tv_y = [0, 0, 30, 30, 0]
    ax_tv.fill(tv_x, tv_y, color='#ffe0e0', alpha=0.5)
    ax_tv.plot(tv_x, tv_y, 'r-', lw=2)

    # Hidden line showing step boundary
    ax_tv.plot([20, 20], [0, 30], 'r--', lw=1.5)

    ax_tv.annotate('', xy=(40, -3), xytext=(0, -3),
                   arrowprops=dict(arrowstyle='<->', color='gray', lw=0.8))
    ax_tv.text(20, -4.5, '40', fontsize=9, ha='center', color='gray')

    ax_tv.annotate('', xy=(43, 30), xytext=(43, 0),
                   arrowprops=dict(arrowstyle='<->', color='gray', lw=0.8))
    ax_tv.text(46, 15, '30', fontsize=8, color='gray')

    ax_tv.text(10, 15, 'Step\nboundary\n(hidden)', fontsize=7, ha='center', color='red', style='italic')

    # ── 3D sketch (bottom-right) ──
    ax3d = axes[1][1]
    ax3d.set_xlim(-2, 8)
    ax3d.set_ylim(-1, 7)
    ax3d.set_aspect('equal')
    ax3d.axis('off')
    ax3d.set_title('3D Reference', fontsize=11, color='purple', fontweight='bold')

    COS30 = np.cos(np.radians(30))
    SIN30 = np.sin(np.radians(30))

    def iso(x, y, z, o=(2, 0)):
        return o[0] + x*COS30*0.08 - y*COS30*0.08, o[1] + x*SIN30*0.08 + y*SIN30*0.08 + z*0.08

    # Base block
    pts_base = {
        'A': iso(0,0,0), 'B': iso(40,0,0), 'C': iso(40,30,0), 'D': iso(0,30,0),
        'E': iso(0,0,10), 'F': iso(40,0,10), 'G': iso(40,30,10), 'H': iso(0,30,10),
    }
    # Step block
    pts_step = {
        'I': iso(0,0,10), 'J': iso(20,0,10), 'K': iso(20,30,10), 'L': iso(0,30,10),
        'M': iso(0,0,30), 'N': iso(20,0,30), 'O': iso(20,30,30), 'P': iso(0,30,30),
    }

    # Draw base faces
    for edges in [('A','B'),('B','C'),('B','F'),('F','G'),('C','G'),
                  ('E','F'),('F','G'),('J','N'),('N','O'),('K','O'),
                  ('M','N'),('M','P'),('P','O'),
                  ('A','E'),('J','K'),('I','M'),('K','O')]:
        p1, p2 = edges
        if p1 in pts_base:
            pt1 = pts_base[p1]
        else:
            pt1 = pts_step[p1]
        if p2 in pts_base:
            pt2 = pts_base[p2]
        else:
            pt2 = pts_step[p2]
        ax3d.plot([pt1[0], pt2[0]], [pt1[1], pt2[1]], 'purple', lw=1.2)

    # Hidden edges
    for edges in [('A','D'),('D','C'),('D','H'),('H','L')]:
        p1, p2 = edges
        pt1 = pts_base.get(p1, pts_step.get(p1))
        pt2 = pts_base.get(p2, pts_step.get(p2))
        ax3d.plot([pt1[0], pt2[0]], [pt1[1], pt2[1]], 'purple', lw=0.5, ls='--')

    ax3d.text(3, -0.5, 'L-shaped block', fontsize=8, color='purple', ha='center', style='italic')

    fig.suptitle('Three Views of an L-shaped Block (First Angle)', fontsize=13, y=0.99)
    fig.tight_layout(rect=[0, 0, 1, 0.96])
    fig.savefig(os.path.join(OUT, "cuet-eg-orthographic-82-three-views.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-orthographic-82-three-views.png")


# =============================================================================
# IMAGE 3 — Projection Planes and Quadrants (Easy/Medium)
# =============================================================================
def draw_quadrants():
    fig, ax = plt.subplots(figsize=(9, 7))
    ax.set_xlim(-5, 5)
    ax.set_ylim(-4, 5)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # HP (horizontal)
    ax.plot([-4, 4], [0, 0], 'k-', lw=2.5)
    ax.text(4.3, 0, 'HP', fontsize=11, fontweight='bold', va='center')

    # VP (vertical)
    ax.plot([0, 0], [-3.5, 4], 'k-', lw=2.5)
    ax.text(0.3, 4.2, 'VP', fontsize=11, fontweight='bold')

    # Quadrant labels
    ax.text(2, 2.5, 'I Quadrant', fontsize=12, ha='center', color='blue',
            fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#c0d8ff', alpha=0.6))
    ax.text(-2, 2.5, 'II Quadrant', fontsize=12, ha='center', color='green',
            fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#c0ffc0', alpha=0.6))
    ax.text(-2, -2, 'III Quadrant', fontsize=12, ha='center', color='red',
            fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#ffc0c0', alpha=0.6))
    ax.text(2, -2, 'IV Quadrant', fontsize=12, ha='center', color='purple',
            fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#e0c0ff', alpha=0.6))

    # Descriptions
    ax.text(2, 1.5, 'Above HP, In front of VP\n(First Angle Projection)',
            fontsize=7, ha='center', color='blue', style='italic')
    ax.text(-2, 1.5, 'Above HP, Behind VP',
            fontsize=7, ha='center', color='green', style='italic')
    ax.text(-2, -2.8, 'Below HP, Behind VP\n(Third Angle Projection)',
            fontsize=7, ha='center', color='red', style='italic')
    ax.text(2, -2.8, 'Below HP, In front of VP',
            fontsize=7, ha='center', color='purple', style='italic')

    # XY line label
    ax.text(4.3, -0.3, 'XY (Reference)', fontsize=8, color='gray')

    # Observer arrow (from top-right)
    ax.annotate('Observer', xy=(1.5, 1), xytext=(3.5, 3.5),
                fontsize=9, color='navy',
                arrowprops=dict(arrowstyle='->', color='navy', lw=1.5))

    ax.set_title('Reference Planes and Four Quadrants', fontsize=13, pad=10)
    ax.text(0, -3.8,
            "First Angle: Object in I quadrant (above HP, in front of VP)\n"
            "Third Angle: Object in III quadrant (below HP, behind VP)",
            ha='center', fontsize=8, style='italic',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-orthographic-83-quadrants.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-orthographic-83-quadrants.png")


# =============================================================================
# IMAGE 4 — Six Principal Views Layout (Hard)
# =============================================================================
def draw_six_views():
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(-1, 16)
    ax.set_ylim(-1, 12)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # Layout for first angle (standard):
    #        [Top View]
    # [LSV] [Front View] [RSV] [Back View]
    #        [Bottom View]

    w, h = 3, 2.5  # box size
    gap = 0.3

    positions = {
        'TV':   (4+gap, 5+gap),
        'LSV':  (0, 2.5),
        'FV':   (4+gap, 2.5),
        'RSV':  (8+2*gap, 2.5),
        'BV':   (12+3*gap, 2.5),
        'BtV':  (4+gap, 0-gap),
    }

    colors = {
        'TV': '#ffe0e0', 'LSV': '#e0ffe0', 'FV': '#c0d8ff',
        'RSV': '#e0e0ff', 'BV': '#fff0e0', 'BtV': '#f0e0ff',
    }

    labels = {
        'TV': 'Top View', 'LSV': 'Left Side\nView', 'FV': 'Front View',
        'RSV': 'Right Side\nView', 'BV': 'Back View', 'BtV': 'Bottom View',
    }

    for name, (x, y) in positions.items():
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0.1',
                                        facecolor=colors[name], edgecolor='black', lw=1.5)
        ax.add_patch(rect)
        ax.text(x+w/2, y+h/2, labels[name], fontsize=9, ha='center', va='center',
                fontweight='bold')

    # Arrows showing projection relationships
    # FV → TV (up)
    ax.annotate('', xy=(4+gap+w/2, 5+gap), xytext=(4+gap+w/2, 2.5+h),
                arrowprops=dict(arrowstyle='<->', color='gray', lw=1))
    # FV → BtV (down)
    ax.annotate('', xy=(4+gap+w/2, 0-gap+h), xytext=(4+gap+w/2, 2.5),
                arrowprops=dict(arrowstyle='<->', color='gray', lw=1))
    # FV → LSV (left)
    ax.annotate('', xy=(w, 2.5+h/2), xytext=(4+gap, 2.5+h/2),
                arrowprops=dict(arrowstyle='<->', color='gray', lw=1))
    # FV → RSV (right)
    ax.annotate('', xy=(8+2*gap, 2.5+h/2), xytext=(4+gap+w, 2.5+h/2),
                arrowprops=dict(arrowstyle='<->', color='gray', lw=1))
    # RSV → BV (right)
    ax.annotate('', xy=(12+3*gap, 2.5+h/2), xytext=(8+2*gap+w, 2.5+h/2),
                arrowprops=dict(arrowstyle='<->', color='gray', lw=1))

    ax.set_title('Six Principal Views (First Angle Projection Layout)', fontsize=13, pad=10)
    ax.text(8, -0.5,
            "FV is the principal view. All others are projected from it.\n"
            "First Angle: TV below FV, RSV to left of FV.\n"
            "Third Angle: TV above FV, RSV to right of FV.",
            ha='center', fontsize=8, style='italic',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-orthographic-84-six-views.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-orthographic-84-six-views.png")


if __name__ == "__main__":
    print("Generating EG B08 diagram images...")
    draw_projection_symbols()
    draw_three_views()
    draw_quadrants()
    draw_six_views()
    print("Done! 4 images saved to", OUT)
