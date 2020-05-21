
import React from "react"
import { FormControlLabel, TextField, Typography, Select, Checkbox } from '@material-ui/core';
import { IconButton, Button, Link } from '@material-ui/core';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { GetNodeInfo, UpdateNodeInfo } from '../api/common'

export const NodeDisplay = ({ nodeID }) => {
  return (
    <Link href={`/node/${nodeID}`}>
      {nodeID}
    </Link>
  )
}

const NodeDetail = ({ match: { params: { nodeID } } }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [dInfo, setDInfo] = React.useState(null);
  const [info, setInfo] = React.useState(null);
  const [error, setError] = React.useState(null);

  // load node information
  const loadInfo = React.useCallback(() => {
    if (nodeID) {
      (async function () {
        setError(null);
        setIsLoading(true);
        try {
          const info = await GetNodeInfo(nodeID);
          console.log(info);
          setInfo(info);
          setDInfo(info);
        } catch (e) {
          console.error(e);
          setInfo(null);
        }
        setIsLoading(false);
      })()
    }
  }, [nodeID]);
  React.useEffect(loadInfo, [nodeID]);

  const updateInfo = React.useMemo(() => {
    return info && dInfo && Object.keys(info || {}).reduce((updateInfo, k) => {
      if (info[k] !== dInfo[k]) {
        updateInfo[k] = info[k];
      }
      return updateInfo
    }, {});
  }, [dInfo, info]);

  // submit update
  const update = React.useCallback(async () => {
    try {
      console.log(updateInfo);
      await UpdateNodeInfo(nodeID, updateInfo);
      loadInfo();
    } catch (e) {
      setError(e);
      console.error(e);
    }
  }, [nodeID, loadInfo, updateInfo]);

  const {
    active,
    node_name,
    role,
    agent,
    max_ial,
    max_aal,
    master_public_key,
    public_key,
    node_id_whitelist_active,
    node_id_whitelist,
    mq,
    // proxy,
    supported_request_message_data_url_type_list,
  } = info || {}

  // for adding new whitelist node
  const [newWhitelistNode, setNewWhitelistNode] = React.useState('');
  const removeWhitelistNode = React.useCallback(nodeID => {
    setInfo({ ...info, node_id_whitelist: (node_id_whitelist || []).filter(node => node !== nodeID) });
  }, [info, node_id_whitelist]);
  const addNewWhitelistNode = React.useCallback(() => {
    if (newWhitelistNode !== '') {
      if (!newWhitelistNode.includes(node_id_whitelist)) {
        setInfo({ ...info, node_id_whitelist: [...(node_id_whitelist || []), newWhitelistNode] });
      }
      setNewWhitelistNode('');
    }
  }, [info, newWhitelistNode, node_id_whitelist]);

  // if the page is loading
  if (isLoading) {
    return (<>
      Loading node #{nodeID} data
    </>)
  }

  // if there is no info on this node
  if (info == null) {
    return (<>
      Node #{nodeID} does not exist
    </>)
  }

  return (
    <TableContainer style={{ width: "80%", padding: "30px 10% 50px 10%" }} >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "30%" }}>
              NODE ID
            </TableCell>
            <TableCell>
              <NodeDisplay nodeID={nodeID} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell> Active </TableCell>
            <TableCell>
              <Checkbox name="active" checked={active || false}
                onChange={(_, checked) => setInfo({ ...info, active: checked })} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Name </TableCell>
            <TableCell>
              <TextField value={node_name}
                placeholder="Node Name"
                onChange={(e) => setInfo({ ...info, node_name: e.target.value })} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Role </TableCell>
            <TableCell>
              <Select native value={role}
                onChange={(e) => setInfo({ ...info, role: e.target.value })} >
                <option value="NDID"> NDID </option>
                <option value="IdP"> IdP </option>
                <option value="RP"> RP </option>
                <option value="AS"> AS </option>
              </Select>
              {(["IdP"].includes(role)) && (<>
                <FormControlLabel
                  style={{ paddingLeft: "10px" }}
                  control={
                    <Checkbox name="agent" checked={agent || false}
                      onChange={(_, checked) => setInfo({ ...info, agent: checked })} />
                  }
                  label="IDP Agent"
                  labelPlacement="end"
                />
              </>)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Max Ial </TableCell>
            <TableCell>
              <Select native value={max_ial}
                onChange={(e) => setInfo({ ...info, max_ial: parseFloat(e.target.value) })}>
                {[1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3].map(ial => (
                  <option key={ial} value={ial}> {ial} </option>
                ))}
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Max Aal </TableCell>
            <TableCell>
              <Select native value={max_aal}
                onChange={(e) => setInfo({ ...info, max_aal: parseFloat(e.target.value) })}>
                {[1, 2.1, 2.2, 3].map(aal => (
                  <option key={aal} value={aal}> {aal} </option>
                ))}
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Master Public Key </TableCell>
            <TableCell>
              <TextField value={master_public_key} multiline fullWidth
                onChange={(e) => setInfo({ ...info, master_public_key: e.target.value })} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Public Key </TableCell>
            <TableCell>
              <TextField value={public_key} multiline fullWidth
                onChange={(e) => setInfo({ ...info, public_key: e.target.value })} />
            </TableCell>
          </TableRow>
          {["IdP", "RP"].includes(role) && (<>
            <TableRow>
              <TableCell> Whitelist Active </TableCell>
              <TableCell>
                <Checkbox name="whitelist" checked={node_id_whitelist_active || false}
                  onChange={(_, checked) => setInfo({ ...info, node_id_whitelist_active: checked })} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell> Whitelist </TableCell>
              <TableCell>
                <TextField
                  disabled={!node_id_whitelist_active}
                  placeholder="Whitelist ID Node"
                  onKeyDown={(e) => (e.keyCode === 13) && addNewWhitelistNode()}
                  onBlur={addNewWhitelistNode}
                  onChange={e => setNewWhitelistNode(e.target.value)}
                  value={newWhitelistNode}
                />
                <br />
                {(node_id_whitelist || []).map((nodeID, idx) => (
                  <span key={nodeID}>
                    <NodeDisplay nodeID={nodeID} />
                    <IconButton disabled={!node_id_whitelist_active}
                      onClick={() => removeWhitelistNode(nodeID)}> × </IconButton>
                    {idx % 5 === 4 && <br />}
                  </span>
                ))}
              </TableCell>
            </TableRow>
          </>)}
          <TableRow>
            <TableCell> Message Queue </TableCell>
            <TableCell>
              {mq && mq.map(({ ip, port }) => <div key={`${ip}:${port}`}> {ip}:{port} </div>)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Supported Request Message Data URL Type List </TableCell>
            <TableCell>
              {supported_request_message_data_url_type_list &&
                supported_request_message_data_url_type_list.map((type) => <div key={type}> {type} </div>)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              {error && (<Typography color="error">
                {error.toString()}
              </Typography>)}
              <Button fullWidth variant="contained" color="primary" name="update"
                disabled={Object.keys(updateInfo).length === 0}
                onClick={update}>
                Update
            </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer >
  )
}

export default NodeDetail