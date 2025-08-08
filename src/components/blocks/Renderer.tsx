import type { PropsWithChildren } from 'react';
import { Card } from '@/components/Card';

export type LessonBlock =
    | { type: 'paragraph'; content: string }
    | { type: 'heading'; level?: 2 | 3 | 4; content: string }
    | { type: 'list'; ordered?: boolean; items: string[] }
    | { type: 'image'; url: string; alt?: string; caption?: string }
  | { type: 'video'; provider: 'youtube' | 'vimeo' | 'file'; url: string; caption?: string }
  | { type: 'code'; language?: string; content: string };

type Props = PropsWithChildren & {
    blocks: LessonBlock[];
};

export function Renderer({ blocks }: Props) {
    if (!Array.isArray(blocks) || blocks.length === 0) {
        return (
            <Card>
                <div className="p-6 text-neutral-700">No content yet.</div>
            </Card>
        );
    }
    return (
        <div className="space-y-4">
            {blocks.map((b, i) => {
                switch (b.type) {
                    case 'paragraph':
                        return (
                            <p key={i} className="text-neutral-900">
                                {b.content}
                            </p>
                        );
                    case 'heading':
                        if (b.level === 3) return <h3 key={i}>{b.content}</h3>;
                        if (b.level === 4) return <h4 key={i}>{b.content}</h4>;
                        return <h2 key={i}>{b.content}</h2>;
                    case 'list':
                        return b.ordered ? (
                            <ol key={i} className="list-decimal pl-6">
                                {b.items.map((it, j) => (
                                    <li key={j}>{it}</li>
                                ))}
                            </ol>
                        ) : (
                            <ul key={i} className="list-disc pl-6">
                                {b.items.map((it, j) => (
                                    <li key={j}>{it}</li>
                                ))}
                            </ul>
                        );
                    case 'image':
                        return (
                            <figure key={i} className="space-y-2">
                                <img src={b.url} alt={b.alt || ''} className="rounded-md ring-1 ring-neutral-200" />
                                {b.caption && <figcaption className="text-sm text-neutral-600">{b.caption}</figcaption>}
                            </figure>
                        );
                    case 'video':
                        return (
                            <div key={i} className="aspect-video w-full overflow-hidden rounded-md ring-1 ring-neutral-200">
                                <iframe className="h-full w-full" src={b.url} title={b.caption || 'Video'} allowFullScreen />
                                {b.caption && <p className="mt-1 text-sm text-neutral-600">{b.caption}</p>}
                            </div>
                        );
          case 'code':
            return (
              <pre key={i} className="overflow-x-auto rounded-md bg-neutral-900 p-4 text-neutral-100">
                <code>{b.content}</code>
              </pre>
            );
                    default:
                        return null;
                }
            })}
        </div>
    );
}


