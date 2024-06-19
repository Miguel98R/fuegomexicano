const apiAgenda = "/api/agendas"
const apiCongresos = "/api/congresos"

const drawMonths = async (id_month) => {

    let template = $("#template_months_").clone();

    template.attr('id', 'template_months_' + id_month).css('display', 'block');
    template.find('#name_month_').attr('id', 'name_month_' + id_month)
    template.find('#dates_').attr('id', 'dates_' + id_month)

    return template
}

const drawEvents = async (id_event) => {

    let template = $("#tempalte_dates_").clone();

    template.attr('id', 'tempalte_dates_' + id_event).css('display', 'block');
    template.find('#date_event_').attr('id', 'date_event_' + id_event)
    template.find('#date_location_').attr('id', 'date_location_' + id_event)

    return template
}

const drawCongresos = async (id_congreso) => {

    let template = $("#template_congresos_").clone();

    template.attr('id', 'template_congresos_' + id_congreso).css('display', 'block');
    template.find('#link_img_').attr('id', 'link_img_' + id_congreso)
    template.find('#img_congreso_').attr('id', 'img_congreso_' + id_congreso)
    template.find('#name_congreso_').attr('id', 'name_congreso_' + id_congreso)
    template.find('#dates_congreso_').attr('id', 'dates_congreso_' + id_congreso)
    template.find('#hour_congreso_').attr('id', 'hour_congreso_' + id_congreso)
    template.find('#location_congreso_').attr('id', 'location_congreso_' + id_congreso)
    template.find('#btn_congreso_').attr('id', 'btn_congreso_' + id_congreso)

    return template
}

const getCongresos = async () => {

    await api_conection("GET", `${apiCongresos}/getMany`, {}, async function (data) {
        let congresos = data.data

        for (let item of congresos) {

            let dates_congreso = ''

            const fechaInicial = moment(item.date_initial);
            const fechaFinal = moment(item.date_finish);

            if (fechaInicial.isSame(fechaFinal, 'day')) {
                dates_congreso = `${moment(item.date_initial).format('dddd, MMMM Do YYYY')}`
            } else {
                dates_congreso = `${moment(item.date_initial).format('dddd, MMMM Do YYYY')} - ${moment(item.date_finish).format('dddd, MMMM Do YYYY')}`
            }

            let plantilla = await drawCongresos(item._id)
            plantilla.find('#link_img_' + item._id).attr("href", item.link_boletos)
            plantilla.find('#img_congreso_' + item._id).attr("src", item.image)
            plantilla.find('#name_congreso_' + item._id).text(item.name)
            plantilla.find('#dates_congreso_' + item._id).text(`${dates_congreso}`)
            plantilla.find('#hour_congreso_' + item._id).text(`${item.hour_initial}`)
            plantilla.find('#location_congreso_' + item._id).text(item.location)
            plantilla.find('#btn_congreso_' + item._id).attr("href", item.link_boletos)


            $("#congresos").append(plantilla)


        }

    })
}

const getMonths = async () => {

    await api_conection("GET", `${apiAgenda}/getManyActives`, {}, async function (data) {
        let months = data.data

        for (let item of months) {
            let div_month = await drawMonths(item._id)
            div_month.find('#name_month_' + item._id).text(item.mes)

            let events = item.events;

            events.sort((a, b) => new Date(a.date) - new Date(b.date));

            $("#months_agenda").append(div_month)

            if (events.length > 0) {
                for (let jtem of events) {
                    let div_event = await drawEvents(jtem._id);
                    div_event.find('#date_event_' + jtem._id).text(moment(jtem.date).format("dddd DD"));
                    div_event.find('#date_location_' + jtem._id).text(jtem.location)

                    div_month.find('#dates_' + item._id).append(div_event)
                }

            } else {
                div_month.find('#dates_' + item._id).append(`<h6 class="text-center my-2 text-danger fw-lighter">No hay fechas establecidas para este mes</h6>`)
            }
        }

    })
}

$(async function () {
    // Incluye Moment.js y el idioma español
    moment.locale('es');

// Obtén la fecha actual
    const fechaActual = moment();
    const añoActual = fechaActual.year();
    $("#year_actual").text(añoActual);

// Obtén el nombre del mes actual en español
    const mesActual = fechaActual.format('MMMM'); // Formatea el mes como palabra completa
    $("#month_actual").text(mesActual);


    //await getMonths()
    await getCongresos()



    $('#calendar').calendar({color: 'red' });


    let eventsByMonth = [
        {
            Uno: {
                locations: ['Monterrey']
            },
            Dos: {
                locations: ['Ixtapa', 'Estado de Mexico', 'Tulancingo']
            },
            Tres: {
                locations: ['Morelia', 'Monterrey']
            },
            Cuatro: {
                locations: ['Morelia']
            },
        },
    ];

    // Función para construir las tarjetas de eventos
    function renderEventCards(events) {
        // Selecciona el contenedor de eventos
        let $eventsContainer = $('#events');

        // Itera sobre cada mes en eventsByMonth
        events.forEach(function (monthEvents) {
            // Itera sobre cada semana en el mes
            Object.keys(monthEvents).forEach(function (key) {
                let value = monthEvents[key];

                // Construye la estructura de la tarjeta de evento
                let cardHtml = `
                    <div class="col-12 col-md-3 ">
                        <div class="card bg-black" style="background: #000000">
                            <div class="card-body">
                                <h5 class="card-title text-danger ">Semana<span class="text-white">${key}</span></h5>
                                <ul class="collection">
                `;

                // Itera sobre las ubicaciones de la semana y agrega cada una como un ítem de lista
                value.locations.forEach(function (location) {
                    cardHtml += `
                        <li class="collection-item text-danger">${location}</li>
                    `;
                });

                // Cierra la estructura de la tarjeta de evento
                cardHtml += `
                                </ul>
                            </div>
                        </div>
                    </div>
                `;

                // Agrega la tarjeta de evento al contenedor
                $eventsContainer.append(cardHtml);
            });
        });
    }

    // Llama a la función para construir las tarjetas de eventos
    renderEventCards(eventsByMonth);

})