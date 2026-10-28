export enum TicketCategory {
  General = 0,
  Offers = 1,
  Withdrawals = 2,
  TechnicalIssue = 3,
  AccountIssue = 4,
  Other = 5
}

export const TICKET_CATEGORIES: { label: string; value: number }[] = [
  { label: 'General Inquiry', value: TicketCategory.General },
  { label: 'Offers & Rewards', value: TicketCategory.Offers },
  { label: 'Withdrawals & Payments', value: TicketCategory.Withdrawals },
  { label: 'Technical Issue', value: TicketCategory.TechnicalIssue },
  { label: 'Account Issue', value: TicketCategory.AccountIssue },
  { label: 'Other', value: TicketCategory.Other },
];

export interface CreateTicketResponse {
  ticketId?: string;
  id?: string;
  message?: string;
  status?: string;
}
