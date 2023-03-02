from enum import Enum


class Embeddings(str, Enum):
    OPENAI = "openai"
    COHERE = "cohere"
    HUGGINGFACE = "huggingface"
    TENSORFLOW = "tensorflow"
    HUGGINGFACE_INSTRUCT = "huggingface_instruct"
    SELFHOST = "selfhost"
    SELFHOST_HUGGINGFACE = "selfhost_huggingface"
    SELFHOST_HUGGINGFACE_INSTRUCT = "selfhost_huggingface_instruct"
    HYPOTHETICAL_DOCUMENT = "hypothetical_document"
