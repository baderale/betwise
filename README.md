# 🧠 Betwise

**Smarter bets start with better questions.**

Betwise is an AI-powered assistant for FanDuel users who want to validate their parlays using real NBA data. It doesn't predict or recommend bets — it helps you think critically about your choices.

---

## 💡 What It Does

- Accepts a pasted FanDuel bet slip (text format)
- Parses player names, matchups, and stat targets
- Pulls historical NBA performance data via Sportradar
- Feeds structured context into GPT-4
- Returns short, stat-backed insights about your bet logic

---

## 🛠️ Tech Stack

- **LLM:** OpenAI GPT-4
- **Data:** Sportradar NBA API
- **Dev Environment:** [Cursor](https://www.cursor.so/)
- **Language:** TypeScript
- **Deployment:** Local (CLI for now)

---

## 📂 Project Structure
/betwise  
├── /chat → GPT logic and system prompts  
├── /data → Sportradar integration  
├── /session → Local memory for session state  
├── index.ts → Entry point (CLI interface)