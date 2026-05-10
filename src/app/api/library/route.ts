import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    const section = url.searchParams.get('section');
    const type = url.searchParams.get('type');

    // Global search across all content
    if (search) {
      const results: { type: string; title: string; description: string; id: string; section: string }[] = [];

      // Search remedies
      const remedies = await db.remedy.findMany({
        where: {
          OR: [
            { name: { contains: search } },
            { essence: { contains: search } },
            { keynotes: { contains: search } },
            { clinicalUses: { contains: search } },
            { mentalGenerals: { contains: search } },
          ],
        },
        take: 10,
      });
      remedies.forEach(r => results.push({ type: 'remedy', title: r.name, description: r.essence || r.keynotes || '', id: r.id, section: 'materia-medica' }));

      // Search aphorisms
      const aphorisms = await db.aphorism.findMany({
        where: {
          OR: [
            { originalText: { contains: search } },
            { simplifiedExplanation: { contains: search } },
            { commentary: { contains: search } },
            { tags: { contains: search } },
          ],
        },
        include: { chapter: true },
        take: 10,
      });
      aphorisms.forEach(a => results.push({ type: 'aphorism', title: `Aphorism ${a.number}: ${a.title || ''}`, description: a.originalText.substring(0, 120), id: a.id, section: 'organon' }));

      // Search rubrics
      const rubrics = await db.rubric.findMany({
        where: {
          OR: [
            { name: { contains: search } },
            { chapter: { contains: search } },
            { synonyms: { contains: search } },
          ],
        },
        take: 10,
      });
      rubrics.forEach(r => results.push({ type: 'rubric', title: r.name, description: `Chapter: ${r.chapter}`, id: r.id, section: 'repertory' }));

      // Search clinical cases
      const cases = await db.clinicalCase.findMany({
        where: {
          OR: [
            { title: { contains: search } },
            { caseHistory: { contains: search } },
            { tags: { contains: search } },
          ],
        },
        take: 10,
      });
      cases.forEach(c => results.push({ type: 'case', title: c.title, description: c.caseHistory.substring(0, 120), id: c.id, section: 'clinical-cases' }));

      // Search disease templates
      const diseases = await db.diseaseTemplate.findMany({
        where: {
          OR: [
            { name: { contains: search } },
            { tags: { contains: search } },
          ],
        },
        take: 10,
      });
      diseases.forEach(d => results.push({ type: 'disease', title: d.name, description: d.characteristicSymptoms || '', id: d.id, section: 'disease-templates' }));

      // Search therapeutics
      const therapeutics = await db.therapeutic.findMany({
        where: {
          OR: [
            { disease: { contains: search } },
            { description: { contains: search } },
            { remedies: { contains: search } },
          ],
        },
        take: 10,
      });
      therapeutics.forEach(t => results.push({ type: 'therapeutic', title: t.disease, description: t.description || '', id: t.id, section: 'therapeutics' }));

      // Search miasm notes
      const miasms = await db.miasmNote.findMany({
        where: {
          OR: [
            { title: { contains: search } },
            { miasm: { contains: search } },
            { description: { contains: search } },
          ],
        },
        take: 10,
      });
      miasms.forEach(m => results.push({ type: 'miasm', title: m.title, description: m.description.substring(0, 120), id: m.id, section: 'miasm-library' }));

      // Search BHMS notes
      const bhms = await db.bHMSNote.findMany({
        where: {
          OR: [
            { subject: { contains: search } },
            { topic: { contains: search } },
            { content: { contains: search } },
          ],
        },
        take: 10,
      });
      bhms.forEach(b => results.push({ type: 'bhms', title: `${b.subject} — ${b.topic}`, description: b.content.substring(0, 120), id: b.id, section: 'bhms-notes' }));

      // Search question bank
      const questions = await db.questionBank.findMany({
        where: {
          OR: [
            { question: { contains: search } },
            { subject: { contains: search } },
            { tags: { contains: search } },
          ],
        },
        take: 10,
      });
      questions.forEach(q => results.push({ type: 'question', title: q.question.substring(0, 80), description: `${q.type} — ${q.subject}`, id: q.id, section: 'question-bank' }));

      // Search books
      const books = await db.book.findMany({
        where: {
          OR: [
            { title: { contains: search } },
            { author: { contains: search } },
          ],
        },
        take: 10,
      });
      books.forEach(b => results.push({ type: 'book', title: b.title, description: `by ${b.author}`, id: b.id, section: b.sectionId }));

      return NextResponse.json({ results, total: results.length });
    }

    // Get sections with counts
    if (type === 'sections') {
      const sections = await db.librarySection.findMany({ orderBy: { order: 'asc' } });
      return NextResponse.json({ sections });
    }

    // Get section-specific data
    if (section) {
      const data = await getSectionData(section, url.searchParams);
      return NextResponse.json(data);
    }

    // Default: return sections overview
    const sections = await db.librarySection.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Library API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getSectionData(slug: string, params: URLSearchParams) {
  const page = parseInt(params.get('page') || '1');
  const limit = parseInt(params.get('limit') || '20');
  const skip = (page - 1) * limit;

  switch (slug) {
    case 'organon': {
      const books = await db.book.findMany({ where: { section: { slug: 'organon' } }, include: { chapters: { include: { aphorisms: true }, orderBy: { order: 'asc' } } } });
      const aphorisms = await db.aphorism.findMany({ skip, take: limit, orderBy: { number: 'asc' } });
      const total = await db.aphorism.count();
      return { books, aphorisms, total, page };
    }
    case 'materia-medica': {
      const search = params.get('q')?.toLowerCase();
      const where = search ? { OR: [{ name: { contains: search } }, { keynotes: { contains: search } }, { essence: { contains: search } }] } : {};
      const remedies = await db.remedy.findMany({ where, skip, take: limit, orderBy: { name: 'asc' } });
      const total = await db.remedy.count({ where });
      return { remedies, total, page };
    }
    case 'repertory': {
      const search = params.get('q')?.toLowerCase();
      const where = search ? { OR: [{ name: { contains: search } }, { chapter: { contains: search } }] } : {};
      const rubrics = await db.rubric.findMany({ where, skip, take: limit, orderBy: [{ chapter: 'asc' }, { name: 'asc' }] });
      const chapters = await db.rubric.groupBy({ by: ['chapter'], orderBy: { chapter: 'asc' } });
      const total = await db.rubric.count({ where });
      return { rubrics, chapters: chapters.map(c => c.chapter), total, page };
    }
    case 'chronic-diseases': {
      const books = await db.book.findMany({ where: { section: { slug: 'chronic-diseases' } }, include: { chapters: true } });
      const miasms = await db.miasmNote.findMany({ where: { miasm: { in: ['Psora', 'Sycosis', 'Syphilis'] } } });
      return { books, miasms };
    }
    case 'philosophy': {
      const books = await db.book.findMany({ where: { section: { slug: 'philosophy' } } });
      return { books };
    }
    case 'therapeutics': {
      const search = params.get('q')?.toLowerCase();
      const where = search ? { OR: [{ disease: { contains: search } }, { remedies: { contains: search } }] } : {};
      const therapeutics = await db.therapeutic.findMany({ where, skip, take: limit, orderBy: { disease: 'asc' } });
      const total = await db.therapeutic.count({ where });
      return { therapeutics, total, page };
    }
    case 'clinical-cases': {
      const cases = await db.clinicalCase.findMany({ skip, take: limit, orderBy: { title: 'asc' } });
      const total = await db.clinicalCase.count();
      return { cases, total, page };
    }
    case 'disease-templates': {
      const templates = await db.diseaseTemplate.findMany({ skip, take: limit, orderBy: { name: 'asc' } });
      const total = await db.diseaseTemplate.count();
      return { templates, total, page };
    }
    case 'remedy-relationships': {
      const remedies = await db.remedy.findMany({ where: { remedyRelationships: { not: null } }, select: { id: true, name: true, remedyRelationships: true, compareRemedies: true } });
      return { remedies };
    }
    case 'miasm-library': {
      const miasms = await db.miasmNote.findMany({ orderBy: { miasm: 'asc' } });
      return { miasms };
    }
    case 'bhms-notes': {
      const subject = params.get('subject');
      const where = subject ? { subject } : {};
      const notes = await db.bHMSNote.findMany({ where, skip, take: limit, orderBy: [{ subject: 'asc' }, { topic: 'asc' }] });
      const subjects = await db.bHMSNote.groupBy({ by: ['subject'], orderBy: { subject: 'asc' } });
      const total = await db.bHMSNote.count({ where });
      return { notes, subjects: subjects.map(s => s.subject), total, page };
    }
    case 'question-bank': {
      const qType = params.get('type');
      const subject = params.get('subject');
      const where: Record<string, unknown> = {};
      if (qType) where.type = qType;
      if (subject) where.subject = subject;
      const questions = await db.questionBank.findMany({ where, skip, take: limit, orderBy: { subject: 'asc' } });
      const types = await db.questionBank.groupBy({ by: ['type'] });
      const subjects = await db.questionBank.groupBy({ by: ['subject'] });
      const total = await db.questionBank.count({ where });
      return { questions, types: types.map(t => t.type), subjects: subjects.map(s => s.subject), total, page };
    }
    default:
      return { error: 'Unknown section' };
  }
}
