# Order
-----

### Submit Order 
**URL** : `/api/order`
**Method** : `POST`
**Role** : Customer
**Params**: id_user, id_coupon (not required), products, name, phone_number, email, address, token
**Data examples:**
```json
{
    "id_user": 2,
	"id_coupon": 2,
	"products":[{"id_product":3,"total":1}, {"id_product":4,"total":1}],
	"name":"test",
	"phone_number": "081111111",
	"email": "test@example.com",
	"address":"Bandung",
	"token": "your_token"
}
```
**Success Response Example:**
- Code: 200
- Content:
```json
{
    "success": true,
    "message": "Order Submitted"
}
```
**Error Response Example:**
- Code: 202
- Content:
```json
{
    "success": false,
    "message": "Coupon not valid"
}
```

- Code: 202
- Content:
```json
{
    "success": false,
    "message": "Product ordered exceed quantity"
}
```

### Get All Orders/Own Orders 
**URL** : `/api/order`
**Method** : `GET`
**Role** : Admin/Customer
**Params**: -
**Success Response Example:**
- Code: 200
- Content:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "id_coupon": 1,
            "id_user": 2,
            "status": "Submitted",
            "product": [
                {
                    "id_product": 3,
                    "name": "White Blouse",
                    "total": 1,
                    "price": "85000.0000"
                },
                {
                    "id_product": 4,
                    "name": "Woman Handbag",
                    "total": 1,
                    "price": "125000.0000"
                }
            ],
            "total_price": "168000"
        }
    ]
}
```

Total harga yang ditamplikan sudah mencakup potongan diskon jika terdapat parameter `id_coupon`

### Get Order By Id
**URL** : `/api/order/:id`
**Method** : `GET`
**Role** : Admin
**Params**: id
**Success Response Example:**
- Code: 200
- Content:
```json
{
    "success": true,
    "data": {
        "id": 1,
        "id_coupon": 1,
        "id_user": 2,
        "status": "Submitted",
        "product": [
            {
                "id_product": 3,
                "name": "White Blouse",
                "total": 1,
                "price": "85000.0000"
            },
            {
                "id_product": 4,
                "name": "Woman Handbag",
                "total": 1,
                "price": "125000.0000"
            }
        ],
        "total_price": "168000"
    }
}
```

### Change Order Status
**URL** : `/api/order/:id`
**Method** : `PUT`
**Role** : Admin
**Params**: id, status, token
**Data examples:**
```json
{
    "status" : "Cancelled"
    "token" : "my_token"
	
}
```
**Success Response Example:**
- Code: 200
- Content:
```json
{
    "success": true,
    "message": "Status Updated"
}
```
