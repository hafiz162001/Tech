import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TalentState } from './talent.state';

export const selectTalentState = createFeatureSelector<TalentState>('talent');

export const selectAllTalents = createSelector(
  selectTalentState,
  (state) => state.talents
);

export const selectTalentsLoading = createSelector(
  selectTalentState,
  (state) => state.loading
);

export const selectTalentFilters = createSelector(
  selectTalentState,
  (state) => state.filters
);

export const selectFilteredTalents = createSelector(
  selectAllTalents,
  selectTalentFilters,
  (talents, filters) => {
    return talents.filter(talent => {
      const matchKeyword = !filters.keyword ||
        talent.fullName.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        talent.primaryRole.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        talent.skills.some(s => s.toLowerCase().includes(filters.keyword.toLowerCase()));

      const matchSkill = filters.skill === 'ALL' ||
        talent.skills.some(s => s.toLowerCase() === filters.skill.toLowerCase());

      const matchCity = filters.city === 'ALL' ||
        talent.locationCity.toLowerCase() === filters.city.toLowerCase();

      const matchStatus = filters.status === 'ALL' ||
        talent.status === filters.status;

      return matchKeyword && matchSkill && matchCity && matchStatus;
    });
  }
);

export const selectSelectedTalent = createSelector(
  selectAllTalents,
  selectTalentState,
  (talents, state) => {
    if (!state.selectedTalentId) return null;
    return talents.find(t => t.id === state.selectedTalentId) || null;
  }
);
