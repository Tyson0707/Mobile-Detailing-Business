#!/usr/bin/env python3
"""
Auto Instagram Reel Creator — Clear Line Auto Detail
=====================================================
Compiles before/after photos and action clips into a viral,
conversion-optimized Instagram Reel (1080x1920, 30fps, 60s max).

Usage:
    python create_reel.py
    python create_reel.py --hook "Calgary's #1 Mobile Detail"
    python create_reel.py --media /path/to/media --output /path/to/out

Media folder structure:
    scripts/media/before/   → before photos/videos
    scripts/media/after/    → after photos/videos
    scripts/media/action/   → process/action shots
    OR name files: before_01.jpg, after_01.jpg, action_01.jpg in media/ root
"""

import os
import sys
import glob
import random
import argparse
import numpy as np
from pathlib import Path
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont, ImageFilter

from moviepy import (
    VideoFileClip, ImageClip, CompositeVideoClip,
    concatenate_videoclips, AudioFileClip, VideoClip, ColorClip
)
from moviepy.video.fx import FadeIn, FadeOut, CrossFadeIn, CrossFadeOut

# ─────────────────────────────────────────────
# BUSINESS CONFIG — edit these to update branding
# ─────────────────────────────────────────────
BUSINESS = {
    "name": "Clear Line Auto Detail",
    "tagline": "Calgary's Premier Mobile Detail",
    "phone": "(403) 831-5728",
    "cta_line1": "Book Now · Link in Bio",
    "cta_line2": "Starting at $110",
    "area": "Serving Calgary & Surrounding Areas",
    "stars": "★★★★★",
    "review_count": "47 Five-Star Reviews",
    "instagram": "@clearlineautodetail",
}

HOOKS = [
    "Watch this transformation...",
    "Your car deserves better.",
    "Calgary's #1 Mobile Detail",
    "We come to YOU.",
    "Before vs After →",
    "This could be your car.",
]

# ─────────────────────────────────────────────
# VISUAL CONSTANTS
# ─────────────────────────────────────────────
W, H = 1080, 1920
FPS = 30
MAX_DURATION = 60

BG_DARK    = (8, 13, 26)
BLUE       = (59, 130, 246)
INDIGO     = (99, 102, 241)
GOLD       = (251, 191, 36)
WHITE      = (255, 255, 255)
BLACK      = (0, 0, 0)

FONT_BOLD  = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG   = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

SUPPORTED  = {".jpg", ".jpeg", ".png", ".mp4", ".mov"}


# ─────────────────────────────────────────────
# UTILITIES
# ─────────────────────────────────────────────

def load_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()


