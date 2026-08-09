from typing import List, Tuple

import cv2
import numpy as np

from app.ml.model_loader import get_face_cascade


def detect_faces(gray_image: np.ndarray) -> List[Tuple[int, int, int, int]]:
    """Detect faces in a grayscale image. Returns a list of (x, y, w, h) boxes."""
    cascade = get_face_cascade()
    faces = cascade.detectMultiScale(
        gray_image,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(48, 48),
    )
    return [tuple(face) for face in faces]


def largest_face(faces: List[Tuple[int, int, int, int]]) -> Tuple[int, int, int, int]:
    """When multiple faces are detected, assume the largest bounding box is the primary subject."""
    return max(faces, key=lambda box: box[2] * box[3])


def crop_face(image_bgr: np.ndarray, box: Tuple[int, int, int, int], padding: float = 0.15) -> np.ndarray:
    """Crop the face region out of a BGR image with a small padding margin."""
    x, y, w, h = box
    pad_w, pad_h = int(w * padding), int(h * padding)

    y0 = max(0, y - pad_h)
    y1 = min(image_bgr.shape[0], y + h + pad_h)
    x0 = max(0, x - pad_w)
    x1 = min(image_bgr.shape[1], x + w + pad_w)

    return image_bgr[y0:y1, x0:x1]


def find_primary_face(image_bgr: np.ndarray) -> np.ndarray | None:
    """Full pipeline: grayscale -> detect -> pick largest -> crop. Returns None if no face found."""
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    faces = detect_faces(gray)
    if not faces:
        return None
    box = largest_face(faces)
    return crop_face(image_bgr, box)
