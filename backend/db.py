import mysql.connector
from mysql.connector import pooling

# Configuration du pool de connexions vers MySQL
dbconfig = {
    'host': 'localhost',
    'user': 'root',
    'password': 'NouveauMotDePasse',
    'database': 'recettes',
}

pool = mysql.connector.pooling.MySQLConnectionPool(**dbconfig)

def get_connection():
    """Récupère une connexion du pool"""
    return pool.get_connection()