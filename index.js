const express = require('express')
const app = express()
const con= require('./connection/connection')
const desiredPort= process.env.PORT || 3000

app.listen(desiredPort, () => {
    console.log(`server listening on port http://localhost:${desiredPort}`)
  })

 


app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    
    const sqlUser = 'SELECT customerNumber, customerName, contactLastName, phone, addressLine1, city FROM customers WHERE customerNumber = ?';
    const sqlOrders = 'SELECT orderNumber, orderDate, status FROM orders WHERE customerNumber = ?';
    const sqlOrderDetails = 'SELECT orderNumber, SUM(quantityOrdered * priceEach) AS total FROM orderdetails WHERE orderNumber IN (SELECT orderNumber FROM orders WHERE customerNumber = ?) GROUP BY orderNumber';
    
    con.query(sqlUser, [userId], (error, userResults) => {
        if (error) {
            console.error('Error al ejecutar la consulta de usuario:', error);
            res.status(500).json({ error: 'Error al obtener el usuario' });
            return;
        }
        if (userResults.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado', 
        status: res.status(404).stat});
            return;
        }

   // check if user is found
        con.query(sqlOrders, [userId], (error, orderResults) => {
            if (error) {
                console.error('Error al ejecutar la consulta de órdenes:', error);
                res.status(500).json({ error: 'Error al obtener las órdenes del usuario' });
                return;
            }

            con.query(sqlOrderDetails, [userId], (error, orderDetailsResults) => {
                if (error) {
                    console.error('Error al ejecutar la consulta de detalles de la orden:', error);
                    res.status(500).json({ error: 'Error al obtener los detalles de la orden' });
                    return;
                }
                console.log(orderDetailsResults)
                // Mapeamos los valores totales de las órdenes a sus respectivas órdenes
                const orderTotalMap = {};
                orderDetailsResults.forEach(detail => {
                    orderTotalMap[detail.orderNumber] = detail.total;
                });

                // Agregamos el valor total a cada orden
                orderResults.forEach(order => {
                    order.total = orderTotalMap[order.orderNumber];
                });


                // Enviamos la información del usuario y sus órdenes
                res.status(200).json({
                    user: userResults[0],
                    orders: orderResults
                });
            });
        });
    });
});
