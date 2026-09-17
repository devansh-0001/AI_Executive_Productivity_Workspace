import * as calendarService from "../services/calendar.service.js";

export async function getCalendar(req, res, next) {
  try {
    const data = await calendarService.getCalendarEvents();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function getCalendarConflicts(req, res, next) {
  try {
    const data = await calendarService.getCalendarEvents();
    res.json({ data: data.conflicts });
  } catch (error) {
    next(error);
  }
}
