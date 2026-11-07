import { createAction, props } from '@ngrx/store';
import { Talent } from '../../core/models/talent.model';

export const loadTalents = createAction('[Talent] Load Talents');

export const loadTalentsSuccess = createAction(
  '[Talent] Load Talents Success',
  props<{ talents: Talent[] }>()
);

export const loadTalentsFailure = createAction(
  '[Talent] Load Talents Failure',
  props<{ error: string }>()
);

export const selectTalent = createAction(
  '[Talent] Select Talent',
  props<{ talentId: number | null }>()
);

export const setFilterKeyword = createAction(
  '[Talent] Set Filter Keyword',
  props<{ keyword: string }>()
);

export const setFilterSkill = createAction(
  '[Talent] Set Filter Skill',
  props<{ skill: string }>()
);

export const setFilterCity = createAction(
  '[Talent] Set Filter City',
  props<{ city: string }>()
);

export const setFilterStatus = createAction(
  '[Talent] Set Filter Status',
  props<{ status: string }>()
);

export const updateTalentStatus = createAction(
  '[Talent] Update Status',
  props<{ talentId: number; status: Talent['status'] }>()
);
