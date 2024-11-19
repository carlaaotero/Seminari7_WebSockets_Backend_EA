import { Server } from 'socket.io';


const connectedUser = new Set();

const socketService = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('Connected successfully', socket.id);
        socket.join("some room");
        connectedUser.add(socket.id);
        io.to("some room").emit('connected-user', connectedUser.size);
    
        socket.on('disconnect', () => {
          console.log('Disconnected successfully', socket.id);
          connectedUser.delete(socket.id);
          io.to("some room").emit('connected-user', connectedUser.size);
        });
    
        socket.on('manual-disconnect', () => {
          console.log('Manual disconnect requested', socket.id);
          socket.disconnect();
        });

        //Funció per enviar el missatge i la data
        socket.on('message', async (data: string) => {
          const messageSchema: { 
            date: Date; message: string 
          } = {
            date: new Date(), 
            message: data 
          }
          console.log(messageSchema);
          socket.to("some room").emit('message-receive', messageSchema);
        });
    
        socket.on('sendMessage', async (data) => {
          const messageSchema: { 
            date: Date; message: string 
          } = {
            date: new Date(), 
            message: data 
          }
          console.log(messageSchema)
          io.to("some room").emit('message-receive', messageSchema);
        });

      });


      
};

export default socketService;