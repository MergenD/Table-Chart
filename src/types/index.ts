export interface ShareholderData {
  holder: string;
  share_percent: string;
}

export interface CompanyData {
  [companyName: string]: ShareholderData[];
}

export interface ProcessedShareholderData extends ShareholderData {
  id: string;
  share_percent_number: number;
}
