const socket =  io(); // This will create a connection from client to server

// elements
const messegeForm = document.querySelector('#Msg-form');
const messegeFormInput = messegeForm.querySelector('input');
const messegeFormButton = messegeForm.querySelector('button');
const sendLocationButton = document.querySelector('#send-location');
const $messeges = document.querySelector('#messeges');

//templates
const messegeTemplate = document.querySelector('#messege-Template').innerHTML;
const locationmessegeTemplate = document.querySelector('#location-messege-Template').innerHTML;
const sidebar_template = document.querySelector('#sidebar-template').innerHTML;

// options 
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix : true })

const autoscroll = () =>{
    
    // New Message Element
    const $newMessage = $messeges.lastElementChild;

    // Height of the new message
    const newMessageMargin = parseInt(getComputedStyle($newMessage).marginBottom);
    const newMessageHeight = $messeges.offsetHeight + newMessageMargin;

    // Visible Height
    const visibleHeight = $messeges.offsetHeight;

    // Container Height
    const containerheight = $messeges.scrollHeight;

    // How far have i scrolled
    const scrollOffset = $messeges.scrollTop + visibleHeight
    
    if( containerheight - newMessageHeight <= scrollOffset  ){
        $messeges.scrollTop = $messeges.scrollHeight
    }
}

socket.on("msg",(msg)=>{
    console.log(msg)
    const html = Mustache.render(messegeTemplate,{
        username: msg.username,
        messege : msg.text,
        createdAt : moment( msg.createdAt ).format('h:mm a')
    });
    $messeges.insertAdjacentHTML('beforeend',html);
    autoscroll();
})

socket.on('locationMessege',({username,url,createdAt}) =>{
    // console.log(url);
    const html = Mustache.render(locationmessegeTemplate,{
        username,
        url,
        createdAt : moment( createdAt ).format('h:mm a')
    })
    $messeges.insertAdjacentHTML('beforeend',html);
    autoscroll(); 
})

socket.on('roomData',({ room, users}) =>{
    const html = Mustache.render(sidebar_template,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html;
})

messegeForm.addEventListener('submit',(e) =>{
    e.preventDefault();
    messegeFormButton.setAttribute('disabled','disabled')

    const msg = e.target.elements.messege.value;
    if( msg === ''){
        messegeFormButton.removeAttribute('disabled');
        return alert('You cannot send an empty messege!');
    }

    e.target.elements.messege.value = '';

    socket.emit('sendMsgToall', msg , () =>{
        console.log("Delivered...!")
        messegeFormButton.removeAttribute('disabled');
        messegeFormInput.focus();
    })
})

document.querySelector('#send-location').addEventListener('click',()=>{

    sendLocationButton.setAttribute('disabled','disabled');

    if(!navigator.geolocation){
        sendLocationButton.removeAttribute('disabled');
        return alert('Your browser does not support geolocation')
    }

    navigator.geolocation.getCurrentPosition((position) =>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },() =>{
            console.log("Location Shared..!!")
            sendLocationButton.removeAttribute('disabled');
        })
    })
})

socket.emit('join',{ username, room},( error ) =>{
    if( error ){
        alert( error )
        location.href = '/'
    }
});