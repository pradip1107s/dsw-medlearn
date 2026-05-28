#!/usr/bin/env python3
"""
Seed Boericke's Materia Medica data directly into the PostgreSQL database.
Reads from the parsed JSON file and upserts all remedy data.
"""

import json
import psycopg2
import psycopg2.extras
import re
import sys
from datetime import datetime

# Database connection
DB_URL = 'postgresql://neondb_owner:npg_gqtzX7fSF5bA@ep-holy-cell-aouw205c.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'

# Load parsed remedies
with open('/home/z/my-project/upload/boericke_remedies.json', 'r', encoding='utf-8') as f:
    remedies = json.load(f)

print(f"Loaded {len(remedies)} remedies from JSON")

# Name normalization mapping - PDF text extraction artifacts
NAME_FIXES = {
    'ABAL SERRULATA': 'SABAL SERRULATA',
    'ABINA': 'SABINA',
    'ABADILLA': 'SABADILLA',
    'ACCHARUM OFFICINALE': 'SACCHARUM OFFICINALE',
    'ABAL SERRULATA': 'SABAL SERRULATA',
    'ACONITUM NAPELLU': 'ACONITUM NAPELLUS',
    'ADONIS VERNALI': 'ADONIS VERNALIS',
    'AETHIOPS MINERALI': 'AETHIOPS MINERALIS',
    'AGNUS CASTU': 'AGNUS CASTUS',
    'ALIX NIGRA': 'SALIX NIGRA',
    'ALVIA OFFICINALI': 'SALVIA OFFICINALIS',
    'AMBUCUS NIGRA': 'SAMBUCUS NIGRA',
    'ANGUINARIA CANADENSI': 'SANGUINARIA CANADENSIS',
    'ANGUINARINUM NITRICUM': 'SANGUINARINUM NITRICUM',
    'APIS MELLIFICA': 'APIS MELLIFICA',
    'APONARIA OFFICINALI': 'SAPONARIA OFFICINALIS',
    'ARAGALLUS LAMBERTI': 'ARAGALLUS LAMBERTI',
    'ARSAPARILLA OFFICINALI': 'SARSAPARILLA OFFICINALIS',
    'ARTEMISIA VULGARI': 'ARTEMISIA VULGARIS',
    'ARUNDO MAURITANICA': 'ARUNDO MACHALATA',
    'ASA FOETIDA': 'ASAFETIDA',
    'ASCLEPIAS CORNUTI': 'ASCLEPIAS CORNUTI',
    'AROTHAMNUS SCOPARIU': 'SPARTIUM SCOPARIUM',
    'ARRACENIA PURPUREA': 'SARRACENIA PURPUREA',
    'BELLIS PERENNI': 'BELLIS PERENNIS',
    'BERBERIS VULGARI': 'BERBERIS VULGARIS',
    'BOTHROPS LANCEOLATU': 'BOTHROPS LANCEOLATUS',
    'CACTUS GRANDIFLORU': 'CACTUS GRANDIFLORUS',
    'CEREUS BONPLANDII': 'CEREUS BONPLANDII',
    'CHAMOMILLA': 'CHAMOMILLA',
    'CHELIDONIUM MAJU': 'CHELIDONIUM MAJUS',
    'CHINA OFFICINALI': 'CHINA OFFICINALIS',
    'CIMEX LECTULARIU': 'CIMEX LECTULARIUS',
    'CINA MARITIMA': 'CINA',
    'CINNABARI': 'CINNABARIS',
    'CISTUS CANADENSI': 'CISTUS CANADENSIS',
    'COCCULUS INDICU': 'COCCULUS INDICUS',
    'COLOCYNTHI': 'COLOCYNTHIS',
    'CONIUM MACULATUM': 'CONIUM MACULATUM',
    'CROCUS SATIVU': 'CROCUS SATIVUS',
    'CROTALUS HORRIDU': 'CROTALUS HORRIDUS',
    'CROTOPHORIUS VIRENS': 'CROTOPHORIUS VIRENS',
    'DIGITALIS PURPUREA': 'DIGITALIS PURPUREA',
    'DIOSCOREA VILLOSA': 'DIOSCOREA VILLOSA',
    'DROSERA ROTUNDIFOLIA': 'DROSERA ROTUNDIFOLIA',
    'DUBOISIA MYOPOROIDE': 'DUBOISIA MYOPOROIDES',
    'ECALE CORNUTUM': 'SECALE CORNUTUM',
    'ELAPS CORALLINU': 'ELAPS CORALLINUS',
    'ELENIUM METALLICUM': 'SELENIUM METALLICUM',
    'EMPERVIVUM TECTORUM': 'SEMPERVIVUM TECTORUM',
    'ENECIO AUREU': 'SENECIO AUREUS',
    'ENEGA': 'SENEGA',
    'ENNA': 'SENNA',
    'EPIA OFFICINALI': 'SPIGELIA OFFICINALIS',
    'EUCALYPTUS GLOBULU': 'EUCALYPTUS GLOBULUS',
    'FILIX MA': 'FILIX MAS',
    'FUCUS VESICULOSU': 'FUCUS VESICULOSUS',
    'GELSEMIUM SEMPERVIREN': 'GELSEMIUM SEMPERVIRENS',
    'GETTYSBURG WATER': 'GETTYSBURG WATER',
    'GLONOINUM': 'GLONOINUM',
    'GRAPHITE': 'GRAPHITES',
    'GUACO': 'GUACO',
    'HEDEOMA PULEGIOIDE': 'HEDEOMA PULEGIOIDES',
    'HELIANTHUS ANNUU': 'HELIANTHUS ANNUUS',
    'HOMARU': 'HOMARUS',
    'HURA BRASILIENSI': 'HURA BRASILIENSIS',
    'HYDRANGEA ARBORESCEN': 'HYDRANGEA ARBORESCENS',
    'HYDROCYANICUM ACIDUM': 'HYDROCYANICUM ACIDUM',
    'HYDROCTYLE ASIATICA': 'HYDROCOTYLE ASIATICA',
    'ICTODES FOETIDA': 'ICTODES FOETIDA',
    'ILCEA TERRA': 'SILICEA TERRA',
    'ILPHIUM LACINATUM': 'SILPHIUM LACINATUM',
    'INAPIS NIGRA': 'SINAPIS NIGRA',
    'KALIUM ARSENICOSUM': 'KALI ARSENICOSUM',
    'KALIUM BICHROMICUM': 'KALI BICHROMICUM',
    'KALIUM BROMATUM': 'KALI BROMATUM',
    'KALIUM CARBONICUM': 'KALI CARBONICUM',
    'KALIUM CHLORICUM': 'KALI CHLORICUM',
    'KALIUM CYANATUM': 'KALI CYANATUM',
    'KALIUM IODATUM': 'KALI IODATUM',
    'KALIUM MURIATICUM': 'KALI MURIATICUM',
    'KALIUM NITRICUM': 'KALI NITRICUM',
    'KALIUM PERMANGANATUM': 'KALI PERMANGANATUM',
    'KALIUM PHOSPHORICUM': 'KALI PHOSPHORICUM',
    'KALIUM SILICICUM': 'KALI SILICICUM',
    'KALIUM SULPHURICUM': 'KALI SULPHURICUM',
    'LACHESIS MUTU': 'LACHESIS MUTUS',
    'LAPIS ALBU': 'LAPIS ALBUS',
    'LATRODECTUS MACTAN': 'LATRODECTUS MACTANS',
    'LAUROCERASU': 'LAUROCERASUS',
    'LEDUM PALUSTRE': 'LEDUM PALUSTRE',
    'LOBELIA INFLATA': 'LOBELIA INFLATA',
    'LOLIUM TEMULENTUM': 'LOLEUM TEMULENTUM',
    'LYCOPODIUM CLAVATUM': 'LYCOPODIUM CLAVATUM',
    'LYCOPUS VIRGINICU': 'LYCOPUS VIRGINICUS',
    'MAGNESIUM CARBONICUM': 'MAGNESIA CARBONICA',
    'MAGNESIUM MURIATICUM': 'MAGNESIA MURIATICA',
    'MAGNESIUM PHOSPHORICUM': 'MAGNESIA PHOSPHORICA',
    'MAGNESIUM SULPHURICUM': 'MAGNESIA SULPHURICA',
    'MEZEREUM': 'MEZEREUM',
    'MERCURIUS CORROSIVU': 'MERCURIUS CORROSIVUS',
    'MERCURIUS DULCI': 'MERCURIUS DULCIS',
    'MERCURIUS IODATUS FLAVU': 'MERCURIUS IODATUS FLAVUS',
    'MERCURIUS IODATUS RUBER': 'MERCURIUS IODATUS RUBER',
    'MERCURIUS SOLUBILI': 'MERCURIUS SOLUBILIS',
    'MERCURIUS SULPHURICU': 'MERCURIUS SULPHURICUS',
    'MILLEFOLIUM': 'MILLEFOLIUM',
    'MOSCHU': 'MOSCHUS',
    'MURIATICUM ACIDUM': 'MURIATICUM ACIDUM',
    'NAJA TRIPUDIAN': 'NAJA TRIPUDIANS',
    'NATRIUM ARSENICOSUM': 'NATRUM ARSENICOSUM',
    'NATRIUM CARBONICUM': 'NATRUM CARBONICUM',
    'NATRIUM HYPOCHLOROSUM': 'NATRUM HYPOCHLOROSUM',
    'NATRIUM MURIATICUM': 'NATRUM MURIATICUM',
    'NATRIUM NITRICUM': 'NATRUM NITRICUM',
    'NATRIUM PHOSPHORICUM': 'NATRUM PHOSPHORICUM',
    'NATRIUM SALICYLICUM': 'NATRUM SALICYLICUM',
    'NATRIUM SULPHURICUM': 'NATRUM SULPHURICUM',
    'NUX MOSCHATA': 'NUX MOSCHATA',
    'NUX VOMICA': 'NUX VOMICA',
    'OLANUM NIGRUM': 'SOLANUM NIGRUM',
    'OLEUM SANTALI': 'OLEUM SANTALI',
    'OLYMPUS AUREUS': 'SOLYDAGO VIRGAUREA',
    'ONOSMODIUM VIRGINIANUM': 'ONOSMODIUM VIRGINIANUM',
    'OPIUM': 'OPIUM',
    'ORNITHOGALUM UMBELLATUM': 'ORNITHOGALUM UMBELLATUM',
    'PAEONIA OFFICINALI': 'PAEONIA OFFICINALIS',
    'PASSIFLORA INCARNATA': 'PASSIFLORA INCARNATA',
    'PETROLEUM': 'PETROLEUM',
    'PHOSPHORU': 'PHOSPHORUS',
    'PHYTOLACCA DECANDRA': 'PHYTOLACCA DECANDRA',
    'PONGIA TOSTA': 'SPONGIA TOSTA',
    'PRIMULA OBCONICA': 'PRIMULA OBCONICA',
    'PSORINUM': 'PSORINUM',
    'PULSATILLA PRATENSI': 'PULSATILLA',
    'QUILLA MARITIMA': 'QUILLA MARITIMA',
    'RADIUM BROMATUM': 'RADIUM BROMATUM',
    'RANUNCULUS BULBOSU': 'RANUNCULUS BULBOSUS',
    'RANUNCULUS SCELERATU': 'RANUNCULUS SCELERATUS',
    'RAPHANUS SATIVU': 'RAPHANUS SATIVUS',
    'RHODODENDRON FERRUGINEUM': 'RHODODENDRON CHRYSANTHUM',
    'RHUS TOXICODENDRON': 'RHUS TOXICODENDRON',
    'RICINUS COMMUNI': 'RICINUS COMMUNIS',
    'RUMEX CRISPU': 'RUMEX CRISPUS',
    'RUTA GRAVEOLEN': 'RUTA GRAVEOLENS',
    'SECALE CORNUTUM': 'SECALE CORNUTUM',
    'SILICEA': 'SILICEA',
    'SPIGELIA ANTHELMIA': 'SPIGELIA ANTHELMIA',
    'STANNUM METALLICUM': 'STANNUM METALLICUM',
    'T. N. T.': 'TRINITROTOLUENUM',
    'TABACUM': 'TABACUM',
    'TANNUM METALLICUM': 'STANNUM METALLICUM',
    'TAPHYSAGRIA': 'STAPHYSAGRIA',
    'TARENTULA CUBENSI': 'TARENTULA CUBENSIS',
    'TARENTULA HISPANICA': 'TARENTULA HISPANICA',
    'TELLARIUM METALLICUM': 'TELLURIUM METALLICUM',
    'THUJA OCCIDENTALI': 'THUJA OCCIDENTALIS',
    'THYROIDINUM': 'THYROIDINUM',
    'TICTA PULMONARIA': 'STICTA PULMONARIA',
    'TIGMATA MAYDI': 'USTILAGO MAYDIS',
    'TILIA EUROPAEA': 'TILIA EUROPAEA',
    'TRAMONIUM': 'STRAMONIUM',
    'TRIFOLIUM PRATENSE': 'TRIFOLIUM PRATENSE',
    'TRILLIUM PENDULUM': 'TRILLIUM PENDULUM',
    'TRONTIUM CARBONICUM': 'STRONTIUM CARBONICUM',
    'TROPHANTHUS HISPIDU': 'STROPHANTHUS HISPIDUS',
    'TRYCHNINUM PHOSPHORICUM': 'STRYCHNINUM PHOSPHORICUM',
    'TRYCHNINUM PURUM': 'STRYCHNINUM PURUM',
    'TRYCHNOS GAULTHERIANA': 'STRYCHNOS GAULTHERIANA',
    'TUBERCULINUM': 'TUBERCULINUM',
    'UCCINUM': 'SUCCINUM',
    'ULFONALUM': 'SULFONALUM',
    'ULPHUR': 'SULPHUR',
    'ULPHUR IODATUM': 'SULPHUR IODATUM',
    'ULPHURICUM ACIDUM': 'SULPHURICUM ACIDUM',
    'ULPHUROSUM ACIDUM': 'SULPHUROSUM ACIDUM',
    'UMBULUS MOSCHATU': 'SUMBUL MOSCHATUS',
    'UPAS TIEUT': 'UPAS TIUTE',
    'URTICA UREN': 'URTICA URENS',
    'VALERIANA OFFICINALI': 'VALERIANA OFFICINALIS',
    'VERATRUM ALBUM': 'VERATRUM ALBUM',
    'VERBASCUM THAPSU': 'VERBASCUM THAPSUS',
    'VIBURNUM OPULU': 'VIBURNUM OPULUS',
    'VIPERA BERU': 'VIPERA BERUS',
    'WYETHIA HELENOIDE': 'WYETHIA HELENOIDES',
    'YMPHORICARPUS RACEMOSU': 'SYMPHORICARPUS RACEMOSUS',
    'YMPHYTUM OFFICINALE': 'SYMPHYTUM OFFICINALE',
    'YOHIMBINUM': 'YOHIMBINUM',
    'YPHILINUM': 'SYPHILINUM',
    'YZYGIUM JAMBOLANUM': 'SYZYGIUM JAMBOLANUM',
    'ZIZIA AUREA': 'ZIZIA AUREA',
    'ZINGIBER OFFICINALE': 'ZINGIBER OFFICINALE',
    'ZINCUM METALLICUM': 'ZINCUM METALLICUM',
}

