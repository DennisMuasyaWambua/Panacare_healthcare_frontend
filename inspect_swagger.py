
import requests
import json
import sys

try:
    response = requests.get('https://panacaredjangobackend-production.up.railway.app/swagger/?format=json')
    data = response.json()
    users_path = data.get('paths', {}).get('/api/users/', {})
    post_op = users_path.get('post')
    if post_op:
        print(json.dumps(post_op, indent=2))
    else:
        print("No POST operation found for /api/users/")
except Exception as e:
    print(f"Error: {e}")
