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


    return plantilla
}
const getProducts = async () => {
    await api_conection("GET", apiProducts + "/getMany", {}, async function (data) {
        let data_product = data.data
        for (let item of data_product) {
            let stock = ""
            let color = ""
            if (item.stock > 0) {
                stock = `Stock disponible`
                color = "text-success"
            } else {
                stock = `Agotado`
                color = "text-danger"
            }

            let element = drawProducts(item._id)
            element.find('#image_product_' + item._id).attr('src', item.image)
            element.find('#stock_aviable_' + item._id).text(stock).addClass(color)
            element.find('#name_product_' + item._id).text(item.name)
            element.find('#description_product_' + item._id).text(item.description)
            element.find('#price_product_' + item._id).text("$" + item.price).attr("price",item.price)
            element.find('#quantity_input_' + item._id).attr("min",1).attr("max",item.stock)

            $('#grid_products').append(element)
        }
    })
}

const createCartStorage = async (id) => {
    let productName = $("#name_product_" + id).text();
    let productPrice = Number($("#price_product_" + id).attr('price'))
    let quantity = Number($("#quantity_input_" + id).val())
    let image = $("#image_product_" + id).attr('src');

    var product = {
        id_product: id,
        name: productName,
        price: productPrice,
        quantity,
        image,
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    let existingProduct = cart.find(item => item.id_product === id);

    if (existingProduct) {

        existingProduct.quantity = quantity;
    } else {

        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    notyf.success("Producto agregado al carrito");

    updateNumProducts();
};


const createCartShopNow = async (id) => {
    let productName = $("#name_product_" + id).text();
    let productPrice = Number($("#price_product_" + id).attr('price'))
    let quantity = Number($("#quantity_input_" + id).val())
    let image = $("#image_product_" + id).attr('src');

    var product = {
        id_product: id,
        name: productName,
        price: productPrice,
        quantity,
        image,
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