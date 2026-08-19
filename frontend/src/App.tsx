import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

type Language = "es" | "en";
type Theme = "dark" | "light";

interface AgentResponse {
  answer: unknown;
}

interface DocumentItem {
  name: string;
  content: string;
}

interface Metric {
  label: string;
  value: string;
  type: "money" | "number";
}

const content = {
  es: {
    brand: "NEXAOPS AI",
    product: "INTELIGENCIA OPERATIVA CON IA",

    heroTitle: "Inteligencia operativa",
    heroAccent: "para decisiones reales.",

    subtitle:
      "Un agente de IA que conecta datos operativos, conocimiento empresarial y herramientas para responder preguntas de negocio.",

    ask: "CONSULTA AL AGENTE",
    placeholder:
      "Pregunta sobre ventas, inventario, clientes o políticas...",

    analyze: "Analizar",
    analyzing: "Analizando...",

    examples: "Escenarios",

    response: "RESPUESTA DEL AGENTE",
    generated: "RESPUESTA GENERADA",

    howWorks: "CÓMO FUNCIONA",
    howWorksTitle: "De una pregunta a una decisión.",
    howWorksDescription:
      "El agente interpreta la consulta, determina qué información necesita, consulta las fuentes correspondientes y construye una respuesta.",

    steps: [
      {
        number: "01",
        title: "Entender",
        description:
          "Gemini interpreta la intención y determina qué información necesita.",
        icon: "✦",
      },
      {
        number: "02",
        title: "Coordinar",
        description:
          "LangGraph decide qué herramientas deben intervenir en la consulta.",
        icon: "⌘",
      },
      {
        number: "03",
        title: "Consultar",
        description:
          "El sistema consulta PostgreSQL y recupera conocimiento mediante RAG.",
        icon: "⌕",
      },
      {
        number: "04",
        title: "Analizar",
        description:
          "Gemini combina los resultados y genera una respuesta contextualizada.",
        icon: "✧",
      },
    ],

    architecture: "ARQUITECTURA",
    architectureDescription:
      "Cada componente tiene una responsabilidad específica dentro del flujo de decisión.",

    docs: "Documentación de API",
    documents: "DOCUMENTOS DE REFERENCIA",
    documentsTitle: "Conocimiento empresarial",
    documentsDescription:
      "Estos documentos forman parte de la base de conocimiento utilizada por el agente.",

    viewDocument: "Ver documento",
    closeDocument: "Cerrar documento",
    indexed: "INDEXADO",

    statusTitle: "ESTADO DEL SISTEMA",
    statusDescription: "Todos los servicios operativos",
    online: "SISTEMA ACTIVO",

    insights: "INDICADORES DETECTADOS",
    salesChart: "Resumen de ventas",

    footer: "NexaOps AI · Agentes + RAG",

    error:
      "No fue posible conectar con el backend. Verifica que la API esté disponible.",

    loadingDocuments: "Cargando documentos...",
    noDocuments: "No hay documentos disponibles.",
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
      "Ask about sales, inventory, customers or company policies...",

    analyze: "Analyze",
    analyzing: "Analyzing...",

    examples: "Scenarios",

    response: "AGENT RESPONSE",
    generated: "RESPONSE GENERATED",

    howWorks: "HOW IT WORKS",
    howWorksTitle: "From a question to a decision.",
    howWorksDescription:
      "The agent interprets the request, determines what information is needed, queries the appropriate sources and builds a contextual response.",

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
          "LangGraph decides which tools need to participate in the request.",
        icon: "⌘",
      },
      {
        number: "03",
        title: "Retrieve",
        description:
          "The system queries PostgreSQL and retrieves knowledge through RAG.",
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

    docs: "API Documentation",
    documents: "REFERENCE DOCUMENTS",
    documentsTitle: "Business knowledge",
    documentsDescription:
      "These documents are part of the knowledge base used by the agent.",

    viewDocument: "View document",
    closeDocument: "Close document",
    indexed: "INDEXED",

    statusTitle: "SYSTEM STATUS",
    statusDescription: "All services operational",
    online: "SYSTEM ONLINE",

    insights: "DETECTED METRICS",
    salesChart: "Sales summary",

    footer: "NexaOps AI · Agents + RAG",

    error:
      "Unable to connect to the backend. Verify that the API is available.",

    loadingDocuments: "Loading documents...",
    noDocuments: "No documents available.",
  },
};

const examples = {
  es: [
    {
      label: "Inteligencia de ventas",
      description: "Ventas y valor promedio",
      question:
        "¿Cuánto vendimos este mes y cuál es nuestro ticket promedio?",
    },
    {
      label: "Riesgo de inventario",
      description: "Ventas relacionadas con existencias",
      question:
        "Analiza las ventas de este mes y dime si tenemos algún problema de inventario que pueda estar relacionado.",
    },
    {
      label: "Política + ventas",
      description: "Ventas y políticas empresariales",
      question:
        "¿Cuánto vendimos este mes y cuál es la política para devoluciones superiores a $10,000 MXN?",
    },
  ],

  en: [
    {
      label: "Sales intelligence",
      description: "Sales and average order value",
      question:
        "How much did we sell this month and what is our average order value?",
    },
    {
      label: "Inventory risk",
      description: "Sales related to inventory",
      question:
        "Analyze this month's sales and tell me if we have any related inventory risks.",
    },
    {
      label: "Policy + sales",
      description: "Sales and company policies",
      question:
        "How much did we sell this month and what is the policy for refunds above $10,000 MXN?",
    },
  ],
};

