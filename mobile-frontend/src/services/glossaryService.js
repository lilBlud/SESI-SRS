import { dataProvider } from './dataProvider';

export async function getInfographics() {
  return await dataProvider.getInfographics();
}

export async function getGlossary() {
  return await dataProvider.getGlossary();
}

