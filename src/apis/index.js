import axios from 'axios'
import { APT_ROOT } from '~/utils/constants'


// board
export const fetchBoardDetialsAPI = async (boardId) => {
  const response = await axios.get(`${APT_ROOT}/v1/boards/${boardId}`)
  // lưu ý: axios sẽ trả kết quả về qua property của nó là data
  return response.data
}

export const updateBoardDetialsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${APT_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${APT_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

// column
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${APT_ROOT}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetialsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${APT_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

// cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${APT_ROOT}/v1/cards`, newCardData)
  return response.data
}