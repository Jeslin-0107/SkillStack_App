from decouple import config

print("Testing Decouple...")
print("API Key:", config('OPENAI_API_KEY', default='Not found'))
