#!/usr/bin/env python3
"""
Parser for Boericke's Pocket Manual of Homoeopathic Materia Medica (9th Edition)
Extracts all remedies with their full content from the raw PDF text.
"""

import re
import json
import sys

def parse_boericke(text):
    """Parse the entire Boericke text into structured remedy data."""
    
    # Clean up the text - remove page artifacts
    text = re.sub(r'aidnI\s*sibilimiS\s*\n?', '', text)  # Reversed "Indices Similaris" header
    text = re.sub(r'\n\d+\n', '\n', text)  # Page numbers
    
    # Remove the preface (everything before first remedy)
    # First remedy starts with ABIES CANADENSI
    preface_end = text.find('ABIES CANADENSI')
    if preface_end > 0:
        text = text[preface_end:]
    
    # Also remove any Therapeutic Index or appendices at the end
    # Look for the last remedy - typically ends before a Therapeutic Index
    therapeutic_idx = text.find('THERAPEUTIC INDEX')
    if therapeutic_idx > 0:
        text = text[:therapeutic_idx]
    
    # Known section headers in Boericke
    section_headers = [
        'Mind', 'Head', 'Eyes', 'Ears', 'Nose', 'Face', 'Mouth', 'Throat',
        'Stomach', 'Abdomen', 'Rectum', 'Stool', 'Urinary', 'Male', 'Female',
        'Respiratory', 'Chest', 'Heart', 'Back', 'Extremities', 'Sleep',
        'Skin', 'Fever', 'Modalities', 'Relationship', 'Dose',
        'Generals', 'Larynx', 'Neck', 'Nails', 'Hair', 'Teeth',
        'Sexual', 'Voice', 'Sweat', 'Chill'
    ]
    
    # Pattern to identify remedy names - all uppercase, at least 3 chars,
    # followed by another word or standalone
    # Remedy names are typically: "ABIES CANADENSI" or "ACONITUM NAPELLUS" etc.
    
    # Split into remedy blocks
    # A new remedy starts with a line that is ALL UPPERCASE and contains at least one space
    # and is followed by more content
    
    lines = text.split('\n')
    remedies = []
    current_remedy = None
    current_content_lines = []
    
    # Pattern for remedy name: ALL CAPS line with possible continuation
    # Must be at start of content block
    remedy_name_pattern = re.compile(r'^[A-Z][A-Z\s\.]+[A-Z]$')
    # Also match single-word remedies like "ABSINTHIUM"
    remedy_single_pattern = re.compile(r'^[A-Z]{3,}$')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        if not line:
            i += 1
            continue
        
        # Check if this line starts a new remedy
        # A remedy header is: UPPERCASE NAME, optionally followed by Latin name and common name
        is_new_remedy = False
        
        # Multi-word remedy names (like "ABIES CANADENSI", "ACONITUM NAPELLUS")
        if remedy_name_pattern.match(line) and len(line) > 3:
            # Check next line - should be Latin name (Italicized in book) or common name or description
            next_line = lines[i+1].strip() if i+1 < len(lines) else ''
            # Latin names have lowercase words, common names are title case
            if next_line and (next_line[0].islower() or next_line[0].isupper()):
                is_new_remedy = True
        
        # Single-word remedy names (like "ABSINTHIUM", "ACALYPHA")
        elif remedy_single_pattern.match(line) and len(line) > 4:
            # Verify it's not a section header
            if line.lower() not in [h.lower() for h in section_headers]:
                # Check next line
                next_line = lines[i+1].strip() if i+1 < len(lines) else ''
                if next_line:
                    is_new_remedy = True
        
        # Also check for remedy names with period like "A.B.C." or hyphenated
        # Pattern: starts with uppercase, contains spaces, at least 5 chars
        if not is_new_remedy and re.match(r'^[A-Z][A-Z\s\-\.]{4,}$', line):
            next_line = lines[i+1].strip() if i+1 < len(lines) else ''
            # Must be followed by Latin name or common name or description
            if next_line and len(line.split()) >= 2:
                # Check it's not just noise
                words = line.split()
                if all(len(w) > 1 for w in words):
                    is_new_remedy = True
        
        if is_new_remedy:
            # Save previous remedy
            if current_remedy and current_content_lines:
                remedy_data = process_remedy(current_remedy, current_content_lines, section_headers)
                if remedy_data:
                    remedies.append(remedy_data)
            
            current_remedy = line
            current_content_lines = []
        else:
            if current_remedy:
                current_content_lines.append(line)
        
        i += 1
    
    # Save last remedy
    if current_remedy and current_content_lines:
        remedy_data = process_remedy(current_remedy, current_content_lines, section_headers)
        if remedy_data:
            remedies.append(remedy_data)
    
    return remedies


