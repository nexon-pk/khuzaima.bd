# 🎂 Muhammad Khuzaima's 2nd Birthday Website

A cinematic, interactive, pastel-pink birthday presentation website built for **Muhammad Khuzaima** on his 2nd birthday, created with love by his uncle, **Ali Khawaja**.

This project is built using 100% pure static web standards (HTML5, CSS3, Vanilla JavaScript, and HTML5 Canvas), making it completely compatible with **GitHub Pages** with zero build tools, zero frameworks, and zero server dependencies.

---

## 🌟 Features

- **One-Stage Presentation Mode**: The experience flows seamlessly through 5 distinct cinematic stages without scrolling.
  1. **Countdown & Fireworks**: Smooth 3-2-1 countdown followed by animated rocket trails, fireworks, and confetti.
  2. **Balloons Name Reveal**: Coordinated red and royal-blue balloons float in with realistic strings to reveal his name.
  3. **3-Tier Real Photo Cake**: An assembling 3-tier birthday cake featuring actual photos of Muhammad Khuzaima on each tier, complete with flickering 2nd-year candles and a "Khuzaima" cake topper.
  4. **Birthday Gift Reveals**:
     - **Gift 1**: Fictional £100,000,000 birthday cheque signed by Ali Khawaja (with interactive zoom).
     - **Gift 2**: 2 × iPhone 18 Pro Max flying in with golden shine.
     - **Gift 3**: 2 × Range Rover luxury twin SUVs with birthday ribbons.
  5. **Personal Birthday Wishes**: Muhammad Khuzaima's framed portrait with golden crown, uncle Ali Khawaja's heartfelt prayer, and a replay button.
- **Audio & Music**: Built-in procedural Web Audio API music-box chime for "Happy Birthday", with support for an optional `celebration.mp3` audio track and an accessible mute/play toggle.
- **Single Configuration File**: Easily change messages, photos, and gifts from `js/birthday-data.js` without touching animation logic.

---

## 📁 Project Structure

```text
khuzaima-birthday/
├── index.html                   # Main entry point (served directly by GitHub Pages)
├── README.md                    # Complete setup and publishing documentation
├── .nojekyll                    # Ensures GitHub Pages bypasses Jekyll build processing
├── css/
│   └── style.css                # Premium pastel-pink responsive design & animations
├── js/
│   ├── birthday-data.js         # Single editable configuration file
│   └── main.js                  # Presentation state machine, particles & audio
└── assets/
    ├── images/
    │   ├── cake-layer-1.jpg     # Bottom tier photo (Adventurous Khuzaima)
    │   ├── cake-layer-2.jpg     # Middle tier photo (Playful smile)
    │   ├── cake-layer-3.jpg     # Top tier photo (Formal with bow tie)
    │   ├── birthday-portrait.jpg# Stage 5 final portrait
    │   ├── cheque-gift.jpg      # £100M Birthday Cheque illustration
    │   ├── iphone-gift.jpg      # iPhone 18 Pro Max gift asset
    │   └── rangerover-gift.jpg  # Range Rover gift asset
    └── audio/
        └── celebration.mp3      # (Optional) Custom celebration audio track
```

---

## 1. How to Open and Preview the Website Locally

Because this project uses static HTML, CSS, and JavaScript, you can run it locally in any modern web browser.

### Option A: Double-Click (Direct)
Simply double-click `index.html` in your file explorer to open it in your default web browser (Chrome, Safari, Edge, or Firefox).

### Option B: Local Web Server (Recommended)
Running through a local web server ensures browser audio policies and relative image caching behave identically to GitHub Pages:

#### Using Python 3:
```bash
# In the project directory:
python -m http.server 8000
```
Then open your browser at:
`http://localhost:8000`

#### Using Node.js (npx):
```bash
npx serve .
```

#### Using VS Code / IDE:
Right-click `index.html` and click **"Open with Live Server"**.

---

## 2. How to Update Photos & Images

All images are stored in `assets/images/`:

