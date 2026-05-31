from fastapi import Request, FastAPI

def register_security_middleware(app: FastAPI):

    @app.middleware("http")
    async def add_security_headers(request: Request, call_next):
        response = await call_next(request)

        response.headers["X-Content-Type-Options"] = "nosniff" #against MIME type sniffing
        response.headers["X-Frame-Options"] = "DENY" #against clickjacking
        
        return response