export interface CompaniesStatisticsResponse {
  total: number;
}
export interface JobsStatisticsResponse {
  total: number;
  active: number;
  archived: number;
  draft: number;
  internal: number;
  external: number;
  by_type: [
    recrutement: number,
    stage: number,
    freelance: number,
  ];
  total_applications: number;
  recent_offers: number
}
export interface JobApplyStatisticsResponse {
  total: number;
  pending: number;
  under_review: number;
  shortlisted: number;
  rejected: number;
  accepted: number;
  recent: number;
  today: number;
  this_week: number;
  this_month: number;
}
export interface ContactStatisticsResponse {
    total: number;
    unread: number;
    read: number;
    replied: number;
    archived: number;
    recent: number;
    today: number;
    this_week: number;
    this_month: number;
}
