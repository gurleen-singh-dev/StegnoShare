from PIL import Image
import io
import struct


def _bytes_to_bits(data: bytes):
    for byte in data:
        for i in range(8):
            yield (byte >> (7 - i)) & 1


def _bits_to_bytes(bits):
    byte_array = bytearray()
    for i in range(0, len(bits), 8):
        byte = 0
        for bit in bits[i:i + 8]:
            byte = (byte << 1) | bit
        byte_array.append(byte)
    return bytes(byte_array)


def embed_data_in_image(image_bytes: bytes, payload: bytes) -> bytes:
    """
    image_bytes: original image (PNG)
    payload: encrypted data (ciphertext + iv + salt + tag)
    returns: stego image bytes
    """

    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    pixels = img.load()
    width, height = img.size

    # Add 4-byte length header
    payload_length = len(payload)
    header = struct.pack(">I", payload_length)
    full_payload = header + payload

    bits = list(_bytes_to_bits(full_payload))
    total_bits = len(bits)

    capacity = width * height * 3
    if total_bits > capacity:
        raise ValueError("Payload too large for this image")

    idx = 0

    for y in range(height):
        for x in range(width):
            if idx >= total_bits:
                break

            r, g, b = pixels[x, y]

            # Modify R, G, B LSBs
            if idx < total_bits:
                r = (r & ~1) | bits[idx]
                idx += 1
            if idx < total_bits:
                g = (g & ~1) | bits[idx]
                idx += 1
            if idx < total_bits:
                b = (b & ~1) | bits[idx]
                idx += 1

            pixels[x, y] = (r, g, b)

        if idx >= total_bits:
            break

    # Save to bytes
    output = io.BytesIO()
    img.save(output, format="PNG")
    return output.getvalue()


def extract_data_from_image(image_bytes: bytes) -> bytes:
    """
    image_bytes: stego image
    returns: extracted payload (encrypted bytes)
    """

    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    pixels = img.load()
    width, height = img.size

    bits = []

    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]

            bits.append(r & 1)
            bits.append(g & 1)
            bits.append(b & 1)

    # Convert bits to bytes
    data = _bits_to_bytes(bits)

    # First 4 bytes = payload length
    payload_length = struct.unpack(">I", data[:4])[0]

    payload = data[4:4 + payload_length]

    if len(payload) != payload_length:
        raise ValueError("Corrupted or incomplete data")

    return payload