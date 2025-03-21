import { TableItemType } from "../types"

const API_URL = 'https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs'

const sendRequest = async (
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  token?: string,
  body?: object
) => {
  const response = await fetch(`${API_URL}${url}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token && { 'x-auth': token })
    },
    body: body ? JSON.stringify(body) : undefined
  })

  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`)
  }

  return await response.json()
}

export const login = async (username: string, password: string): Promise<{ token: string }> => {
  try {
    const response = await sendRequest('/login', 'POST', undefined, { username, password })
    if (response.error_code) {
      throw new Error(response.error_text || 'Неизвестная ошибка')
    }

    return { token: response.data.token }
  } catch (e) {
    console.error('Ошибка при запросе:', e)
    throw e
  }
}

export const getTableData = async (token: string): Promise<{ data: TableItemType[] }> => {
  return await sendRequest('/userdocs/get', 'GET', token)
}

export const addTableRow = async (token: string, rowData: TableItemType): Promise<{ status: string }> => {
  return await sendRequest('/userdocs/create', 'POST', token, rowData)
}

export const updateTableRow = async (token: string, rowId: string, rowData: TableItemType): Promise<{ status: string }> => {
  return await sendRequest(`/userdocs/set/${rowId}`, 'POST', token, rowData)
}

export const deleteTableRow = async (token: string, rowId: string): Promise<{ status: string }> => {
  return await sendRequest(`/userdocs/delete/${rowId}`, 'POST', token)
}