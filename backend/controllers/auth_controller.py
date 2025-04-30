from flask import Blueprint, request, jsonify
import bcrypt
from db import get_connection
import mysql.connector

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not all([username, password, role]):
        return jsonify(error="Champs manquants"), 400

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (username, password, role) VALUES (%s, %s, %s)",
            (username, hashed.decode('utf-8'), role)
        )
        conn.commit()
        return jsonify(message="Utilisateur créé !"), 201
    except mysql.connector.Error as e:
        return jsonify(error=str(e)), 500
    finally:
        cursor.close()
        conn.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify(error="Utilisateur non trouvé"), 400

        if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify(error="Mot de passe incorrect"), 400

        return jsonify(message="Connexion réussie", userId=user['id'])
    except mysql.connector.Error as e:
        return jsonify(error=str(e)), 500
    finally:
        cursor.close()
        conn.close()