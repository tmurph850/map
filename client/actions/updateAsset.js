import { UPDATE_ASSET } from './actionTypes';

export const updateAsset = (obj) => {
  return {type: UPDATE_ASSET, payload: obj};
};