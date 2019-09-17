import { Client } from 'bugsnag-react-native';
const bugsnag = new Client('f1e939802a0abb0832574304f55776a5');

export const logError = (error) => {
  console.log(error);
  if (error instanceof Error) {
    bugsnag.notify(error);
  } else if (typeof error === 'string') {
    bugsnag.notify(new Error(error));
  }
};