const architecture = [
  {
    name: "Gemini",
    typeEs: "MODELO",
    typeEn: "MODEL",
    descriptionEs: "Razonamiento",
    descriptionEn: "Reasoning",
  },
  {
    name: "LangGraph",
    typeEs: "AGENTE",
    typeEn: "AGENT",
    descriptionEs: "Coordinación",
    descriptionEn: "Orchestration",
  },
  {
    name: "PostgreSQL",
    typeEs: "DATOS",
    typeEn: "DATA",
    descriptionEs: "Datos operativos",
    descriptionEn: "Operational data",
  },
  {
    name: "ChromaDB",
    typeEs: "RAG",
    typeEn: "RAG",
    descriptionEs: "Conocimiento",
    descriptionEn: "Knowledge",
  },
  {
    name: "FastAPI",
    typeEs: "API",
    typeEn: "API",
    descriptionEs: "Servicio backend",
    descriptionEn: "Backend service",
  },
];

function extractMetrics(text: string): Metric[] {
  const metrics: Metric[] = [];

  const revenueMatch = text.match(
    /(?:ingresos|ventas)[^$]{0,80}\$?([\d,]+(?:\.\d+)?)\s*MXN/i
  );

  const ordersMatch = text.match(
    /(\d+)\s+(?:pedidos|órdenes|ordenes)/i
  );

  const averageMatch = text.match(
    /(?:valor promedio|promedio por pedido|ticket promedio)[^$]{0,50}\$?([\d,]+(?:\.\d+)?)\s*MXN/i
  );

  if (revenueMatch) {
    metrics.push({
      label: "Ventas totales",
      value: `$${revenueMatch[1]} MXN`,
      type: "money",
    });
  }

  if (ordersMatch) {
    metrics.push({
      label: "Pedidos",
      value: ordersMatch[1],
      type: "number",
    });
  }

  if (averageMatch) {
    metrics.push({
      label: "Valor promedio",
      value: `$${averageMatch[1]} MXN`,
      type: "money",
    });
  }

  return metrics;
}

