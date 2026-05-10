import { generateStudyKit } from "./study.js";

const sampleNotes = `Photosynthesis is the process plants use to convert sunlight, water, and carbon dioxide into glucose and oxygen. Chlorophyll in the chloroplasts absorbs light energy. The light-dependent reactions produce energy molecules, while the Calvin cycle uses carbon dioxide to build sugar. Photosynthesis matters because it supports plant growth and provides oxygen for many living organisms.`;

const sampleProblems = `I understand that plants use sunlight, but I get confused about the difference between the light-dependent reactions and the Calvin cycle.`;

let selectedDifficulty = "intermediate";

const elements = {
  signedInName: document.getElementById("signedInName"),
  nameInput: document.getElementById("nameInput"),
  emailInput: document.getElementById("emailInput"),
  interestInput: document.getElementById("interestInput"),
  goalRoleInput: document.getElementById("goalRoleInput"),
  styleInput: document.getElementById("styleInput"),
  paceInput: document.getElementById("paceInput"),
  topicInput: document.getElementById("topicInput"),
  difficultyInput: document.getElementById("difficultyInput"),
  notesInput: document.getElementById("notesInput"),
  problemsInput: document.getElementById("problemsInput"),
  sampleButton: document.getElementById("sampleButton"),
  personalizedIntro: document.getElementById("personalizedIntro"),
  readTime: document.getElementById("readTime"),
  summaryOutput: document.getElementById("summaryOutput"),
  methodsOutput: document.getElementById("methodsOutput"),
  keywordsOutput: document.getElementById("keywordsOutput"),
  flashcardsOutput: document.getElementById("flashcardsOutput"),
  quizOutput: document.getElementById("quizOutput"),
  practiceOutput: document.getElementById("practiceOutput"),
  planOutput: document.getElementById("planOutput")
};

function clear(element) {
  element.innerHTML = "";
}

function getSelectedMethods() {
  return [...document.querySelectorAll(".methodInput:checked")].map((input) => input.value);
}

function setPage(pageId) {
  document.querySelectorAll(".page-section").forEach((page) => {
    page.classList.toggle("active", page.id === pageId);
  });

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === pageId);
  });

  if (pageId === "dashboardPage") {
    renderStudyKit();
  }
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

function renderCards(container, items) {
  clear(container);

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "method-card";
    card.innerHTML = `<strong>${item.title}</strong><p>${item.detail}</p>`;
    container.appendChild(card);
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

function renderPractice(problems) {
  clear(elements.practiceOutput);

  problems.forEach((problem) => {
    const details = document.createElement("details");
    details.className = "quiz-item";
    details.innerHTML = `<summary>${problem.prompt}</summary><p>Hint: ${problem.hint}</p>`;
    elements.practiceOutput.appendChild(details);
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

function showSelectedMethodCards() {
  const selected = getSelectedMethods();

  document.querySelectorAll("[data-method]").forEach((card) => {
    card.hidden = !selected.includes(card.dataset.method);
  });
}

function renderStudyKit() {
  const topic = elements.topicInput.value.trim() || elements.interestInput.value.trim() || "your topic";
  const text = elements.notesInput.value.trim() || `${topic} is the subject the learner wants to study.`;
  selectedDifficulty = elements.difficultyInput.value;

  const kit = generateStudyKit(text, {
    topic,
    goal: "review",
    difficulty: selectedDifficulty,
    pace: elements.paceInput.value,
    style: elements.styleInput.value,
    problems: elements.problemsInput.value
  });

  elements.signedInName.textContent = elements.nameInput.value || "Guest Learner";
  elements.personalizedIntro.textContent =
    `${elements.nameInput.value || "This learner"} wants to study ${topic}. The dashboard is tuned for ${elements.styleInput.options[elements.styleInput.selectedIndex].text.toLowerCase()}, ${selectedDifficulty} difficulty, and a ${elements.paceInput.options[elements.paceInput.selectedIndex].text.toLowerCase()} pace.`;
  elements.readTime.textContent = `${kit.readTimeMinutes} min read`;
  elements.summaryOutput.textContent = kit.summary || `Start with the main ideas of ${topic}, then practice explaining them in your own words.`;

  renderCards(elements.methodsOutput, kit.methods);
  renderKeywords(kit.keywords);
  renderFlashcards(kit.flashcards);
  renderQuiz(kit.quiz);
  renderPractice(kit.practice);
  renderList(elements.planOutput, kit.plan);
  showSelectedMethodCards();
}

document.querySelectorAll(".tab-button, .page-next").forEach((button) => {
  button.addEventListener("click", () => setPage(button.dataset.page));
});

document.querySelectorAll("input, select, textarea").forEach((input) => {
  input.addEventListener("input", renderStudyKit);
  input.addEventListener("change", renderStudyKit);
});

document.querySelectorAll(".methodInput").forEach((input) => {
  input.addEventListener("change", showSelectedMethodCards);
});

elements.sampleButton.addEventListener("click", () => {
  elements.topicInput.value = "Photosynthesis";
  elements.notesInput.value = sampleNotes;
  elements.problemsInput.value = sampleProblems;
  elements.difficultyInput.value = "intermediate";
  renderStudyKit();
});

elements.notesInput.value = sampleNotes;
elements.problemsInput.value = sampleProblems;
renderStudyKit();
