import { useState, useEffect, useCallback, useRef } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

const DEFAULT_CODE = `function sum() {
  return 1 + 1
}`

function App() {
  const reviewSessionRef = useRef(0)
  const [code, setCode] = useState(DEFAULT_CODE)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('code-review-theme') || 'dark'
  })

  useEffect(() => {
    localStorage.setItem('code-review-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    prism.highlightAll()
  }, [])

  const startNewChat = useCallback(() => {
    reviewSessionRef.current += 1
    setCode(DEFAULT_CODE)
    setReview('')
    setError(null)
    setLoading(false)
  }, [])

  const reviewCode = useCallback(async () => {
    const session = reviewSessionRef.current
    setError(null)
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code })
      if (reviewSessionRef.current === session) setReview(response.data)
    } catch (err) {
      if (reviewSessionRef.current === session) {
        setError(err.message || 'Failed to get review')
      }
    } finally {
      if (reviewSessionRef.current === session) setLoading(false)
    }
  }, [code])

  useEffect(() => {
    function onKeyDown(e) {
      if (!(e.key === 'Enter' && (e.ctrlKey || e.metaKey))) return
      e.preventDefault()
      if (loading) return
      reviewCode()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [loading, reviewCode])

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
            <span className="app-logo-mark">
              &lt;/&gt;
            </span>
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
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="theme-toggle-thumb" aria-hidden />
            <span className="theme-toggle-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            </span>
            <span className="theme-toggle-icon theme-toggle-icon-sun" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
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
              title="Review code · Ctrl+Enter or ⌘+Enter"
            >
              {loading ? (
                <span className="review-btn-content">
                  <span className="review-btn-spinner" aria-hidden />
                  Analyze
                </span>
              ) : (
                'Review code'
              )}
            </button>
          </div>
          <div className="code-wrap">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={20}
              style={{
                fontFamily: '"JetBrains Mono", "Fira Code", "Fira Mono", monospace',
                fontSize: 22,
                minHeight: '100%',
                width: '100%',
              }}
            />
          </div>
        </section>
        <section className="panel right-panel" aria-busy={loading}>
          <div className="panel-label">Review</div>
          <div className="review-content">
            {loading && (
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
            )}
            {!loading && error && (
              <div className="review-error" role="alert">
                {error}
              </div>
            )}
            {!loading && !error && review && (
              <div className="review-markdown">
                <Markdown rehypePlugins={[rehypeHighlight]}>
                  {review}
                </Markdown>
              </div>
            )}
            {!loading && !error && !review && (
              <div className="review-placeholder">
                Use “Review code” or press Ctrl+Enter (⌘+Enter on Mac) for feedback.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}



export default App
