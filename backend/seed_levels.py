from app.database.connection import SessionLocal
from app.crud.level import create_level
from app.models.level import Level

#future -> levels in separates json files
#ref: https://www.incibe.es/ciudadania/tematicas/ingenieria-social-fraudes-online/phishing
#a lo mejor poner solo una pildora de teoria por modulo?

LEVEL1 = {
  "module": "email",
  "difficulty": 1,
  "title": "Detective de señales básicas",
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
      "exercise_type": "signal_classification",
      "instructions": "¿El siguiente elemento es una señal de phishing?",
      "questions": [
        {
          "id": 1,
          "context": "Tu paquete está retenido",
          "text": "Para poder entregar tu envío, realiza el pago pendiente en el siguiente enlace: PROGRAMAR ENTREGA",
          "is_suspicious": True,
          "feedback_correct": "¡Bien visto! Desconfía si recibes un mensaje que no estabas esperando",
          "feedback_wrong": "¡No es correcto! Este correo es inesperado, algo que no has solicitado, ¡No te fíes!",
        },
        {
          "id": 2,
          "context": "Verifique su cuenta urgentemente",
          "text": "Si no verifica su cuenta en las próximas 24 horas, será suspendida permanentemente.",
          "is_suspicious": True,
          "feedback_correct": "¡Exacto! La urgencia es una táctica típica para que actúes sin pensar",
          "feedback_wrong": "¡Incorrecto! Los atacantes buscan presionarte con amenazas inmediatas, ¡No caigas!",
        },
        {
          "id": 3,
          "context": "Verificación de seguridad",
          "text": "Tu cuenta ha sido bloqueada por actividad inusual, introduzca la contraseña AQUí para desbloquearla.",
          "is_suspicious": True,
          "feedback_correct": "¡Excelente! Ninguna empresa legítima te pedirá contraseñas, códigos de verificación o datos bancarios por correo electrónico",
          "feedback_wrong": "¡No es correcto! Ninguna empresa te pedirá información confidenciañ por email, ¡Nunca la compartas!",
        },
        {
          "id": 4,
          "context": "Actualiza tu información bancaria",
          "text": "Para ello, accede aquí: https://banco-seguridad-verifica.com/login",
          "feedback_correct": "¡Perfecto! Aunque el enlace parezca legítimo, puede variar ligeramente, ¡Comprueba siempre!",
          "feedback_wrong": "¡Incorrecto! Los atacantes suelen usar dominios parecidos para engañar. ¡Revisa siempre!",
        },
        {
         "id": 5,
          "context": "Has sido elejido para premio esclusivo!",
          "text": "Usted ha sido seleccionado para recibir un nuebo regalo especial.",
          "is_suspicious": True,
          "feedback_correct": "¡Bien visto! Las faltas de ortografía son comunes en correos fraudulentos",
          "feedback_wrong": "¡Oh no! Los errores ortográficos suelen indicar que no es un correo legítimo, ¡Fíjate bien!",
        },
        {
          "id": 6,
          "context": "Pago realizado con éxito",
          "text": "Querido cliente, su pago ha sido recibido.",
          "is_suspicious": True,
          "feedback_correct": "¡Excelente! Las empresas legítimas suelen dirigirse a ti por tu nombre",
          "feedback_wrong": "¡No es correcto! Los correos legítimos suelen dirigirse a ti por tu nombre",
        },
        { 
          "id": 7,
          "context": "Tu paquete está en camino",
          "text": "Tu envío ha sido procesado correctamente y llegará dentro del plazo estimado",
          "is_suspicious": False,
          "feedback_correct": "¡Perfecto! Solo te informan, no te piden nada",
          "feedback_wrong": "¡Incorrecto! Es legítimo, solo te informa, no te pide datos personales",
        },
        {
          "id": 8,
          "context": "Aviso de seguridad",
          "text": "Hemos detectado un inicio de sesión desde un dispositivo nuevo. Si fuiste tú, no necesitas hacer nada. Si no lo reconoces, accede a tu cuenta desde la web oficial para revisar tu actividad.",
          "is_suspicious": False,
          "feedback_correct": "¡Muy bien! Seguridad real, te avisan sin solicitar datos personales",
          "feedback_wrong": "¡Casi! Es un correo legítimo, solo te informa",
        },
        {
          "id": 9,
          "context": "Actualización bancaria",
          "text": "Tu banco ha actualizado sus términos y condiciones. Puedes consultarlos entrando a tu banca online desde la página oficial que usas habitualmente.",
          "is_suspicious": False,
          "feedback_correct": "Bien visto! Te redirigen a la web oficial, no un enlace falso",
          "feedback_wrong": "¡Vaya! Es legítimo, te piden acceso por la vía oficial",
        }
      ]
  },
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
