import fs from 'node:fs/promises';
import path from 'node:path';
import pdf from 'pdf-parse';

async function main() {
  const root = path.resolve(__dirname, '..');
  const pdfPath = path.join(root, '30-day-local-seo-playbook.pdf');
  const buffer = await fs.readFile(pdfPath);
  const data = await pdf(buffer);

  // Naive parsing: split into sections by headings like "Day X" and "Bonus"
  const text = data.text.replace(/\r/g, '');
  const lines = text.split('\n').map((l: string) => l.trim()).filter(Boolean);

  type Lesson = {
    slug: string;
    title: string;
    day: number | null;
    is_intro: boolean;
    is_bonus: boolean;
    estimated_minutes: number | null;
    resources: Array<{ label: string; url: string }>;
    body: Array<any>;
    featured_video?: { provider: 'youtube' | 'vimeo' | 'file'; url: string } | null;
    sort_order: number;
    published: boolean;
  };

  const lessons: Lesson[] = [];
  let current: Lesson | null = null;
  let order = 0;
  let introSeen = false;
  let bonusSeen = false;

  const pushCurrent = () => {
    if (current) {
      lessons.push(current);
    }
  };

  for (const line of lines) {
    const dayMatch = /^Day\s+(\d{1,2})\b/i.exec(line);
    if (/^Intro\b/i.test(line) && !introSeen) {
      pushCurrent();
      current = {
        slug: 'intro',
        title: 'Intro',
        day: null,
        is_intro: true,
        is_bonus: false,
        estimated_minutes: null,
        resources: [],
        body: [],
        featured_video: null,
        sort_order: order++,
        published: true,
      };
      introSeen = true;
      continue;
    }
    if (dayMatch) {
      const day = Number(dayMatch[1]);
      if (day < 1 || day > 30) {
        // Skip invalid day numbers; treat >30 as bonus section content
        continue;
      }
      pushCurrent();
      current = {
        slug: `day-${day}`,
        title: line,
        day,
        is_intro: false,
        is_bonus: false,
        estimated_minutes: null,
        resources: [],
        body: [],
        featured_video: null,
        sort_order: order++,
        published: true,
      };
      continue;
    }
    if (/^Bonus\b/i.test(line) && !bonusSeen) {
      pushCurrent();
      current = {
        slug: 'bonus',
        title: line,
        day: null,
        is_intro: false,
        is_bonus: true,
        estimated_minutes: null,
        resources: [],
        body: [],
        featured_video: null,
        sort_order: order++,
        published: true,
      };
      bonusSeen = true;
      continue;
    }
    if (current) {
      // detect youtube links
      const yt = line.match(/https?:\/\/(?:www\.)?youtu(?:\.be|be\.com)\/[\w\-?&=/%#]+/i);
      if (yt && !current.featured_video) {
        const embed = toYouTubeEmbed(yt[0]);
        current.featured_video = { provider: 'youtube', url: embed };
      }
      // simple block inference
      if (/^\d+\.|^-\s+|^•\s+/.test(line)) {
        const content = line.replace(/^\d+\.|^-\s+|^•\s+/, '').trim();
        const prev = current.body[current.body.length - 1];
        if (prev && prev.type === 'list' && !prev.ordered) {
          prev.items.push(content);
        } else {
          current.body.push({ type: 'list', ordered: false, items: [content] });
        }
      } else if (/^#{2,4}\s+/.test(line)) {
        const level = (line.match(/^#+/)![0].length as 2 | 3 | 4);
        const content = line.replace(/^#{2,4}\s+/, '').trim();
        current.body.push({ type: 'heading', level: Math.min(level, 4), content });
      } else if (line.length) {
        current.body.push({ type: 'paragraph', content: line });
      }
    }
  }
  pushCurrent();
  // Dedupe by slug: keep first occurrence to avoid TOC duplicates
  const seen = new Set<string>();
  const deduped: Lesson[] = [];
  for (const l of lessons) {
    if (seen.has(l.slug)) continue;
    seen.add(l.slug);
    deduped.push(l);
  }

  const outPath = path.join(root, 'supabase', 'seed-lessons.json');
  await fs.writeFile(outPath, JSON.stringify({ lessons: deduped }, null, 2), 'utf8');
  console.log(`Wrote ${lessons.length} lessons to ${outPath}`);
}

function toYouTubeEmbed(url: string): string {
  try {
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split(/[?&#]/)[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
      const parts = u.pathname.split('/');
      const last = parts[parts.length - 1];
      if (last) return `https://www.youtube.com/embed/${last}`;
    }
  } catch { }
  return url;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


