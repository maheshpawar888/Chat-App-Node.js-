var users = [];

const addUser = ({ id, username, room }) =>{

    if( !username || !room ){
        return{
            error : 'Username and room are required..!!'
        }
    }

    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUsername = users.find( (user) =>{
        return user.room === room && user.username === username ? true : false;
    })

    if( existingUsername ){
        return{
            error: 'Username is already taken..!!'
        }
    }

    const user = { id, username, room };
    users.push( user );
    return { user };    
}

// remove user by id
const removeUser = ( id ) =>{
    const index = users.findIndex( (user) =>{
        return user.id === id;
    })

    if( index !== -1 ){
        return users.splice(index,1)[0];
    }
}

// get user by id
const getUser = ( id ) =>{
    const user = users.find( ( user )=>{
        return user.id === id;
    })
    return user ;
}

// get Users in room
const getUsersInRoom = ( room ) =>{

    room = room.trim().toLowerCase();
    const usersInRoom = users.filter( (user) => user.room === room )
    
    if( usersInRoom.length > 0 ) return usersInRoom
    else return [];
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
