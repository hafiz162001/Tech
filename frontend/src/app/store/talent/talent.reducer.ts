import { createReducer, on } from '@ngrx/store';
import { initialTalentState } from './talent.state';
import * as TalentActions from './talent.actions';

export const talentReducer = createReducer(
  initialTalentState,

  on(TalentActions.loadTalents, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(TalentActions.loadTalentsSuccess, (state, { talents }) => ({
    ...state,
    talents,
    loading: false
  })),

  on(TalentActions.loadTalentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(TalentActions.selectTalent, (state, { talentId }) => ({
    ...state,
    selectedTalentId: talentId
  })),

  on(TalentActions.setFilterKeyword, (state, { keyword }) => ({
    ...state,
    filters: { ...state.filters, keyword }
  })),

  on(TalentActions.setFilterSkill, (state, { skill }) => ({
    ...state,
    filters: { ...state.filters, skill }
  })),

  on(TalentActions.setFilterCity, (state, { city }) => ({
    ...state,
    filters: { ...state.filters, city }
  })),

  on(TalentActions.setFilterStatus, (state, { status }) => ({
    ...state,
    filters: { ...state.filters, status }
  })),

  on(TalentActions.updateTalentStatus, (state, { talentId, status }) => ({
    ...state,
    talents: state.talents.map(t => t.id === talentId ? { ...t, status } : t)
  }))
);
