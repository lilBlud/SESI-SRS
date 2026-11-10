import { dataProvider } from './dataProvider';

export async function getVisitorStats() {
  return await dataProvider.getVisitorStats();
}

export async function recordVisitor(payload) {
  return await dataProvider.recordVisitor(payload);
}

