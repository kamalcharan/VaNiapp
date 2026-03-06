"""
Generate 4 diagram images for CUET EG B06 (Development of Surfaces).
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
# IMAGE 1 — Development of a Right Circular Cylinder (Easy)
# =============================================================================
def draw_cylinder_development():
    fig, axes = plt.subplots(1, 2, figsize=(13, 6))
    fig.patch.set_facecolor('white')

    # ── Left: Cylinder 3D-ish view ──
    ax = axes[0]
    ax.set_xlim(-3, 3)
    ax.set_ylim(-1, 5)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Right Circular Cylinder', fontsize=11, pad=8)

    r = 1.2
    h = 3.0

    # Body (rectangle outline)
    ax.plot([-r, -r], [0, h], 'b-', lw=2)
    ax.plot([r, r], [0, h], 'b-', lw=2)

    # Top ellipse
    t = np.linspace(0, 2*np.pi, 100)
    ax.plot(r*np.cos(t), h + 0.3*np.sin(t), 'b-', lw=2)
    # Bottom ellipse (front half solid, back half dashed)
    ax.plot(r*np.cos(t[:50]), 0.3*np.sin(t[:50]), 'b-', lw=2)
    ax.plot(r*np.cos(t[50:]), 0.3*np.sin(t[50:]), 'b--', lw=1)

    # Axis
    ax.plot([0, 0], [0, h], 'k-.', lw=0.6)

    # Labels
    ax.annotate('', xy=(r+0.5, h), xytext=(r+0.5, 0),
                arrowprops=dict(arrowstyle='<->', color='blue', lw=1))
    ax.text(r+0.8, h/2, 'h', fontsize=12, color='blue', ha='left')

    ax.annotate('', xy=(r, -0.5), xytext=(0, -0.5),
                arrowprops=dict(arrowstyle='<->', color='purple', lw=1))
    ax.text(r/2, -0.9, 'r', fontsize=12, color='purple', ha='center')

    ax.text(0, h+0.7, 'Circumference = 2πr', fontsize=9, color='gray',
            ha='center', style='italic')

    # ── Right: Development (unfolded rectangle) ──
    ax2 = axes[1]
    ax2.set_xlim(-0.5, 9)
    ax2.set_ylim(-1, 5)
    ax2.set_aspect('equal')
    ax2.axis('off')
    ax2.set_title('Development (Unfolded Surface)', fontsize=11, pad=8)

    circ = 2 * np.pi * r  # ~7.54
    dev_w = circ

    # Rectangle
    rect_x = [0, dev_w, dev_w, 0, 0]
    rect_y = [0, 0, h, h, 0]
    ax2.fill(rect_x, rect_y, color='#e0f0ff', alpha=0.5, zorder=3)
    ax2.plot(rect_x, rect_y, 'b-', lw=2, zorder=4)

    # Dimensions
    ax2.annotate('', xy=(dev_w, -0.4), xytext=(0, -0.4),
                arrowprops=dict(arrowstyle='<->', color='red', lw=1))
    ax2.text(dev_w/2, -0.8, 'πd = 2πr', fontsize=11, color='red', ha='center', fontweight='bold')

    ax2.annotate('', xy=(dev_w+0.4, h), xytext=(dev_w+0.4, 0),
                arrowprops=dict(arrowstyle='<->', color='blue', lw=1))
    ax2.text(dev_w+0.7, h/2, 'h', fontsize=12, color='blue', ha='left')

    # Division lines (12 parts)
    n = 12
    for i in range(1, n):
        x = i * dev_w / n
        ax2.plot([x, x], [0, h], 'g--', lw=0.4, alpha=0.5)
    # Label a few
    ax2.text(0, -0.1, 'A', fontsize=9, color='green', ha='center', va='top')
    ax2.text(dev_w, -0.1, 'A', fontsize=9, color='green', ha='center', va='top')

    ax2.text(dev_w/2, h/2, 'Rectangle\nWidth = πd\nHeight = h',
             fontsize=10, ha='center', color='blue',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.8))

    fig.suptitle('Development of a Right Circular Cylinder', fontsize=13, y=0.98)
    fig.tight_layout(rect=[0, 0, 1, 0.94])
    fig.savefig(os.path.join(OUT, "cuet-eg-development-61-cylinder.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-development-61-cylinder.png")


# =============================================================================
# IMAGE 2 — Development of a Right Circular Cone (Medium)
# =============================================================================
def draw_cone_development():
    fig, axes = plt.subplots(1, 2, figsize=(13, 7))
    fig.patch.set_facecolor('white')

    # ── Left: Cone ──
    ax = axes[0]
    ax.set_xlim(-3, 3)
    ax.set_ylim(-1, 5.5)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Right Circular Cone', fontsize=11, pad=8)

    r = 1.5
    h = 4.0
    slant = np.sqrt(r**2 + h**2)

    # Cone outline
    ax.plot([-r, 0], [0, h], 'b-', lw=2)
    ax.plot([r, 0], [0, h], 'b-', lw=2)

    # Base ellipse
    t = np.linspace(0, 2*np.pi, 100)
    ax.plot(r*np.cos(t[:50]), 0.25*np.sin(t[:50]), 'b-', lw=2)
    ax.plot(r*np.cos(t[50:]), 0.25*np.sin(t[50:]), 'b--', lw=1)

    # Axis
    ax.plot([0, 0], [0, h], 'k-.', lw=0.6)

    # Labels
    ax.plot(0, h, 'ro', ms=4)
    ax.text(0.2, h+0.2, 'O (apex)', fontsize=9, color='red')

    ax.annotate('', xy=(r+0.5, h), xytext=(r+0.5, 0),
                arrowprops=dict(arrowstyle='<->', color='blue', lw=1))
    ax.text(r+0.8, h/2, 'h', fontsize=12, color='blue')

    ax.annotate('', xy=(r, -0.5), xytext=(0, -0.5),
                arrowprops=dict(arrowstyle='<->', color='purple', lw=1))
    ax.text(r/2, -0.9, 'r', fontsize=12, color='purple', ha='center')

    # Slant height label
    ax.annotate('', xy=(r*0.5, h*0.5), xytext=(r, 0),
                arrowprops=dict(arrowstyle='->', color='red', lw=1))
    ax.text(r*0.9, h*0.3, 'l', fontsize=12, color='red')

    ax.text(0, -1.3, f'l = √(h² + r²)', fontsize=9, color='gray',
            ha='center', style='italic')

    # ── Right: Development (sector) ──
    ax2 = axes[1]
    ax2.set_xlim(-5, 5)
    ax2.set_ylim(-1, 6)
    ax2.set_aspect('equal')
    ax2.axis('off')
    ax2.set_title('Development (Sector of Circle)', fontsize=11, pad=8)

    # Sector angle = (r/l) * 360° or (2πr / l) radians
    sector_angle = (r / slant) * 2 * np.pi  # radians
    R = slant  # radius of sector = slant height

    # Center at origin, sector centered vertically
    cx, cy = 0, 0.5
    start_angle = np.pi/2 - sector_angle/2
    end_angle = np.pi/2 + sector_angle/2

    # Sector arc
    arc_t = np.linspace(start_angle, end_angle, 100)
    arc_x = cx + R * np.cos(arc_t)
    arc_y = cy + R * np.sin(arc_t)

    # Fill sector
    sect_x = [cx] + list(arc_x) + [cx]
    sect_y = [cy] + list(arc_y) + [cy]
    ax2.fill(sect_x, sect_y, color='#ffe0e0', alpha=0.5, zorder=3)
    ax2.plot(sect_x, sect_y, 'r-', lw=2, zorder=4)

    # Apex
    ax2.plot(cx, cy, 'ro', ms=5, zorder=5)
    ax2.text(cx+0.2, cy-0.3, 'O', fontsize=11, color='red', fontweight='bold')

    # Radius labels
    ax2.text(arc_x[0]*0.5+cx*0.5-0.3, arc_y[0]*0.5+cy*0.5, 'l', fontsize=12, color='red')
    ax2.text(arc_x[-1]*0.5+cx*0.5+0.2, arc_y[-1]*0.5+cy*0.5, 'l', fontsize=12, color='red')

    # Arc length label
    mid_idx = len(arc_t)//2
    ax2.text(arc_x[mid_idx]+0.3, arc_y[mid_idx]+0.2, 'Arc = 2πr',
             fontsize=10, color='blue', fontweight='bold')

    # Angle label
    angle_arc = np.linspace(start_angle, end_angle, 30)
    ax2.plot(cx + 0.8*np.cos(angle_arc), cy + 0.8*np.sin(angle_arc), 'g-', lw=1)
    ax2.text(cx, cy+1.1, 'θ = (r/l)×360°', fontsize=9, color='green', ha='center')

    # Division lines (generators)
    n = 12
    for i in range(n+1):
        a = start_angle + i * sector_angle / n
        lw_val = 1.5 if (i == 0 or i == n) else 0.4
        ax2.plot([cx, cx + R*np.cos(a)], [cy, cy + R*np.sin(a)],
                'r-' if (i == 0 or i == n) else 'g--', lw=lw_val, alpha=0.6)

    # Labels at ends
    ax2.text(arc_x[0]-0.3, arc_y[0]-0.2, 'A', fontsize=10, color='red', fontweight='bold')
    ax2.text(arc_x[-1]+0.2, arc_y[-1]-0.2, 'A', fontsize=10, color='red', fontweight='bold')

    ax2.text(0, -0.8,
             "Sector radius = Slant height (l)\n"
             "Arc length = Base circumference (2πr)\n"
             "Sector angle θ = (r/l) × 360°",
             ha='center', fontsize=8, style='italic',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.suptitle('Development of a Right Circular Cone', fontsize=13, y=0.98)
    fig.tight_layout(rect=[0, 0, 1, 0.94])
    fig.savefig(os.path.join(OUT, "cuet-eg-development-62-cone.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-development-62-cone.png")


# =============================================================================
# IMAGE 3 — Development of a Prism (Easy/Medium)
# =============================================================================
def draw_prism_development():
    fig, axes = plt.subplots(1, 2, figsize=(14, 6))
    fig.patch.set_facecolor('white')

    # ── Left: Triangular Prism ──
    ax = axes[0]
    ax.set_xlim(-3, 3.5)
    ax.set_ylim(-1.5, 5)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Triangular Prism (Equilateral, side a)', fontsize=10, pad=8)

    a = 2.0  # side length
    h = 3.5

    # Base triangle (projected as flat)
    bx = [-a/2, a/2, 0, -a/2]
    by = [0, 0, -0.5, 0]

    # Top triangle
    tx = [-a/2, a/2, 0, -a/2]
    ty = [h, h, h-0.5, h]

    # Front face
    ax.fill([-a/2, a/2, a/2, -a/2], [0, 0, h, h], color='#e0e8ff', alpha=0.4)
    ax.plot([-a/2, a/2, a/2, -a/2, -a/2], [0, 0, h, h, 0], 'b-', lw=2)

    # Right face (partial)
    ax.fill([a/2, a/2+0.8, a/2+0.8, a/2], [0, -0.3, h-0.3, h], color='#e0f0e0', alpha=0.4)
    ax.plot([a/2, a/2+0.8], [0, -0.3], 'b-', lw=1.5)
    ax.plot([a/2, a/2+0.8], [h, h-0.3], 'b-', lw=1.5)
    ax.plot([a/2+0.8, a/2+0.8], [-0.3, h-0.3], 'b-', lw=1.5)

    # Left face (partial, hidden)
    ax.plot([-a/2, -a/2-0.8], [0, -0.3], 'b--', lw=1)
    ax.plot([-a/2, -a/2-0.8], [h, h-0.3], 'b--', lw=1)
    ax.plot([-a/2-0.8, -a/2-0.8], [-0.3, h-0.3], 'b--', lw=1)

    # Labels
    ax.text(0, h/2, 'Face 1', fontsize=9, color='blue', ha='center')
    ax.annotate('', xy=(-a/2-0.3, h), xytext=(-a/2-0.3, 0),
                arrowprops=dict(arrowstyle='<->', color='red', lw=1))
    ax.text(-a/2-0.6, h/2, 'h', fontsize=12, color='red')

    ax.annotate('', xy=(a/2, -0.8), xytext=(-a/2, -0.8),
                arrowprops=dict(arrowstyle='<->', color='purple', lw=1))
    ax.text(0, -1.2, 'a', fontsize=12, color='purple', ha='center')

    # ── Right: Development ──
    ax2 = axes[1]
    ax2.set_xlim(-0.5, 8)
    ax2.set_ylim(-1.5, 5)
    ax2.set_aspect('equal')
    ax2.axis('off')
    ax2.set_title('Development (3 Rectangles + 2 Triangles)', fontsize=10, pad=8)

    # 3 rectangular faces unfolded side by side
    colors = ['#e0e8ff', '#e0f0e0', '#ffe8e0']
    labels = ['Face 1', 'Face 2', 'Face 3']
    for i in range(3):
        x0 = i * a
        rx = [x0, x0+a, x0+a, x0, x0]
        ry = [0, 0, h, h, 0]
        ax2.fill(rx, ry, color=colors[i], alpha=0.5, zorder=3)
        ax2.plot(rx, ry, 'b-', lw=2 if (i == 0 or i == 2) else 1.5, zorder=4)
        ax2.text(x0 + a/2, h/2, labels[i], fontsize=9, color='blue', ha='center')

    # Closing edge
    ax2.plot([3*a, 3*a], [0, h], 'b-', lw=2)

    # Vertex labels
    for i in range(4):
        ax2.text(i*a, -0.2, f'{chr(65+i%3)}', fontsize=10, color='red', ha='center', va='top', fontweight='bold')
        ax2.text(i*a, h+0.2, f"{chr(65+i%3)}'", fontsize=10, color='red', ha='center', va='bottom', fontweight='bold')

    # Stretch line dimensions
    ax2.annotate('', xy=(a, -0.8), xytext=(0, -0.8),
                arrowprops=dict(arrowstyle='<->', color='purple', lw=1))
    ax2.text(a/2, -1.2, 'a', fontsize=11, color='purple', ha='center')

    ax2.annotate('', xy=(3*a, -0.8), xytext=(2*a, -0.8),
                arrowprops=dict(arrowstyle='<->', color='purple', lw=1))
    ax2.text(2.5*a, -1.2, 'a', fontsize=11, color='purple', ha='center')

    # Total stretch-out
    ax2.annotate('', xy=(3*a, -1.4), xytext=(0, -1.4),
                arrowprops=dict(arrowstyle='<->', color='green', lw=1.2))
    ax2.text(1.5*a, -1.8, 'Stretch-out = 3a (perimeter)', fontsize=9, color='green', ha='center')

    fig.suptitle('Development of an Equilateral Triangular Prism', fontsize=13, y=0.98)
    fig.tight_layout(rect=[0, 0, 1, 0.94])
    fig.savefig(os.path.join(OUT, "cuet-eg-development-63-prism.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-development-63-prism.png")


# =============================================================================
# IMAGE 4 — Development of a Pyramid (Medium/Hard)
# =============================================================================
def draw_pyramid_development():
    fig, axes = plt.subplots(1, 2, figsize=(13, 7))
    fig.patch.set_facecolor('white')

    # ── Left: Square Pyramid ──
    ax = axes[0]
    ax.set_xlim(-3, 3)
    ax.set_ylim(-1.5, 5.5)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Square Pyramid', fontsize=11, pad=8)

    a = 2.0  # base side
    h_pyr = 4.0
    slant_face = np.sqrt(h_pyr**2 + (a/2)**2)  # slant height of triangular face

    # Front face (triangle)
    ax.fill([-a/2, a/2, 0], [0, 0, h_pyr], color='#ffe0e0', alpha=0.4)
    ax.plot([-a/2, a/2, 0, -a/2], [0, 0, h_pyr, 0], 'r-', lw=2)

    # Side edges (partial)
    ax.plot([0, a/2+0.6], [h_pyr, -0.3], 'r--', lw=1)
    ax.plot([0, -a/2-0.6], [h_pyr, -0.3], 'r--', lw=1)

    # Base
    ax.plot([-a/2, a/2], [0, 0], 'r-', lw=2)
    ax.plot([a/2, a/2+0.6], [0, -0.3], 'r-', lw=1.5)
    ax.plot([-a/2, -a/2-0.6], [0, -0.3], 'r-', lw=1.5)
    ax.plot([-a/2-0.6, a/2+0.6], [-0.3, -0.3], 'r--', lw=1)

    # Apex
    ax.plot(0, h_pyr, 'ro', ms=5)
    ax.text(0.2, h_pyr+0.2, 'O', fontsize=11, color='red', fontweight='bold')

    # Labels
    ax.annotate('', xy=(-a/2-1, h_pyr), xytext=(-a/2-1, 0),
                arrowprops=dict(arrowstyle='<->', color='blue', lw=1))
    ax.text(-a/2-1.3, h_pyr/2, 'h', fontsize=12, color='blue')

    ax.annotate('', xy=(a/2, -0.8), xytext=(-a/2, -0.8),
                arrowprops=dict(arrowstyle='<->', color='purple', lw=1))
    ax.text(0, -1.2, 'a', fontsize=12, color='purple', ha='center')

    # Slant height
    ax.text(a/4+0.3, h_pyr/2, 'l', fontsize=12, color='green', style='italic')

    # ── Right: Development (4 isosceles triangles around center) ──
    ax2 = axes[1]
    ax2.set_xlim(-5, 5)
    ax2.set_ylim(-2, 5.5)
    ax2.set_aspect('equal')
    ax2.axis('off')
    ax2.set_title('Development (4 Triangular Faces)', fontsize=11, pad=8)

    # Slant edge length (apex to base corner)
    half_diag = a * np.sqrt(2) / 2
    slant_edge = np.sqrt(h_pyr**2 + half_diag**2)

    # Use slant edge as radius, base side as chord
    # Each triangle: two sides = slant_edge, base = a
    # Half-angle at apex = arcsin(a/2 / slant_edge)
    half_apex_angle = np.arcsin(a / (2 * slant_edge))
    full_apex_angle = 2 * half_apex_angle

    # Draw 4 triangles radiating from apex O
    cx, cy = 0, 0.5
    start = np.pi/2 - 2*full_apex_angle  # start angle

    colors_dev = ['#ffe0e0', '#e0ffe0', '#e0e0ff', '#fff0e0']
    labels_dev = ['1', '2', '3', '4']

    for i in range(4):
        a1 = start + i * full_apex_angle
        a2 = a1 + full_apex_angle

        x1 = cx + slant_edge * np.cos(a1)
        y1 = cy + slant_edge * np.sin(a1)
        x2 = cx + slant_edge * np.cos(a2)
        y2 = cy + slant_edge * np.sin(a2)

        ax2.fill([cx, x1, x2], [cy, y1, y2], color=colors_dev[i], alpha=0.5, zorder=3)
        ax2.plot([cx, x1, x2, cx], [cy, y1, y2, cy], 'r-', lw=1.5, zorder=4)

        # Face label
        mx = (cx + x1 + x2) / 3
        my = (cy + y1 + y2) / 3
        ax2.text(mx, my, labels_dev[i], fontsize=10, color='blue', ha='center', fontweight='bold')

        # Base corner labels
        ax2.text(x1 + 0.15*np.cos(a1), y1 + 0.15*np.sin(a1),
                chr(65+i), fontsize=9, color='red', ha='center', fontweight='bold')

    # Last corner label
    a_last = start + 4 * full_apex_angle
    x_last = cx + slant_edge * np.cos(a_last)
    y_last = cy + slant_edge * np.sin(a_last)
    ax2.text(x_last + 0.15*np.cos(a_last), y_last + 0.15*np.sin(a_last),
            'A', fontsize=9, color='red', ha='center', fontweight='bold')

    # Apex label
    ax2.plot(cx, cy, 'ro', ms=5, zorder=5)
    ax2.text(cx-0.3, cy-0.3, 'O', fontsize=11, color='red', fontweight='bold')

    # Slant edge label
    ax2.text(cx + slant_edge*0.4*np.cos(start+full_apex_angle/2),
             cy + slant_edge*0.4*np.sin(start+full_apex_angle/2) + 0.3,
             'Slant\nedge', fontsize=8, color='green', ha='center', style='italic')

    ax2.text(0, -1.5,
             "Each face: isosceles triangle\n"
             "Two equal sides = slant edge\n"
             "Base = side of square (a)",
             ha='center', fontsize=8, style='italic',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.suptitle('Development of a Square Pyramid', fontsize=13, y=0.98)
    fig.tight_layout(rect=[0, 0, 1, 0.94])
    fig.savefig(os.path.join(OUT, "cuet-eg-development-64-pyramid.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-development-64-pyramid.png")


if __name__ == "__main__":
    print("Generating EG B06 diagram images...")
    draw_cylinder_development()
    draw_cone_development()
    draw_prism_development()
    draw_pyramid_development()
    print("Done! 4 images saved to", OUT)
