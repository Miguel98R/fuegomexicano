const apiSales = "/api/sales"
const drawProductsCheck = (id_product) => {
    let plantilla = $('#template_products_check_').clone()

    plantilla.attr('id', 'template_products_check_' + id_product).css('display', 'block');
    plantilla.find('#img_product_').attr('id', 'img_product_' + id_product)
    plantilla.find('#name_product_').attr('id', 'name_product_' + id_product)
    plantilla.find('#price_unit_').attr('id', 'price_unit_' + id_product)
    plantilla.find('#quantity_').attr('id', 'quantity_' + id_product).attr("id_product", id_product)
    plantilla.find('#total_product_').attr('id', 'total_product_' + id_product)
    plantilla.find('#delete-button_').attr('id', 'delete-button_' + id_product).attr("id_product", id_product)

    return plantilla
}

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


const getStorageCart = () => {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart;
    } catch (error) {
        console.error('Error al obtener el carrito desde localStorage:', error);
        return {};
    }
};

const delete_item = async (id_product) => {

    let cart = JSON.parse(localStorage.getItem('cart')) || [];


    let filteredProducts = cart.filter(function (cart) {
        return cart.id_product !== id_product;
    });


    localStorage.setItem('cart', JSON.stringify(filteredProducts));

    const cart2 = await getStorageCart();
    no_product = cart2.length
    if (no_product <= 0) {
        location.href = "/products"
    }

    await drawTableProducts(cart2)
    await updateStorageAndTotal()
}


const drawTableProducts = async (cart) => {

    let total_a_pagar = 0
    let no_product = cart.length
    $('#products_table').html('')

    for (let item of cart) {
        let element = drawProductsCheck(item.id_product)
        element.find('#img_product_' + item.id_product).attr('src', item.image)
        element.find('#name_product_' + item.id_product).text(item.name)
        element.find('#price_unit_' + item.id_product).text(item.price + " c/u")
        element.find('#quantity_' + item.id_product).val(item.quantity).attr("min", 1)

        let total_product = Number(item.price) * Number(item.quantity)

        element.find('#total_product_' + item.id_product).text(total_product)

        $('#products_table').append(element)


        total_a_pagar = total_a_pagar + Number(total_product)
    }

    $('#total').text(total_a_pagar);
    $('#no_products').text(no_product);


}


const updateStorageAndTotal = async (id_product, newQuantity) => {

    const cart = await getStorageCart();


    let total_a_pagar = 0
    let no_product = 0
    const cartItem = cart.find(item => item.id_product === id_product);

    if (cartItem) {

        cartItem.quantity = newQuantity;

        localStorage.setItem('cart', JSON.stringify(cart));

        const total_product = Number(cartItem.price) * Number(newQuantity);

        $('#total_product_' + id_product).text(total_product);
    }


    const cart2 = await getStorageCart();

    for (let item of cart2) {
        const total_product = Number(item.price) * Number(item.quantity);
        total_a_pagar = total_a_pagar + Number(total_product)
    }

    no_product = cart2.length
    $('#total').text(total_a_pagar);
    $('#no_products').text(no_product);
};

const createStorageUser = async () => {

    let email = $("#email").val();
    let name = $("#name").val();
    let lastName = $("#lastName").val();
    let gender = $("#gender").val();
    let phone = $("#phone").val();
    let address = $("#address").val();
    let noInt = $("#noInt").val();
    let noExt = $("#noExt").val();
    let neighborhood = $("#neighborhood").val();
    let city = $("#city").val();
    let state = $("#state").val();
    let zip = $("#zip").val();

    // Verifica si todos los campos tienen valores
    if (!email || !name || !lastName || !gender || !phone || !address || !neighborhood || !city || !state || !zip) {
        notyf.open({type: "warning", message: "Llena todos los campos para continuar"});
        return;
    }

    // Crea un objeto con la información del usuario
    let user = {
        email: email,
        name: name,
        lastName: lastName,
        gender: gender,
        phone: phone,
        address: address,
        noInt: noInt,
        noExt: noExt,
        neighborhood: neighborhood,
        city: city,
        state: state,
        zip: zip
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

const createConfgSale = async () => {
    let no_products = Number($("#no_products").text())
    let total_Sale = Number($("#total").text())
    let type_payout = $("input[name='listGroupRadio']:checked").val();

    let conf = {
        no_products,
        total_Sale,
        type_payout,
    };

    localStorage.setItem('sale_conf', JSON.stringify(conf));

}

const getStorageConf = () => {
    try {
        const conf = JSON.parse(localStorage.getItem('sale_conf')) || {};
        return conf;
    } catch (error) {
        console.error('Error al obtener desde localStorage:', error);
        return {};
    }
};

const createNewSaleTransfer = async (body) => {

    api_conection('POST', `${apiSales}/createSaleTransfer`, body, async function (data) {

        let uri = data.data
        console.log("data_sale----------------", uri)

        if (body.statusSale == 'PRV_sale') {
            $("#payout_modal").modal("hide")
            $("#pagarDespuesCOnfiModal").modal("show")
            $("#enlace_").val(uri)
            $("#enlace_a_").attr("href", uri)
            localStorage.clear();

        }
    })
}

$(async function () {
    const cartData = await getStorageCart();
    if (cartData.length == 0) {
        location.href = "/products"
    }

    const storedUser = await getStorageUser();

    await drawTableProducts(cartData)
    await drawUserData(storedUser)


    $('.quantity_change').change(async function () {
        let id_product = $(this).attr("id_product")
        let newQuantity = $(this).val()
        await updateStorageAndTotal(id_product, newQuantity);
    })

    $('.delete_item').click(async function () {

        let id_product = $(this).attr('id_product');

        Swal.fire({
            title: "¿Seguro que desea eliminar este artículo de su carrito?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await delete_item(id_product);
            }
        });


    });

    $("#savePayment").click(async function () {
        $("#description_payout").html('')

        await createStorageUser();
        await createConfgSale();
        let storedUser = getStorageUser();
        let storedConfSale = getStorageConf();
        let text = ''

        if (storedConfSale.type_payout == "mercadoPago") {
            text = `<p>Ha optado por realizar su pago a través de <b>Mercado Pago</b>. Será redirigido a la página oficial para completar la transacción. Si surge alguna pregunta o inquietud, no dude en ponerse en contacto con nuestro equipo de soporte.</p>`
            $("#datos_transfer").hide()
            $("#pagar_despues").hide()
            $("#continue_payout").text('Continuar con el pago')
        } else {
            text = `<p>Ha elegido efectuar el pago mediante <b>transferencia</b>. Puede adjuntar su comprobante de pago, y nuestro equipo se encargará de verificar la transacción. También tiene la opción de realizar el pago más adelante. Le recordamos que dispone de un plazo de 3 días para completar la transacción. Si necesita los datos para la transferencia bancaria, a continuación se muestran:</p>`
            $("#datos_transfer").show()
            $("#pagar_despues").show()
            $("#continue_payout").text('Adjuntar pago')
        }


        $("#description_payout").append(text)

        $("#payout_modal").modal("show")


    });

    $("#pagar_despues").click(async function () {

        let body = {
            storedUser: getStorageUser(),
            storedConfSale: getStorageConf(),
            storedCart: getStorageCart(),
            statusSale: 'PRV_sale',
            img_payment: ''

        }
        await createNewSaleTransfer(body)


    })

})