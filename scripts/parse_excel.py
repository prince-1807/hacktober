import zipfile
import xml.etree.ElementTree as ET
import json
import os
import re

excel_path = os.path.join(os.path.dirname(__file__), '..', 'data', '2k25 coding platforms.xlsx')
output_json = os.path.join(os.path.dirname(__file__), '..', 'data', 'genuine_students.json')

z = zipfile.ZipFile(excel_path)
shared_strings = []
if 'xl/sharedStrings.xml' in z.namelist():
    tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
    for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
        t = si.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
        if t is not None:
            shared_strings.append(t.text or '')
        else:
            shared_strings.append(''.join(t.text or '' for t in si.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')))

sheet = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
rows = []
for row in sheet.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
    cells = {}
    for c in row.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
        ref = c.get('r')
        t = c.get('t')
        v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
        val = ''
        if v is not None and v.text is not None:
            if t == 's':
                val = shared_strings[int(v.text)]
            else:
                val = v.text
        col_letter = ''.join([ch for ch in ref if ch.isalpha()])
        cells[col_letter] = val.strip()
    if cells.get('A') and cells.get('A').lower() != 'name':
        rows.append(cells)

def extract_handle(url):
    if not url:
        return ''
    url = url.strip()
    # Remove trailing slashes
    url = url.rstrip('/')
    # Get last path segment
    parts = url.split('/')
    if parts:
        return parts[-1]
    return ''

students = []
reg_counter = 2101050

for r in rows:
    name = r.get('A', '').strip()
    cf_url = r.get('B', '')
    lc_url = r.get('C', '')
    hr_url = r.get('D', '')
    cc_url = r.get('E', '')
    gfg_url = r.get('F', '')

    cf_handle = extract_handle(cf_url)
    lc_handle = extract_handle(lc_url)
    hr_handle = extract_handle(hr_url)
    cc_handle = extract_handle(cc_url)
    gfg_handle = extract_handle(gfg_url)

    # Detect gender
    is_female = 'shrestha' in name.lower() or 'riya' in name.lower() or 'ananya' in name.lower() or 'priya' in name.lower()
    gender = 'FEMALE' if is_female else 'MALE'

    students.append({
        'name': name,
        'registrationNo': str(reg_counter),
        'branch': 'CSE',
        'year': 4,
        'gender': gender,
        'cfHandle': cf_handle,
        'lcHandle': lc_handle,
        'ccHandle': cc_handle,
        'gfgHandle': gfg_handle,
        'hrHandle': hr_handle
    })
    reg_counter += 1

with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(students, f, indent=2)

print(f"Successfully extracted {len(students)} genuine students to {output_json}!")
