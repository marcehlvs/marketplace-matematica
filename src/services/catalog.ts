import { demoApps } from '../data/demoApps';
import type { AppData, WithId } from '../types';
import { createStore } from './store';

export const appsStore = createStore<AppData>('apps', demoApps);

/** Apps publicadas, de la más nueva a la más vieja. */
export async function listPublishedApps(): Promise<WithId<AppData>[]> {
  const apps = await appsStore.listWhere('published', true);
  return apps.sort((a, b) => b.createdAt - a.createdAt);
}
