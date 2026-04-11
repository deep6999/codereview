import { useState, useEffect, useCallback, useRef } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

const DEFAULT_CODE = `function sum() {
  return 1 + 1
}`;
const REVIEW_HISTORY_STORAGE_KEY = "code-review-history";
const REVIEW_HISTORY_LIMIT = 10;

function getErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    "Failed to get review"
  );
}

function createHistoryId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadReviewHistory() {
  try {
    const raw = localStorage.getItem(REVIEW_HISTORY_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.text === "string" &&
          typeof item.createdAt === "string"
      )
      .slice(0, REVIEW_HISTORY_LIMIT);
  } catch {
    return [];
  }
}

function formatTimestamp(isoTimestamp) {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return isoTimestamp;
  return date.toLocaleString();
}

function App() {
  const reviewSessionRef = useRef(0);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => loadReviewHistory());
  const [showHistory, setShowHistory] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("code-review-theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("code-review-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(REVIEW_HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const startNewChat = useCallback(() => {
    reviewSessionRef.current += 1;
    setCode(DEFAULT_CODE);
    setReview("");
    setError(null);
    setLoading(false);
  }, []);

  const reviewCode = useCallback(async () => {
    const session = reviewSessionRef.current;
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });
      const payload = response?.data;
      const reviewText = payload?.data;

      if (!payload?.success || typeof reviewText !== "string") {
        throw new Error(payload?.message || "Invalid response from review service.");
      }

      if (reviewSessionRef.current === session) {
        setReview(reviewText);
        setHistory((prevHistory) => {
          const nextHistory = [
            {
              id: createHistoryId(),
              text: reviewText,
              createdAt: new Date().toISOString(),
            },
            ...prevHistory,
          ].slice(0, REVIEW_HISTORY_LIMIT);

          return nextHistory;
        });
      }
    } catch (err) {
      if (reviewSessionRef.current === session) {
        setReview("");
        setError(getErrorMessage(err));
      }
    } finally {
      if (reviewSessionRef.current === session) setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    function onKeyDown(e) {
      if (!(e.key === "Enter" && (e.ctrlKey || e.metaKey))) return;
      e.preventDefault();
      if (loading) return;
      reviewCode();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loading, reviewCode]);

  return (
    <div className={`app theme-${theme}`}>
      <header className="app-header">
        <div className="app-header-left">
          <button
            type="button"
            className="app-logo"
            onClick={startNewChat}
            title="New chat"
            aria-label="Start a new review"
          >
            <span className="app-logo-mark">&lt;/&gt;</span>
          </button>
        </div>
        <div className="app-header-center">
          <h1 className="app-title">Code Review</h1>
          <p className="app-subtitle">Paste code and get AI feedback</p>
        </div>
        <div className="app-header-right">
          <button
            type="button"
            className={`theme-toggle theme-toggle--${theme}`}
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <span className="theme-toggle-thumb" aria-hidden />
            <span className="theme-toggle-icon" aria-hidden>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>
            <span
              className="theme-toggle-icon theme-toggle-icon-sun"
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            </span>
          </button>
        </div>
      </header>
      <main className="app-main">
        <section className="panel left-panel">
          <div className="editor-toolbar">
            <span className="editor-toolbar-label">Write a code</span>
            <button
              type="button"
              className="review-btn"
              onClick={reviewCode}
              disabled={loading}
              aria-busy={loading}
              title={
                error
                  ? "Retry · Ctrl+Enter or ⌘+Enter"
                  : "Review code · Ctrl+Enter or ⌘+Enter"
              }
            >
              {loading ? (
                <span className="review-btn-content">
                  <span className="review-btn-spinner" aria-hidden />
                  Analyze
                </span>
              ) : error ? (
                "Retry again"
              ) : (
                "Review code"
              )}
            </button>
          </div>
          <div className="code-wrap">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
       	
       }
              padding={20}
              style={{
                fontFamily:
                  '"JetBrains Mono", "Fira Code", "Fira Mono", monospace',
                fontSize: 22,
                minHeight: "100%",
                width: "100%",
              }}
            />
          </div>
        </section>
        <section className="panel right-panel" aria-busy={loading}>
          <div className="panel-header">
            <div className="panel-label">Review</div>
            <div className="panel-actions">
              {showHistory && history.length > 0 && (
                <button
                  type="button"
                  className="clear-history-btn"
                  onClick={() => setHistory([])}
                >
                  Clear History
                </button>
              )}
              <button
                type="button"
                className="history-btn"
                onClick={() => setShowHistory((prev) => !prev)}
              >
                {showHistory ? "Close History" : "Show History"}
              </button>
            </div>
          </div>
          <div className="review-content">
            {showHistory ? (
              history.length === 0 ? (
                <div className="history-empty">No history yet</div>
              ) : (
                <div className="history-list">
                  {history.map((item) => (
                    <article className="history-item" key={item.id}>
                      <div className="history-item-time">
                        {formatTimestamp(item.createdAt)}
                      </div>
                      <p className="history-item-text">{item.text}</p>
                    </article>
                  ))}
                </div>
              )
            ) : loading ? (
              <div className="loading-skeleton" aria-hidden>
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line skeleton-short" />
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line skeleton-short" />
                <div className="skeleton-line" />
              </div>
            ) : null}
            {!showHistory && !loading && error && (
              <div className="review-error" role="alert">
                {error}
              </div>
            )}
            {!showHistory && !loading && !error && review && (
              <div className="review-markdown">
                <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
              </div>
            )}
            {!showHistory && !loading && !error && !review && (
              <div className="review-placeholder">
                Use “Review code” or Ctrl+Enter (⌘+Enter on Mac). After an
                error, the same button becomes “Retry”.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
