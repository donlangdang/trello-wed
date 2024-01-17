import { Box, Button } from '@mui/material'
import Column from './Column/Column'
import NoteAddIcon from '@mui/icons-material/NoteAdd'


function ListColumns() {

  return (
    <Box sx={{
      bgcolor: 'inherit',
      width: '100%',
      height: '100%',
      display: 'flex',
      overflowX: 'auto',
      overflowY: 'hidden',
      '&::-webkit-scrollbar-track': { m: 1 }
    }}>
      {/*box columm 1*/}
      <Column />
      <Column />
      <Column />
      {/* Box Add new column CTA */}
      <Box sx={{
        minWidth: '200px',
        maxWidth: '200px',
        mx: 2,
        bgcolor: '#ffffff3d',
        ml: 2.2,
        borderRadius: '6px',
        height: 'fit-content'
      }}>
        <Button
          startIcon={<NoteAddIcon />}
          sx={{
            color: 'white',
            width: '100%',
            justifyContent: 'flex-start',
            pl: 2.5,
            py: 1
          }}
        >
        Add new columm
        </Button>
      </Box>
    </Box>
  )
}

export default ListColumns