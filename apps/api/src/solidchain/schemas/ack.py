from pydantic import BaseModel


class Ack(BaseModel):
    message: str
