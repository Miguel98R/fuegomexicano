moment.locale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
});

;(function ($) {
    $.fn.datepicker.dates['es'] = {
        days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        today: "Hoy",
        monthsTitle: "Meses",
        clear: "Borrar",
        weekStart: 0,
        format: "yyyy-mm-dd"
    };
}(jQuery));

const toolbarOptionsQuill = [
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'font': []}],
    [{'size': ['small', false, 'large', 'huge']}],
    ['bold', 'italic', 'underline', 'strike'],
    [{'color': []}, {'background': []}],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'align': []}],
    ['link', 'image', 'video'],
    ['clean']
];

HoldOptions = {
    theme: "custom",
    content: '<span class="loader"></span><p style="color: white; font-weight: bold;">Cargando...</p>',
};

const notyf = new Notyf({
    duration: 1000,
    position: {
        x: 'right',
        y: 'top',
    },
    types: [
        {
            type: 'warning',
            background: 'orange',
            icon: '<i class="fas fa-exclamation"></i>',
            duration: 2000,
            dismissible: true
        },
        {
            type: 'error',
            background: 'indianred',
            duration: 2000,
            dismissible: true
        },
        {
            type: 'success',
            background: 'green',
            duration: 2000,
            dismissible: true
        }
    ]
});

$('#close_session').click(function () {
    location.href = '/api/users/logout/admin'
})


const api_conection = async function (method, url, data, f_, error_) {

    let tokenActual


    tokenActual = 'ajfdajflkajpoiwe24r32nefcd'

    try {
        let response
        if (method == "GET") {
            response = await fetch(url,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer ' + tokenActual || false

                    },
                    method: method,
                })
        } else {
            response = await fetch(url,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer ' + tokenActual || false

                    },
                    method: method,
                    body: data ? JSON.stringify(data) : ""
                })
        }

        response = await response.json();


        if (response.success == true) {
            if (f_) {
                f_(response);
            }
        } else {
            if (error_) {
                error_(response)
            }
        }
    } catch (e) {
        console.error(e);
        notyf.error('Ocurrio un error verifique sus datos e intentelo nuevamente', e)
        return 0
    }
}


function formatState(opt) {
    if (!opt.id) {
        return opt.text.toUpperCase();
    }

    var optimage = $(opt.element).attr('data-image');

    if (!optimage) {
        return opt.text;
    } else {
        var $opt = $(
            '<span ><img src="' + optimage + '" width="30px" /> ' + opt.text + '</span>'
        );
        return $opt;
    }
};

const downloadFile = function (text, filename, ext) {
    if (!ext) {
        filename = filename + '.csv';
    } else {
        filename = filename + ext;
    }
    var universalBOM = "\uFEFF";
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text + universalBOM));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

var copy_clipboard = function (elementID) {
    var copyText = document.getElementById(elementID);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");

}

let countSales = () => {
    const statusToElementMap = {
        'Cotizacion': '#in_Cotizaciones',
        'Cotizacion_canceled': '#inin_Cotizaciones_canceladas',
        'PRV_preOrder': '#in_Pre_orden_Preventas',
        'PRV_sale': '#in_Preventas',
        'PRV_toLiberate': '#in_Preventas_por_liberar',
        'PRV_canceled': '#in_Preventas_canceladas',
        'OR_preOrder': '#in_Pre_Ordenes',
        'OR_sale': '#in_Ordenes',
        'OR_DHL': '#in_Seguimiento_DHL',
        'OR_uber': '#in_Seguimiento_Uber',
        'OR_toDeliver': '#in_Ordenes_por_enviar',
        'OR_historic': '#in_Historico',
        'OR_canceled': '#in_Ordenes_canceladas'
    };


    api_conection('GET', '/api/sales/countSalesStatus', {}, (data) => {
        const cont_array = data.data;


        cont_array.forEach((item) => {
            const status = item.status;
            const elementSelector = statusToElementMap[status];

            if (elementSelector) {
                $(elementSelector).text(item.count);
            }
        });

        let count_general = 0
        cont_array.forEach((item) => {

            if (item.status === 'PRV_sale' || item.status === 'PRV_toLiberate' || item.status === 'OR_sale' || item.status === 'OR_DHL' || item.status === 'OR_uber' || item.status === 'OR_toDeliver') {
                count_general = count_general + (item.count)
            }
        });

        $('#in_General').text(count_general);
    });


};

countSales();





