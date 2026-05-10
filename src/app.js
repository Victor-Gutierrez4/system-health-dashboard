import React, { useMemo, useState } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
import { generateStudyKit } from "./study.js";

const sampleNotes = `React is a JavaScript library for building user interfaces with reusable components. Components receive data through props and manage local changes with state. In modern React, hooks such as useState and useMemo help developers organize interactive behavior without writing class components. APIs allow applications to request data from a server, while authentication protects private user information. Automated testing helps developers confirm that important functions continue working after changes. A strong developer workflow includes clean UI design, readable code, version control, documentation, and testing.`;

function LoginSection({ user, setUser }) {
  return React.createElement("section", { className: "section-panel login-section" },
    React.createElement("div", { className: "section-heading" },
      React.createElement("h2", null, "Login"),
      React.createElement("span", null, "Demo profile")
    ),
    React.createElement("div", { className: "form-grid" },
      React.createElement("label", null, "Name",
        React.createElement("input", {
          value: user.name,
          onChange: (event) => setUser({ ...user, name: event.target.value }),
          placeholder: "Developer name"
        })
      ),
      React.createElement("label", null, "Email",
        React.createElement("input", {
          value: user.email,
          onChange: (event) => setUser({ ...user, email: event.target.value }),
          placeholder: "developer@example.com"
        })
      )
    ),
    React.createElement("p", { className: "helper-text" },
      "This is a front-end demo login section for personalization. It does not store passwords or send data to a server."
    )
  );
}

function AboutUserSection({ user, setUser }) {
  return React.createElement("section", { className: "section-panel" },
    React.createElement("div", { className: "section-heading" },
      React.createElement("h2", null, "About User"),
      React.createElement("span", null, "Learning profile")
    ),
    React.createElement("div", { className: "form-grid" },
      React.createElement("label", null, "Role Goal",
        React.createElement("input", {
          value: user.roleGoal,
          onChange: (event) => setUser({ ...user, roleGoal: event.target.value }),
          placeholder: "Front-end developer"
        })
      ),
      React.createElement("label", null, "Current Focus",
        React.createElement("input", {
          value: user.focus,
          onChange: (event) => setUser({ ...user, focus: event.target.value }),
          placeholder: "React, APIs, testing"
        })
      )
    )
  );
}

function DifficultySection({ difficulty, setDifficulty }) {
  const levels = [
    ["beginner", "Beginner", "Definitions and simple examples"],
    ["intermediate", "Intermediate", "Connections and explanations"],
    ["advanced", "Advanced", "Scenarios and application"]
  ];

  return React.createElement("section", { className: "section-panel" },
    React.createElement("div", { className: "section-heading" },
      React.createElement("h2", null, "Difficulty"),
      React.createElement("span", null, "Controls quiz style")
    ),
    React.createElement("div", { className: "difficulty-grid" },
      levels.map(([value, label, description]) =>
        React.createElement("button", {
          className: `difficulty-option ${difficulty === value ? "active" : ""}`,
          key: value,
          onClick: () => setDifficulty(value),
          type: "button"
        },
          React.createElement("strong", null, label),
          React.createElement("span", null, description)
        )
      )
    )
  );
}

function StudyInput({ notes, setNotes, topic, setTopic, goal, setGoal, onSample }) {
  return React.createElement("section", { className: "section-panel study-input" },
    React.createElement("div", { className: "section-heading" },
      React.createElement("h2", null, "Study Notes"),
      React.createElement("button", { className: "ghost-button", onClick: onSample, type: "button" }, "Load Sample")
    ),
    React.createElement("textarea", {
      value: notes,
      onChange: (event) => setNotes(event.target.value),
      placeholder: "Paste developer notes, documentation, class notes, or study material here..."
    }),
    React.createElement("div", { className: "form-grid" },
      React.createElement("label", null, "Topic",
        React.createElement("input", {
          value: topic,
          onChange: (event) => setTopic(event.target.value)
        })
      ),
      React.createElement("label", null, "Goal",
        React.createElement("select", {
          value: goal,
          onChange: (event) => setGoal(event.target.value)
        },
          React.createElement("option", { value: "exam" }, "Prepare for an exam"),
          React.createElement("option", { value: "review" }, "Review key concepts"),
          React.createElement("option", { value: "presentation" }, "Prepare to explain it")
        )
      )
    )
  );
}

function LearningPath({ user, difficulty }) {
  return React.createElement("section", { className: "section-panel path-panel" },
    React.createElement("div", { className: "section-heading" },
      React.createElement("h2", null, "Learning Path"),
      React.createElement("span", null, "Extra fit")
    ),
    React.createElement("ol", { className: "path-list" },
      React.createElement("li", null, `Connect the notes to the role goal: ${user.roleGoal || "developer"}.`),
      React.createElement("li", null, `Focus examples around: ${user.focus || "current technical skills"}.`),
      React.createElement("li", null, `Practice at the ${difficulty} level before moving up.`)
    )
  );
}