function SalesVisual({
  answer,
  language,
}: {
  answer: string;
  language: Language;
}) {
  const metrics = useMemo(
    () => extractMetrics(answer),
    [answer]
  );

  if (metrics.length === 0) {
    return null;
  }

  const numericValues = metrics.map((metric) => {
    const value = Number(
      metric.value
        .replace("$", "")
        .replace("MXN", "")
        .replace(/,/g, "")
        .trim()
    );

    return value;
  });

  const maxValue = Math.max(...numericValues, 1);

  return (
    <div className="insights">
      <div className="insights-header">
        <span className="section-label">
          {content[language].insights}
        </span>

        <span className="insights-source">
          DATOS DE LA CONSULTA
        </span>
      </div>

      <div className="metric-grid">
        {metrics.map((metric) => (
          <div className="metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </div>

      {metrics.length >= 2 && (
        <div className="chart-card">
          <div className="chart-title">
            {content[language].salesChart}
          </div>

          <div className="chart">
            {metrics.map((metric, index) => {
              const numericValue = numericValues[index];

              const height = Math.max(
                12,
                (numericValue / maxValue) * 100
              );

              return (
                <div
                  className="chart-column"
                  key={metric.label}
                >
                  <div className="chart-value">
                    {metric.value}
                  </div>

                  <div className="chart-track">
                    <div
                      className="chart-bar"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>

                  <span>{metric.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [language, setLanguage] =
    useState<Language>("es");

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(
      "nexaops-theme"
    );

    return saved === "light" ? "light" : "dark";
  });

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [documents, setDocuments] = useState<
    DocumentItem[]
  >([]);

  const [selectedDocument, setSelectedDocument] =
    useState<DocumentItem | null>(null);

  const t = content[language];
  const currentExamples = examples[language];

  useEffect(() => {
    document.documentElement.classList.toggle(
      "light",
      theme === "light"
    );

    localStorage.setItem(
      "nexaops-theme",
      theme
    );
  }, [theme]);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/documents`
        );

        if (!response.ok) return;

        const data = await response.json();

        setDocuments(data.documents ?? []);
      } catch {
        setDocuments([]);
      }
    };

    loadDocuments();
  }, []);

  const changeTheme = () => {
    setTheme((current) =>
      current === "dark" ? "light" : "dark"
    );
  };

  const analyze = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch(
        `${API_URL}/api/agent/v2`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Backend request failed"
        );
      }

      const data: AgentResponse =
        await response.json();

      const rawAnswer = data.answer;

      if (Array.isArray(rawAnswer)) {
        const text = rawAnswer
          .map((item) => {
            if (
              typeof item === "object" &&
              item !== null &&
              "text" in item
            ) {
              return String(
                item.text ?? ""
              );
            }

            return "";
          })
          .filter(Boolean)
          .join("\n\n");

        setAnswer(text);
      } else if (
        typeof rawAnswer === "string"
      ) {
        setAnswer(rawAnswer);
      } else {
        setAnswer(
          JSON.stringify(
            rawAnswer,
            null,
            2
          )
        );
      }
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-mark">
            N
          </div>

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
              className={
                language === "es"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setLanguage("es")
              }
            >
              ES
            </button>

            <button
              className={
                language === "en"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setLanguage("en")
              }
            >
              EN
            </button>
          </div>

          <button
            className="theme-button"
            onClick={changeTheme}
          >
            {theme === "dark" ? "☼" : "☾"}
          </button>

          <div className="status">
            <span className="status-dot" />
            {t.online}
          </div>
        </nav>
      </header>

      <div className="workspace">

        {/* IZQUIERDA */}

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
            {t.examples}
          </div>

          <div className="scenarios">
            {currentExamples.map(
              (example) => (
                <button
                  className="scenario"
                  key={example.label}
                  onClick={() =>
                    setQuestion(
                      example.question
                    )
                  }
                >
                  <span className="scenario-label">
                    {example.label}
                  </span>

                  <span className="scenario-description">
                    {example.description}
                  </span>
                </button>
              )
            )}
          </div>

          <div className="documents-panel">
            <div className="documents-panel-header">
              <span className="scenarios-title">
                {t.documents}
              </span>

              <span className="document-count">
                {documents.length}
              </span>
            </div>

            <p>
              {t.documentsDescription}
            </p>

            <div className="document-list">
              {documents.length === 0 ? (
                <span className="documents-loading">
                  {t.loadingDocuments}
                </span>
              ) : (
                documents.map((document) => (
                  <button
                    className="document-item"
                    key={document.name}
                    onClick={() =>
                      setSelectedDocument(
                        document
                      )
                    }
                  >
                    <span className="document-icon">
                      MD
                    </span>

                    <span className="document-info">
                      <strong>
                        {document.name}
                      </strong>

                      <small>
                        {t.indexed}
                      </small>
                    </span>

                    <span className="document-arrow">
                      ↗
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="system-status">
            <div className="system-status-header">
              <div className="system-status-label">
                <span className="status-dot" />
                {t.statusTitle}
              </div>

              <span className="online-badge">
                ACTIVO
              </span>
            </div>

            <p>
              {t.statusDescription}
            </p>
          </div>
        </aside>

        {/* CENTRO */}

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
                setQuestion(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  (event.ctrlKey ||
                    event.metaKey)
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
                loading ||
                !question.trim()
              }
            >
              {loading
                ? t.analyzing
                : t.analyze}

              {!loading && (
                <span>↗</span>
              )}
            </button>
          </div>

          <div className="examples">
            <span>
              {t.examples}
            </span>

            {currentExamples.map(
              (example) => (
                <button
                  key={example.label}
                  onClick={() =>
                    setQuestion(
                      example.question
                    )
                  }
                >
                  {example.label}
                </button>
              )
            )}
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
                    {t.generated}
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
                  <>
                    <SalesVisual
                      answer={answer}
                      language={language}
                    />

                    <article className="answer">
                      <ReactMarkdown>
                        {answer}
                      </ReactMarkdown>
                    </article>
                  </>
                )}
              </div>
            </section>
          )}
        </section>

        {/* DERECHA */}

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

                  <p>
                    {step.description}
                  </p>
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
              {architecture.map(
                (item, index) => (
                  <div
                    className="system-card"
                    key={item.name}
                  >
                    <div className="system-index">
                      0{index + 1}
                    </div>

                    <span>
                      {language === "es"
                        ? item.typeEs
                        : item.typeEn}
                    </span>

                    <strong>
                      {item.name}
                    </strong>

                    <small>
                      {language === "es"
                        ? item.descriptionEs
                        : item.descriptionEn}
                    </small>
                  </div>
                )
              )}
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

      {/* VISOR DE DOCUMENTOS */}

      {selectedDocument && (
        <div
          className="document-modal-backdrop"
          onClick={() =>
            setSelectedDocument(null)
          }
        >
          <div
            className="document-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="document-modal-header">
              <div>
                <span className="section-label">
                  {t.documents}
                </span>

                <h2>
                  {selectedDocument.name}
                </h2>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setSelectedDocument(null)
                }
              >
                ×
              </button>
            </div>

            <div className="document-content">
              <pre>
                {selectedDocument.content}
              </pre>
            </div>

            <div className="document-modal-footer">
              <span>
                {t.indexed}
              </span>

              <button
                onClick={() =>
                  setSelectedDocument(null)
                }
              >
                {t.closeDocument}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;