const apiUsers = "/api/users"
const apiSuscriptions = "/api/suscriptions"

const drawUserData = (storedUser) => {
    // Asignar los valores a los campos del formulario
    $("#email").val(storedUser.email || '');
    $("#name").val(storedUser.name || '');
    $("#lastName").val(storedUser.lastName || '');
    $("#gender").val(storedUser.gender || '');
    $("#phone").val(storedUser.phone || '');
    $("#address").val(storedUser.address || '');
    $("#noInt").val(storedUser.noInt || '');
    $("#noExt").val(storedUser.noExt || '');
    $("#neighborhood").val(storedUser.neighborhood || '');
    $("#city").val(storedUser.city || '');
    $("#state").val(storedUser.state || '');
    $("#zip").val(storedUser.zip || '');
}

const createStorageUser = async () => {

    let email = $("#email").val();
    let name = $("#name").val();
    let lastName = $("#lastName").val();
    let gender = $("#gender").val();
    let cellphone = $("#phone").val();
    let address = $("#address").val();
    let noInt = $("#noInt").val();
    let noExt = $("#noExt").val();
    let neighborhood = $("#neighborhood").val();
    let city = $("#city").val();
    let state = $("#state").val();
    let zip = $("#zip").val();

    // Verifica si todos los campos tienen valores
    if (!email || !name || !lastName || !gender || !cellphone || !address || !neighborhood || !city || !state || !zip) {
        notyf.open({type: "warning", message: "Llena todos los campos para continuar"});
        return
    }

    // Crea un objeto con la información del usuario
    let user = {
        email,
        name,
        lastName,
        gender,
        cellphone,
        address,
        noInt,
        noExt,
        neighborhood,
        city,
        state,
        zip
    };

    localStorage.setItem('user', JSON.stringify(user));

}

const getStorageUser = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        return user;
    } catch (error) {
        console.error('Error al obtener desde localStorage:', error);
        return {};
    }
};

const getUserDataEmail = async (email) => {
    await api_conection("POST", `${apiUsers}/getUserDataEmail/${email}`, {}, (data) => {
        let dataUser = data.user

        $("#email").val(dataUser.email);
        $("#name").val(dataUser.name);
        $("#lastName").val(dataUser.lastName);
        $("#gender").val(dataUser.gender);
        $("#phone").val(dataUser.cellphone);
        $("#address").val(dataUser.address);
        $("#noInt").val(dataUser.noInt);
        $("#noExt").val(dataUser.noExt);
        $("#neighborhood").val(dataUser.neighborhood);
        $("#city").val(dataUser.city);
        $("#state").val(dataUser.state);
        $("#zip").val(dataUser.zip);
    })
};

async function handleSubscription(planType) {
    // Validar los campos del formulario
    const email = $("#email").val();
    const name = $("#name").val();
    const lastName = $("#lastName").val();
    const gender = $("#gender").val();
    const cellphone = $("#phone").val();
    const address = $("#address").val();
    const neighborhood = $("#neighborhood").val();
    const city = $("#city").val();
    const state = $("#state").val();
    const zip = $("#zip").val();

    if (!email || !name || !lastName || !gender || !cellphone || !address || !neighborhood || !city || !state || !zip) {
        notyf.open({type: "warning", message: "Llena todos los campos para continuar"});
        return;
    }

    // Actualizar el localStorage con los datos del usuario
    let user = {
        email,
        name,
        lastName,
        gender,
        cellphone,
        address,
        neighborhood,
        city,
        state,
        zip
    };
    localStorage.setItem('user', JSON.stringify(user));

    // Enviar los datos al endpoint
    try {
        const response = await fetch(`${apiSuscriptions}/createSuscription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_data: user,
                plan: planType
            })
        });

        const data = await response.json();

        if (data.success) {
            // Redirigir a la página de suscripción según el tipo de plan
            let redirectUrl;
            switch (planType) {
                case 'basic':
                    redirectUrl = 'https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=2c93808490c3cf9e0190d6754d03049a';
                    break;
                case 'pro':
                    redirectUrl = 'https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=2c93808490c3cf9e0190d6745f7e0499';
                    break;
                case 'premium':
                    redirectUrl = 'https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=2c93808490c3cfb60190d672a70404c9';
                    break;
                default:
                    redirectUrl = '/';
                    break;
            }
            window.location.href = redirectUrl;
        } else {
            notyf.open({type: "error", message: "Error al procesar la suscripción. Inténtalo de nuevo más tarde."});
        }
    } catch (error) {
        console.error('Error al enviar los datos de suscripción:', error);
        notyf.open({type: "error", message: "Error al procesar la suscripción. Inténtalo de nuevo más tarde."});
    }
}


$(async function () {

    const storedUser = await getStorageUser();
    await drawUserData(storedUser)

    $("#email").change(async function () {
        let val = $(this).val()
        await getUserDataEmail(val)
    })

    if (type === 'basic') {
        $('#planIntermedio').hide();
        $('#planAvanzado').hide();
        $('#subscriptionTitle').text('Suscribirse al Plan Básico');
    } else if (type === 'pro') {
        $('#planBasico').hide();
        $('#planAvanzado').hide();
        $('#subscriptionTitle').text('Suscribirse al Plan Pro');
    } else if (type === 'premium') {
        $('#planBasico').hide();
        $('#planIntermedio').hide();
        $('#subscriptionTitle').text('Suscribirse al Plan Premium');
    } else {
        $('#subscriptionTitle').text('Elige entre los siguientes planes');
    }

    // Manejar el clic en los botones de suscripción
    $('#saveDonacionBasic').click(async function () {
        await handleSubscription('basic');
    });

    $('#saveDonacionPro').click(async function () {
        await handleSubscription('pro');
    });

    $('#saveDonacionPremium').click(async function () {
        await handleSubscription('premium');
    });


})