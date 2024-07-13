import { httpsCallable } from 'firebase/functions';
import { useFunctions } from 'reactfire';

/**
 * This hook is used to get an LLM response from a firebase function.
 */

export function useGetResponse() {
  const fireFunction = useFunctions();
  return httpsCallable(fireFunction, 'get_response');
}