# Standard name mappings (lowercase lookup)
STANDARD_NAMES = {
    'abies canadensis': 'Abies Canadensis',
    'abies nigra': 'Abies Nigra',
    'abrotanum': 'Abrotanum',
    'abrus precatorius': 'Abrus Precatorius',
    'absinthium': 'Absinthium',
    'acalypha indica': 'Acalypha Indica',
    'acetanilidum': 'Acetanilidum',
    'aceticum acidum': 'Aceticum Acidum',
    'aconitum napellus': 'Aconitum Napellus',
    'actaea spicata': 'Actaea Spicata',
    'actaea racemosa': 'Actaea Racemosa',
    'adonis vernalis': 'Adonis Vernalis',
    'adrenalinum': 'Adrenalinum',
    'aesculus hippocastanum': 'Aesculus Hippocastanum',
    'aethusa cynapium': 'Aethusa Cynapium',
    'agaricus muscarius': 'Agaricus Muscarius',
    'agnus castus': 'Agnus Castus',
    'ailanthus glandulosa': 'Ailanthus Glandulosa',
    'aletris farinosa': 'Aletris Farinosa',
    'alfalfa': 'Alfalfa',
    'allium cepa': 'Allium Cepa',
    'allium sativum': 'Allium Sativum',
    'aloe socotrina': 'Aloe Socotrina',
    'alumina': 'Alumina',
    'ambra grisea': 'Ambra Grisea',
    'ammonium carbonicum': 'Ammonium Carbonicum',
    'ammonium muriaticum': 'Ammonium Muriaticum',
    'amylenum nitrosum': 'Amylenum Nitrosum',
    'anacardium orientale': 'Anacardium Orientale',
    'angustura vera': 'Angustura Vera',
    'anthracinum': 'Anthracinum',
    'antimonium crudum': 'Antimonium Crudum',
    'antimonium tartaricum': 'Antimonium Tartaricum',
    'antipyrinum': 'Antipyrinum',
    'apis mellifica': 'Apis Mellifica',
    'apocynum cannabinum': 'Apocynum Cannabinum',
    'argentum metallicum': 'Argentum Metallicum',
    'argentum nitricum': 'Argentum Nitricum',
    'arnica montana': 'Arnica Montana',
    'arsenicum album': 'Arsenicum Album',
    'arsenicum iodatum': 'Arsenicum Iodatum',
    'artemisia vulgaris': 'Artemisia Vulgaris',
    'arum triphyllum': 'Arum Triphyllum',
    'asafetida': 'Asa Foetida',
    'asclepias tuberosa': 'Asclepias Tuberosa',
    'aurum metallicum': 'Aurum Metallicum',
    'avena sativa': 'Avena Sativa',
    'badiaga': 'Badiaga',
    'baptisia tinctoria': 'Baptisia Tinctoria',
    'baryta carbonica': 'Baryta Carbonica',
    'baryta iodata': 'Baryta Iodata',
    'baryta muriatica': 'Baryta Muriatica',
    'belladonna': 'Belladonna',
    'bellis perennis': 'Bellis Perennis',
    'benzoicum acidum': 'Benzoicum Acidum',
    'berberis vulgaris': 'Berberis Vulgaris',
    'bismuthum': 'Bismuthum',
    'blatta orientalis': 'Blatta Orientalis',
    'borax': 'Borax Veneta',
    'bovista': 'Bovista',
    'bromium': 'Bromium',
    'bryonia alba': 'Bryonia Alba',
    'bufo rana': 'Bufo Rana',
    'cactus grandiflorus': 'Cactus Grandiflorus',
    'cadmium sulphuratum': 'Cadmium Sulphuratum',
    'caladium seguinum': 'Caladium Seguinum',
    'calcarea arsenicosa': 'Calcarea Arsenicosa',
    'calcarea carbonica': 'Calcarea Carbonica',
    'calcarea fluorica': 'Calcarea Fluorica',
    'calcarea iodata': 'Calcarea Iodata',
    'calcarea phosphorica': 'Calcarea Phosphorica',
    'calcarea silicata': 'Calcarea Silicata',
    'calcarea sulphurica': 'Calcarea Sulphurica',
    'calendula officinalis': 'Calendula Officinalis',
    'camphora': 'Camphora',
    'cannabis indica': 'Cannabis Indica',
    'cannabis sativa': 'Cannabis Sativa',
    'cantharis': 'Cantharis Vesicatoria',
    'capsicum': 'Capsicum Annuum',
    'carbo animalis': 'Carbo Animalis',
    'carbo vegetabilis': 'Carbo Vegetabilis',
    'carbolicum acidum': 'Carbolicum Acidum',
    'cascara sagrada': 'Cascara Sagrada',
    'causticum': 'Causticum',
    'cedron': 'Cedron',
    'chelidonium majus': 'Chelidonium Majus',
    'china officinalis': 'China Officinalis',
    'chininum arsenicosum': 'Chininum Arsenicosum',
    'chininum sulphuricum': 'Chininum Sulphuricum',
    'cicuta virosa': 'Cicuta Virosa',
    'cimicifuga racemosa': 'Cimicifuga Racemosa',
    'cina': 'Cina',
    'cinnabaris': 'Cinnabaris',
    'cistus canadensis': 'Cistus Canadensis',
    'coccus cacti': 'Coccus Cacti',
    'cocculus indicus': 'Cocculus Indicus',
    'coffea cruda': 'Coffea Cruda',
    'colchicum autumnale': 'Colchicum Autumnale',
    'collinsonia canadensis': 'Collinsonia Canadensis',
    'colocynthis': 'Colocynthis',
    'conium maculatum': 'Conium Maculatum',
    'corallium rubrum': 'Corallium Rubrum',
    'crocus sativus': 'Crocus Sativus',
    'croton tiglium': 'Croton Tiglium',
    'crotalus horridus': 'Crotalus Horridus',
    'cuprum metallicum': 'Cuprum Metallicum',
    'cyclamen europaeum': 'Cyclamen Europaeum',
    'digitalis purpurea': 'Digitalis Purpurea',
    'dioscorea villosa': 'Dioscorea Villosa',
    'drosera rotundifolia': 'Drosera Rotundifolia',
    'dulcamara': 'Dulcamara',
    'echinacea angustifolia': 'Echinacea Angustifolia',
    'elaps corallinus': 'Elaps Corallinus',
    'eupatorium perfoliatum': 'Eupatorium Perfoliatum',
    'euphorbium': 'Euphorbium',
    'euphrasia officinalis': 'Euphrasia Officinalis',
    'ferrum metallicum': 'Ferrum Metallicum',
    'ferrum phosphoricum': 'Ferrum Phosphoricum',
    'filix mas': 'Filix Mas',
    'fluoricum acidum': 'Fluoricum Acidum',
    'formica rufa': 'Formica Rufa',
    'fucus vesiculosus': 'Fucus Vesiculosus',
    'gelsemium sempervirens': 'Gelsemium Sempervirens',
    'gentiana lutea': 'Gentiana Lutea',
    'geranium maculatum': 'Geranium Maculatum',
    'glonoinum': 'Glonoinum',
    'gnaphalium polycephalum': 'Gnaphalium Polycephalum',
    'gossypium herbaceum': 'Gossypium Herbaceum',
    'graphites': 'Graphites',
    'grindelia robusta': 'Grindelia Robusta',
    'guaiacum': 'Guaiacum Officinale',
    'hamamelis virginiana': 'Hamamelis Virginiana',
    'helleborus niger': 'Helleborus Niger',
    'hepar sulphur': 'Hepar Sulphur',
    'hydrastis canadensis': 'Hydrastis Canadensis',
    'hydrocyanicum acidum': 'Hydrocyanicum Acidum',
    'hyoscyamus niger': 'Hyoscyamus Niger',
    'hypericum perforatum': 'Hypericum Perforatum',
    'iberis amara': 'Iberis Amara',
    'ignatia amara': 'Ignatia Amara',
    'iodium': 'Iodium',
    'ipecacuanha': 'Ipecacuanha',
    'iris versicolor': 'Iris Versicolor',
    'jaborandi': 'Jaborandi',
    'jalapa': 'Jalapa',
    'juglans cinerea': 'Juglans Cinerea',
    'juniperus communis': 'Juniperus Communis',
    'kali arsenicosum': 'Kali Arsenicosum',
    'kali bichromicum': 'Kali Bichromicum',
    'kali bromatum': 'Kali Bromatum',
    'kali carbonicum': 'Kali Carbonicum',
    'kali iodatum': 'Kali Iodatum',
    'kali muriaticum': 'Kali Muriaticum',
    'kali phosphoricum': 'Kali Phosphoricum',
    'kali sulphuricum': 'Kali Sulphuricum',
    'kalmia latifolia': 'Kalmia Latifolia',
    'kreosotum': 'Kreosotum',
    'lachesis mutus': 'Lachesis',
    'lactuca virosa': 'Lactuca Viroso',
    'lapis albus': 'Lapis Albus',
    'laurocerasus': 'Laurocerasus',
    'ledum palustre': 'Ledum Palustre',
    'leptandra virginica': 'Leptandra Virginica',
    'lilium tigrinum': 'Lilium Tigrinum',
    'lobelia inflata': 'Lobelia Inflata',
    'lycopodium clavatum': 'Lycopodium',
    'lyssinum': 'Lyssinum',
    'magnesia carbonica': 'Magnesia Carbonica',
    'magnesia muriatica': 'Magnesia Muriatica',
    'magnesia phosphorica': 'Magnesia Phosphorica',
    'medorrhinum': 'Medorrhinum',
    'melilotus officinalis': 'Melilotus Officinalis',
    'mentha piperita': 'Mentha Piperita',
    'mercurius solubilis': 'Mercurius Solubilis',
    'mercurius corrosivus': 'Mercurius Corrosivus',
    'mercurius iodatus ruber': 'Mercurius Iodatus Ruber',
    'mezereum': 'Mezereum',
    'millefolium': 'Millefolium',
    'moschus': 'Moschus',
    'muriaticum acidum': 'Muriaticum Acidum',
    'myrica cerifera': 'Myrica Cerifera',
    'naja tripudians': 'Naja Tripudians',
    'natrum arsenicosum': 'Natrum Arsenicosum',
    'natrum carbonicum': 'Natrum Carbonicum',
    'natrum muriaticum': 'Natrum Muriaticum',
    'natrum phosphoricum': 'Natrum Phosphoricum',
    'natrum sulphuricum': 'Natrum Sulphuricum',
    'niccolum metallicum': 'Niccolum Metallicum',
    'nitricum acidum': 'Nitricum Acidum',
    'nux moschata': 'Nux Moschata',
    'nux vomica': 'Nux Vomica',
    'ocimum canum': 'Ocimum Canum',
    'oleum morrhuae': 'Oleum Morrhuae',
    'oleum santali': 'Oleum Santali',
    'opium': 'Opium',
    'ornithogalum umbellatum': 'Ornithogalum Umbellatum',
    'oxalicum acidum': 'Oxalicum Acidum',
    'paeonia officinalis': 'Paeonia Officinalis',
    'paris quadrifolia': 'Paris Quadrifolia',
    'passiflora incarnata': 'Passiflora Incarnata',
    'petroleum': 'Petroleum',
    'phosphoricum acidum': 'Phosphoricum Acidum',
    'phosphorus': 'Phosphorus',
    'physostigma venenosum': 'Physostigma Venenosum',
    'phytolacca decandra': 'Phytolacca Decandra',
    'picricum acidum': 'Picricum Acidum',
    'plantago major': 'Plantago Major',
    'platina': 'Platinum Metallicum',
    'plumbum metallicum': 'Plumbum Metallicum',
    'podophyllum peltatum': 'Podophyllum Peltatum',
    'primula obconica': 'Primula Obconica',
    'psorinum': 'Psorinum',
    'pulsatilla': 'Pulsatilla',
    'pyrogenium': 'Pyrogenium',
    'quassia amara': 'Quassia Amara',
    'radium bromatum': 'Radium Bromatum',
    'ranunculus bulbosus': 'Ranunculus Bulbosus',
    'raphanus sativus': 'Raphanus Sativus',
    'rhododendron chrysanthum': 'Rhododendron Chrysanthum',
    'rhus toxicodendron': 'Rhus Toxicodendron',
    'ricinus communis': 'Ricinus Communis',
    'robinia pseudacacia': 'Robinia Pseudacacia',
    'rumex crispus': 'Rumex Crispus',
    'ruta graveolens': 'Ruta Graveolens',
    'sabadilla': 'Sabadilla',
    'sabal serrulata': 'Sabal Serrulata',
    'sabina': 'Sabina',
    'sambucus nigra': 'Sambucus Nigra',
    'sanguinaria canadensis': 'Sanguinaria Canadensis',
    'sarsaparilla': 'Sarsaparilla',
    'secale cornutum': 'Secale Cornutum',
    'selenium': 'Selenium',
    'senecio aureus': 'Senecio Aureus',
    'senega': 'Senega',
    'sepia': 'Sepia',
    'silicea': 'Silicea',
    'spigelia anthelmia': 'Spigelia Anthelmia',
    'spongia tosta': 'Spongia Tosta',
    'stannum metallicum': 'Stannum Metallicum',
    'staphysagria': 'Staphysagria',
    'sticta pulmonaria': 'Sticta Pulmonaria',
    'stramonium': 'Stramonium',
    'sulphur': 'Sulphur',
    'sulphuricum acidum': 'Sulphuricum Acidum',
    'sumbul': 'Sumbul',
    'symphytum officinale': 'Symphytum Officinale',
    'syphilinum': 'Syphilinum',
    'tabacum': 'Tabacum',
    'tarentula hispanica': 'Tarentula Hispanica',
    'tellurium': 'Tellurium Metallicum',
    'terebinthina': 'Terebinthina',
    'thallium metallicum': 'Thallium Metallicum',
    'thea chinensis': 'Thea Chinensis',
    'theridion': 'Theridion',
    'thuja occidentalis': 'Thuja Occidentalis',
    'thyroidinum': 'Thyroidinum',
    'trifolium pratense': 'Trifolium Pratense',
    'trillium pendulum': 'Trillium Pendulum',
    'tuberculinum': 'Tuberculinum',
    'urtica urens': 'Urtica Urens',
    'ustilago maydis': 'Ustilago Maydis',
    'uva ursi': 'Uva Ursi',
    'valeriana officinalis': 'Valeriana Officinalis',
    'variolinum': 'Variolinum',
    'veratrum album': 'Veratrum Album',
    'veratrum viride': 'Veratrum Viride',
    'verbascum thapsus': 'Verbascum Thapsus',
    'viburnum opulus': 'Viburnum Opulus',
    'vinca minor': 'Vinca Minor',
    'viola odorata': 'Viola Odorata',
    'viola tricolor': 'Viola Tricolor',
    'viscum album': 'Viscum Album',
    'wyethia': 'Wyethia Helenoides',
    'xanthoxylum americanum': 'Xanthoxylum Americanum',
    'yucca filamentosa': 'Yucca Filamentosa',
    'zincum metallicum': 'Zincum Metallicum',
    'zincum valerianicum': 'Zincum Valerianicum',
    'zingiber': 'Zingiber',
}


