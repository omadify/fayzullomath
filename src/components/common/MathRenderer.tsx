import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content?: string;
  block?: boolean;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  content = '',
  block = false,
  className = ''
}) => {
  if (!content) return null;

  // If explicit single formula passed without $ wrappers
  if (!content.includes('$') && (block || /[\^_{}\\]/.test(content))) {
    try {
      const html = katex.renderToString(content, {
        displayMode: block,
        throwOnError: false
      });
      return (
        <span
          className={`inline-block font-sans ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      return <span className={`font-mono ${className}`}>{content}</span>;
    }
  }

  // Parse mixed text with $$block$$ and $inline$
  const parseContent = (text: string) => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Handle block formulas $$...$$
    const blockRegex = /\$\$([\s\S]*?)\$\$/;
    // Handle inline formulas $...$
    const inlineRegex = /\$([^\$]+?)\$/;

    while (remaining.length > 0) {
      const blockMatch = remaining.match(blockRegex);
      const inlineMatch = remaining.match(inlineRegex);

      if (!blockMatch && !inlineMatch) {
        parts.push(<span key={keyIdx++}>{remaining}</span>);
        break;
      }

      const blockIndex = blockMatch ? remaining.indexOf(blockMatch[0]) : -1;
      const inlineIndex = inlineMatch ? remaining.indexOf(inlineMatch[0]) : -1;

      // Check which delimiter comes first
      const isBlock = blockIndex !== -1 && (inlineIndex === -1 || blockIndex <= inlineIndex);
      const firstIndex = isBlock ? blockIndex : inlineIndex;
      const match = isBlock ? blockMatch! : inlineMatch!;

      // Push text before formula
      if (firstIndex > 0) {
        parts.push(<span key={keyIdx++}>{remaining.substring(0, firstIndex)}</span>);
      }

      // Render formula
      const formula = match[1].trim();
      try {
        const html = katex.renderToString(formula, {
          displayMode: isBlock,
          throwOnError: false
        });
        parts.push(
          <span
            key={keyIdx++}
            className={isBlock ? 'block my-2 text-center overflow-x-auto' : 'inline-block px-1'}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        parts.push(
          <code key={keyIdx++} className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded text-xs font-mono">
            {formula}
          </code>
        );
      }

      remaining = remaining.substring(firstIndex + match[0].length);
    }

    return parts;
  };

  return <div className={`leading-relaxed ${className}`}>{parseContent(content)}</div>;
};
