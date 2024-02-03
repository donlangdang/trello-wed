import axios from 'axios'
import { APT_ROOT } from '~/utils/constants'

export const fetchBoardDetialsAPI = async (boardId) => {
  const response = await axios.get(`${APT_ROOT}/v1/boards/${boardId}`)
  // lưu ý: axios sẽ trả kết quả về qua property của nó là data
  return response.data
}