# pull official base image
FROM python:3.8.3-alpine

# set work directory
RUN mkdir /code
WORKDIR /code

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk add --no-cache --update \
    python3 python3-dev gcc \
    gfortran musl-dev g++ \
    libffi-dev openssl-dev \
    libxml2 libxml2-dev \
    libxslt libxslt-dev \
    libjpeg-turbo-dev zlib-dev \
    libsodium-dev build-base libzmq musl-dev zeromq-dev

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev

# install dependencies
RUN pip install --upgrade pip
COPY ./backend/requirements.txt /code/
RUN pip install wheel
RUN \ 
    pip3 install --no-cache-dir Cython
RUN pip install -r requirements.txt

# copy entrypoint.sh
COPY entrypoint.sh /code/

# copy project
COPY ./backend /code/

# run entrypoint.sh
ENTRYPOINT ["sh", "/code/entrypoint.sh"]