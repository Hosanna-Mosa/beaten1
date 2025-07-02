// backend/controllers/orderController.js

// Detailed orders for getOrderById
const detailedOrders = [
  {
    _id: 'ORD-1001',
    createdAt: '2024-06-01T10:00:00.000Z',
    status: 'delivered',
    totalAmount: 2499,
    discount: 0,
    items: [
      {
        product: {
          _id: '1',
          name: 'Black Graphic T-shirt',
          images: ['https://i.pinimg.com/736x/65/f3/21/65f3213693e94dacf246dac482c8e996.jpg']
        },
        size: 'M',
        color: 'Black',
        quantity: 1,
        price: 999
      },
      {
        product: {
          _id: '2',
          name: 'Oversized Hoodie',
          images: ['https://i.pinimg.com/736x/65/f3/21/65f3213693e94dacf246dac482c8e996.jpg']
        },
        size: 'L',
        color: 'Grey',
        quantity: 1,
        price: 1500
      }
    ],
    shippingAddress: {
      fullName: 'John Doe',
      address: '123 Demo Street',
      city: 'City',
      state: 'State',
      pincode: '123456',
      phone: '9876543210'
    }
  },
  {
    _id: 'ORD-1002',
    createdAt: '2024-05-28T10:00:00.000Z',
    status: 'shipped',
    totalAmount: 1799,
    discount: 100,
    items: [
      {
        product: {
          _id: '3',
          name: 'White Cap',
          images: ['https://i.pinimg.com/736x/65/f3/21/65f3213693e94dacf246dac482c8e996.jpg']
        },
        size: 'Free',
        color: 'White',
        quantity: 1,
        price: 1799
      }
    ],
    shippingAddress: {
      fullName: 'Jane Smith',
      address: '456 Example Ave',
      city: 'City',
      state: 'State',
      pincode: '654321',
      phone: '9876543211'
    }
  },
  {
    _id: 'ORD-1003',
    createdAt: '2024-05-20T10:00:00.000Z',
    status: 'processing',
    totalAmount: 3499,
    discount: 0,
    items: [
      {
        product: {
          _id: '4',
          name: 'Joggers',
          images: ['https://via.placeholder.com/80x80?text=Joggers']
        },
        size: 'L',
        color: 'Grey',
        quantity: 1,
        price: 1499
      },
      {
        product: {
          _id: '5',
          name: 'Sneakers',
          images: ['https://via.placeholder.com/80x80?text=Sneakers']
        },
        size: '9',
        color: 'White',
        quantity: 1,
        price: 1799
      },
      {
        product: {
          _id: '6',
          name: 'Socks',
          images: ['https://via.placeholder.com/80x80?text=Socks']
        },
        size: 'Free',
        color: 'Black',
        quantity: 1,
        price: 201
      }
    ],
    shippingAddress: {
      fullName: 'Alice Brown',
      address: '789 Sample Road',
      city: 'City',
      state: 'State',
      pincode: '789123',
      phone: '9876543212'
    }
  }
];

// Orders list for getOrders (simplified)
const listOrders = detailedOrders.map(order => ({
  _id: order._id,
  createdAt: order.createdAt,
  status: order.status,
  totalAmount: order.totalAmount,
  discount: order.discount,
  address: `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.pincode}`,
  items: order.items.map(item => ({
    name: item.product.name,
    image: item.product.images[0],
    qty: item.quantity,
    price: item.price
  }))
}));

// GET /api/orders
const getOrders = (req, res) => {
  res.json(listOrders);
};

// GET /api/orders/:id
const getOrderById = (req, res) => {
  const order = detailedOrders.find(o => o._id === req.params.id);
  if (!order) {
    return res.status(404).json({ status: 'error', message: 'Order not found' });
  }
  res.json(order);
};

// POST /api/orders/:id/return
const returnOrder = (req, res) => {
  res.json({
    status: 'success',
    message: 'Return/Exchange request submitted',
    orderId: req.params.id,
    data: req.body
  });
};

// GET /api/orders/:id/invoice
const getOrderInvoice = (req, res) => {
  // For now, return a dummy invoice download link
  res.json({
    status: 'success',
    message: 'Invoice generated',
    downloadUrl: `http://localhost:5000/invoices/${req.params.id}.pdf`
  });
};

module.exports = { getOrders, getOrderById, returnOrder, getOrderInvoice }; 