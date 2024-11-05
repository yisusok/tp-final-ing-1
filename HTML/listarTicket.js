// Función para procesar los parámetros recibidos en el URL
function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

// Comienza el script de listarTicket.js
console.log("Comienza listarTicket.js");

var query = getQueryParams(document.location.search);
console.log("id:", query.id);
console.log("contacto:", query.contacto);
console.log("nombre:", query.nombre);
console.log("ultima_fecha:", query.fecha_ultimo_ingreso);

// Actualiza el banner de seguridad
document.getElementById("lastlogin").innerHTML = `
    <table>
        <tr><td>Cliente</td><td>${query.id}</td></tr>
        <tr><td>Contacto</td><td>${query.contacto}</td></tr>
        <tr><td>Nombre</td><td>${query.nombre}</td></tr>
        <tr><td>Ultimo ingreso</td><td>${query.fecha_ultimo_ingreso}</td></tr>
    </table>`;
    

// Accede a la REST API para obtener tickets
const HTMLResponse = document.querySelector("#app");
const RESTAPI = {
    listarTicket: "http://localhost:8080/api/listarTicket", // URL de la API
};

// Asegúrate de usar la ID correcta
const clienteID = query.id; 

const ticket = {
    "clienteID": clienteID,
};

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticket),
};

console.log("API_listarTicket:", RESTAPI.listarTicket);
console.log("ticket  :", JSON.stringify(ticket));
console.log("options :", JSON.stringify(options));

// Realiza la solicitud a la API
fetch(`${RESTAPI.listarTicket}`, options)
    .then(res => res.json())
    .then(ticket => {
        console.log(ticket);
        let hasTickets = false; // Variable para verificar si hay tickets
        let table = document.createElement("table");
        table.style.border = "1px solid";
        table.style.backgroundColor = "#ffffff"; // Color de fondo

        // Itera sobre los tickets
        ticket.data.forEach((t) => {
            console.log(t.clienteID);
            if (t.clienteID === clienteID) { // Usa clienteID
                if (!hasTickets) {
                    hasTickets = true;
                    const headerRow = ["Cliente", "ID", "Motivo", "Estado", "Fecha"];
                    let tr = document.createElement("tr");
                    tr.style.border = "1px solid";
                    headerRow.forEach((item) => {
                        let th = document.createElement("th");
                        th.style.border = "1px solid";
                        th.innerText = item;
                        tr.appendChild(th);
                    });
                    table.appendChild(tr);
                }

                const bodyRow = [t.clienteID, `${t.id}`, `${t.solucion}`, `${t.estado_solucion}`, `${t.ultimo_contacto}`];
                let trl = document.createElement("tr");
                bodyRow.forEach((line) => {
                    let td = document.createElement("td");
                    td.style.border = "1px solid";
                    td.innerText = line;
                    trl.appendChild(td);
                });
                table.appendChild(trl);
            }
        });

        if (hasTickets) {
            console.log(table);
            HTMLResponse.appendChild(table);
        } else {
            console.log("No tiene tickets");
            document.getElementById('mensajes').style.textAlign = "center";
            document.getElementById('mensajes').style.color = "RED";
            document.getElementById("mensajes").innerHTML = "No hay tickets pendientes";
        }
    })
    .catch(error => {
        console.error("Error al obtener los tickets:", error);
        document.getElementById('mensajes').style.textAlign = "center";
        document.getElementById('mensajes').style.color = "RED";
        document.getElementById("mensajes").innerHTML = "Error al obtener los tickets. Inténtalo de nuevo más tarde.";
    });
