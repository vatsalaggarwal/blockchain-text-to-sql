from server.clients.bigquery import (
    GoogleBigQuerySQLRunner,
    GoogleBigQueryTextToResult,
    GoogleBigQueryTextToSql,
)

## Unit Tests


def test_google_query_sqlrunner():
    bq = GoogleBigQuerySQLRunner()

    QUERY = """SELECT *
    FROM bigquery-public-data.crypto_ethereum.transactions
    LIMIT 1"""

    results = bq.run_sql(QUERY)

    for row in results:
        print(row)


def test_text_to_sql():
    gen = GoogleBigQueryTextToSql()
    PROMPT = "All wallets with at least 1000 balance."
    print(gen.create_sql(PROMPT))

    PROMPT = "All wallets sorted by balance"
    print(gen.create_sql(PROMPT))

    PROMPT = "All wallets with at least 1000 balance. 2 rows only."
    print(gen.create_sql(PROMPT))

    PROMPT = "All wallets sorted by balance. 2 rows only."
    print(gen.create_sql(PROMPT))


## Integration tests


def test_text_to_result_in_steps():
    gen = GoogleBigQueryTextToSql()
    bq = GoogleBigQuerySQLRunner()

    for prompt in [
        "All wallets with at least 1000 balance. 2 rows only.",
        "All wallets sorted by balance. 2 rows only.",
    ]:
        sql = gen.create_sql(prompt)
        rows = bq.run_sql(sql)

        print("----")
        print(prompt)
        print(sql)
        print("----")
        print([r for r in rows])
        print()


def test_text_to_result():
    api = GoogleBigQueryTextToResult()
    for prompt in [
        "All wallets with at least 1000 balance. 2 rows only.",
        "All wallets sorted by balance. 2 rows only.",
    ]:
        results = api.run_prompt(prompt)
        print(results)


if __name__ == "__main__":
    test_google_query_sqlrunner()
    test_text_to_sql()
    test_text_to_result_in_steps()
    test_text_to_result()
