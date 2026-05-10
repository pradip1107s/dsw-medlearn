import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    // Seed Library Sections
    const sections = [
      { title: 'Organon of Medicine', slug: 'organon', description: 'Hahnemann\'s foundational work — aphorisms, editions & commentary', icon: '📖', color: '#3aaa7a', order: 1 },
      { title: 'Materia Medica', slug: 'materia-medica', description: 'Complete remedy library from Boericke, Kent & Hahnemann', icon: '🧪', color: '#d4a843', order: 2 },
      { title: 'Repertory', slug: 'repertory', description: 'Kent\'s Repertory with rubric search & remedy grades', icon: '🔍', color: '#2d7a5a', order: 3 },
      { title: 'Chronic Diseases', slug: 'chronic-diseases', description: 'Hahnemann\'s miasmatic theory — Psora, Sycosis, Syphilis', icon: '🔬', color: '#e05555', order: 4 },
      { title: 'Philosophy', slug: 'philosophy', description: 'Vital force, susceptibility, similia principle & follow-up', icon: '🧠', color: '#8b5cf6', order: 5 },
      { title: 'Therapeutics', slug: 'therapeutics', description: 'Disease-wise therapeutic references & remedy selection', icon: '💊', color: '#3aaa7a', order: 6 },
      { title: 'Clinical Cases', slug: 'clinical-cases', description: 'Solved cases with rubrics, remedies & follow-up notes', icon: '🩺', color: '#d4a843', order: 7 },
      { title: 'Disease Templates', slug: 'disease-templates', description: 'Structured templates for common diseases', icon: '📋', color: '#2d7a5a', order: 8 },
      { title: 'Remedy Relationships', slug: 'remedy-relationships', description: 'Complementary, antidotes, inimicals & follows-well', icon: '🔗', color: '#e05555', order: 9 },
      { title: 'Miasm Library', slug: 'miasm-library', description: 'Detailed notes on Psora, Sycosis, Syphilis & Tubercular', icon: '🦠', color: '#8b5cf6', order: 10 },
      { title: 'BHMS Notes', slug: 'bhms-notes', description: 'Subject-wise academic notes for BHMS curriculum', icon: '📝', color: '#3aaa7a', order: 11 },
      { title: 'Question Bank', slug: 'question-bank', description: 'MCQs, viva questions & university exam papers', icon: '❓', color: '#d4a843', order: 12 },
    ];

    for (const s of sections) {
      const existing = await db.librarySection.findUnique({ where: { slug: s.slug } });
      if (!existing) {
        await db.librarySection.create({ data: s });
      }
    }

    // Seed Books
    const organonSection = await db.librarySection.findUnique({ where: { slug: 'organon' } });
    const mmSection = await db.librarySection.findUnique({ where: { slug: 'materia-medica' } });
    const repSection = await db.librarySection.findUnique({ where: { slug: 'repertory' } });
    const chronicSection = await db.librarySection.findUnique({ where: { slug: 'chronic-diseases' } });
    const philSection = await db.librarySection.findUnique({ where: { slug: 'philosophy' } });
    const thermoSection = await db.librarySection.findUnique({ where: { slug: 'therapeutics' } });

    const books = [
      { sectionId: organonSection!.id, title: 'Organon of Medicine', author: 'Samuel Hahnemann', description: 'The foundational text of homeopathy', edition: '6th Edition' },
      { sectionId: organonSection!.id, title: 'Organon of Medicine', author: 'Samuel Hahnemann', description: 'The classic fifth edition', edition: '5th Edition' },
      { sectionId: mmSection!.id, title: 'Materia Medica Pura', author: 'Samuel Hahnemann', description: 'Original provings of homeopathic remedies' },
      { sectionId: mmSection!.id, title: 'Materia Medica with Repertory', author: 'William Boericke', description: 'The most widely used clinical Materia Medica' },
      { sectionId: mmSection!.id, title: 'Lectures on Materia Medica', author: 'James Tyler Kent', description: 'Kent\'s classic lectures on remedy pictures' },
      { sectionId: repSection!.id, title: 'Repertory of the Materia Medica', author: 'James Tyler Kent', description: 'The standard homeopathic repertory' },
      { sectionId: chronicSection!.id, title: 'The Chronic Diseases', author: 'Samuel Hahnemann', description: 'Theory of chronic miasms — psora, sycosis, syphilis' },
      { sectionId: philSection!.id, title: 'Philosophy of Homeopathy', author: 'Stuart Close', description: 'The genius of homeopathy — lectures on philosophy' },
      { sectionId: philSection!.id, title: 'Principles and Art of Cure', author: 'Herbert Roberts', description: 'The principles and art of cure by homoeopathy' },
      { sectionId: thermoSection!.id, title: 'Therapeutics of Respiratory Diseases', author: 'M. Bhattacharya', description: 'Disease-wise therapeutics for respiratory conditions' },
    ];

    for (const b of books) {
      const existing = await db.book.findFirst({ where: { title: b.title, author: b.author, sectionId: b.sectionId } });
      if (!existing) {
        await db.book.create({ data: b });
      }
    }

    // Seed Organon Chapters & Aphorisms
    const organonBook = await db.book.findFirst({ where: { title: 'Organon of Medicine', edition: '6th Edition' } });
    if (organonBook) {
      const organonChapters = [
        { bookId: organonBook.id, title: 'Introduction', order: 1 },
        { bookId: organonBook.id, title: 'Natural Laws of Healing', order: 2 },
        { bookId: organonBook.id, title: 'The Mission of the Physician', order: 3 },
        { bookId: organonBook.id, title: 'Knowledge of Disease', order: 4 },
        { bookId: organonBook.id, title: 'Knowledge of Medicines', order: 5 },
        { bookId: organonBook.id, title: 'Application of Medicines', order: 6 },
      ];

      for (const ch of organonChapters) {
        const existing = await db.chapter.findFirst({ where: { bookId: ch.bookId, title: ch.title } });
        if (!existing) {
          await db.chapter.create({ data: ch });
        }
      }

      // Seed key aphorisms
      const introChapter = await db.chapter.findFirst({ where: { bookId: organonBook.id, title: 'Introduction' } });
      const missionChapter = await db.chapter.findFirst({ where: { bookId: organonBook.id, title: 'The Mission of the Physician' } });
      const diseaseChapter = await db.chapter.findFirst({ where: { bookId: organonBook.id, title: 'Knowledge of Disease' } });

      const aphorisms = [
        { chapterId: introChapter!.id, number: 1, title: 'The Physician\'s High Mission', originalText: 'The physician\'s high and only mission is to restore the sick to health, to cure, as it is termed.', simplifiedExplanation: 'The only purpose of a doctor is to cure the sick. This is the fundamental principle upon which all medical practice should be based.', commentary: 'Hahnemann establishes the primacy of cure over mere palliation or suppression. The word "mission" implies a sacred duty.', relatedTopics: 'mission of physician, cure, health restoration', tags: 'fundamental,mission,cure' },
        { chapterId: introChapter!.id, number: 2, title: 'Ideal Cure', originalText: 'The highest ideal of cure is rapid, gentle and permanent restoration of the health, or removal and annihilation of the disease in its whole extent, in the shortest, most reliable, and most harmless way.', simplifiedExplanation: 'The best cure is one that is quick, gentle, and lasting — removing the disease completely in the safest way possible.', commentary: 'This defines the criteria for evaluating any treatment: rapid, gentle, permanent, and harmless. This is the gold standard.', relatedTopics: 'ideal cure, rapid, gentle, permanent', tags: 'cure,ideal,treatment' },
        { chapterId: missionChapter!.id, number: 3, title: 'Knowledge Required by Physician', originalText: 'If the physician clearly perceives what is to be cured in diseases, that is to say, in every individual case of disease, if he clearly perceives what is curative in medicines, that is to say, in each individual medicine...', simplifiedExplanation: 'A physician must understand three things: what needs to be cured in the patient, what is curative in medicines, and how to properly apply the medicine.', commentary: 'Hahnemann outlines three pillars of homeopathic practice: knowledge of disease, knowledge of remedies, and knowledge of application.', relatedTopics: 'physician knowledge, disease, remedy, application', tags: 'knowledge,physician,principles' },
        { chapterId: diseaseChapter!.id, number: 6, title: 'Totality of Symptoms', originalText: 'The unprejudiced observer — even the most acute — can perceive in the living being nothing but the changes in his health that are perceptible by the senses.', simplifiedExplanation: 'The physician can only observe what is perceivable through the senses — the totality of symptoms represents the disease.', commentary: 'This is a crucial epistemological point. Disease, for Hahnemann, is known only through its symptoms. The totality of symptoms IS the disease from the practical standpoint.', relatedTopics: 'totality, symptoms, observation, disease', tags: 'totality,symptoms,observation' },
        { chapterId: diseaseChapter!.id, number: 9, title: 'Vital Force', originalText: 'In the healthy condition of man, the spiritual vital force, the dynamis that animates the material body, rules with unbounded sway.', simplifiedExplanation: 'In health, the vital force (life energy) maintains harmonious functioning of the body and mind.', commentary: 'The concept of vital force is central to homeopathy. It is the energy that maintains life and health. Disease is a disturbance of this force.', relatedTopics: 'vital force, dynamis, health, life energy', tags: 'vital-force,dynamis,health' },
        { chapterId: diseaseChapter!.id, number: 10, title: 'Material Body Without Vital Force', originalText: 'Without the vital force, the material body is incapable of sensation, function, or self-preservation.', simplifiedExplanation: 'Without the vital force, the body is dead — it cannot feel, act, or protect itself.', commentary: 'Hahnemann distinguishes between the living organism (animated by vital force) and the corpse. Disease is primarily a dynamic disturbance.', relatedTopics: 'vital force, death, material body', tags: 'vital-force,death,body' },
        { chapterId: diseaseChapter!.id, number: 11, title: 'Disease as Dynamic Disturbance', originalText: 'When a person falls ill, it is only this spiritual, self-acting vital force, everywhere present in his organism, that is primarily deranged.', simplifiedExplanation: 'Illness begins as a disturbance in the vital force — not in the physical tissues. The physical symptoms follow.', commentary: 'This is the dynamic theory of disease. Disease is first a disturbance in the life force, which then manifests as physical and mental symptoms.', relatedTopics: 'disease, dynamic, vital force, derangement', tags: 'disease,dynamic,vital-force' },
      ];

      for (const aph of aphorisms) {
        const existing = await db.aphorism.findFirst({ where: { chapterId: aph.chapterId, number: aph.number } });
        if (!existing) {
          await db.aphorism.create({ data: aph });
        }
      }
    }

    // Seed Remedies (Materia Medica)
    const remedies = [
      { name: 'Nux Vomica', sourceAuthors: 'Boericke, Kent, Hahnemann', essence: 'Irritable, ambitious, oversensitive personality — the typical modern stressed individual', mentalGenerals: 'Irritable, impatient, quarrelsome. Oversensitive to all impressions. Ambitious, dictatorial. Time-conscious, hurries. Depressed after anger.', physicalGenerals: 'Chilly patient. Gastric complaints, constipation. Headache with mental strain. Sedentary lifestyle effects. Piles and digestive issues.', modalities: 'Worse: morning, cold, mental exertion, narcotics, spices. Better: warmth, rest, evening, damp weather.', desiresAversions: 'Desires: fat, spicy food, stimulants, coffee. Aversion: vegetables, warm food.', thermalState: 'Chilly', sleepDreams: 'Wakes at 3-4 AM. Cannot sleep after mental strain. Dreams of quarrels, business.', miasmaticTendency: 'Psora + Sycosis', keynotes: 'Irritable + Chilly + Constipation + Oversensitive + Sedentary', remedyRelationships: 'Complementary: Ignatia, Sepia. Inimical: Cocculus. Follows well: Carbo Veg, Lycopodium.', compareRemedies: 'Ignatia, Chamomilla, Colocynth, Staphysagria', clinicalUses: 'Gastritis, constipation, piles, IBS, headache, insomnia, hangover, depression with anger' },
      { name: 'Pulsatilla', sourceAuthors: 'Boericke, Kent, Hahnemann', essence: 'Mild, gentle, yielding — weeping, wants consolation, changeable symptoms', mentalGenerals: 'Gentle, weeping, wants consolation. Yielding, mild, timid. Changeable moods. Clingy, fears being alone. Romantic, sentimental.', physicalGenerals: 'Thirstless. Changeable symptoms shift location. Discharges thick, bland, yellow-green. Varicose veins. Generally warm, wants open air.', modalities: 'Worse: warm room, rich food, evening, twilight, rest. Better: open air, cold applications, consolation, gentle motion.', desiresAversions: 'Desires: cold drinks, sweets, butter, cream. Aversion: fat, warm food, meat.', thermalState: 'Warm', sleepDreams: 'Sleeps with hands above head. Dreams of being pursued, falling. Nightmares in children.', miasmaticTendency: 'Psora + Sycosis', keynotes: 'Weeping + Thirstless + Changeable + Wants consolation + Better open air', remedyRelationships: 'Complementary: Silicea, Natrum Mur. Inimical: Causticum. Follows well: Lycopodium, Sulphur.', compareRemedies: 'Natrum Mur, Ignatia, Sepia, Staphysagria', clinicalUses: 'Common cold, sinusitis, otitis media, PCOS, menstrual irregularities, varicose veins, depression' },
      { name: 'Sulphur', sourceAuthors: 'Boericke, Kent, Hahnemann', essence: 'Philosophical, untidy, lazy — burning pains, skin conditions, heat', mentalGenerals: 'Philosophical, theoretical. Aversion to bathing, untidy. Lazy, sluggish. Selfish yet sensitive. Optimistic despite problems. Intellectual type.', physicalGenerals: 'Hot patient. Burning pains everywhere. Skin conditions — dry, itching, scratching until bleeding. Standing aggravates. Flushes of heat.', modalities: 'Worse: bathing, standing, heat, wool, morning. Better: drawing up feet, dry weather, lying on right side.', desiresAversions: 'Desires: sweets, spicy, fat, alcohol. Aversion: milk, eggs, meat.', thermalState: 'Hot', sleepDreams: 'Late falling asleep. Wakes at 3 AM. Dreams of falling, fire, religious themes.', miasmaticTendency: 'Psora (King of Anti-psorics)', keynotes: 'Burning + Hot + Untidy + Philosophical + Standing aggravates + Skin itching', remedyRelationships: 'Complementary: Aconite, Nux Vomica. Inimical: Calcarea Carb. Follows well: Lycopodium, Pulsatilla.', compareRemedies: 'Calcarea Carb, Lycopodium, Aconite, Arsenicum', clinicalUses: 'Skin diseases, eczema, psoriasis, hemorrhoids, constipation, headaches, hot flashes' },
      { name: 'Arsenicum Album', sourceAuthors: 'Boericke, Kent, Hahnemann', essence: 'Anxious, restless, fastidious — burning pains relieved by heat, fear of death', mentalGenerals: 'Great anxiety, restlessness. Fear of death, being alone, robbers. Fastidious, meticulous. Despair, hopelessness. Mentally restless.', physicalGenerals: 'Chilly patient. Burning pains relieved by heat. Weakness after slightest exertion. Discharges acrid, thin, excoriating. Edema.', modalities: 'Worse: cold, midnight (1-2 AM), alone, damp. Better: heat, warm drinks, company, resting head high.', desiresAversions: 'Desires: warm drinks, sour, fat, sweets. Aversion: meat, butter, coffee.', thermalState: 'Chilly', sleepDreams: 'Wakes at midnight with anxiety. Dreams of death, fire, robbers. Restless sleep.', miasmaticTendency: 'Psora + Syphilis', keynotes: 'Burning + Chilly + Anxious + Restless + Fear of death + Better heat', remedyRelationships: 'Complementary: Phosphorus, Carbo Veg. Inimical: Pulsatilla. Follows well: Sulphur, Calcarea.', compareRemedies: 'Phosphorus, Carbo Veg, Secale, Veratrum Album', clinicalUses: 'Food poisoning, asthma, anxiety disorders, fever, eczema, gastritis, cancer support' },
      { name: 'Belladonna', sourceAuthors: 'Boericke, Kent, Hahnemann', essence: 'Sudden, violent — hot, red, throbbing. Right-sided affinity', mentalGenerals: 'Sudden onset. Violent, aggressive. Delirium, hallucinations. Biting, striking. Fear of dogs. Confusion, wildness.', physicalGenerals: 'Hot, red, flushed face. Throbbing, pulsating pains. Dilated pupils. Dry skin with radiating heat. Right-sided affinity.', modalities: 'Worse: touch, jarring, light, noise, afternoon, lying down. Better: rest, dark room, standing, cold applications.', desiresAversions: 'Desires: lemons, sour drinks, sweets. Aversion: water, meat.', thermalState: 'Hot', sleepDreams: 'Sleepy but cannot sleep. Starts in sleep. Dreams of falling, being bitten by dogs.', miasmaticTendency: 'Psora + Sycosis', keynotes: 'Sudden + Hot + Red + Throbbing + Right-sided + Violent', remedyRelationships: 'Complementary: Calcarea Carb, Nux Vomica. Inimical: Dulcamara. Follows well: Bryonia, Mercurius.', compareRemedies: 'Aconite, Glonoine, Stramonium, Opium', clinicalUses: 'High fever, meningitis, otitis media, tonsillitis, migraine, sunstroke, convulsions' },
      { name: 'Calcarea Carbonica', sourceAuthors: 'Boericke, Kent, Hahnemann', essence: 'Obstinate, anxious — chilly, perspires easily, craves eggs, fears', mentalGenerals: 'Obstinate, fixed opinions. Anxiety about health, fear of insanity. Forgetful, confused. Hard worker but slow. Fears others will observe their confusion.', physicalGenerals: 'Chilly, perspires easily especially on head. Large, flabby person. Craves eggs, indigestible things. Sour sweat. Slow development in children.', modalities: 'Worse: cold, damp, exertion, ascending, milk, full moon. Better: dry weather, lying on painful side, constipation.', desiresAversions: 'Desires: eggs, sweets, indigestible things (chalk, dirt). Aversion: meat, milk, fat.', thermalState: 'Chilly', sleepDreams: 'Sleeps with hands above head. Night terrors in children. Dreams of monsters, being pursued.', miasmaticTendency: 'Psora + Sycosis + Syphilis', keynotes: 'Chilly + Perspires head + Craves eggs + Obstinate + Fear of insanity + Sour sweat', remedyRelationships: 'Complementary: Belladonna, Rhus Tox. Inimical: Sulphur. Follows well: Lycopodium, Phosphorus.', compareRemedies: 'Sulphur, Lycopodium, Baryta Carb, Silicea', clinicalUses: 'Growth disorders, delayed milestones, tonsillitis, osteoporosis, anxiety disorders, obesity' },
      { name: 'Lycopodium', sourceAuthors: 'Boericke, Kent, Hahnemann', essence: 'Lack of self-confidence, brain fag — right-sided, digestive weakness, anticipatory anxiety', mentalGenerals: 'Lack of self-confidence but compensates with bravado. Anticipatory anxiety. Brain fag. Dictatorial at home, timid outside. Fear of failure.', physicalGenerals: 'Right-sided affinity. Digestive weakness, bloating. Premature aging and graying. Urinary complaints. Weakness of lower limbs.', modalities: 'Worse: right side, 4-8 PM, warm food, tight clothing. Better: warm drinks, uncovering, movement.', desiresAversions: 'Desires: sweets, warm drinks, oysters. Aversion: bread, warm food, cabbage.', thermalState: 'Chilly', sleepDreams: 'Wakes unrefreshed. Dreams of falling, being pursued. Night terrors.', miasmaticTendency: 'Psora + Sycosis + Syphilis', keynotes: 'Right-sided + Lack of confidence + 4-8 PM + Bloating + Anticipatory anxiety', remedyRelationships: 'Complementary: Iodum, Lachesis. Inimical: Apis Mellifica. Follows well: Sulphur, Calcarea.', compareRemedies: 'Sulphur, Calcarea Carb, Pulsatilla, Nux Vomica', clinicalUses: 'Liver disorders, urinary complaints, ED, anxiety, IBS, hair loss, right-sided sciatica' },
      { name: 'Natrum Muriaticum', sourceAuthors: 'Boericke, Kent, Hahnemann', essence: 'Grief, silent suffering — consolation aggravates, craving for salt, emaciation', mentalGenerals: 'Grief, suppressed emotions. Consolation aggravates. Dwells on past hurts. Introverted. Builds walls around emotions. Romantic but rejected.', physicalGenerals: 'Emaciation despite eating well. Craves salt. Thirsty for cold water. Mapping tongue. Post-nasal drip. Herpetic eruptions.', modalities: 'Worse: heat, sun, consolation, 10-11 AM, mental exertion. Better: open air, cold bathing, rest, sweating.', desiresAversions: 'Desires: salt, sour, fish, bitter things. Aversion: bread, fats, warm food.', thermalState: 'Hot', sleepDreams: 'Dreams of robbers, being pursued. Sleeps on right side. Wakes feeling unrefreshed.', miasmaticTendency: 'Psora + Sycosis', keynotes: 'Grief + Consolation aggravates + Craves salt + Emaciation + Mapping tongue', remedyRelationships: 'Complementary: Apis, Ignatia. Inimical: Silver nitrate. Follows well: Pulsatilla, Sepia.', compareRemedies: 'Ignatia, Pulsatilla, Sepia, Staphysagria', clinicalUses: 'Depression, migraine, herpes, anemia, post-nasal drip, PCOS, grief counseling' },
      { name: 'Phosphorus', sourceAuthors: 'Boericke, Kent, Hahnemann', essence: 'Tall, slender, nervous — burning, hemorrhagic tendency, desire for cold water', mentalGenerals: 'Excitable, impressionable. Fear of dark, thunderstorms. Sympathetic, clairvoyant. Desires company. Quick perception but weak memory.', physicalGenerals: 'Tall, slender, narrow chest. Burning sensations. Hemorrhagic tendency. Thirsty for very cold water. Vomiting as soon as water becomes warm. Left-sided.', modalities: 'Worse: twilight, cold, thunderstorms, lying on left side. Better: cold water, sleep, rubbing, darkness.', desiresAversions: 'Desires: cold water, salt, spicy, sweets, ice. Aversion: warm food, meat, sweets (sometimes).', thermalState: 'Hot', sleepDreams: 'Frightful dreams. Wakes feeling scared. Sleeps on right side.', miasmaticTendency: 'Psora + Sycosis + Syphilis', keynotes: 'Burning + Hemorrhagic + Cold water desire + Left-sided + Tall slender + Sympathetic', remedyRelationships: 'Complementary: Arsenicum, Calcarea Carb. Inimical: Causticum. Follows well: Sulphur, Nux Vomica.', compareRemedies: 'Arsenicum, Sulphur, Tuberculinum, Lycopodium', clinicalUses: 'Pneumonia, GI bleeding, anxiety, diabetes, liver disease, hair loss, nosebleeds' },
      { name: 'Sepia', sourceAuthors: 'Boericke, Kent, Hahnemann', essence: 'Worn-out, indifferent — sallow, bearing-down sensation, worse from exertion', mentalGenerals: 'Indifferent to loved ones. Averse to sex, company, work. Worn-out, dragged down. Irritable when spoken to. Sadness with weeping.', physicalGenerals: 'Sallow complexion. Bearing-down sensation as if everything would escape. Prolapsus. Chilly but better from violent exercise. Menopausal complaints.', modalities: 'Worse: morning, cold, damp, exertion, before menses, milk. Better: violent exercise, warmth, company, sleep.', desiresAversions: 'Desires: sweets, sour, vinegar, pickles. Aversion: meat, fat, milk.', thermalState: 'Chilly', sleepDreams: 'Frightful dreams. Wakes with sinking feeling. Dreams of falling.', miasmaticTendency: 'Psora + Sycosis', keynotes: 'Indifferent + Bearing-down + Sallow + Worn-out + Better violent exercise', remedyRelationships: 'Complementary: Nux Vomica, Spongia. Inimical: Lachesis. Follows well: Pulsatilla, Natrum Mur.', compareRemedies: 'Pulsatilla, Natrum Mur, Lycopodium, Murex', clinicalUses: 'Prolapse, menopause, postpartum depression, PMS, constipation, migraines, fatigue' },
    ];

    for (const r of remedies) {
      const existing = await db.remedy.findUnique({ where: { name: r.name } });
      if (!existing) {
        await db.remedy.create({ data: r });
      }
    }

    // Seed Rubrics
    const nuxV = await db.remedy.findUnique({ where: { name: 'Nux Vomica' } });
    const puls = await db.remedy.findUnique({ where: { name: 'Pulsatilla' } });
    const sulph = await db.remedy.findUnique({ where: { name: 'Sulphur' } });
    const ars = await db.remedy.findUnique({ where: { name: 'Arsenicum Album' } });
    const bell = await db.remedy.findUnique({ where: { name: 'Belladonna' } });

    const rubrics = [
      { remedyId: nuxV?.id, chapter: 'Mind', name: 'Irritability', grade: 3, synonyms: 'Anger, Snappish, Quarrelsome', relatedRubrics: 'Anger from noise; Quarrelsome with family' },
      { remedyId: nuxV?.id, chapter: 'Mind', name: 'Hurry', grade: 2, synonyms: 'Haste, Time-conscious, Impatient', relatedRubrics: 'Hurry while eating; Impatient with slow people' },
      { remedyId: nuxV?.id, chapter: 'Stomach', name: 'Nausea', grade: 3, synonyms: 'Sickness, Queasiness', relatedRubrics: 'Nausea in morning; Nausea after eating' },
      { remedyId: puls?.id, chapter: 'Mind', name: 'Weeping, consolation ameliorates', grade: 3, synonyms: 'Crying, tearful, wants sympathy', relatedRubrics: 'Weeping when spoken to; Cries with consolation' },
      { remedyId: puls?.id, chapter: 'Generalities', name: 'Better open air', grade: 3, synonyms: 'Ameliorated in fresh air', relatedRubrics: 'Better walking in open air; Wants windows open' },
      { remedyId: sulph?.id, chapter: 'Skin', name: 'Itching', grade: 3, synonyms: 'Pruritus, scratching', relatedRubrics: 'Itching scratching until bleeding; Itching without eruption' },
      { remedyId: sulph?.id, chapter: 'Generalities', name: 'Burning', grade: 3, synonyms: 'Heat, fire sensation', relatedRubrics: 'Burning in soles; Burning in palms' },
      { remedyId: ars?.id, chapter: 'Mind', name: 'Anxiety', grade: 3, synonyms: 'Fear, worry, apprehension', relatedRubrics: 'Anxiety about health; Fear of death with anxiety' },
      { remedyId: ars?.id, chapter: 'Generalities', name: 'Chilly', grade: 3, synonyms: 'Coldness, wants warmth', relatedRubrics: 'Chilly even in warm room; Wants to be covered' },
      { remedyId: bell?.id, chapter: 'Fever', name: 'Heat, sudden', grade: 3, synonyms: 'Sudden fever, high temperature', relatedRubrics: 'Fever with red face; Sudden onset of heat' },
      { remedyId: bell?.id, chapter: 'Head', name: 'Pain, throbbing', grade: 3, synonyms: 'Pulsating headache, hammering', relatedRubrics: 'Throbbing worse from jarring; Pulsating in temples' },
    ];

    for (const rub of rubrics) {
      if (rub.remedyId) {
        const existing = await db.rubric.findFirst({ where: { remedyId: rub.remedyId, name: rub.name, chapter: rub.chapter } });
        if (!existing) {
          await db.rubric.create({ data: rub as any });
        }
      }
    }

    // Seed Therapeutics
    const therapeutics = [
      { disease: 'Migraine', description: 'Severe recurring headache, often unilateral, with nausea and sensitivity to light and sound.', remedies: 'Nux Vomica (stress-related), Pulsatilla (hormonal), Belladonna (throbbing), Iris Versicolor (visual aura), Sanguinaria (right-sided)', rubrics: 'Head; Pain; Migraine, Head; Pain; Throbbing', notes: 'Consider trigger factors — stress, food, hormonal cycle.', tags: 'headache,migraine,neurology' },
      { disease: 'Asthma', description: 'Chronic respiratory condition with wheezing, breathlessness and cough.', remedies: 'Arsenicum Album (midnight, anxious), Antim Tart (rattling cough), Ipecac (constant nausea with asthma), Natrum Sulph (damp weather)', rubrics: 'Respiration; Asthmatic, Chest; Oppression', notes: 'Assess miasmatic background and constitutional remedy.', tags: 'respiratory,asthma,breathing' },
      { disease: 'Eczema', description: 'Inflammatory skin condition with itching, redness, and vesicular eruptions.', remedies: 'Sulphur (burning, itching), Graphites (sticky discharge), Mezereum (intolerable itching), Arsenicum (dry, scaly)', rubrics: 'Skin; Eruptions; Eczema, Skin; Itching', notes: 'Look for suppressed eczema history and miasmatic tendency.', tags: 'skin,eczema,dermatology' },
      { disease: 'PCOS', description: 'Polycystic ovarian syndrome with irregular periods, hirsutism, weight gain.', remedies: 'Pulsatilla (late, scanty menses), Sepia (indifferent, bearing down), Lycopodium (right ovarian), Calcarea Carb (obesity with PCOS)', rubrics: 'Female; Menses; Late, Female; Menses; Scanty', notes: 'Consider hormonal profile, thyroid function, insulin resistance.', tags: 'gynecology,pcos,hormonal' },
      { disease: 'Anxiety Disorder', description: 'Excessive worry, restlessness, palpitations, and fear affecting daily life.', remedies: 'Arsenicum Album (anxiety with fear of death), Aconite (sudden panic), Ignatia (grief-related), Natrum Mur (suppressed emotions)', rubrics: 'Mind; Anxiety, Mind; Fear', notes: 'Explore emotional etiology — grief, fright, disappointment.', tags: 'psychiatry,anxiety,mental' },
      { disease: 'Gastritis', description: 'Inflammation of stomach lining causing pain, nausea, and bloating.', remedies: 'Nux Vomica (from stress, spices), Pulsatilla (from rich food), Arsenicum (burning pain), Carbo Veg (bloating, belching)', rubrics: 'Stomach; Inflammation, Stomach; Pain; Burning', notes: 'Consider dietary habits, stress levels, and medication history.', tags: 'gastroenterology,gastritis,stomach' },
    ];

    for (const t of therapeutics) {
      const existing = await db.therapeutic.findFirst({ where: { disease: t.disease } });
      if (!existing) {
        await db.therapeutic.create({ data: t });
      }
    }

    // Seed Clinical Cases
    const cases = [
      { title: 'Chronic Migraine with Anxiety', caseHistory: 'A 35-year-old male software engineer with chronic migraine for 5 years. Headache every morning, worse from mental strain, coffee, and lack of sleep. Very irritable with colleagues. Takes painkillers daily.', characteristicSymptoms: 'Morning headache, irritable, oversensitive to noise, constipation, chilly, sedentary lifestyle', rubricsUsed: 'Head; Pain; Morning, Mind; Irritability, Stomach; Nausea, Generalities; Chilly', remediesConsidered: 'Nux Vomica, Sanguinaria, Iris Versicolor, Bryonia', finalRemedy: 'Nux Vomica 200C — single dose', followUpNotes: 'After 1 week: Headache frequency reduced from daily to 2-3/week. Irritability much better. After 1 month: Headache 1-2/month. No painkillers needed. Sleep improved. Constipation resolved.' },
      { title: 'Recurrent Tonsillitis in Child', caseHistory: 'A 7-year-old girl with recurrent tonsillitis every 2 months for 2 years. High fever, red swollen tonsils, worse from cold drinks. Mild, weeping child who wants mother near. Thirstless.', characteristicSymptoms: 'Weeping, wants consolation, thirstless, worse warm room, better open air, thick yellow-green discharge', rubricsUsed: 'Throat; Inflammation; Tonsils, Mind; Weeping, Generalities; Better open air, Stomach; Thirstless', remediesConsidered: 'Pulsatilla, Belladonna, Mercurius, Baryta Carb', finalRemedy: 'Pulsatilla 30C — 3 doses over 1 week, then constitutional', followUpNotes: 'After 2 weeks: Acute episode resolved without antibiotics. After 6 months: No recurrence. General health improved. Changed to Pulsatilla 200C constitutional.' },
      { title: 'Eczema with Anxiety', caseHistory: 'A 28-year-old female with eczema on hands and feet for 3 years. Intolerable itching, scratching until bleeding. Hot patient, worse from bathing, standing. Philosophical, untidy. Skin dry, rough with excoriations.', characteristicSymptoms: 'Burning itching, hot patient, worse bathing, worse standing, untidy, philosophical, skin scratching until bleeding', rubricsUsed: 'Skin; Itching, Skin; Eruptions; Eczema, Generalities; Hot, Generalities; Worse bathing', remediesConsidered: 'Sulphur, Arsenicum Album, Mezereum, Graphites', finalRemedy: 'Sulphur 200C — single dose', followUpNotes: 'After 2 weeks: Itching reduced 50%. After 1 month: Eczema improving significantly. No new eruptions. After 3 months: Skin nearly clear. Follow-up with Sulphur 1M.' },
    ];

    for (const c of cases) {
      const existing = await db.clinicalCase.findFirst({ where: { title: c.title } });
      if (!existing) {
        await db.clinicalCase.create({ data: c });
      }
    }

    // Seed Disease Templates
    const diseaseTemplates = [
      { name: 'Migraine', importantQuestions: 'Onset time? Unilateral or bilateral? Aura present? Triggers? Associated nausea/vomiting? Worse from light/sound? Family history?', characteristicSymptoms: 'Throbbing pain, unilateral, nausea, photophobia, phonophobia, visual aura', commonRubrics: 'Head; Pain; Throbbing, Head; Pain; One-sided, Stomach; Nausea', commonRemedies: 'Nux Vomica, Belladonna, Sanguinaria, Iris Versicolor, Pulsatilla, Spigelia', tags: 'headache,neurology,migraine' },
      { name: 'Asthma', importantQuestions: 'Time of onset? Seasonal pattern? Trigger factors? Family history of atopy? Position that relieves? Expectoration type?', characteristicSymptoms: 'Wheezing, dyspnea, chest tightness, cough worse at night, orthopnea', commonRubrics: 'Respiration; Asthmatic, Respiration; Difficult, Chest; Oppression', commonRemedies: 'Arsenicum Album, Antim Tart, Ipecac, Natrum Sulph, Blatta Orientalis', tags: 'respiratory,asthma,chronic' },
      { name: 'Eczema', importantQuestions: 'Itching type? Worse when? Discharge type? Location? Past history of suppression? Family history of atopy? Thermal state?', characteristicSymptoms: 'Itching, redness, vesicles, oozing, crusting, dry/scaly skin', commonRubrics: 'Skin; Itching, Skin; Eruptions; Eczema, Skin; Dry', commonRemedies: 'Sulphur, Graphites, Mezereum, Arsenicum Album, Petroleum', tags: 'skin,eczema,dermatology' },
    ];

    for (const dt of diseaseTemplates) {
      const existing = await db.diseaseTemplate.findFirst({ where: { name: dt.name } });
      if (!existing) {
        await db.diseaseTemplate.create({ data: dt });
      }
    }

    // Seed Miasm Notes
    const miasmNotes = [
      { miasm: 'Psora', title: 'The Psoric Miasm — Mother of All Diseases', description: 'Psora is considered the fundamental miasm in homeopathy. Hahnemann described it as the "mother of all chronic diseases." It represents the underlying susceptibility to disease, manifesting as functional disturbances before structural changes occur. Psoric symptoms include itching, skin eruptions, anxiety, and general hypersensitivity. Key psoric remedies include Sulphur, Psorinum, and Calcarea Carb.', remedies: 'Sulphur, Psorinum, Calcarea Carb, Lycopodium, Graphites', notes: 'Psora is the most common miasm. Almost every chronic disease has a psoric component.' },
      { miasm: 'Sycosis', title: 'The Sycotic Miasm — Overgrowth and Excess', description: 'Sycosis is characterized by overgrowth, excess, and infiltration. It manifests as warts, tumors, overproduction of discharges, and mental rigidity or fixed ideas. Sycotic patients tend to be secretive, suspicious, and may have a religious fanaticism. Physical manifestations include condylomata, fig warts, and overgrowth of tissues. Key sycotic remedies include Medorrhinum, Thuja, and Nitric Acid.', remedies: 'Medorrhinum, Thuja, Nitric Acid, Causticum, Sarsaparilla', notes: 'Sycosis often coexists with Psora. History of gonorrhea or its suppression is a key indicator.' },
      { miasm: 'Syphilis', title: 'The Syphilitic Miasm — Destruction and Ulceration', description: 'The syphilitic miasm is characterized by destruction, ulceration, and tissue breakdown. It manifests as deep-seated ulcerations, bone pain worse at night, and structural deformities. Mentally, there is despair, hopelessness, and destructive tendencies. Night pains are a hallmark. Key syphilitic remedies include Mercurius, Syphilinum, and Aurum.', remedies: 'Mercurius, Syphilinum, Aurum, Arsenicum Album, Nitric Acid', notes: 'Syphilitic miasm is indicated by night pains, destruction, and deep pathology.' },
      { miasm: 'Tubercular', title: 'The Tubercular Miasm — Wasting and Restlessness', description: 'The tubercular miasm (also called pseudo-psora) combines elements of psora and syphilis. It is characterized by wasting, weakness, and a constant desire for change and travel. These patients are typically tall, slender, and artistic. They have recurrent respiratory infections and a tendency toward emaciation despite good appetite. Key tubercular remedies include Tuberculinum, Phosphorus, and Calcarea Phos.', remedies: 'Tuberculinum, Phosphorus, Calcarea Phos, Baryta Carb, Bacillinum', notes: 'The tubercular miasm often presents with a history of TB in the family. These patients need constant change and are dissatisfied with everything.' },
    ];

    for (const mn of miasmNotes) {
      const existing = await db.miasmNote.findFirst({ where: { miasm: mn.miasm, title: mn.title } });
      if (!existing) {
        await db.miasmNote.create({ data: mn });
      }
    }

    // Seed BHMS Notes
    const bhmsNotes = [
      { subject: 'Organon', topic: 'Vital Force', content: 'The vital force (dynamis) is the spiritual energy that animates the material body. In health, it maintains harmonious functioning. Disease is a dynamic disturbance of this force. Hahnemann describes it in Aphorisms 9-16 of the Organon. Understanding vital force is crucial for comprehending homeopathic philosophy and the dynamic action of remedies.', tags: 'organon,vital-force,philosophy' },
      { subject: 'Organon', topic: 'Similia Similibus Curantur', content: 'The fundamental principle of homeopathy: "Like cures Like." A substance that can produce symptoms in a healthy person can cure similar symptoms in a sick person. This principle was first observed by Hahnemann with Cinchona bark (producing malaria-like symptoms) and later confirmed through hundreds of provings.', tags: 'organon,similia,law-of-cure' },
      { subject: 'Materia Medica', topic: 'Drug Proving', content: 'Drug proving is the systematic process of administering a substance to healthy individuals to observe the symptoms it produces. Hahnemann was the first to develop this method. Proving symptoms are recorded in the Materia Medica Pura. Only proven symptoms should be used for prescription. The proving should be done on healthy, sensitive individuals of both sexes.', tags: 'materia-medica,proving,methodology' },
      { subject: 'Materia Medica', topic: 'Keynote Prescribing', content: 'Keynote prescribing involves selecting a remedy based on its unique, characteristic symptoms that differentiate it from other remedies. Keynotes are the most prominent, peculiar, and individualizing symptoms. Example: "Burning relieved by heat" is a keynote of Arsenicum Album. Keynotes should be used alongside the totality of symptoms.', tags: 'materia-medica,keynote,prescribing' },
      { subject: 'Repertory', topic: 'Repertorization Process', content: 'Repertorization is the systematic process of converting patient symptoms into rubric language and finding the remedy that covers the maximum rubrics. Steps: 1) Take the case, 2) Identify characteristic symptoms, 3) Convert to rubrics, 4) Repertorize using a repertory, 5) Consider the Materia Medica, 6) Select the simillimum.', tags: 'repertory,repertorization,method' },
      { subject: 'Pathology', topic: 'Miasms in Homeopathy', content: 'Hahnemann identified three chronic miasms: Psora, Sycosis, and Syphilis. Later, the Tubercular miasm was added. Miasms are fundamental chronic disease tendencies that underlie all chronic conditions. Understanding the dominant miasm helps in selecting the constitutional remedy and managing chronic cases effectively.', tags: 'pathology,miasms,chronic-disease' },
    ];

    for (const bn of bhmsNotes) {
      const existing = await db.bHMSNote.findFirst({ where: { subject: bn.subject, topic: bn.topic } });
      if (!existing) {
        await db.bHMSNote.create({ data: bn });
      }
    }

    // Seed Question Bank
    const questions = [
      { type: 'MCQ', subject: 'Organon', question: 'Which aphorism describes the "highest ideal of cure"?', options: 'Aphorism 1|Aphorism 2|Aphorism 3|Aphorism 4', answer: 'Aphorism 2', explanation: 'Aphorism 2 states: "The highest ideal of cure is rapid, gentle and permanent restoration of the health."', tags: 'organon,aphorism,cure' },
      { type: 'MCQ', subject: 'Materia Medica', question: 'Which remedy is known as the "King of Anti-psorics"?', options: 'Arsenicum Album|Sulphur|Calcarea Carb|Lycopodium', answer: 'Sulphur', explanation: 'Sulphur is called the King of Anti-psorics because of its deep anti-psoric action.', tags: 'materia-medica,sulphur,psora' },
      { type: 'MCQ', subject: 'Materia Medica', question: 'Consolation ameliorates symptoms in which remedy?', options: 'Nux Vomica|Pulsatilla|Sulphur|Arsenicum Album', answer: 'Pulsatilla', explanation: 'Pulsatilla patients are mild and weeping — they feel better when consoled. This is in contrast to Natrum Mur where consolation aggravates.', tags: 'materia-medica,pulsatilla,mind' },
      { type: 'MCQ', subject: 'Repertory', question: 'Who authored the "Repertory of the Materia Medica"?', options: 'Hahnemann|Boericke|Kent|Clarke', answer: 'Kent', explanation: 'James Tyler Kent authored the Repertory of the Materia Medica, which is the most widely used repertory in homeopathy.', tags: 'repertory,kent,authors' },
      { type: 'Viva', subject: 'Organon', question: 'Explain the concept of Vital Force as described by Hahnemann.', options: null, answer: 'The vital force is a spiritual, dynamic energy that animates the material body. In health, it maintains harmonious functioning. Disease is a dynamic derangement of this force. Only dynamic remedies can restore it.', explanation: null, tags: 'organon,vital-force,viva' },
      { type: 'Viva', subject: 'Materia Medica', question: 'What are the key differences between Nux Vomica and Pulsatilla in their mental symptoms?', options: null, answer: 'Nux Vomica: Irritable, quarrelsome, oversensitive, chilly, worse morning. Pulsatilla: Mild, weeping, yielding, wants consolation, warm, thirstless, worse warm room.', explanation: null, tags: 'materia-medica,comparison,viva' },
      { type: 'University', subject: 'Organon', question: 'Discuss the concept of miasms as described by Hahnemann in The Chronic Diseases. (10 marks)', options: null, answer: null, explanation: 'Key points: 1) Definition of miasm, 2) Three chronic miasms (Psora, Sycosis, Syphilis), 3) Psora as fundamental, 4) Symptoms of each, 5) Anti-miasmatic treatment, 6) Clinical significance.', tags: 'organon,miasms,university,essay' },
      { type: 'MCQ', subject: 'Materia Medica', question: 'Burning pains relieved by heat is the keynote of which remedy?', options: 'Sulphur|Nux Vomica|Arsenicum Album|Pulsatilla', answer: 'Arsenicum Album', explanation: 'Arsenicum Album has burning pains that are paradoxically relieved by heat. This is one of its most characteristic keynotes, distinguishing it from Sulphur whose burning is worse from heat.', tags: 'materia-medica,arsenicum,burning' },
    ];

    for (const q of questions) {
      const existing = await db.questionBank.findFirst({ where: { type: q.type, subject: q.subject, question: q.question } });
      if (!existing) {
        await db.questionBank.create({ data: q });
      }
    }

    return NextResponse.json({ message: 'Library seeded successfully' });
  } catch (error) {
    console.error('Library seed error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to seed library', detail: msg }, { status: 500 });
  }
}
