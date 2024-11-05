// 4. Implemente un API REST denominado /api/listTicket de manera que al
// ejecutarlo devuelva todos los tickets disponibles en el database
// independientemente del cliente bajo el que se encuentren registrados. Se
// sugiere utilizar la función scandb de dynamoDB para implementarlo en forma
// similar, pero con los ajustes del caso, a lo realizado en listCliente en el caso de
// funciones lambda AWS. Realice la prueba de la misma tanto con POSTMAN
// como en un Web Browser cualquiera, muestre en ambos casos captura de
// pantalla como evidencia. Implemente las funciones GUI de tal manera de poder
// ejecutar ésta función desde un browser

/*LIST TICKET */
app.get('/api/listTicket', (req, res) => {
    scanDBTickets()
    .then(resultDb => {
        console.log(resultDb);
        if (Object.keys(resultDb).length === 0) {
            res.status(400).send({response: "ERROR", message: "No hay tickets disponibles"});
        } else {
            res.status(200).send(JSON.stringify({response: "OK", data: resultDb}));
        }
    })
    .catch(error => {
        res.status(500).send({response: "ERROR", message: "Error al acceder a la base de datos", error});
    });
});

async function scanDBTickets() {
    try {
        const input = {
            TableName: "ticket", // Nombre de la tabla de DynamoDB
            Select: "SPECIFIC_ATTRIBUTES",
            AttributesToGet: [
                'id', 'descripción', 'fechaAlta', 'estado', 'id.cliente'
            ],
        };

        const response = await docClient.scan(input).promise();
        return response.Items;
    } catch (error) {
        console.error("Error en scanDBTickets:", error);
        return null;
    }
};


/*LIST TICKET */