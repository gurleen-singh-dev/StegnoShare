from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import os
import base64
from key_derivation import derive_key


def encrypt_aes256(plaintext: str, password: str) -> dict:
    # Generate random salt and IV
    salt = os.urandom(16)
    iv = os.urandom(16)

    # Derive AES key
    key = derive_key(password, salt)

    # Padding
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(plaintext.encode()) + padder.finalize()

    # AES-256-CBC Encryption
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()

    return {
        "salt": base64.b64encode(salt).decode(),
        "iv": base64.b64encode(iv).decode(),
        "ciphertext": base64.b64encode(ciphertext).decode()
    }


if __name__ == "__main__":
    text = input("Enter message: ")
    password = input("Enter password: ")

    encrypted = encrypt_aes256(text, password)
    print("\nEncrypted Data:")
    print(encrypted)
