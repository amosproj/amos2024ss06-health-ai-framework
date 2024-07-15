from firebase_functions import https_fn, options
from handlers import get_response_from_llm, get_custom_instructions
from json import dumps

@https_fn.on_request(cors=options.CorsOptions(cors_origins=['*']))
def get_custom_instructions_url(req: https_fn.Request) -> https_fn.Response:
    user_id = req.get_json().get('user_id', '')
    instructions = get_custom_instructions(user_id)
    return https_fn.Response(dumps(instructions), mimetype='application/json')

@https_fn.on_call()
def get_custom_instructions_callable(req: https_fn.CallableRequest):
    user_id = req.data.get('user_id', '')
    return get_custom_instructions(user_id)

@https_fn.on_request(cors=options.CorsOptions(cors_origins=['*']))
def get_response_url(req: https_fn.Request) -> https_fn.Response:
    query = req.get_json().get('query', '')
    llms = req.get_json().get('llms', ['gpt-4'])
    responses = {}
    for llm in llms:
        response = get_response_from_llm(query, llm)
        responses[llm] = response
    return https_fn.Response(dumps(responses), mimetype='application/json')

@https_fn.on_call()
def get_response(req: https_fn.CallableRequest):
    query = req.data.get('query', '')
    llms = req.data.get('llms', ['gpt-4'])
    responses = {}
    for llm in llms:
        response = get_response_from_llm(query, llm)
        responses[llm] = response
    return responses