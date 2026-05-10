import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    const search = searchParams.get('search');
    const id = searchParams.get('id');

    // Get single item by id and section
    if (id && section) {
      return getItem(section, id);
    }

    // Global search across all sections
    if (search) {
      return globalSearch(search);
    }

    // Get all sections overview
    if (!section) {
      const sections = await db.librarySection.findMany({ orderBy: { order: 'asc' } });
      return NextResponse.json({ sections });
    }

    // Get items for a specific section
    return getSectionData(section);
  } catch (error) {
    console.error('Library API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getSectionData(section: string) {
  switch (section) {
    case 'organon': {
      const books = await db.book.findMany({
        where: { section: { slug: 'organon' } },
        include: { chapters: { include: { aphorisms: { orderBy: { number: 'asc' } } }, orderBy: { order: 'asc' } } },
      });
      return NextResponse.json({ section: 'organon', data: books });
    }
    case 'materia-medica': {
      const remedies = await db.remedy.findMany({ orderBy: { name: 'asc' } });
      return NextResponse.json({ section: 'materia-medica', data: remedies });
    }
    case 'repertory': {
      const rubrics = await db.rubric.findMany({ include: { remedy: { select: { name: true } } }, orderBy: { chapter: 'asc' } });
      const chapters = [...new Set(rubrics.map(r => r.chapter))].sort();
      return NextResponse.json({ section: 'repertory', data: { rubrics, chapters } });
    }
    case 'chronic-diseases': {
      const books = await db.book.findMany({
        where: { section: { slug: 'chronic-diseases' } },
        include: { chapters: { orderBy: { order: 'asc' } } },
      });
      const miasmNotes = await db.miasmNote.findMany({ orderBy: { miasm: 'asc' } });
      return NextResponse.json({ section: 'chronic-diseases', data: { books, miasmNotes } });
    }
    case 'philosophy': {
      const books = await db.book.findMany({
        where: { section: { slug: 'philosophy' } },
        include: { chapters: { orderBy: { order: 'asc' } } },
      });
      return NextResponse.json({ section: 'philosophy', data: books });
    }
    case 'therapeutics': {
      const therapeutics = await db.therapeutic.findMany({ orderBy: { disease: 'asc' } });
      return NextResponse.json({ section: 'therapeutics', data: therapeutics });
    }
    case 'clinical-cases': {
      const cases = await db.clinicalCase.findMany({ orderBy: { title: 'asc' } });
      return NextResponse.json({ section: 'clinical-cases', data: cases });
    }
    case 'disease-templates': {
      const templates = await db.diseaseTemplate.findMany({ orderBy: { name: 'asc' } });
      return NextResponse.json({ section: 'disease-templates', data: templates });
    }
    case 'remedy-relationships': {
      const remedies = await db.remedy.findMany({
        select: { id: true, name: true, remedyRelationships: true, compareRemedies: true },
        orderBy: { name: 'asc' },
      });
      return NextResponse.json({ section: 'remedy-relationships', data: remedies });
    }
    case 'miasm-library': {
      const miasmNotes = await db.miasmNote.findMany({ orderBy: { miasm: 'asc' } });
      return NextResponse.json({ section: 'miasm-library', data: miasmNotes });
    }
    case 'bhms-notes': {
      const notes = await db.bHMSNote.findMany({ orderBy: [{ subject: 'asc' }, { topic: 'asc' }] });
      const subjects = [...new Set(notes.map(n => n.subject))];
      return NextResponse.json({ section: 'bhms-notes', data: { notes, subjects } });
    }
    case 'question-bank': {
      const questions = await db.questionBank.findMany({ orderBy: [{ subject: 'asc' }, { type: 'asc' }] });
      const types = [...new Set(questions.map(q => q.type))];
      const subjects = [...new Set(questions.map(q => q.subject))];
      return NextResponse.json({ section: 'question-bank', data: { questions, types, subjects } });
    }
    default:
      return NextResponse.json({ error: 'Unknown section' }, { status: 404 });
  }
}

async function getItem(section: string, id: string) {
  switch (section) {
    case 'materia-medica': {
      const remedy = await db.remedy.findUnique({ where: { id }, include: { rubrics: true } });
      if (!remedy) return NextResponse.json({ error: 'Remedy not found' }, { status: 404 });
      return NextResponse.json({ data: remedy });
    }
    case 'clinical-cases': {
      const clinicalCase = await db.clinicalCase.findUnique({ where: { id } });
      if (!clinicalCase) return NextResponse.json({ error: 'Case not found' }, { status: 404 });
      return NextResponse.json({ data: clinicalCase });
    }
    case 'therapeutics': {
      const therapeutic = await db.therapeutic.findUnique({ where: { id } });
      if (!therapeutic) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ data: therapeutic });
    }
    case 'organon': {
      const aphorism = await db.aphorism.findUnique({ where: { id } });
      if (!aphorism) return NextResponse.json({ error: 'Aphorism not found' }, { status: 404 });
      return NextResponse.json({ data: aphorism });
    }
    default: {
      return NextResponse.json({ error: 'Section not supported for item lookup' }, { status: 400 });
    }
  }
}

