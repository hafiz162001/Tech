import { Talent } from '../../core/models/talent.model';

export interface TalentState {
  talents: Talent[];
  selectedTalentId: number | null;
  loading: boolean;
  error: string | null;
  filters: {
    keyword: string;
    skill: string;
    city: string;
    status: string;
  };
}

export const initialTalentState: TalentState = {
  talents: [],
  selectedTalentId: null,
  loading: false,
  error: null,
  filters: {
    keyword: '',
    skill: 'ALL',
    city: 'ALL',
    status: 'ALL'
  }
};
