"""
Generate 4 diagram images for CUET EG B03 (Projection of Planes).
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
# IMAGE 1 — Plane perpendicular to VP and inclined to HP (Easy/Medium)
# Shows a rectangular plane with front view as a line and top view as a shape
# =============================================================================
def draw_plane_perp_vp_inclined_hp():
    fig, ax = plt.subplots(figsize=(8, 7))
    ax.set_xlim(-5, 9)
    ax.set_ylim(-6.5, 6)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # XY line
    ax.plot([-4.5, 8.5], [0, 0], 'k-', lw=2)
    ax.text(8.7, 0, 'X', fontsize=11, va='center')
    ax.text(-4.7, 0, 'Y', fontsize=11, va='center')
    ax.text(-3.5, 3, 'VP (Front View)', fontsize=9, color='blue', style='italic')
    ax.text(-3.5, -3, 'HP (Top View)', fontsize=9, color='green', style='italic')

    # Front view: a line inclined at θ to XY (since plane is ⊥ VP)
    # Plane inclined at 45° to HP
    theta = np.radians(45)
    fv_len = 4.0  # edge-view length
    a_fv = np.array([1.5, 0.8])
    b_fv = a_fv + fv_len * np.array([np.cos(theta), np.sin(theta)])

    ax.plot([a_fv[0], b_fv[0]], [a_fv[1], b_fv[1]], 'r-', lw=3, zorder=4)
    ax.plot(*a_fv, 'ro', ms=6, zorder=5)
    ax.plot(*b_fv, 'ro', ms=6, zorder=5)
    ax.text(a_fv[0] - 0.4, a_fv[1] + 0.2, "a'", fontsize=11, color='red',
            fontweight='bold', ha='right')
    ax.text(b_fv[0] - 0.1, b_fv[1] + 0.3, "b'", fontsize=11, color='red',
            fontweight='bold')
    ax.text(a_fv[0] + 0.7, a_fv[1] - 0.1, "c'", fontsize=11, color='red',
            fontweight='bold')
    ax.text(b_fv[0] + 0.5, b_fv[1] - 0.1, "d'", fontsize=11, color='red',
            fontweight='bold')

    # The front view of a rectangular plane ⊥ VP appears as a LINE (edge view)
    # Label "Edge View"
    mid = (a_fv + b_fv) / 2
    ax.text(mid[0] - 1.2, mid[1] + 0.8, 'Edge View\n(Front View)',
            fontsize=9, color='red', ha='center',
            bbox=dict(boxstyle='round,pad=0.2', facecolor='lightyellow', alpha=0.8))

    # Show angle θ
    arc_ang = np.linspace(0, theta, 30)
    ax.plot(a_fv[0] + 1.3 * np.cos(arc_ang),
            a_fv[1] + 1.3 * np.sin(arc_ang), 'r-', lw=1)
    ax.plot([a_fv[0], a_fv[0] + 1.8], [a_fv[1], a_fv[1]], 'r:', lw=0.6)
    ax.text(a_fv[0] + 1.8, a_fv[1] + 0.4, 'θ = 45°', fontsize=10, color='red')

    # Top view: actual shape (rectangle) visible
    # Since plane is ⊥ VP, the top view shows the TRUE SHAPE when plane is also ∥ HP
    # But here inclined to HP, so top view is foreshortened
    # Top view is a rectangle narrower than true shape
    tv_w = fv_len * np.cos(theta)  # projected width along depth
    tv_d = 2.5  # breadth of rectangle (perpendicular to inclination)

    a_tv = np.array([1.5, -1.5])
    b_tv = np.array([1.5 + tv_w, -1.5])
    c_tv = np.array([1.5, -1.5 - tv_d])
    d_tv = np.array([1.5 + tv_w, -1.5 - tv_d])

    rect_x = [a_tv[0], b_tv[0], d_tv[0], c_tv[0], a_tv[0]]
    rect_y = [a_tv[1], b_tv[1], d_tv[1], c_tv[1], a_tv[1]]
    ax.fill(rect_x, rect_y, color='lightgreen', alpha=0.3, zorder=3)
    ax.plot(rect_x, rect_y, 'g-', lw=2, zorder=4)

    ax.text(a_tv[0] - 0.3, a_tv[1] + 0.2, "a", fontsize=11, color='green', fontweight='bold')
    ax.text(b_tv[0] + 0.2, b_tv[1] + 0.2, "b", fontsize=11, color='green', fontweight='bold')
    ax.text(c_tv[0] - 0.3, c_tv[1] - 0.3, "c", fontsize=11, color='green', fontweight='bold')
    ax.text(d_tv[0] + 0.2, d_tv[1] - 0.3, "d", fontsize=11, color='green', fontweight='bold')

    # Label
    mid_tv = (a_tv + d_tv) / 2
    ax.text(mid_tv[0], mid_tv[1], 'Top View\n(Foreshortened)',
            fontsize=9, color='green', ha='center',
            bbox=dict(boxstyle='round,pad=0.2', facecolor='lightyellow', alpha=0.8))

    # Projector lines
    ax.plot([a_fv[0], a_tv[0]], [0.2, -0.2], 'k--', lw=0.4)
    ax.plot([b_fv[0], b_tv[0]], [0.2, -0.2], 'k--', lw=0.4)

    ax.set_title('Plane Perpendicular to VP, Inclined at 45° to HP', fontsize=12, pad=10)
    ax.text(3, -5.8,
            "When a plane is ⊥ to VP: Front view = edge (line)\n"
            "The true angle of inclination (θ) with HP is seen in the front view",
            ha='center', fontsize=8, style='italic',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-planes-31-perp-vp-inclined-hp.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-planes-31-perp-vp-inclined-hp.png")


# =============================================================================
# IMAGE 2 — Plane parallel to HP (Easy)
# Front view: line on/parallel to XY; Top view: true shape
# =============================================================================
def draw_plane_parallel_hp():
    fig, ax = plt.subplots(figsize=(8, 6.5))
    ax.set_xlim(-5, 9)
    ax.set_ylim(-7, 5.5)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # XY line
    ax.plot([-4.5, 8.5], [0, 0], 'k-', lw=2)
    ax.text(8.7, 0, 'X', fontsize=11, va='center')
    ax.text(-4.7, 0, 'Y', fontsize=11, va='center')

    # Front view: horizontal line parallel to XY at height h
    h = 2.0  # 20mm above HP
    fv_len = 4.0
    a_fv = np.array([1.0, h])
    b_fv = np.array([1.0 + fv_len, h])

    ax.plot([a_fv[0], b_fv[0]], [a_fv[1], b_fv[1]], 'r-', lw=3, zorder=4)
    ax.plot(*a_fv, 'ro', ms=6, zorder=5)
    ax.plot(*b_fv, 'ro', ms=6, zorder=5)
    ax.text(a_fv[0] - 0.4, a_fv[1] + 0.3, "a'b'", fontsize=11, color='red', fontweight='bold')
    ax.text(b_fv[0] + 0.2, b_fv[1] + 0.3, "c'd'", fontsize=11, color='red', fontweight='bold')

    # Label edge view
    ax.text((a_fv[0] + b_fv[0]) / 2, h + 0.7, 'Front View (Line ∥ to XY)',
            fontsize=9, color='red', ha='center',
            bbox=dict(boxstyle='round,pad=0.2', facecolor='lightyellow', alpha=0.8))

    # Height dimension
    ax.annotate('', xy=(-0.5, h), xytext=(-0.5, 0),
                arrowprops=dict(arrowstyle='<->', color='purple', lw=1))
    ax.text(-1.2, h / 2, 'h', fontsize=11, color='purple', ha='center')

    # Top view: TRUE SHAPE (rectangle)
    tv_w = 4.0
    tv_d = 2.5
    a_tv = np.array([1.0, -1.5])
    b_tv = np.array([1.0 + tv_w, -1.5])
    c_tv = np.array([1.0, -1.5 - tv_d])
    d_tv = np.array([1.0 + tv_w, -1.5 - tv_d])

    rect_x = [a_tv[0], b_tv[0], d_tv[0], c_tv[0], a_tv[0]]
    rect_y = [a_tv[1], b_tv[1], d_tv[1], c_tv[1], a_tv[1]]
    ax.fill(rect_x, rect_y, color='lightgreen', alpha=0.4, zorder=3)
    ax.plot(rect_x, rect_y, 'g-', lw=2, zorder=4)

    ax.text(a_tv[0] - 0.3, a_tv[1] + 0.2, "a", fontsize=11, color='green', fontweight='bold')
    ax.text(b_tv[0] + 0.2, b_tv[1] + 0.2, "c", fontsize=11, color='green', fontweight='bold')
    ax.text(c_tv[0] - 0.3, c_tv[1] - 0.3, "b", fontsize=11, color='green', fontweight='bold')
    ax.text(d_tv[0] + 0.2, d_tv[1] - 0.3, "d", fontsize=11, color='green', fontweight='bold')

    # Label true shape
    mid_tv = (a_tv + d_tv) / 2
    ax.text(mid_tv[0], mid_tv[1], 'TRUE SHAPE\n(Top View)',
            fontsize=10, color='green', ha='center', fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.2', facecolor='lightyellow', alpha=0.8))

    # Projectors
    ax.plot([a_fv[0], a_tv[0]], [0.2, -0.2], 'k--', lw=0.4)
    ax.plot([b_fv[0], b_tv[0]], [0.2, -0.2], 'k--', lw=0.4)

    ax.set_title('Plane Parallel to HP (Rectangular Plane)', fontsize=12, pad=10)
    ax.text(3, -6.3,
            "When a plane is ∥ to HP:\n"
            "• Front view = line parallel to XY (edge view)\n"
            "• Top view = TRUE SHAPE of the plane",
            ha='center', fontsize=8, style='italic',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-planes-32-parallel-hp.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-planes-32-parallel-hp.png")


# =============================================================================
# IMAGE 3 — Plane inclined to HP, perpendicular to VP (Medium)
# Two-step auxiliary approach: initial position parallel to HP, then tilted
# =============================================================================
def draw_plane_inclined_hp_perp_vp():
    fig, axes = plt.subplots(1, 2, figsize=(12, 6))
    fig.patch.set_facecolor('white')

    for i, ax in enumerate(axes):
        ax.set_aspect('equal')
        ax.axis('off')

    # === Step 1: Plane parallel to HP (initial position) ===
    ax1 = axes[0]
    ax1.set_xlim(-3, 8)
    ax1.set_ylim(-6, 5)
    ax1.set_title('Step 1: Plane ∥ HP\n(Initial Position)', fontsize=11, pad=8)

    # XY line
    ax1.plot([-2.5, 7.5], [0, 0], 'k-', lw=2)
    ax1.text(7.7, 0, 'X', fontsize=10, va='center')
    ax1.text(-2.7, 0, 'Y', fontsize=10, va='center')

    # Front view: line on XY (at height h)
    h1 = 1.5
    ax1.plot([1, 5], [h1, h1], 'r-', lw=3, zorder=4)
    ax1.text(0.7, h1 + 0.3, "a'", fontsize=10, color='red', fontweight='bold')
    ax1.text(5.1, h1 + 0.3, "b'", fontsize=10, color='red', fontweight='bold')
    ax1.text(2.5, h1 + 0.5, "c'd'", fontsize=10, color='red', fontweight='bold')
    ax1.text(3, h1 + 1.2, 'FV: Line ∥ XY', fontsize=9, color='red', ha='center')

    # Top view: true shape (pentagon for variety)
    cx, cy = 3, -2.5
    n = 5
    r = 1.8
    angles = [np.pi/2 + 2*np.pi*k/n for k in range(n)]
    px = [cx + r * np.cos(a) for a in angles] + [cx + r * np.cos(angles[0])]
    py = [cy + r * np.sin(a) for a in angles] + [cy + r * np.sin(angles[0])]
    ax1.fill(px, py, color='lightgreen', alpha=0.4, zorder=3)
    ax1.plot(px, py, 'g-', lw=2, zorder=4)
    labels1 = ['a', 'b', 'c', 'd', 'e']
    for k in range(n):
        off_x = 0.4 * np.cos(angles[k])
        off_y = 0.4 * np.sin(angles[k])
        ax1.text(px[k] + off_x, py[k] + off_y, labels1[k],
                fontsize=10, color='green', fontweight='bold', ha='center')
    ax1.text(cx, cy, 'TRUE\nSHAPE', fontsize=9, color='green', ha='center', fontweight='bold')

    # === Step 2: Plane tilted (inclined at θ to HP, ⊥ VP) ===
    ax2 = axes[1]
    ax2.set_xlim(-3, 8)
    ax2.set_ylim(-6, 5)
    ax2.set_title('Step 2: Plane Inclined at θ to HP\n(⊥ to VP)', fontsize=11, pad=8)

    # XY line
    ax2.plot([-2.5, 7.5], [0, 0], 'k-', lw=2)
    ax2.text(7.7, 0, 'X', fontsize=10, va='center')
    ax2.text(-2.7, 0, 'Y', fontsize=10, va='center')

    # Front view: tilted line (edge view at angle θ)
    theta = np.radians(40)
    fv_len = 4.0
    a2_fv = np.array([1.5, 0.8])
    b2_fv = a2_fv + fv_len * np.array([np.cos(theta), np.sin(theta)])

    ax2.plot([a2_fv[0], b2_fv[0]], [a2_fv[1], b2_fv[1]], 'r-', lw=3, zorder=4)
    ax2.plot(*a2_fv, 'ro', ms=5, zorder=5)
    ax2.plot(*b2_fv, 'ro', ms=5, zorder=5)
    ax2.text(a2_fv[0] - 0.3, a2_fv[1] + 0.2, "a'", fontsize=10, color='red', fontweight='bold')
    ax2.text(b2_fv[0] + 0.2, b2_fv[1] + 0.2, "b'", fontsize=10, color='red', fontweight='bold')

    # Show angle
    arc_a = np.linspace(0, theta, 30)
    ax2.plot(a2_fv[0] + 1.2 * np.cos(arc_a),
             a2_fv[1] + 1.2 * np.sin(arc_a), 'r-', lw=0.8)
    ax2.plot([a2_fv[0], a2_fv[0] + 1.5], [a2_fv[1], a2_fv[1]], 'r:', lw=0.6)
    ax2.text(a2_fv[0] + 1.6, a2_fv[1] + 0.3, 'θ', fontsize=12, color='red')

    ax2.text(3.5, 3.5, 'FV: Edge View at θ', fontsize=9, color='red', ha='center')

    # Top view: foreshortened pentagon
    # Horizontal distances same, vertical distances compressed by cos θ
    cos_t = np.cos(theta)
    px2 = [cx + r * np.cos(a) for a in angles] + [cx + r * np.cos(angles[0])]
    py2 = [cy + r * np.sin(a) * cos_t for a in angles] + [cy + r * np.sin(angles[0]) * cos_t]
    ax2.fill(px2, py2, color='lightgreen', alpha=0.3, zorder=3)
    ax2.plot(px2, py2, 'g-', lw=2, zorder=4)
    for k in range(n):
        off_x = 0.4 * np.cos(angles[k])
        off_y = 0.3 * np.sin(angles[k])
        ax2.text(px2[k] + off_x, py2[k] + off_y, labels1[k],
                fontsize=10, color='green', fontweight='bold', ha='center')
    ax2.text(cx, cy, 'Foreshortened', fontsize=8, color='green', ha='center', style='italic')

    fig.suptitle('Two-Step Method: Plane ⊥ VP, Inclined to HP', fontsize=13, y=0.98)
    fig.tight_layout(rect=[0, 0.02, 1, 0.95])
    fig.savefig(os.path.join(OUT, "cuet-eg-planes-33-two-step-method.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-planes-33-two-step-method.png")


# =============================================================================
# IMAGE 4 — Plane inclined to both HP and VP (Hard)
# Shows the 3-step auxiliary projection method
# =============================================================================
def draw_plane_inclined_both():
    fig, ax = plt.subplots(figsize=(10, 7))
    ax.set_xlim(-3, 14)
    ax.set_ylim(-7, 5.5)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # XY line
    ax.plot([-2.5, 13.5], [0, 0], 'k-', lw=2)
    ax.text(13.7, 0, 'X', fontsize=11, va='center')
    ax.text(-2.7, 0, 'Y', fontsize=11, va='center')

    # === Step 1: True shape (top view, FV as line ∥ XY) ===
    # Triangular plane for clarity
    # Top view: true shape triangle
    t1_pts = np.array([[0.5, -1.5], [2.5, -3.5], [3.5, -1.0], [0.5, -1.5]])
    ax.fill(t1_pts[:-1, 0], t1_pts[:-1, 1], color='lightgreen', alpha=0.4, zorder=3)
    ax.plot(t1_pts[:, 0], t1_pts[:, 1], 'g-', lw=1.5, zorder=4)
    ax.text(0.2, -1.2, "a", fontsize=9, color='green', fontweight='bold')
    ax.text(2.3, -3.8, "b", fontsize=9, color='green', fontweight='bold')
    ax.text(3.7, -0.8, "c", fontsize=9, color='green', fontweight='bold')
    ax.text(2, -2, 'True\nShape', fontsize=7, color='green', ha='center', style='italic')

    # Front view: line ∥ XY
    ax.plot([0.5, 3.5], [1.5, 1.5], 'r-', lw=2.5, zorder=4)
    ax.text(0.2, 1.8, "a'b'c'", fontsize=9, color='red', fontweight='bold')
    ax.text(1.5, 2.5, '(1) FV: || XY', fontsize=8, color='red', ha='center',
            bbox=dict(boxstyle='round,pad=0.15', facecolor='#ffe0e0', alpha=0.8))

    # === Step 2: Tilt to angle θ with HP ===
    theta = np.radians(40)
    fv2_a = np.array([5.5, 1.0])
    fv2_b = fv2_a + 3.0 * np.array([np.cos(theta), np.sin(theta)])
    ax.plot([fv2_a[0], fv2_b[0]], [fv2_a[1], fv2_b[1]], 'r-', lw=2.5, zorder=4)
    ax.plot(*fv2_a, 'ro', ms=5, zorder=5)
    ax.plot(*fv2_b, 'ro', ms=5, zorder=5)
    ax.text(fv2_a[0] - 0.3, fv2_a[1] - 0.3, "a'", fontsize=9, color='red', fontweight='bold')
    ax.text(fv2_b[0] + 0.2, fv2_b[1] + 0.2, "c'", fontsize=9, color='red', fontweight='bold')

    # Angle arc
    arc = np.linspace(0, theta, 20)
    ax.plot(fv2_a[0] + 1 * np.cos(arc), fv2_a[1] + 1 * np.sin(arc), 'r-', lw=0.7)
    ax.text(fv2_a[0] + 1.2, fv2_a[1] + 0.3, 'θ', fontsize=10, color='red')
    ax.text(6.5, 3.5, '(2) FV: Edge at theta', fontsize=8, color='red', ha='center',
            bbox=dict(boxstyle='round,pad=0.15', facecolor='#ffe0e0', alpha=0.8))

    # Top view 2: foreshortened triangle
    cos_t = np.cos(theta)
    t2_pts = np.array([[5.5, -1.5], [7.0, -1.5 - 2.0 * cos_t],
                       [8.0, -1.5 + 0.5 * cos_t], [5.5, -1.5]])
    ax.fill(t2_pts[:-1, 0], t2_pts[:-1, 1], color='lightblue', alpha=0.3, zorder=3)
    ax.plot(t2_pts[:, 0], t2_pts[:, 1], 'b-', lw=1.5, zorder=4)
    ax.text(6.5, -2.5, 'Foreshortened', fontsize=7, color='blue', ha='center', style='italic')

    # Arrow from step 1 to step 2
    ax.annotate('', xy=(4.8, 1.5), xytext=(4.0, 1.5),
                arrowprops=dict(arrowstyle='->', color='gray', lw=1.5))

    # === Step 3: Tilt to angle φ with VP ===
    # Top view 3: edge tilted at φ to XY in plan
    phi = np.radians(35)
    tv3_a = np.array([10, -1.5])
    tv3_len = 3.0
    tv3_b = tv3_a + tv3_len * np.array([np.cos(-phi), np.sin(-phi)])
    ax.plot([tv3_a[0], tv3_b[0]], [tv3_a[1], tv3_b[1]], 'g-', lw=2.5, zorder=4)

    # The triangle gets projected with apparent shape
    # Show a skewed triangle
    t3_pts = np.array([
        [10, -1.5],
        [11.5, -3.5],
        [12.0, -1.8],
        [10, -1.5],
    ])
    ax.fill(t3_pts[:-1, 0], t3_pts[:-1, 1], color='lightgreen', alpha=0.3, zorder=3)
    ax.plot(t3_pts[:, 0], t3_pts[:, 1], 'g-', lw=1.5, zorder=4)
    ax.text(10.8, -2.5, 'Apparent\nShape', fontsize=7, color='green', ha='center', style='italic')

    # Front view 3: another apparent shape
    t3_fv = np.array([
        [10, 1.0],
        [11.8, 2.8],
        [12.2, 1.5],
        [10, 1.0],
    ])
    ax.fill(t3_fv[:-1, 0], t3_fv[:-1, 1], color='#ffe0e0', alpha=0.3, zorder=3)
    ax.plot(t3_fv[:, 0], t3_fv[:, 1], 'r-', lw=1.5, zorder=4)
    ax.text(11, 1.8, 'Apparent\nShape', fontsize=7, color='red', ha='center', style='italic')

    ax.text(11, 4.0, '(3) Final Views\n(Inclined to both)', fontsize=8, color='purple', ha='center',
            bbox=dict(boxstyle='round,pad=0.15', facecolor='#f0e0ff', alpha=0.8))

    # Arrow from step 2 to step 3
    ax.annotate('', xy=(9.5, -1.5), xytext=(8.7, -1.5),
                arrowprops=dict(arrowstyle='->', color='gray', lw=1.5))

    ax.set_title('Three-Step Method: Plane Inclined to Both HP and VP', fontsize=12, pad=10)
    ax.text(6, -6.2,
            "Step 1: Draw true shape in TV, FV as line ∥ XY\n"
            "Step 2: Tilt FV to angle θ with HP → new TV (foreshortened)\n"
            "Step 3: Tilt TV to angle φ with VP → final FV & TV (apparent shapes)",
            ha='center', fontsize=8, style='italic',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-planes-34-inclined-both.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-planes-34-inclined-both.png")


if __name__ == "__main__":
    print("Generating EG B03 diagram images...")
    draw_plane_perp_vp_inclined_hp()
    draw_plane_parallel_hp()
    draw_plane_inclined_hp_perp_vp()
    draw_plane_inclined_both()
    print("Done! 4 images saved to", OUT)
