const apiAgenda = "/api/agendas"

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
    const fechaActual = moment();
    const añoActual = fechaActual.year();
    $("#year_actual").text(añoActual);

    await getMonths()
})