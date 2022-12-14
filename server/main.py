import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from server.clients.bigquery import GoogleBigQueryTextToResult

########
# FastAPI
########
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class MetricRequest(BaseModel):
    # TODO: check that these aren't None?
    title: str | None
    query: str | None


@app.post("/metric")
def get_metric(metricRequest: MetricRequest):
    dict_metricRequest = metricRequest.dict()

    result = GoogleBigQueryTextToResult(dict_metricRequest["query"].strip())

    return JSONResponse(jsonable_encoder({"value": result}))


if __name__ == "__main__":
    # start server
    uvicorn.run(app, host="127.0.0.1", port=58000, log_level="debug")
