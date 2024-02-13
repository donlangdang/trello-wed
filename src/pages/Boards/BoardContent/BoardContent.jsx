import { Box } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  // PointerSensor,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  // closestCenter,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState, useCallback, useRef } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCard/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
export default function BoardContent({ board, createNewColumn, createNewCard }) {
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
  // cùng 1 thời điểm chỉ có 1 phần tử được kéo là column hoặc card
  const [activeDragItemId, setActiveDragItemId] = useState([])
  const [activeDragItemType, setActiveDragItemType] = useState([])
  const [activeDragItemData, setActiveDragItemData] = useState([])
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState([])

  // diểm va chạm cuối cùng trước đó (xử lý phát hiện va chạm)
  const lastOverId = useRef(null)

  useEffect(() => {
    const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(orderedColumns)
  }, [board])

  // tìm 1 cái column theo cardId
  const findColumnByCardId = (cardId) => {
    // đọan này lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi  mới tạo ra cardOrderId
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  //function chung xử lí viêck cập nhật lại state trong trường hợp di chuyển card giữa 2 column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      // tìm vị trí index của overCard trong column đích(nơi activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
      // logic tính toán "cardIndex mới" (trên hoặc dưới overCard) lấy chuẩn ra từ code của thư viện - nhiều khi muốn từ chối hiểu(lmao) rảnh thì xem thêm rect()
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.card?.leght + 1

      // clone mảng OrderedColumnsState cũ ra một cái mới để xử lí data rồi return cập nhật lại OrderedColumnsState mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
      //columns cũ
      if (nextActiveColumn) {
        // xóa card ở cái column active ( cũng có thể hiểu là column cũ, cái cái lúc mà kéo card ra khỏi nó để sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // thêm placeholder card nếu column rỗng: bị kéo hết card đi, không còn cái nào nữa
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      // column mới
      if (nextOverColumn) {
        // kiểm tra xem card đang kéo có tồn tại ở overColumn chưa, nếu có thì xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        // phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // tiếp theo là thêm card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // xóa placeholder card đi nếu nó đang tồn tại 37.2
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)
        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      // console.log('overCardIndex: ', overCardIndex)
      return nextColumns
    })
  }

  // khi bắt đầu kéo(drag) 1 phần tử
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', handleDragStart)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
    // nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // trong quá trình kéo phần tử
  const handleDragOver = (event) => {
    // không làm gì thêm nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    //còn nếu léo card thì xử lí thêm để có thể kéo card qua lại giữa các column
    const { active, over } = event

    // đảm bảo ko tồn tại active or ko tồn tại over khi kéo ra khỏi phạm vi container thì ko làm gì cả để tránh crash trang wed
    if (!over || !active) return
    // activeDraggingCardId là card đang được kéo
    const { id:  activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard là card đang tương tác ở trên hoặc ở dưới so với card đang được kéo ở trên
    const { id:  overCardId } = over
    // tìm 2 cái  columns theo Cards
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // nếu ko tồn tại 1 trong 2 column thì ko làm gì cả để tránh crash trang web
    if (!activeColumn || !overColumn) return

    // xử lí logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu thì không phải làm gì
    // vì đây là đoạn xử lí lúc kéo (handleDragOver), còn xử lí lúc kéo xong thì nó lại là vấn đề khác ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      // console.log('code chay vao day')
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  // khi kết thúc hành động(thả) kéo 1 phần tử (drag => drop)
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event

    // đảm bảo ko tồn tại active or ko tồn tại over khi kéo ra khỏi phạm vi container thì ko làm gì cả để tránh crash trang wed
    if (!over || !active) return
    // xử lí kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('cái này từ từ làm')
      const { id:  activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard là card đang tương tác ở trên hoặc ở dưới so với card đang được kéo ở trên
      const { id:  overCardId } = over
      // tìm 2 cái  columns theo Cards
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      // nếu ko tồn tại 1 trong 2 column thì ko làm gì cả để tránh crash trang web
      if (!activeColumn || !overColumn) return
      // hành động kéo thả card giữa 2 column khác nhau
      // phải dùng activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id(set vào state từ bước handleDragStart) chứ không phải activeData trong Scope handleDragEnd này vì khi đi qua onDragOver tới đây là state của card đã bị cập nhật 1 lần rồi.
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // console.log('hành động kéo thả card giữa 2 column khác nhau')
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // hành động kéo thả card trong cùng 1 column
        // console.log('hành động kéo thả card trong cùng 1 column')

        // lấy vị trí cũ từ thằng oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // lấy vị trí mới từ thằng overColumn
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        // dùng arrayMove vì kéo card trong 1 column tương tự như kéo column trong boardcontent
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        // console.log('dndOrderedCards: ', dndOrderedCards)
        setOrderedColumns(prevColumns => {
          // clone mảng OrderedColumnsState cũ ra một cái mới để xử lí data rồi return cập nhật lại OrderedColumnsState mới
          const nextColumns = cloneDeep(prevColumns)
          // tìm tới column mà chúng ta đang thả
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          // cập nhật lại 2 giá trị mới là card và cardOrderIds trong targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)
          // trả về giá trị state mới (chuẩn vị trí)
          return nextColumns
        })
      }
    }
    // xử lí kéo thả column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {

      if (active.id !== over.id) {
        // lấy vị trí cũ từ thằng active
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // lấy vị trí mới từ thằng over
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        // dndOrderedColumns mảng column sau khi đã kéo thả
        // dung arrayMove của dnd-kit để sắp xếp lại mảng columns ban đầu
        // code của arryMove ở đây: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // 2 console.log dữ liệu này để sau này xử lí goi API
        // console.log('dndOrderedColumnsIds: ', dndOrderedColumnsIds)
        // console.log('dndOrderedColumns: ', dndOrderedColumns)

        // cập nhật lại state(vị trí) column ban đầu sau khi kéo thả
        setOrderedColumns(dndOrderedColumns)
      }
    }
    //nếu vị trí sau khi kéo thả khác với vị trí ban đầu

    // những dữ liệu sau khi kéo thả này luôn phải đưa về giá trị null mặc định ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  // console.log('activeDragItemId: ', activeDragItemId)
  // console.log('activeDragItemType: ', activeDragItemType)
  // console.log('activeDragItemData: ', activeDragItemData)
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }
  // custom lại chiến lược / thuật toán phát hiện va chạm tối ưu cho việc kéo thả card giữa nhiểu columns
  // args = arguments = các đối số, tham số
  const collisionDetectionStrategy = useCallback((args) => {
    // trưởng hợp kéo column thì dùng thuật toán closestCorners là chuẩn nhất
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }
    // tìm các điểm giao nhau, va chạm - intersections với con trỏ
    const pointerIntersections = pointerWithin(args)
    // nếu pointerIntersections là mảng rỗng thì return luôn
    // bug: kéo card có image cover lớn và kéo lên phía cùng khu vực kéo thả
    if (!pointerIntersections?.length) return
    // toán tử 3 ngôi javascript
    // thuật toán phát hiện va chạm sẽ trả về 1 mảng các va chạm ở đây.
    // const intersections = !!pointerIntersections?.length
    //   ? pointerIntersections
    //   : rectIntersection(args)

    // tìm overId đầu tiên trong đám intersections ở trên.
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      // video 37: đoạn này để fix flickering,
      // nếu over nó là column thì sẽ tìm tới cardId gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện va chạm clossesCenter hoặc closestCorners đều được. tuy nhiên ở đây dùng closestCenter thì sẽ mượt mà hơn
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        // console.log('overId before: ', overId)
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
        // console.log('overId after: ', overId)
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }
    // nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
    // cảm biến
      sensors={sensors}
      // thuật toán phát hiện va chạm (nếu không có thì card với cover lớn sẽ không kéo qua column được vì lúc này nó đang bị conflict giữa card và column), chúng ta sẽ dùng closestCorners thay vị closestCenter
      // tìm trong doc dnd-kit
      // Update: nếu chỉ dùng closestCorners sẽ có bug flickering + sai lệch dữ liệu (vd 37)
      // collisionDetection={closestCorners}
      // tự custom nâng cao thuật toán phát hiện va chạm
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976b2'),
        width: '100%',
        // string literla javascipt
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}
