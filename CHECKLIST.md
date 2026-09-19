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
- ✅ GitHub Actions build workflow (`.github/workflows/ios.yml`) — builds on GitHub's macOS runners
- ✅ Apple Developer account (you're signed in)
- ⬜ Confirm **Apple Developer Program** membership is active ($99/year). Needs your Apple ID + a card;
      enrollment approval can take a few hours to ~2 days.
- ⬜ **GitHub account** (free) — <https://github.com/signup>. This is where the code lives AND where
      the app gets built — no other service needed.

---

## Part B — Push the code to GitHub

The repo is already committed locally. You just need to create the GitHub repo and push.
(Once your GitHub account exists, ask me and I'll run the push for you.)

1. Create an **empty private repo** on GitHub named `canyon-clash` (don't add a README/.gitignore).
2. Then, from this folder:

```bash
git remote add origin https://github.com/<your-username>/canyon-clash.git
git branch -M main
git push -u origin main
```

---

## Part C — Signing + first build (GitHub Actions)

1. **App Store Connect API key** — in **App Store Connect** (<https://appstoreconnect.apple.com>, any browser/iPad):
   **Users and Access → Integrations → App Store Connect API → Team Keys → +** → role **App Manager** →
   **Generate**. Download the `AuthKey_XXXX.p8` file **once** (you can't re-download it) and note the
   **Key ID** and **Issuer ID**.
2. **Create the app record:** **App Store Connect → Apps → +** →
   - Platform: iOS · Name: **Canyon Clash** · Primary language: English (U.S.)
   - **Bundle ID:** `com.jarvis.canyonclash` (tell me if you want your own domain instead and I'll change it everywhere)
   - SKU: `canyonclash01`
3. **Add 3 GitHub secrets** — in your repo: **Settings → Secrets and variables → Actions → New repository secret**.
   Create these three (names must match exactly):
   | Secret name | Value |
   |---|---|
   | `APP_STORE_CONNECT_ISSUER_ID` | the Issuer ID |
   | `APP_STORE_CONNECT_KEY_IDENTIFIER` | the Key ID |
   | `APP_STORE_CONNECT_PRIVATE_KEY` | paste the **entire contents** of the `.p8` file (open it in a text editor) |
4. **Run the build:** repo **Actions** tab → **iOS build → TestFlight** → **Run workflow**.
   (Or push a tag: `git tag v1.0.0 && git push --tags`.) It builds on a macOS runner, signs the app
   using your API key, and uploads to **TestFlight** automatically. First run takes ~10–15 min.

> Note: iOS signing in CI sometimes needs a tweak on the first run (it's the finicky part). If the
> build fails, paste me the failed step's log and I'll fix the workflow.

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
- ⬜ **Privacy Policy URL** — required. The page is ready at `docs/index.html`; host it free on
      GitHub Pages (Settings → Pages → Source: `main` / `docs`). URL: `https://<user>.github.io/canyon-clash/`.
- ⬜ **App Privacy** questionnaire — the app now shows AdMob ads, so answer **Yes**, data is collected.
      Declare: **Identifiers → Device ID** and **Usage Data**, purpose **Third-Party Advertising**,
      linked to the user’s identity **No**, used for tracking **Yes** (because of ads). Google publishes
      the exact "Data collected by AdMob" list — I can walk you through each toggle.
- ⬜ **Age rating** questionnaire.
- ⬜ Click **Add for Review → Submit**. First review typically 24–48h.

---

## Part F — Monetization (AdMob) — the code is DONE, you do the account

The game already has ads wired in (rewarded **Revive** + **Double Coins**, an **interstitial** every other
run, and a **menu banner**), running on Google's **test ad units** so it works with no account.

- ✅ AdMob account created + 3 ad units made (Banner / Interstitial / Rewarded).
- ✅ **Live IDs wired in** — App ID `ca-app-pub-3217608084038215~6988088862` in `Info.plist`; the three
      unit IDs in `www/index.html` (`AD_IDS`). AdMob is in production mode (`initializeForTesting:false`).
- ⚠️ **Do NOT tap your own ads.** The app now serves **real** ads. When you test on your iPad, just let
      the ad appear and close it — never click the ad content. AdMob bans accounts for "invalid traffic."
      (Safer option: send me the *test device ID* printed in the logs on first run and I'll register your
      iPad so it shows tappable test ads.)
- ⬜ In AdMob, link your **bank account + tax info** to get paid (payout threshold is **$100**).
- ⬜ Earnings only start once the app is **live** and getting installs.

---

## Known review risks (be aware)

- **Guideline 4.2 (minimum functionality):** Apple can reject apps that feel like a thin web
  wrapper. Canyon Clash has real gameplay, which helps — but the more content/polish, the safer.
- **App Tracking Transparency:** the app asks permission before using the ad identifier (already wired).
  Don't remove the `NSUserTrackingUsageDescription` string or Apple will reject the build.
- **Test vs. live ads:** ship the build with **your real** ad unit IDs, but never tap them yourself.

---

## Changing the Bundle ID / developer name

`com.jarvis.canyonclash` is a placeholder. If you own a domain or want your real Apple Team
identifier, tell me the new bundle id and I'll update `capacitor.config.json`, `codemagic.yaml`,
and re-sync the iOS project in one pass.
