import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

type Language = "es" | "en";
type Theme = "dark" | "light";

const content = {
  es: {
    brand: "NEXAOPS AI",
    product: "AI OPERATIONS INTELLIGENCE",

    heroTitle: "Inteligencia operativa",
    heroAccent: "para decisiones reales.",

    subtitle:
      "Un agente de IA que conecta datos operativos, conocimiento empresarial y herramientas para responder preguntas de negocio.",

    ask: "CONSULTA AL AGENTE",

    placeholder:
      "Pregunta algo sobre ventas, inventario, clientes o políticas...",

    analyze: "Analizar",
    analyzing: "Analizando...",

    examples: "Escenarios",

    response: "RESPUESTA DEL AGENTE",

    howWorks: "CÓMO FUNCIONA",
    howWorksTitle: "De una pregunta a una decisión.",
    howWorksDescription:
      "NexaOps analiza la intención, selecciona herramientas, recupera información y construye una respuesta basada en datos.",

    steps: [
      {
        number: "01",
        title: "Understand",
        description:
          "Gemini interpreta la intención y determina qué información necesita.",
        icon: "✦",
      },
      {
        number: "02",
        title: "Orchestrate",
        description:
          "LangGraph coordina las herramientas necesarias para resolver la consulta.",
        icon: "⌘",
      },
      {
        number: "03",
        title: "Retrieve",
        description:
          "El agente consulta PostgreSQL y recupera conocimiento mediante RAG.",
        icon: "⌕",
      },
      {
        number: "04",
        title: "Reason",
        description:
          "Gemini combina los resultados y genera una respuesta contextualizada.",
        icon: "✧",
      },
    ],

    architecture: "ARQUITECTURA",
    architectureDescription:
      "Cada componente cumple una responsabilidad específica dentro del flujo de decisión.",

    docs: "API Docs",
    online: "SYSTEM ONLINE",

    scenariosTitle: "ESCENARIOS SUGERIDOS",
    statusTitle: "SYSTEM STATUS",
    statusDescription: "Todos los sistemas operativos",

    footer: "NexaOps AI · Agentic AI + RAG",

    error:
      "No fue posible conectar con el backend. Verifica que la API esté disponible.",
  },

  en: {
    brand: "NEXAOPS AI",
    product: "AI OPERATIONS INTELLIGENCE",

    heroTitle: "Operational intelligence",
    heroAccent: "for real decisions.",

    subtitle:
      "An AI agent that connects operational data, business knowledge and tools to answer real business questions.",

    ask: "ASK THE AGENT",

    placeholder:
      "Ask something about sales, inventory, customers or policies...",

    analyze: "Analyze",
    analyzing: "Analyzing...",

    examples: "Scenarios",

    response: "AGENT RESPONSE",

    howWorks: "HOW IT WORKS",
    howWorksTitle: "From a question to a decision.",
    howWorksDescription:
      "NexaOps analyzes the request, selects the required tools, retrieves information and builds a data-backed response.",

    steps: [
      {
        number: "01",
        title: "Understand",
        description:
          "Gemini interprets the intent and determines what information is required.",
        icon: "✦",
      },
      {
        number: "02",
        title: "Orchestrate",
        description:
          "LangGraph coordinates the tools required to solve the request.",
        icon: "⌘",
      },
      {
        number: "03",
        title: "Retrieve",
        description:
          "The agent queries PostgreSQL and retrieves knowledge through RAG.",
        icon: "⌕",
      },
      {
        number: "04",
        title: "Reason",
        description:
          "Gemini combines the results and generates a contextual response.",
        icon: "✧",
      },
    ],

    architecture: "ARCHITECTURE",
    architectureDescription:
      "Each component has a specific responsibility within the decision workflow.",

    docs: "API Docs",
    online: "SYSTEM ONLINE",

    scenariosTitle: "SUGGESTED SCENARIOS",
    statusTitle: "SYSTEM STATUS",
    statusDescription: "All operational systems",

    footer: "NexaOps AI · Agentic AI + RAG",

    error:
      "Unable to connect to the backend. Verify that the API is available.",
  },
};

