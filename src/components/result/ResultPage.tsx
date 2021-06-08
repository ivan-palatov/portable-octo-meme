import { Data } from 'plotly.js';
import React, { useReducer } from 'react';
import Worker from '../../workers/result.worker';
import ResultDownload from './ResultDownload';
import ResultForm, { FormTypes } from './ResultForm';
import ResultPlots2d from './ResultPlots2d';
import ResultPlots3d from './ResultPlots3d';

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
  data: {} as {
    u1: Data;
    u2: Data;
    rho1: Data;
    rho2: Data;
    plotType: 'surface' | 'scatter' | '';
    results: { [x: string]: number[][] };
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
      const data = e.data;
      dispatch({ type: EAction.UPDATE_DATA, payload: { data } });
      dispatch({ type: EAction.TOGGLE_LOADING });
    };
  }

  return (
    <>
      <ResultForm runWorker={runWorker} isLoading={state.isLoading} />
      <ResultDownload
        data={
          state.data.plotType === 'scatter' ? state.data.results : state.data
        }
      />
      {state.data.plotType === 'surface' && <ResultPlots3d data={state.data} />}
      {state.data.plotType === 'scatter' && <ResultPlots2d data={state.data} />}
    </>
  );
};

export default ResultPage;
