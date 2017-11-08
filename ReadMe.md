# Order Transaction REST API Documentation

REST API for handling order transaction using NodeJS Express Framework

## Installation

The application is deployed in Heroku Server and can be accessed in
```sh
https://z-order-transaction-api.herokuapp.com/
```

## EndPoints
### Login
- [Login](docs/user.md) : `POST /api/login`

### Customer API
- [See Own Order](docs/order.md) : `GET /api/order`
- [Submit Order](docs/order.md) : `POST /api/order`
- [Submit Payment Proof](docs/payment.md) : `POST /api/payment`
- [See Own Shipment](docs/shipment.md) : `GET /api/shipment`
- [See Shipment By ShipmentId](docs/shipment.md) : `GET /api/shipment/:id`

### Admin API
- [See All Orders](docs/order.md) : `GET /api/order`
- [See Order By Id](docs/order.md) : `GET /api/order/:id`
- [Change Order Status](docs/order.md) : `PUT /api/order/:id`
- [See All Payments](docs/payment.md) : `GET /api/payment`
- [See Payment By Id](docs/payment.md) : `GET /api/payment/:id`
- [See Payment By OrderId](docs/payment.md) : `GET /api/payment?id_order=id`
- [See All Shipments](docs/shipment.md) : `GET /api/shipment`
- [See Shipment By Id](docs/shipment.md) : `GET /api/shipment/:id`
- [See Shipment By OderId](docs/shipment.md) : `GET /api/shipment?id_order=id`
- [Submit Shipment](docs/shipment.md) : `POST /api/shipment`

## Assumption
- The API provides login API to get token for authentication, but doesn't handle other account management services such as register, logout, and  user manipulation.
- Submit Order API validates required fields (customer name, phone, email, address) so the fields are not empty. Any validation other than that is handled by admin manually. When admin changes order's status, it is already assumed that the customer data and payment is valid
- Customer only can see their own order, while admin can see all orders. Customer can see their own shipment or specific shipment by using ShipmentId. Customer can not see payment data at all.


## Data Seed
Some [data](docs/data.md) are provided to test the API 