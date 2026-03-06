"""
Generate 4 diagram images for CUET EG B07 (Isometric Projection).
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

# Isometric axes helpers (30° from horizontal)
COS30 = np.cos(np.radians(30))
SIN30 = np.sin(np.radians(30))

def iso_to_2d(x, y, z, origin=(0, 0)):
    """Convert isometric (x,y,z) to 2D screen coordinates.
    x = right-forward axis (30° right), y = left-forward axis (30° left), z = vertical up.
    """
    ox, oy = origin
    sx = ox + x * COS30 - y * COS30
    sy = oy + x * SIN30 + y * SIN30 + z
    return sx, sy


# =============================================================================
# IMAGE 1 — Isometric Axes and Scale (Easy)
# =============================================================================
def draw_isometric_axes():
    fig, axes = plt.subplots(1, 2, figsize=(13, 6))
    fig.patch.set_facecolor('white')

    # ── Left: Isometric axes ──
    ax = axes[0]
    ax.set_xlim(-4, 4)
    ax.set_ylim(-1, 5)
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('Isometric Axes', fontsize=11, pad=8)

    O = (0, 0.5)
    L = 3.5

    # Three axes from origin
    # Z-axis (vertical up)
    ax.annotate('', xy=(O[0], O[1]+L), xytext=O,
                arrowprops=dict(arrowstyle='->', color='blue', lw=2))
    ax.text(O[0]+0.2, O[1]+L+0.2, 'Z (Vertical)', fontsize=10, color='blue', fontweight='bold')

    # X-axis (30° right)
    xend = (O[0] + L*COS30, O[1] + L*SIN30)
    ax.annotate('', xy=xend, xytext=O,
                arrowprops=dict(arrowstyle='->', color='red', lw=2))
    ax.text(xend[0]+0.2, xend[1], 'X (30° right)', fontsize=10, color='red', fontweight='bold')

    # Y-axis (30° left)
    yend = (O[0] - L*COS30, O[1] + L*SIN30)
    ax.annotate('', xy=yend, xytext=O,
                arrowprops=dict(arrowstyle='->', color='green', lw=2))
    ax.text(yend[0]-1.5, yend[1], 'Y (30° left)', fontsize=10, color='green', fontweight='bold')

    # Angle arcs
    # 30° from horizontal for X
    horiz_r = (O[0]+1.5, O[1])
    arc_a = np.linspace(0, np.radians(30), 20)
    ax.plot(O[0]+1.2*np.cos(arc_a), O[1]+1.2*np.sin(arc_a), 'r-', lw=1)
    ax.text(O[0]+1.4, O[1]+0.3, '30°', fontsize=9, color='red')

    # 30° from horizontal for Y
    arc_b = np.linspace(np.radians(150), np.radians(180), 20)
    ax.plot(O[0]+1.2*np.cos(arc_b), O[1]+1.2*np.sin(arc_b), 'g-', lw=1)
    ax.text(O[0]-1.8, O[1]+0.3, '30°', fontsize=9, color='green')

    # 120° between X and Y
    arc_c = np.linspace(np.radians(30), np.radians(150), 30)
    ax.plot(O[0]+0.7*np.cos(arc_c), O[1]+0.7*np.sin(arc_c), 'purple', lw=0.8)
    ax.text(O[0]-0.3, O[1]+1.0, '120°', fontsize=8, color='purple')

    # Horizontal reference
    ax.plot([O[0]-2, O[0]+2], [O[1], O[1]], 'k--', lw=0.5, alpha=0.5)

    ax.plot(*O, 'ko', ms=5)
    ax.text(O[0]+0.15, O[1]-0.3, 'O', fontsize=11, fontweight='bold')

    # ── Right: Isometric vs Natural scale ──
    ax2 = axes[1]
    ax2.set_xlim(-1, 8)
    ax2.set_ylim(-0.5, 5)
    ax2.set_aspect('equal')
    ax2.axis('off')
    ax2.set_title('Isometric Scale vs Natural Scale', fontsize=11, pad=8)

    # Natural scale bar
    ax2.plot([0.5, 5.5], [3.5, 3.5], 'b-', lw=3)
    ax2.text(0.5, 3.8, '0', fontsize=9, color='blue')
    for i in range(1, 6):
        ax2.plot([0.5+i, 0.5+i], [3.4, 3.6], 'b-', lw=1.5)
        ax2.text(0.5+i, 3.8, str(i*10), fontsize=8, color='blue', ha='center')
    ax2.text(3, 4.2, 'Natural (True) Scale', fontsize=10, color='blue', ha='center', fontweight='bold')

    # Isometric scale bar (factor = 0.8165 ≈ sqrt(2/3))
    iso_factor = np.sqrt(2/3)
    iso_len = 5 * iso_factor
    ax2.plot([0.5, 0.5+iso_len], [2, 2], 'r-', lw=3)
    ax2.text(0.5, 2.3, '0', fontsize=9, color='red')
    for i in range(1, 6):
        x = 0.5 + i * iso_factor
        ax2.plot([x, x], [1.9, 2.1], 'r-', lw=1.5)
        ax2.text(x, 2.3, str(i*10), fontsize=8, color='red', ha='center')
    ax2.text(0.5+iso_len/2, 1.4, 'Isometric Scale (×0.816)', fontsize=10, color='red', ha='center', fontweight='bold')

    # Comparison arrows
    ax2.annotate('', xy=(5.5, 3.2), xytext=(0.5, 3.2),
                arrowprops=dict(arrowstyle='<->', color='blue', lw=0.8))
    ax2.text(3, 2.9, '50 mm (true)', fontsize=8, color='blue', ha='center')

    ax2.annotate('', xy=(0.5+iso_len, 1.7), xytext=(0.5, 1.7),
                arrowprops=dict(arrowstyle='<->', color='red', lw=0.8))
    ax2.text(0.5+iso_len/2, 1.0, f'{iso_len*10:.1f} mm (iso)', fontsize=8, color='red', ha='center')

    ax2.text(4, 0.3,
             "Isometric scale = √(2/3) ≈ 0.816\n"
             "Isometric length = True length × 0.816",
             fontsize=8, style='italic', ha='center',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.suptitle('Isometric Axes and Scale', fontsize=13, y=0.98)
    fig.tight_layout(rect=[0, 0, 1, 0.94])
    fig.savefig(os.path.join(OUT, "cuet-eg-isometric-71-axes-scale.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-isometric-71-axes-scale.png")


# =============================================================================
# IMAGE 2 — Isometric View of a Rectangular Block (Easy/Medium)
# =============================================================================
def draw_iso_block():
    fig, ax = plt.subplots(figsize=(8, 7))
    ax.set_xlim(-5, 6)
    ax.set_ylim(-2, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    O = (0, 0)
    L, W, H = 3.5, 2.5, 2.5  # length (x), width (y), height (z)

    # 8 corners of block
    corners = {
        'A': (0, 0, 0), 'B': (L, 0, 0), 'C': (L, W, 0), 'D': (0, W, 0),
        'E': (0, 0, H), 'F': (L, 0, H), 'G': (L, W, H), 'H': (0, W, H),
    }
    pts = {k: iso_to_2d(*v, origin=O) for k, v in corners.items()}

    # Faces (visible: top, right, front)
    # Top face: E, F, G, H
    top_x = [pts['E'][0], pts['F'][0], pts['G'][0], pts['H'][0]]
    top_y = [pts['E'][1], pts['F'][1], pts['G'][1], pts['H'][1]]
    ax.fill(top_x, top_y, color='#c0d8ff', alpha=0.6, zorder=3)

    # Right face: B, C, G, F
    right_x = [pts['B'][0], pts['C'][0], pts['G'][0], pts['F'][0]]
    right_y = [pts['B'][1], pts['C'][1], pts['G'][1], pts['F'][1]]
    ax.fill(right_x, right_y, color='#e0e0e0', alpha=0.6, zorder=3)

    # Front face: A, B, F, E
    front_x = [pts['A'][0], pts['B'][0], pts['F'][0], pts['E'][0]]
    front_y = [pts['A'][1], pts['B'][1], pts['F'][1], pts['E'][1]]
    ax.fill(front_x, front_y, color='#ffe0e0', alpha=0.6, zorder=3)

    # Visible edges
    visible_edges = [
        ('A','B'), ('B','C'), ('A','D'),  # bottom
        ('E','F'), ('F','G'), ('E','H'), ('G','H'),  # top
        ('A','E'), ('B','F'), ('C','G'),  # verticals
    ]
    for p1, p2 in visible_edges:
        ax.plot([pts[p1][0], pts[p2][0]], [pts[p1][1], pts[p2][1]], 'k-', lw=2, zorder=4)

    # Hidden edges
    hidden_edges = [('D','C'), ('D','H')]
    for p1, p2 in hidden_edges:
        ax.plot([pts[p1][0], pts[p2][0]], [pts[p1][1], pts[p2][1]], 'k--', lw=1, zorder=2)

    # Vertex labels
    for name, (sx, sy) in pts.items():
        offset_x = -0.4 if name in ['A','D','E','H'] else 0.3
        offset_y = -0.3 if name in ['A','B','C','D'] else 0.2
        ax.text(sx+offset_x, sy+offset_y, name, fontsize=10, color='navy', fontweight='bold')

    # Dimension labels
    # Length along AB (x-axis)
    mid_ab = ((pts['A'][0]+pts['B'][0])/2, (pts['A'][1]+pts['B'][1])/2)
    ax.text(mid_ab[0], mid_ab[1]-0.5, 'Length (L)', fontsize=9, color='red', ha='center')

    # Width along BC (y-axis)
    mid_bc = ((pts['B'][0]+pts['C'][0])/2, (pts['B'][1]+pts['C'][1])/2)
    ax.text(mid_bc[0]+0.5, mid_bc[1], 'Width (W)', fontsize=9, color='green')

    # Height along AE (z-axis)
    mid_ae = ((pts['A'][0]+pts['E'][0])/2, (pts['A'][1]+pts['E'][1])/2)
    ax.text(mid_ae[0]-0.8, mid_ae[1], 'H', fontsize=10, color='blue')

    ax.set_title('Isometric View of a Rectangular Block', fontsize=12, pad=10)
    ax.text(0.5, -1.5,
            "All edges along isometric axes are measurable.\n"
            "Faces appear as parallelograms, not true rectangles.\n"
            "Top face shown in blue, front in pink, side in gray.",
            ha='center', fontsize=8, style='italic',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-isometric-72-block.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-isometric-72-block.png")


# =============================================================================
# IMAGE 3 — Isometric Circle (Ellipse on isometric planes) (Medium)
# =============================================================================
def draw_iso_circle():
    fig, ax = plt.subplots(figsize=(9, 7))
    ax.set_xlim(-5, 6)
    ax.set_ylim(-2, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    O = (0, 0)

    # Draw isometric box outline (cube of side 3)
    s = 3
    corners = {
        'A': (0, 0, 0), 'B': (s, 0, 0), 'C': (s, s, 0), 'D': (0, s, 0),
        'E': (0, 0, s), 'F': (s, 0, s), 'G': (s, s, s), 'H': (0, s, s),
    }
    pts = {k: iso_to_2d(*v, origin=O) for k, v in corners.items()}

    # Draw cube edges (light)
    for p1, p2 in [('A','B'),('B','C'),('A','D'),('E','F'),('F','G'),('E','H'),('G','H'),('A','E'),('B','F'),('C','G')]:
        ax.plot([pts[p1][0],pts[p2][0]], [pts[p1][1],pts[p2][1]], 'k-', lw=0.8, alpha=0.3)
    for p1, p2 in [('D','C'),('D','H')]:
        ax.plot([pts[p1][0],pts[p2][0]], [pts[p1][1],pts[p2][1]], 'k--', lw=0.5, alpha=0.3)

    # Draw isometric ellipses on three visible faces
    # Top face (xy-plane at z=s): circle in the iso plane
    n_pts = 60
    r = s/2

    # Top face ellipse (in xy plane at z=s)
    t = np.linspace(0, 2*np.pi, n_pts)
    cx_top, cy_top = s/2, s/2
    top_pts = [iso_to_2d(cx_top + r*np.cos(a), cy_top + r*np.sin(a), s, O) for a in t]
    ax.fill([p[0] for p in top_pts], [p[1] for p in top_pts], color='#c0d8ff', alpha=0.5, zorder=5)
    ax.plot([p[0] for p in top_pts], [p[1] for p in top_pts], 'b-', lw=2, zorder=6)
    center_top = iso_to_2d(cx_top, cy_top, s, O)
    ax.text(center_top[0], center_top[1]+0.3, 'Top\nFace', fontsize=8, color='blue', ha='center', fontweight='bold')

    # Front face ellipse (in xz plane at y=0)
    front_pts = [iso_to_2d(cx_top + r*np.cos(a), 0, s/2 + r*np.sin(a), O) for a in t]
    ax.fill([p[0] for p in front_pts], [p[1] for p in front_pts], color='#ffe0e0', alpha=0.5, zorder=5)
    ax.plot([p[0] for p in front_pts], [p[1] for p in front_pts], 'r-', lw=2, zorder=6)
    center_front = iso_to_2d(cx_top, 0, s/2, O)
    ax.text(center_front[0], center_front[1], 'Front\nFace', fontsize=8, color='red', ha='center', fontweight='bold')

    # Right face ellipse (in yz plane at x=s)
    right_pts = [iso_to_2d(s, cy_top + r*np.cos(a), s/2 + r*np.sin(a), O) for a in t]
    ax.fill([p[0] for p in right_pts], [p[1] for p in right_pts], color='#e0ffe0', alpha=0.5, zorder=5)
    ax.plot([p[0] for p in right_pts], [p[1] for p in right_pts], 'g-', lw=2, zorder=6)
    center_right = iso_to_2d(s, cy_top, s/2, O)
    ax.text(center_right[0]+0.3, center_right[1], 'Side\nFace', fontsize=8, color='green', ha='center', fontweight='bold')

    ax.set_title('Circles Appear as Ellipses in Isometric View', fontsize=12, pad=10)
    ax.text(0.5, -1.5,
            "A circle on any isometric plane appears as an ellipse.\n"
            "The 4-center approximate method uses arcs to draw these.\n"
            "Each face orientation gives a differently oriented ellipse.",
            ha='center', fontsize=8, style='italic',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-isometric-73-circle-ellipse.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-isometric-73-circle-ellipse.png")


# =============================================================================
# IMAGE 4 — Isometric View of a Stepped Block (Hard)
# =============================================================================
def draw_iso_stepped():
    fig, ax = plt.subplots(figsize=(9, 7))
    ax.set_xlim(-5, 7)
    ax.set_ylim(-2, 7)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    O = (-1, -0.5)

    # Stepped block: base 4×3×1, upper step 2×3×1 (on top of left half)
    # Base block
    base = [
        ((0,0,0),(4,0,0)),((4,0,0),(4,3,0)),((0,0,0),(0,3,0)),
        ((0,0,1),(4,0,1)),((4,0,1),(4,3,1)),((0,0,1),(0,3,1)),((0,3,1),(4,3,1)),
        ((0,0,0),(0,0,1)),((4,0,0),(4,0,1)),((4,3,0),(4,3,1)),
    ]
    hidden_base = [((0,3,0),(4,3,0)),((0,3,0),(0,3,1))]

    # Upper step (sits on top of base, left half)
    upper = [
        ((0,0,1),(2,0,1)),  # front base edge (part of top face)
        ((0,0,2),(2,0,2)),((2,0,2),(2,3,2)),((0,0,2),(0,3,2)),((0,3,2),(2,3,2)),
        ((0,0,1),(0,0,2)),((2,0,1),(2,0,2)),((2,3,1),(2,3,2)),
        ((2,0,1),(2,3,1)),  # vertical face of step
    ]
    hidden_upper = [((0,3,1),(0,3,2))]

    def draw_edges(edges, style='k-', lw=2, zorder=4):
        for (x1,y1,z1),(x2,y2,z2) in edges:
            p1 = iso_to_2d(x1,y1,z1,O)
            p2 = iso_to_2d(x2,y2,z2,O)
            ax.plot([p1[0],p2[0]], [p1[1],p2[1]], style, lw=lw, zorder=zorder)

    # Fill faces for visual clarity
    # Base top face (right half, z=1)
    face_pts = [(2,0,1),(4,0,1),(4,3,1),(2,3,1)]
    fx = [iso_to_2d(*p,origin=O)[0] for p in face_pts]
    fy = [iso_to_2d(*p,origin=O)[1] for p in face_pts]
    ax.fill(fx, fy, color='#e0e8ff', alpha=0.5, zorder=2)

    # Upper top face (z=2)
    face_pts2 = [(0,0,2),(2,0,2),(2,3,2),(0,3,2)]
    fx2 = [iso_to_2d(*p,origin=O)[0] for p in face_pts2]
    fy2 = [iso_to_2d(*p,origin=O)[1] for p in face_pts2]
    ax.fill(fx2, fy2, color='#c0d8ff', alpha=0.5, zorder=3)

    # Front face of step (x: 0-2, z: 1-2)
    face_pts3 = [(0,0,1),(2,0,1),(2,0,2),(0,0,2)]
    fx3 = [iso_to_2d(*p,origin=O)[0] for p in face_pts3]
    fy3 = [iso_to_2d(*p,origin=O)[1] for p in face_pts3]
    ax.fill(fx3, fy3, color='#ffe0e0', alpha=0.5, zorder=3)

    # Front face of base (x: 0-4, z: 0-1)
    face_pts4 = [(0,0,0),(4,0,0),(4,0,1),(0,0,1)]
    fx4 = [iso_to_2d(*p,origin=O)[0] for p in face_pts4]
    fy4 = [iso_to_2d(*p,origin=O)[1] for p in face_pts4]
    ax.fill(fx4, fy4, color='#ffe8e0', alpha=0.5, zorder=2)

    # Step vertical face (x=2, y: 0-3, z: 1-2)
    face_pts5 = [(2,0,1),(2,3,1),(2,3,2),(2,0,2)]
    fx5 = [iso_to_2d(*p,origin=O)[0] for p in face_pts5]
    fy5 = [iso_to_2d(*p,origin=O)[1] for p in face_pts5]
    ax.fill(fx5, fy5, color='#e0e0e0', alpha=0.5, zorder=3)

    # Right face of base (x=4, y: 0-3, z: 0-1)
    face_pts6 = [(4,0,0),(4,3,0),(4,3,1),(4,0,1)]
    fx6 = [iso_to_2d(*p,origin=O)[0] for p in face_pts6]
    fy6 = [iso_to_2d(*p,origin=O)[1] for p in face_pts6]
    ax.fill(fx6, fy6, color='#e8e8e8', alpha=0.5, zorder=2)

    draw_edges(base)
    draw_edges(upper)
    draw_edges(hidden_base, 'k--', 1, 1)
    draw_edges(hidden_upper, 'k--', 1, 1)

    # Dimensions
    p1 = iso_to_2d(0,0,-0.3,O)
    p2 = iso_to_2d(4,0,-0.3,O)
    ax.annotate('', xy=p2, xytext=p1,
                arrowprops=dict(arrowstyle='<->', color='red', lw=1))
    pm = iso_to_2d(2,0,-0.6,O)
    ax.text(pm[0], pm[1], '40', fontsize=9, color='red', ha='center')

    p3 = iso_to_2d(4.3,0,0,O)
    p4 = iso_to_2d(4.3,3,0,O)
    ax.annotate('', xy=p4, xytext=p3,
                arrowprops=dict(arrowstyle='<->', color='green', lw=1))
    pm2 = iso_to_2d(4.5,1.5,0,O)
    ax.text(pm2[0], pm2[1], '30', fontsize=9, color='green')

    p5 = iso_to_2d(-0.3,0,0,O)
    p6 = iso_to_2d(-0.3,0,2,O)
    ax.annotate('', xy=p6, xytext=p5,
                arrowprops=dict(arrowstyle='<->', color='blue', lw=1))
    pm3 = iso_to_2d(-0.6,0,1,O)
    ax.text(pm3[0]-0.3, pm3[1], '20', fontsize=9, color='blue')

    ax.set_title('Isometric View of a Stepped Block', fontsize=12, pad=10)
    ax.text(1, -1.5,
            "Stepped block: base 40×30×10, step 20×30×10\n"
            "All measurements along isometric axes.\n"
            "Hidden edges shown as dashed lines.",
            ha='center', fontsize=8, style='italic',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-isometric-74-stepped-block.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-isometric-74-stepped-block.png")


if __name__ == "__main__":
    print("Generating EG B07 diagram images...")
    draw_isometric_axes()
    draw_iso_block()
    draw_iso_circle()
    draw_iso_stepped()
    print("Done! 4 images saved to", OUT)
