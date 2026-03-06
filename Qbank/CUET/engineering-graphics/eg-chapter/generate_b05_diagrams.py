"""
Generate 4 diagram images for CUET EG B05 (Sections of Solids).
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
# IMAGE 1 — Section of a Cylinder by a plane inclined to HP (Easy/Medium)
# Shows FV with cutting plane, sectional TV (ellipse), and true shape
# =============================================================================
def draw_cylinder_section():
    fig, axes = plt.subplots(1, 2, figsize=(12, 7))
    fig.patch.set_facecolor('white')

    # ── Left: FV of cylinder with cutting plane ──
    ax = axes[0]
    ax.set_xlim(-4, 5)
    ax.set_ylim(-5.5, 5.5)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Front View with Cutting Plane', fontsize=11, pad=8)

    # XY line
    ax.plot([-3.5, 4.5], [0, 0], 'k-', lw=2)
    ax.text(4.6, 0, 'X', fontsize=9, va='center')
    ax.text(-3.6, 0, 'Y', fontsize=9, va='center')

    # FV: rectangle (cylinder, axis ⊥ HP)
    cyl_r = 1.5
    cyl_h = 4.0
    rect_x = [-cyl_r, cyl_r, cyl_r, -cyl_r, -cyl_r]
    rect_y = [0.3, 0.3, 0.3+cyl_h, 0.3+cyl_h, 0.3]
    ax.fill(rect_x, rect_y, color='#e8e8ff', alpha=0.4, zorder=3)
    ax.plot(rect_x, rect_y, 'b-', lw=2, zorder=4)
    ax.plot([0, 0], [0.3, 0.3+cyl_h], 'k-.', lw=0.6, zorder=2)

    # Cutting plane (inclined line across the FV)
    cp_y1 = 1.5
    cp_y2 = 3.2
    ax.plot([-cyl_r-0.5, cyl_r+0.5], [cp_y1, cp_y2], 'r-', lw=2.5, zorder=5)
    # Cutting plane arrows
    ax.annotate('', xy=(-cyl_r-0.5, cp_y1), xytext=(-cyl_r-0.5, cp_y1+0.5),
                arrowprops=dict(arrowstyle='->', color='red', lw=1.5))
    ax.annotate('', xy=(cyl_r+0.5, cp_y2), xytext=(cyl_r+0.5, cp_y2+0.5),
                arrowprops=dict(arrowstyle='->', color='red', lw=1.5))
    ax.text(-cyl_r-1.2, cp_y1+0.3, 'A', fontsize=12, color='red', fontweight='bold')
    ax.text(cyl_r+1.0, cp_y2+0.3, 'A', fontsize=12, color='red', fontweight='bold')

    # Angle annotation
    mid_x = 0
    mid_y = (cp_y1+cp_y2)/2
    theta = np.arctan2(cp_y2-cp_y1, 2*cyl_r)
    arc_a = np.linspace(0, theta, 20)
    ax.plot([-cyl_r + 1.5*np.cos(a) for a in arc_a],
            [cp_y1 + 1.5*np.sin(a) for a in arc_a], 'r-', lw=0.8)
    ax.text(-cyl_r+1.8, cp_y1+0.3, 'θ', fontsize=11, color='red')

    # Hatching on cut portion (above the cutting plane)
    for yy in np.arange(cp_y2+0.3, 0.3+cyl_h, 0.3):
        x_left = -cyl_r
        x_right = cyl_r
        ax.plot([x_left, x_right], [yy, yy-0.15], 'gray', lw=0.3, alpha=0.5)

    # Label retained and removed portions
    ax.text(0, 0.3+cyl_h-0.3, 'Removed', fontsize=8, color='gray', ha='center', style='italic')
    ax.text(0, 0.8, 'Retained', fontsize=8, color='blue', ha='center', style='italic')

    # TV: circle with section line
    cx, cy = 0, -2.5
    circle = plt.Circle((cx, cy), cyl_r, fill=True, facecolor='lightgreen',
                         edgecolor='green', lw=2, alpha=0.4, zorder=3)
    ax.add_patch(circle)
    circle_e = plt.Circle((cx, cy), cyl_r, fill=False, edgecolor='green', lw=2, zorder=4)
    ax.add_patch(circle_e)
    ax.text(cx, cy, 'TV\n(Circle)', fontsize=9, color='green', ha='center')

    # ── Right: True shape of section (ellipse) ──
    ax2 = axes[1]
    ax2.set_xlim(-4, 4)
    ax2.set_ylim(-4, 4)
    ax2.set_aspect('equal')
    ax2.axis('off')
    ax2.set_title('True Shape of Section', fontsize=11, pad=8)

    # Ellipse (section of cylinder by inclined plane)
    # Major axis = diameter / cos(theta), Minor axis = diameter
    theta_val = np.arctan2(cp_y2-cp_y1, 2*cyl_r)
    major = cyl_r / np.cos(theta_val)
    minor = cyl_r

    ellipse = patches.Ellipse((0, 0), 2*major, 2*minor, angle=0,
                                fill=True, facecolor='#ffe0e0', edgecolor='red',
                                lw=2, alpha=0.5, zorder=3)
    ax2.add_patch(ellipse)

    # Section lines (hatching)
    for d in np.arange(-major, major, 0.25):
        y_top = minor * np.sqrt(max(0, 1 - (d/major)**2))
        if y_top > 0.1:
            ax2.plot([d-0.15, d+0.15], [y_top*0.8, -y_top*0.8], 'gray', lw=0.3, alpha=0.6)

    ax2.text(0, 0, 'Ellipse\n(True Shape)', fontsize=10, color='red', ha='center', fontweight='bold')

    # Dimension annotations
    ax2.annotate('', xy=(major, 0), xytext=(-major, 0),
                arrowprops=dict(arrowstyle='<->', color='blue', lw=1))
    ax2.text(0, -0.5, f'Major axis', fontsize=9, color='blue', ha='center')

    ax2.annotate('', xy=(0, minor), xytext=(0, -minor),
                arrowprops=dict(arrowstyle='<->', color='purple', lw=1))
    ax2.text(0.5, 0, 'Minor\naxis', fontsize=9, color='purple', ha='left')

    ax2.text(0, -3.2,
             "When a cutting plane inclined to HP\n"
             "cuts a cylinder (axis ⊥ HP),\n"
             "the true shape of section is an ELLIPSE",
             ha='center', fontsize=8, style='italic',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.suptitle('Section of a Cylinder by an Inclined Plane', fontsize=13, y=0.98)
    fig.tight_layout(rect=[0, 0, 1, 0.94])
    fig.savefig(os.path.join(OUT, "cuet-eg-sections-51-cylinder-section.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-sections-51-cylinder-section.png")


# =============================================================================
# IMAGE 2 — Section of a Cone by different planes (Medium)
# Shows 4 cases: circle, ellipse, parabola, hyperbola (conic sections)
# =============================================================================
def draw_cone_sections():
    fig, axes = plt.subplots(1, 4, figsize=(14, 5))
    fig.patch.set_facecolor('white')

    cone_r = 1.2
    cone_h = 3.5

    titles = ['Circle\n(⊥ Axis)', 'Ellipse\n(Inclined, < slant)', 'Parabola\n(∥ Generator)', 'Hyperbola\n(∥ Axis)']
    # Cutting plane angles (from horizontal)
    # For each case we draw a triangle (cone FV) and a cutting line

    for i, ax in enumerate(axes):
        ax.set_xlim(-2.5, 2.5)
        ax.set_ylim(-0.5, 4.5)
        ax.set_aspect('equal')
        ax.axis('off')
        ax.set_title(titles[i], fontsize=9, pad=6)

        # Cone FV (isosceles triangle)
        tri_x = [-cone_r, cone_r, 0, -cone_r]
        tri_y = [0.2, 0.2, 0.2+cone_h, 0.2]
        ax.fill(tri_x, tri_y, color='#e8e8ff', alpha=0.3, zorder=3)
        ax.plot(tri_x, tri_y, 'b-', lw=1.5, zorder=4)
        ax.plot([0, 0], [0.2, 0.2+cone_h], 'k-.', lw=0.5, zorder=2)

        # Slant angle
        slant_angle = np.arctan2(cone_h, cone_r)

        if i == 0:  # Circle: perpendicular to axis (horizontal cut)
            y_cut = 2.0
            # At y_cut, half-width = cone_r * (cone_h - (y_cut-0.2)) / cone_h
            hw = cone_r * (cone_h - (y_cut-0.2)) / cone_h
            ax.plot([-hw-0.3, hw+0.3], [y_cut, y_cut], 'r-', lw=2.5, zorder=5)
            ax.text(0, y_cut+0.3, '⊥ axis', fontsize=8, color='red', ha='center')
            # True shape: circle
            c = plt.Circle((0, -0.1), 0.4, fill=False, edgecolor='red', lw=1.5)
            # Not enough space, just label
        elif i == 1:  # Ellipse: inclined, angle > slant angle from axis
            y1 = 1.0
            y2 = 2.5
            # Get x at these y values on the left and right edges
            hw1 = cone_r * (cone_h - (y1-0.2)) / cone_h
            hw2 = cone_r * (cone_h - (y2-0.2)) / cone_h
            ax.plot([-hw1-0.3, hw2+0.3], [y1, y2], 'r-', lw=2.5, zorder=5)
            cut_angle = np.arctan2(y2-y1, hw1+hw2+0.6)
            ax.text(0.3, 1.5, 'θ < α', fontsize=8, color='red')
        elif i == 2:  # Parabola: parallel to generator (slant edge)
            # Draw line parallel to the left slant edge, shifted right
            shift = 0.5
            y_start = 0.2
            y_end = 0.2 + cone_h * 0.8
            x_start = shift
            x_end = shift - cone_r * (y_end-0.2)/cone_h + cone_r*(y_start-0.2)/cone_h
            # Actually: parallel to left generator means same slope
            # Left generator: from (-cone_r, 0.2) to (0, 0.2+cone_h), slope = cone_h/cone_r
            slope = cone_h / cone_r
            # Start from right edge at some height
            x_s = cone_r * 0.6
            y_s = 0.2 + (cone_r - x_s) * slope  # actually let me compute properly
            # Line parallel to left generator passing through (x_s, 0.5)
            y_s = 0.5
            x_s = cone_r * (cone_h - (y_s-0.2)) / cone_h  # x at right edge at y_s
            y_e = 0.2 + cone_h * 0.85
            x_e = x_s - (y_e - y_s) / slope
            ax.plot([x_s+0.2, x_e-0.2], [y_s, y_e], 'r-', lw=2.5, zorder=5)
            ax.text(0.8, 1.5, '∥ gen', fontsize=8, color='red')
        elif i == 3:  # Hyperbola: parallel to axis (vertical cut, not through apex)
            x_cut = 0.5
            # Vertical line at x_cut
            y_bottom = 0.2
            y_top_at_x = 0.2 + cone_h * (1 - x_cut/cone_r)
            ax.plot([x_cut, x_cut], [y_bottom-0.2, y_top_at_x+0.3], 'r-', lw=2.5, zorder=5)
            ax.text(x_cut+0.3, 2.0, '∥ axis', fontsize=8, color='red')

    fig.suptitle('Conic Sections: Cutting a Cone by Different Planes', fontsize=13, y=1.0)
    fig.tight_layout(rect=[0, 0, 1, 0.95])
    fig.savefig(os.path.join(OUT, "cuet-eg-sections-52-cone-conic-sections.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-sections-52-cone-conic-sections.png")


# =============================================================================
# IMAGE 3 — Section of a Prism (Medium/Hard)
# Shows FV with cutting plane and the sectional TV with hatching
# =============================================================================
def draw_prism_section():
    fig, axes = plt.subplots(1, 2, figsize=(12, 7))
    fig.patch.set_facecolor('white')

    # ── Left: FV of pentagonal prism with cutting plane ──
    ax = axes[0]
    ax.set_xlim(-4, 5)
    ax.set_ylim(-5.5, 5.5)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Front View with Section Plane', fontsize=11, pad=8)

    # XY line
    ax.plot([-3.5, 4.5], [0, 0], 'k-', lw=2)
    ax.text(4.6, 0, 'X', fontsize=9, va='center')
    ax.text(-3.6, 0, 'Y', fontsize=9, va='center')

    # FV: rectangle (pentagonal prism, axis ⊥ HP)
    pw = 3.0  # width
    ph = 4.0  # height
    rect_x = [-pw/2, pw/2, pw/2, -pw/2, -pw/2]
    rect_y = [0.3, 0.3, 0.3+ph, 0.3+ph, 0.3]
    ax.fill(rect_x, rect_y, color='#e8e8ff', alpha=0.4, zorder=3)
    ax.plot(rect_x, rect_y, 'b-', lw=2, zorder=4)

    # Hidden edges (pentagon sides projected)
    ax.plot([-0.9, -0.9], [0.3, 0.3+ph], 'b--', lw=0.7, zorder=3)
    ax.plot([0.9, 0.9], [0.3, 0.3+ph], 'b--', lw=0.7, zorder=3)

    # Cutting plane (inclined)
    cp_y1 = 1.5
    cp_y2 = 3.0
    ax.plot([-pw/2-0.8, pw/2+0.8], [cp_y1, cp_y2], 'r-', lw=2.5, zorder=5)
    ax.text(-pw/2-1.5, cp_y1, 'A', fontsize=12, color='red', fontweight='bold')
    ax.text(pw/2+1.0, cp_y2, 'A', fontsize=12, color='red', fontweight='bold')

    # Arrows
    ax.annotate('', xy=(-pw/2-0.8, cp_y1), xytext=(-pw/2-0.8, cp_y1+0.5),
                arrowprops=dict(arrowstyle='->', color='red', lw=1.5))
    ax.annotate('', xy=(pw/2+0.8, cp_y2), xytext=(pw/2+0.8, cp_y2+0.5),
                arrowprops=dict(arrowstyle='->', color='red', lw=1.5))

    # Hatching above cut plane (removed portion)
    for yy in np.arange(cp_y2+0.2, 0.3+ph, 0.25):
        ax.plot([-pw/2, pw/2], [yy, yy-0.12], 'gray', lw=0.3, alpha=0.4)
    ax.text(0, 0.3+ph-0.3, 'Removed', fontsize=8, color='gray', ha='center', style='italic')

    # TV: pentagon
    cx, cy = 0, -2.5
    n = 5
    r = 1.5
    angles = [np.pi/2 + 2*np.pi*k/n for k in range(n)]
    px = [cx + r * np.cos(a) for a in angles]
    py = [cy + r * np.sin(a) for a in angles]
    px.append(px[0])
    py.append(py[0])
    ax.fill(px[:-1], py[:-1], color='lightgreen', alpha=0.3, zorder=3)
    ax.plot(px, py, 'g-', lw=2, zorder=4)
    ax.text(cx, cy, 'TV\n(Pentagon)', fontsize=9, color='green', ha='center')

    # ── Right: Sectional Top View with hatching ──
    ax2 = axes[1]
    ax2.set_xlim(-4, 4)
    ax2.set_ylim(-5, 4)
    ax2.set_aspect('equal')
    ax2.axis('off')
    ax2.set_title('Sectional Top View (Hatched)', fontsize=11, pad=8)

    # Pentagonal outline
    cx2, cy2 = 0, -1
    px2 = [cx2 + r * np.cos(a) for a in angles]
    py2 = [cy2 + r * np.sin(a) for a in angles]
    px2.append(px2[0])
    py2.append(py2[0])
    ax2.fill(px2[:-1], py2[:-1], color='#ffe0e0', alpha=0.5, zorder=3)
    ax2.plot(px2, py2, 'r-', lw=2, zorder=4)

    # Section hatching (45° lines)
    for d in np.arange(-2, 2, 0.2):
        ax2.plot([d-1.5, d+1.5], [cy2-1.5, cy2+1.5], 'gray', lw=0.4, alpha=0.5)

    ax2.text(cx2, cy2, 'Section\n(Hatched)', fontsize=9, color='red', ha='center', fontweight='bold')

    ax2.text(0, -4,
             "The sectional TV of a prism cut by\n"
             "an inclined plane shows the true shape\n"
             "of the cut surface with section hatching.",
             ha='center', fontsize=8, style='italic',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.suptitle('Section of a Pentagonal Prism by an Inclined Plane', fontsize=13, y=0.98)
    fig.tight_layout(rect=[0, 0, 1, 0.94])
    fig.savefig(os.path.join(OUT, "cuet-eg-sections-53-prism-section.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-sections-53-prism-section.png")


# =============================================================================
# IMAGE 4 — Section of a Pyramid with true shape (Hard)
# Shows FV with cutting plane, sectional TV, and auxiliary true shape
# =============================================================================
def draw_pyramid_section():
    fig, axes = plt.subplots(1, 3, figsize=(15, 6.5))
    fig.patch.set_facecolor('white')

    # ── Left: FV of square pyramid with cutting plane ──
    ax = axes[0]
    ax.set_xlim(-3.5, 3.5)
    ax.set_ylim(-0.5, 5.5)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Front View with\nCutting Plane', fontsize=10, pad=8)

    # Pyramid FV: triangle
    base_w = 3.0
    pyr_h = 4.5
    tri_x = [-base_w/2, base_w/2, 0, -base_w/2]
    tri_y = [0.3, 0.3, 0.3+pyr_h, 0.3]
    ax.fill(tri_x, tri_y, color='#e0e8ff', alpha=0.4, zorder=3)
    ax.plot(tri_x, tri_y, 'b-', lw=2, zorder=4)
    ax.plot([0, 0], [0.3, 0.3+pyr_h], 'k-.', lw=0.5, zorder=2)

    # Cutting plane (inclined)
    cp_y1 = 1.5
    cp_y2 = 3.0
    # Get x at these y values on left and right slant edges
    def x_left(y): return -base_w/2 * (0.3+pyr_h - y) / pyr_h
    def x_right(y): return base_w/2 * (0.3+pyr_h - y) / pyr_h

    ax.plot([x_left(cp_y1)-0.5, x_right(cp_y2)+0.5], [cp_y1, cp_y2], 'r-', lw=2.5, zorder=5)
    ax.text(x_left(cp_y1)-1.2, cp_y1, 'A', fontsize=12, color='red', fontweight='bold')
    ax.text(x_right(cp_y2)+0.8, cp_y2, 'A', fontsize=12, color='red', fontweight='bold')

    # Arrows
    ax.annotate('', xy=(x_left(cp_y1)-0.5, cp_y1), xytext=(x_left(cp_y1)-0.5, cp_y1+0.5),
                arrowprops=dict(arrowstyle='->', color='red', lw=1.5))
    ax.annotate('', xy=(x_right(cp_y2)+0.5, cp_y2), xytext=(x_right(cp_y2)+0.5, cp_y2+0.5),
                arrowprops=dict(arrowstyle='->', color='red', lw=1.5))

    # Points on the cut
    # Mark where cutting plane intersects the edges
    # Left slant: y = cp_y1 at the cutting plane
    p1 = (x_left(cp_y1), cp_y1)
    p2 = (x_right(cp_y2), cp_y2)
    ax.plot(*p1, 'ro', ms=4, zorder=6)
    ax.plot(*p2, 'ro', ms=4, zorder=6)
    ax.text(p1[0]-0.4, p1[1]-0.3, "1'", fontsize=9, color='red')
    ax.text(p2[0]+0.2, p2[1]-0.3, "2'", fontsize=9, color='red')

    # Hatching above cut
    for yy in np.arange(cp_y2+0.2, 0.3+pyr_h, 0.25):
        hw = base_w/2 * (0.3+pyr_h - yy) / pyr_h
        ax.plot([-hw, hw], [yy, yy-0.1], 'gray', lw=0.3, alpha=0.4)
    ax.text(0, 0.3+pyr_h-0.5, 'Removed', fontsize=8, color='gray', ha='center', style='italic')
    ax.text(0, 0.8, 'Retained\n(Frustum)', fontsize=8, color='blue', ha='center', style='italic')

    # ── Middle: Sectional Top View ──
    ax2 = axes[1]
    ax2.set_xlim(-3, 3)
    ax2.set_ylim(-3, 3)
    ax2.set_aspect('equal')
    ax2.axis('off')
    ax2.set_title('Sectional Top View', fontsize=10, pad=8)

    # Square base outline
    s = 1.5
    sq_x = [-s, s, s, -s, -s]
    sq_y = [s, s, -s, -s, s]
    ax2.fill(sq_x[:-1], sq_y[:-1], color='lightgreen', alpha=0.3, zorder=2)
    ax2.plot(sq_x, sq_y, 'g-', lw=1.5, zorder=3)

    # Section cut through the pyramid (a quadrilateral)
    # The cut creates a trapezoidal section
    sect_x = [-1.0, 1.0, 0.7, -0.7, -1.0]
    sect_y = [1.2, 1.2, -0.8, -0.8, 1.2]
    ax2.fill(sect_x, sect_y, color='#ffe0e0', alpha=0.6, zorder=4)
    ax2.plot(sect_x, sect_y, 'r-', lw=2, zorder=5)

    # Hatching
    for d in np.arange(-1.5, 1.5, 0.15):
        ax2.plot([d-1, d+1], [-0.5, 1.5], 'gray', lw=0.3, alpha=0.5)

    ax2.text(0, 0.2, 'Section', fontsize=9, color='red', ha='center', fontweight='bold')

    # ── Right: True Shape of Section ──
    ax3 = axes[2]
    ax3.set_xlim(-3, 3)
    ax3.set_ylim(-3, 3)
    ax3.set_aspect('equal')
    ax3.axis('off')
    ax3.set_title('True Shape of Section\n(by Auxiliary Plane)', fontsize=10, pad=8)

    # The true shape is a trapezoid (for a pyramid cut by inclined plane)
    ts_x = [-1.2, 1.2, 0.8, -0.8, -1.2]
    ts_y = [-1.0, -1.0, 1.2, 1.2, -1.0]
    ax3.fill(ts_x, ts_y, color='#ffe0e0', alpha=0.6, zorder=3)
    ax3.plot(ts_x, ts_y, 'r-', lw=2, zorder=4)

    # Hatching (45° section lines)
    for d in np.arange(-2.5, 2.5, 0.2):
        ax3.plot([d-2, d+2], [-2, 2], 'gray', lw=0.4, alpha=0.5)

    ax3.text(0, 0.1, 'Trapezoid\n(True Shape)', fontsize=10, color='red',
             ha='center', fontweight='bold')

    # Label vertices
    for idx, (x, y, lbl) in enumerate([(ts_x[0], ts_y[0], '1'),
                                         (ts_x[1], ts_y[1], '2'),
                                         (ts_x[2], ts_y[2], '3'),
                                         (ts_x[3], ts_y[3], '4')]):
        ax3.plot(x, y, 'ro', ms=4, zorder=5)
        ax3.text(x + (0.3 if x > 0 else -0.5), y + (0.2 if y > 0 else -0.3),
                 lbl, fontsize=10, color='red', fontweight='bold')

    fig.suptitle('Section of a Square Pyramid by an Inclined Plane', fontsize=13, y=0.98)
    fig.tight_layout(rect=[0, 0, 1, 0.94])
    fig.savefig(os.path.join(OUT, "cuet-eg-sections-54-pyramid-section.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-sections-54-pyramid-section.png")


if __name__ == "__main__":
    print("Generating EG B05 diagram images...")
    draw_cylinder_section()
    draw_cone_sections()
    draw_prism_section()
    draw_pyramid_section()
    print("Done! 4 images saved to", OUT)
