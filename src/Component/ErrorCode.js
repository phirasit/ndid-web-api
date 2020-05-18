import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, TextField, Typography } from '@material-ui/core';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';

import { GetErrorCodeList, AddErrorCode, RemoveErrorCode } from '../api/common'

const ErrorCodeInfo = ({ match: { params: { type } } }) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isBlocking, setIsBlocking] = React.useState(false);
  const [errorCodeList, setErrorCodeList] = React.useState([]);

  const [newErrorCode, setNewErrorCode] = React.useState('');
  const [newErrorCodeDescription, setNewErrorCodeDescription] = React.useState('');

  React.useEffect(() => {
    (async function () {
      setIsLoading(true);
      setErrorCodeList([]);
      try {
        const result = await GetErrorCodeList(type);
        setErrorCodeList(result);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    })()
  }, [type]);

  const addErrorCode = React.useCallback(() => {
    (async function () {
      setIsBlocking(true);
      try {
        await AddErrorCode(type, parseInt(newErrorCode), newErrorCodeDescription);
        history.go();
      } catch (e) {
        console.error(e);
      }
      setIsBlocking(false);
    })()
  }, [type, newErrorCode, newErrorCodeDescription, history])

  const removeErrorCode = React.useCallback((errorCode) => {
    (async function () {
      setIsBlocking(true);
      try {
        await RemoveErrorCode(type, parseInt(errorCode));
        history.go();
      } catch (e) {
        console.error(e);
      }
      setIsBlocking(false);
    })()
  }, [type, history]);

  const fullname = type.toUpperCase();

  return (
    <TableContainer style={{ width: "80%", padding: "30px 10% 50px 10%" }} >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>
              {(['idp', 'as']).map(t => (
                <Button key={t} color='primary' value={t} disableElevation
                  variant={t === type ? 'contained' : 'text'}
                  onClick={_ => {
                    if (t === type) {
                      history.go()
                    } else {
                      history.replace(`/error_code/${t}`)
                    }
                  }}>
                  {t}
                </Button>
              ))}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> {fullname} Error Code </TableCell>
            <TableCell colSpan={2}> Description </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <TextField label="Error Code" value={newErrorCode}
                onChange={e => setNewErrorCode(e.target.value)} />
            </TableCell>
            <TableCell>
              <TextField multiline label="Message" value={newErrorCodeDescription}
                onChange={e => setNewErrorCodeDescription(e.target.value)} />
            </TableCell>
            <TableCell>
              <Button variant="contained" color="primary" disableElevation
                disabled={isBlocking}
                onClick={() => addErrorCode()}>
                Add {fullname} Error Code
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={3}> Loading... </TableCell>
            </TableRow>
          )}
          {errorCodeList.map(({ error_code, description }) => (
            <TableRow key={error_code}>
              <TableCell>
                <Typography>
                  {error_code}
                </Typography>
              </TableCell>
              <TableCell> {description} </TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" disableElevation
                  disabled={isBlocking}
                  onClick={() => removeErrorCode(error_code)}>
                  REMOVE CODE {error_code}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ErrorCodeInfo