from json import dumps

from firebase_functions import https_fn, options
from handlers import get_response_from_llm


@https_fn.on_request(cors=options.CorsOptions(cors_origins=['*']))
def get_response_url(req: https_fn.Request) -> https_fn.Response:
    query = req.get_json().get('query', '')
    llms = req.get_json().get('llms', ['gpt-4'])
    responses = {}
    for llm in llms:
        response = get_response_from_llm(query, llm)
        responses[llm] = response
    return https_fn.Response(dumps(responses), mimetype='application/json')


@https_fn.on_call(memory=options.MemoryOption.GB_32, cpu=8, timeout_sec=300)
def get_response(req: https_fn.CallableRequest):
    query = req.data.get('query', '')
    llms = req.data.get('llms', ['gpt-4'])
    responses = {}
    for llm in llms:
        response = get_response_from_llm(query, llm)
        responses[llm] = response
    return responses
