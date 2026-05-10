# DevStudy AI

DevStudy AI is a React-based AI-style study tool for developers. Users can enter a demo login profile, describe their learning goals, choose a difficulty level, paste notes, and generate a study kit with a summary, key terms, flashcards, quiz questions, and a short study plan.

The project follows the provided design system:

- Primary color: `#4A90E2`
- Secondary color: `#50E3C2`
- Neutral color: `#F0F2F5`
- Text color: `#333333`
- Background: `#FFFFFF`
- Heading font: Montserrat
- Body font: Open Sans
- 20px base padding
- 32px layout gaps
- 8px border radius
- `2px solid #E0E0E0` card borders
- subtle card shadow

## Why I Built It

This project supports a developer and AI-focused career direction. It demonstrates React, HTML, CSS, JavaScript text analysis, user interaction, automated testing, and professional documentation.

## Features

- Demo login section
- About user / learning profile section
- Difficulty selector
- Developer learning path section
- Notes input area
- Summary generator
- Keyword extraction
- Clickable flashcards
- Quiz questions with revealable answers
- Study plan generation

## Technologies Used

- React
- HTML
- CSS
- JavaScript
- Node.js built-in test runner
- GitHub Pages

## Run Locally

Open `index.html` in a browser, or run a local server:

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

The tests validate keyword extraction, summary generation, flashcard creation, quiz generation, difficulty-based questions, read-time estimation, and full study kit generation.
