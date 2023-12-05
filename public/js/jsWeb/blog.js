let apiBlogs = "/api/blogs"

let drawBlogs = async (id_blog) => {
    let plantilla = $('#template_blog_').clone()

    plantilla.attr('id', 'template_blog_' + id_blog).css('display', 'block');
    plantilla.find('#img_blog_').attr('id', 'img_blog_' + id_blog)
    plantilla.find('#title_blog_').attr('id', 'title_blog_' + id_blog)
    plantilla.find('#subtitle_blog_').attr('id', 'subtitle_blog_' + id_blog)
    plantilla.find('#date_blog_').attr('id', 'date_blog_' + id_blog)
    plantilla.find('#read_blog_').attr('id', 'read_blog_' + id_blog)

    return plantilla
}

const getBlogs = async () => {
    await api_conection("GET", apiBlogs + "/getMany", {}, async function (data) {
        let data_blog = data.data
        for (let item of data_blog) {

            console.log(item)


            let element = await drawBlogs(item._id)
            element.find('#img_blog_' + item._id).attr('src', item.image)
            element.find('#title_blog_' + item._id).text(item.title)
            element.find('#subtitle_blog_' + item._id).text(item.subtitle)
            element.find('#date_blog_' + item._id).text((moment(item.publicationDate).format('DD-MM-YYYY')));
            element.find('#read_blog_' + item._id).attr("id_blog", item._id).attr("title", item.title).attr("subtitle", item.subtitle).attr("content", item.content).attr("date", moment(item.publicationDate).format('DD-MM-YYYY'))

            $('#blogs').append(element)


        }
    })
}


$(async function () {
    await getBlogs()

    $(".read_blogs").click(async function () {
        let title = $(this).attr("title")
        let subtitle = $(this).attr("subtitle")
        let content = $(this).attr("content")
        let date = $(this).attr("date")

        $("#blogContentModal").modal("show")
        $('#title_blog').text(title)
        $('#subtitle_blog').text(subtitle)
        $('#content_blog').html(content)
        $('#date_blog').text(date)
    })

})