import { httpsCallable } from 'firebase/functions';
import { useFunctions } from 'reactfire';

export function useGetFunctions() {
  const fireFunction = useFunctions();
  return httpsCallable(fireFunction, 'get_response');
}
