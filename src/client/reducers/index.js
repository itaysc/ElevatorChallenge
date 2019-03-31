import { combineReducers } from 'redux';
import settings from './settingsReducer';
import elevatorsManagement from './building';

export default combineReducers({
  settings,
  elevatorsManagement
});
