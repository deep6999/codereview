import { useState, useEffect, useCallback, useRef } from "react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";
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
const DEFAULT_THEME = "dark";
const HISTORY_PAGE_SIZE = 20;
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL?.replace(/\/ai\/get-review\/?$/, "") ||
  "http://localhost:3000"
).replace(/\/$/, "");
const REVIEW_ENDPOINT = `${API_BASE_URL}/ai/get-review`;
const HISTORY_ENDPOINT = `${API_BASE_URL}/ai/history`;

function getErrorMessage(err) {
  return err?.response?.data?.message || err?.message || "Failed to get review";
}

function formatTimestamp(isoTimestamp) {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return isoTimestamp;
  return date.toLocaleString();
}

function normalizeHistoryItem(item) {
  if (
    !item ||
    typeof item.id !== "string" ||
    typeof item.review !== "string" ||
    typeof item.createdAt !== "string"
  ) {
    return null;
  }

  return {
    id: item.id,
    code: typeof item.code === "string" ? item.code : "",
    review: item.review,
    createdAt: item.createdAt,
  };
}

function getAuthHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function App() {
  const reviewSessionRef = useRef(0);
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [theme, setTheme] = useState(DEFAULT_THEME);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const startNewChat = useCallback(() => {
    reviewSessionRef.current += 1;
    setCode(DEFAULT_CODE);
    setReview("");
    setError(null);
    setLoading(false);
  }, []);

  const mergeHistoryEntry = useCallback((entry) => {
    const normalizedEntry = normalizeHistoryItem(entry);

    if (!normalizedEntry) return;

    setHistory((prevHistory) =>
      [normalizedEntry, ...prevHistory.filter((item) => item.id !== normalizedEntry.id)].slice(
        0,
        HISTORY_PAGE_SIZE
      )
    );
  }, []);

  const fetchHistory = useCallback(async () => {
    if (!isSignedIn) {
      setHistory([]);
      setHistoryError(null);
      return;
    }

    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("Your session is missing. Please sign in again.");

      const response = await axios.get(HISTORY_ENDPOINT, {
        headers: getAuthHeaders(token),
      });
      const payload = response?.data;

      if (!payload?.success || !Array.isArray(payload.data)) {
        throw new Error(payload?.message || "Invalid response from history service.");
      }

      setHistory(
        payload.data
          .map(normalizeHistoryItem)
          .filter(Boolean)
          .slice(0, HISTORY_PAGE_SIZE)
      );
    } catch (err) {
      setHistory([]);
      setHistoryError(getErrorMessage(err));
    } finally {
      setHistoryLoading(false);
    }
  }, [getToken, isSignedIn]);

  const clearHistory = useCallback(async () => {
    if (!isSignedIn) return;

    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("Your session is missing. Please sign in again.");

      const response = await axios.delete(HISTORY_ENDPOINT, {
        headers: getAuthHeaders(token),
      });
      const payload = response?.data;

      if (!payload?.success) {
        throw new Error(payload?.message || "Failed to clear history.");
      }

      setHistory([]);
    } catch (err) {
      setHistoryError(getErrorMessage(err));
    } finally {
      setHistoryLoading(false);
    }
  }, [getToken, isSignedIn]);

  const reviewCode = useCallback(async () => {
    const session = reviewSessionRef.current;
    setError(null);
    setLoading(true);

    try {
      const token = isSignedIn ? await getToken() : null;
      const response = await axios.post(
        REVIEW_ENDPOINT,
        { code },
        {
          headers: getAuthHeaders(token),
        }
      );
      const payload = response?.data;
      const reviewText = payload?.data;

      if (!payload?.success || typeof reviewText !== "string") {
        throw new Error(payload?.message || "Invalid response from review service.");
      }

      if (reviewSessionRef.current === session) {
        setReview(reviewText);

        if (payload?.historyEntry) {
          mergeHistoryEntry(payload.historyEntry);
        }
      }
    } catch (err) {
      if (reviewSessionRef.current === session) {
        setReview("");
        setError(getErrorMessage(err));
      }
    } finally {
      if (reviewSessionRef.current === session) setLoading(false);
    }
  }, [code, getToken, isSignedIn, mergeHistoryEntry]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setHistory([]);
      setHistoryError(null);
      setHistoryLoading(false);
      return;
    }

    fetchHistory();
  }, [fetchHistory, isLoaded, isSignedIn]);

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
          <div className="header-controls">
            <SignedOut>
              <SignInButton forceRedirectUrl="/">
                <button type="button" className="auth-btn">
                  Log In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="signed-in-controls">
                <span className="sync-badge">History Sync On</span>
                <UserButton />
              </div>
            </SignedIn>
            <button
              type="button"
              className={`theme-toggle theme-toggle--${theme}`}
              onClick={() => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
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
              <span className="theme-toggle-icon theme-toggle-icon-sun" aria-hidden>
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
              highlight={(currentCode) =>
                prism.highlight(currentCode, prism.languages.javascript, "javascript")
              }
              padding={20}
              style={{
                fontFamily: '"JetBrains Mono", "Fira Code", "Fira Mono", monospace',
                fontSize: 22,
                minHeight: "100%",
                width: "100%",
              }}
            />
          </div>
        </section>
        <section className="panel right-panel" aria-busy={loading || historyLoading}>
          <div className="panel-header">
            <div className="panel-heading">
              <div className="panel-label">Review</div>
              <p className={`history-status ${isSignedIn ? "history-status--active" : ""}`}>
                {!isLoaded
                  ? "Loading account..."
                  : isSignedIn
                    ? "Signed in reviews are saved to your account."
                    : "Signed out reviews are not saved."}
              </p>
            </div>
            <div className="panel-actions">
              {showHistory && isSignedIn && history.length > 0 && (
                <button
                  type="button"
                  className="clear-history-btn"
                  onClick={clearHistory}
                  disabled={historyLoading}
                >
                  {historyLoading ? "Clearing..." : "Clear History"}
                </button>
              )}
              <button
                type="button"
                className="history-btn"
                onClick={() => setShowHistory((prev) => !prev)}
                disabled={!isLoaded}
              >
                {showHistory ? "Close History" : "Show History"}
              </button>
            </div>
          </div>
          <div className="review-content">
            {showHistory ? (
              !isLoaded ? (
                <div className="history-empty">Loading account...</div>
              ) : !isSignedIn ? (
                <div className="history-empty">
                  Sign in from the top-right button to save and sync your review history.
                </div>
              ) : historyLoading ? (
                <div className="history-empty">Loading your saved history...</div>
              ) : historyError ? (
                <div className="review-error" role="alert">
                  {historyError}
                </div>
              ) : history.length === 0 ? (
                <div className="history-empty">No saved history yet</div>
              ) : (
                <div className="history-list">
                  {history.map((item) => (
                    <article className="history-item" key={item.id}>
                      <div className="history-item-time">{formatTimestamp(item.createdAt)}</div>
                      <p className="history-item-text">{item.review}</p>
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
                Use “Review code” or Ctrl+Enter (⌘+Enter on Mac).
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
