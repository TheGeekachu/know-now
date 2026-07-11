# ⚡ KnowNow

An adaptive browser extension I built for Stardance. 
`KnowNow` lets you highlight any text on a webpage, right-click, and instantly get an AI-powered overview, deep context, or rapid definition—dynamically depending on the complexity of what was highlighted.

---

## Features

* **Context-Aware Analysis:** Uses AI to judge the situation. Basically, it can figure out the kind of info you're looking for.
* **Predictive Relevant Links:** Generates three stable, relevant links. However, it's kinda stupid cause I haven't added search functionality yet, so some URLs may be faulty.
* **'Beautiful' UI Overlay:** Idk, still improving it, but aesthetics is definitely not taken lightly by me, and the UI will be updated many times.
* **Custom Markdown Parser:** In development.
* **Lightning Fast:** Powered by Groq APIs running `llama-3.1-8b-instant` for almost near-zero latency.

---

## Tech Stack

* **Frontend:** Vanilla JavaScript (Manifest V3, Content Scripts, Service Workers)
* **UI/Styling:** Dynamic DOM Injection with custom CSS (Idk, this is technical mumbo jumbo, but basically this means it was a pain to code)
* **AI Engine:** Groq API Cloud (`llama-3.1-8b-instant`) (It's technically a cloud inference but nah.)

---

## Installation & Setup

Since this extension is in active development, you're gonna have to do some hacking, basically a manual download instead of just navigating to the Extension store. Tedious, I know, but here are the steps:

1. **Clone or Download** this repository to your computer.
2. Open your browser and navigate to the extensions page (e.g., `chrome://extensions/` or `edge://extensions/`).
3. Enable **Developer mode** using the toggle switch in the top right.
4. Click the **Load unpacked** button in the top left.
5. Select the `know-now` project folder from wherever you saved it.
6. Open `background.js` and insert your own Groq API key is populated. (BTW, I forgot to say this earlier, but you need a GROQ key. This is designed to work with the free tier.)

---

## Development Log (Stardance Time Tracking)

Total Time Spent: **3+ Hours**

* **Day 1: Makin' it work (Sort of)**
    * Asked Gemini how the hell to make this work.
    * Gemini was useless so I figured it out.
    * Wrote the base code.
    * Realised I forgot to put in the Groq API key.
    * Tested it and was surprised that it worked.
    * Pushed to Git but got notified I forgot to remove the key because it's a public repo.
    * Pushed to Git again.
    * Idk how to write markdown, so I got Gemini to teach me and then wrote this.
---

## License (Just 'cause)

MIT License. Built with VS Code for Hack Club Stardance.