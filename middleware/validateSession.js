let menu = [
    {href: '/conf_web', icon: 'bi-gear', label: 'Configuración Web', access: ['admin']},
    {href: '/conf_blog', icon: 'bi-book', label: 'Blog', access: ['admin', 'editor']},
    {href: '/conf_invitations', icon: 'bi-envelope', label: 'Invitaciones', access: ['admin']},
    {href: '/conf_products', icon: 'bi-shop', label: 'Productos', access: ['admin', 'seller']},
    {href: '/presales', icon: 'bi-bag', label: 'Preventas', access: ['admin', 'seller']},
    {href: '/orders', icon: 'bi-bag-check', label: 'Órdenes', access: ['admin', 'manager']},
    {href: './users', icon: 'bi-people-fill', label: 'Usuarios', access: ['admin']}
]
let validateSession = function (req, res, next) {

    if (req.session.user) {

        let dataUser = req.session.user

        const level = dataUser.usersTypes

        let meenu

        if (level == 'user') {
            res.redirect('/');

        }
        if (level == 'admin') {

            meenu = menu.filter(menuItem => menuItem.access.includes('admin'));
            req.session.menu = meenu
            next();
        }

    } else {
        res.redirect('/fgPanel');
    }
}

module.exports = validateSession