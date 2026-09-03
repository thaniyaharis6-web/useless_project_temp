import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "data"))

import random
from flask import Flask, request, jsonify, render_template
from songs import MOOD_SONGS, SARCASTIC_QUOTES, KEYWORD_MAP

app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static"
)

def detect_mood(text):
    """Match input text/button to one of the 5 emotions: angry, hyper, romantic, sad, happy."""
    text_lower = text.lower().strip()
    if text_lower in MOOD_SONGS:
        return text_lower
    for mood, keywords in KEYWORD_MAP.items():
        for kw in keywords:
            if kw in text_lower:
                return mood
    return "happy"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/vibe-check", methods=["POST"])
def vibe_check():
    data = request.get_json(force=True, silent=True) or {}
    raw_mood = data.get("mood", "").strip().lower()

    if not raw_mood:
        return jsonify({"error": "No mood provided"}), 400

    detected_mood = detect_mood(raw_mood)
    # Direct matching: "when the user gives an emotion any song under that particular emotion should be played"
    song = random.choice(MOOD_SONGS[detected_mood])

    # Grab a primary sarcastic quote + 3 bonus quotes for the interactive carousel/ticker
    all_quotes = SARCASTIC_QUOTES.get(detected_mood, [
        "\"Emotions detected. Modern science recommends turning it off and on again.\""
    ])
    selected_quote = random.choice(all_quotes)
    other_quotes = [q for q in all_quotes if q != selected_quote]

    return jsonify({
        "song": song,
        "caption": selected_quote,
        "bonus_quotes": other_quotes,
        "detected_mood": detected_mood,
    })

if __name__ == "__main__":
    print("Starting Vibe Mismatch on http://localhost:5001")
    app.run(debug=True, port=5001)
