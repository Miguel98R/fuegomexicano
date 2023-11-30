const apiUrl = "/api/users"
let columns = [

    {
        data: 'name',

    },
    {
        data: 'user_name',

    }, {
        data: 'email',

    },
    {
        data: 'active',
        render: function (data, type, row) {
            let status = ''
            if (type === 'display') {

                if(data){
                    status = `<p class="fw-bold text-success">Activo</p>`
                }else{
                    status = `<p class="fw-bold text-danger">Desactivado</p>`
                }

            }
            return status;
        }

    },
    {
        data: 'usersTypes',


    },
    {
        data: '_id',
        render: function (data, type, row) {
            if (type === 'display') {
                // Botones de editar y eliminar con atributo data-id
                return `<button class="edit-button btn btn-warning" data-id="${data}">Editar</button>
                    <button class="delete-button btn btn-danger" data-id="${data}">Eliminar</button>`;
            }
            return data;
        }
    }




]
let dt = $("#tblUsers").DataTable({
    responsive: true,
    language:language,
    data: [],
    lengthMenu: [
        [5, 10, 15, 25, 50, 100, 1000],
        ["5 rows", "10 rows", "15 rows", "25 rows", "50 rows", "100 rows", "1000 rows"],
    ],
    order: [
        [0, "asc"],
    ],
    pageLength: 10,
    columns: columns,
    paging: true,

    searching: true,
    fixedHeader: true,
    bAutoWidth: false,

    initComplete: function () {
        $(this.api().table().container())
            .find("input")
            .parent()
            .wrap("<form>")
            .parent()
            .attr("autocomplete", "off");
    },

});

const createNewUsers = (body) => {
    HoldOn.open(HoldOptions)
    api_conection("POST", `${apiUrl}/createUsers`, body, function () {
        HoldOn.close()
        drawDataTable(dt)
        $("#newUserModal").modal("hide")
    },function (response) {
        notyf.error(response.message)
        HoldOn.close()
    })
}

const deleteUser = (id_user) => {
    HoldOn.open(HoldOptions)
    api_conection("DELETE", `${apiUrl}/findIdAndDelete/${id_user}`, {}, function () {
        HoldOn.close()
        drawDataTable(dt)
    })
}


const drawDataTable = (data_table) => {
    HoldOn.open(HoldOptions)
    api_conection("POST", apiUrl + "/datatable_aggregate", {}, function (data) {
        HoldOn.close()
        let data_query = data.data;


        data_table.clear();
        data_table.rows.add(data_query).draw();
    });
}





$(async function () {



    $(".new_user").click(function () {
        $("#newUserModal").modal("show")
    })

    $("#saveUser").click(async function () {
        const fields = ["#name", "#user_name", "#email", "#password"];

        if (fields.some(field => !$(field).val())) {
            notyf.open({type: "warning", message: "Llena todos los campos para continuar"});
            return;
        }

        const userType = $("#type_users").val();

        const body = {
            name: $("#name").val(),
            user_name: $("#user_name").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            type: userType
        };

        await createNewUsers(body);
    });

    $(document.body).on("click", ".delete-button", function () {
        let id_user = $(this).attr("data-id");

        Swal.fire({
            title: "¿Estás seguro?",
            text: "Una vez eliminado, no podrás recuperar este usuario.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminarlo"
        })
            .then((result) => {
                if (result.isConfirmed) {
                    // Usuario confirmó la eliminación, ejecutar deleteUser
                    deleteUser(id_user);

                    // Mostrar mensaje de éxito después de eliminar
                    Swal.fire({
                        title: "Eliminado",
                        text: "El usuario ha sido eliminado.",
                        icon: "success"
                    });
                } else {
                    // Usuario canceló la eliminación, mostrar un mensaje de confirmación
                    Swal.fire({
                        title: "Eliminación cancelada",
                        text: "El usuario no ha sido eliminado.",
                        icon: "info"
                    });
                }
            });
    });




    drawDataTable(dt)

})