# User
-----

### Login
**URL** : `/api/login`

**Method** : `POST`

**Params**:
- username : string
- password: string

**Data examples:**
```json
{
    "username": "admin",
    "password":"admin"
}
```

**Success Response Example:**
- Code: 200
- Content:
```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6MSwiaWRfdXNlciI6MSwiaWF0IjoxNTEwMTM2MTM2LCJleHAiOjE1MTAxNTQxMzZ9.-FwZ35y8IC0MtABy3d5ciaCOTQYIKQlzI719atfYMiA"
}
```
Token is used for other method:
- as Header `x-access-token` for `GET` method, or 
- as parameter `token` for `PUT` and `POST` method

**Error Response Example:**
- Code: 401
- Content:
```json
{
    "success": false,
    "message": "Authentication failed. Wrong password"
}
```

- Code: 401
- Content:
```json
{
    "success": false, 
	"message": "Failed to authenticate token"
}
```
