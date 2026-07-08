import { useState, type ReactNode } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup'
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark'

SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('ts', typescript)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('js', javascript)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('py', python)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('sh', bash)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('sql', sql)
SyntaxHighlighter.registerLanguage('yaml', yaml)
SyntaxHighlighter.registerLanguage('yml', yaml)
SyntaxHighlighter.registerLanguage('html', markup)
SyntaxHighlighter.registerLanguage('xml', markup)

const LANGUAGE_LABELS: Record<string, string> = {
  js: 'JavaScript', javascript: 'JavaScript',
  ts: 'TypeScript', typescript: 'TypeScript',
  jsx: 'JSX', tsx: 'TSX',
  py: 'Python', python: 'Python',
  bash: 'Bash', sh: 'Shell',
  json: 'JSON', css: 'CSS', sql: 'SQL',
  yaml: 'YAML', yml: 'YAML',
  html: 'HTML', xml: 'XML',
}

const REGISTERED_LANGUAGES = new Set(Object.keys(LANGUAGE_LABELS))

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    void navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] text-slate-400 hover:bg-white/10 hover:text-slate-200 transition-colors"
    >
      {copied ? (
        <>
          <svg viewBox="0 0 20 20" fill="none" className="size-3.5">
            <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          کپی شد
        </>
      ) : (
        <>
          <svg viewBox="0 0 20 20" fill="none" className="size-3.5">
            <rect x="7" y="7" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4.5 12.5V4.5a1 1 0 011-1h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          کپی
        </>
      )}
    </button>
  )
}

export function CodeBlock({ className, children }: { className?: string; children?: ReactNode }) {
  const match = /language-(\w+)/.exec(className ?? '')
  const raw = String(children)

  if (!match && !raw.includes('\n')) {
    return (
      <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.88em]" dir="ltr">
        {children}
      </code>
    )
  }

  const lang = match?.[1]
  const code = raw.replace(/\n$/, '')
  const known = lang && REGISTERED_LANGUAGES.has(lang)

  return (
    <div className="my-2 overflow-hidden rounded-xl border border-white/10" dir="ltr">
      <div className="flex items-center justify-between bg-white/5 px-3 py-1.5">
        <span className="text-[11px] text-slate-400">{(known && LANGUAGE_LABELS[lang]) || lang || 'text'}</span>
        <CopyButton text={code} />
      </div>
      {known ? (
        <SyntaxHighlighter
          language={lang}
          style={oneDark}
          customStyle={{ margin: 0, background: 'transparent', fontSize: '0.85em', padding: '0.85em 1em' }}
          codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } }}
        >
          {code}
        </SyntaxHighlighter>
      ) : (
        <pre className="overflow-x-auto px-4 py-3.5 text-[0.85em] font-mono text-slate-200">{code}</pre>
      )}
    </div>
  )
}

export function PrePassthrough({ children }: { children?: ReactNode }) {
  return <>{children}</>
}
