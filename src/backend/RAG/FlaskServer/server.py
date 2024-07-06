from threading import Thread

from flask import Flask, jsonify, request
from kivy.app import App
from kivy.uix.button import Button

from src.backend.RAG.LangChain_Implementation.retriever import Retriever

flask_app = Flask(__name__)
retriever = Retriever()


@flask_app.route('/llm-response', methods=['POST'])
def get_llm_response():
    data = request.json
    query = data.get('query')
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    response = retriever.simple_response(query)
    return jsonify({'response': response})


def run_flask():
    flask_app.run(host='localhost', port=5000)


class MyApp(App):
    def build(self):
        # Start Flask server in a separate thread
        Thread(target=run_flask).start()
        return Button(text='LLM Server Running')


if __name__ == '__main__':
    MyApp().run()
