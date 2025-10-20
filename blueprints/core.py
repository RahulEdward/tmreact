from flask import Blueprint, current_app, send_from_directory, jsonify
import os

core_bp = Blueprint('core_bp', __name__)

@core_bp.route('/')
def home():
    return jsonify({
        'status': 'success',
        'message': 'TradingMaven API is running',
        'version': '1.0.0'
    })

@core_bp.route('/about')
def about():
    return jsonify({
        'status': 'success',
        'app': 'TradingMaven',
        'description': 'Trading platform with Flask backend and React frontend',
        'version': '1.0.0'
    })

@core_bp.route('/docs/')
def docs():
    docs_dir = os.path.join(current_app.root_path, 'docs')
    return send_from_directory(docs_dir, 'index.html')

@core_bp.route('/docs/<path:filename>')
def docs_file(filename):
    docs_dir = os.path.join(current_app.root_path, 'docs')
    return send_from_directory(docs_dir, filename)
