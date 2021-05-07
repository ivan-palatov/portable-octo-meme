import { CssBaseline, Link, makeStyles } from '@material-ui/core';
import 'katex/dist/katex.min.css';
import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter,
  Link as RouterLink,
  Route,
  Switch,
} from 'react-router-dom';
import BothU from './pages/BothU';
import Result from './pages/Result';
import Rho from './pages/Rho';
import U from './pages/U';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');

const link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute(
  'href',
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
);

const meta = document.createElement('meta');
meta.setAttribute('name', 'viewport');
meta.setAttribute(
  'content',
  'minimum-scale=1, initial-scale=1, width=device-width'
);

document.head.appendChild(meta);
document.head.appendChild(link);
document.body.appendChild(mainElement);

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    justifyContent: 'space-around',
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <div className={classes.main}>
          <Link variant="body1" component={RouterLink} to="/">
            На главную
          </Link>
          <Link variant="body1" component={RouterLink} to="/rho">
            Модельная задача 1
          </Link>
          <Link variant="body1" component={RouterLink} to="/u">
            Модельная задача 2
          </Link>
          <Link variant="body1" component={RouterLink} to="/both-u">
            Система для Ui
          </Link>
        </div>
        <Switch>
          <Route path="/rho">
            <Rho />
          </Route>
          <Route path="/u">
            <U />
          </Route>
          <Route path="/both-u">
            <BothU />
          </Route>
          <Route path="/" exact>
            <Result />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
};

render(<App />, mainElement);
