from src.backend.Config.config import Config

from src.backend.Orchestrator.orchestrator import Orchestrator

if __name__ == '__main__':
  config = Config.from_json()
  # config.add_target(AllRecipesTarget(search_query='india'))
  # config.write_to_json()
  orchestrator = Orchestrator(config=config)
  orchestrator.run()
