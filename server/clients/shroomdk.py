import json
import os
import time

import requests

from server.clients.base import SQLRunner

API_SHROOM_KEY = os.environ["API_SHROOM_KEY"]
TTL_MINUTES = 15
# TODO: fix below -- so we make sure we get all results!
# return up to 100,000 results per GET request on the query id
PAGE_SIZE = 100000
# return results of page 1
PAGE_NUMBER = 1


class ShroomDKQuerySQLRunner(SQLRunner):
    def __init__(self):
        super().__init__()

    def _create_query(self, query: str):
        r = requests.post(
            "https://node-api.flipsidecrypto.com/queries",
            data=json.dumps({"sql": query, "ttlMinutes": TTL_MINUTES}),
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-api-key": API_SHROOM_KEY,
            },
        )
        if r.status_code != 200:
            raise Exception(
                f"Error creating query, got response: {r.text} with status code: {str(r.status_code)}"
            )

        print(r.text)

        return json.loads(r.text)

    def _get_query_results(self, token: str):
        while True:
            r = requests.get(
                f"https://node-api.flipsidecrypto.com/queries/{token}?pageNumber={PAGE_NUMBER}&pageSize={PAGE_SIZE}",
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "x-api-key": API_SHROOM_KEY,
                },
            )
            if r.status_code != 200:
                raise Exception(
                    f"Error querying created query, got response: {r.text} with status code: {str(r.status_code)}"
                )

            data = json.loads(r.text)
            if data["status"] == "running":
                print(data)
                time.sleep(10)
            else:
                return data

    def run_sql(self, sql: str):
        # Create query
        query = self._create_query(sql)

        token = query["token"]

        # Get query results
        data = self._get_query_results(token)

        return data
