from flask import Flask, render_template, request, jsonify
from dictionary import Dictionary
from solver import Solver

app = Flask(__name__)

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dictionary_path = os.path.join(BASE_DIR, "words_ru.txt")
dictionary = Dictionary(dictionary_path)

solver = Solver(dictionary)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/solve", methods=["POST"])
def solve():
    data = request.json

    letters = data.get("letters", "").lower()
    min_length = int(data.get("min_length", 3))
    letters = "".join(c for c in letters if c.isalpha())
    words = solver.find_words(letters, min_length)
    return jsonify(sorted(words, key=lambda w: (len(w), w)))


@app.route("/add_word", methods=["POST"])
def add_word():
    data = request.json
    word = data.get("word", "").strip().lower()
    if len(word) < 3 or not word.isalpha():
        return jsonify({"status": "error", "message": "Некорректное слово"})
    if word in dictionary.words:
        return jsonify({"status": "exists", "message": "Слово уже есть"})
    dictionary.add_word(word)
    return jsonify({"status": "ok", "message": f"Слово '{word}' добавлено"})


@app.route("/delete_word", methods=["POST"])
def delete_word():
    data = request.json
    word = data.get("word", "").strip().lower()
    if word not in dictionary.words:
        return jsonify({"status": "error", "message": "Слово не найдено"})
    dictionary.remove_word(word)
    return jsonify({"status": "ok", "message": f"Слово '{word}' удалено"})


if __name__ == "__main__":
    app.run(debug=True)
