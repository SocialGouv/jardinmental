export interface Drug {
  id: string;
  name1: string;
  name2?: string;
  values?: string[];
}

export interface Posology extends Drug {
  freeText?: string;
  value: string;
}
