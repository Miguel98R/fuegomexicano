const apiUrl = "/api/invitations"
const apiAgenda = "/api/agendas"

const sentInvitation = async (body) => {
    HoldOn.open(HoldOptions)
    await api_conection("POST", apiUrl + "/create_invitation", body, function () {
        HoldOn.close()
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

const drawEvents = async (id_event) => {

    let template = $("#tempalte_dates_").clone();

    template.attr('id', 'tempalte_dates_' + id_event).css('display', 'block');
    template.find('#date_event_').attr('id', 'date_event_' + id_event)
    template.find('#date_location_').attr('id', 'date_location_' + id_event)

    return template
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
const getDataMonthActual = async (month) => {
    let body = {
        mes:month.toString()
    }
    await api_conection("POST", apiAgenda + "/getOneActive", body, async function (data) {
        let data_month = data.result

        if (data_month.length > 0) {
            for (let jtem of data_month[0].events) {

                let div_event = await drawEvents(jtem._id);
                div_event.find('#date_event_' + jtem._id).text(moment(jtem.date).format("dddd DD"));
                div_event.find('#date_location_' + jtem._id).text(jtem.location)

                $('#dates_').append(div_event)
            }

        } else {
            $('#dates_').append(`<h6 class="text-center my-2 text-danger fw-lighter">No hay fechas establecidas para este mes</h6>`)
        }

    })
}

$(async function () {
    $.fn.datepicker.defaults.language = "es";
    $('#fecha').datepicker()

    const fechaActual = moment();
    let mesActual = await  valueMonth(fechaActual.month() + 1);
    $("#month_actual").text(mesActual);
    let añoActual = fechaActual.year();
    $("#year_actual").text(añoActual);

    await getDataMonthActual(mesActual)


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