function Results({ kit }) {
  const [flipped, setFlipped] = useState({});

  return React.createElement("section", { className: "results-grid" },
    React.createElement("article", { className: "result-card wide" },
      React.createElement("div", { className: "section-heading" },
        React.createElement("h2", null, "Summary"),
        React.createElement("span", null, `${kit.readTimeMinutes} min read`)
      ),
      React.createElement("p", null, kit.summary || "Paste more notes to generate a stronger summary.")
    ),
    React.createElement("article", { className: "result-card" },
      React.createElement("div", { className: "section-heading" },
        React.createElement("h2", null, "Key Terms"),
        React.createElement("span", null, "Hover")
      ),
      React.createElement("div", { className: "keyword-list" },
        kit.keywords.map((keyword) =>
          React.createElement("span", { className: "keyword-chip", key: keyword.term },
            React.createElement("strong", null, keyword.term),
            React.createElement("em", null, `Appears ${keyword.count} time${keyword.count === 1 ? "" : "s"}`)
          )
        )
      )
    ),
    React.createElement("article", { className: "result-card" },
      React.createElement("div", { className: "section-heading" },
        React.createElement("h2", null, "Flashcards"),
        React.createElement("span", null, "Click to flip")
      ),
      React.createElement("div", { className: "stack" },
        kit.flashcards.map((card, index) =>
          React.createElement("button", {
            className: `flashcard ${flipped[index] ? "flipped" : ""}`,
            key: card.front,
            onClick: () => setFlipped({ ...flipped, [index]: !flipped[index] }),
            type: "button"
          }, flipped[index] ? card.back : card.front)
        )
      )
    ),
    React.createElement("article", { className: "result-card" },
      React.createElement("div", { className: "section-heading" },
        React.createElement("h2", null, "Practice Quiz"),
        React.createElement("span", null, "Reveal answers")
      ),
      React.createElement("div", { className: "stack" },
        kit.quiz.map((item) =>
          React.createElement("details", { className: "quiz-item", key: item.question },
            React.createElement("summary", null, item.question),
            React.createElement("p", null, item.answer)
          )
        )
      )
    ),
    React.createElement("article", { className: "result-card" },
      React.createElement("div", { className: "section-heading" },
        React.createElement("h2", null, "Study Plan"),
        React.createElement("span", null, "30 minutes")
      ),
      React.createElement("ol", { className: "path-list" },
        kit.plan.map((step) => React.createElement("li", { key: step }, step))
      )
    )
  );
}

function App() {
  const [user, setUser] = useState({
    name: "Victor Gutierrez",
    email: "student@example.com",
    roleGoal: "Developer",
    focus: "React, AI tools, and technical studying"
  });
  const [difficulty, setDifficulty] = useState("intermediate");
  const [notes, setNotes] = useState(sampleNotes);
  const [topic, setTopic] = useState("React Developer Fundamentals");
  const [goal, setGoal] = useState("exam");

  const kit = useMemo(() => generateStudyKit(notes, { topic, goal, difficulty }), [notes, topic, goal, difficulty]);

  return React.createElement("main", { className: "app-shell" },
    React.createElement("header", { className: "topbar" },
      React.createElement("div", null,
        React.createElement("p", { className: "eyebrow" }, "Applied AI Portfolio Project"),
        React.createElement("h1", null, "DevStudy AI"),
        React.createElement("p", { className: "intro" },
          "A React study assistant for developers that turns notes into summaries, flashcards, quizzes, and focused study plans."
        )
      ),
      React.createElement("div", { className: "status-card" },
        React.createElement("span", null, "Signed in as"),
        React.createElement("strong", null, user.name || "Guest Developer")
      )
    ),
    React.createElement("div", { className: "layout-grid" },
      React.createElement("div", { className: "left-column" },
        React.createElement(LoginSection, { user, setUser }),
        React.createElement(AboutUserSection, { user, setUser }),
        React.createElement(DifficultySection, { difficulty, setDifficulty }),
        React.createElement(LearningPath, { user, difficulty })
      ),
      React.createElement("div", { className: "right-column" },
        React.createElement(StudyInput, {
          notes,
          setNotes,
          topic,
          setTopic,
          goal,
          setGoal,
          onSample: () => {
            setNotes(sampleNotes);
            setTopic("React Developer Fundamentals");
            setGoal("exam");
          }
        }),
        React.createElement(Results, { kit })
      )
    )
  );
}

createRoot(document.getElementById("root")).render(React.createElement(App));
