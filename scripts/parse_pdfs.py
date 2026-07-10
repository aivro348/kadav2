import pdfplumber
import json
import os

data = {"mandals": [], "panchayats": [], "villages": []}

def extract_table(pdf_path, type_name):
    print(f"Extracting {type_name} from {pdf_path}...")
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            table = page.extract_table()
            if not table:
                continue
            for row in table[1:]:
                # clean empty strings
                row = [str(cell).strip().replace('\n', ' ') if cell else "" for cell in row]
                if type_name == "mandals" and len(row) >= 2:
                    if row[0].startswith("M"):
                        data["mandals"].append({"id": row[0], "name": row[1]})
                elif type_name == "panchayats" and len(row) >= 3:
                    if row[0].startswith("P"):
                        data["panchayats"].append({"id": row[0], "mandal_id": row[1], "name": row[2]})
                elif type_name == "villages" and len(row) >= 3:
                    if row[0].startswith("H"):
                        data["villages"].append({"id": row[0], "panchayat_id": row[1], "name": row[2]})

extract_table("../mandals.pdf", "mandals")
extract_table("../panchayats.pdf", "panchayats")
extract_table("../habitations.pdf", "villages")

os.makedirs("../frontend/src/data", exist_ok=True)
with open("../frontend/src/data/locations.json", "w") as f:
    json.dump(data, f, indent=2)

print(f"Extraction complete! Mandals: {len(data['mandals'])}, Panchayats: {len(data['panchayats'])}, Villages: {len(data['villages'])}")
