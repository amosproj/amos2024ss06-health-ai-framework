import 'text-encoding-polyfill';
import 'react-native-url-polyfill/auto';
import 'web-streams-polyfill/dist/polyfill';
import { registerRootComponent } from 'expo';
import { App } from './App';

// Register the root component
registerRootComponent(App);
