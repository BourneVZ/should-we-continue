from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageEnhance


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public" / "archetypes"
TARGET_DIR = SOURCE_DIR / "thumbs"
SIZE = (384, 576)
SKIP_DIRS = {"thumbs", "family-preview"}


def brighten_for_home(image: Image.Image) -> Image.Image:
    image = image.convert("RGB")

    # Lift the darker mids first so posters feel less heavy in tiny UI chips.
    image = ImageEnhance.Brightness(image).enhance(1.14)
    image = ImageEnhance.Contrast(image).enhance(0.94)
    image = ImageEnhance.Color(image).enhance(1.08)

    warm = Image.new("RGB", image.size, "#fff4df")
    screened = ImageChops.screen(image, warm)
    image = Image.blend(image, screened, 0.22)

    # A final small lift keeps low-value details readable at thumbnail size.
    image = ImageEnhance.Brightness(image).enhance(1.04)
    return image


def resize_for_chip(image: Image.Image) -> Image.Image:
    return image.resize(SIZE, Image.Resampling.LANCZOS)


def main() -> None:
    TARGET_DIR.mkdir(parents=True, exist_ok=True)

    source_files = [
        path
        for path in SOURCE_DIR.iterdir()
        if path.is_file() and path.suffix.lower() == ".png" and path.parent.name not in SKIP_DIRS
    ]

    for source_path in sorted(source_files):
        target_path = TARGET_DIR / source_path.name

        with Image.open(source_path) as image:
            processed = resize_for_chip(brighten_for_home(image))
            processed.save(target_path, format="PNG", optimize=True)

        print(f"{source_path.name} -> {target_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
