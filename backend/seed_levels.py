from app.database.connection import SessionLocal
from app.crud.level import create_level
from app.models.level import Level

#future -> levels in separates json files

LEVEL1 = {
  "module": "email",
  "difficulty": 1,
  "title": "Señales básicas de phishing en un email",
  "theory": [
    {
      "type": "icons",
      "title": "¿Qué es el phishing?",
      "description": "Intento de engaño para robarte datos haciéndose pasar por alguien de confianza.",
      "media": [
        { "icon": "hook", "label": "Engaño" },
        { "icon": "email", "label": "Correo falso" },
        { "icon": "alert", "label": "Peligro" }
      ]
    },
    {
      "type": "cards",
      "title": "Señales básicas",
      "description": "Estas señales suelen aparecer en correos falsos.",
      "media": [
        { "icon": "link-off", "label": "URL falsa" },
        { "icon": "palette", "label": "Colores chillones" },
        { "icon": "image-broken", "label": "Logo mal hecho" },
        { "icon": "warning", "label": "Urgencia exagerada" }
      ]
    },
    {
      "type": "comparison",
      "title": "Correo real vs Correo falso",
      "description": "Los correos falsos suelen tener señales visuales muy evidentes.",
      "media": {
        "left": { "label": "Correo real", "image": "real_email_example" },
        "right": { "label": "Correo falso", "image": "fake_email_example" }
      }
    }
  ],
  "content": {
    "email_subject": "Actualiza tu cuenta urgentemente",
    "email_body": "Estimado cliente, su cuenta será suspendida hoy. Haga clic en el siguiente enlace para verificar su identidad.",
    "elements": [
      {
        "id": 1,
        "type": "text",
        "display_text": "Asunto: Actualiza tu cuenta urgentemente",
        "raw_value": "Actualiza tu cuenta urgentemente",
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
        "display_text": "Mensaje: su cuenta será suspendida hoy",
        "raw_value": "su cuenta será suspendida hoy",
        "is_suspicious": True,
        "reason_key": "threat"
      },
      {
        "id": 4,
        "type": "link",
        "display_text": "Verificar cuenta",
        "raw_value": "http://banco-seguro-verificacion.com",
        "is_suspicious": True,
        "reason_key": "fake_link"
      },
      {
        "id": 5,
        "type": "text",
        "display_text": "Firma: Equipo de Atención al Cliente",
        "raw_value": "Equipo de Atención al Cliente",
        "is_suspicious": False,
        "reason_key": "neutral"
      }
    ]
  },
  "feedback": {
    "urgency": "La urgencia exagerada es una táctica típica para meter presión.",
    "generic_salutation": "Los servicios legítimos suelen usar tu nombre real, no saludos genéricos.",
    "threat": "Las amenazas de suspensión inmediata son una señal clara de intento de presión.",
    "fake_link": "Los enlaces pueden parecer legítimos, pero el dominio suele ser falso o extraño.",
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
