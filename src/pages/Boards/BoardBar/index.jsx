import { Box } from '@mui/material'

export default function BoardBar() {
  return (
    <Box sx={{
      backgroundColor:'primary.dark',
      width: '100%',
      height: (theme) => theme.trelloCustom.boardBoardHeight,
      // display: flex va alignItems: 'center' dung de can giua noi dung theo chieu doc
      display: 'flex',
      alignItems: 'center'
    }}>
      board bar
    </Box>
  )
}
