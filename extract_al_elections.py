import pdfplumber
import json
import re
from collections import defaultdict

pdf_path = '/Users/zzaidi/GroundWork/al election results 2022.pdf'

PARTY_MAP = {'R': 'REP', 'D': 'DEM', 'L': 'LIB', 'I': 'IND', 'G': 'GRN'}

def group_words_by_row(words, tolerance=3):
    rows = defaultdict(list)
    for w in words:
        top = w['top']
        matched = None
        for row_top in rows.keys():
            if abs(top - row_top) <= tolerance:
                matched = row_top
                break
        if matched is None:
            matched = top
        rows[matched].append(w)
    for row_top in rows:
        rows[row_top].sort(key=lambda w: w['x0'])
    return sorted(rows.items())

def parse_candidates_from_row(cand_words):
    """Parse candidates left-to-right, accumulating name words until party marker or Write-In."""
    candidates = []
    name_parts = []
    name_x_start = None

    for w in cand_words:
        text = w['text']
        if re.match(r'^\([A-Z]+\)$', text):
            party = text[1:-1]
            if name_parts:
                candidates.append({'name': ' '.join(name_parts), 'party': party, 'x': name_x_start})
                name_parts = []
                name_x_start = None
        elif text == 'Write-In':
            if name_parts:
                candidates.append({'name': ' '.join(name_parts), 'party': 'UNK', 'x': name_x_start})
                name_parts = []
                name_x_start = None
            candidates.append({'name': 'Write-In', 'party': 'WI', 'x': w['x0']})
        else:
            if name_x_start is None:
                name_x_start = w['x0']
            name_parts.append(text)

    if name_parts:
        candidates.append({'name': ' '.join(name_parts), 'party': 'UNK', 'x': name_x_start})

    return candidates

def split_candidates_by_writein(candidates, n_districts):
    """
    Split candidates into district groups using Write-In as district boundary markers.
    Every district ends with a Write-In candidate.
    """
    groups = []
    current = []
    for c in candidates:
        current.append(c)
        if c['party'] == 'WI':
            groups.append(current)
            current = []
    if current:
        groups.append(current)  # any trailing candidates without Write-In

    if len(groups) == n_districts:
        return groups
    # Fallback: split evenly
    return None

def extract_districts_from_page(page):
    words = page.extract_words()

    if not any(w['text'] == 'Total' for w in words):
        return {}

    rows = group_words_by_row(words)

    district_row = None
    candidate_row = None
    total_row = None

    for row_top, row_words in rows:
        texts = [w['text'] for w in row_words]
        if 'District' in texts and any(t in texts for t in ('Senator,', 'Representative,')):
            district_row = (row_top, row_words)
        elif texts and texts[0] == 'Total':
            total_row = (row_top, row_words)
        elif district_row is not None and total_row is None:
            if any(re.match(r'^\([A-Z]+\)$', t) for t in texts) or 'Write-In' in texts:
                candidate_row = (row_top, row_words)

    if not district_row or not candidate_row or not total_row:
        return {}

    # Parse district numbers with x-positions
    districts = []
    for i, w in enumerate(district_row[1]):
        if w['text'] == 'District' and i + 1 < len(district_row[1]):
            districts.append({'num': district_row[1][i + 1]['text'], 'x': w['x0']})

    if not districts:
        return {}

    # Parse all vote totals left-to-right
    vote_totals = []
    for w in total_row[1]:
        if w['text'] == 'Total':
            continue
        num_str = w['text'].replace(',', '')
        try:
            vote_totals.append({'x': w['x0'], 'votes': int(num_str)})
        except ValueError:
            pass

    # Parse all candidates left-to-right
    all_candidates = parse_candidates_from_row(candidate_row[1])

    # Split candidates into per-district groups using Write-In as end-of-district marker
    dist_groups = split_candidates_by_writein(all_candidates, len(districts))

    if dist_groups is None or len(dist_groups) != len(districts):
        return {}

    # Verify total candidate count matches total votes count
    if sum(len(g) for g in dist_groups) != len(vote_totals):
        return {}

    # Assign vote totals to districts by count
    output = {}
    total_idx = 0
    for k, dist in enumerate(districts):
        group = dist_groups[k]
        totals = vote_totals[total_idx:total_idx + len(group)]
        total_idx += len(group)

        results = [{'name': c['name'], 'party': c['party'], 'votes': t['votes']}
                   for c, t in zip(group, totals)]

        non_wi = [r for r in results if r['party'] != 'WI']
        if not non_wi:
            continue

        winner = max(non_wi, key=lambda r: r['votes'])
        total_votes = sum(r['votes'] for r in results)
        win_pct = round(winner['votes'] / total_votes * 100, 2) if total_votes > 0 else 0
        unopposed = len(non_wi) == 1
        party_code = PARTY_MAP.get(winner['party'], winner['party'])

        output[dist['num']] = {
            'winner': winner['name'],
            'party': party_code,
            'pct': win_pct,
            'unopposed': unopposed
        }

    return output


house_results = {}
senate_results = {}
failed_pages = []

with pdfplumber.open(pdf_path) as pdf:
    for i, page in enumerate(pdf.pages):
        text = page.extract_text() or ''
        if 'Total' not in text or 'District' not in text or 'General Election' not in text:
            continue
        results = extract_districts_from_page(page)
        if 'Senate' in text:
            senate_results.update(results)
        elif 'House' in text:
            house_results.update(results)
        if not results and ('Senate' in text or 'House' in text):
            failed_pages.append(i + 1)

def sort_by_num(d):
    return {str(k): v for k, v in sorted(d.items(), key=lambda x: int(x[0]))}

final = {
    'house': sort_by_num(house_results),
    'senate': sort_by_num(senate_results)
}

output_path = '/Users/zzaidi/GroundWork/al-elections-data.json'
with open(output_path, 'w') as f:
    json.dump(final, f, indent=2)

print(f"Senate districts: {len(senate_results)}")
print(f"House districts: {len(house_results)}")
if failed_pages:
    print(f"Failed pages (no results extracted): {failed_pages}")

print("\nKey spot-checks:")
for d in ['7', '8', '9', '10']:
    print(f"  Senate D{d}: {senate_results.get(d)}")
for d in ['3', '7', '10', '99', '100', '101', '102', '105']:
    print(f"  House D{d}: {house_results.get(d)}")

print(f"\nWritten to {output_path}")
