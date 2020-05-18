import axios from 'axios'

async function sendGetRequest(path, data) {
  const { data: json } = await axios.get(path, data)
  return json
}

async function sendPostRequest(path, data) {
  const { data: json } = await axios.post(path, data)
  return json
}

export async function GetNodeInfo(nodeID) {
  return sendGetRequest(`/utility/nodes/${nodeID}`, {})
}

export async function UpdateNodeInfo(nodeID, detail) {
  return sendPostRequest(`/ndid/update_node`, {
    node_id: nodeID,
    ...detail,
  })
}

export async function GetErrorCodeList(type) {
  return sendGetRequest(`/utility/${type}_error_codes`, {})
}

export async function AddErrorCode(type, error_code, description) {
  return sendPostRequest(`/ndid/add_error_code`, {
    type,
    error_code,
    description,
  });
}

export async function RemoveErrorCode(type, error_code) {
  return sendPostRequest(`/ndid/remove_error_code`, {
    type,
    error_code,
  })
}

export async function GetRequestInfo(requestID) {
  return sendGetRequest(`/utility/requests/${requestID}`, {})
}