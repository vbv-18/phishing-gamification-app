from app.database.connection import SessionLocal
from app.crud.level import create_level, create_module
from app.models.level import Level
from app.models.module import Module
import json
import os

#ref: https://www.incibe.es/ciudadania/tematicas/ingenieria-social-fraudes-online/phishing

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data")

def get_data_from_json():  #iterates through the data/*_module folders and extracts the levels
    data = []

    if not os.path.exists(DATA_PATH):
        print(f"ERROR: Folder not found in {DATA_PATH}")
        return data
    
    module_folders = sorted(os.listdir(DATA_PATH))
    
    for module_folder in module_folders:
        module_path = os.path.join(DATA_PATH, module_folder)

        if not os.path.isdir(module_path):
            continue

        theory_file = os.path.join(module_path, 'theory.json')
        if not os.path.exists(theory_file):
            continue

        module = None
        try:
            with open(theory_file, 'r', encoding='utf-8') as f:
                module = json.load(f)

        except Exception as e:
            print(f"ERROR reading theory file in {module_folder}: {e}")

        module_levels = []
        for file in os.listdir(module_path):
              if not file.endswith(".json") or file == 'theory.json':
                  continue
        
              try:
                  file_path = os.path.join(module_path, file)
                  with open(file_path, "r", encoding="utf-8") as f:
                      level_content = json.load(f)
                      module_levels.append(level_content)

              except Exception as e:
                  print(f"ERROR reading {file}: {e}")
                
        module_levels.sort(key=lambda x: x.get("difficulty", 0))
        data.append({'module': module, 'levels': module_levels})

    return data

def seed():
    db = SessionLocal()
    data_to_insert = get_data_from_json()

    for item in data_to_insert:
        try: 
            module = item["module"]
            m_id = module['module_id']

            m_exists = (db.query(Module).filter(Module.id == m_id).first())
            if not m_exists:
                create_module(db, module)
                print(f"Module {m_id} inserted")
            else:
                print(f"Module {m_id} already exists")

            for index, level in enumerate(item['levels'], start=1):
                difficulty = level['difficulty']

                l_exists = (db.query(Level).filter(Level.module_id == m_id, Level.module_level == index).first())
                if not l_exists:
                    level['module_id'] = m_id
                    level['module_level'] = index
                    create_level(db, level)
                    print(f"Level {index} inserted in module {m_id}")
                else:
                    print(f"Level {index} already exists")

        except Exception as e:
            db.rollback()
            print(f"ERROR: {e}")

    db.close()

if __name__ == "__main__":
    seed()
