# Solidchain

This is a web-based application built with [SolidJS](https://www.solidjs.com/) and [LangChain](https://langchain.readthedocs.io/en/latest/), which allows you to index a collection of documents (such as markdown files, PDFs, chat logs, etc.) and search using natural language. The application uses LangChain for chain of thought (CoT) reasoning, and agent based reasoning (e.g. MRKL & ReAct)

## Installation

This application has two components, a frontend built with [SolidStart](https://start.solidjs.com/getting-started/what-is-solidstart), and an api layer built with [FastAPI](https://fastapi.tiangolo.com/) and [LangChain](https://langchain.readthedocs.io/en/latest/).

### Web

To run the webapp:

```sh
cd apps/web
pnpm install
pnpm dev
```

### API

To run the api, first create a virtual environment. We provide a sample `environment.yml` file to use with conda environments:

```sh
cd apps/api
conda create -f environment.yml
```

Now run the api (in dev) with:

```sh
uvicorn src.solidchain.main:app --port 8000 --reload
```

The documentation (OpenAPI) can be found at `localhost:8000/docs`
