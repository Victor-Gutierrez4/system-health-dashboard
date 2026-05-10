# AI Study Tool

AI Study Tool is a small portfolio project that turns pasted notes into a study summary, key terms, flashcards, quiz questions, and a 30-minute study plan.

The project is designed for a general IT/software career direction with interest in AI-assisted tools. It demonstrates JavaScript, text analysis, user interaction, automated testing, and clear documentation.

## Why I Built It

After reviewing job descriptions related to IT, software support, and AI-assisted technical roles, two skills stood out as useful to develop:

- applied AI-style workflows
- automated testing and professional documentation

This project gives me a realistic way to practice those skills. The first version runs completely in the browser and does not require an API key. It uses deterministic text-analysis logic to simulate the workflow of an AI study assistant.

## Features

- Paste class notes or load sample notes
- Generate a concise summary
- Extract important keywords
- Create clickable flashcards
- Create practice quiz questions
- Build a short study plan based on the user's goal
- Hover over keywords for extra context
- Includes automated tests for the study-generation logic

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js built-in test runner
- GitHub Pages

## Run Locally

Open `index.html` in a browser.

You can also use a local web server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Run Tests

```bash
npm test
```

The tests validate keyword extraction, summary generation, flashcard creation, quiz generation, read-time estimation, and full study kit generation.

## Portfolio Description

AI Study Tool is an applied AI-style learning assistant that transforms notes into study materials. I built it to practice AI workflow design, JavaScript, text analysis, testing, and building a polished interactive project for a portfolio.

## Future Improvements

- Add optional OpenAI API support for more natural summaries
- Let users export flashcards to CSV
- Save previous study kits in browser storage
- Add multiple-choice quiz mode
- Add difficulty settings
