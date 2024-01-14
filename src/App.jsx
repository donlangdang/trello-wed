import Board from '~/pages/Boards/_id'


// code đi vào main.jsx rồi vào .root render ra <App /> gọi App funciton gọi từ App.jsx rồi từ file này định tuyến tới các trang khác sẽ có trong các file khác định tuyến đại loại như /route
function App() {

  return (
    <>
      {/* khai bao cac tuyen duong route /Board Board/{board_id}... */}
      <Board />
    </>
  )
}

export default App
