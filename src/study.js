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

export function createQuiz(text, limit = 4) {
  const flashcards = createFlashcards(text, limit);

  return flashcards.map((card, index) => ({
    question: card.front.replace("What should you remember about", `Question ${index + 1}: Explain`),
    answer: card.back
  }));
}

export function buildStudyPlan(topic, goal) {
  const goalText = {
    exam: "focus on recall and practice questions",
    review: "focus on understanding the main ideas",
    presentation: "focus on explaining the topic clearly"
  }[goal] || "focus on reviewing the topic";

  return [
    `Spend 5 minutes skimming the summary for ${topic}.`,
    `Spend 10 minutes reviewing key terms and writing one example for each term.`,
    `Spend 10 minutes answering the practice quiz without looking at the answers.`,
    `Spend 5 minutes reviewing missed answers and deciding what to study next.`,
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

  return {
    summary: buildSummary(text),
    keywords: extractKeywords(text),
    flashcards: createFlashcards(text),
    quiz: createQuiz(text),
    plan: buildStudyPlan(topic, goal),
    readTimeMinutes: estimateReadTime(text)
  };
}
