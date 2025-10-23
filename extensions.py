from flask_socketio import SocketIO
import os

# Configure SocketIO for Vercel deployment
if os.getenv('VERCEL'):
    # Vercel doesn't support WebSocket, use polling only
    socketio = SocketIO(
        cors_allowed_origins='*',
        transport=['polling'],
        logger=False,
        engineio_logger=False
    )
else:
    # Local development with full WebSocket support
    socketio = SocketIO(cors_allowed_origins='*')
