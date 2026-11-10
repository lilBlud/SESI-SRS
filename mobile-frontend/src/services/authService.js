import { dataProvider } from './dataProvider';

export async function login(email, password) {
  return await dataProvider.login(email, password);
}

export async function signup(payload) {
  return await dataProvider.signup(payload);
}

