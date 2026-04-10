from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from crypto.encrypt import encrypt_aes256
from crypto.decrypt import decrypt_aes256
from stagno.stag import embed_data_in_image, extract_data_from_image
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
        "encrypted_string": json_string  # for LSB embedding
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


#embed
@app.post("/embed")
async def embed(image: UploadFile = File(...),
                message: str = Form(...),
                password: str = Form(...)):
    image_bytes = await image.read()

    # AES encrypt
    encrypted_payload = encrypt_aes256(message, password)

    # Embed into image
    import json

    encrypted_payload_dict = encrypt_aes256(message, password)

    # convert dict → JSON → bytes
    encrypted_payload = json.dumps(encrypted_payload_dict).encode()

    stego_bytes = embed_data_in_image(image_bytes, encrypted_payload)

    return StreamingResponse(
        io.BytesIO(stego_bytes),
        media_type="image/png",
        headers={"Content-Disposition": "attachment; filename=stego.png"})


#extract
@app.post("/extract")
async def extract(image: UploadFile = File(...), password: str = Form(...)):
    image_bytes = await image.read()

    # Extract encrypted payload
    payload = extract_data_from_image(image_bytes)

    # Decrypt
    encrypted_payload_dict = json.loads(payload.decode())

    decrypted = decrypt_aes256(encrypted_payload_dict, password)

    return {"message": decrypted}
