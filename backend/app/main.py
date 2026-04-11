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


#embed
@app.post("/embed")
async def embed(image: UploadFile = File(...),
                message: str = Form(...),
                password: str = Form(...)):
    image_bytes = await image.read()

    # AES encrypt
    encrypted_payload_dict = encrypt_aes256(message, password)

    # convert dict → JSON → bytes
    encrypted_payload = json.dumps(encrypted_payload_dict).encode()

    stego_bytes = embed_data_in_image(image_bytes, encrypted_payload)

    return StreamingResponse(
        io.BytesIO(stego_bytes),
        media_type="image/png",
        headers={"Content-Disposition": "attachment; filename=stego.png"})
