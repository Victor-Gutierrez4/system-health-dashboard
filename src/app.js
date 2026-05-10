import { generateStudyKit } from "./study.js";

const sampleNotes = `Subnetting is a networking method that divides one larger network into smaller network sections. An IP address identifies a device, while a subnet mask shows which part of the address is the network portion and which part is the host portion. Routers use network information to forward traffic between networks. Subnetting helps organize networks, reduce unnecessary traffic, and improve address management.`;
const sampleProblems = `I get confused when deciding which part of the IP address is the network part and how the subnet mask changes the number of available hosts.`;

const topicOptions = {
  Technology: ["Computer basics", "Cloud computing", "Databases", "Artificial intelligence", "Web development"],
  Cybersecurity: ["Phishing", "Password security", "Firewalls", "Malware", "Multi-factor authentication"],
  Networking: ["Networking basics", "Subnetting", "Routers and switches", "DNS", "IP addressing"],
  Programming: ["Python functions", "JavaScript arrays", "React components", "APIs", "Debugging"],
  Mathematics: ["Algebra", "Fractions", "Linear equations", "Geometry", "Statistics"],
  Science: ["Photosynthesis", "Cells", "Forces and motion", "Electricity", "Chemistry basics"],
  History: ["World War II", "American Revolution", "Ancient Rome", "Civil Rights Movement", "Industrial Revolution"],
  "English and Writing": ["Thesis statements", "Essay structure", "Grammar", "Reading comprehension", "Research writing"],
  Business: ["Marketing basics", "Accounting basics", "Entrepreneurship", "Management", "Personal finance"],
  Health: ["Nutrition", "Exercise basics", "Mental health", "First aid", "Human body systems"],
  "Language Learning": ["Spanish basics", "French basics", "Vocabulary practice", "Verb conjugation", "Conversation practice"],
  "Test Preparation": ["SAT reading", "SAT math", "ACT science", "CompTIA A+ basics", "Study skills"],
  Other: ["Custom topic"]
};

const elements = {
  signedInName: document.getElementById("signedInName"),
  styleSummary: document.getElementById("styleSummary"),
  nameInput: document.getElementById("nameInput"),
  emailInput: document.getElementById("emailInput"),
  connectAiButton: document.getElementById("connectAiButton"),
  connectAiStatus: document.getElementById("connectAiStatus"),
  subjectInput: document.getElementById("subjectInput"),
  topicInput: document.getElementById("topicInput"),
  problemsInput: document.getElementById("problemsInput"),
  difficultyInput: document.getElementById("difficultyInput"),
  paceInput: document.getElementById("paceInput"),
  sampleButton: document.getElementById("sampleButton"),
  personalizedIntro: document.getElementById("personalizedIntro"),
  aiStatus: document.getElementById("aiStatus"),
  readTime: document.getElementById("readTime"),
  lessonTabs: document.getElementById("lessonTabs"),
  lessonOutput: document.getElementById("lessonOutput"),
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

let latestRequestId = 0;

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

function setLessonStep(stepId) {
  document.querySelectorAll(".lesson-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === stepId);
  });

  document.querySelectorAll(".lesson-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.step === stepId);
  });
}

function populateSpecificTopics() {
  const subject = elements.subjectInput.value;
  const options = topicOptions[subject] || topicOptions.Other;
  const current = elements.topicInput.value;
  clear(elements.topicInput);

  options.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    elements.topicInput.appendChild(option);
  });

  if (options.includes(current)) {
    elements.topicInput.value = current;
  }
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

