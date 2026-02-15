from encrypt import encrypt_aes256
from decrypt import decrypt_aes256

text = input("Enter you message: ")
password = input("Enter the password: ")

encrypted = encrypt_aes256(text, password)
print("Encrypted: ", encrypted)

passkey= input("Enter the password to decrypt message: ")
decrypted = decrypt_aes256(encrypted, passkey)
print("Decrypted: ", decrypted)

assert text == decrypted
print("\n✅ Encryption & Decryption Working Correctly")
