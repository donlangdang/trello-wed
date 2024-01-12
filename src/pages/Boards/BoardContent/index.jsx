import { Box } from '@mui/material'

export default function BoardContent() {
  return (
    <Box sx={{
      backgroundColor:'primary.main',
      width: '100%',
      // string literla javascipt
      height: (theme) => `calc(100vh - ${theme.trelloCustom.appBoardHeight} - ${theme.trelloCustom.boardBoardHeight})`,
      display: 'flex',
      alignItems: 'center'
    }}>
      board content
    </Box>
  )
}
