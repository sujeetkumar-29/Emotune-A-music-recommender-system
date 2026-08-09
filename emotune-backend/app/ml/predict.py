import base64
import binascii
from typing import Dict, Tuple

import cv2
import numpy as np
from fastapi import HTTPException, status

from app.core.config import settings
from app.ml.face_detect import find_primary_face
from app.ml.model_loader import get_model


def decode_image_bytes(image_bytes: bytes) -> np.ndarray:
    """Decode raw image bytes (jpg/png/etc.) into a BGR numpy array."""
    arr = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if image is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not decode image. Please upload a valid JPEG/PNG file.",
        )
    return image


def decode_base64_image(image_base64: str) -> np.ndarray:
    """Decode a base64 (optionally data-URL prefixed) string into a BGR numpy array."""
    payload = image_base64
    if "," in payload and payload.strip().startswith("data:"):
        payload = payload.split(",", 1)[1]

    try:
        image_bytes = base64.b64decode(payload)
    except (binascii.Error, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid base64 image payload.",
        )
    return decode_image_bytes(image_bytes)


def _get_target_size() -> Tuple[int, int]:
    """Infer the (height, width) the model expects from its input shape, defaulting to 48x48."""
    model = get_model()
    shape = model.input_shape  # e.g. (None, 48, 48, 1)
    if len(shape) == 4 and shape[1] and shape[2]:
        return shape[1], shape[2]
    return 48, 48


def _get_channels() -> int:
    model = get_model()
    shape = model.input_shape
    if len(shape) == 4 and shape[3]:
        return shape[3]
    return 1


def preprocess_face(face_bgr: np.ndarray) -> np.ndarray:
    """Resize/normalize a cropped face image to match the model's expected input tensor."""
    height, width = _get_target_size()
    channels = _get_channels()

    if channels == 1:
        face = cv2.cvtColor(face_bgr, cv2.COLOR_BGR2GRAY)
        face = cv2.resize(face, (width, height))
        face = face.astype("float32") / 255.0
        face = np.expand_dims(face, axis=-1)  # (H, W, 1)
    else:
        face = cv2.cvtColor(face_bgr, cv2.COLOR_BGR2RGB)
        face = cv2.resize(face, (width, height))
        face = face.astype("float32") / 255.0

    face = np.expand_dims(face, axis=0)  # (1, H, W, C)
    return face


def predict_emotion(image_bgr: np.ndarray) -> Dict:
    """Full inference pipeline. Raises HTTPException(422) if no face is detected."""
    face = find_primary_face(image_bgr)
    if face is None or face.size == 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No face detected in the image. Please try again with a clearer, front-facing photo.",
        )

    model = get_model()
    tensor = preprocess_face(face)
    raw_predictions = model.predict(tensor, verbose=0)[0]

    labels = settings.EMOTION_LABELS
    if len(raw_predictions) != len(labels):
        # Model output size doesn't match configured labels - surface a clear error
        # instead of silently mis-mapping indices to emotion names.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                f"Model output size ({len(raw_predictions)}) does not match configured "
                f"EMOTION_LABELS ({len(labels)}). Check app/core/config.py."
            ),
        )

    probabilities = {label: float(prob) for label, prob in zip(labels, raw_predictions)}
    top_emotion = max(probabilities, key=probabilities.get)
    confidence = probabilities[top_emotion]

    return {
        "emotion": top_emotion,
        "confidence": confidence,
        "probabilities": probabilities,
    }
