Place your trained model file here, e.g.:

    ml_models/best_fer_model.keras

And point MODEL_PATH in your .env to it (see .env.example).
If you have a custom Haar cascade, place it here too and set FACE_CASCADE_PATH;
otherwise the app falls back to OpenCV's bundled default cascade automatically.
