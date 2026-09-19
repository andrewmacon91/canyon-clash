# Canyon Clash — App Store Submission Checklist

You're on **Windows + iPad, no Mac**. That's fine: a cloud service (Codemagic)
does the Mac-only build step. This checklist covers the parts **only you can do**
(accounts, payments, signing). Everything in the code is already done.

Legend: ⬜ = you do it · ✅ = already done for you

---

## Part A — Accounts (one-time)

- ✅ Xcode/Capacitor iOS project scaffolded (`ios/` folder)
- ✅ App icon + splash generated
- ✅ Offline game bundle (no internet needed to play)
- ✅ `codemagic.yaml` cloud-build config
- ⬜ **Apple Developer Program** — enroll at <https://developer.apple.com/programs/enroll/>
      (or the *Apple Developer* app on your iPad). **$99/year.** Needs your Apple ID + a card.
      Enrollment can take a few hours to ~2 days to be approved.
- ⬜ **GitHub account** (free) — <https://github.com/signup>. Codemagic builds from a Git repo.
- ⬜ **Codemagic account** (free tier is enough to start) — sign in with GitHub at
      <https://codemagic.io>.

---

## Part B — Push the code to GitHub

From this folder (`Canyon Clash`) on your PC. (Ask me and I'll run these for you.)

```bash
git init
git add .
git commit -m "Canyon Clash v1"
```

Then create an **empty private repo** on GitHub called `canyon-clash`, and:

```bash
git remote add origin https://github.com/<your-username>/canyon-clash.git
git branch -M main
git push -u origin main
```

---

## Part C — Codemagic: connect signing (the fiddly part)

1. In **App Store Connect** (<https://appstoreconnect.apple.com>, works in any browser/iPad):
   - **Users and Access → Integrations → App Store Connect API** → generate an **API Key**
     with the **App Manager** role. Download the `.p8` file **once** (you can't re-download it),
     and note the **Key ID** and **Issuer ID**.
2. Create the app record: **App Store Connect → Apps → +** →
   - Platform: iOS · Name: **Canyon Clash** · Primary language: English
   - **Bundle ID:** `com.jarvis.canyonclash` (must match `capacitor.config.json` — tell me if you
     want a different one, e.g. using your own domain, and I'll change it everywhere)
   - SKU: `canyonclash01`
3. In **Codemagic → Teams → Integrations → Developer Portal**: add the App Store Connect API key
   (upload the `.p8`, paste Key ID + Issuer ID). **Name it exactly `CanyonClash ASC Key`**
   (that string is referenced in `codemagic.yaml`) — or rename it in the yaml.
4. In **Codemagic**, add this repo as an app, pick **workflow from `codemagic.yaml`**, and
   **Start build**. It will build on a cloud Mac and upload to **TestFlight** automatically.

---

## Part D — Test on your iPad

1. Install **TestFlight** from the App Store on your iPad.
2. After the build finishes and finishes "Processing" in App Store Connect (~5–15 min),
   add yourself under **TestFlight → Internal Testing**.
3. Open TestFlight on the iPad → install **Canyon Clash** → play the real app.

---

## Part E — Submit for review

In App Store Connect, fill the listing:
- ⬜ **Screenshots** — required. Easiest: play the build on your iPad and screenshot
      (need 6.5" iPhone + 12.9" iPad sizes; the iPad shots you can capture directly).
- ⬜ **App icon** — pulled from the build automatically.
- ⬜ **Description, keywords, category** (Games › Action or Arcade).
- ⬜ **Privacy Policy URL** — required. A simple hosted page (I can generate the text; you host it
      free on GitHub Pages).
- ⬜ **App Privacy** questionnaire — currently the game collects **no data** (answer "No" throughout),
      which keeps this simple. *This changes the moment you add ads/analytics.*
- ⬜ **Age rating** questionnaire.
- ⬜ Click **Add for Review → Submit**. First review typically 24–48h.

---

## Known review risks (be aware)

- **Guideline 4.2 (minimum functionality):** Apple can reject apps that feel like a thin web
  wrapper. Canyon Clash has real gameplay, which helps — but the more content/polish, the safer.
- **To actually earn money**, this needs ads (AdMob/Unity Ads) and/or IAP later. That is a
  separate build step and changes the privacy answers. Ask me when you're ready.

---

## Changing the Bundle ID / developer name

`com.jarvis.canyonclash` is a placeholder. If you own a domain or want your real Apple Team
identifier, tell me the new bundle id and I'll update `capacitor.config.json`, `codemagic.yaml`,
and re-sync the iOS project in one pass.
