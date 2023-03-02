from importlib.metadata import version
from typing import Any

from fastapi import APIRouter, Form, UploadFile
from pydub import AudioSegment

from solidchain.schemas.audio_transcription import (
    AudioTranscription,
    TranscriptionModel,
)
from solidchain.utils.audio import whisper_transribe

router = APIRouter()


@router.post("/transcribe", response_model=AudioTranscription)
def transcribe(
    *, file: UploadFile = Form(), modelName: TranscriptionModel = Form("large-v2")
) -> Any:
    audio_segment = AudioSegment.from_file(file.file)
    output = whisper_transribe(audio_segment, model=f"openai/whisper-{modelName}")

    transcription = AudioTranscription(
        text=output["text"].strip(),
    )

    return transcription
