from src.backend.Orchestrator.orchestrator import Orchestrator
from src.backend.ScrappingTarget.all_recipes_target import AllRecipesTarget

if __name__ == '__main__':
    target = AllRecipesTarget()
    Orchestrator.run_target(target)
