import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSummary,
  createDiscussionPrompts,
  createFlashcards,
  createLearningMethods,
  createPowerPointOutline,
  createPracticeProblems,
  createQuiz,
  createTextResources,
  createTextbookGuide,
  createTutorLesson,
  createVideoResources,
  createVideoOutline,
  estimateReadTime,
  extractKeywords,
  formatQuestion,
  generateStudyKit
} from "../src/study.js";

const notes = `Routers connect different networks and forward packets toward a destination. Switches connect devices inside a local network and forward frames using MAC addresses. DNS translates domain names into IP addresses. Cybersecurity protects systems and data from unauthorized access. Firewalls, updates, backups, and multi-factor authentication reduce risk.`;

test("extracts repeated keywords from notes", () => {
  const keywords = extractKeywords(notes, 5);

  assert.ok(keywords.some((item) => item.term === "network"));
  assert.ok(keywords.length <= 5);
});

test("builds a summary from important sentences", () => {
  const summary = buildSummary(notes, 2);

  assert.ok(summary.includes("network"));
  assert.ok(summary.split(".").length <= 3);
});

test("creates flashcards and quiz questions", () => {
  const flashcards = createFlashcards(notes, 3);
  const quiz = createQuiz(notes, 3, "advanced");

  assert.equal(flashcards.length, 3);
  assert.equal(quiz.length, 3);
  assert.ok(flashcards[0].front.includes("What should you remember"));
  assert.ok(quiz[0].question.includes("Question"));
});

test("formats questions by difficulty", () => {
  const front = 'What should you remember about "router"?';

  assert.ok(formatQuestion(front, 0, "beginner").includes("simple terms"));
  assert.ok(formatQuestion(front, 0, "advanced").includes("scenario"));
});

test("estimates read time with a minimum of one minute", () => {
  assert.equal(estimateReadTime("short notes"), 1);
});

test("generates a complete study kit", () => {
  const kit = generateStudyKit(notes, {
    topic: "Networking",
    goal: "exam",
    difficulty: "advanced",
    problems: "I do not understand DNS.",
    style: "steps",
    pace: "deep"
  });

  assert.ok(kit.summary.length > 0);
  assert.ok(kit.keywords.length > 0);
  assert.ok(kit.flashcards.length > 0);
  assert.ok(kit.quiz.length > 0);
  assert.ok(kit.methods.length > 0);
  assert.ok(kit.practice.length > 0);
  assert.ok(kit.discussion.length > 0);
  assert.ok(kit.videoOutline.length > 0);
  assert.ok(kit.textbookGuide.length > 0);
  assert.ok(kit.powerpointOutline.length > 0);
  assert.ok(kit.lesson.length > 0);
  assert.ok(kit.videoResources.length > 0);
  assert.ok(kit.textResources.length > 0);
  assert.ok(kit.plan.some((step) => step.includes("Networking")));
});

test("creates learning methods based on style", () => {
  const methods = createLearningMethods("Algebra", "visual", "beginner");

  assert.equal(methods[0].title, "Visual Map");
  assert.ok(methods.some((method) => method.detail.includes("Algebra")));
});

test("creates practice problems from a learner concern", () => {
  const practice = createPracticeProblems("Biology", notes, "remembering vocabulary", "beginner");

  assert.ok(practice.length > 0);
  assert.ok(practice[0].prompt.includes("remembering vocabulary"));
  assert.ok(practice[0].hint.includes("Start by defining"));
});

test("creates multiple learning resource formats", () => {
  assert.ok(createDiscussionPrompts("History", notes, "dates").some((item) => item.detail.includes("dates")));
  assert.ok(createVideoOutline("Algebra").some((item) => item.includes("Opening hook")));
  assert.ok(createTextbookGuide("Biology", notes).some((item) => item.includes("Before reading")));
  assert.ok(createPowerPointOutline("Networking", notes).some((item) => item.includes("Slide 1")));
});

test("creates tutor lesson and web resources", () => {
  const lesson = createTutorLesson("Subnetting", notes, "subnet masks", "intermediate");
  const videos = createVideoResources("Subnetting");
  const texts = createTextResources("Subnetting");

  assert.ok(lesson.some((item) => item.detail.includes("subnet masks")));
  assert.ok(videos.every((item) => item.url.includes("youtube.com")));
  assert.ok(texts.some((item) => item.source === "Khan Academy"));
});
