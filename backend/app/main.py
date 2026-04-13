from fastapi import FastAPI, UploadFile, File, Form, HTTPException
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


@app.post("/extract")
async def extract(image: UploadFile = File(...), password: str = Form(...)):
    try:
        image_bytes = await image.read()

        # extract payload
        payload = extract_data_from_image(image_bytes)

        # bytes → dict
        encrypted_payload_dict = json.loads(payload.decode())

        # decrypt
        decrypted = decrypt_aes256(encrypted_payload_dict, password)

        return {"message": decrypted}

    except Exception:
        raise HTTPException(status_code=400,
                            detail="Wrong password or corrupted image")
