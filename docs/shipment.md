# Shipment
-----

### Submit Shipment 

**URL** : `/api/shipment`

**Method** : `POST`

**Role** : Admin

**Params**: id_order, shipment_status, operator, token

**Data examples:**
```json
{
    "id_order" : 1,
    "shipment_status": "Delivered",
    "operator": "JNE",
    "token": "my_token"
}
```
**Success Response Example:**
- Code: 200
- Content:
```json
{
    "success": true,
    "message": "Shipment Submitted"
}
```

### Get All Shipments/Own Shipments 

**URL** : `/api/payment`

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
            "id_order": 1,
            "shipment_status": "Delivered",
            "operator": "JNE",
            "created_at": "2017-11-08T10:45:22.738Z",
            "id_user": 2,
            "id_coupon": 1,
            "status": "Shipped",
            "total_price": "168000"
        }
    ]
}
```

### Get Shipment By Id

**URL** : `/api/shipment/:id`

**Method** : `GET`

**Role** : Admin/Customer

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
        "shipment_status": "Delivered",
        "operator": "JNE",
        "created_at": "2017-11-08T10:45:22.738Z",
        "id_user": 2,
        "id_coupon": 1,
        "status": "Shipped",
        "total_price": "168000"
    }
}
```

### Get Shipments By OrderId

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
            "shipment_status": "Delivered",
            "operator": "JNE",
            "created_at": "2017-11-08T10:45:22.738Z",
            "id_user": 2,
            "id_coupon": 1,
            "status": "Shipped",
            "total_price": "168000"
        }
    ]
}
```
