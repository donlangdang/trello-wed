import axios from 'axios'
import { APT_ROOT } from '~/utils/constants'


// board
export const fetchBoardDetialsAPI = async (boardId) => {
  const response = await axios.get(`${APT_ROOT}/v1/boards/${boardId}`)
  // lưu ý: axios sẽ trả kết quả về qua property của nó là data
  return response.data
}

// column
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${APT_ROOT}/v1/columns`, newColumnData)
  return response.data
}
// cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${APT_ROOT}/v1/cards`, newCardData)
  return response.data
}