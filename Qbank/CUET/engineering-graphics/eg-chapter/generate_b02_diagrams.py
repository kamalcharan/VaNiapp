"""
Generate 4 diagram images for CUET EG B02 (Projection of Points and Lines).
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
# IMAGE 1 — Point Projections in 1st & 3rd Quadrant (Easy)
# Shows HP, VP, XY line, a point in Q1 and a point in Q3 with projectors
# =============================================================================
def draw_point_projections():
    fig, ax = plt.subplots(figsize=(7, 7))
    ax.set_xlim(-6, 6)
    ax.set_ylim(-6, 6)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # XY reference line
    ax.plot([-5.5, 5.5], [0, 0], 'k-', lw=2)
    ax.text(5.7, 0, 'X', fontsize=12, ha='left', va='center')
    ax.text(-5.7, 0, 'Y', fontsize=12, ha='right', va='center')

    # Labels for planes
    ax.text(4.5, 5, 'VP', fontsize=14, color='blue', ha='center', style='italic')
    ax.text(4.5, -5, 'HP', fontsize=14, color='green', ha='center', style='italic')

    # Quadrant labels
    ax.text(-4.5, 4, '2nd\nQuadrant', fontsize=8, ha='center', color='gray', alpha=0.6)
    ax.text(4.5, 4, '1st\nQuadrant', fontsize=8, ha='center', color='gray', alpha=0.6)
    ax.text(-4.5, -4, '3rd\nQuadrant', fontsize=8, ha='center', color='gray', alpha=0.6)
    ax.text(4.5, -4, '4th\nQuadrant', fontsize=8, ha='center', color='gray', alpha=0.6)

    # ── Point A in 1st Quadrant ──
    # A is 30mm above HP, 20mm in front of VP
    # Front view a' is above XY at height 30 (scaled)
    # Top view a is below XY at distance 20
    a_fv_y = 3.0   # a' (front view) above XY
    a_tv_y = -2.0   # a (top view) below XY
    a_x = -1.5      # x-position on drawing

    # Front view a'
    ax.plot(a_x, a_fv_y, 'ro', ms=8, zorder=5)
    ax.text(a_x + 0.3, a_fv_y + 0.3, "a'", fontsize=12, color='red', fontweight='bold')

    # Top view a
    ax.plot(a_x, a_tv_y, 'ro', ms=8, zorder=5)
    ax.text(a_x + 0.3, a_tv_y - 0.4, "a", fontsize=12, color='red', fontweight='bold')

    # Projector line
    ax.plot([a_x, a_x], [a_fv_y, a_tv_y], 'r--', lw=0.8)

    # Dimension lines for a'
    ax.annotate('', xy=(a_x - 1.2, a_fv_y), xytext=(a_x - 1.2, 0),
                arrowprops=dict(arrowstyle='<->', color='blue', lw=1))
    ax.text(a_x - 1.8, a_fv_y / 2, '30', fontsize=9, color='blue', ha='center')

    # Dimension lines for a
    ax.annotate('', xy=(a_x - 1.2, 0), xytext=(a_x - 1.2, a_tv_y),
                arrowprops=dict(arrowstyle='<->', color='green', lw=1))
    ax.text(a_x - 1.8, a_tv_y / 2, '20', fontsize=9, color='green', ha='center')

    # ── Point B in 3rd Quadrant ──
    # B is 25mm below HP, 35mm behind VP
    # Front view b' is below XY at distance 25
    # Top view b is above XY at distance 35
    b_fv_y = -2.5   # b' (front view) below XY
    b_tv_y = 3.5    # b (top view) above XY
    b_x = 2.5

    # Front view b'
    ax.plot(b_x, b_fv_y, 'bs', ms=8, zorder=5)
    ax.text(b_x + 0.3, b_fv_y - 0.4, "b'", fontsize=12, color='blue', fontweight='bold')

    # Top view b
    ax.plot(b_x, b_tv_y, 'bs', ms=8, zorder=5)
    ax.text(b_x + 0.3, b_tv_y + 0.3, "b", fontsize=12, color='blue', fontweight='bold')

    # Projector line
    ax.plot([b_x, b_x], [b_fv_y, b_tv_y], 'b--', lw=0.8)

    # Dimension lines for b'
    ax.annotate('', xy=(b_x + 1.2, 0), xytext=(b_x + 1.2, b_fv_y),
                arrowprops=dict(arrowstyle='<->', color='purple', lw=1))
    ax.text(b_x + 1.8, b_fv_y / 2, '25', fontsize=9, color='purple', ha='center')

    # Dimension lines for b
    ax.annotate('', xy=(b_x + 1.2, b_tv_y), xytext=(b_x + 1.2, 0),
                arrowprops=dict(arrowstyle='<->', color='orange', lw=1))
    ax.text(b_x + 1.8, b_tv_y / 2, '35', fontsize=9, color='orange', ha='center')

    # Title and legend
    ax.set_title('Projection of Points — 1st & 3rd Quadrant', fontsize=12, pad=12)
    ax.text(0, -5.5, "Point A: 30 mm above HP, 20 mm in front of VP (1st Q)\n"
                      "Point B: 25 mm below HP, 35 mm behind VP (3rd Q)",
            ha='center', fontsize=8, style='italic')

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-projections-21-point-projections.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-projections-21-point-projections.png")


# =============================================================================
# IMAGE 2 — Line inclined to HP, parallel to VP (Medium)
# Shows front view (true length & angle) and top view (shorter, parallel to XY)
# =============================================================================
def draw_line_inclined_hp():
    fig, ax = plt.subplots(figsize=(8, 6))
    ax.set_xlim(-6, 8)
    ax.set_ylim(-5, 5.5)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # XY line
    ax.plot([-5.5, 7.5], [0, 0], 'k-', lw=2)
    ax.text(7.7, 0, 'X', fontsize=11, va='center')
    ax.text(-5.7, 0, 'Y', fontsize=11, va='center')
    ax.text(-5, 2.5, 'VP (Front View)', fontsize=9, color='blue', style='italic')
    ax.text(-5, -2.5, 'HP (Top View)', fontsize=9, color='green', style='italic')

    # ── Front View (above XY) — shows TRUE length and TRUE angle ──
    # Line AB: TL = 60 mm, inclined at 30° to HP
    # a' at (0, 1), b' at angle 30°
    a_fv = np.array([0, 1.0])
    TL = 5.0  # scaled true length
    alpha = np.radians(30)
    b_fv = a_fv + TL * np.array([np.cos(alpha), np.sin(alpha)])

    ax.plot([a_fv[0], b_fv[0]], [a_fv[1], b_fv[1]], 'r-', lw=2.5, zorder=4)
    ax.plot(*a_fv, 'ro', ms=7, zorder=5)
    ax.plot(*b_fv, 'ro', ms=7, zorder=5)
    ax.text(a_fv[0] - 0.4, a_fv[1], "a'", fontsize=12, color='red',
            fontweight='bold', ha='right')
    ax.text(b_fv[0] + 0.3, b_fv[1], "b'", fontsize=12, color='red',
            fontweight='bold')

    # Show angle alpha
    angle_arc = np.linspace(0, alpha, 30)
    arc_r = 1.5
    ax.plot(a_fv[0] + arc_r * np.cos(angle_arc),
            a_fv[1] + arc_r * np.sin(angle_arc), 'r-', lw=1)
    ax.plot([a_fv[0], a_fv[0] + arc_r * 1.2], [a_fv[1], a_fv[1]], 'r:', lw=0.7)
    ax.text(a_fv[0] + 1.8, a_fv[1] + 0.4, 'α = 30°', fontsize=10, color='red')

    # Label TL
    mid_fv = (a_fv + b_fv) / 2
    ax.text(mid_fv[0] - 0.5, mid_fv[1] + 0.5, 'TL (a\'b\' = AB)',
            fontsize=9, color='red', rotation=30, ha='center')

    # ── Top View (below XY) — horizontal line (parallel to XY) ──
    a_tv = np.array([0, -2.0])
    b_tv = np.array([TL * np.cos(alpha), -2.0])  # horizontal projection

    ax.plot([a_tv[0], b_tv[0]], [a_tv[1], b_tv[1]], 'g-', lw=2.5, zorder=4)
    ax.plot(*a_tv, 'go', ms=7, zorder=5)
    ax.plot(*b_tv, 'go', ms=7, zorder=5)
    ax.text(a_tv[0] - 0.4, a_tv[1], "a", fontsize=12, color='green',
            fontweight='bold', ha='right')
    ax.text(b_tv[0] + 0.3, b_tv[1], "b", fontsize=12, color='green',
            fontweight='bold')

    # Label top view length
    mid_tv = (a_tv + b_tv) / 2
    ax.text(mid_tv[0], mid_tv[1] - 0.5, 'ab = TL × cos α',
            fontsize=9, color='green', ha='center')

    # Projector lines
    ax.plot([a_fv[0], a_tv[0]], [a_fv[1], a_tv[1]], 'k--', lw=0.5)
    ax.plot([b_fv[0], b_tv[0]], [b_fv[1], b_tv[1]], 'k--', lw=0.5)

    ax.set_title('Line Inclined to HP, Parallel to VP', fontsize=12, pad=10)
    ax.text(1, -4.2, "Front view shows TRUE LENGTH and TRUE ANGLE (α)\n"
                      "Top view is shorter (horizontal projection)",
            ha='center', fontsize=8, style='italic')

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-projections-22-line-inclined-hp.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-projections-22-line-inclined-hp.png")


# =============================================================================
# IMAGE 3 — Line inclined to both planes (Medium)
# Shows both views with apparent angles different from true angles
# =============================================================================
def draw_line_inclined_both():
    fig, ax = plt.subplots(figsize=(8, 7))
    ax.set_xlim(-6, 8)
    ax.set_ylim(-6, 6)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # XY line
    ax.plot([-5.5, 7.5], [0, 0], 'k-', lw=2)
    ax.text(7.7, 0, 'X', fontsize=11, va='center')
    ax.text(-5.7, 0, 'Y', fontsize=11, va='center')

    # Line inclined to both HP and VP
    # True: α=30° with HP, β=45° with VP, TL=60mm
    # Front view: a'b' shorter than TL, apparent angle α' > α
    # Top view: ab shorter than TL, apparent angle β' > β

    # ── Front view ──
    a_fv = np.array([0, 0.8])
    alpha_app = np.radians(42)  # apparent angle > true α=30°
    fv_len = 4.0  # apparent length < TL
    b_fv = a_fv + fv_len * np.array([np.cos(alpha_app), np.sin(alpha_app)])

    ax.plot([a_fv[0], b_fv[0]], [a_fv[1], b_fv[1]], 'r-', lw=2.5, zorder=4)
    ax.plot(*a_fv, 'ro', ms=7, zorder=5)
    ax.plot(*b_fv, 'ro', ms=7, zorder=5)
    ax.text(a_fv[0] - 0.4, a_fv[1], "a'", fontsize=12, color='red',
            fontweight='bold', ha='right')
    ax.text(b_fv[0] + 0.3, b_fv[1], "b'", fontsize=12, color='red',
            fontweight='bold')

    # Apparent angle α'
    arc_a = np.linspace(0, alpha_app, 30)
    ax.plot(a_fv[0] + 1.3 * np.cos(arc_a), a_fv[1] + 1.3 * np.sin(arc_a),
            'r-', lw=0.8)
    ax.plot([a_fv[0], a_fv[0] + 1.5], [a_fv[1], a_fv[1]], 'r:', lw=0.6)
    ax.text(a_fv[0] + 1.6, a_fv[1] + 0.5, "α'", fontsize=11, color='red')

    # Label
    mid_fv = (a_fv + b_fv) / 2
    ax.text(mid_fv[0] - 0.8, mid_fv[1] + 0.4, "a'b' < TL",
            fontsize=9, color='red', rotation=42)

    # ── Top view ──
    a_tv = np.array([0, -1.5])
    beta_app = np.radians(55)  # apparent angle > true β=45°
    tv_len = 3.5
    # Top view goes downward-right (below XY, measuring from XY)
    b_tv = a_tv + tv_len * np.array([np.cos(beta_app), -np.sin(beta_app)])

    ax.plot([a_tv[0], b_tv[0]], [a_tv[1], b_tv[1]], 'g-', lw=2.5, zorder=4)
    ax.plot(*a_tv, 'go', ms=7, zorder=5)
    ax.plot(*b_tv, 'go', ms=7, zorder=5)
    ax.text(a_tv[0] - 0.4, a_tv[1], "a", fontsize=12, color='green',
            fontweight='bold', ha='right')
    ax.text(b_tv[0] + 0.3, b_tv[1], "b", fontsize=12, color='green',
            fontweight='bold')

    # Apparent angle β'
    arc_b = np.linspace(0, -beta_app, 30)
    ax.plot(a_tv[0] + 1.3 * np.cos(arc_b), a_tv[1] + 1.3 * np.sin(arc_b),
            'g-', lw=0.8)
    ax.plot([a_tv[0], a_tv[0] + 1.5], [a_tv[1], a_tv[1]], 'g:', lw=0.6)
    ax.text(a_tv[0] + 1.5, a_tv[1] - 0.5, "β'", fontsize=11, color='green')

    mid_tv = (a_tv + b_tv) / 2
    ax.text(mid_tv[0] + 0.6, mid_tv[1], "ab < TL",
            fontsize=9, color='green', rotation=-55)

    # Projector lines
    ax.plot([a_fv[0], a_tv[0]], [0.2, -0.2], 'k--', lw=0.5)
    ax.plot([b_fv[0], b_tv[0]], [0.2, -0.2], 'k--', lw=0.5)

    # Key note
    ax.text(1, -5.3,
            "When a line is inclined to BOTH HP and VP:\n"
            "• Neither view shows true length (TL)\n"
            "• Apparent angles α' > α and β' > β",
            ha='center', fontsize=8, style='italic',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    ax.set_title('Line Inclined to Both HP and VP', fontsize=12, pad=10)
    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-projections-23-line-both-planes.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-projections-23-line-both-planes.png")


# =============================================================================
# IMAGE 4 — True Length by Rotation Method (Hard)
# Shows front view, top view, and rotation construction
# =============================================================================
def draw_true_length_rotation():
    fig, ax = plt.subplots(figsize=(9, 7))
    ax.set_xlim(-5, 9)
    ax.set_ylim(-6.5, 6)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # XY line
    ax.plot([-4.5, 8.5], [0, 0], 'k-', lw=2)
    ax.text(8.7, 0, 'X', fontsize=11, va='center')
    ax.text(-4.7, 0, 'Y', fontsize=11, va='center')

    # ── Original Front View a'b' ──
    a_fv = np.array([1.0, 1.0])
    b_fv = np.array([4.5, 3.5])
    ax.plot([a_fv[0], b_fv[0]], [a_fv[1], b_fv[1]], 'r-', lw=2, zorder=4)
    ax.plot(*a_fv, 'ro', ms=6, zorder=5)
    ax.plot(*b_fv, 'ro', ms=6, zorder=5)
    ax.text(a_fv[0] - 0.4, a_fv[1], "a'", fontsize=11, color='red',
            fontweight='bold', ha='right')
    ax.text(b_fv[0] + 0.3, b_fv[1], "b'", fontsize=11, color='red',
            fontweight='bold')

    # ── Original Top View ab ──
    a_tv = np.array([1.0, -1.5])
    b_tv = np.array([4.5, -3.8])
    ax.plot([a_tv[0], b_tv[0]], [a_tv[1], b_tv[1]], 'g-', lw=2, zorder=4)
    ax.plot(*a_tv, 'go', ms=6, zorder=5)
    ax.plot(*b_tv, 'go', ms=6, zorder=5)
    ax.text(a_tv[0] - 0.4, a_tv[1], "a", fontsize=11, color='green',
            fontweight='bold', ha='right')
    ax.text(b_tv[0] + 0.3, b_tv[1], "b", fontsize=11, color='green',
            fontweight='bold')

    # Projector lines
    ax.plot([a_fv[0], a_tv[0]], [a_fv[1], a_tv[1]], 'k--', lw=0.4)
    ax.plot([b_fv[0], b_tv[0]], [b_fv[1], b_tv[1]], 'k--', lw=0.4)

    # ── Rotation of top view to make it parallel to XY ──
    # Rotate b about a to get b1 such that ab1 is parallel to XY
    tv_len = np.linalg.norm(b_tv - a_tv)
    b1_tv = np.array([a_tv[0] + tv_len, a_tv[1]])  # rotated to horizontal

    # Arc showing rotation
    ang_orig = np.arctan2(b_tv[1] - a_tv[1], b_tv[0] - a_tv[0])
    ang_new = 0  # horizontal
    arc_angles = np.linspace(ang_orig, ang_new, 40)
    ax.plot(a_tv[0] + tv_len * np.cos(arc_angles),
            a_tv[1] + tv_len * np.sin(arc_angles),
            'g--', lw=1, alpha=0.6)

    ax.plot([a_tv[0], b1_tv[0]], [a_tv[1], b1_tv[1]], 'g:', lw=1.5, zorder=3)
    ax.plot(*b1_tv, 'g^', ms=7, zorder=5)
    ax.text(b1_tv[0] + 0.3, b1_tv[1] - 0.4, "b₁", fontsize=11,
            color='green', fontweight='bold')

    # ── New front view gives TRUE LENGTH ──
    # Projector from b1 up; a' stays; new b1' at same height diff + horizontal
    b1_fv_x = b1_tv[0]
    b1_fv_y = b_fv[1]  # same height as original b'
    b1_fv = np.array([b1_fv_x, b1_fv_y])

    ax.plot([a_fv[0], b1_fv[0]], [a_fv[1], b1_fv[1]], 'm-', lw=2.5, zorder=4)
    ax.plot(*b1_fv, 'm^', ms=7, zorder=5)
    ax.text(b1_fv[0] + 0.3, b1_fv[1] + 0.3, "b₁'", fontsize=11,
            color='purple', fontweight='bold')

    # Projector from b1_tv to b1_fv
    ax.plot([b1_tv[0], b1_fv[0]], [b1_tv[1], b1_fv[1]], 'k--', lw=0.4)

    # Horizontal from b_fv to b1_fv
    ax.plot([b_fv[0], b1_fv[0]], [b_fv[1], b1_fv[1]], 'm:', lw=0.8)

    # Label TRUE LENGTH
    tl = np.linalg.norm(b1_fv - a_fv)
    mid_tl = (a_fv + b1_fv) / 2
    angle_tl = np.degrees(np.arctan2(b1_fv[1] - a_fv[1], b1_fv[0] - a_fv[0]))
    ax.text(mid_tl[0], mid_tl[1] + 0.5, "TRUE LENGTH (TL)",
            fontsize=10, color='purple', fontweight='bold',
            rotation=angle_tl, ha='center')

    # Show true angle α
    alpha_true = np.arctan2(b1_fv[1] - a_fv[1], b1_fv[0] - a_fv[0])
    arc_alpha = np.linspace(0, alpha_true, 30)
    ax.plot(a_fv[0] + 1.5 * np.cos(arc_alpha),
            a_fv[1] + 1.5 * np.sin(arc_alpha), 'm-', lw=1)
    ax.plot([a_fv[0], a_fv[0] + 2], [a_fv[1], a_fv[1]], 'm:', lw=0.6)
    ax.text(a_fv[0] + 2.0, a_fv[1] + 0.3, 'α (true)', fontsize=9, color='purple')

    ax.set_title('Finding True Length by Rotation Method', fontsize=12, pad=10)
    ax.text(3, -5.8,
            "Step: Rotate top view (ab) about a until parallel to XY → ab₁\n"
            "New front view a'b₁' gives TRUE LENGTH and true angle α",
            ha='center', fontsize=8, style='italic',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-projections-24-true-length-rotation.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-projections-24-true-length-rotation.png")


if __name__ == "__main__":
    print("Generating EG B02 diagram images...")
    draw_point_projections()
    draw_line_inclined_hp()
    draw_line_inclined_both()
    draw_true_length_rotation()
    print("Done! 4 images saved to", OUT)
