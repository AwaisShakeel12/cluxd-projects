from pathlib import Path
import json
import re
import html

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "catalog.json"

# Folders that are not website categories.
IGNORED_FOLDERS = {
    ".git",
    ".github",
    "images",
    "assets",
    "scripts",
    "node_modules",
    "__pycache__",
}

# Optional prettier names for existing folder names.
DISPLAY_NAMES = {
    "ShowRoom": "Showroom",
    "resturent-hotels": "Restaurant Hotels",
    "ecommerce": "Ecommerce",
    "funtiers": "Funtiers",
    "healthcare": "Healthcare",
    "logic": "Logic",
    "realestate": "Real Estate",
}


def display_category(folder_name: str) -> str:
    if folder_name in DISPLAY_NAMES:
        return DISPLAY_NAMES[folder_name]

    return folder_name.replace("-", " ").replace("_", " ").title()


def clean_name(filename: str) -> str:
    name = Path(filename).stem
    name = re.sub(r"[-_]+", " ", name)
    name = re.sub(r"(?<=[a-z])(?=[A-Z])", " ", name)
    return name.strip().title()


def read_metadata(path: Path, name: str):
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return name, ""

    title_match = re.search(
        r"<title[^>]*>(.*?)</title>",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )

    description_match = re.search(
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']',
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )

    if title_match:
        title = html.unescape(re.sub(r"\s+", " ", title_match.group(1))).strip()
        if title:
            name = title

    description = ""
    if description_match:
        description = html.unescape(
            re.sub(r"\s+", " ", description_match.group(1))
        ).strip()

    return name, description


def main():
    sites = []

    for path in ROOT.rglob("*.html"):
        relative = path.relative_to(ROOT)

        # index.html is the catalog page, not a template.
        if path.name.lower() == "index.html":
            continue

        parts = relative.parts

        if len(parts) < 2:
            # Ignore root-level HTML files other than index.html.
            continue

        category_folder = parts[0]

        if category_folder in IGNORED_FOLDERS:
            continue

        name, description = read_metadata(path, clean_name(path.name))

        sites.append({
            "name": name,
            "category": display_category(category_folder),
            "url": relative.as_posix(),
            "description": description,
        })

    sites.sort(key=lambda item: (item["category"].lower(), item["name"].lower()))

    OUTPUT.write_text(
        json.dumps(sites, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print(f"Generated {OUTPUT} with {len(sites)} website(s).")


if __name__ == "__main__":
    main()
