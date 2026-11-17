import os
from PIL import Image, ImageDraw

def create_brand_icon(size, is_maskable=False):
    # Create RGBA image
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    pad = int(size * 0.12) if is_maskable else int(size * 0.05)
    
    # Background circle/rounded rect
    bg_color = (27, 77, 62, 255) # #1B4D3E
    if is_maskable:
        draw.rectangle([(0, 0), (size, size)], fill=bg_color)
    else:
        # Rounded rectangle
        corner_r = int(size * 0.22)
        draw.rounded_rectangle([(pad, pad), (size - pad, size - pad)], radius=corner_r, fill=bg_color)

    # Accent ring
    ring_color = (52, 211, 153, 200) # #34D399
    ring_pad = pad + int(size * 0.04)
    draw.arc([(ring_pad, ring_pad), (size - ring_pad, size - ring_pad)], start=180, end=360, fill=ring_color, width=max(2, int(size * 0.025)))

    # Draw Career Bridge Arch at the bottom
    arch_w = int(size * 0.44)
    arch_h = int(size * 0.20)
    center_x = size // 2
    bridge_y = int(size * 0.68)
    
    bridge_box = [
        (center_x - arch_w // 2, bridge_y - arch_h // 2),
        (center_x + arch_w // 2, bridge_y + arch_h // 2)
    ]
    draw.arc(bridge_box, start=180, end=360, fill=(253, 224, 71, 240), width=max(3, int(size * 0.045)))

    # Draw Sprout / Leaf motif in center
    # Center stem
    stem_top = int(size * 0.30)
    stem_bot = bridge_y - int(size * 0.04)
    draw.line([(center_x, stem_top), (center_x, stem_bot)], fill=(255, 255, 255, 240), width=max(2, int(size * 0.035)))

    # Left leaf
    left_leaf = [
        (center_x, int(size * 0.42)),
        (center_x - int(size * 0.18), int(size * 0.32)),
        (center_x - int(size * 0.10), int(size * 0.50)),
        (center_x, int(size * 0.52))
    ]
    draw.polygon(left_leaf, fill=(52, 211, 153, 255)) # #34D399

    # Right leaf
    right_leaf = [
        (center_x, int(size * 0.36)),
        (center_x + int(size * 0.20), int(size * 0.26)),
        (center_x + int(size * 0.12), int(size * 0.44)),
        (center_x, int(size * 0.46))
    ]
    draw.polygon(right_leaf, fill=(167, 243, 208, 255)) # #A7F3D0

    return img

def main():
    assets_dir = r"D:\Yogesh\Coding\CSP\assets"
    
    # 1. 192x192 standard icon
    icon192 = create_brand_icon(192)
    icon192.save(os.path.join(assets_dir, "icon-192.png"), "PNG")
    print("Created icon-192.png")

    # 2. 512x512 standard icon
    icon512 = create_brand_icon(512)
    icon512.save(os.path.join(assets_dir, "icon-512.png"), "PNG")
    print("Created icon-512.png")

    # 3. 512x512 maskable icon
    icon_maskable = create_brand_icon(512, is_maskable=True)
    icon_maskable.save(os.path.join(assets_dir, "icon-maskable.png"), "PNG")
    print("Created icon-maskable.png")

    # 4. Apple touch icon (180x180)
    icon_apple = create_brand_icon(180)
    icon_apple.save(os.path.join(assets_dir, "apple-touch-icon.png"), "PNG")
    print("Created apple-touch-icon.png")

    # 5. Favicon (64x64)
    favicon = create_brand_icon(64)
    favicon.save(os.path.join(assets_dir, "favicon.png"), "PNG")
    print("Created favicon.png")

if __name__ == "__main__":
    main()
