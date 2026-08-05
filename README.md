# Portfolio

An interactive, 3D portfolio site built with [Three.js](https://threejs.org/) and [Vite](https://vitejs.dev/). The hero features a hand-built, generatively-twisted "blade hub" — a playful nod to rotating turbine machinery — that responds to your mouse and to scroll.

## Structure

```
├── index.html          # page structure
├── src/
│   ├── main.js          # Three.js scene, content rendering, interactions
│   ├── style.css        # design system + layout
│   └── content.js        ← EDIT THIS to update your name, projects, skills, links
├── vite.config.js        # build config — set `base` to your repo name
└── .github/workflows/deploy.yml   # auto-deploys to GitHub Pages on push to main
```

## Editing your content

Everything you're likely to want to change — your name, tagline, projects, skills, and social links — lives in **`src/content.js`**. You shouldn't need to touch anything else to update the copy.

## Running locally

Requires [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm run dev
```

Then open the local URL it prints (usually `http://localhost:5173`).

## Deploying to GitHub Pages

1. **Push this repo to GitHub.**

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. **Set the base path.** Open `vite.config.js` and set `base` to match your repo name:

   - Repo is a **project site** (`github.com/you/portfolio`) → `base: "/portfolio/"`
   - Repo is your **user site** (`github.com/you/you.github.io`) → `base: "/"`

   Commit and push that change.

3. **Turn on Pages.** In your GitHub repo: **Settings → Pages → Source → GitHub Actions**. That's it — the included workflow (`.github/workflows/deploy.yml`) will build and deploy automatically on every push to `main`. Your site will be live at `https://<your-username>.github.io/<your-repo>/` a minute or two after the Actions tab shows a green check.

## Customizing the 3D scene

The hero sculpture is built entirely in code in `src/main.js` (search for "Hero scene") — no external 3D models. Things worth tweaking:

- `BLADE_COUNT` — how many blades radiate from the hub
- `bladeColors` — the accent palette used on the blades
- the twist math inside the geometry loop — controls how sharply each blade spirals

## Credits

Built with [Three.js](https://threejs.org/) and [Vite](https://vitejs.dev/). Fonts: [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque), [Inter](https://fonts.google.com/specimen/Inter), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono).