const examples = {
  es: [
    {
      label: "Sales Intelligence",
      description: "Ventas y ticket promedio",
      question:
        "¿Cuánto vendimos este mes y cuál es nuestro ticket promedio?",
    },
    {
      label: "Inventory Risk",
      description: "Riesgos relacionados con inventario",
      question:
        "Analiza las ventas de este mes y dime si tenemos algún problema de inventario que pueda estar relacionado.",
    },
    {
      label: "Policy + Sales",
      description: "Ventas y políticas empresariales",
      question:
        "¿Cuánto vendimos este mes y cuál es la política para devoluciones superiores a $10,000 MXN?",
    },
  ],

  en: [
    {
      label: "Sales Intelligence",
      description: "Sales and average order value",
      question:
        "How much did we sell this month and what is our average order value?",
    },
    {
      label: "Inventory Risk",
      description: "Inventory-related risks",
      question:
        "Analyze this month's sales and tell me if we have any related inventory risks.",
    },
    {
      label: "Policy + Sales",
      description: "Sales and company policies",
      question:
        "How much did we sell this month and what is the policy for refunds above $10,000 MXN?",
    },
  ],
};

const architecture = [
  {
    name: "Gemini",
    type: "LLM",
    description: "Reasoning",
  },
  {
    name: "LangGraph",
    type: "AGENT",
    description: "Orchestration",
  },
  {
    name: "PostgreSQL",
    type: "DATA",
    description: "Operational data",
  },
  {
    name: "ChromaDB",
    type: "RAG",
    description: "Knowledge retrieval",
  },
  {
    name: "FastAPI",
    type: "API",
    description: "Backend service",
  },
];

interface AgentResponse {
  answer: unknown;
}

