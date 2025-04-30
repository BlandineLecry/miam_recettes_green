from flask import Blueprint, request, jsonify
from db import get_connection
import mysql.connector

recipe_bp = Blueprint('recipes', __name__, url_prefix='/recipes')

@recipe_bp.route('/', methods=['POST'])
def add_recipe():
    data = request.json
    title = data.get('title')
    ingredients = data.get('ingredients')
    instructions = data.get('instructions')
    image_name = data.get('image_name')
    cleaned_ingredients = data.get('cleaned_ingredients')
    user_id = data.get('userId')

    if not all([title, ingredients, instructions, user_id]):
        return jsonify(error="Champs manquants"), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO recettes (title, ingredients, instructions, image_name, cleaned_ingredients, user_id) VALUES (%s, %s, %s, %s, %s, %s)",
            (title, ingredients, instructions, image_name, cleaned_ingredients, user_id)
        )
        conn.commit()
        return jsonify(message="Recette ajoutée !"), 201
    except mysql.connector.Error as e:
        return jsonify(error=str(e)), 500
    finally:
        cursor.close()
        conn.close()

@recipe_bp.route('/<int:id>', methods=['PUT'])
def update_recipe(id):
    data = request.json
    title = data.get('title')
    ingredients = data.get('ingredients')
    instructions = data.get('instructions')
    image_name = data.get('image_name')
    cleaned_ingredients = data.get('cleaned_ingredients')
    user_id = data.get('userId')

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM recettes WHERE id = %s AND user_id = %s", (id, user_id))
        recette = cursor.fetchone()
        if not recette:
            return jsonify(error="Pas autorisé"), 403

        cursor.execute(
            "UPDATE recettes SET title = %s, ingredients = %s, instructions = %s, image_name = %s, cleaned_ingredients = %s WHERE id = %s",
            (title, ingredients, instructions, image_name, cleaned_ingredients, id)
        )
        conn.commit()
        return jsonify(message="Recette mise à jour !")
    except mysql.connector.Error as e:
        return jsonify(error=str(e)), 500
    finally:
        cursor.close()
        conn.close()

@recipe_bp.route('/', methods=['GET'])
def get_user_recipes():
    data = request.json
    user_id = data.get('userId')

    if not user_id:
        return jsonify(error="userId manquant"), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM recettes WHERE user_id = %s", (user_id,))
        recettes = cursor.fetchall()
        return jsonify(recettes)
    except mysql.connector.Error as e:
        return jsonify(error=str(e)), 500
    finally:
        cursor.close()
        conn.close()