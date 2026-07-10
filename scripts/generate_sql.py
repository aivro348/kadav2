import json

with open('frontend/src/data/locations.json', 'r') as f:
    data = json.load(f)

sql = []

sql.append("CREATE TABLE IF NOT EXISTS mandals (id VARCHAR(50) PRIMARY KEY, name VARCHAR(255));")
sql.append("CREATE TABLE IF NOT EXISTS panchayats (id VARCHAR(50) PRIMARY KEY, mandal_id VARCHAR(50), name VARCHAR(255));")
sql.append("CREATE TABLE IF NOT EXISTS villages (id VARCHAR(50) PRIMARY KEY, panchayat_id VARCHAR(50), name VARCHAR(255));")
sql.append("TRUNCATE TABLE mandals;")
sql.append("TRUNCATE TABLE panchayats;")
sql.append("TRUNCATE TABLE villages;\n")

for item in data['mandals']:
    name = item['name'].replace("'", "''")
    sql.append(f"INSERT INTO mandals (id, name) VALUES ('{item['id']}', '{name}');")

for item in data['panchayats']:
    name = item['name'].replace("'", "''")
    sql.append(f"INSERT INTO panchayats (id, mandal_id, name) VALUES ('{item['id']}', '{item['mandal_id']}', '{name}');")

for item in data['villages']:
    name = item['name'].replace("'", "''")
    sql.append(f"INSERT INTO villages (id, panchayat_id, name) VALUES ('{item['id']}', '{item['panchayat_id']}', '{name}');")

with open('locations.sql', 'w') as f:
    f.write('\n'.join(sql))

print("Created locations.sql successfully.")
