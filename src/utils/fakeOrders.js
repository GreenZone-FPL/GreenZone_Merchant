const orders = [
    {
        orderId: '22124-3772987543535',
        totalAmount: 150000,
        status: 'Confirmed', // Đã xác nhận
        orderType: 'Online', // Đơn hàng online
        createdAt: '10:16, 22/12/2024',
        estimatedTime: '10:30',
        items: [
            { id: '1', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000 },
            { id: '2', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '3', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '4', name: 'Kem Cheese', quantity: 2, price: 20000 },
        ],
    },

    {
        orderId: '22124-3772987543537',
        totalAmount: 200000,
        status: 'Confirmed', // Đã xác nhận
        orderType: 'Offline', // Đơn hàng tại cửa hàng
        createdAt: '10:16, 22/12/2024',
        estimatedTime: null,
        items: [
            { id: '1', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000 },
            { id: '2', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '3', name: 'Trà Sữa Truyền Thống', quantity: 3, price: 50000 },
        ],
    },

    {
        orderId: '22124-3772987543538',
        totalAmount: 80000,
        status: 'Unconfirmed', // Chưa xác nhận
        orderType: 'Online', // Đơn hàng online
        createdAt: '10:16, 22/12/2024',
        estimatedTime: null,
        items: [{ id: '4', name: 'Trà Đào Cam Sả', quantity: 1, price: 80000 }],
    },

    {
        orderId: '22124-3772987543539',
        totalAmount: 150000,
        status: 'UnConfirmed', // Đã xác nhận
        orderType: 'Offline', // Đơn hàng tại cửa hàng
        createdAt: '10:16, 22/12/2024',
        estimatedTime: '10:30',
        items: [
            { id: '1', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000 },
            { id: '2', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '3', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '4', name: 'Kem Cheese', quantity: 2, price: 20000 },
        ],
    },
    {
        orderId: '22124-3772987543529',
        totalAmount: 150000,
        status: 'Confirmed', // Đã xác nhận
        orderType: 'Online', // Đơn hàng online
        createdAt: '10:16, 22/12/2024',
        estimatedTime: '10:30',
        items: [
            { id: '1', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000 },
            { id: '2', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '3', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '4', name: 'Kem Cheese', quantity: 2, price: 20000 },
        ],
    },

    {
        orderId: '22124-3772987543530',
        totalAmount: 200000,
        status: 'Confirmed', // Đã xác nhận
        orderType: 'Offline', // Đơn hàng tại cửa hàng
        createdAt: '10:16, 22/12/2024',
        estimatedTime: null,
        items: [
            { id: '1', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000 },
            { id: '2', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '3', name: 'Trà Sữa Truyền Thống', quantity: 3, price: 50000 },
        ],
    },

    {
        orderId: '22124-3772987543545',
        totalAmount: 80000,
        status: 'Unconfirmed', // Chưa xác nhận
        orderType: 'Online', // Đơn hàng online
        createdAt: '10:16, 22/12/2024',
        estimatedTime: null,
        items: [{ id: '4', name: 'Trà Đào Cam Sả', quantity: 1, price: 80000 }],
    },

    {
        orderId: '22124-3772987543538',
        totalAmount: 150000,
        status: 'UnConfirmed', // Đã xác nhận
        orderType: 'Offline', // Đơn hàng tại cửa hàng
        createdAt: '10:16, 22/12/2024',
        estimatedTime: '10:30',
        items: [
            { id: '1', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000 },
            { id: '2', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '3', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '4', name: 'Kem Cheese', quantity: 2, price: 20000 },
        ],
    },
    {
        orderId: '22124-3772987543523',
        totalAmount: 150000,
        status: 'Confirmed', // Đã xác nhận
        orderType: 'Online', // Đơn hàng online
        createdAt: '10:16, 22/12/2024',
        estimatedTime: '10:30',
        items: [
            { id: '1', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000 },
            { id: '2', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '3', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '4', name: 'Kem Cheese', quantity: 2, price: 20000 },
        ],
    },

    {
        orderId: '22124-3772987543522',
        totalAmount: 200000,
        status: 'Confirmed', // Đã xác nhận
        orderType: 'Offline', // Đơn hàng tại cửa hàng
        createdAt: '10:16, 22/12/2024',
        estimatedTime: null,
        items: [
            { id: '1', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000 },
            { id: '2', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '3', name: 'Trà Sữa Truyền Thống', quantity: 3, price: 50000 },
        ],
    },

    {
        orderId: '22124-3772987543521',
        totalAmount: 80000,
        status: 'Unconfirmed', // Chưa xác nhận
        orderType: 'Online', // Đơn hàng online
        createdAt: '10:16, 22/12/2024',
        estimatedTime: null,
        items: [{ id: '4', name: 'Trà Đào Cam Sả', quantity: 1, price: 80000 }],
    },

    {
        orderId: '22124-3772987543520',
        totalAmount: 150000,
        status: 'UnConfirmed', // Đã xác nhận
        orderType: 'Offline', // Đơn hàng tại cửa hàng
        createdAt: '10:16, 22/12/2024',
        estimatedTime: '10:30',
        items: [
            { id: '1', name: 'Trà Sữa Trân Châu Hoàng Kim', quantity: 1, price: 10000 },
            { id: '2', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '3', name: 'Kem Cheese', quantity: 2, price: 20000 },
            { id: '4', name: 'Kem Cheese', quantity: 2, price: 20000 },
        ],
    },
];

export default orders