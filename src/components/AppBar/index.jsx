import { Box } from '@mui/material'
import ModeSelect from '../ModelSelect'

export default function AppBar() {
  return (
    <Box sx={{
      backgroundColor:'primary.light',
      width: '100%',
      height: (theme) => theme.trelloCustom.appBoardHeight,
      // display: flex va alignItems: 'center' dung de can giua noi dung theo chieu doc
      display: 'flex',
      alignItems: 'center'
    }}>
      <ModeSelect />
    </Box>
  )
}
