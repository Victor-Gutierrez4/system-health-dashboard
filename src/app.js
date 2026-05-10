import { generateStudyKit } from "./study.js";

const sampleNotes = `Networking is the process of connecting computers, servers, and devices so they can communicate and share resources. A router forwards traffic between different networks and helps devices reach the internet. A switch connects devices inside the same local network and uses MAC addresses to forward frames. An IP address identifies a device on a network, while DNS translates domain names into IP addresses. Cybersecurity protects systems, networks, and data from unauthorized access. Common security practices include strong passwords, multi-factor authentication, software updates, firewalls, backups, and user awareness. Troubleshooting often starts by checking the physical connection, confirming network settings, testing DNS, and reviewing error messages.`;

const form = document.getElementById("studyForm");
const notesInput = document.getElementById("notesInput");
const topicInput = document.getElementById("topicInput");
const goalInput = document.getElementById("goalInput");
const sampleButton = document.getElementById("sampleButton");

function renderKeywords(keywords) {
  const container = document.getElementById("keywordsOutput");
  container.innerHTML = "";

  keywords.forEach((keyword) => {
    const item = document.createElement("button");
    item.className = "keyword-chip";
    item.type = "button";
    item.innerHTML = `<strong>${keyword.term}</strong><span>Appears ${keyword.count} time${keyword.count === 1 ? "" : "s"} in the notes.</span>`;
    container.appendChild(item);
  });
}

function renderFlashcards(flashcards) {
  const container = document.getElementById("flashcardsOutput");
  container.innerHTML = "";

  flashcards.forEach((card) => {
    const button = document.createElement("button");
    button.className = "flashcard";
    button.type = "button";
    button.textContent = card.front;
    button.addEventListener("click", () => {
      button.classList.toggle("flipped");
      button.textContent = button.classList.contains("flipped") ? card.back : card.front;
    });
    container.appendChild(button);
  });
}

function renderQuiz(quiz) {
  const container = document.getElementById("quizOutput");
  container.innerHTML = "";

  quiz.forEach((item) => {
    const details = document.createElement("details");
    details.className = "quiz-item";
    details.innerHTML = `<summary>${item.question}</summary><p>${item.answer}</p>`;
    container.appendChild(details);
  });
}

function renderPlan(plan) {
  const container = document.getElementById("planOutput");
  container.innerHTML = "";

  plan.forEach((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    container.appendChild(item);
  });
}

function renderStudyKit(kit) {
  document.getElementById("summaryOutput").textContent = kit.summary || "Add more notes to generate a useful summary.";
  document.getElementById("readTime").textContent = `${kit.readTimeMinutes} min read`;
  renderKeywords(kit.keywords);
  renderFlashcards(kit.flashcards);
  renderQuiz(kit.quiz);
  renderPlan(kit.plan);
}

sampleButton.addEventListener("click", () => {
  notesInput.value = sampleNotes;
  topicInput.value = "Networking and Cybersecurity Basics";
  goalInput.value = "exam";
  renderStudyKit(generateStudyKit(notesInput.value, { topic: topicInput.value, goal: goalInput.value }));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = notesInput.value.trim();

  if (text.length < 80) {
    notesInput.focus();
    document.getElementById("summaryOutput").textContent = "Paste at least a short paragraph of notes so the tool has enough information to analyze.";
    return;
  }

  renderStudyKit(generateStudyKit(text, { topic: topicInput.value, goal: goalInput.value }));
});

notesInput.value = sampleNotes;
renderStudyKit(generateStudyKit(sampleNotes, {
  topic: "Networking and Cybersecurity Basics",
  goal: "exam"
}));
