import type { conversationMessage } from '../types';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getLLMResponse(
  model: string,
  conversation: conversationMessage[]
): Promise<string> {
  //TODO: Call python method from here, maybe using DJANGO API?
  // https://medium.com/@arpitnearlearn/building-a-react-native-mobile-app-with-a-python-django-api-1ee497688e9

  let response = '';
  switch (model) {
    case 'gpt-4':
      //TODO:
      break;
    case 'google':
      //TODO:
      break;
    case 'mistral':
      //TODO:
      break;
    case 'claude':
      //TODO:
      break;
    default:
      response = `Error: model ${model} does not exist.`;
  }

  //TODO: insert python backend connection here

  await delay(2000); //TODO: delete this once implemented python backend connection

  //Delete this line once implemented connection to python backend
  response = `Hello I am ${model} and I cannot help you. (TODO: implement LLM backend connection)`;

  return response;
}
