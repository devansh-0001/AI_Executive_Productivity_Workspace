import * as dashboardService from "../services/dashboard.service.js";

export async function getDashboard(req, res, next) {
  try {
    const data = await dashboardService.getDashboardOverview();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function getSummaryCards(req, res, next) {
  try {
    const data = await dashboardService.getDashboardOverview();
    res.json({ data: data.summaryCards });
  } catch (error) {
    next(error);
  }
}

export async function getAttentionList(req, res, next) {
  try {
    const data = await dashboardService.getDashboardOverview();
    res.json({ data: data.priorityActionList });
  } catch (error) {
    next(error);
  }
}
