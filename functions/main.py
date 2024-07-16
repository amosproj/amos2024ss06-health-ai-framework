from json import dumps

# from handlers import get_response_from_llm
from chain import hist_aware_answers
from firebase_functions import https_fn, options


@https_fn.on_request(memory=options.MemoryOption.GB_32, cpu=8, timeout_sec=540)
def get_response_url(req: https_fn.Request) -> https_fn.Response:
    query = req.get_json().get('query', '')
    llms = req.get_json().get('llms', ['gpt-4', 'gemini', 'claude'])
    chat = req.get_json().get('history', [])
    responses = {}
    for llm in llms:
        responses[llm] = hist_aware_answers(llm, query, chat)
    return https_fn.Response(dumps(responses), mimetype='application/json')


@https_fn.on_call(memory=options.MemoryOption.GB_32, cpu=8, timeout_sec=540)
def get_response(req: https_fn.CallableRequest):
    query = req.data.get('query', '')
    llms = req.get_json().get('llms', ['gpt-4', 'gemini', 'claude'])
    chat = req.get_json().get('history', [])
    responses = {}
    for llm in llms:
        responses[llm] = hist_aware_answers(llm, query, chat)
    return responses
