import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const type = url.searchParams.get('type');

    if (!id || !type) {
      return NextResponse.json({ error: 'id and type are required' }, { status: 400 });
    }

    switch (type) {
      case 'remedy': {
        const remedy = await db.remedy.findUnique({ where: { id }, include: { rubrics: true } });
        if (!remedy) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ remedy });
      }
      case 'aphorism': {
        const aphorism = await db.aphorism.findUnique({ where: { id }, include: { chapter: { include: { book: true } } } });
        if (!aphorism) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ aphorism });
      }
      case 'rubric': {
        const rubric = await db.rubric.findUnique({ where: { id }, include: { remedy: true } });
        if (!rubric) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ rubric });
      }
      case 'case': {
        const caseData = await db.clinicalCase.findUnique({ where: { id } });
        if (!caseData) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ case: caseData });
      }
      case 'disease': {
        const template = await db.diseaseTemplate.findUnique({ where: { id } });
        if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ template });
      }
      case 'therapeutic': {
        const therapeutic = await db.therapeutic.findUnique({ where: { id } });
        if (!therapeutic) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ therapeutic });
      }
      case 'miasm': {
        const miasm = await db.miasmNote.findUnique({ where: { id } });
        if (!miasm) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ miasm });
      }
      case 'bhms': {
        const note = await db.bHMSNote.findUnique({ where: { id } });
        if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ note });
      }
      case 'question': {
        const question = await db.questionBank.findUnique({ where: { id } });
        if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ question });
      }
      default:
        return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Library item API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
