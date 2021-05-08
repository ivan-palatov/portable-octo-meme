import { Data } from 'plotly.js';
import React, { useReducer } from 'react';
import Worker from '../../workers/uBoth.worker';
import BothUForm, { FormTypes } from './BothUForm';
import BothUPlots from './BothUPlots';

interface IProps {}

enum EAction {
  TOGGLE_LOADING,
  UPDATE_DATA,
}

interface IAction {
  type: EAction;
  payload?: { [x: string]: any };
}

const initialState = {
  isLoading: false,
  data: {} as {
    u1: Data;
    u2: Data;
    u1Real: Data;
    u2Real: Data;
    diff1: Data;
    diff2: Data;
  },
};

function reducer(
  state: typeof initialState,
  action: IAction
): typeof initialState {
  switch (action.type) {
    case EAction.TOGGLE_LOADING:
      return { ...state, isLoading: !state.isLoading };
    case EAction.UPDATE_DATA:
      return { ...state, data: action.payload!.data };
    default:
      return state;
  }
}

const BothUPage: React.FC<IProps> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  function runWorker(values: FormTypes) {
    const worker = new Worker();
    dispatch({ type: EAction.TOGGLE_LOADING });

    worker.postMessage(values);

    worker.onerror = (e) => {
      console.warn(e);
      dispatch({ type: EAction.TOGGLE_LOADING });
    };

    worker.onmessage = (e) => {
      const data = e.data;
      dispatch({ type: EAction.UPDATE_DATA, payload: { data } });
      dispatch({ type: EAction.TOGGLE_LOADING });
    };
  }

  return (
    <>
      <BothUForm runWorker={runWorker} isLoading={state.isLoading} />
      <BothUPlots data={state.data} />
    </>
  );
};

export default BothUPage;
