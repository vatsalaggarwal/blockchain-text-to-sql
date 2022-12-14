import abc


class SQLRunner(abc.ABC):
    @abc.abstractmethod
    def run_sql(self, sql: str) -> str:
        pass


class TextToSQL(abc.ABC):
    def __init__(self) -> None:
        super().__init__()

    @abc.abstractmethod
    def create_sql(self, prompt: str) -> str:
        pass


class TextToResult(abc.ABC):
    def __init__(self) -> None:
        super().__init__()

        self.query_generator = self.query_generator_class()
        self.query_executor = self.query_executor_class()

    @property
    @abc.abstractmethod
    def query_generator_class(self):
        pass

    @property
    @abc.abstractmethod
    def query_executor_class(self):
        pass

    def run_prompt(self, prompt: str):
        sql = self.query_generator.create_sql(prompt)
        print(f"prompt: {prompt}, sql: {sql}")
        rows = self.query_executor.run_sql(sql)
        return rows
