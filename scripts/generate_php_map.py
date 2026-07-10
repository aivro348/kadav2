import json

with open('frontend/src/data/locations.json', 'r') as f:
    data = json.load(f)

php = ["<?php\n$LOCATION_MAP = ["]

for item in data['mandals']:
    name = item['name'].replace("'", "\\'")
    php.append(f"    '{item['id']}' => '{name}',")

for item in data['panchayats']:
    name = item['name'].replace("'", "\\'")
    php.append(f"    '{item['id']}' => '{name}',")

for item in data['villages']:
    name = item['name'].replace("'", "\\'")
    php.append(f"    '{item['id']}' => '{name}',")

php.append("];\n?>")

with open('php-backend/api/locations_map.php', 'w') as f:
    f.write('\n'.join(php))

print("Created locations_map.php successfully.")
