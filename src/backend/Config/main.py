from src.backend.Config.config import Config

from src.backend.ScrappingTarget.nutrition_target import NutritionTarget

if __name__ == '__main__':
    c = Config()
    c.add_target(NutritionTarget(max_pages=1))
    c.write_to_json()
