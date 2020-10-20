#!/usr/bin/env python
import pyodbc
import logging

from database import db_session, init_db
from flask import Flask
from schema import schema

from flask_graphql import GraphQLView

logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARN)


app = Flask(__name__)
app.debug = True

example_query = """
{
}
"""


app.add_url_rule(
    "/graphql", view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True)
)


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


if __name__ == "__main__":
    init_db()
    app.run()
