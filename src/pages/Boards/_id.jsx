import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { fetchBoardDetialsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // react-router-dom
    const boardId = '65be4cbf4858d60d2200c7dd'
    // Call Api
    fetchBoardDetialsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      {/* ?. Optional chaining (?.)*/}
      <BoardBar board={board}/>
      <BoardContent board={board}/>
    </Container>
  )
}
export default Board
