function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function renderMarkdown(text: string): string {
  // 1. fenced code blocks
  let html = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, _lang, code: string) =>
    `<pre><code>${escapeHtml(code.trim())}</code></pre>`,
  )

  // 2. inline code
  html = html.replace(/`([^`\n]+)`/g, (_, code: string) => `<code>${escapeHtml(code)}</code>`)

  // 3. headers
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // 4. bold / italic (order: *** > ** > *)
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // 5. links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  )

  // 6. horizontal rule
  html = html.replace(/^---+$/gm, '<hr>')

  // 7. lists (line-by-line pass)
  const lines = html.split('\n')
  const out: string[] = []
  let inUl = false
  let inOl = false

  for (const line of lines) {
    const ulM = line.match(/^(\s*)-\s+(.+)$/)
    const olM = line.match(/^\d+\.\s+(.+)$/)

    if (ulM) {
      if (inOl) { out.push('</ol>'); inOl = false }
      if (!inUl) { out.push('<ul>'); inUl = true }
      out.push(`<li>${ulM[2]}</li>`)
    } else if (olM) {
      if (inUl) { out.push('</ul>'); inUl = false }
      if (!inOl) { out.push('<ol>'); inOl = true }
      out.push(`<li>${olM[1]}</li>`)
    } else {
      if (inUl) { out.push('</ul>'); inUl = false }
      if (inOl) { out.push('</ol>'); inOl = false }
      out.push(line)
    }
  }
  if (inUl) out.push('</ul>')
  if (inOl) out.push('</ol>')

  html = out.join('\n')

  // 8. paragraphs — split on blank lines, wrap plain text
  const BLOCK = /^<(h[1-6]|ul|ol|pre|hr|blockquote)/

  const paras = html.split(/\n\n+/).map(block => {
    const t = block.trim()
    if (!t) return ''
    if (BLOCK.test(t)) return t
    return `<p>${t.replace(/\n/g, '<br>')}</p>`
  })

  return paras.filter(Boolean).join('\n')
}
