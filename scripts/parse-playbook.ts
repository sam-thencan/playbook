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
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  type Lesson = {
    slug: string;
    title: string;
    day: number | null;
    is_intro: boolean;
    is_bonus: boolean;
    estimated_minutes: number | null;
    resources: Array<{ label: string; url: string }>;
    body: Array<{ type: string; content: string }>;
    sort_order: number;
    published: boolean;
  };

  const lessons: Lesson[] = [];
  let current: Lesson | null = null;
  let order = 0;

  const pushCurrent = () => {
    if (current) {
      lessons.push(current);
    }
  };

  for (const line of lines) {
    const dayMatch = /^Day\s+(\d{1,2})\b/i.exec(line);
    if (/^Intro\b/i.test(line)) {
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
        sort_order: order++,
        published: true,
      };
      continue;
    }
    if (dayMatch) {
      const day = Number(dayMatch[1]);
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
        sort_order: order++,
        published: true,
      };
      continue;
    }
    if (/^Bonus\b/i.test(line)) {
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
        sort_order: order++,
        published: true,
      };
      continue;
    }
    if (current) {
      current.body.push({ type: 'paragraph', content: line });
    }
  }
  pushCurrent();

  const outPath = path.join(root, 'supabase', 'seed-lessons.json');
  await fs.writeFile(outPath, JSON.stringify({ lessons }, null, 2), 'utf8');
  console.log(`Wrote ${lessons.length} lessons to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


