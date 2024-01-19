import { Box, Button } from '@mui/material'
import Column from './Column/Column'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'


function ListColumns({ columns }) {
  // thằng SortableContext yêu cầu id dưới dạng mảng(array) ['id-1', 'id-2'] chứ không phải [{id: 'id-1'},
  // {id: 'id-2'}]
  // nếu không dùng thì vẫn kéo thả được nhưng ko có animation
  // https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={ horizontalListSortingStrategy }>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 1 }
      }}>
        {columns?.map(column => <Column key={column._id} column={column}/>)}
        {/*box columm 1*/}
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
    </SortableContext>
  )
}

export default ListColumns