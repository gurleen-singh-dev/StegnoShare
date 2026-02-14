from cryptography.hazmat.primitives import padding, hashes
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import os
import base64

# Function to derive a 256-bit AES key from a password
def derive_key(password: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,  # 256 bits
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    return kdf.derive(password.encode())

# Function to encrypt plaintext
def encrypt_aes256(plaintext: str, password: str) -> dict:
    # Generate random salt and IV
    salt = os.urandom(16)
    iv = os.urandom(16)

    # Derive AES key from password
    key = derive_key(password, salt)

    # Pad plaintext to AES block size (128 bits)
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(plaintext.encode()) + padder.finalize()

    # Encrypt using AES-256-CBC
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()

    # Return Base64 encoded values for safe storage/transmission
    return {
        "salt": base64.b64encode(salt).decode(),
        "iv": base64.b64encode(iv).decode(),
        "ciphertext": base64.b64encode(ciphertext).decode()
    }

# Function to decrypt ciphertext
def decrypt_aes256(enc_data: dict, password: str) -> str:
    # Decode Base64 values
    salt = base64.b64decode(enc_data["salt"])
    iv = base64.b64decode(enc_data["iv"])
    ciphertext = base64.b64decode(enc_data["ciphertext"])

    # Derive AES key from password
    key = derive_key(password, salt)

    # Decrypt
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    padded_plaintext = decryptor.update(ciphertext) + decryptor.finalize()

    # Remove padding
    unpadder = padding.PKCS7(128).unpadder()
    plaintext = unpadder.update(padded_plaintext) + unpadder.finalize()

    return plaintext.decode()

if __name__ == "__main__":
    text = input("enter a message: ")
    password = input("Enter password: ")

    encrypted = encrypt_aes256(text, password)
    #print("Encrypted Data:", encrypted)

    passcode = input("Enter your password to decrypt: ")
    decrypted = decrypt_aes256(encrypted, passcode)
    print("Decrypted Text:", decrypted)
