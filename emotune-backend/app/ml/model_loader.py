import logging
import os

import cv2

from app.core.config import settings

logger = logging.getLogger(__name__)

# Module-level singletons, populated by load_model() during the FastAPI lifespan startup.
_model = None
_face_cascade: cv2.CascadeClassifier | None = None


def load_model() -> None:
    """Load the Keras FER model and the OpenCV Haar cascade once at app startup.

    Importing TensorFlow is deferred to this function (rather than module import time)
    so that the rest of the app can start quickly and so tests that don't need the
    model don't pay the TF import cost.
    """
    global _model, _face_cascade

    if _model is not None:
        return  # already loaded

    if not os.path.exists(settings.MODEL_PATH):
        raise FileNotFoundError(
            f"FER model not found at '{settings.MODEL_PATH}'. "
            "Set MODEL_PATH in your .env or place the model file at that path."
        )

    import tensorflow as tf  # local import - heavy dependency

    # The model was trained with one or more custom layers (e.g. AttentionLayer).
    # Keras only stores the layer's name/config in the .keras file, not its
    # Python implementation, so we have to hand that implementation back in
    # via custom_objects or loading fails with "Could not locate class ...".
    from app.ml.custom_layers import CUSTOM_OBJECTS

    logger.info("Loading FER model from %s ...", settings.MODEL_PATH)
    _model = tf.keras.models.load_model(settings.MODEL_PATH, custom_objects=CUSTOM_OBJECTS)
    logger.info("FER model loaded. Input shape: %s", _model.input_shape)

    cascade_path = settings.FACE_CASCADE_PATH
    if not os.path.exists(cascade_path):
        # Fall back to the cascade bundled with opencv-python if a custom path wasn't provided
        cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"

    _face_cascade = cv2.CascadeClassifier(cascade_path)
    if _face_cascade.empty():
        raise RuntimeError(f"Failed to load Haar cascade from '{cascade_path}'")

    logger.info("Face cascade loaded from %s", cascade_path)


def get_model():
    if _model is None:
        raise RuntimeError("Model has not been loaded yet. Call load_model() during app startup.")
    return _model


def get_face_cascade() -> cv2.CascadeClassifier:
    if _face_cascade is None:
        raise RuntimeError("Face cascade has not been loaded yet. Call load_model() during app startup.")
    return _face_cascade


def unload_model() -> None:
    """Optional cleanup hook for graceful shutdown."""
    global _model, _face_cascade
    _model = None
    _face_cascade = None