function App() {
  const [language, setLanguage] = useState<Language>("es");

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("nexaops-theme");

    return saved === "light" ? "light" : "dark";
  });

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const t = content[language];
  const currentExamples = examples[language];

  const changeTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);

    document.documentElement.classList.toggle(
      "light",
      nextTheme === "light"
    );

    localStorage.setItem("nexaops-theme", nextTheme);
  };

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
          .map((item) => {
            if (
              typeof item === "object" &&
              item !== null &&
              "text" in item
            ) {
              return String(item.text ?? "");
            }

            return "";
          })
          .filter(Boolean)
          .join("\n\n");

        setAnswer(text);
      } else if (typeof rawAnswer === "string") {
        setAnswer(rawAnswer);
      } else {
        setAnswer(JSON.stringify(rawAnswer, null, 2));
      }
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="header">
        <div className="brand">
          <div className="brand-mark">N</div>

          <div>
            <strong>{t.brand}</strong>
            <span>{t.product}</span>
          </div>
        </div>

        <nav className="nav">
          <a
            className="docs-link"
            href={`${API_URL}/docs`}
            target="_blank"
            rel="noreferrer"
          >
            {t.docs}
            <span>↗</span>
          </a>

          <div className="language-switch">
            <button
              className={language === "es" ? "active" : ""}
              onClick={() => setLanguage("es")}
            >
              ES
            </button>

            <button
              className={language === "en" ? "active" : ""}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
          </div>

          <button
            className="theme-button"
            onClick={changeTheme}
            aria-label="Change theme"
          >
            {theme === "dark" ? "☼" : "☾"}
          </button>

          <div className="status">
            <span className="status-dot" />
            {t.online}
          </div>
        </nav>
      </header>

      {/* =====================================================
          THREE COLUMN WORKSPACE
      ====================================================== */}

      <div className="workspace">

        {/* ===================================================
            LEFT
        ==================================================== */}

        <aside className="sidebar">
          <div className="sidebar-eyebrow">
            {t.product}
          </div>

          <h1 className="sidebar-title">
            {t.heroTitle}
            <br />
            <span>{t.heroAccent}</span>
          </h1>

          <p className="sidebar-description">
            {t.subtitle}
          </p>

          <div className="sidebar-divider" />

          <div className="scenarios-title">
            {t.scenariosTitle}
          </div>

          <div className="scenarios">
            {currentExamples.map((example) => (
              <button
                className="scenario"
                key={example.label}
                onClick={() => setQuestion(example.question)}
              >
                <span className="scenario-label">
                  {example.label}
                </span>

                <span className="scenario-description">
                  {example.description}
                </span>
              </button>
            ))}
          </div>

          <div className="system-status">
            <div className="system-status-header">
              <div className="system-status-label">
                <span className="status-dot" />
                {t.statusTitle}
              </div>

              <span className="online-badge">
                ONLINE
              </span>
            </div>

            <p>{t.statusDescription}</p>
          </div>
        </aside>

        {/* ===================================================
            CENTER
        ==================================================== */}

        <section className="main-panel">
          <div className="chat-header">
            <div className="chat-label">
              {t.ask}
            </div>

            <div className="chat-shortcut">
              CTRL + ENTER
            </div>
          </div>

          <div className="query-box">
            <textarea
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  (event.ctrlKey || event.metaKey)
                ) {
                  event.preventDefault();
                  analyze();
                }
              }}
              placeholder={t.placeholder}
            />

            <button
              className="analyze-button"
              onClick={analyze}
              disabled={
                loading || !question.trim()
              }
            >
              {loading ? t.analyzing : t.analyze}

              {!loading && <span>↗</span>}
            </button>
          </div>

          <div className="examples">
            <span>{t.examples}</span>

            {currentExamples.map((example) => (
              <button
                key={example.label}
                onClick={() =>
                  setQuestion(example.question)
                }
              >
                {example.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {(answer || loading) && (
            <section className="response-section">
              <div className="response-heading">
                <div className="section-label">
                  {t.response}
                </div>

                {!loading && (
                  <div className="response-status">
                    <span className="status-dot" />
                    RESPONSE GENERATED
                  </div>
                )}
              </div>

              <div className="response-card">
                {loading ? (
                  <div className="loading">
                    <div className="loading-bar" />

                    <p>
                      {language === "es"
                        ? "El agente está analizando la consulta, seleccionando herramientas y recuperando información..."
                        : "The agent is analyzing the request, selecting tools and retrieving information..."}
                    </p>
                  </div>
                ) : (
                  <article className="answer">
                    <ReactMarkdown>
                      {answer}
                    </ReactMarkdown>
                  </article>
                )}
              </div>
            </section>
          )}
        </section>

        {/* ===================================================
            RIGHT
        ==================================================== */}

        <aside className="right-panel">
          <div className="section-label">
            {t.howWorks}
          </div>

          <h2 className="right-title">
            {t.howWorksTitle}
          </h2>

          <p className="right-description">
            {t.howWorksDescription}
          </p>

          <div className="workflow">
            {t.steps.map((step) => (
              <div
                className="workflow-step"
                key={step.number}
              >
                <div className="step-icon">
                  {step.icon}
                </div>

                <div className="step-content">
                  <span className="step-number">
                    {step.number}
                  </span>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="architecture-panel">
            <div className="section-label">
              {t.architecture}
            </div>

            <p className="architecture-description">
              {t.architectureDescription}
            </p>

            <div className="architecture-grid">
              {architecture.map((item, index) => (
                <div
                  className="system-card"
                  key={item.name}
                >
                  <div className="system-index">
                    0{index + 1}
                  </div>

                  <span>{item.type}</span>

                  <strong>{item.name}</strong>

                  <small>
                    {item.description}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <footer>
        <span>{t.footer}</span>

        <a
          href={`${API_URL}/docs`}
          target="_blank"
          rel="noreferrer"
        >
          Swagger / OpenAPI ↗
        </a>
      </footer>
    </main>
  );
}

export default App;