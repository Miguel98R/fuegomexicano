let apiProducts = "/api/products"

const drawProducts = (id_product) => {
    let plantilla = $('#template_products_').clone()

    plantilla.attr('id', 'template_products_' + id_product).css('display', 'block');
    plantilla.find('#image_product_').attr('id', 'image_product_' + id_product)
    plantilla.find('#stock_aviable_').attr('id', 'stock_aviable_' + id_product)
    plantilla.find('#name_product_').attr('id', 'name_product_' + id_product)
    plantilla.find('#description_product_').attr('id', 'description_product_' + id_product)
    plantilla.find('#price_product_').attr('id', 'price_product_' + id_product)
    plantilla.find('#shop_now_').attr('id', 'shop_now_' + id_product).attr("id_product", id_product)
    plantilla.find('#add_cart_').attr('id', 'add_cart_' + id_product).attr("id_product", id_product)
    plantilla.find('#add_product_').attr('id', 'add_product_' + id_product).attr("id_product", id_product)
    plantilla.find('#quantity_input_').attr('id', 'quantity_input_' + id_product).attr("id_product", id_product)
    plantilla.find('#remove_product_').attr('id', 'remove_product_' + id_product).attr("id_product", id_product)
    plantilla.find('#select_talla_').attr('id', 'select_talla_' + id_product).attr("id_product", id_product)
    plantilla.find('#talla_CH_').attr('id', 'talla_CH_' + id_product).attr("name", 'talla_' + id_product).attr("id_product", id_product).addClass('changeTalla')
    plantilla.find('#talla_M_').attr('id', 'talla_M_' + id_product).attr("name", 'talla_' + id_product).attr("id_product", id_product).addClass('changeTalla')
    plantilla.find('#talla_G_').attr('id', 'talla_G_' + id_product).attr("name", 'talla_' + id_product).attr("id_product", id_product).addClass('changeTalla')

    plantilla.find('label[for="talla_CH_"]').attr('for', 'talla_CH_' + id_product);
    plantilla.find('label[for="talla_M_"]').attr('for', 'talla_M_' + id_product);
    plantilla.find('label[for="talla_G_"]').attr('for', 'talla_G_' + id_product);

    return plantilla
}
const getProducts = async () => {
    await api_conection("GET", apiProducts + "/getMany", {}, async function (data) {
        let data_product = data.data

        if (data_product.length === 0) {

            var mensajeMercanciaProxima = "<h4 class='py-4 display-5 text-center fw-lighter text-white'>Próximamente conocerás nuestra mercancía oficial. ¡Estamos trabajando en ello!</h4>";

            $('#grid_products').append(mensajeMercanciaProxima);
            return;
        }


        for (let item of data_product) {
            let stock = item.stock > 0 ? "En stock" : "Agotado";
            let color = item.stock > 0 ? "text-success" : "text-danger";

            let element = drawProducts(item._id);

            if(item.name.includes("Playera")){
                element.find('#select_talla_' + item._id).show();
            }else{
                element.find('#select_talla_' + item._id).hide();
            }

            element.find('#image_product_' + item._id).attr('src', item.image);
            element.find('#stock_aviable_' + item._id).text(stock).addClass(color);
            element.find('#name_product_' + item._id).text(item.name);
            element.find('#description_product_' + item._id).text(item.description);
            element.find('#price_product_' + item._id).text("$ " + item.price + " MXN").attr("price", item.price);
            element.find('#quantity_input_' + item._id).attr("min", 1).attr("max", item.stock);

            let isStockAvailable = item.stock > 0;
            element.find("#add_cart_" + item._id).toggleClass("disabled", !isStockAvailable);
            element.find("#shop_now_" + item._id).toggleClass("disabled", !isStockAvailable);

            $('#grid_products').append(element);
        }

    })
}

const updateCartStorage = async (id) => {
   let selectedTalla = $('input[name="talla_' + id + '"]:checked').val();
   let cart = JSON.parse(localStorage.getItem("cart")) || [];


    let existingProduct = cart.find(item => item.id_product === id);

    if (existingProduct) {
        existingProduct.selectedTalla = selectedTalla;
    } else {

        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateNumProducts();

}
const createCartStorage = async (id) => {
    let productName = $("#name_product_" + id).text();
    let productPrice = Number($("#price_product_" + id).attr('price'))
    let quantity = Number($("#quantity_input_" + id).val())
    let image = $("#image_product_" + id).attr('src');
    let selectedTalla = ''

    if(productName.includes('Playera')){
        selectedTalla = $('input[name="talla_' + id + '"]:checked').val();
        if(selectedTalla == undefined){
            notyf.open({type: "warning", message: "Selecciona una talla"});

            return
        }
    }

    var product = {
        id_product: id,
        name: productName,
        price: productPrice,
        quantity,
        image,
        selectedTalla
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    let existingProduct = cart.find(item => item.id_product === id);

    if (existingProduct) {

        existingProduct.quantity = quantity;
        existingProduct.selectedTalla = selectedTalla;
    } else {

        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    notyf.success("Producto agregado");

    updateNumProducts();
};


const createCartShopNow = async (id) => {
    let productName = $("#name_product_" + id).text();
    let productPrice = Number($("#price_product_" + id).attr('price'))
    let quantity = Number($("#quantity_input_" + id).val())
    let image = $("#image_product_" + id).attr('src');
    let selectedTalla = ''

    if(productName.includes('Playera')){
        selectedTalla = $('input[name="talla_' + id + '"]:checked').val();
        if(selectedTalla == undefined){
            notyf.open({
                type: 'warning',
                message: 'Selecciona una talla'
            });
            return
        }
    }

    var product = {
        id_product: id,
        name: productName,
        price: productPrice,
        quantity,
        image,
        selectedTalla
    };

    let cart = [product];

    // Sobrescribe el carrito actual en el localStorage con el nuevo producto
    localStorage.setItem("cart", JSON.stringify(cart));
    updateNumProducts();
    location.href="/checkout"
};



const increaseQuantity = async (id_product) => {
    let quantityInput = $("#quantity_input_" + id_product);
    let maxValue = parseInt(quantityInput.attr("max"));
    let currentQuantity = parseInt(quantityInput.val());

    if (currentQuantity < maxValue) {
        quantityInput.val(currentQuantity + 1);
    }
};


const decreaseQuantity = async (id_product) => {
    let quantityInput = $("#quantity_input_" + id_product);

    let currentQuantity = parseInt(quantityInput.val());

    if (currentQuantity > 1) {
        quantityInput.val(currentQuantity - 1);
    }
}



$(async function () {
    await getProducts()

    $(".add_cart").click(async function () {
        let id_product = $(this).attr("id_product")
        await createCartStorage(id_product)
    })

    $(".changeTalla").click(async function () {
        let id_product = $(this).attr("id_product")
        await updateCartStorage(id_product)
    })

    $(".shop_now").click(async function () {
        let id_product = $(this).attr("id_product")
        await createCartShopNow(id_product)
    })


    $(".add_product").click(async function () {
        let id_product = $(this).attr("id_product")
        await increaseQuantity(id_product);
    });

    $(".remove_product").click(async function () {
        let id_product = $(this).attr("id_product")
        await decreaseQuantity(id_product);
    });

})