"""
Generate 4 diagram images for CUET EG B04 (Projection of Solids).
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
# IMAGE 1 — Prism & Pyramid with axis vertical (Easy)
# Shows FV and TV of a pentagonal prism and a square pyramid, axis perpendicular to HP
# =============================================================================
def draw_solids_axis_vertical():
    fig, axes = plt.subplots(1, 2, figsize=(12, 7))
    fig.patch.set_facecolor('white')

    # ── Left: Pentagonal Prism, axis ⊥ HP ──
    ax = axes[0]
    ax.set_xlim(-4, 5)
    ax.set_ylim(-5.5, 5.5)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Pentagonal Prism\n(Axis ⊥ HP)', fontsize=11, pad=8)

    # XY line
    ax.plot([-3.5, 4.5], [0, 0], 'k-', lw=2)
    ax.text(4.6, 0, 'X', fontsize=9, va='center')
    ax.text(-3.6, 0, 'Y', fontsize=9, va='center')

    # Front view: rectangle (above XY)
    h = 4.0  # height of prism
    w = 3.0  # width across flats
    rect_x = [-w/2, w/2, w/2, -w/2, -w/2]
    rect_y = [0.5, 0.5, 0.5+h, 0.5+h, 0.5]
    ax.fill(rect_x, rect_y, color='#ffe0e0', alpha=0.4, zorder=3)
    ax.plot(rect_x, rect_y, 'r-', lw=2, zorder=4)
    # Hidden edges inside
    ax.plot([-0.9, -0.9], [0.5, 0.5+h], 'r--', lw=0.8, zorder=3)
    ax.plot([0.9, 0.9], [0.5, 0.5+h], 'r--', lw=0.8, zorder=3)
    ax.text(0, 0.5+h/2, "FV", fontsize=10, color='red', ha='center', fontweight='bold')

    # Axis
    ax.plot([0, 0], [0.5, 0.5+h], 'k-.', lw=0.6, zorder=2)
    ax.text(0.3, 0.5+h+0.3, 'axis', fontsize=8, color='gray', style='italic')

    # Top view: regular pentagon (below XY)
    cx, cy = 0, -2.5
    n = 5
    r = 1.5
    angles = [np.pi/2 + 2*np.pi*k/n for k in range(n)]
    px = [cx + r * np.cos(a) for a in angles] + [cx + r * np.cos(angles[0])]
    py = [cy + r * np.sin(a) for a in angles] + [cy + r * np.sin(angles[0])]
    ax.fill(px[:-1], py[:-1], color='lightgreen', alpha=0.4, zorder=3)
    ax.plot(px, py, 'g-', lw=2, zorder=4)
    # Diagonals (visible edges from top)
    for i in range(n):
        for j in range(i+2, n):
            if abs(i-j) != 1 and abs(i-j) != n-1:
                ax.plot([px[i], px[j]], [py[i], py[j]], 'g--', lw=0.6, zorder=3)
    ax.text(cx, cy, "TV", fontsize=10, color='green', ha='center', fontweight='bold')

    # ── Right: Square Pyramid, axis ⊥ HP ──
    ax2 = axes[1]
    ax2.set_xlim(-4, 5)
    ax2.set_ylim(-5.5, 5.5)
    ax2.set_aspect('equal')
    ax2.axis('off')
    ax2.set_title('Square Pyramid\n(Axis ⊥ HP)', fontsize=11, pad=8)

    # XY line
    ax2.plot([-3.5, 4.5], [0, 0], 'k-', lw=2)
    ax2.text(4.6, 0, 'X', fontsize=9, va='center')
    ax2.text(-3.6, 0, 'Y', fontsize=9, va='center')

    # Front view: triangle (above XY)
    base_w = 3.0
    pyr_h = 4.0
    tri_x = [-base_w/2, base_w/2, 0, -base_w/2]
    tri_y = [0.5, 0.5, 0.5+pyr_h, 0.5]
    ax2.fill(tri_x, tri_y, color='#ffe0e0', alpha=0.4, zorder=3)
    ax2.plot(tri_x, tri_y, 'r-', lw=2, zorder=4)
    # Base line (visible)
    ax2.plot([-base_w/2, base_w/2], [0.5, 0.5], 'r-', lw=2, zorder=4)
    # Hidden edge (back edge from apex)
    ax2.plot([0, 0], [0.5, 0.5+pyr_h], 'k-.', lw=0.6, zorder=2)
    ax2.text(0.3, 0.5+pyr_h+0.3, 'axis/apex', fontsize=8, color='gray', style='italic')
    ax2.text(0, 0.5+pyr_h/2, "FV", fontsize=10, color='red', ha='center', fontweight='bold')

    # Top view: square with diagonals (below XY)
    s = 2.1  # half-side
    sq_x = [-s, s, s, -s, -s]
    sq_y = [-2.5+s, -2.5+s, -2.5-s, -2.5-s, -2.5+s]
    ax2.fill(sq_x, sq_y, color='lightgreen', alpha=0.4, zorder=3)
    ax2.plot(sq_x, sq_y, 'g-', lw=2, zorder=4)
    # Diagonals to center (slant edges)
    for i in range(4):
        ax2.plot([sq_x[i], 0], [sq_y[i], -2.5], 'g-', lw=1.2, zorder=4)
    ax2.plot(0, -2.5, 'go', ms=5, zorder=5)
    ax2.text(0.3, -2.2, 'o', fontsize=9, color='green', fontweight='bold')
    ax2.text(0, -2.5-s-0.5, "TV", fontsize=10, color='green', ha='center', fontweight='bold')

    fig.suptitle('Projection of Solids: Axis Perpendicular to HP', fontsize=13, y=0.98)
    fig.tight_layout(rect=[0, 0, 1, 0.94])
    fig.savefig(os.path.join(OUT, "cuet-eg-solids-41-axis-vertical.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-solids-41-axis-vertical.png")


# =============================================================================
# IMAGE 2 — Cone with axis vertical (Easy/Medium)
# Shows FV (triangle) and TV (circle with center) for a cone on HP
# =============================================================================
def draw_cone_axis_vertical():
    fig, ax = plt.subplots(figsize=(7, 7))
    ax.set_xlim(-5, 5)
    ax.set_ylim(-6, 6)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # XY line
    ax.plot([-4.5, 4.5], [0, 0], 'k-', lw=2)
    ax.text(4.7, 0, 'X', fontsize=11, va='center')
    ax.text(-4.7, 0, 'Y', fontsize=11, va='center')

    # Front view: isosceles triangle (cone)
    base_r = 2.0
    cone_h = 4.0
    tri_x = [-base_r, base_r, 0, -base_r]
    tri_y = [0.5, 0.5, 0.5+cone_h, 0.5]
    ax.fill(tri_x, tri_y, color='#ffe0e0', alpha=0.4, zorder=3)
    ax.plot(tri_x, tri_y, 'r-', lw=2, zorder=4)

    # Axis
    ax.plot([0, 0], [0.5, 0.5+cone_h], 'k-.', lw=0.7, zorder=2)

    # Labels
    ax.text(-base_r-0.3, 0.5, "a'", fontsize=10, color='red', fontweight='bold', ha='right')
    ax.text(base_r+0.3, 0.5, "b'", fontsize=10, color='red', fontweight='bold')
    ax.text(0.3, 0.5+cone_h+0.2, "o'", fontsize=10, color='red', fontweight='bold')
    ax.text(1.5, 0.5+cone_h/2, "FV\n(Triangle)", fontsize=9, color='red', ha='center')

    # Generators (slant edges)
    ax.annotate('', xy=(base_r, 0.5), xytext=(0, 0.5+cone_h),
                arrowprops=dict(arrowstyle='-', color='red', lw=1))

    # Height and base radius dimensions
    ax.annotate('', xy=(-3.5, 0.5+cone_h), xytext=(-3.5, 0.5),
                arrowprops=dict(arrowstyle='<->', color='blue', lw=1))
    ax.text(-4, 0.5+cone_h/2, 'h', fontsize=11, color='blue', ha='center')

    ax.annotate('', xy=(base_r, 0.2), xytext=(0, 0.2),
                arrowprops=dict(arrowstyle='<->', color='purple', lw=1))
    ax.text(base_r/2, -0.1, 'r', fontsize=11, color='purple', ha='center')

    # Top view: circle
    circle = plt.Circle((0, -3), base_r, fill=True, facecolor='lightgreen',
                         edgecolor='green', lw=2, alpha=0.4, zorder=3)
    ax.add_patch(circle)
    circle_edge = plt.Circle((0, -3), base_r, fill=False, edgecolor='green',
                              lw=2, zorder=4)
    ax.add_patch(circle_edge)

    # Center point (apex projection)
    ax.plot(0, -3, 'go', ms=5, zorder=5)
    ax.text(0.3, -2.7, 'o', fontsize=10, color='green', fontweight='bold')
    ax.text(0, -3, '', fontsize=9)
    ax.text(2.5, -3, "TV\n(Circle)", fontsize=9, color='green', ha='center')

    # Projectors
    ax.plot([-base_r, -base_r], [0.2, -1.0], 'k--', lw=0.4)
    ax.plot([base_r, base_r], [0.2, -1.0], 'k--', lw=0.4)
    ax.plot([0, 0], [0.2, -1.0], 'k--', lw=0.4)

    ax.set_title('Cone with Axis Perpendicular to HP', fontsize=12, pad=10)
    ax.text(0, -5.5,
            "FV = Isosceles triangle (height h, base diameter 2r)\n"
            "TV = Circle of radius r with apex at centre (o)",
            ha='center', fontsize=8, style='italic',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-solids-42-cone-vertical.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-solids-42-cone-vertical.png")


# =============================================================================
# IMAGE 3 — Cylinder with axis inclined to HP (Medium)
# Shows two-step: Step 1 axis ⊥ HP, Step 2 axis tilted
# =============================================================================
def draw_cylinder_inclined():
    fig, axes = plt.subplots(1, 2, figsize=(12, 6.5))
    fig.patch.set_facecolor('white')

    for a in axes:
        a.set_aspect('equal')
        a.axis('off')

    # === Step 1: Axis ⊥ HP ===
    ax1 = axes[0]
    ax1.set_xlim(-4, 5)
    ax1.set_ylim(-5, 5)
    ax1.set_title('Step 1: Axis Perpendicular to HP', fontsize=10, pad=8)

    ax1.plot([-3.5, 4.5], [0, 0], 'k-', lw=2)
    ax1.text(4.6, 0, 'X', fontsize=9, va='center')
    ax1.text(-3.6, 0, 'Y', fontsize=9, va='center')

    # FV: rectangle
    cyl_r = 1.5
    cyl_h = 3.5
    rect_x = [-cyl_r, cyl_r, cyl_r, -cyl_r, -cyl_r]
    rect_y = [0.5, 0.5, 0.5+cyl_h, 0.5+cyl_h, 0.5]
    ax1.fill(rect_x, rect_y, color='#ffe0e0', alpha=0.4, zorder=3)
    ax1.plot(rect_x, rect_y, 'r-', lw=2, zorder=4)
    ax1.plot([0, 0], [0.5, 0.5+cyl_h], 'k-.', lw=0.6)
    ax1.text(0, 0.5+cyl_h/2, 'FV\n(Rect)', fontsize=9, color='red', ha='center')

    # TV: circle
    circle1 = plt.Circle((0, -2.5), cyl_r, fill=True, facecolor='lightgreen',
                          edgecolor='green', lw=2, alpha=0.4, zorder=3)
    ax1.add_patch(circle1)
    circle1e = plt.Circle((0, -2.5), cyl_r, fill=False, edgecolor='green', lw=2, zorder=4)
    ax1.add_patch(circle1e)
    ax1.plot(0, -2.5, 'go', ms=4, zorder=5)
    ax1.text(0, -2.5, 'TV\n(Circle)', fontsize=9, color='green', ha='center')

    # === Step 2: Axis inclined at 30° to HP ===
    ax2 = axes[1]
    ax2.set_xlim(-4, 7)
    ax2.set_ylim(-5.5, 5)
    ax2.set_title('Step 2: Axis Inclined at 30deg to HP', fontsize=10, pad=8)

    ax2.plot([-3.5, 6.5], [0, 0], 'k-', lw=2)
    ax2.text(6.7, 0, 'X', fontsize=9, va='center')
    ax2.text(-3.6, 0, 'Y', fontsize=9, va='center')

    # FV: tilted rectangle
    theta = np.radians(30)
    # Base center at (0, 0.5), axis tilted
    base_c = np.array([0, 0.8])
    axis_dir = np.array([np.cos(theta+np.pi/2), np.sin(theta+np.pi/2)])
    # Actually: axis inclined at 30° to HP means axis makes 30° with horizontal
    axis_dir = np.array([np.cos(theta), np.sin(theta)])
    top_c = base_c + cyl_h * axis_dir
    perp = np.array([-np.sin(theta), np.cos(theta)])

    # Rectangle corners
    c1 = base_c + cyl_r * perp
    c2 = base_c - cyl_r * perp
    c3 = top_c - cyl_r * perp
    c4 = top_c + cyl_r * perp

    rx = [c1[0], c4[0], c3[0], c2[0], c1[0]]
    ry = [c1[1], c4[1], c3[1], c2[1], c1[1]]
    ax2.fill(rx, ry, color='#ffe0e0', alpha=0.4, zorder=3)
    ax2.plot(rx, ry, 'r-', lw=2, zorder=4)

    # Axis line
    ax2.plot([base_c[0], top_c[0]], [base_c[1], top_c[1]], 'k-.', lw=0.7, zorder=2)

    # Angle arc
    arc_a = np.linspace(0, theta, 30)
    ax2.plot(base_c[0] + 1.5*np.cos(arc_a), base_c[1] + 1.5*np.sin(arc_a), 'r-', lw=0.8)
    ax2.plot([base_c[0], base_c[0]+2], [base_c[1], base_c[1]], 'r:', lw=0.5)
    ax2.text(base_c[0]+1.8, base_c[1]+0.4, '30deg', fontsize=9, color='red')

    ax2.text(1.5, 3.5, 'FV (Tilted Rect)', fontsize=9, color='red', ha='center')

    # TV: ellipse (foreshortened circle)
    # The top view becomes an ellipse when the axis is tilted
    from matplotlib.patches import Ellipse
    # Major axis = diameter, minor axis = diameter * cos(30°) ... actually
    # TV of a cylinder with inclined axis: the circle becomes visible as a full shape
    # but the overall TV is a rectangle with semicircular ends
    # For simplicity, show the foreshortened projection
    tv_len = cyl_h * np.cos(theta)  # projected length along horizontal
    tv_w = 2 * cyl_r  # width stays same

    # Draw as a rounded rectangle (stadium shape)
    tv_cx, tv_cy = 1.5, -2.5
    # Left semicircle
    ang_l = np.linspace(np.pi/2, 3*np.pi/2, 30)
    lx = tv_cx - tv_len/2 + cyl_r * np.cos(ang_l)
    ly = tv_cy + cyl_r * np.sin(ang_l)
    # Right semicircle
    ang_r = np.linspace(-np.pi/2, np.pi/2, 30)
    rx2 = tv_cx + tv_len/2 + cyl_r * np.cos(ang_r)
    ry2 = tv_cy + cyl_r * np.sin(ang_r)

    all_x = list(lx) + list(rx2) + [lx[0]]
    all_y = list(ly) + list(ry2) + [ly[0]]
    ax2.fill(all_x, all_y, color='lightgreen', alpha=0.3, zorder=3)
    ax2.plot(all_x, all_y, 'g-', lw=2, zorder=4)
    ax2.text(tv_cx, tv_cy, 'TV\n(Foreshortened)', fontsize=8, color='green', ha='center')

    fig.suptitle('Cylinder: Axis Inclined to HP (Two-Step Method)', fontsize=13, y=0.98)
    fig.tight_layout(rect=[0, 0, 1, 0.94])
    fig.savefig(os.path.join(OUT, "cuet-eg-solids-43-cylinder-inclined.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-solids-43-cylinder-inclined.png")


# =============================================================================
# IMAGE 4 — Hexagonal Pyramid axis inclined to both planes (Hard)
# Shows the concept with step labels
# =============================================================================
def draw_pyramid_inclined_both():
    fig, ax = plt.subplots(figsize=(10, 7))
    ax.set_xlim(-3, 14)
    ax.set_ylim(-7, 6)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # XY line
    ax.plot([-2.5, 13.5], [0, 0], 'k-', lw=2)
    ax.text(13.7, 0, 'X', fontsize=11, va='center')
    ax.text(-2.7, 0, 'Y', fontsize=11, va='center')

    # === Step 1: Axis ⊥ HP ===
    # FV: triangle, TV: hexagon with diagonals
    # FV triangle
    bw = 2.5
    ph = 3.5
    ax.fill([-bw/2, bw/2, 0, -bw/2], [0.5, 0.5, 0.5+ph, 0.5],
            color='#ffe0e0', alpha=0.4, zorder=3)
    ax.plot([-bw/2, bw/2, 0, -bw/2], [0.5, 0.5, 0.5+ph, 0.5],
            'r-', lw=1.5, zorder=4)
    ax.text(0, 0.5+ph/2, 'FV', fontsize=8, color='red', ha='center')

    # TV: hexagon
    hcx, hcy = 0, -2.5
    hr = 1.3
    n = 6
    ha = [np.pi/6 + 2*np.pi*k/n for k in range(n)]
    hpx = [hcx + hr*np.cos(a) for a in ha] + [hcx + hr*np.cos(ha[0])]
    hpy = [hcy + hr*np.sin(a) for a in ha] + [hcy + hr*np.sin(ha[0])]
    ax.fill(hpx[:-1], hpy[:-1], color='lightgreen', alpha=0.4, zorder=3)
    ax.plot(hpx, hpy, 'g-', lw=1.5, zorder=4)
    for i in range(n):
        ax.plot([hpx[i], hcx], [hpy[i], hcy], 'g-', lw=0.6, zorder=3)
    ax.plot(hcx, hcy, 'go', ms=3, zorder=5)
    ax.text(hcx, hcy-1.8, 'TV (True)', fontsize=8, color='green', ha='center')

    ax.text(0, 4.5, 'Step 1:\nAxis perp. HP', fontsize=8, color='purple', ha='center',
            bbox=dict(boxstyle='round,pad=0.15', facecolor='#f0e0ff', alpha=0.8))

    # Arrow
    ax.annotate('', xy=(3.5, 2), xytext=(2.5, 2),
                arrowprops=dict(arrowstyle='->', color='gray', lw=1.5))

    # === Step 2: Tilt FV (axis at angle to HP) ===
    theta = np.radians(35)
    # Tilted triangle
    base_c2 = np.array([5, 0.8])
    apex2 = base_c2 + ph * np.array([np.cos(theta+np.pi/2-np.pi/2+theta), np.sin(theta+np.pi/2-np.pi/2+theta)])
    # Simpler: apex is at angle theta from horizontal
    apex2 = base_c2 + np.array([ph*np.cos(theta), ph*np.sin(theta)])
    # Base corners (perpendicular to axis)
    perp2 = np.array([-np.sin(theta), np.cos(theta)])
    bl = base_c2 - bw/2 * perp2
    br = base_c2 + bw/2 * perp2

    ax.fill([bl[0], br[0], apex2[0], bl[0]], [bl[1], br[1], apex2[1], bl[1]],
            color='#ffe0e0', alpha=0.4, zorder=3)
    ax.plot([bl[0], br[0], apex2[0], bl[0]], [bl[1], br[1], apex2[1], bl[1]],
            'r-', lw=1.5, zorder=4)

    # Axis
    ax.plot([base_c2[0], apex2[0]], [base_c2[1], apex2[1]], 'k-.', lw=0.6)

    # Angle arc
    arc2 = np.linspace(0, theta, 20)
    ax.plot(base_c2[0]+1.2*np.cos(arc2), base_c2[1]+1.2*np.sin(arc2), 'r-', lw=0.7)
    ax.text(base_c2[0]+1.5, base_c2[1]+0.3, 'theta', fontsize=9, color='red')

    # Foreshortened hexagonal TV
    cos_t = np.cos(theta)
    hcx2, hcy2 = 5.5, -2.5
    hpx2 = [hcx2 + hr*np.cos(a) for a in ha]
    hpy2 = [hcy2 + hr*np.sin(a)*cos_t for a in ha]
    hpx2.append(hpx2[0])
    hpy2.append(hpy2[0])
    ax.fill(hpx2[:-1], hpy2[:-1], color='lightblue', alpha=0.3, zorder=3)
    ax.plot(hpx2, hpy2, 'b-', lw=1.5, zorder=4)
    ax.text(hcx2, hcy2-1.5, 'TV (Foreshort.)', fontsize=8, color='blue', ha='center')

    ax.text(5.5, 4.5, 'Step 2:\nTilt to HP angle', fontsize=8, color='purple', ha='center',
            bbox=dict(boxstyle='round,pad=0.15', facecolor='#f0e0ff', alpha=0.8))

    # Arrow
    ax.annotate('', xy=(8.5, -2.5), xytext=(7.5, -2.5),
                arrowprops=dict(arrowstyle='->', color='gray', lw=1.5))

    # === Step 3: Final views (axis inclined to both) ===
    # Show apparent shapes in both views
    # TV: rotated foreshortened hexagon
    hcx3, hcy3 = 10.5, -2.5
    phi = np.radians(25)
    rot = np.array([[np.cos(phi), -np.sin(phi)], [np.sin(phi), np.cos(phi)]])
    pts3 = []
    for i in range(n):
        p = np.array([hr*np.cos(ha[i]), hr*np.sin(ha[i])*cos_t])
        rp = rot @ p
        pts3.append([hcx3+rp[0], hcy3+rp[1]])
    pts3.append(pts3[0])
    pts3 = np.array(pts3)
    ax.fill(pts3[:-1,0], pts3[:-1,1], color='lightgreen', alpha=0.3, zorder=3)
    ax.plot(pts3[:,0], pts3[:,1], 'g-', lw=1.5, zorder=4)
    ax.text(hcx3, hcy3-1.8, 'TV (Apparent)', fontsize=8, color='green', ha='center')

    # FV: apparent shape (irregular polygon)
    fv3_pts = np.array([
        [9.5, 1.0], [11.5, 0.8], [12, 3.5], [10.5, 4.2], [9.5, 1.0]
    ])
    ax.fill(fv3_pts[:-1,0], fv3_pts[:-1,1], color='#ffe0e0', alpha=0.3, zorder=3)
    ax.plot(fv3_pts[:,0], fv3_pts[:,1], 'r-', lw=1.5, zorder=4)
    ax.text(10.8, 2.5, 'FV\n(Apparent)', fontsize=8, color='red', ha='center')

    ax.text(10.5, 5, 'Step 3:\nTilt to VP angle', fontsize=8, color='purple', ha='center',
            bbox=dict(boxstyle='round,pad=0.15', facecolor='#f0e0ff', alpha=0.8))

    ax.set_title('Hexagonal Pyramid: Axis Inclined to Both HP and VP', fontsize=12, pad=10)
    ax.text(6, -6.2,
            "Step 1: Draw with axis perp. HP (true base shape in TV)\n"
            "Step 2: Tilt FV to set HP angle (foreshortened TV)\n"
            "Step 3: Tilt TV to set VP angle (final apparent shapes)",
            ha='center', fontsize=8, style='italic',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-solids-44-pyramid-inclined-both.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-solids-44-pyramid-inclined-both.png")


if __name__ == "__main__":
    print("Generating EG B04 diagram images...")
    draw_solids_axis_vertical()
    draw_cone_axis_vertical()
    draw_cylinder_inclined()
    draw_pyramid_inclined_both()
    print("Done! 4 images saved to", OUT)
