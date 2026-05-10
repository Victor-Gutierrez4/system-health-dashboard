import { generateStudyKit } from "./study.js";

const sampleNotes = `React is a JavaScript library for building user interfaces with reusable components. Components receive data through props and manage local changes with state. In modern React, hooks such as useState and useMemo help developers organize interactive behavior without writing class components. APIs allow applications to request data from a server, while authentication protects private user information. Automated testing helps developers confirm that important functions continue working after changes. A strong developer workflow includes clean UI design, readable code, version control, documentation, and testing.`;

let difficulty = "intermediate";

const elements = {
  signedInName: document.getElementById("signedInName"),
  nameInput: document.getElementById("nameInput"),
  emailInput: document.getElementById("emailInput"),
  roleInput: document.getElementById("roleInput"),
  focusInput: document.getElementById("focusInput"),
  difficultyOptions: document.getElementById("difficultyOptions"),
  sampleButton: document.getElementById("sampleButton"),
  notesInput: document.getElementById("notesInput"),
  topicInput: document.getElementById("topicInput"),
  goalInput: document.getElementById("goalInput"),
  learningPath: document.getElementById("learningPath"),
  readTime: document.getElementById("readTime"),
  summaryOutput: document.getElementById("summaryOutput"),
  keywordsOutput: document.getElementById("keywordsOutput"),
  flashcardsOutput: document.getElementById("flashcardsOutput"),
  quizOutput: document.getElementById("quizOutput"),
  planOutput: document.getElementById("planOutput")
};

function clear(element) {
  element.innerHTML = "";
}

function renderKeywords(keywords) {
  clear(elements.keywordsOutput);
  keywords.forEach((keyword) => {
    const item = document.createElement("span");
    item.className = "keyword-chip";
    item.innerHTML = `<strong>${keyword.term}</strong><em>Appears ${keyword.count} time${keyword.count === 1 ? "" : "s"}</em>`;
    elements.keywordsOutput.appendChild(item);
  });
}

function renderFlashcards(flashcards) {
  clear(elements.flashcardsOutput);
  flashcards.forEach((card) => {
    const button = document.createElement("button");
    button.className = "flashcard";
    button.type = "button";
    button.textContent = card.front;
    button.addEventListener("click", () => {
      button.classList.toggle("flipped");
      button.textContent = button.classList.contains("flipped") ? card.back : card.front;
    });
    elements.flashcardsOutput.appendChild(button);
  });
}

function renderQuiz(quiz) {
  clear(elements.quizOutput);
  quiz.forEach((item) => {
    const details = document.createElement("details");
    details.className = "quiz-item";
    details.innerHTML = `<summary>${item.question}</summary><p>${item.answer}</p>`;
    elements.quizOutput.appendChild(details);
  });
}

function renderList(container, items) {
  clear(container);
  items.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    container.appendChild(item);
  });
}

function renderLearningPath() {
  renderList(elements.learningPath, [
    `Connect the notes to the role goal: ${elements.roleInput.value || "developer"}.`,
    `Focus examples around: ${elements.focusInput.value || "current technical skills"}.`,
    `Practice at the ${difficulty} level before moving up.`
  ]);
}

function renderStudyKit() {
  const text = elements.notesInput.value.trim();
  const kit = generateStudyKit(text || sampleNotes, {
    topic: elements.topicInput.value,
    goal: elements.goalInput.value,
    difficulty
  });

  elements.signedInName.textContent = elements.nameInput.value || "Guest Developer";
  elements.readTime.textContent = `${kit.readTimeMinutes} min read`;
  elements.summaryOutput.textContent = kit.summary || "Paste more notes to generate a stronger summary.";
  renderKeywords(kit.keywords);
  renderFlashcards(kit.flashcards);
  renderQuiz(kit.quiz);
  renderList(elements.planOutput, kit.plan);
  renderLearningPath();
}

function setDifficulty(nextDifficulty) {
  difficulty = nextDifficulty;
  document.querySelectorAll(".difficulty-option").forEach((button) => {
    button.classList.toggle("active", button.dataset.level === difficulty);
  });
  renderStudyKit();
}

elements.sampleButton.addEventListener("click", () => {
  elements.notesInput.value = sampleNotes;
  elements.topicInput.value = "React Developer Fundamentals";
  elements.goalInput.value = "exam";
  renderStudyKit();
});

elements.difficultyOptions.addEventListener("click", (event) => {
  const button = event.target.closest(".difficulty-option");
  if (button) {
    setDifficulty(button.dataset.level);
  }
});

[
  elements.nameInput,
  elements.emailInput,
  elements.roleInput,
  elements.focusInput,
  elements.notesInput,
  elements.topicInput,
  elements.goalInput
].forEach((input) => {
  input.addEventListener("input", renderStudyKit);
});

elements.notesInput.value = sampleNotes;
renderStudyKit();
