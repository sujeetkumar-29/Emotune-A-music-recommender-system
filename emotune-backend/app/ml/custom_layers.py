"""
Custom Keras layers referenced by best_fer_model.keras.

AttentionLayer is a squeeze-and-excitation style channel-attention block:
  1. Squeeze: global average pool over spatial dims -> per-channel vector
  2. Excitation: a Dense(channels, activation="sigmoid") layer scores each
     channel's importance
  3. The input feature map is reweighted by broadcasting those per-channel
     scores back over the spatial dimensions

This was reverse-engineered and verified directly against the shipped
best_fer_model.keras weight store (model.weights.h5 inside the .keras
archive): the sub-layer holding weights is named exactly "attention_dense"
(a fixed literal name, not derived per-instance), with kernel/bias shapes
matching the channel count at each attention layer's position in the network
(256 and 512 channels respectively). Loading + a forward pass were confirmed
to succeed end-to-end with this implementation before it was added here -
this is not a guess.
"""

import keras
import tensorflow as tf
from keras import layers


@keras.saving.register_keras_serializable(package="emotune")
class AttentionLayer(layers.Layer):
    """Squeeze-and-excitation channel attention block."""

    def build(self, input_shape):
        channels = input_shape[-1]
        # Fixed literal name - matches what's stored in the trained weights,
        # not derived from self.name (do not change this to an f-string).
        self.attention_dense = layers.Dense(channels, activation="sigmoid", name="attention_dense")
        self.attention_dense.build((input_shape[0], channels))
        super().build(input_shape)

    def call(self, inputs):
        squeeze = tf.reduce_mean(inputs, axis=[1, 2])  # (batch, channels)
        excitation = self.attention_dense(squeeze)  # (batch, channels)
        excitation = tf.reshape(excitation, [-1, 1, 1, tf.shape(inputs)[-1]])
        return inputs * excitation

    def get_config(self):
        return super().get_config()


# Map of every custom object the model needs, passed to load_model().
CUSTOM_OBJECTS = {
    "AttentionLayer": AttentionLayer,
}



# Map of every custom object the model needs, passed to load_model().
CUSTOM_OBJECTS = {
    "AttentionLayer": AttentionLayer,
}
