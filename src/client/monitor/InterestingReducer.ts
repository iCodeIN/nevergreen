import {Actions} from '../Actions'
import {Project} from '../domain/Project'
import {createReducer, createSelector} from 'redux-starter-kit'
import {ActionInterestingProjects} from './MonitorActionCreators'
import {State} from '../Reducer'

export interface InterestingState {
  readonly loaded: boolean;
  readonly projects: ReadonlyArray<Project>;
  readonly errors: ReadonlyArray<string>;
}

export const INTERESTING_ROOT = 'interesting'

const DEFAULT_STATE: InterestingState = {
  projects: [],
  errors: [],
  loaded: false
}

export const reduce = createReducer<InterestingState>(DEFAULT_STATE, {
  [Actions.INTERESTING_PROJECTS]: (draft, action: ActionInterestingProjects) => {
    draft.loaded = true
    draft.errors = action.errors as string[]
    draft.projects = action.projects as Project[]
  }
})

export const getInterestingLoaded = createSelector<State, boolean>([[INTERESTING_ROOT, 'loaded']])
export const getInterestingErrors = createSelector<State, ReadonlyArray<string>>([[INTERESTING_ROOT, 'errors']])
export const getInterestingProjects = createSelector<State, ReadonlyArray<Project>>([[INTERESTING_ROOT, 'projects']])
