from flask import Flask, jsonify
import holidays

# Importera CORS
try:
    from flask_cors import CORS
except ImportError:
    pass

app = Flask(__name__)

# Använda CORS
try:
    CORS(app)
except NameError:
    pass

@app.route('/red-days/<year>', methods=['GET'])
def get_red_days(year):
    red_days = {}
    for date, name in sorted(holidays.Sweden(years=int(year)).items()):
        red_days[str(date)] = name
    return jsonify(red_days)

if __name__ == '__main__':
    app.run(port=5000)
