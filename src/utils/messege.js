
const generateMessege = (username,text) =>{
    return{
        username,
        text,
        createdAt : new Date().getTime()
    }
}

const generateLocationMessege = (username,url) =>{
    return{
        username,
        url,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    generateMessege,
    generateLocationMessege
}