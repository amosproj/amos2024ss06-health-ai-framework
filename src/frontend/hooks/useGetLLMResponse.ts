import { useState } from 'react';
import type { conversationMessage } from '../types';
// import { exec } from 'node:child_process';
// import path from 'node:path';

//THIS HOOK CAUSES RERENDER ERRORS
export function useGetLLMResponse(model: string) {
  //const [isGenerating, setIsGenerating] = useState(false);
  //const [LLMResponse, setLLMResponse] = useState<string | undefined>(undefined);
  //const [LLMResponseError, setError] = useState<string | undefined>(undefined);
  const isGenerating = false;
  const LLMResponse = '';
  const LLMResponseError = '';

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
      //setError(`Error: model ${model} does not exist.`);
  }

  //TODO: execute python retriever script
  // const inputString = "What should I eat for lunch?";
  // const projectRoot = path.resolve(__dirname, "..", "..");
  // const retrieverFilePath = path.resolve(projectRoot, 'backend', 'RAG', 'LangChain_Implementation', 'retriever.py');

  // console.log("retriever file path", retrieverFilePath);

  // exec(`python ${retrieverFilePath} "${inputString}"`, (error, stdout, stderr) => {
  //     if (error) {
  //         console.error(`Error: ${error.message}`);
  //         return;
  //     }
  //     if (stderr) {
  //         console.error(`Stderr: ${stderr}`);
  //         return;
  //     }
  //     console.log(`Output: ${stdout}`);
  // });

  //Delete this line once implemented connection to python backend
  //setIsGenerating(false);
  //setLLMResponse(`Hello I am ${model} and I cannot help you. (TODO: implement LLM backend connection)`);

  return { LLMResponse, isGenerating, LLMResponseError };
};