def fit_to_reel(img: Image.Image) -> np.ndarray:
    """
    Smart-fit a PIL image to 1080×1920.
    Landscape → blurred+scaled bg + sharp centered overlay.
    Portrait  → center-crop or pad.
    """
    img = img.convert("RGB")
    iw, ih = img.size
    target_ratio = W / H
    img_ratio = iw / ih

    if img_ratio > target_ratio:
        # Landscape: create blurred bg, overlay sharp center crop
        # Scale image so height fills reel
        scale = H / ih
        bg = img.resize((int(iw * scale), H), Image.LANCZOS)
        # Blur background
        bg = bg.filter(ImageFilter.GaussianBlur(radius=20))
        # Darken bg
        bg_arr = np.array(bg).astype(float) * 0.4
        bg = Image.fromarray(bg_arr.clip(0, 255).astype(np.uint8))
        # Crop bg to canvas
        if bg.width > W:
            x0 = (bg.width - W) // 2
            bg = bg.crop((x0, 0, x0 + W, H))
        else:
            canvas = Image.new("RGB", (W, H), BG_DARK)
            canvas.paste(bg, ((W - bg.width) // 2, 0))
            bg = canvas
        # Sharp overlay: scale so width fills reel
        scale2 = W / iw
        fg = img.resize((W, int(ih * scale2)), Image.LANCZOS)
        y0 = (H - fg.height) // 2
        bg.paste(fg, (0, max(0, y0)))
        return np.array(bg)
    else:
        # Portrait or square: center-crop to 9:16
        scale = max(W / iw, H / ih)
        nw, nh = int(iw * scale), int(ih * scale)
        img = img.resize((nw, nh), Image.LANCZOS)
        x0 = (nw - W) // 2
        y0 = (nh - H) // 2
        img = img.crop((x0, y0, x0 + W, y0 + H))
        return np.array(img)


def add_gradient_overlay(arr: np.ndarray, strength: float = 0.6) -> np.ndarray:
    """Add a dark gradient at the bottom of the frame for text legibility."""
    h, w = arr.shape[:2]
    gradient_h = int(h * 0.35)
    gradient = np.linspace(0, strength, gradient_h)
    mask = np.zeros(h)
    mask[h - gradient_h:] = gradient
    mask = mask[:, np.newaxis, np.newaxis]
    result = arr.astype(float) * (1 - mask)
    return result.clip(0, 255).astype(np.uint8)


def draw_text_pill(draw, text, x, y, font, color=WHITE, bg=(0, 0, 0, 160), padding=16):
    """Draw text with a semi-transparent rounded pill background."""
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    rect = [x - padding, y - padding, x + tw + padding, y + th + padding]
    draw.rounded_rectangle(rect, radius=12, fill=bg)
    draw.text((x, y), text, font=font, fill=color)
    return tw, th


def render_text_frame(lines, size=(W, H), bg_color=BG_DARK) -> np.ndarray:
    """
    Render a full card with multiple text lines centered on a dark background.
    Each line is a dict: {text, font_size, color, bold, y_offset}
    """
    img = Image.new("RGB", size, bg_color)
    draw = ImageDraw.Draw(img)

    # Blue gradient stripe at top
    for i in range(6):
        alpha = int(255 * (1 - i / 6))
        draw.rectangle([(0, i * 2), (W, i * 2 + 2)], fill=BLUE)

    center_y = H // 2
    total_h = sum(ln.get("font_size", 60) + ln.get("gap", 24) for ln in lines)
    start_y = center_y - total_h // 2

    cur_y = start_y
    for ln in lines:
        fsize = ln.get("font_size", 60)
        bold = ln.get("bold", True)
        color = ln.get("color", WHITE)
        text = ln.get("text", "")
        gap = ln.get("gap", 24)
        font_path = FONT_BOLD if bold else FONT_REG
        font = load_font(font_path, fsize)
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        x = (W - tw) // 2
        # Shadow
        draw.text((x + 2, cur_y + 2), text, font=font, fill=(0, 0, 0))
        draw.text((x, cur_y), text, font=font, fill=color)
        cur_y += fsize + gap

    return np.array(img)


# ─────────────────────────────────────────────
# CLIP BUILDERS
# ─────────────────────────────────────────────

def make_intro_card(hook_text: str, duration: float = 2.5) -> VideoClip:
    """Animated intro card with hook text and business name."""
    print(f"  Building intro card: '{hook_text}'")

    frame = render_text_frame([
        {"text": hook_text,      "font_size": 72, "color": WHITE,   "bold": True,  "gap": 30},
        {"text": BUSINESS["name"], "font_size": 38, "color": BLUE,  "bold": False, "gap": 10},
        {"text": BUSINESS["tagline"], "font_size": 30, "color": (180, 180, 200), "bold": False, "gap": 0},
    ])

    clip = ImageClip(frame).with_duration(duration).with_fps(FPS)
    clip = clip.with_effects([FadeIn(0.3), FadeOut(0.3)])
    return clip


def make_social_proof_card(duration: float = 2.0) -> VideoClip:
    """Stars + review count card."""
    print("  Building social proof card")
    frame = render_text_frame([
        {"text": BUSINESS["stars"],        "font_size": 90, "color": GOLD,  "bold": True,  "gap": 20},
        {"text": BUSINESS["review_count"], "font_size": 48, "color": WHITE, "bold": True,  "gap": 16},
        {"text": BUSINESS["area"],         "font_size": 32, "color": (180, 180, 200), "bold": False, "gap": 0},
    ])
    clip = ImageClip(frame).with_duration(duration).with_fps(FPS)
    clip = clip.with_effects([FadeIn(0.3), FadeOut(0.3)])
    return clip


def make_outro_card(duration: float = 3.5) -> VideoClip:
    """CTA outro card."""
    print("  Building outro CTA card")
    frame = render_text_frame([
        {"text": "Book Your Detail Today", "font_size": 64, "color": WHITE,  "bold": True,  "gap": 24},
        {"text": BUSINESS["cta_line2"],    "font_size": 52, "color": GOLD,   "bold": True,  "gap": 20},
        {"text": BUSINESS["phone"],        "font_size": 44, "color": BLUE,   "bold": True,  "gap": 24},
        {"text": BUSINESS["cta_line1"],    "font_size": 36, "color": WHITE,  "bold": False, "gap": 20},
        {"text": BUSINESS["name"],         "font_size": 28, "color": (150, 150, 180), "bold": False, "gap": 0},
    ])
    clip = ImageClip(frame).with_duration(duration).with_fps(FPS)
    clip = clip.with_effects([FadeIn(0.4)])
    return clip


def make_ken_burns(arr: np.ndarray, duration: float, zoom_in: bool = True) -> VideoClip:
    """Smooth Ken Burns zoom effect on a static image array."""
    h, w = arr.shape[:2]
    zoom_max = 1.08

    def make_frame(t):
        progress = t / duration
        # Smoothstep easing
        p = progress * progress * (3 - 2 * progress)
        if zoom_in:
            scale = 1.0 + (zoom_max - 1.0) * p
        else:
            scale = zoom_max - (zoom_max - 1.0) * p

        nh, nw = int(h / scale), int(w / scale)
        y0 = (h - nh) // 2
        x0 = (w - nw) // 2
        cropped = arr[y0:y0 + nh, x0:x0 + nw]
        img = Image.fromarray(cropped).resize((w, h), Image.LANCZOS)
        return np.array(img)

    clip = VideoClip(make_frame, duration=duration).with_fps(FPS)
    return clip


def make_before_after_clip(before_arr: np.ndarray, after_arr: np.ndarray,
                            before_duration: float = 1.8,
                            wipe_duration: float = 0.7,
                            after_duration: float = 2.5) -> VideoClip:
    """
    Build a 5s clip:  BEFORE (static) → wipe-from-left → AFTER (static)
    with text labels overlaid.
    """
    print("  Building before/after wipe clip")
    total = before_duration + wipe_duration + after_duration

    # Add gradient + labels to before frame
    before_labeled = _label_frame(before_arr, "BEFORE", label_color=(220, 80, 80))
    after_labeled  = _label_frame(after_arr,  "AFTER",  label_color=(60, 200, 100),
                                   watermark=BUSINESS["instagram"])

    def make_frame(t):
        if t < before_duration:
            return before_labeled
        elif t < before_duration + wipe_duration:
            progress = (t - before_duration) / wipe_duration
            # Smoothstep
            p = progress * progress * (3 - 2 * progress)
            cutoff = int(p * W)
            frame = before_labeled.copy()
            frame[:, :cutoff] = after_labeled[:, :cutoff]
            # Bright wipe edge
            if 0 < cutoff < W:
                lw = 4
                ls, le = max(0, cutoff - lw), min(W, cutoff + lw)
                frame[:, ls:le] = [255, 255, 255]
            return frame
        else:
            return after_labeled

    clip = VideoClip(make_frame, duration=total).with_fps(FPS)
    clip = clip.with_effects([FadeIn(0.25), FadeOut(0.25)])
    return clip


def _label_frame(arr: np.ndarray, label: str, label_color=WHITE,
                 watermark: str = None) -> np.ndarray:
    """Add gradient overlay and a BEFORE/AFTER label to a frame array."""
    arr = add_gradient_overlay(arr, strength=0.55)
    img = Image.fromarray(arr).convert("RGBA")
    draw = ImageDraw.Draw(img)

    font_label = load_font(FONT_BOLD, 54)
    font_wm    = load_font(FONT_REG, 28)

    # Label pill — bottom left
    draw_text_pill(draw, label, 48, H - 130, font_label,
                   color=label_color, bg=(0, 0, 0, 170), padding=18)

    # Watermark — bottom right
    if watermark:
        bbox = draw.textbbox((0, 0), watermark, font=font_wm)
        tw = bbox[2] - bbox[0]
        draw.text((W - tw - 40, H - 80), watermark, font=font_wm,
                  fill=(200, 200, 200, 180))

    return np.array(img.convert("RGB"))


def make_action_clip(source: str, duration: float = 1.8) -> VideoClip:
    """Ken Burns photo clip or trimmed/sped video clip."""
    ext = Path(source).suffix.lower()
    print(f"  Building action clip: {Path(source).name}")

    if ext in {".jpg", ".jpeg", ".png"}:
        img = Image.open(source)
        arr = fit_to_reel(img)
        zoom_in = random.choice([True, False])
        clip = make_ken_burns(arr, duration, zoom_in=zoom_in)
    else:
        # Video: load, trim to `duration`, crop to 9:16
        raw = VideoFileClip(source)
        # Take best middle portion
        if raw.duration > duration:
            start = (raw.duration - duration) / 2
            raw = raw.subclipped(start, start + duration)
        else:
            raw = raw.with_duration(raw.duration)
        # Resize to fill 9:16
        rw, rh = raw.size
        scale = max(W / rw, H / rh)
        raw = raw.resized((int(rw * scale), int(rh * scale)))
        raw = raw.cropped(x_center=raw.w / 2, y_center=raw.h / 2, width=W, height=H)
        clip = raw

    clip = clip.with_effects([FadeIn(0.2), FadeOut(0.2)])
    return clip


def load_media_pair(before_path: str, after_path: str):
    """Load and fit a before/after pair."""
    before_img = Image.open(before_path)
    after_img  = Image.open(after_path)
    return fit_to_reel(before_img), fit_to_reel(after_img)


# ─────────────────────────────────────────────
# MEDIA DISCOVERY
# ─────────────────────────────────────────────

def discover_media(media_dir: str):
    """
    Returns: (pairs, action_files)
    pairs       = list of (before_path, after_path)
    action_files = list of paths
    """
    media_dir = Path(media_dir)

    before_files = sorted(
        [f for f in (media_dir / "before").glob("*")
         if f.suffix.lower() in SUPPORTED]
    ) if (media_dir / "before").exists() else []

    after_files = sorted(
        [f for f in (media_dir / "after").glob("*")
         if f.suffix.lower() in SUPPORTED]
    ) if (media_dir / "after").exists() else []

    action_files = sorted(
        [f for f in (media_dir / "action").glob("*")
         if f.suffix.lower() in SUPPORTED]
    ) if (media_dir / "action").exists() else []

    # Also pick up root-level named files
    for f in sorted(media_dir.glob("*")):
        if f.suffix.lower() not in SUPPORTED:
            continue
        n = f.stem.lower()
        if n.startswith("before_") or n.startswith("before-"):
            before_files.append(f)
        elif n.startswith("after_") or n.startswith("after-"):
            after_files.append(f)
        elif n.startswith("action_") or n.startswith("action-"):
            action_files.append(f)

    # Pair before/after by index
    pairs = list(zip(before_files, after_files))

    return pairs, [str(a) for a in action_files]


def find_music(music_dir: str):
    music_dir = Path(music_dir)
    for ext in ["*.mp3", "*.wav", "*.m4a", "*.aac"]:
        results = list(music_dir.glob(ext))
        if results:
            return str(results[0])
    return None


# ─────────────────────────────────────────────
# MAIN ASSEMBLY
# ─────────────────────────────────────────────

def build_reel(args):
    print("\n🎬  Clear Line Auto Detail — Auto Reel Creator")
    print("=" * 50)

    hook = args.hook or random.choice(HOOKS)
    media_dir  = Path(args.media)
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Discover media
    pairs, action_files = discover_media(str(media_dir))
    print(f"\n📂  Found {len(pairs)} before/after pair(s), {len(action_files)} action clip(s)")

    if not pairs and not action_files:
        print("\n⚠️   No media found! Add photos to:")
        print(f"     {media_dir}/before/  and  {media_dir}/after/")
        print(f"     or name files before_01.jpg / after_01.jpg in {media_dir}/")
        sys.exit(1)

    clips = []
    total_dur = 0

    # 1. Intro
    intro = make_intro_card(hook)
    clips.append(intro)
    total_dur += intro.duration

    # 2. Before/After pairs
    for i, (b, a) in enumerate(pairs):
        if total_dur >= args.max_duration - 5:
            print(f"  ⚡ Duration limit reached, skipping remaining pairs")
            break
        print(f"\n[{i+1}/{len(pairs)}] Before/After pair")
        before_arr, after_arr = load_media_pair(str(b), str(a))
        ba_clip = make_before_after_clip(before_arr, after_arr)
        clips.append(ba_clip)
        total_dur += ba_clip.duration

        # Interleave action clips after each pair
        if action_files and i < len(action_files):
            if total_dur < args.max_duration - 3:
                ac = make_action_clip(action_files[i])
                clips.append(ac)
                total_dur += ac.duration

    # 3. Remaining action clips
    used_action = min(len(pairs), len(action_files))
    for af in action_files[used_action:]:
        if total_dur >= args.max_duration - 5:
            break
        ac = make_action_clip(af)
        clips.append(ac)
        total_dur += ac.duration

    # 4. Social proof card
    if not args.no_social_proof and total_dur < args.max_duration - 3:
        sp = make_social_proof_card()
        clips.append(sp)
        total_dur += sp.duration

    # 5. Outro CTA
    if total_dur < args.max_duration - 2:
        outro = make_outro_card()
        clips.append(outro)
        total_dur += outro.duration

    print(f"\n✂️   Total reel duration: {total_dur:.1f}s")
    print("🔗  Concatenating clips...")

    final = concatenate_videoclips(clips, method="compose")

    # 6. Background music
    music_path = args.music or find_music(str(Path(args.media).parent / "music"))
    if music_path and Path(music_path).exists():
        print(f"🎵  Adding music: {Path(music_path).name}")
        try:
            music = AudioFileClip(music_path)
            music = music.with_duration(final.duration)
            music = music.multiply_volume(0.15)
            final = final.with_audio(music)
        except Exception as e:
            print(f"  ⚠️  Could not add music: {e}")
    else:
        print("🔇  No music file found in scripts/music/ — exporting silent reel")
        print("    (Add a .mp3 file to scripts/music/ for background music)")

    # 7. Export
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_path = output_dir / f"reel_{timestamp}.mp4"
    print(f"\n💾  Exporting to: {out_path}")
    print("    (This may take 1-3 minutes...)\n")

    final.write_videofile(
        str(out_path),
        fps=FPS,
        codec="libx264",
        audio_codec="aac",
        preset="fast",
        ffmpeg_params=["-crf", "23", "-pix_fmt", "yuv420p"],
        logger="bar",
    )

    print(f"\n✅  Done! Your reel is ready:")
    print(f"    {out_path}")
    print(f"\n📱  Instagram Reel specs: 1080×1920 · 30fps · H.264 · {total_dur:.0f}s")
    print("    Upload directly to Instagram → Reels\n")

    return str(out_path)


# ─────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────

def parse_args():
    script_dir = Path(__file__).parent
    parser = argparse.ArgumentParser(
        description="Auto-compile an Instagram Reel for Clear Line Auto Detail"
    )
    parser.add_argument("--media",          default=str(script_dir / "media"),
                        help="Path to media folder")
    parser.add_argument("--music",          default=None,
                        help="Path to background music file (.mp3/.wav)")
    parser.add_argument("--output",         default=str(script_dir / "output"),
                        help="Output folder for the reel")
    parser.add_argument("--hook",           default=None,
                        help="Custom hook text for intro card")
    parser.add_argument("--max-duration",   default=60, type=float,
                        dest="max_duration", help="Max reel duration in seconds")
    parser.add_argument("--no-social-proof", action="store_true",
                        dest="no_social_proof", help="Skip social proof card")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    build_reel(args)
