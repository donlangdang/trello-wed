import { Box } from '@mui/material'

export default function BoardContent() {
  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976b2'),
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
