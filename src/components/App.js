import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Route, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TodoList from './TodoList';
import Login from './Login';
import { Button } from '@material-ui/core';
import { FetchContext } from '../contexts/FetchContext';
import { Link } from 'react-router-dom'



const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  Button: {

    marginLeft: '300 px',
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },

}));



const PrivateRoute = ({ component: Component, ...rest }) => {
  const fakeAuth = React.useContext(FetchContext)

  return <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
}



function App() {
  const classes = useStyles();
  const { isAuthenticated, logout } = React.useContext(FetchContext)


  return (
    <React.Fragment>
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>

            <Link to="/" className={classes.link}>
              TodoApp
                  </Link>
          </Typography>
          <nav>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className={classes.link}>
                  Login
                  </Link>
              </>
            ) : (
                < >
                  <Link to="/todolist" className={classes.link}>
                    TodoList
                   </Link>
                  <Button onClick={logout} className={classes.link}>
                    Logout
                    </Button>
                </>

              )}

          </nav>

        </Toolbar>
      </AppBar>

      <div className="App-intro">
        <switch>
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/todolist" component={TodoList} />
        </switch>
      </div>
    </React.Fragment>
  );
}

export default App;