const STOP_WORDS = new Set([
  "about",
  "after",
  "also",
  "and",
  "are",
  "because",
  "been",
  "but",
  "can",
  "from",
  "has",
  "have",
  "into",
  "its",
  "more",
  "that",
  "the",
  "their",
  "then",
  "there",
  "these",
  "they",
  "this",
  "through",
  "with",
  "when",
  "where",
  "will",
  "would",
  "you",
  "your"
]);

export function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 20);
}

export function extractKeywords(text, limit = 8) {
  const words = text
    .toLowerCase()
    .match(/[a-z][a-z0-9-]{3,}/g) || [];

  const counts = new Map();
  words.forEach((word) => {
    const normalized = word.endsWith("s") && word.length > 5 ? word.slice(0, -1) : word;
    if (!STOP_WORDS.has(normalized)) {
      counts.set(normalized, (counts.get(normalized) || 0) + 1);
    }
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([term, count]) => ({ term, count }));
}

export function buildSummary(text, maxSentences = 3) {
  const sentences = splitSentences(text);
  const keywords = extractKeywords(text, 10).map((item) => item.term);

  const ranked = sentences
    .map((sentence, index) => {
      const lower = sentence.toLowerCase();
      const score = keywords.reduce((total, keyword) => total + (lower.includes(keyword) ? 1 : 0), 0);
      return { sentence, index, score };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, maxSentences)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);

  return ranked.join(" ");
}

export function createFlashcards(text, limit = 5) {
  const keywords = extractKeywords(text, limit);
  const sentences = splitSentences(text);

  return keywords.map(({ term }) => {
    const source = sentences.find((sentence) => sentence.toLowerCase().includes(term)) || "";
    return {
      front: `What should you remember about "${term}"?`,
      back: source || `${term} is an important concept from the notes.`
    };
  });
}

export function createQuiz(text, limit = 4, difficulty = "intermediate") {
  const flashcards = createFlashcards(text, limit);

  return flashcards.map((card, index) => ({
    question: formatQuestion(card.front, index, difficulty),
    answer: card.back
  }));
}

export function formatQuestion(front, index, difficulty) {
  const term = front.match(/"([^"]+)"/)?.[1] || "this concept";
  const prompts = {
    beginner: `Question ${index + 1}: What is "${term}" in simple terms?`,
    intermediate: `Question ${index + 1}: Explain how "${term}" connects to the main topic.`,
    advanced: `Question ${index + 1}: Apply "${term}" to a realistic scenario.`
  };
  return prompts[difficulty] || prompts.intermediate;
}

export function buildStudyPlan(topic, goal, difficulty = "intermediate", pace = "steady") {
  const goalText = {
    exam: "focus on recall and practice questions",
    review: "focus on understanding the main ideas",
    presentation: "focus on explaining the topic clearly"
  }[goal] || "focus on reviewing the topic";

  const difficultyText = {
    beginner: "Start with definitions and one example per term.",
    intermediate: "Connect concepts together and practice explaining tradeoffs.",
    advanced: "Practice applying the concepts to scenarios, debugging, and design decisions."
  }[difficulty] || "Connect concepts together and practice explaining tradeoffs.";

  const paceText = {
    quick: "Use a 15-minute sprint and focus only on the highest-value ideas.",
    steady: "Use a 30-minute session with explanation, recall, and practice.",
    deep: "Use a 60-minute session with examples, practice, and reflection."
  }[pace] || "Use a 30-minute session with explanation, recall, and practice.";

  return [
    `Spend 5 minutes skimming the summary for ${topic}.`,
    `Spend 10 minutes reviewing key terms and writing one example for each term.`,
    `Spend 10 minutes answering the practice quiz without looking at the answers.`,
    `Spend 5 minutes reviewing missed answers and deciding what to study next.`,
    `Difficulty focus: ${difficultyText}`,
    `Pace: ${paceText}`,
    `Study goal: ${goalText}.`
  ];
}

