var client_socket = io.connect('http://192.168.1.253:3000/');
$(function(){
    $('#send_data').on('click',function(){
        client_socket.emit('chat',{
            send_data : $('#id_data_to_send').val()
        })
    })
    
    client_socket.on('recived_data',function(data){
        $('#id_data').html(data.send_data);
    })

});
