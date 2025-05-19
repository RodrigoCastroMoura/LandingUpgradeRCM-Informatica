import os
import logging
from flask import Flask, render_template, request, jsonify

# Setup logging
logging.basicConfig(level=logging.DEBUG)

# Create the Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "rcm-informatica-secret-key")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit_contact', methods=['POST'])
def submit_contact():
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        message = request.form.get('message')
        
        # Log the form submission (in a real app, you'd save to database or send email)
        logging.info(f"Contact form submission: {name}, {email}, {phone}, {message}")
        
        # In a production environment, you would handle this data (send email, save to DB, etc.)
        return jsonify({"success": True, "message": "Mensagem enviada com sucesso! Entraremos em contato em breve."})
    except Exception as e:
        logging.error(f"Error processing contact form: {str(e)}")
        return jsonify({"success": False, "message": "Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente."})
