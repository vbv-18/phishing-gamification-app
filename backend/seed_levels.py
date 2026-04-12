from app.database.connection import SessionLocal
from app.crud.level import create_level
from app.models.level import Level
import json
import os

#ref: https://www.incibe.es/ciudadania/tematicas/ingenieria-social-fraudes-online/phishing
#a lo mejor poner solo una pildora de teoria por modulo?

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data")

def get_levels_from_json():  #iterates through the data/*_module folders and extracts the levels
    levels = []

    if not os.path.exists(DATA_PATH):
        print(f"ERROR: Folder not found in {DATA_PATH}")
        return levels
    
    for module_folder in os.listdir(DATA_PATH):
        module_path = os.path.join(DATA_PATH, module_folder)

        if not os.path.isdir(module_path):
            continue

        for file in os.listdir(module_path):
              if not file.endswith(".json"):
                  continue
                  
              file_path = os.path.join(module_path, file)

              try:
                  with open(file_path, "r", encoding="utf-8") as f:
                      data = json.load(f)
                      levels.append(data)
              except Exception as e:
                  print(f"ERROR reading {file}: {e}")
    return levels
    

def seed():
    db = SessionLocal()
    levels_to_insert = get_levels_from_json()
    levels_to_insert.sort(key=lambda x: (x.get("module", ""), x.get("difficulty", 0))) #mantain the difficulty order

    for level_data in levels_to_insert:
        try: 
          module = level_data["module"]
          difficulty = level_data["difficulty"]

          exists = (db.query(Level).filter(Level.module == module, Level.difficulty == difficulty).first())
          if exists:
              print(f"Level {difficulty} in module {module} already exists")
              continue

          create_level(db, level_data)
          print(f"Level {difficulty} in module {module} insert")

        except KeyError as k:
          print(f"ERROR: a key is missing: {k}")

        except Exception as e:
            print(f"ERROR: {e}")

    db.close()

if __name__ == "__main__":
    seed()
