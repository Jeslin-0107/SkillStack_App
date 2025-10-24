import os
from decouple import Config, RepositoryEnv

# Ensure path is project root (where .env is)
root_dir = os.path.dirname(os.path.abspath(__file__))  # current file's folder
config = Config(RepositoryEnv(os.path.join(root_dir, '.env')))

# Load and print the API_KEY
print("API Key:", config('API_KEY', default='Not found'))