def process_remedy(name, content_lines, section_headers):
    """Process a single remedy's content lines into structured data."""
    
    # Clean up name
    name = name.strip()
    # Remove extra spaces
    name = ' '.join(name.split())
    
    if not content_lines:
        return None
    
    # First few lines may contain:
    # 1. Latin/botanical name (often lowercase start or mixed case)
    # 2. Common name (Title Case)
    # 3. General description
    
    latin_name = ''
    common_name = ''
    general_description = ''
    sections = {}
    dosage = ''
    modalities = ''
    relationships = ''
    compare = ''
    
    # Parse content
    full_text = '\n'.join(content_lines)
    
    # Find Latin name - typically first line if it starts with lowercase or is italicized
    idx = 0
    
    # Check if first line is a Latin/botanical name (starts with uppercase, has lowercase)
    if idx < len(content_lines):
        first = content_lines[idx].strip()
        if first and first[0].isupper() and any(c.islower() for c in first):
            # Could be Latin name like "Pinus canadensis" or common name
            words = first.split()
            # Latin names typically have genus (capitalized) + species (lowercase)
            if len(words) >= 2 and words[1][0].islower():
                latin_name = first
                idx += 1
            elif len(words) >= 2 and all(w[0].isupper() for w in words):
                # Could be common name with multiple capitalized words
                # Like "Black Spruce", "Hemlock Spruce"
                common_name = first
                idx += 1
            else:
                # Mixed - might be Latin name
                latin_name = first
                idx += 1
    
    # Check second line for common name if first was Latin
    if latin_name and idx < len(content_lines):
        second = content_lines[idx].strip()
        if second and second[0].isupper():
            # Common names are Title Case, shorter
            words = second.split()
            if len(words) <= 4 and all(w[0].isupper() for w in words if w):
                common_name = second
                idx += 1
    
    # If no Latin name was found but first line might be common name
    if not latin_name and not common_name and idx < len(content_lines):
        first = content_lines[idx].strip()
        if first and first[0].isupper():
            words = first.split()
            if len(words) <= 4:
                common_name = first
                idx += 1
    
    # Now parse the rest - general description and sections
    # Sections are identified by: "SectionName.––" pattern
    remaining = '\n'.join(content_lines[idx:])
    
    # Split by section headers
    # Pattern: HeaderName followed by ".––" or ". --"
    section_pattern = r'(?:^|\n)((?:' + '|'.join(re.escape(h) for h in section_headers) + r')\.\s*[––\-]+\s*)'
    
    # Find all section positions
    section_matches = list(re.finditer(section_pattern, remaining, re.IGNORECASE))
    
    if section_matches:
        # General description is everything before first section
        general_description = remaining[:section_matches[0].start()].strip()
        
        # Extract each section
        for si, match in enumerate(section_matches):
            section_name = match.group(1).split('.')[0].strip()
            section_start = match.end()
            section_end = section_matches[si + 1].start() if si + 1 < len(section_matches) else len(remaining)
            section_text = remaining[section_start:section_end].strip()
            
            # Clean section name
            section_name = section_name.title()
            
            # Store specific sections separately
            if section_name.lower() == 'dose':
                dosage = section_text
            elif section_name.lower() == 'modalities':
                modalities = section_text
            elif section_name.lower() == 'relationship':
                relationships = section_text
            else:
                if section_name not in sections:
                    sections[section_name] = section_text
    else:
        # No sections found - entire content is general description
        general_description = remaining.strip()
    
    # Extract compare remedies from relationships
    compare_match = re.search(r'Compare:\s*(.*?)(?:\n|$)', relationships, re.IGNORECASE)
    if compare_match:
        compare = compare_match.group(1).strip()
    
    # Build the remedy data structure
    remedy = {
        'name': name,
        'latinName': latin_name,
        'commonName': common_name,
        'generalDescription': general_description,
        'sections': sections,
        'dosage': dosage,
        'modalities': modalities,
        'relationships': relationships,
        'compareRemedies': compare,
    }
    
    # Build a fullContent field with the complete text
    full_parts = []
    if common_name:
        full_parts.append(common_name)
    if general_description:
        full_parts.append(general_description)
    for sec_name, sec_text in sections.items():
        full_parts.append(f"{sec_name}.–– {sec_text}")
    if modalities:
        full_parts.append(f"Modalities.–– {modalities}")
    if relationships:
        full_parts.append(f"Relationship.–– {relationships}")
    if dosage:
        full_parts.append(f"Dose.–– {dosage}")
    
    remedy['fullContent'] = '\n\n'.join(full_parts)
    
    return remedy


def main():
    input_file = '/home/z/my-project/upload/boericke_raw.txt'
    output_file = '/home/z/my-project/upload/boericke_remedies.json'
    
    print(f"Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        text = f.read()
    
    print(f"Text length: {len(text)} characters")
    print("Parsing remedies...")
    
    remedies = parse_boericke(text)
    
    print(f"Found {len(remedies)} remedies")
    
    # Sort alphabetically by name
    remedies.sort(key=lambda r: r['name'].upper())
    
    # Print summary
    for i, r in enumerate(remedies):
        has_content = bool(r['generalDescription'] or r['sections'])
        content_len = len(r['fullContent'])
        print(f"  {i+1}. {r['name']} ({r['commonName']}) - {content_len} chars {'[HAS CONTENT]' if has_content else '[NAME ONLY]'}")
    
    # Save to JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(remedies, f, indent=2, ensure_ascii=False)
    
    print(f"\nSaved to {output_file}")
    
    # Also save a summary CSV for quick reference
    csv_file = '/home/z/my-project/upload/boericke_summary.csv'
    with open(csv_file, 'w', encoding='utf-8') as f:
        f.write("name,latin_name,common_name,has_content,content_length,num_sections\n")
        for r in remedies:
            num_sections = len(r['sections'])
            has_content = "yes" if (r['generalDescription'] or r['sections']) else "no"
            f.write(f'"{r["name"]}","{r["latinName"]}","{r["commonName"]}",{has_content},{len(r["fullContent"])},{num_sections}\n')
    
    print(f"Summary saved to {csv_file}")


if __name__ == '__main__':
    main()
