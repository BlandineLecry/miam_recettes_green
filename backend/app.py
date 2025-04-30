from flask import Flask
from flask_cors import CORS
import controllers.auth_controller as auth_ctrl
import controllers.recipe_controller as recipe_ctrl

app = Flask(__name__)
CORS(app)

# Enregistrement des blueprints
app.register_blueprint(auth_ctrl.auth_bp)
app.register_blueprint(recipe_ctrl.recipe_bp)

if __name__ == '__main__':
    print("Backend Python Lancé")
    app.run(host='0.0.0.0', port=3000, debug=True)
    
