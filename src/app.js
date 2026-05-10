import { generateStudyKit } from "./study.js";

const sampleNotes = `Subnetting is a networking method that divides one larger network into smaller network sections. An IP address identifies a device, while a subnet mask shows which part of the address is the network portion and which part is the host portion. Routers use network information to forward traffic between networks. Subnetting helps organize networks, reduce unnecessary traffic, and improve address management.`;
const sampleProblems = `I get confused when deciding which part of the IP address is the network part and how the subnet mask changes the number of available hosts.`;

const elements = {
  signedInName: document.getElementById("signedInName"),
  styleSummary: document.getElementById("styleSummary"),
  nameInput: document.getElementById("nameInput"),
  emailInput: document.getElementById("emailInput"),
  subjectInput: document.getElementById("subjectInput"),
  topicInput: document.getElementById("topicInput"),
  notesInput: document.getElementById("notesInput"),
  problemsInput: document.getElementById("problemsInput"),
  difficultyInput: document.getElementById("difficultyInput"),
  paceInput: document.getElementById("paceInput"),
  sampleButton: document.getElementById("sampleButton"),
  personalizedIntro: document.getElementById("personalizedIntro"),
  readTime: document.getElementById("readTime"),
  summaryOutput: document.getElementById("summaryOutput"),
  discussionOutput: document.getElementById("discussionOutput"),
  videoOutput: document.getElementById("videoOutput"),
  textbookOutput: document.getElementById("textbookOutput"),
  powerpointOutput: document.getElementById("powerpointOutput"),
  keywordsOutput: document.getElementById("keywordsOutput"),
  flashcardsOutput: document.getElementById("flashcardsOutput"),
  quizOutput: document.getElementById("quizOutput"),
  practiceOutput: document.getElementById("practiceOutput"),
  planOutput: document.getElementById("planOutput")
};

function clear(element) {
  element.innerHTML = "";
}

function selectedMethods() {
  return [...document.querySelectorAll(".methodInput:checked")].map((input) => input.value);
}

function setPage(pageId) {
  document.querySelectorAll(".page-section").forEach((page) => {
    page.classList.toggle("active", page.id === pageId);
  });

  if (pageId === "learnPage") {
    renderStudyGuide();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderList(container, items) {
  clear(container);
  items.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    container.appendChild(item);
  });
}

function renderInfoCards(container, items) {
  clear(container);
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "method-card";
    card.innerHTML = `<strong>${item.title}</strong><p>${item.detail}</p>`;
    container.appendChild(card);
  });
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

function renderRevealCards(container, items, getQuestion, getAnswer) {
  clear(container);
  items.forEach((item) => {
    const details = document.createElement("details");
    details.className = "quiz-item";
    details.innerHTML = `<summary>${getQuestion(item)}</summary><p>${getAnswer(item)}</p>`;
    container.appendChild(details);
  });
}

function updateVisibleMethods() {
  const methods = selectedMethods();
  document.querySelectorAll("[data-method]").forEach((card) => {
    card.hidden = !methods.includes(card.dataset.method);
  });
}

function buildStudyText(topic) {
  return elements.notesInput.value.trim() || `${topic} is the topic the user wants to study.`;
}

function renderStudyGuide() {
  const topic = elements.topicInput.value.trim() || elements.subjectInput.value;
  const kit = generateStudyKit(buildStudyText(topic), {
    topic,
    goal: "review",
    difficulty: elements.difficultyInput.value,
    pace: elements.paceInput.value,
    problems: elements.problemsInput.value,
    style: "mixed"
  });

  elements.signedInName.textContent = elements.nameInput.value || "Guest Learner";
  elements.styleSummary.textContent = `${elements.difficultyInput.options[elements.difficultyInput.selectedIndex].text} / ${elements.paceInput.options[elements.paceInput.selectedIndex].text}`;
  elements.personalizedIntro.textContent =
    `${elements.nameInput.value || "This learner"} is studying ${topic} under ${elements.subjectInput.value}. The guide focuses on the questions or problems they entered and presents the material in the study formats they selected.`;
  elements.readTime.textContent = `${kit.readTimeMinutes} min`;
  elements.summaryOutput.textContent = kit.summary || `Start by defining ${topic}, then study one example and practice explaining it.`;

  renderInfoCards(elements.discussionOutput, kit.discussion);
  renderList(elements.videoOutput, kit.videoOutline);
  renderList(elements.textbookOutput, kit.textbookGuide);
  renderList(elements.powerpointOutput, kit.powerpointOutline);
  renderKeywords(kit.keywords);
  renderFlashcards(kit.flashcards);
  renderRevealCards(elements.quizOutput, kit.quiz, (item) => item.question, (item) => item.answer);
  renderRevealCards(elements.practiceOutput, kit.practice, (item) => item.prompt, (item) => `Hint: ${item.hint}`);
  renderList(elements.planOutput, kit.plan);
  updateVisibleMethods();
}

function loadSample() {
  elements.subjectInput.value = "Networking";
  elements.topicInput.value = "Subnetting";
  elements.notesInput.value = sampleNotes;
  elements.problemsInput.value = sampleProblems;
  elements.difficultyInput.value = "intermediate";
  elements.paceInput.value = "steady";
  renderStudyGuide();
}

document.querySelectorAll(".page-next").forEach((button) => {
  button.addEventListener("click", () => setPage(button.dataset.page));
});

document.querySelectorAll("input, select, textarea").forEach((input) => {
  input.addEventListener("input", renderStudyGuide);
  input.addEventListener("change", renderStudyGuide);
});

document.querySelectorAll(".methodInput").forEach((input) => {
  input.addEventListener("change", updateVisibleMethods);
});

elements.sampleButton.addEventListener("click", loadSample);

loadSample();
