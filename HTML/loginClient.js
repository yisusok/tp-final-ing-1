const formE1 = document.querySelector('.form');

formE1.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(formE1);
    const data = Object.fromEntries(formData);

    console.log('Revisa el valor del form');
    console.log(data);

    if (data.contacto === '' || data.password === '') {
        console.log('Debe indicar usuario y contraseña');
        mostrarMensaje('Debe informar usuario y contraseña para completar el acceso', 'RED');
        return;
    }

    if (data.contacto === 'pec') {
        console.log('pec no es bienvenido en este sistema');
        mostrarMensaje('El usuario "pec" no es bienvenido en este sistema', 'RED');
        return;
    }

    if (data.termscondition !== 'on') {
        console.log('No aceptó los T&C, no se puede loggear');
        mostrarMensaje('Debe aceptar los T&C para poder usar el sistema', 'RED');
        return;
    }

    // URL de la API y configuración de la solicitud
    const API = 'http://127.0.0.1:8080/api/loginClienteEmail';
    const login = {
        "contacto": data.contacto,
        "password": data.password
    };

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login)
    };

    console.log("URL de la API:", API);
    console.log("Datos de login:", JSON.stringify(login));

    fetch(API, options)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error en la solicitud: ${res.status}`);
            }
            return res.json();
        })
        .then(response => {
            console.log("Respuesta de la API:", response);

            if (response.response === 'OK') {
                mostrarMensaje(`Bienvenido al sistema ${response.nombre}, último ingreso ${response.fecha_ultimo_ingreso}`, 'BLACK');
                window.location.href = `http://127.0.0.1:5500/listarTicket.html?id=${response.id}&contacto=${response.contacto}&nombre=${response.nombre}&fecha_ultimo_ingreso=${response.fecha_ultimo_ingreso}`;
            } else {
                mostrarMensaje('Error de login, intente nuevamente', 'RED');
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            mostrarMensaje('Error en la solicitud, intente más tarde', 'RED');
        });
});

function mostrarMensaje(mensaje, color) {
    const resultado = document.getElementById('resultado');
    resultado.style.color = color;
    resultado.style.textAlign = "center";
    resultado.textContent = mensaje;
}
