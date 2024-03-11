const apiUrl = "/api/invitations"

const sentInvitation = async (body) => {

    await api_conection("POST", apiUrl + "/create_invitation", body, function () {
        Swal.fire({
            icon: 'success',
            title: 'Invitación enviada',
            text: 'Tu invitación ha sido enviada. Serás contactado en los próximos días.',
        }).then((result) => {

            if (result.isConfirmed || result.isDismissed) {
                location.href = '/';
            }
        });
    })
}

function validarCamposLlenos() {
    let campos = ["nombre", "responsabilidad", "ministerio", "email", "contacto", "fecha", "cantidad", "descripcion"];

    for (let campo of campos) {
        if (!$(`#${campo}`).val()) {
            return false;
        }
    }

    return true;
}

const valueMonth = (number_month) => {
    let mes = ''
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

    if (number_month >= 1 && number_month <= 12) {
        mes = months[number_month - 1]
    } else {
        console.error('Mes no reconocido');
    }

    return mes
}

$(async function () {
    $.fn.datepicker.defaults.language = "es";
    $('#fecha').datepicker()

    const fechaActual = moment();
    let mesActual = await  valueMonth(fechaActual.month() + 1);
    $("#month_actual").text(mesActual);
    let añoActual = fechaActual.year();
    $("#year_actual").text(añoActual);


    $("#sendInvitacion").click( async function () {
        if (validarCamposLlenos()) {
            // Todos los campos están llenos, puedes continuar con la lógica de tu aplicación

            let body = {
                nombre: $("#nombre").val(),
                responsabilidad: $("#responsabilidad").val(),
                ministerio: $("#ministerio").val(),
                email: $("#email").val(),
                celular: $("#contacto").val(),
                fechaEvento: moment($("#fecha").val()).format(),
                numeroPersonas: $("#cantidad").val(),
                nombre_evento: $("#nombre_evento").val(),
                lugar_evento: $("#lugar_evento").val(),
                descripcionEvento: $("#descripcion").val(),
            };

            await sentInvitation(body)

            console.log(body);
        } else {
            notyf.error("Por favor, complete todos los campos.");
        }
    });


})

