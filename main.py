from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from backend.app.crypto.encrypt import encrypt_aes256
from backend.app.crypto.decrypt import decrypt_aes256
from backend.app.stagno.hide2 import embed_data_in_image, extract_data_from_image
import io

import json

app = FastAPI()

# CORS (React connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#encrypt and send to lsb stagnography
@app.post("/encrypt")
async def encrypt_data(message: str = Form(...), password: str = Form(...)):
    encrypted = encrypt_aes256(message, password)

    json_string = json.dumps(encrypted)

    return {
        "status": "success",
        "encrypted_data": encrypted,  # for frontend display
        "encrypted_string": json_string  # 👉 for LSB embedding
    }


#decrypt
@app.post("/decrypt")
async def decrypt_data(encrypted_data: str = Form(...),
                       password: str = Form(...)):
    try:
        # convert string → dict
        encrypted_dict = json.loads(encrypted_data)

        decrypted = decrypt_aes256(encrypted_dict, password)

        return {"status": "success", "message": decrypted}

    except Exception as e:
        return {
            "status": "error",
            "message": "Wrong password or corrupted data"
        }
