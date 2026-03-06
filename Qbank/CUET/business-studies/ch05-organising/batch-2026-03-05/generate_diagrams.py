"""Generate matplotlib diagrams for Ch5 Organising."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT_DIR, exist_ok=True)

# ─── Diagram 61: Functional Structure Org Chart ─────────────────────
def diagram_61():
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    title = "Functional Structure — Organisation Chart"
    ax.text(5, 6.6, title, ha='center', va='center', fontsize=14, fontweight='bold', color='#1a1a2e')

    # Level 1: Managing Director
    box_style = dict(boxstyle='round,pad=0.4', facecolor='#1e3a5f', edgecolor='#0d1b2a', linewidth=1.5)
    ax.text(5, 5.5, 'Managing Director', ha='center', va='center', fontsize=11, fontweight='bold',
            color='white', bbox=box_style)

    # Level 2: Functional Heads
    heads = [
        (1.5, 'Production\nManager'),
        (3.8, 'Marketing\nManager'),
        (6.2, 'Finance\nManager'),
        (8.5, 'HR\nManager'),
    ]
    head_style = dict(boxstyle='round,pad=0.35', facecolor='#2e86ab', edgecolor='#1a5276', linewidth=1.2)

    for x, label in heads:
        ax.text(x, 3.8, label, ha='center', va='center', fontsize=9, fontweight='bold',
                color='white', bbox=head_style)
        # Line from MD to head
        ax.annotate('', xy=(x, 4.25), xytext=(5, 5.1),
                    arrowprops=dict(arrowstyle='-', color='#555', lw=1.2))

    # Level 3: Subordinates
    sub_style = dict(boxstyle='round,pad=0.25', facecolor='#a8dadc', edgecolor='#457b9d', linewidth=1)
    subordinates = {
        1.5: ['Foreman', 'Supervisor'],
        3.8: ['Sales Exec', 'Ad Exec', 'Market Analyst'],
        6.2: ['Accountant', 'Auditor'],
        8.5: ['Recruiter', 'Training\nOfficer'],
    }

    for head_x, subs in subordinates.items():
        n = len(subs)
        spread = 1.2 if n <= 2 else 1.6
        positions = [head_x - spread/2 + i * spread/(n-1) for i in range(n)] if n > 1 else [head_x]
        for sx, sub_label in zip(positions, subs):
            ax.text(sx, 2.0, sub_label, ha='center', va='center', fontsize=7.5,
                    color='#1a1a2e', bbox=sub_style)
            ax.annotate('', xy=(sx, 2.5), xytext=(head_x, 3.35),
                        arrowprops=dict(arrowstyle='-', color='#888', lw=0.8))

    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-organising-61.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("  OK cuet-bst-organising-61.png — Functional Structure Org Chart")


# ─── Diagram 62: Formal vs Informal Organisation Comparison ─────────
def diagram_62():
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 8)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    ax.text(5, 7.5, 'Formal Organisation vs Informal Organisation', ha='center', va='center',
            fontsize=14, fontweight='bold', color='#1a1a2e')

    # Headers
    header_formal = dict(boxstyle='round,pad=0.4', facecolor='#1e3a5f', edgecolor='#0d1b2a', linewidth=1.5)
    header_informal = dict(boxstyle='round,pad=0.4', facecolor='#c0392b', edgecolor='#922b21', linewidth=1.5)

    ax.text(2.5, 6.7, 'Formal Organisation', ha='center', va='center', fontsize=12, fontweight='bold',
            color='white', bbox=header_formal)
    ax.text(7.5, 6.7, 'Informal Organisation', ha='center', va='center', fontsize=12, fontweight='bold',
            color='white', bbox=header_informal)

    formal_points = [
        'Deliberately created by management',
        'Based on rules and procedures',
        'Shows official relationships',
        'Authority flows top-down',
        'Purpose: Achieve organisational goals',
        'Communication: Official channels',
    ]

    informal_points = [
        'Arises spontaneously',
        'Based on personal relationships',
        'Shows social relationships',
        'No defined authority',
        'Purpose: Fulfil social needs',
        'Communication: Through grapevine',
    ]

    y_start = 5.9
    row_h = 0.75
    formal_bg = dict(boxstyle='round,pad=0.3', facecolor='#d6eaf8', edgecolor='#85c1e9', linewidth=0.8)
    informal_bg = dict(boxstyle='round,pad=0.3', facecolor='#fadbd8', edgecolor='#f1948a', linewidth=0.8)

    for i, (fp, ip) in enumerate(zip(formal_points, informal_points)):
        y = y_start - i * row_h
        ax.text(2.5, y, f"({i+1}) {fp}", ha='center', va='center', fontsize=8.5,
                color='#1a1a2e', bbox=formal_bg)
        ax.text(7.5, y, f"({i+1}) {ip}", ha='center', va='center', fontsize=8.5,
                color='#1a1a2e', bbox=informal_bg)

    # Divider line
    ax.plot([5, 5], [1.2, 6.3], color='#bbb', lw=1, ls='--')

    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-organising-62.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("  OK cuet-bst-organising-62.png — Formal vs Informal Comparison")


# ─── Diagram 63: Elements of Delegation Flowchart ───────────────────
def diagram_63():
    fig, ax = plt.subplots(figsize=(8, 7))
    ax.set_xlim(0, 8)
    ax.set_ylim(0, 8)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    ax.text(4, 7.5, 'Elements of Delegation', ha='center', va='center',
            fontsize=14, fontweight='bold', color='#1a1a2e')

    boxes = [
        (4, 6.2, 'AUTHORITY', 'Right to command and\nmake decisions', '#1e3a5f',
         'Flows downward:\nSuperior → Subordinate'),
        (4, 4.0, 'RESPONSIBILITY', 'Obligation to perform\nthe assigned task', '#2e86ab',
         'Created when subordinate\naccepts the task'),
        (4, 1.8, 'ACCOUNTABILITY', 'Answerability for\nthe final outcome', '#c0392b',
         'Flows upward:\nSubordinate → Superior\nCANNOT be delegated'),
    ]

    for x, y, title, desc, color, note in boxes:
        # Main box
        box_style = dict(boxstyle='round,pad=0.5', facecolor=color, edgecolor='#333', linewidth=1.5)
        ax.text(x, y, f"{title}\n\n{desc}", ha='center', va='center', fontsize=9,
                fontweight='bold', color='white', bbox=box_style)

        # Side note
        note_style = dict(boxstyle='round,pad=0.3', facecolor='#f0f0f0', edgecolor='#999', linewidth=0.8)
        ax.text(7, y, note, ha='center', va='center', fontsize=7.5,
                color='#333', bbox=note_style)

    # Arrows between boxes
    for y_from, y_to in [(5.4, 4.7), (3.2, 2.5)]:
        ax.annotate('', xy=(4, y_to), xytext=(4, y_from),
                    arrowprops=dict(arrowstyle='->', color='#555', lw=2, connectionstyle='arc3'))

    # Key note at bottom
    key_style = dict(boxstyle='round,pad=0.4', facecolor='#fff3cd', edgecolor='#ffc107', linewidth=1.2)
    ax.text(4, 0.5, 'Key: Authority CAN be delegated  |  Accountability CANNOT be delegated',
            ha='center', va='center', fontsize=9, fontweight='bold', color='#856404', bbox=key_style)

    fig.savefig(os.path.join(OUT_DIR, 'cuet-bst-organising-63.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("  OK cuet-bst-organising-63.png — Elements of Delegation")


if __name__ == '__main__':
    print("Generating Ch5 Organising diagrams...")
    diagram_61()
    diagram_62()
    diagram_63()
    print(f"\nDone! 3 diagrams saved to {OUT_DIR}/")
