import TeX from '@matejmazur/react-katex';
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
import Home from './pages/Home';
import Neumann from './pages/Neumann';
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
          <Link variant="body1" component={RouterLink} to="/u">
            Проверить <TeX math="u" />
          </Link>
          <Link variant="body1" component={RouterLink} to="/rho">
            Проверить <TeX math="\rho" />
          </Link>
          <Link variant="body1" component={RouterLink} to="/neumann">
            Проверить вычисления для усл-й Неймана
          </Link>
        </div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/neumann">
            <Neumann />
          </Route>
          <Route path="/rho">
            <Rho />
          </Route>
          <Route path="/u">
            <U />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
};

render(<App />, mainElement);
