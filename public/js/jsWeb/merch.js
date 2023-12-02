let apiProducts = "/api/products"

const drawProducts = (id_product) => {
    let plantilla = $('#template_products_').clone()

    plantilla.attr('id', 'template_products_' + id_product).css('display', 'block');
    plantilla.find('#image_product_').attr('id', 'image_product_' + id_product)
    plantilla.find('#stock_aviable_').attr('id', 'stock_aviable_' + id_product)
    plantilla.find('#name_product_').attr('id', 'name_product_' + id_product)
    plantilla.find('#description_product_').attr('id', 'description_product_' + id_product)
    plantilla.find('#price_product_').attr('id', 'price_product_' + id_product)
    plantilla.find('#shop_now_').attr('id', 'shop_now_' + id_product).attr("id_product",id_product)
    plantilla.find('#add_cart_').attr('id', 'add_cart_' + id_product).attr("id_product",id_product)
    plantilla.find('#add_product_').attr('id', 'add_product_' + id_product).attr("id_product",id_product)
    plantilla.find('#quantity_input_').attr('id', 'quantity_input_' + id_product).attr("id_product",id_product)
    plantilla.find('#remove_product_').attr('id', 'remove_product_' + id_product).attr("id_product",id_product)


    return plantilla
}
const getProducts = async () => {
    await api_conection("GET", apiProducts + "/getMany", {}, async function (data) {
        let data_product = data.data
        for (let item of data_product) {
            let stock = ""
            let color = ""
            if(item.stock>0){
                stock=`Stock disponible`
                color="text-success"
            }else {
                stock=`Agotado`
                color="text-danger"
            }

            let element = drawProducts(item._id)
            element.find('#image_product_' + item._id).attr('src', item.image)
            element.find('#stock_aviable_' + item._id).text(stock).addClass(color)
            element.find('#name_product_' + item._id).text(item.name)
            element.find('#description_product_' + item._id).text(item.description)
            element.find('#price_product_' + item._id).text("$"+item.price)

            $('#grid_products').append(element)
        }
    })
}

const createCartStorage = async ()=>{
    var productName = $("#name_product_").text();
    var productPrice = $("#price_product_").text();
    var quantity = $("#quantity_input_").val();


    var product = {
        name: productName,
        price: productPrice,
        quantity: quantity

    };


    var cart = JSON.parse(localStorage.getItem("cart")) || [];


    cart.push(product);


    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Producto agregado al carrito");

    // También puedes redirigir al usuario a la página del carrito u otra acción
    // window.location.href = "/cart";
});

}
$(async function () {
    await getProducts()

    $(".add_cart").click(function () {
    }
})