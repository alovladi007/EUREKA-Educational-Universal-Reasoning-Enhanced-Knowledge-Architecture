/**
 * Live instruction — types & static copy. Slot/cohort rows load from GET /api/v1/patent-bar/live/*
 */

export type PatentOfficeHoursSlot = {
  id: string;
  label: string;
  cadence: string;
  time_local: string;
  topic_focus: string;
  duration_min: number;
  join_url: string | null;
  next_occurrence_at: string | null;
};

export type PatentCohort = {
  id: string;
  name: string;
  description: string;
  weeks_planned: number;
  start_window: string;
  capacity_planned: number | null;
  enrolled_count: number;
  enrollment_open: boolean;
};

export type PatentLiveOfficeHoursResponse = {
  exam_type: string;
  scheduling_connected: boolean;
  slots: PatentOfficeHoursSlot[];
};

export type PatentLiveCohortsResponse = {
  exam_type: string;
  cohorts: PatentCohort[];
};

export const SCHEDULING_INTEGRATION_POINTS = [
  { id: 'cal', title: 'Calendar & reminders', detail: 'ICS export, Google/Outlook OAuth, email digests.' },
  { id: 'video', title: 'Video sessions', detail: 'Embedded or deep-linked Zoom / Google Meet / Teams.' },
  { id: 'cap', title: 'Enrollment & waitlist', detail: 'Cohort caps, deposits (if applicable), cancellation policy.' },
  { id: 'rec', title: 'Recordings', detail: 'Opt-in replay for office hours (rights & consent).' },
] as const;
