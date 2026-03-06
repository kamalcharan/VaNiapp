"""
Generate 4 diagram images for CUET EG B01 (Scales & Engineering Curves).
Each image is a clean engineering-drawing style figure suitable for exam questions.
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import os

OUT = os.path.join(os.path.dirname(__file__), "images")
os.makedirs(OUT, exist_ok=True)

# ── Common style ──────────────────────────────────────────────────────────────
plt.rcParams.update({
    'font.size': 11,
    'font.family': 'serif',
    'axes.linewidth': 1.2,
    'figure.dpi': 180,
})

# =============================================================================
# IMAGE 1 — Plain Scale (Easy)
# A plain scale RF = 1:50, to measure up to 7 m, showing 1 m divisions
# Question asks to read a marked length on the scale.
# =============================================================================
def draw_plain_scale():
    fig, ax = plt.subplots(figsize=(8, 2.5))
    ax.set_xlim(-1.5, 16)
    ax.set_ylim(-1.5, 3)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # RF = 1:50, so 1 m = 2 cm on drawing.  We draw in "cm" units scaled up.
    # Total length for 7 m = 14 cm → scale to plotting units (* 1)
    unit = 2.0  # 2 cm per metre in plot units
    divisions = 7
    sub_div = 10  # first division subdivided into 10 parts (0.1 m each)

    # Main bar
    bar_y = 0.8
    bar_h = 0.6
    for i in range(divisions):
        color = 'white' if i % 2 == 0 else '#d0d0d0'
        ax.add_patch(patches.Rectangle((i * unit, bar_y), unit, bar_h,
                     linewidth=1, edgecolor='black', facecolor=color))

    # Subdivision of first unit (left side)
    for j in range(sub_div):
        color = '#d0d0d0' if j % 2 == 0 else 'white'
        ax.add_patch(patches.Rectangle((-unit + j * unit / sub_div, bar_y),
                     unit / sub_div, bar_h,
                     linewidth=0.5, edgecolor='black', facecolor=color))

    # Labels
    for i in range(divisions + 1):
        ax.text(i * unit, bar_y - 0.35, str(i), ha='center', va='top', fontsize=9)
    ax.text(-unit, bar_y - 0.35, '1', ha='center', va='top', fontsize=9)

    # Sub-division labels (only 0 and 5)
    ax.text(-unit, bar_y + bar_h + 0.15, '10', ha='center', va='bottom', fontsize=7)
    ax.text(-unit / 2, bar_y + bar_h + 0.15, '5', ha='center', va='bottom', fontsize=7)
    ax.text(0, bar_y + bar_h + 0.15, '0', ha='center', va='bottom', fontsize=7)

    # Arrow marking a length: 0.4 m + 3 m = 3.4 m
    arrow_y = 2.2
    start_x = -unit + 4 * (unit / sub_div)  # 0.4 from sub-division
    end_x = 3 * unit                         # 3 m mark
    ax.annotate('', xy=(end_x, arrow_y), xytext=(start_x, arrow_y),
                arrowprops=dict(arrowstyle='<->', color='red', lw=1.5))
    ax.plot([start_x, start_x], [bar_y, arrow_y], 'r--', lw=0.7)
    ax.plot([end_x, end_x], [bar_y, arrow_y], 'r--', lw=0.7)
    ax.text((start_x + end_x) / 2, arrow_y + 0.15, '?', ha='center',
            va='bottom', fontsize=13, color='red', fontweight='bold')

    # Title
    ax.text(7, -1.0, 'RF = 1:50    (metres)', ha='center', fontsize=10)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-scales-21-plain-scale.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-scales-21-plain-scale.png")


# =============================================================================
# IMAGE 2 — Ellipse by Concentric Circle Method (Medium)
# Shows two concentric circles with radial lines and the resulting ellipse.
# Question asks about the construction method or a property.
# =============================================================================
def draw_ellipse_concentric():
    fig, ax = plt.subplots(figsize=(6, 6))
    ax.set_xlim(-5.5, 5.5)
    ax.set_ylim(-5.5, 5.5)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    a, b = 4.5, 3.0  # semi-major, semi-minor

    # Outer circle (major)
    theta = np.linspace(0, 2 * np.pi, 200)
    ax.plot(a * np.cos(theta), a * np.sin(theta), 'b--', lw=0.8, label='Major circle')
    # Inner circle (minor)
    ax.plot(b * np.cos(theta), b * np.sin(theta), 'g--', lw=0.8, label='Minor circle')

    # Radial lines and construction points
    n_lines = 12
    angles = np.linspace(0, 2 * np.pi, n_lines, endpoint=False)
    ellipse_pts = []

    for ang in angles:
        # Radial line to outer circle
        ox, oy = a * np.cos(ang), a * np.sin(ang)
        ix, iy = b * np.cos(ang), b * np.sin(ang)
        ax.plot([0, ox], [0, oy], color='#999999', lw=0.5)

        # Ellipse point: x from outer, y from inner
        ex = a * np.cos(ang)
        ey = b * np.sin(ang)
        ellipse_pts.append((ex, ey))

        # Construction lines
        ax.plot([ox, ox], [oy, ey], color='#cccccc', lw=0.4, linestyle=':')
        ax.plot([ix, ex], [iy, ey], color='#cccccc', lw=0.4, linestyle=':')

        # Points
        ax.plot(ox, oy, 'bo', ms=3)
        ax.plot(ix, iy, 'go', ms=3)
        ax.plot(ex, ey, 'ro', ms=4)

    # Draw ellipse
    ept = np.array(ellipse_pts + [ellipse_pts[0]])
    # Smooth ellipse
    t_smooth = np.linspace(0, 2 * np.pi, 200)
    ax.plot(a * np.cos(t_smooth), b * np.sin(t_smooth), 'r-', lw=2)

    # Centre
    ax.plot(0, 0, 'k+', ms=10, mew=1.5)
    ax.text(0.3, -0.4, 'O', fontsize=10)

    # Labels
    ax.text(a + 0.3, 0, f'a = {a}', fontsize=9, color='blue')
    ax.text(0.3, b + 0.3, f'b = {b}', fontsize=9, color='green')

    ax.set_title('Ellipse — Concentric Circle Method', fontsize=11, pad=10)
    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-scales-22-ellipse-concentric.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-scales-22-ellipse-concentric.png")


# =============================================================================
# IMAGE 3 — Cycloid Curve (Medium)
# Shows a generating circle rolling along a straight line with the cycloid.
# =============================================================================
def draw_cycloid():
    fig, ax = plt.subplots(figsize=(9, 4.5))
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    r = 1.5  # radius of generating circle
    n_pts = 200

    # Cycloid parametric: x = r(t - sin t), y = r(1 - cos t)
    t = np.linspace(0, 2 * np.pi, n_pts)
    cx = r * (t - np.sin(t))
    cy = r * (1 - np.cos(t))

    # Base line
    ax.plot([-0.5, 2 * np.pi * r + 0.5], [0, 0], 'k-', lw=1.5)

    # Cycloid curve
    ax.plot(cx, cy, 'r-', lw=2.5)

    # Show generating circle at a few positions
    positions = [0, np.pi / 2, np.pi, 3 * np.pi / 2, 2 * np.pi]
    for tp in positions:
        centre_x = r * tp
        centre_y = r
        circ = plt.Circle((centre_x, centre_y), r, fill=False,
                           linestyle='--', color='blue', lw=0.7)
        ax.add_patch(circ)
        ax.plot(centre_x, centre_y, 'b.', ms=3)

        # Point on circle (generating point)
        px = r * (tp - np.sin(tp))
        py = r * (1 - np.cos(tp))
        ax.plot(px, py, 'ro', ms=5)
        # Line from centre to point
        ax.plot([centre_x, px], [centre_y, py], 'b-', lw=0.5)

    # Labels
    ax.text(np.pi * r, -0.5, f'Base line = 2\u03c0r = {2 * np.pi * r:.1f}',
            ha='center', fontsize=9)
    ax.text(-0.3, r, 'r', fontsize=10, color='blue', ha='right')
    ax.annotate('', xy=(0, 0), xytext=(0, r),
                arrowprops=dict(arrowstyle='<->', color='blue', lw=1))

    # Mark the highest point
    ax.annotate('Highest point\n(2r from base)', xy=(np.pi * r, 2 * r),
                xytext=(np.pi * r + 1.5, 2 * r + 0.5),
                fontsize=8, ha='center',
                arrowprops=dict(arrowstyle='->', color='black', lw=0.8))

    ax.set_title('Cycloid — Circle rolling on a straight line', fontsize=11, pad=8)
    ax.set_xlim(-1, 2 * np.pi * r + 1)
    ax.set_ylim(-1, 2 * r + 1.5)
    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-scales-23-cycloid.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-scales-23-cycloid.png")


# =============================================================================
# IMAGE 4 — Diagonal Scale (Hard)
# Shows a diagonal scale RF = 1:40, to measure cm, mm with diagonal divisions.
# Question asks to read a 3-digit measurement from the scale.
# =============================================================================
def draw_diagonal_scale():
    fig, ax = plt.subplots(figsize=(9, 3.5))
    ax.set_xlim(-3.5, 14)
    ax.set_ylim(-1.5, 4.5)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    unit = 2.5   # width of each main division in plot units
    n_main = 5   # main divisions (metres)
    n_sub = 10   # subdivisions in first division
    n_diag = 10  # diagonal divisions (vertical)
    h = 3.0      # total height of diagonal portion

    # Main horizontal divisions
    for i in range(n_main + 1):
        x = i * unit
        ax.plot([x, x], [0, 0.4], 'k-', lw=1)
    ax.plot([0, n_main * unit], [0, 0], 'k-', lw=1.5)
    ax.plot([0, n_main * unit], [0.4, 0.4], 'k-', lw=1)

    # Main division labels
    for i in range(n_main + 1):
        ax.text(i * unit, -0.3, str(i), ha='center', fontsize=9)

    # First division: subdivisions + diagonal area
    sub_w = unit / n_sub
    row_h = h / n_diag

    # Draw the diagonal rectangle
    ax.plot([-unit, 0], [0, 0], 'k-', lw=1.5)
    ax.plot([-unit, -unit], [0, h], 'k-', lw=1)
    ax.plot([0, 0], [0, h], 'k-', lw=1)
    ax.plot([-unit, 0], [h, h], 'k-', lw=1)

    # Horizontal lines in diagonal area
    for j in range(n_diag + 1):
        y = j * row_h
        ax.plot([-unit, unit * n_main if j == 0 else 0], [y, y], 'k-', lw=0.4)
    # Extend the top line
    ax.plot([0, unit * n_main], [h, h], 'k-', lw=0.4)

    # Vertical subdivision lines
    for k in range(n_sub + 1):
        x = -unit + k * sub_w
        ax.plot([x, x], [0, 0], 'k-', lw=0.5)

    # Diagonal lines from bottom subdivisions to top (shifted by 1)
    for k in range(n_sub + 1):
        x_bot = -unit + k * sub_w
        x_top = -unit + (k) * sub_w + sub_w  # shifted one sub to the right at top
        if x_top <= 0.01:
            ax.plot([x_bot, x_top], [0, h], 'b-', lw=0.6)

    # Actually draw proper diagonals
    # Each diagonal starts at bottom of subdivision k and goes to top of subdivision k+1
    for k in range(n_sub):
        x_bot = -unit + k * sub_w
        x_top = -unit + (k + 1) * sub_w
        ax.plot([x_bot, x_top], [0, h], 'b-', lw=0.6)

    # Sub-division labels at bottom
    for k in [0, 5, 10]:
        x = -unit + k * sub_w
        label = str(10 - k) if k < 10 else '0'
        ax.text(x, -0.3, label, ha='center', fontsize=7)

    # Row labels on right (0-10 for third unit)
    for j in range(n_diag + 1):
        if j % 2 == 0:
            ax.text(0.2, j * row_h, str(j), fontsize=7, va='center')

    # Mark a measurement: let's mark 3.47 → 3 main + 4 sub + 7th diagonal row
    # Arrow at row 7, from diagonal intersection to 3-mark
    mark_row = 7
    mark_y = mark_row * row_h
    # x position in subdivision area: 6th diagonal at row 7
    # diagonal k=6 goes from x_bot = -unit + 6*sub_w to x_top = -unit + 7*sub_w
    # at row 7: x = x_bot + (mark_row/n_diag) * sub_w
    k_sub = 6  # 4 from the right → 10-4 = 6 from left
    x_start = (-unit + k_sub * sub_w) + (mark_row / n_diag) * sub_w
    x_end = 3 * unit

    ax.plot([x_start, x_end], [mark_y, mark_y], 'r-', lw=1.5)
    ax.plot(x_start, mark_y, 'ro', ms=5)
    ax.plot(x_end, mark_y, 'ro', ms=5)
    ax.text((x_start + x_end) / 2, mark_y + 0.25, '?',
            ha='center', fontsize=14, color='red', fontweight='bold')

    # Units label
    ax.text(n_main * unit / 2, -1.0,
            'RF = 1:2.5    Units: m, dm, cm', ha='center', fontsize=9)

    # Column headers
    ax.text(-unit / 2, h + 0.3, 'dm', ha='center', fontsize=9, color='blue')
    ax.text(-unit - 0.4, h / 2, 'cm', ha='center', fontsize=9, color='blue',
            rotation=90)
    ax.text(n_main * unit / 2, 0.6, 'm', ha='center', fontsize=9)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, "cuet-eg-scales-24-diagonal-scale.png"),
                bbox_inches='tight', pad_inches=0.15)
    plt.close(fig)
    print("  [OK] cuet-eg-scales-24-diagonal-scale.png")


# ── Run all ───────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("Generating EG B01 diagram images...")
    draw_plain_scale()
    draw_ellipse_concentric()
    draw_cycloid()
    draw_diagonal_scale()
    print("Done! 4 images saved to", OUT)
