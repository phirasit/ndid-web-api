import React from 'react'
import { Link } from '@material-ui/core';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';

import { NodeDisplay } from './Node'

import { GetRequestInfo } from '../api/common'

const RequestDisplay = ({ requestID }) => {
  return (
    <Link href={`/request/${requestID}`}>
      {requestID}
    </Link>
  )
}

const DataRequestDisplay = ({ request: { as_id_list, response_list, ...details }}) => {
  return (
    <TableRow> 
      {['service_id', 'min_as', 'request_params_hash'].map(k => (
        <TableCell key={k}>
          {details[k]}
        </TableCell>
      ))}
      <TableCell>
        {as_id_list.map(as_id => <NodeDisplay key={as_id} nodeID={as_id} />)}
      </TableCell>
      <TableCell>
        Response List # TODO 
      </TableCell>
    </TableRow>
  )
}

const IdpResponseDisplay = ({ response: { idp_id, ...details } }) => {
  return (
    <TableRow>
      <TableCell> <NodeDisplay nodeID={idp_id} /> </TableCell>
      {['ial', 'aal', 'status', 'signature', 'valid_ial', 'valid_signature'].map(k => (
        <TableCell key={k}>
          {details[k]}
        </TableCell>
      ))}
    </TableRow>
  )
}

const RequestInfo = ({ match: { params: { requestID } } }) => {
  const [info, setInfo] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (requestID) {
      (async function () {
        setIsLoading(true);
        try {
          const info = await GetRequestInfo(requestID);
          setInfo(info);
          console.log(info);
        } catch (e) {
          setInfo(null);
          console.error(e);
        }
        setIsLoading(false);
      })()
    }
  }, [requestID]);

  const {
    request_id,
    request_message_hash,
    requester_node_id,
    idp_id_list,
    data_request_list,
    response_list,
    ...details
  } = info || {}

  if (isLoading) {
    return (<>
      Loading request #{requestID} data
    </>)
  }

  // if there is no info on this node
  if (info == null) {
    return (<>
      Request #{requestID} does not exist
    </>)
  }

  return (
    <TableContainer style={{ width: "80%", padding: "30px 10% 50px 10%" }} >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>
              Request ID <RequestDisplay requestID={requestID} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell> Request Message Hash </TableCell>
            <TableCell> <NodeDisplay nodeID={request_message_hash} /> </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Requester Node ID </TableCell>
            <TableCell> <NodeDisplay nodeID={requester_node_id} /> </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> IdP ID List </TableCell>
            <TableCell>
              {idp_id_list.map((nodeID, idx) => (
                <span key={nodeID}>
                  <NodeDisplay nodeID={nodeID} />
                  {idx % 5 === 4 && <br />}
                </span>
              ))}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Data Request List </TableCell>
            <TableCell>
              <Table>
                <TableHead>
                  <TableRow>
                    {(["Service ID", "Min AS", "Request Parameter Hashed", "AS ID LIST", "AS Response"])
                      .map(k => <TableCell key={k}> {k} </TableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data_request_list
                    .map(request => <DataRequestDisplay key={request.service_id} request={request} />) }
                </TableBody>
              </Table>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Response List </TableCell>
            <TableCell>
              <Table>
                <TableHead>
                  <TableRow>
                    {(['Node ID', 'Ial', 'Aal', 'status', 'signature', 'valid Ial', 'valid Signature'])
                      .map(k => <TableCell key={k}> {k} </TableCell>)
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {response_list.map((response, idx) => (
                    <IdpResponseDisplay key={response.idp_id} response={response} />
                  ))}
                </TableBody>
              </Table>
            </TableCell>
          </TableRow>
          {Object.keys(details).map(key => (
            <TableRow key={key}>
              <TableCell> {key} </TableCell>
              <TableCell> {details[key].toString()} </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RequestInfo