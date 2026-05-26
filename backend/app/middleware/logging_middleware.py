from flask import request
import logging
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def logging_middleware():
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    method = request.method
    path = request.path
    ip = request.remote_addr
    
    logger.info(f"[{timestamp}] {method} {path} from {ip}")