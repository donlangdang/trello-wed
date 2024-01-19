import { Box } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

export default function BoardContent({ board }) {
  // https://docs.dndkit.com/api-documentation/sensors
  // nếu dùng PointerSensor mặc định thì phải kết hợp thuộc tính CSS touch-action: none ở những phần tử kéo thả-nhưng mà con bug đó nha
  // const pointerSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })


  // ưu tiên dùng MouseSensor và TouchSensor để tối uưu trải nghiệm trên điện thoai or máy tính bảng
  // yêu cầu chuột di chuyển 10px mới gọi event.
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // nhấn giữ 250ms và dung sai cảm ứng.
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })


  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(orderedColumns)
  }, [board])

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event

    // kiểm tra nếu không tồn tại over(over = null) kéo linh tinh ra ngoài thì return luôn tránh lỗi
    if (!over) return

    //nếu vị trí sau khi kéo thả khác với vị trí ban đầu
    if (active.id !== over.id) {
      // lấy vị trí cũ từ thằng active
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // lấy vị trí mới từ thằng over
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)

      // dndOrderedColumns mảng column sau khi đã kéo thả
      // dung arrayMove của dnd-kit để sắp xếp lại mảng columns ban đầu
      // code của arryMove ở đây: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // 2 console.log dữ liệu này để sau này xử lí goi API
      // console.log('dndOrderedColumnsIds: ', dndOrderedColumnsIds)
      // console.log('dndOrderedColumns: ', dndOrderedColumns)

      // cập nhật lại state(vị trí) column ban đầu sau khi kéo thả
      setOrderedColumns(dndOrderedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976b2'),
        width: '100%',
        // string literla javascipt
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns}/>
      </Box>
    </DndContext>
  )
}