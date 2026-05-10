# StudyPath AI

StudyPath AI is a broad-use study assistant website. It can be used for almost any topic: technology, science, math, history, writing, certification prep, or general class notes.

The site uses a multi-page flow:

1. **Profile page**: demo login and user learning preferences.
2. **Study setup page**: the user enters what they want to study, notes they already have, and problems or confusing parts.
3. **Learning dashboard page**: the app generates multiple ways to learn the topic.

## What Users Can Do

- Enter a name and learning profile
- Choose what they are interested in studying
- Describe problems or confusing parts
- Choose difficulty level
- Choose preferred learning style and study pace
- Select which learning methods they want
- Generate a personalized learning dashboard

## Learning Outputs

- Simple explanation of the topic
- Different ways to learn it
- Key terms
- Flashcards
- Practice quiz
- Practice problems
- Personalized study plan

## Design System

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

## Technologies Used

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

The tests validate keyword extraction, summary generation, flashcard creation, quiz generation, difficulty-based questions, learning methods, practice problems, read-time estimation, and full study kit generation.

## Portfolio Description

StudyPath AI is an AI-style learning assistant that turns any study topic into multiple learning paths. I built it to demonstrate applied AI workflow design, interactive frontend development, JavaScript text analysis, automated testing, and professional documentation.
