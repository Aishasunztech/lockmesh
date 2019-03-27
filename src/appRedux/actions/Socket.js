export const getNotification = (socket) => {
    return (dispatch) => {
        socket.on('getNotification',(data)=>{
            // dispatch(
            //     action: 
            // )
        })
    }
}