async function globalSearch(query: string) {
  const q = query.toLowerCase();
  const results: any[] = [];

  // Search remedies
  const remedies = await db.remedy.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { essence: { contains: q } },
        { keynotes: { contains: q } },
        { clinicalUses: { contains: q } },
        { mentalGenerals: { contains: q } },
      ],
    },
    take: 10,
  });
  remedies.forEach(r => results.push({ type: 'remedy', section: 'materia-medica', id: r.id, title: r.name, excerpt: r.essence || r.keynotes || '' }));

  // Search aphorisms
  const aphorisms = await db.aphorism.findMany({
    where: {
      OR: [
        { originalText: { contains: q } },
        { simplifiedExplanation: { contains: q } },
        { title: { contains: q } },
        { commentary: { contains: q } },
      ],
    },
    take: 5,
  });
  aphorisms.forEach(a => results.push({ type: 'aphorism', section: 'organon', id: a.id, title: `Aphorism ${a.number}: ${a.title || ''}`, excerpt: a.simplifiedExplanation || a.originalText?.substring(0, 100) || '' }));

  // Search rubrics
  const rubrics = await db.rubric.findMany({
    where: { OR: [{ name: { contains: q } }, { chapter: { contains: q } }] },
    include: { remedy: { select: { name: true } } },
    take: 10,
  });
  rubrics.forEach(r => results.push({ type: 'rubric', section: 'repertory', id: r.id, title: `${r.chapter} — ${r.name}`, excerpt: r.remedy?.name || '' }));

  // Search therapeutics
  const therapeutics = await db.therapeutic.findMany({
    where: { OR: [{ disease: { contains: q } }, { description: { contains: q } }, { remedies: { contains: q } }] },
    take: 5,
  });
  therapeutics.forEach(t => results.push({ type: 'therapeutic', section: 'therapeutics', id: t.id, title: t.disease, excerpt: t.remedies || t.description || '' }));

  // Search clinical cases
  const cases = await db.clinicalCase.findMany({
    where: { OR: [{ title: { contains: q } }, { caseHistory: { contains: q } }, { finalRemedy: { contains: q } }] },
    take: 5,
  });
  cases.forEach(c => results.push({ type: 'case', section: 'clinical-cases', id: c.id, title: c.title, excerpt: c.finalRemedy || c.caseHistory?.substring(0, 100) || '' }));

  // Search BHMS notes
  const bhmsNotes = await db.bHMSNote.findMany({
    where: { OR: [{ topic: { contains: q } }, { content: { contains: q } }, { subject: { contains: q } }] },
    take: 5,
  });
  bhmsNotes.forEach(n => results.push({ type: 'note', section: 'bhms-notes', id: n.id, title: `${n.subject} — ${n.topic}`, excerpt: n.content?.substring(0, 100) || '' }));

  // Search disease templates
  const diseaseTemplates = await db.diseaseTemplate.findMany({
    where: { OR: [{ name: { contains: q } }, { commonRemedies: { contains: q } }] },
    take: 5,
  });
  diseaseTemplates.forEach(d => results.push({ type: 'template', section: 'disease-templates', id: d.id, title: d.name, excerpt: d.commonRemedies || '' }));

  // Search miasm notes
  const miasmNotes = await db.miasmNote.findMany({
    where: { OR: [{ title: { contains: q } }, { miasm: { contains: q } }, { description: { contains: q } }] },
    take: 5,
  });
  miasmNotes.forEach(m => results.push({ type: 'miasm', section: 'miasm-library', id: m.id, title: m.title, excerpt: m.miasm || '' }));

  return NextResponse.json({ query, results, total: results.length });
}