def get_standard_name(raw_name):
    """Convert raw remedy name to standard homeopathic format."""
    # First apply known fixes
    upper = raw_name.upper().strip()
    if upper in NAME_FIXES:
        fixed = NAME_FIXES[upper]
        return fixed.title()
    
    # Try lowercase lookup
    lower = raw_name.lower().strip()
    if lower in STANDARD_NAMES:
        return STANDARD_NAMES[lower]
    
    # Default: title case
    return raw_name.title().strip()


def extract_mind_section(sections):
    """Extract Mind section for mentalGenerals field."""
    return sections.get('Mind', '')


def extract_physical_generals(sections):
    """Extract physical generals from sections."""
    parts = []
    for key in ['Head', 'Eyes', 'Ears', 'Nose', 'Face', 'Mouth', 'Throat']:
        if key in sections:
            parts.append(f"{key}.–– {sections[key]}")
    return '\n\n'.join(parts) if parts else ''


def extract_clinical_uses(general_description, sections):
    """Extract clinical uses from general description and sections."""
    return general_description[:500] if general_description else ''


def main():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    # Get existing remedy names (case-insensitive lookup)
    cur.execute('SELECT id, name FROM "Remedy"')
    existing = {}
    for row in cur.fetchall():
        existing[row[1].lower()] = row
    
    print(f"Found {len(existing)} existing remedies in DB")
    
    # Get the Boericke book ID
    cur.execute('''SELECT id FROM "Book" WHERE author = 'William Boericke' LIMIT 1''')
    book_row = cur.fetchone()
    book_id = book_row[0] if book_row else None
    print(f"Boericke book ID: {book_id}")
    
    inserted = 0
    updated = 0
    skipped = 0
    
    for remedy in remedies:
        raw_name = remedy['name']
        standard_name = get_standard_name(raw_name)
        
        # Skip the last entry which seems to be corrupted (Zizia Aurea with 70k chars)
        if len(remedy.get('fullContent', '')) > 50000:
            print(f"  SKIPPING {standard_name} - content too long ({len(remedy['fullContent'])} chars), likely parse error")
            skipped += 1
            continue
        
        full_content = remedy.get('fullContent', '')
        if not full_content or len(full_content) < 20:
            print(f"  SKIPPING {standard_name} - no content")
            skipped += 1
            continue
        
        # Build sections JSON
        sections_json = json.dumps(remedy.get('sections', {}), ensure_ascii=False)
        
        # Extract structured fields
        mental_generals = extract_mind_section(remedy.get('sections', {}))
        physical_generals = extract_physical_generals(remedy.get('sections', {}))
        clinical_uses = extract_clinical_uses(remedy.get('generalDescription', ''), remedy.get('sections', {}))
        modalities = remedy.get('modalities', '')
        relationships = remedy.get('relationships', '')
        compare = remedy.get('compareRemedies', '')
        dosage = remedy.get('dosage', '')
        common_name = remedy.get('commonName', '')
        latin_name = remedy.get('latinName', '')
        
        # Check if remedy exists
        existing_entry = existing.get(standard_name.lower())
        
        if existing_entry:
            # Update existing entry with full Boericke content
            remedy_id = existing_entry[0]
            try:
                cur.execute('''
                    UPDATE "Remedy" SET
                        "fullContent" = %s,
                        "sections" = %s,
                        "commonName" = COALESCE("commonName", %s),
                        "latinName" = COALESCE("latinName", %s),
                        "mentalGenerals" = COALESCE("mentalGenerals", %s),
                        "physicalGenerals" = COALESCE("physicalGenerals", %s),
                        "modalities" = COALESCE("modalities", %s),
                        "remedyRelationships" = COALESCE("remedyRelationships", %s),
                        "compareRemedies" = COALESCE("compareRemedies", %s),
                        "clinicalUses" = COALESCE("clinicalUses", %s),
                        "dosage" = COALESCE("dosage", %s),
                        "sourceAuthors" = CASE 
                            WHEN "sourceAuthors" IS NULL THEN 'William Boericke'
                            WHEN "sourceAuthors" NOT LIKE '%%Boericke%%' THEN "sourceAuthors" || ', William Boericke'
                            ELSE "sourceAuthors"
                        END
                    WHERE id = %s
                ''', (
                    full_content,
                    sections_json,
                    common_name,
                    latin_name,
                    mental_generals if mental_generals else None,
                    physical_generals if physical_generals else None,
                    modalities if modalities else None,
                    relationships if relationships else None,
                    compare if compare else None,
                    clinical_uses if clinical_uses else None,
                    dosage if dosage else None,
                    remedy_id
                ))
                updated += 1
                if updated <= 10 or updated % 50 == 0:
                    print(f"  UPDATED {standard_name} ({len(full_content)} chars)")
            except Exception as e:
                print(f"  ERROR updating {standard_name}: {e}")
                conn.rollback()
                continue
        else:
            # Insert new remedy
            try:
                cur.execute('''
                    INSERT INTO "Remedy" (id, name, "commonName", "latinName", "sourceAuthors",
                        "mentalGenerals", "physicalGenerals", "modalities", "remedyRelationships",
                        "compareRemedies", "clinicalUses", dosage, "fullContent", sections)
                    VALUES (gen_random_uuid(), %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ''', (
                    standard_name,
                    common_name or None,
                    latin_name or None,
                    'William Boericke',
                    mental_generals or None,
                    physical_generals or None,
                    modalities or None,
                    relationships or None,
                    compare or None,
                    clinical_uses or None,
                    dosage or None,
                    full_content,
                    sections_json
                ))
                inserted += 1
                if inserted <= 10 or inserted % 50 == 0:
                    print(f"  INSERTED {standard_name} ({len(full_content)} chars)")
            except Exception as e:
                print(f"  ERROR inserting {standard_name}: {e}")
                conn.rollback()
                continue
        
        # Commit in batches
        if (inserted + updated) % 50 == 0:
            conn.commit()
            print(f"  --- Batch committed: {inserted} inserted, {updated} updated ---")
    
    # Final commit
    conn.commit()
    
    # Verify
    cur.execute('SELECT count(*) FROM "Remedy"')
    total = cur.fetchone()[0]
    cur.execute('SELECT count(*) FROM "Remedy" WHERE "fullContent" IS NOT NULL')
    with_content = cur.fetchone()[0]
    
    print(f"\n{'='*60}")
    print(f"SEED COMPLETE!")
    print(f"  Inserted: {inserted}")
    print(f"  Updated: {updated}")
    print(f"  Skipped: {skipped}")
    print(f"  Total remedies in DB: {total}")
    print(f"  With fullContent: {with_content}")
    
    # Update LibrarySection item count for Materia Medica
    cur.execute('''UPDATE "LibrarySection" SET "itemCount" = %s WHERE slug = 'materia-medica' ''', (total,))
    conn.commit()
    print(f"  Updated Materia Medica section itemCount to {total}")
    
    conn.close()


if __name__ == '__main__':
    main()
