import { useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

const examples = [
  {
    label: "Sales Intelligence",
    question: "¿Cuánto vendimos este mes y cuál es nuestro ticket promedio?",
  },
  {
    label: "Inventory Risk",
    question:
      "Analiza las ventas de este mes y dime si tenemos algún problema de inventario que pueda estar relacionado.",
  },
  {
    label: "Policy + Sales",
    question:
      "¿Cuánto vendimos este mes y cuál es la política para devoluciones superiores a $10,000 MXN?",
  },
];

interface AgentResponse {
  answer: unknown;
}

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch(`${API_URL}/api/agent/v2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data: AgentResponse = await response.json();

      const rawAnswer = data.answer;

      if (Array.isArray(rawAnswer)) {
        const text = rawAnswer
          .map((item) => item?.text ?? "")
          .filter(Boolean)
          .join("\n\n");

        setAnswer(text);
      } else if (typeof rawAnswer === "string") {
        setAnswer(rawAnswer);
      } else {
        setAnswer(JSON.stringify(rawAnswer, null, 2));
      }
    } catch {
      setError(
        "Unable to connect to the AI Operations backend. Make sure the API is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      <header className="header">
        <div>
          <div className="eyebrow">AI OPERATIONS PLATFORM</div>

          <h1>
            Business intelligence
            <span> powered by AI.</span>
          </h1>

          <p className="subtitle">
            Ask questions about sales, customers, inventory and company
            policies. The agent retrieves information from your operational
            systems and knowledge base.
          </p>
        </div>

        <div className="status">
          <span className="status-dot" />
          SYSTEM ONLINE
        </div>
      </header>

      <section className="query-section">
        <div className="section-label">ASK YOUR OPERATIONS AGENT</div>

        <div className="query-box">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask something about your business..."
          />

          <button onClick={analyze} disabled={loading || !question.trim()}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        <div className="examples">
          <span>Try an example:</span>

          {examples.map((example) => (
            <button
              key={example.label}
              onClick={() => setQuestion(example.question)}
            >
              {example.label}
            </button>
          ))}
        </div>
      </section>

      {error && <div className="error">{error}</div>}

      {(answer || loading) && (
        <section className="response-section">
          <div className="section-label">AGENT RESPONSE</div>

          <div className="response-card">
            {loading ? (
              <div className="loading">
                <span />
                <span />
                <span />
                <p>Agent is analyzing your request...</p>
              </div>
            ) : (
              <div className="answer">{answer}</div>
            )}
          </div>
        </section>
      )}

      <section className="architecture">
        <div className="section-label">SYSTEM ARCHITECTURE</div>

        <div className="architecture-grid">
          <div className="system-card">
            <strong>LLM</strong>
            <span>Gemini</span>
          </div>

          <div className="system-card">
            <strong>AGENT</strong>
            <span>LangGraph</span>
          </div>

          <div className="system-card">
            <strong>RAG</strong>
            <span>ChromaDB</span>
          </div>

          <div className="system-card">
            <strong>DATABASE</strong>
            <span>PostgreSQL</span>
          </div>

          <div className="system-card">
            <strong>API</strong>
            <span>FastAPI</span>
          </div>
        </div>
      </section>

      <footer>
        AI Operations Platform · Agentic AI + RAG
      </footer>
    </main>
  );
}

export default App;