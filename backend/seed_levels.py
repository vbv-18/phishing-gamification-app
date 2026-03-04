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
          "text": "Para ello, accede aquí: http://www.banco-seguridad-verifica.com/login",
          "is_suspicious": True,
          "feedback_correct": "¡Perfecto! Un enlace legítimo siempre usará HTTPS (Hyper-Text Transfer Protocol Secure) en vez de HTTP ",
          "feedback_wrong": "¡Incorrecto! Un enlace sin HTTPS siempre es vulnerable, no cuenta con seguridad. ¡Revisa siempre!",
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

LEVEL2 = {
  "module": "email",
  "difficulty": 2,
  "title": "Inspector de Dominios",
  "theory": [],
  "content": {
    "exercise_type": "domain_analysis",
    "questions": [
      { 
        "id": 1,
        "type": "selection",
        "instructions": "Selecciona el dominio legítimo",
        "brand": "PayPal",
        "options": [
          {"domain": "paypal.com", "is_suspicious": False},
          {"domain": "paypa1.com", "is_suspicious": True},
        ],
        "feedback_correct": "¡Exacto! Un número puede suplantar a una letra: 1 -> l",
        "feedback_wrong": "¡Cuidado! Fíjate bien en cada carácter, usar un número en lugar de la letra real es un truco muy común",
      },
      {
        "id": 2,
        "type": "selection",
        "instructions": "Selecciona el dominio legítimo",
        "brand": "Banco Santander",
        "options": [
          {"domain": "bancosantander.es", "is_suspicious": False},
          {"domain": "banco-santander-secure.com", "is_suspicious": True},
        ],
        "feedback_correct": "¡Bien visto! Los dominios legítimos no necesitan palabras como 'secure'",
        "feedback_wrong": "¡Oh no! Los guiones y palabras extra como 'secure' son señales de alerta",
      },
      {
        "id": 3,
        "type": "selection",
        "instructions": "Selecciona el dominio legítimo",
        "brand": "Correos",
        "options": [
          {"domain": "correos.es", "is_suspicious": False},
          {"domain": "correos.click", "is_suspicious": True},
        ],
        "feedback_correct": "¡Perfecto! Aunque existan muchos TLDs válidos, las instituciones oficiales suelen mantener dominios con su marca y país (.es en este caso)",
        "feedback_wrong": "¡Atención! Un dominio oficial nunca utilizará '.click' o '.top' para el TLD (última cadena de caracteres después del último punto)",
      },
      {
        "id": 4,
        "type": "highlight",
        "instructions": "Inspecciona el enlace y selecciona la parte sospechosa. Puede que no haya ninguna.",
        "email": {
          "from": "novedades@arnazon.es",
          "subject": "Baliza V16 Homologada",
          "body": "olvídate de los triángulos, V16: Más visibilidad, menos riesgo, más protección. Cómprala ahora",
        },
        "url": {
          "full": "https://www.arnazon.com/balizaV16",
          "segments": [
            {"protocol": "https://", "is_suspicious": False},
            {"subdomain": "www.", "is_suspicious": False},
            {"domain": "arnazon", "is_suspicious": True},
            {"tld": ".com", "is_suspicious": False},
            {"path": "/balizaV16", "is_suspicious": False},
          ],
        },
        "allow_no_selection": True,
        "feedback_correct": "¡Exacto! 'rn' se utiliza para simular la letra 'm', así igual con otras letras, ¡Atenta/o que también ocurre en el remitente!",
        "feedback_wrong": "¡Incorrecto! Fíjate bien en el dominio: 'arnazon' no es 'amazon', han intercambiado la 'm' por 'rn'\n¡También ocurre en el remitente!",
      },
      {
        "id": 5,
        "type": "highlight",
        "instructions": "Inspecciona el enlace y selecciona la parte sospechosa. Puede que no haya ninguna.",
        "email": {
          "from": "seguridad@gruposantander.es",
          "subject": "Actualización de seguridad",
          "body": "La contraseña de la app Santander ha caducado, accede para actualizarla",
          "display_link": "https://www.bancosantander.es/seguridad"
        },
        "url": {
          "full": "https://www.banc0santander.es/fake",
          "segments": [
              {"protocol": "https://", "is_suspicious": False},
              {"subdomain": "www.", "is_suspicious": False},
              {"domain": "banc0santander", "is_suspicious": True},
              {"tld": ".es", "is_suspicious": False},
              {"path": "fake", "is_suspicious": True},
          ],
        },
        "allow_no_selection": True,
        "feedback_correct": "¡Correcto! El enlace visible no coincide con el real",
        "feedback_wrong": "¡Incorrecto! Siempre verifica manteniendo pulsado el enlace real",
      },
      {
        "id": 6,
        "type": "highlight",
        "instructions": "Inspecciona el enlace y selecciona la parte sospechosa. Puede que no haya ninguna.",
        "email": {
          "from": "no-reply@accounts.google.com",
          "subject": "Alerta de seguridad",
          "body": "Nuevo inicio de sesión en Android",
          "display_link": "Comprobar actividad"
        },
        "url": {
          "full": "https://myaccount.google.com/activity",
          "segments": [
              {"protocol": "https://", "is_suspicious": False},
              {"subdomain": "myaccount.", "is_suspicious": False},
              {"domain": "google", "is_suspicious": False},
              {"tld": ".com", "is_suspicious": False},
              {"path": "/activity", "is_suspicious": False},
          ],
        },
        "allow_no_selection": True,
        "suspicious_part": None,
        "feedback_correct": "¡Correcto! Tanto el remitente como el enlace son legítimos: uso de https, subdominio legítimo (myaccount.google.com) y ruta estándar (/activity)",
        "feedback_wrong": "¡No es correcto! No hay señales de suplantación: uso de https, subdominio legítimo (myaccount.google.com) y ruta estándar (/activity)",
      },
    ]
  }
}


LEVELS = [
    LEVEL1,
    LEVEL2
]

def seed():
    db = SessionLocal()

    for level_data in LEVELS:
        module = level_data["module"]
        difficulty = level_data["difficulty"]

        exists = (db.query(Level).filter(Level.module == module, Level.difficulty == difficulty).first())
        if exists:
            print(f"Level {difficulty} in module {module} already exists")
            continue

        create_level(db, level_data)
        print(f"Level {difficulty} in module {module} insert")

    db.close()

if __name__ == "__main__":
    seed()
