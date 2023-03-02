import langchain.embeddings as embeddings

from solidchain.schemas.embeddings import Embeddings


def get_embeddings_instance(embeddings_type: Embeddings):
    match embeddings_type:
        case Embeddings.OPENAI:
            vectorstore_cls = embeddings.OpenAIEmbeddings
        case Embeddings.COHERE:
            vectorstore_cls = embeddings.CohereEmbeddings
        case Embeddings.HUGGINGFACE:
            vectorstore_cls = embeddings.HuggingFaceEmbeddings
        case Embeddings.TENSORFLOW:
            vectorstore_cls = embeddings.TensorflowHubEmbeddings
        case Embeddings.HUGGINGFACE_INSTRUCT:
            vectorstore_cls = embeddings.HuggingFaceInstructEmbeddings
        case Embeddings.SELFHOST:
            vectorstore_cls = embeddings.SelfHostedEmbeddings
        case Embeddings.SELFHOST_HUGGINGFACE:
            vectorstore_cls = embeddings.SelfHostedHuggingFaceEmbeddings
        case Embeddings.SELFHOST_HUGGINGFACE_INSTRUCT:
            vectorstore_cls = embeddings.SelfHostedHuggingFaceInstructEmbeddings
        case _:
            raise NotImplementedError
    return vectorstore_cls