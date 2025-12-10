from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from engine import AttackEngine, HealthMonitor
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

active_job = None
health_job = None

@app.websocket("/ws")
async def ws_endpoint(websocket: WebSocket):
    global active_job, health_job
    await websocket.accept()
    loop = asyncio.get_running_loop()

    def log_handler(msg):
        asyncio.run_coroutine_threadsafe(websocket.send_json({"type": "log", "data": msg}), loop)

    def status_handler(is_alive):
        asyncio.run_coroutine_threadsafe(websocket.send_json({"type": "status", "alive": is_alive}), loop)

    try:
        while True:
            data = await websocket.receive_json()
            cmd = data.get("cmd")
            
            if cmd == "START":
                if active_job: active_job.stop()
                if health_job: health_job.stop()
                
                tgt = data.get("target")
                prt = int(data.get("port"))
                top = data.get("topic")
                atype = data.get("type")
                
                await websocket.send_json({
                    "type": "log", 
                    "data": f"[!] TARGET ACQUIRED: {tgt} :: PORT {prt}"
                })
                
                health_job = HealthMonitor(tgt, prt, status_handler)
                health_job.start()

                active_job = AttackEngine(tgt, prt, top, atype, log_handler)
                active_job.start()
                
            elif cmd == "STOP":
                if active_job: active_job.stop()
                if health_job: health_job.stop()
                await websocket.send_json({"type": "log", "data": "🛑 OPERATION HALTED"})
                    
    except WebSocketDisconnect:
        if active_job: active_job.stop()
        if health_job: health_job.stop()