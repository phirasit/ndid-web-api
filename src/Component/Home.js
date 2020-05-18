import React from 'react'
import { AppBar, Toolbar, IconButton, Typography, TextField } from '@material-ui/core'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { Grid, Link } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

export const Layout = ({ children }) => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Link color="inherit" href="/">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <img width="30px" alt="NDID" src={process.env.PUBLIC_URL + '/logo.png'} />
            </IconButton>
            <span style={{paddingRight: "15px"}}>
              NDID Web Interface
            </span>
          </Link>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  )
}

export const Invalid = (_) => {
  const history = useHistory();
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '80vh' }}
    >
      <Typography variant="h1">
        404
      </Typography>
      <Typography variant="h3">
        <Link onClick={() => history.goBack()}>
          Go Back
        </Link>
      </Typography>
    </Grid>
  )
}

const Home = (_) => {
  const history = useHistory();
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell> List of Shortcuts </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <TextField
                fullWidth label="Search Node" placeholder="insert node id and press enter"
                onKeyDown={e => (e.keyCode === 13) && history.push(`/node/${e.target.value}`)} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <TextField
                fullWidth label="Search Request" placeholder="insert request id and press enter"
                onKeyDown={e => (e.keyCode === 13) && history.push(`/request/${e.target.value}`)} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Link color="primary" onClick={() => history.push(`/error_code/idp`)}>
                Error Code Configuration
              </Link>
            </TableCell>
          </TableRow>
        </TableBody >

      </Table >
    </TableContainer >
  )
}
export default Home