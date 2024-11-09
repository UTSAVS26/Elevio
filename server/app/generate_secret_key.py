import secrets

# Generate a secure 256-bit key
secret_key = secrets.token_hex(32)
print("Your SECRET_KEY:", secret_key)