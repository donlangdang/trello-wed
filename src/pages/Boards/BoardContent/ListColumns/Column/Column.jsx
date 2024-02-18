import { useState } from 'react'
import { toast } from 'react-toastify'
import { Box, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import Cloud from '@mui/icons-material/Cloud'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCard from './ListCard/ListCard'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CloseIcon from '@mui/icons-material/Close'
// import theme from '~/theme'
import { useConfirm } from 'material-ui-confirm'


function Column({ column, createNewCard, deleteColumnDetails }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: column._id, data: { ...column } })

  const dndKitColumnStyles = {
    // touchAction: 'none', // dành cho sensor default dạng PointerSensor
    // tochAction: 'name', dành cho sensor default dang PointerSensor
    // nếu sử dụng CSS.transform như docs sẽ lỗi kiểu stretch
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    // chiều cao luôn phải là max 100% vì nếu không sẽ lỗi lúc kéo column ngắn qua một cái column dài thì phải kéo ở khu vực giữa rất khó chịu. lưu ý lúc này phải kết hợp {...listeners} nằm ở Box chứ không phải ở div ngoài cùng để tránh trường hợp kéo vào vùng xanh.
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  // cards đã được sắp xếp ở componenet cha cao nhất (board/_id.jsx)
  const orderedCards = column.cards

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleopenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')

  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error('Please enter Card Title!')
      return
    }
    // gọi API ở đây
    // tạo dữ liệu card để gọi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }
    createNewCard(newCardData)

    // Đóng lại trạng thái thêm Column mới và Clear input
    toggleopenNewCardForm()
    setNewCardTitle('')
  }

  //xử lí xóa 1 column và cards bên trong nó
  // mui dialog confirm
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete column?',
      description: 'This action will premanently delete your Column and Cards! Are you sure?',
      // content: 'test here',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'

      // allowClose: false,
      // dialogProps: { maxWidth: 'xs' },
      // cancellationButtonProps: { color: 'inherit' },
      // confirmationButtonProps: { color: 'secondary', variant: 'outlined' },

      // escription: 'nhap donlangdang moi dc confirm',
      // confirmationKeyword: 'donlangdang',
      // buttonOrder: ['confirm', 'cancel']

    })
      .then(() => {
        // confirm here
        // hoc redux
        deleteColumnDetails(column._id)
      })
      .catch(() => {
        // cancel here
      })
  }

  // phải bọc div ở đây vì vấn đề chiều cao của column khi kéo thả sẽ có bug gần giống flickering
  return (
    <div
      ref={setNodeRef}
      style={dndKitColumnStyles}
      {...attributes}
    >
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2.2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        {/* Ctrl + Shift + K	Xóa dòng con trỏ đang đứng
        Shift + Alt + ↓	Copy dòng hiện tại và paste xuống dưới 1 dòng */}
        {/*box columm header*/}
        <Box sx={{
          height: (theme) => theme.trello.columnHeaderHeight,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant='h6' sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            {column?.title}
          </Typography>
          <Box>
            <Tooltip title='More option'>
              <ExpandMoreIcon
                sx={{ color:'text.primary', cursor:'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem
                onClick={toggleopenNewCardForm}
                sx={{
                  '&:hover': {
                    color: 'success.light',
                    '& .add-card-icon': { color: 'success.light' }
                  }
                }}
              >
                <ListItemIcon><AddCardIcon className='add-card-icon' fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Coppy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                <ListItemText>Patse</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .delete-forever-icon': { color: 'warning.dark' }
                  }
                }}
              >
                <ListItemIcon>
                  <DeleteForeverIcon className='delete-forever-icon' fontSize="small" /></ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        {/*box list card*/}
        <ListCard cards={orderedCards} />
        {/*box columm footer*/}
        <Box sx={{
          height: (theme) => theme.trello.columsFooterHeight,
          p: 2
        }}>
          {!openNewCardForm
            ? <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button startIcon={<AddCardIcon />} onClick={toggleopenNewCardForm}>Add new card</Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
            : <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TextField
                label="Enter card title..."
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': { borderRadius: 1 }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  data-no-dnd="true"
                  onClick={addNewCard}
                  variant="contained" color="success" size="small"
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}
                >Add
                </Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                  onClick={toggleopenNewCardForm}
                />
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column