| File Name | Purpose | Recommended Aspect |
|---|---|---|
| `cake-layer-1.jpg` | Bottom cake tier | Square or vertical portrait |
| `cake-layer-2.jpg` | Middle cake tier | Square or vertical portrait |
| `cake-layer-3.jpg` | Top cake tier | Square or vertical portrait |
| `birthday-portrait.jpg` | Stage 5 grand finale framed portrait | Square or vertical portrait |
| `cheque-gift.jpg` | Gift 1: £100,000,000 cheque | Landscape (approx 3:2) |
| `iphone-gift.jpg` | Gift 2: iPhone 18 Pro Max | Square or transparent PNG |
| `rangerover-gift.jpg` | Gift 3: Range Rover SUV | Landscape (approx 3:2) |

To swap in a new photo:
1. Copy your photo into `assets/images/`.
2. Name it with the same filename (e.g. `birthday-portrait.jpg`) OR update the path in `js/birthday-data.js`.
3. If you need to re-center the face in the circle, open `js/birthday-data.js` and adjust `objectPosition` (e.g., `'center 15%'` or `'center 30%'`).

---

## 3. How to Edit the Configuration File

All texts, names, dates, amounts, and greetings are centralized inside [`js/birthday-data.js`](./js/birthday-data.js).

Example snippet from `js/birthday-data.js`:
```javascript
const BIRTHDAY_CONFIG = {
  nephewName: "Muhammad Khuzaima",
  nickname: "Superstar",
  age: 2,
  uncleName: "Ali Khawaja",

  // Customize final wishes message
  stage5: {
    heading: "HAPPY 2ND BIRTHDAY",
    name: "MUHAMMAD KHUZAIMA",
    message: "Happy 2nd birthday, my little superstar! May Allah bless you with happiness, health, endless smiles, and a beautiful life. Lots of love from your uncle, Ali Khawaja.",
    signOff: "LOTS OF LOVE, ALI KHAWAJA"
  }
};
```

Simply edit the text inside the quotes, save the file, and refresh your browser.

---

## 4. How to Add Custom Audio / Music

The website includes a built-in music-box synthesizer that automatically plays the "Happy Birthday" tune when the visitor turns on sound.

If you would like to play a specific song (such as a nursery rhyme, birthday song, or family audio recording):
1. Place your MP3 audio file into `assets/audio/`.
2. Name it `celebration.mp3`.
3. When visitors tap the music icon or enter the celebration, your audio file will play automatically.

---

## 5. How to Upload the Project to GitHub

Follow these steps to upload your project files to your GitHub account:

### Step 1: Create a GitHub Repository
1. Log in to [GitHub](https://github.com/).
2. In the top-right corner, click the **`+`** icon and select **"New repository"**.
3. Choose a repository name (e.g. `khuzaima-birthday` or `birthday-surprise`).
4. Set visibility to **Public** (required for free GitHub Pages).
5. **Do NOT** initialize with a README, .gitignore, or license (you already have them in this folder).
6. Click **"Create repository"**.

### Step 2: Push Your Local Files to GitHub
Open your terminal or command prompt in the project folder and run:

```bash
git init
git add .
git commit -m "Initial commit: Muhammad Khuzaima 2nd birthday website"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```
> **Note:** Replace `USERNAME` with your actual GitHub username and `REPOSITORY` with your actual repository name.

---

## 6. How to Enable GitHub Pages

Once your files are pushed to GitHub:

1. Open your repository on GitHub (`https://github.com/USERNAME/REPOSITORY`).
2. Click on the **"Settings"** tab near the top right of the repository.
3. In the left sidebar under the "Code and automation" section, click **"Pages"**.
4. Under **"Build and deployment"**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main`.
   - **Folder**: Select `/ (root)`.
5. Click **"Save"**.
6. Wait 1 to 2 minutes for the GitHub Actions deployment to complete.

---

## 7. How to Find the Published Website URL

1. Refresh the **Pages** page in repository Settings.
2. At the top of the page, GitHub will show:
   > **"Your site is live at https://USERNAME.github.io/REPOSITORY/"**
3. Click the link to open Muhammad Khuzaima's published 2nd birthday website!

---

## 🔒 License & Personal Dedication

This website was built with utmost love by **Ali Khawaja** for his beloved nephew **Muhammad Khuzaima** on the milestone occasion of his 2nd birthday.
