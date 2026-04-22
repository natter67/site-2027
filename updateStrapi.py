import requests
import json
import pandas as pd
import os
from dotenv import load_dotenv
load_dotenv('./site-2026-main/.env')

# Strapi API URL and authentication token
STRAPI_URL = "https://loved-vitality-4672033e09.strapiapp.com/api/exhibits"  # Replace with your Strapi URL
API_TOKEN = os.environ['STRAPI_FULL_ACCESS']

# # Headers for the request
headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}


# THIS IS THE EXHIBITS
# file_path = "exhibits.xlsx"
# df = pd.read_excel(file_path, sheet_name="Form Responses 1")
# # print(df)

# # # Loop through each row in the Excel sheet
# ind = 0
# for index, row in df.iterrows():
#     # if (ind == 1):
#     #     break
#     # ind+= 1
#     # Extract values from specific columns (adjust column names based on your file)
#     exhibit_data = {
#         "Exhibit_Number": str(row["ID #"]) if pd.notna(row["ID #"]) else "",
#         "Exhibit_Name": str(row["Exhibit Name"]) if pd.notna(row["Exhibit Name"]) else "",
#         "Exhibit_Building": row["Exhibit Building"] if pd.notna(row["Exhibit Building"]) else "",
#         "Exhibit_Location": str(row["Location"]) if pd.notna(row["Location"]) else "",
#         "Exhibit_Organization": row["Affiliated to which:"] if pd.notna(row["Affiliated to which:"]) else "",
#         "Department": row["Department"] if pd.notna(row["Department"]) else "",
#         "VisGuide_Description": row["Exhibit Description for Visitor's Guide"] if pd.notna(row["Exhibit Description for Visitor's Guide"]) else "",
#         "Intended_Audience": row["Intended Audience"] if pd.notna(row["Intended Audience"]) else "",
#         "Tags": {
#             "Tag1": row["Exhibit Tag 1"] if pd.notna(row["Exhibit Tag 1"]) else "",
#             "Tag2": row["Exhibit Tag 2"] if pd.notna(row["Exhibit Tag 2"]) else "",
#             "Tag3": row["Exhibit Tag 3"] if pd.notna(row["Exhibit Tag 3"]) else ""
#         }
#     }

#     # print(exhibit_data)

#     # Send the data to Strapi
#     response = requests.post(STRAPI_URL, headers=headers, json={"data": exhibit_data})

#     # # Handle response
#     if response.status_code in [200, 201]:
#         print(f"Successfully added: {row['ID #']}")
#     else:
#         print(f"Failed to add: {row['ID #']}")
#         print("Status Code:", response.status_code)
#         print("Response:", response.text)

# THIS IS GETTING ALL THE DATA FROM THE API
# ran on exhibits, events, and faqs
# base_url = "https://loved-vitality-4672033e09.strapiapp.com/api/exhibits?populate=Tags&pagination[pageSize]=1000"
base_url = "https://loved-vitality-4672033e09.strapiapp.com/api/events?populate=occurences&pagination[pageSize]=100"

response = requests.get(base_url, headers=headers)
OUTPUT_FILE = "events.json"

if response.status_code != 200:
    print(f"Failed to fetch data: {response.status_code}")
    exit()

result = response.json()
data = result.get("data", [])

with open(OUTPUT_FILE, "w") as f:
    json.dump(data, f, indent=4)
print(f"Saved {len(data)} records to '{OUTPUT_FILE}'.")