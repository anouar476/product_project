#!/usr/bin/env python3

import requests
import json

print("===================================")
print("   ShopHub - Product Importer")
print("===================================")
print()

KEYCLOAK_URL = "http://localhost:8080"
API_URL = "http://localhost:8000/api/products"
REALM = "microservices"
CLIENT_ID = "microservices-client"
USERNAME = "admin"
PASSWORD = "admin123"

print("Step 1: Getting admin token from Keycloak...")
token_response = requests.post(
    f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/token",
    data={
        "username": USERNAME,
        "password": PASSWORD,
        "grant_type": "password",
        "client_id": CLIENT_ID
    }
)

if token_response.status_code != 200:
    print(f"Error: Failed to get access token")
    print(f"Response: {token_response.text}")
    exit(1)

access_token = token_response.json()["access_token"]
print("✓ Token obtained successfully")
print()

print("Step 2: Importing products from sample-products.json...")
print()

with open("sample-products.json", "r") as f:
    products = json.load(f)

success_count = 0
fail_count = 0

for product in products:
    product_name = product["nom"]
    print(f"  Importing: {product_name}")

    response = requests.post(
        API_URL,
        json=product,
        headers={"Authorization": f"Bearer {access_token}"}
    )

    if response.status_code in [200, 201]:
        print(f"  ✓ Successfully imported: {product_name}")
        success_count += 1
    else:
        print(f"  ✗ Failed to import: {product_name}")
        print(f"  Status: {response.status_code}")
        print(f"  Response: {response.text}")
        fail_count += 1
    print()

print("===================================")
print(f"   Import completed!")
print(f"   Success: {success_count}")
print(f"   Failed: {fail_count}")
print("===================================")
