import os
from flask import Flask, render_template

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

app = Flask(__name__, template_folder=TEMPLATES_DIR, static_folder=STATIC_DIR)

@app.route("/")
def index():
    return render_template("simulator.html")

if __name__ == "__main__":
    app.run(debug=False, port=2005)