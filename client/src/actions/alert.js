import {SET_ALERT, REMOVE_ALERT} from './types';
import uuid from 'uuid/v4'

//thunk we are able to call more thn 1 function
export const setAlert = (msg, alertType) => dispatch => {
  const id = uuid();
  dispatch({
      type: SET_ALERT,
      payload:{msg, alertType, id}
  })

  setTimeout(()=> dispatch({type: REMOVE_ALERT, payload: id}), 3000)
}