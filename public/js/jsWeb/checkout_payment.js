const apiSale = "/api/sales"
let getDataSale = async (id) => {

    api_conection("GET", `${apiSale}/getOneById/${id}`, {}, function (data) {
        console.log("data", data.sale)
    })
}
$(async function () {

    console.log("ID",ID)

    await getDataSale(ID)
})