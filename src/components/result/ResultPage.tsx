import { Typography } from '@material-ui/core';
import { Data } from 'plotly.js';
import React, { useReducer } from 'react';
import Worker from '../../workers/main.worker';
import ResultForm, { FormTypes } from './ResultForm';
import ResultPlots from './ResultPlots';

interface IProps {}

enum EAction {
  TOGGLE_LOADING,
  UPDATE_ITERATIONS,
  UPDATE_DATA,
}

interface IAction {
  type: EAction;
  payload?: { [x: string]: any };
}

const initialState = {
  isLoading: false,
  iterations: 0,
  data: {} as { u1: Data; u2: Data; rho1: Data; rho2: Data },
};

function reducer(
  state: typeof initialState,
  action: IAction
): typeof initialState {
  switch (action.type) {
    case EAction.TOGGLE_LOADING:
      return { ...state, isLoading: !state.isLoading };
    case EAction.UPDATE_ITERATIONS:
      return { ...state, iterations: action.payload!.iterations };
    case EAction.UPDATE_DATA:
      return { ...state, data: action.payload!.data };
    default:
      return state;
  }
}

const ResultPage: React.FC<IProps> = () => {
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
      const { iterations, ...data } = e.data;
      dispatch({ type: EAction.UPDATE_DATA, payload: { data } });
      dispatch({ type: EAction.UPDATE_ITERATIONS, payload: { iterations } });
      dispatch({ type: EAction.TOGGLE_LOADING });
    };
  }

  return (
    <>
      <ResultForm runWorker={runWorker} isLoading={state.isLoading} />
      {state.iterations !== 0 && (
        <Typography variant="h6">
          Количество итераций: {state.iterations}
        </Typography>
      )}
      <ResultPlots data={state.data} />
    </>
  );
};

export default ResultPage;
