import requests
import json

def get_food_image_url(item_name, api_key, cse_id):
    query = f'{item_name} picture'
    url = f'https://www.googleapis.com/customsearch/v1?q={query}&key={api_key}&cx={cse_id}&searchType=image'
    response = requests.get(url)
    response_json = response.json()

    if 'error' in response_json:
        print(f'Error: {response_json["error"]["message"]}')
        return None

    if 'items' not in response_json:
        print(f'No search results for {item_name}')
        return None

    image_url = response_json['items'][0]['link']
    return image_url


api_key = 'AIzaSyAwv7dJ1ODeLX3SA5YGSbYmVwV6kKqt-8I'
cse_id = 'a65663bbebdb44eb2'

with open('data.json', 'r') as file:
    data = json.load(file)

for item in data["Data"]:
    item_name = item['Item']
    image_url = get_food_image_url(item_name, api_key, cse_id)
    item['ImageURL'] = image_url


with open('pics.json', 'w') as file:
    json.dump(data, file, indent=4)
