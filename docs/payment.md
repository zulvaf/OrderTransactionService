# Payment
-----

### Submit Payment 
**URL** : `/api/payment`
**Method** : `POST`
**Role** : Customer
**Params**: id_order, total_payment, payment_date, token
**Data examples:**
```json
{
    "id_order" : 1,
    "total_payment": 10000,
    "payment_date" : "8/11/2017",
    "token" : "my_token"
}
```
**Success Response Example:**
- Code: 200
- Content:
```json
{
    "success": true,
    "message": "Payment Submitted"
}
```

### Get All Payments 
**URL** : `/api/payment`
**Method** : `GET`
**Role** : Admin
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
            "id_order": 1,
            "total_payment": 10000,
            "payment_date": "8/11/2017",
            "created_at": "2017-11-08T10:45:22.738Z",
            "id_user": 2,
            "id_coupon": 1,
            "status": "Paid",
            "total_price": "168000"
        }
    ]
}
```

### Get Payment By Id
**URL** : `/api/payment/:id`
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
        "id_order": 1,
        "total_payment": 10000,
        "payment_date": "8/11/2017",
        "created_at": "2017-11-08T10:45:22.738Z",
        "id_user": 2,
        "id_coupon": 1,
        "status": "Paid",
        "total_price": "168000"
    }
}
```

### Get Payments By OrderId
**URL** : `/api/order?id_order=id`
**Method** : `GET`
**Role** : Admin
**Params**: id_order
**Success Response Example:**
- Code: 200
- Content:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "id_order": 1,
            "total_payment": 10000,
            "payment_date": "8/11/2017",
            "created_at": "2017-11-08T10:45:22.738Z",
            "id_user": 2,
            "id_coupon": 1,
            "status": "Paid",
            "total_price": "168000"
        }
    ]
}
```
