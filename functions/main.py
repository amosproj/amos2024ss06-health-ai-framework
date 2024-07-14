from json import dumps

from firebase_functions import https_fn, options
# from handlers import get_response_from_llm
from chain import hist_aware_answers


@https_fn.on_request(cors=options.CorsOptions(cors_origins=['*']))
def get_response_url(req: https_fn.Request) -> https_fn.Response:
    print(req.get_json())
    query = req.get_json().get('query', '')
    llms = req.get_json().get('llms', ['gpt-4'])
    # chat_history = req.data.get_json().get
    for llm in llms:
        responses = hist_aware_answers(llm, query) #, chat_history)
        # responses[llm] = response
    return https_fn.Response(dumps(responses), mimetype='application/json')


@https_fn.on_call()
def get_response(req: https_fn.CallableRequest):
    print(req.get_json())
    query = req.data.get('query', '')
    llms = req.data.get('llms', ['gpt-4'])
    # chat_history = req.data.get
    for llm in llms:
        responses = hist_aware_answers(llm, query) # , chat_history)
        # responses[llm] = response
    return responses
