import langchain.embeddings as embeddings

from solidchain.configs.config import settings
from solidchain.schemas.embeddings import Embeddings


def get_embeddings_instance(embeddings_type: Embeddings, **kwargs):
    match embeddings_type:
        case Embeddings.OPENAI:
            embeddings_cls = embeddings.OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
        case Embeddings.COHERE:
            embeddings_cls = embeddings.CohereEmbeddings(cohere_api_key=settings.COHERE_API_KEY)
        case Embeddings.HUGGINGFACE:
            embeddings_cls = embeddings.HuggingFaceEmbeddings()
        case Embeddings.TENSORFLOW:
            embeddings_cls = embeddings.TensorflowHubEmbeddings()
        case Embeddings.HUGGINGFACE_INSTRUCT:
            embeddings_cls = embeddings.HuggingFaceInstructEmbeddings()
        case Embeddings.SELFHOST:
            embeddings_cls = embeddings.SelfHostedEmbeddings()
        case Embeddings.SELFHOST_HUGGINGFACE:
            embeddings_cls = embeddings.SelfHostedHuggingFaceEmbeddings()
        case Embeddings.SELFHOST_HUGGINGFACE_INSTRUCT:
            embeddings_cls = embeddings.SelfHostedHuggingFaceInstructEmbeddings()
        case _:
            raise NotImplementedError
    return embeddings_cls