from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import base64
from backend.app.crypto.key_derivation import derive_key


def decrypt_aes256(enc_data: dict, password: str) -> str:
    salt = base64.b64decode(enc_data["salt"])
    iv = base64.b64decode(enc_data["iv"])
    ciphertext = base64.b64decode(enc_data["ciphertext"])

    # Derive same key
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
    # Paste encrypted dictionary here manually for testing
    encrypted_data = {
        "salt": input("Enter salt: "),
        "iv": input("Enter iv: "),
        "ciphertext": input("Enter ciphertext: ")
    }

    password = input("Enter password: ")
    decrypted = decrypt_aes256(encrypted_data, password)

    print("\nDecrypted Text:")
    print(decrypted)
