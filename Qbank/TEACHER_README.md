# VaNi Question Viewer — Teacher Guide

A simple tool to browse NEET / CUET questions from the VaNi question bank. View answers, explanations, and switch between English / Hindi / Telugu. **Read-only** — you can browse, but nothing you do here changes the database.

---

## What you received

A folder called `Qbank` containing the viewer files and a `config.json` file that has your access code.

---

## One-time setup (only the first time)

**You only need to do this once on your computer.**

### Step 1 — Install Python

1. Open the Microsoft Store on your Windows computer.
2. Search for **Python 3** (or click this link: <https://apps.microsoft.com/detail/9NRWMJP3717K>).
3. Click **Get** / **Install**. It takes about 1 minute.
4. Done. You won't have to do this again.

> **Why?** Python comes with a tiny built-in tool that lets the viewer run on your computer. You will not write any code.

---

## Every time you want to review questions

### Step 2 — Start the viewer

1. Open the `Qbank` folder.
2. Double-click **`start-viewer.bat`**.
3. A black window will open with text in it. **Leave this window open.** Closing it stops the viewer.
4. Your default web browser will open automatically and show a login page.

### Step 3 — Sign in

1. Enter the **access code** that was given to you.
2. Click **Sign in**.

### Step 4 — Open the Viewer

1. In the top navigation bar, click **👀 Viewer**.
2. Pick an exam (NEET or CUET), then a subject, then a chapter.
3. Click any question on the left to see its full text, options, correct answer, explanation, and per-option hints on the right.
4. Use the **EN / HI / TE** buttons to switch the language.

### Step 5 — Done for the day

1. Close the browser tab.
2. Close the black window (the one that opened in Step 2).

That's it.

---

## Things to know

- **Filters cascade**: Exam → Subject → Chapter → Topic. You can also filter by question type (MCQ, True/False, etc.) and status.
- **Search**: There's a search box above the question list — type any word to filter.
- **Languages**: If a Hindi or Telugu translation is missing for a question, you'll see *"— not available in HI —"* instead of falling back to English. This is intentional, so you know exactly what's translated and what isn't.
- **Question ID**: Click the small grey ID code on a question to copy it (useful if you want to flag a question to the team).

---

## Troubleshooting

### "Python is not installed" error when I double-click

You haven't done **Step 1** yet, or the install didn't complete. Open the Microsoft Store and install **Python 3**, then try again.

### The browser didn't open automatically

Open your browser yourself and go to: <http://localhost:8080/login.html>

### "Address already in use" or the page won't load

Another copy of the viewer is probably already running. Close all the black "VaNi Question Viewer" windows you can see, then double-click `start-viewer.bat` again.

### "Access denied" after signing in

Your access code is for a different role. Contact the team — they'll fix your `config.json`.

### I see a different question count than my colleague

That's expected. Each access code is set up to show only the subjects you're assigned to review.

---

## Need help?

Contact the VaNi team. Tell them:
1. Which step in this guide you got stuck on.
2. What the screen says (you can take a screenshot of the black window or the browser).