export function estimateReadTime(text) {
  const wordCount = (text.match(/\S+/g) || []).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

export function generateStudyKit(text, options = {}) {
  const topic = options.topic || "this topic";
  const goal = options.goal || "review";
  const difficulty = options.difficulty || "intermediate";
  const pace = options.pace || "steady";
  const problems = options.problems || "";
  const style = options.style || "mixed";
  const combinedText = [text, problems].filter(Boolean).join(" ");

  return {
    summary: buildSummary(combinedText),
    keywords: extractKeywords(combinedText),
    flashcards: createFlashcards(combinedText),
    quiz: createQuiz(combinedText, 4, difficulty),
    practice: createPracticeProblems(topic, combinedText, problems, difficulty),
    methods: createLearningMethods(topic, style, difficulty),
    discussion: createDiscussionPrompts(topic, combinedText, problems),
    videoOutline: createVideoOutline(topic, difficulty),
    textbookGuide: createTextbookGuide(topic, combinedText),
    powerpointOutline: createPowerPointOutline(topic, combinedText),
    plan: buildStudyPlan(topic, goal, difficulty, pace),
    readTimeMinutes: estimateReadTime(combinedText)
  };
}

export function createLearningMethods(topic, style = "mixed", difficulty = "intermediate") {
  const methods = [
    {
      title: "Explain",
      detail: `Read the summary, then explain ${topic} out loud in your own words.`
    },
    {
      title: "Recall",
      detail: `Cover the notes and list the key ideas you remember about ${topic}.`
    },
    {
      title: "Practice",
      detail: `Answer the quiz and practice problems, then review only the parts you missed.`
    },
    {
      title: "Apply",
      detail: `Create a real-world example that uses ${topic} at the ${difficulty} level.`
    }
  ];

  if (style === "visual") {
    methods.unshift({ title: "Visual Map", detail: `Draw a simple diagram showing how the main parts of ${topic} connect.` });
  }

  if (style === "steps") {
    methods.unshift({ title: "Step-by-step", detail: `Turn ${topic} into numbered steps and define what happens at each step.` });
  }

  return methods.slice(0, 5);
}

export function createPracticeProblems(topic, text, problems = "", difficulty = "intermediate") {
  const keywords = extractKeywords(text, 4).map((item) => item.term);
  const focus = problems.trim() || `understanding ${topic}`;

  return keywords.map((keyword, index) => ({
    prompt: `Practice ${index + 1}: Use "${keyword}" to solve or explain a problem related to ${focus}.`,
    hint: difficulty === "beginner"
      ? `Start by defining "${keyword}" in one sentence.`
      : `Connect "${keyword}" to the topic and explain why it matters.`
  }));
}

export function createDiscussionPrompts(topic, text, problems = "") {
  const keywords = extractKeywords(text, 3).map((item) => item.term);
  const focus = problems.trim() || `the hardest part of ${topic}`;

  return [
    { title: "Explain it simply", detail: `How would you explain ${topic} to someone who has never studied it before?` },
    { title: "Find the confusion", detail: `What part of ${focus} feels unclear, and what example would make it easier?` },
    { title: "Use key terms", detail: `Use these terms in a short explanation: ${keywords.join(", ") || topic}.` }
  ];
}

export function createVideoOutline(topic, difficulty = "intermediate") {
  return [
    `Opening hook: why ${topic} matters.`,
    `Define the main idea at a ${difficulty} level.`,
    `Walk through one clear example step by step.`,
    "Pause for a quick check-for-understanding question.",
    "End with the top mistakes to avoid and what to review next."
  ];
}

export function createTextbookGuide(topic, text) {
  const keywords = extractKeywords(text, 4).map((item) => item.term);

  return [
    `Before reading: write what you already know about ${topic}.`,
    `During reading: highlight definitions for ${keywords.join(", ") || "the main terms"}.`,
    "After each paragraph: write one sentence that captures the main idea.",
    "After reading: create two questions you still need answered.",
    `Final check: explain how the key terms connect to ${topic}.`
  ];
}

export function createPowerPointOutline(topic, text) {
  const keywords = extractKeywords(text, 4).map((item) => item.term);

  return [
    `Slide 1: ${topic} overview`,
    `Slide 2: Why ${topic} matters`,
    `Slide 3: Key terms - ${keywords.join(", ") || "main vocabulary"}`,
    "Slide 4: Step-by-step explanation or example",
    "Slide 5: Common mistakes or confusing parts",
    "Slide 6: Practice question and answer"
  ];
}
