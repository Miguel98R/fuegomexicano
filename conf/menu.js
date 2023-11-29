let menu = [
    {href: '/conf_web', icon: 'bi-gear', label: 'Configuración Web', access: ['admin']},
    {href: '/conf_blog', icon: 'bi-book', label: 'Blog', access: ['admin']},
    {href: '/conf_invitations', icon: 'bi-envelope', label: 'Invitaciones', access: ['admin']},
    {href: '/conf_agenda', icon: 'bi-calendar', label: 'Agenda', access: ['admin']},
    {href: '/conf_products', icon: 'bi-shop', label: 'Productos', access: ['admin']},
    {href: '/presales', icon: 'bi-bag', label: 'Preventas', access: ['admin']},
    {href: '/orders', icon: 'bi-bag-check', label: 'Órdenes', access: ['admin']},
    {href: '/historic', icon: 'bi-bag-check', label: 'Historico ventas', access: ['admin']},
    {href: './conf_users', icon: 'bi-people-fill', label: 'Usuarios', access: ['admin']}
]

module.exports = menu