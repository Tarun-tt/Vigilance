import { matchPath } from 'react-router-dom';
import appRoutes from '../data/appRoutes.json';
import sidebarStagesRest from '../data/sidebarStagesRest.json';
import stage1Sidebar from '../stages/stage-1/data/sidebar.json';
import stage1Routes from '../stages/stage-1/data/routes.json';

export const STAGES = [stage1Sidebar, ...sidebarStagesRest.stages];
export const ROUTES = [...stage1Routes, ...appRoutes.routes];
export const DEFAULT_REDIRECT = appRoutes.defaultRedirect;
export const INVESTIGATION_STEPS = appRoutes.investigationSteps;

/**
 * @param {string} pathname
 * @returns {{ route: object, params: Record<string, string> } | null}
 */
export function matchRoute(pathname) {
  let normalized = pathname;
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  for (const route of ROUTES) {
    const m = matchPath({ path: route.path, end: true }, normalized);
    if (m) return { route, params: m.params };
  }
  return null;
}

export function getSidebarPath(stageId, subItemId) {
  const candidates = ROUTES.filter((r) => r.stageId === stageId && r.subItemId === subItemId);
  const inv = candidates.find((r) => r.kind === 'investigation');
  if (inv) return inv.sidebarPath;
  const row = candidates.find((r) => r.kind !== 'investigationRedirect');
  return row?.sidebarPath ?? '/';
}

export function getInvestigationDefaultStep() {
  const inv = ROUTES.find((r) => r.kind === 'investigation' && r.path.includes(':step'));
  return inv?.defaultInvestigationStep ?? 1;
}

export function investigationPath(stepNum) {
  return `/stage-2/investigation/${stepNum}`;
}

export function getActiveStageAndSubItem(pathname) {
  const hit = matchRoute(pathname);
  if (!hit) return { activeStage: 1, activeSubItemId: '1.1' };
  return {
    activeStage: hit.route.stageId,
    activeSubItemId: hit.route.subItemId,
  };
}
