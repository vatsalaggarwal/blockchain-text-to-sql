"""
Contains the code for querying Google BigQuery server AND querying LLMs customised
to specific tables in google's bigquery database.
"""
import os

from google.cloud import bigquery
from llmhub.client import Client as LLMHubClient

from server.clients.base import SQLRunner, TextToResult, TextToSQL

LLMHUB_TEXT_TO_SQL_LINK = "https://www.llmhub.com/2/functions/23/share"


class GoogleBigQuerySQLRunner(SQLRunner):
    def __init__(self):
        super().__init__()

        if not os.path.exists(os.environ["GOOGLE_APPLICATION_CREDENTIALS"]):
            raise Exception(
                "GOOGLE_APPLICATION_CREDENTIALS environment variable not set. This is required to connect to Google BigQuery."
            )
        self.client = bigquery.Client()

    def run_sql(self, sql):
        # Perform a query.
        query_job = self.client.query(sql)  # API request
        rows = query_job.result().to_dataframe()  # Waits for query to finish

        return rows


class GoogleBigQueryTextToSql(TextToSQL):
    def __init__(self) -> None:
        super().__init__()
        self.llm = LLMHubClient(LLMHUB_TEXT_TO_SQL_LINK)

    def create_sql(self, prompt: str) -> str:
        output = self.llm.run(
            {
                "prompt": prompt,
            }
        )["output"]

        return output


class GoogleBigQueryTextToResult(TextToResult):
    @property
    def query_generator_class(self):
        return GoogleBigQueryTextToSql

    @property
    def query_executor_class(self):
        return GoogleBigQuerySQLRunner
