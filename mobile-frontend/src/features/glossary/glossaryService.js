import { dataProvider } from '../../services/dataProvider';

export async function getInfographics() {
  return await dataProvider.getInfographics();
}

export async function saveInfographic(payload, editId = null) {
  return await dataProvider.saveInfographic(payload, editId);
}

export async function deleteInfographic(id) {
  return await dataProvider.deleteInfographic(id);
}

export async function getGlossary() {
  return await dataProvider.getGlossary();
}

export async function saveGlossaryTerm(payload, editId = null) {
  return await dataProvider.saveGlossaryTerm(payload, editId);
}

export async function deleteGlossaryTerm(id) {
  return await dataProvider.deleteGlossaryTerm(id);
}
