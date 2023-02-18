# Docker build for FastAPI
#
# Inspired from:
#   - https://github.com/tiangolo/uvicorn-gunicorn-docker/blob/master/docker-images/python3.9-alpine3.14.dockerfile
#
# Used for Railway deploys
#

# ---------------------------------------------------------------------------------------------------------------------
# Stage 0: base image
#
# Purpose: Allow default env variables, and build tools
# ---------------------------------------------------------------------------------------------------------------------
FROM condaforge/mambaforge as base
RUN apt-get update && apt-get upgrade -y
    # apt-get install -y \
    # build-essential python3-dev libpq-dev
WORKDIR /app/apps/api

# Custom args
ENV PORT=8000 \
    HOST=0.0.0.0 \
    GUNICORN_CONF=gunicorn_conf.py \
    WORKER_CLASS=uvicorn.workers.UvicornWorker \
    APP_MODULE=src.solidchain_api.main:app

# ---------------------------------------------------------------------------------------------------------------------
# Stage 1: production environment
# ---------------------------------------------------------------------------------------------------------------------
FROM base as runner

# Is there a better way to do this?
COPY ./environment.yml /tmp/environment.yml
COPY ./apps/api/ /app/apps/api/

# Install dependencies
RUN mamba env create -f /tmp/environment.yml && \
    mamba clean --all --yes

RUN mamba run -n solidchain pip install -e /app/apps/api

# Run prestart.sh if it exists (e.g. for migrations)

# Start Gunicorn with Uvicorn
EXPOSE $PORT
CMD [ \
    "sh", "-c", \
    "mamba run -n solidchain env HOST=$HOST gunicorn -k $WORKER_CLASS -c $GUNICORN_CONF $APP_MODULE" \
]