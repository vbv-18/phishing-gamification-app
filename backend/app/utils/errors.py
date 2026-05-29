from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

def setup_exception_handlers(app: FastAPI): #to clean errors of username, password and email
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        errors_list = []
        
        for error in exc.errors():
            field = error["loc"][-1] if error["loc"] else None
            original = error["msg"]
            
            if field in ["username", "password"]:
                clean_msg = original.replace("Value error, ", "", 1)
            
            elif field == "email" and "valid email address" in original.lower():
                clean_msg = "Invalid email format, it must contain a @-sign and .[com]"
            
            else:
                clean_msg = original

            errors_list.append(clean_msg)
        
        mensaje_final = "\n".join(errors_list)

        return JSONResponse(status_code=422, content={"detail": mensaje_final})