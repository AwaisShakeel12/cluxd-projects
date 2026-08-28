# Automatic HTML Website Library

A static website catalog powered by GitHub Actions + Python + Vercel.

## How it works

Put HTML websites inside category folders:

```text
showroom/
  car1.html

healthcare/
  doctor1.html

automotive/
  bike1.html
```

Push/upload the files to GitHub.

GitHub Actions automatically scans the folders and creates `catalog.json`.

The `index.html` page reads `catalog.json` and automatically creates:

- Live iframe previews
- Website cards
- Category filters
- Search
- Open Website buttons

## Important

You do NOT edit `index.html` when adding a new website.

Just upload the HTML file into the correct category folder.

## Your current categories

The generator recognizes your existing folders, including:

- ecommerce
- funtiers
- healthcare
- images (ignored)
- logic
- realestate
- resturent-hotels
- ShowRoom

`images` is ignored because it is treated as an asset folder, not a website category.

## Optional HTML metadata

Inside a website HTML file you can add:

```html
<title>Luxury Car Showroom</title>
<meta name="description" content="A modern luxury car showroom website.">
```

The Python generator will automatically use these for the card.

If no metadata is present, the card name is generated from the filename.

## Vercel

Import this GitHub repository into Vercel.

Every GitHub push will trigger the GitHub Action and Vercel deployment.

The generated `catalog.json` is committed back to the repository, so the deployed index can read it normally.
