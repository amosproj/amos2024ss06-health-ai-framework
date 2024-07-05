import { exec } from 'node:child_process';


export function getLLMResponse(model: string, ) : string
{
  //TODO: Call python method from here, maybe using DJANGO API?
  // https://medium.com/@arpitnearlearn/building-a-react-native-mobile-app-with-a-python-django-api-1ee497688e9

  let response = ''
  switch(model) {
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
      response = `Error: model ${model} does not exist.`
  }

  //Delete this line once implemented connection to python backend
  response = `Hello I am ${model} and I cannot help you. (TODO: implement LLM backend connection)`

  return response;
}


const inputString = "What should I eat for lunch?";

exec(`python inout.py "${inputString}"`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    console.log(`Output: ${stdout}`);
});