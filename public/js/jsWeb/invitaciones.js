const apiUrl = "/api/invitations"

const sentInvitation = async (body) => {

    await api_conection("POST", apiUrl + "/createOne", body, function () {
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

$(async function () {


    $("#sendInvitacion").click(function () {
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
                descripcionEvento: $("#descripcion").val(),
            };

            sentInvitation(body)

            console.log(body);
        } else {
            notyf.error("Por favor, complete todos los campos.");
        }
    });


})

