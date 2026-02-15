from app.database.connection import SessionLocal
from app.crud.level import create_level
from app.models.level import Level

#future -> levels in separates json files
#ref: https://www.incibe.es/ciudadania/tematicas/ingenieria-social-fraudes-online/phishing
#a lo mejor poner solo una pildora de teoria por modulo?

LEVEL1 = {
  "module": "email",
  "difficulty": 1,
  "title": "Señales básicas",
  "theory": [
    {
      "type": "icons",
      "title": "¿Qué es el phishing?",
      "description": "Intento de engaño en el que alguien se hace pasar por una persona/empresa legítima para que compartas información sensible.",
      "media": [
        { "icon": "account-alert", "label": "Suplantanción de identidad" },
        { "icon": "link", "label": "Enlace malicioso" },
        { "icon": "lock", "label": "Robo de datos" }
      ]
    },
    {
      "type": "signal",
      "title": "Correo inesperado",
      "explanation": "Desconfía si recibes un mensaje que no estabas esperando.",
      "example": {
        "subject": "Tu paquete está retenido.",
        "body": "Para poder entregar tu envío, realiza el pago pendiente en el siguiente enlace."
      },
      "remember": "Si no has pedido nada, no deberías tener que pagar nada."
    },
    {
      "type": "signal",
      "title": "Urgencia o amenaza",
      "explanation": "Los atacantes generan sensación de urgencia para que actúes sin pensar ni verificar.",
      "example": {
        "subject": "Verifique su cuenta urgentemente",
        "body": "Si no verifica su cuenta en las próximas 24 horas, será suspendida permanentemente."
      },
      "remember": "Las empresas legítimas no amenazan con bloqueos inmediatos por email."
    },
    {
      "type": "signal",
      "title": "Solicitud de datos sensibles",
      "explanation": "Ninguna empresa legítima te pedirá contraseñas, códigos de verificación o datos bancarios por correo electrónico.",
      "example": {
        "subject": "Verificación de seguridad.",
        "body": "Introduce aquí tu contraseña y código SMS para confirmar tu identidad."
      },
    },
    {
      "type": "signal",
      "title": "Enlaces sospechosos",
      "explanation": "El enlace puede parecer legítimo, pero el dominio puede estar ligeramente modificado.",
      "example": {
        "subject": "Actualiza tu información bancaria.",
        "body": "Accede aquí: https://banco-seguridad-verifica.com/login"
      },
      "remember": "Fíjate bien en el dominio. Pequeños cambios pueden indicar suplantación."
    },
    {
      "type": "signal",
      "title": "Faltas de ortografía",
      "explanation": "Algunos correos fraudulentos contienen errores gramaticales o frases poco naturales.",
      "example": {
        "subject": "Has sido elejido para premio esclusivo",
        "body": "Usted ha sido seleccionado para recibir un nuebo regalo especial."
      },
    },
  ],
  "content": {
    "email_subject": "Verifica tu cuenta urgentemente",
    "email_body": "Estimado cliente, hemos detectado actividad inusual en su cuenta. Si no verifica su identidad en las próximas 24 horas, su acceso será temporalmente suspendido.",
    "elements": [
      {
        "id": 1,
        "type": "text",
        "display_text": "Asunto: Verifica tu cuenta urgentemente",
        "raw_value": "Verifica tu cuenta urgentemente",
        "is_suspicious": True,
        "reason_key": "urgency"
      },
      {
        "id": 2,
        "type": "text",
        "display_text": "Saludo: Estimado cliente",
        "raw_value": "Estimado cliente",
        "is_suspicious": True,
        "reason_key": "generic_salutation"
      },
      {
        "id": 3,
        "type": "text",
        "display_text": "Mensaje: hemos detectado actividad inusual en su cuenta",
        "raw_value": "hemos detectado actividad inusual en su cuenta",
        "is_suspicious": True,
        "reason_key": "threat"
      },
      {
        "id": 4,
        "type": "link",
        "display_text": "Verificar cuenta",
        "raw_value": "http://banco-seguro-verificacion.com/login",
        "is_suspicious": True,
        "reason_key": "fake_link"
      },
      {
        "id": 5,
        "type": "text",
        "display_text": "Firma: Equipo de Seguridad",
        "raw_value": "Equipo de Seguridad",
        "is_suspicious": False,
        "reason_key": "neutral"
      }
    ]
  },
  "feedback": {
    "urgency": "Los atacantes generan sensación de urgencia para que actúes sin pensar ni verificar.",
    "generic_salutation": "Los servicios legítimos suelen usar tu nombre real, no saludos genéricos.",
    "threat": "Mencionar actividad sospechosa sin detalles concretos es una táctica habitual para generar miedo.",
    "fake_link": "El dominio no coincide exactamente con el oficial de la entidad. Pequeñas variaciones pueden indicar suplantación.",
    "neutral": "Este elemento no es sospechoso por sí mismo."
  },
  "points": 15
}


LEVELS= [
    LEVEL1
]

def seed():
    db = SessionLocal()

    for level_data in LEVELS:
        module = level_data["module"]
        difficulty = level_data["difficulty"]

        exists = (db.query(Level).filter(Level.module == module, Level.difficulty == difficulty).first())
        if exists:
            print(f"Level in module {module} with {difficulty} difficulty already exists")
            continue

        create_level(db, level_data)
        print(f"Level in module {module} with {difficulty} difficulty insert")

    db.close()

if __name__ == "__main__":
    seed()
