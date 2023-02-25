from functools import lru_cache
from io import BytesIO
from typing import Dict, Union

import numpy as np
import torch
from ipywebrtc import AudioRecorder, CameraStream
from pydub import AudioSegment
from transformers import pipeline


def notebook_recorder():
    camera = CameraStream(constraints={"audio": True, "video": False})
    recorder = AudioRecorder(stream=camera)
    return recorder


def from_segment_to_numpy(audio_segment: AudioSegment) -> np.ndarray:
    audio_segment = audio_segment.set_channels(1)
    audio_segment = audio_segment.set_frame_rate(16000)
    audio_segment = audio_segment.set_sample_width(2)
    ndarr = (
        np.frombuffer(audio_segment.raw_data, dtype=np.int16)
        .flatten()
        .astype(np.float32)
        / 32768.0
    )
    return ndarr


def from_bytes_to_numpy(audio_bytes: bytes, **kwargs) -> np.ndarray:
    audio_segment = AudioSegment.from_file(BytesIO(audio_bytes), **kwargs)
    return from_segment_to_numpy(audio_segment)


@lru_cache(maxsize=1)
def load_asr_pipeline(model: str, chunk_length=30):
    return pipeline(
        "automatic-speech-recognition",
        model=model,
        chunk_length=chunk_length,
        device="cuda:0" if torch.cuda.is_available() else "cpu",
    )


def whisper_transribe(
    audio_in: Union[str | bytes | np.ndarray, AudioSegment],
    model="openai/whisper-large-v2",
) -> Dict:
    if isinstance(audio_in, str):
        audio_in = AudioSegment.from_file(audio_in)
        audio_in = from_segment_to_numpy(audio_in)
    if isinstance(audio_in, bytes):
        audio_in = from_bytes_to_numpy(audio_in)
    elif isinstance(audio_in, AudioSegment):
        audio_in = from_segment_to_numpy(audio_in)

    asr_pipe = load_asr_pipeline(model=model)
    return asr_pipe(audio_in)
