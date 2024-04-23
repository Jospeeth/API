const mysql = require('mysql')

const connection= mysql.createConnection({

    host: 'mysql-elvis.alwaysdata.net',
    user: 'elvis',
    password: '194757616Jo',
    database: 'elvis_sampledatabase'

})


connection.connect((err)=>{
    if(err){
        console.log('Error', err)
    }
    else{
        console.log('connectado')
    }
})

module.exports = connection;
