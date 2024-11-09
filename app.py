from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_socketio import SocketIO
import json
import os
import time

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

DATA_FILE = r"C:\Users\stcsu\Desktop\questv3\questv3\data\quests.json"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit-quest', methods=['POST'])
def submit_quest():
    try:
        quest_data = request.json
        if not quest_data:
            return jsonify({"error": "No quest data provided"}), 400

        # Load existing data if the file exists, otherwise create an empty structure
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            data = {"jobs": []}

        # Format quest data to match required structure
        new_quest = {
            "job_id": f"{len(data['jobs']) + 1:03}",  # Generate a job ID
            "title": quest_data.get("name", ""),
            "description": quest_data.get("detail", ""),
            "location": quest_data.get("location", ""),
            "date_posted": quest_data.get("timestamp", "")[:10],  # Extract only the date part
            "requirements": [],  # Requirements can be added based on your criteria
            "price": int(quest_data.get("price", 0)),
            "status": "open"
        }

        # Append new quest to the jobs list
        data["jobs"].append(new_quest)

        # Save updated data back to the file
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        return jsonify({"message": "Quest saved successfully", "job_id": new_quest["job_id"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    socketio.run(app, debug=True)