function renderResourceCards(container, items, type) {
  clear(container);
  items.forEach((item) => {
    const link = document.createElement("a");
    link.className = `resource-card ${type}`;
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.innerHTML = `<span>${item.source}</span><strong>${item.title}</strong><p>${item.preview}</p>`;
    container.appendChild(link);
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

  const activePanel = document.querySelector(".lesson-panel.active");
  if (activePanel?.hidden) {
    const firstVisible = [...document.querySelectorAll(".lesson-panel")].find((panel) => !panel.hidden);
    if (firstVisible) setLessonStep(firstVisible.id);
  }
}

function buildStudyPrompt(topic) {
  const subject = elements.subjectInput.value;
  const difficulty = elements.difficultyInput.value;
  const pace = elements.paceInput.value;
  const problems = elements.problemsInput.value.trim() || "No specific confusion entered.";
  const methods = selectedMethods().join(", ");

  return `You are StudyPath AI, a patient expert tutor. Create a clear study guide for a learner.

Subject area: ${subject}
Specific topic: ${topic}
Difficulty: ${difficulty}
Study pace: ${pace}
Learner's problems/questions: ${problems}
Requested study methods: ${methods}

Return ONLY valid JSON. Do not include markdown fences.
Use this exact shape:
{
  "summary": "A strong 1-2 paragraph explanation that teaches the topic clearly.",
  "lesson": [{"title":"1. ...","detail":"..."}],
  "keywords": [{"term":"...","count":1}],
  "discussion": [{"title":"...","detail":"..."}],
  "flashcards": [{"front":"...","back":"..."}],
  "quiz": [{"question":"...","answer":"..."}],
  "practice": [{"prompt":"...","hint":"..."}],
  "plan": ["...", "..."]
}

Make the lesson knowledgeable, specific, and useful. Explain the learner's confusion directly.`;
}

function parseAIJson(responseText) {
  const cleaned = String(responseText)
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const jsonText = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
  return JSON.parse(jsonText);
}

function extractAIText(response) {
  if (typeof response === "string") return response;
  if (response?.message?.content) return response.message.content;
  if (response?.text) return response.text;
  if (response?.content) return response.content;
  if (response?.output_text) return response.output_text;
  return String(response || "");
}

function kitFromPlainAIText(aiText, fallbackKit) {
  return {
    ...fallbackKit,
    summary: aiText,
    lesson: [
      {
        title: "AI Tutor Response",
        detail: aiText
      }
    ]
  };
}

function normalizeAIKit(aiKit, fallbackKit) {
  return {
    ...fallbackKit,
    summary: aiKit.summary || fallbackKit.summary,
    lesson: Array.isArray(aiKit.lesson) ? aiKit.lesson : fallbackKit.lesson,
    keywords: Array.isArray(aiKit.keywords) ? aiKit.keywords : fallbackKit.keywords,
    discussion: Array.isArray(aiKit.discussion) ? aiKit.discussion : fallbackKit.discussion,
    flashcards: Array.isArray(aiKit.flashcards) ? aiKit.flashcards : fallbackKit.flashcards,
    quiz: Array.isArray(aiKit.quiz) ? aiKit.quiz : fallbackKit.quiz,
    practice: Array.isArray(aiKit.practice) ? aiKit.practice : fallbackKit.practice,
    plan: Array.isArray(aiKit.plan) ? aiKit.plan : fallbackKit.plan
  };
}

async function getAIStudyKit(topic, fallbackKit) {
  if (!window.puter?.ai?.chat) {
    elements.aiStatus.textContent = "AI library unavailable. Check your connection or disable browser blockers, then refresh.";
    return fallbackKit;
  }

  if (window.puter?.auth?.isSignedIn && !window.puter.auth.isSignedIn()) {
    elements.aiStatus.textContent = "AI is not connected. Go back to the login screen and click Connect AI.";
    return fallbackKit;
  }

  elements.aiStatus.textContent = "Generating with AI...";

  try {
    let response;
    try {
      response = await window.puter.ai.chat(buildStudyPrompt(topic));
    } catch {
      response = await window.puter.ai.chat(buildStudyPrompt(topic), { model: "gpt-5-nano" });
    }
    const aiText = extractAIText(response);

    try {
      const aiKit = parseAIJson(aiText);
      elements.aiStatus.textContent = "AI-generated lesson ready.";
      return normalizeAIKit(aiKit, fallbackKit);
    } catch {
      elements.aiStatus.textContent = "AI responded, but not as structured JSON. Showing the AI explanation.";
      return kitFromPlainAIText(aiText, fallbackKit);
    }
  } catch (error) {
    elements.aiStatus.textContent = `AI request failed: ${error?.message || "provider unavailable"}. Showing local fallback guide.`;
    return fallbackKit;
  }
}

async function connectAI() {
  if (!window.puter?.auth?.signIn) {
    elements.connectAiStatus.textContent = "AI connection failed: Puter.js did not load. Try refreshing or disabling browser blockers.";
    return;
  }

  elements.connectAiStatus.textContent = "Opening AI sign-in...";

  try {
    if (!window.puter.auth.isSignedIn()) {
      await window.puter.auth.signIn({ attempt_temp_user_creation: true });
    }

    elements.connectAiStatus.textContent = "AI connected. You can continue.";
  } catch (error) {
    elements.connectAiStatus.textContent = `AI connection failed: ${error?.message || "sign-in was not completed"}.`;
  }
}

async function renderStudyGuide() {
  const requestId = ++latestRequestId;
  const topic = elements.topicInput.value.trim() || elements.subjectInput.value;
  const localStudyText = `${topic}. ${elements.subjectInput.value}. ${elements.problemsInput.value}`;
  const fallbackKit = generateStudyKit(localStudyText, {
    topic,
    goal: "review",
    difficulty: elements.difficultyInput.value,
    pace: elements.paceInput.value,
    problems: elements.problemsInput.value,
    style: "mixed"
  });

  let kit = fallbackKit;

  if (document.getElementById("learnPage").classList.contains("active")) {
    kit = await getAIStudyKit(topic, fallbackKit);
    if (requestId !== latestRequestId) return;
  }

  elements.signedInName.textContent = elements.nameInput.value || "Guest Learner";
  elements.styleSummary.textContent = `${elements.difficultyInput.options[elements.difficultyInput.selectedIndex].text} / ${elements.paceInput.options[elements.paceInput.selectedIndex].text}`;
  elements.personalizedIntro.textContent =
    `${elements.nameInput.value || "This learner"} is studying ${topic} under ${elements.subjectInput.value}. The guide focuses on the questions or problems they entered and presents the material in the study formats they selected.`;
  elements.readTime.textContent = `${kit.readTimeMinutes || fallbackKit.readTimeMinutes} min`;
  elements.summaryOutput.textContent = kit.summary || `Start by defining ${topic}, then study one example and practice explaining it.`;

  renderInfoCards(elements.lessonOutput, kit.lesson);
  renderInfoCards(elements.discussionOutput, kit.discussion);
  renderResourceCards(elements.videoOutput, kit.videoResources, "video");
  renderResourceCards(elements.textbookOutput, kit.textResources, "text");
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
  populateSpecificTopics();
  elements.topicInput.value = "Subnetting";
  elements.problemsInput.value = sampleProblems;
  elements.difficultyInput.value = "intermediate";
  elements.paceInput.value = "steady";
  renderStudyGuide();
}

document.querySelectorAll(".page-next").forEach((button) => {
  button.addEventListener("click", () => setPage(button.dataset.page));
});

elements.lessonTabs.addEventListener("click", (event) => {
  const button = event.target.closest(".lesson-tab");
  if (button) setLessonStep(button.dataset.step);
});

document.querySelectorAll("input, select, textarea").forEach((input) => {
  input.addEventListener("input", renderStudyGuide);
  input.addEventListener("change", renderStudyGuide);
});

document.querySelectorAll(".methodInput").forEach((input) => {
  input.addEventListener("change", updateVisibleMethods);
});

elements.connectAiButton.addEventListener("click", connectAI);

elements.subjectInput.addEventListener("change", () => {
  populateSpecificTopics();
  renderStudyGuide();
});

elements.sampleButton.addEventListener("click", loadSample);

populateSpecificTopics();
loadSample();
