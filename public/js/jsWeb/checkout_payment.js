const apiSale = "/api/sales"

const drawProductsCheck = (id_product) => {
    let plantilla = $('#template_products_check_').clone()

    plantilla.attr('id', 'template_products_check_' + id_product).css('display', 'block');
    plantilla.find('#img_product_').attr('id', 'img_product_' + id_product)
    plantilla.find('#name_product_').attr('id', 'name_product_' + id_product)
    plantilla.find('#price_unit_').attr('id', 'price_unit_' + id_product)
    plantilla.find('#quantity_').attr('id', 'quantity_' + id_product).attr("id_product", id_product)
    plantilla.find('#total_product_').attr('id', 'total_product_' + id_product)
    plantilla.find('#delete-button_').attr('id', 'delete-button_' + id_product).attr("id_product", id_product)
    plantilla.find('#talla_').attr('id', 'talla_' + id_product).attr("id_product", id_product)

    return plantilla
}


let getDataSale = async (id) => {

    api_conection("GET", `${apiSale}/getOneById/${id}`, {}, async function (data) {

        let data_sale = data.sale

        for (let item of data_sale) {
            console.log("item--", item)
            let cant_products = item.cant_products
            let total_sale = item.total_sale

            $("#no_products").text(item.cant_products)
            $("#total").text("$" + item.total_sale)


            let details_sale = item.details_sale

            for (let details of details_sale) {
                for (let product of details.product) {
                    let element = await drawProductsCheck(product._id)

                    element.find('#img_product_' + product._id).attr('src', product.image)
                    element.find('#name_product_' + product._id).text(product.name)
                    element.find('#price_unit_' + product._id).text(product.price + " c/u")

                    element.find('#quantity_' + product._id).text(details.cant)
                    element.find('#total_product_' + product._id).text(details.total_detalle)
                    element.find('#talla_' + product._id).text(details.talla != '' ? `Talla ${details.talla}` : '')


                    $('#products_table').append(element)
                }

            }


        }

    })
}

let updatePayementTransfer = async (url_img, ID) => {

    let id = ID
    api_conection("PUT", `${apiSale}/updatePayementTransfer/${id}`, {url_img}, function () {
        $("#confirmacionReciboModal").modal("show")
        setTimeout(function () {
            location.href="/"
        },6000)

    })
}
$(async function () {

    console.log("ID", ID)

    await getDataSale(ID)

    $("#savePayment").click(async function () {

        let url_img = $("#img_payment_save").val()

        if(url_img == ''){
            notyf.error("Porfavor adjunte el comprobante de pago")
            return
        }

        await updatePayementTransfer(url_img, ID)
    })

    $('#img_payment').change(function () {
        const fileInput = $(this)[0];
        const formData = new FormData();


        formData.append('image', fileInput.files[0]);

        $.ajax({
            type: 'POST',
            url: '/api/upload/single_image',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                console.log(data);
                if (data.success) {


                    const imagePath = data.imagePath;


                    $('#img_payment_save').val(`/${imagePath}`);


                } else {
                    console.error('Error al subir la imagen:', data.message);
                }
            },
            error: function (error) {
                console.error(error);
            }
        });
    });
})