# Express4 Tedious Middleware 

Express4 middleware that enables you to create REST API using SQL Server and Tedious.

## Contents

[Setup](#setup)<br/>
[Initializing data access components](#init)<br/>
[Create REST API](#rest-api)<br/>

<a name="setup"></a>

## Setup

To install Tedious Express4 package, run the following command: 
```
npm install express4-tedious --save 
```

<a name="init"></a>

# Initialize Middleware

In order to initialize data access middleware, you need to add `sql` method to your
request when you initialize express app and routes:

```javascript
var express = require('express');
var tediousExpress = require('express4-tedious');

var app = express();
app.use(function (req, res, next) {
    req.sql = tediousExpress(req, {connection object});
    next();
});
```
This call should be used before any other route definition. Connection object
should look like: 
```
{
	"server"  : "<<server name or ip>>",
	"userName": "<<user name>>",
	"password": "<<password>>",
	"options": { "encrypt": true, "database": "<<database name>>" }
}
```
Use `"encrypt": true` if database is hosted in Azure SQL.

<a name="rest-api"></a>

# Create REST API

Once you setup the middleware, you can easily create REST API using T-SQL queries:

```javascript
/* GET product listing. */
router.get('/', function (req, res) {

    req.sql("select * from Product for json path")
        .into(res);

});
```
In the `sql` method you can specify T-SQL query that should be executed. Method
`into` will stream results of the query into response object. `[]` will be sent to
the client if results are not returned by query. You can provide second patamater that
represents a custom string that should be returned if there is no response from database.

You can also create REST API that uses parameters:

```javascript
/* GET product by id. */
router.get('/:id', function (req, res) {
    
    req.sql("select * from Product where id = @id for json path, without_array_wrapper")
        .param('id', req.params.id, TYPES.Int)
        .into(res, '{}');

});
```

You can create REST APIs that are invoked using POST, PUT, and DELETE methods, and execute
SQL query using `exec` method (without results returned to the client):

```javascript
/* PUT update product. */
router.put('/:id', function (req, res) {
    
    req.sql("exec updateProduct @id, @product")
        .param('id', req.params.id, TYPES.Int)
        .param('product', req.body, TYPES.NVarChar)
        .exec(res);

});
```

> Note: you need to provide `res` object to the `exec` method, because this method
> will return status code to the client.

## Handling errors

This middleware returns error `500` if any error happens with descirption of the error as plain text.

You can customize the function that handles the error and provide your own error handler:

```javascript
/* PUT update product. */
router.put('/:id', function (req, res) {
    
    req.sql("exec updateProduct @id, @product")
        fail(function(ex, res) { 
            res.statusCode = 500;   
            res.write(ex.message);
            res.end();
        } )
        .param('id', req.params.id, TYPES.Int)
        .param('product', req.body, TYPES.NVarChar)
        .exec(res);

});
```

Error handler is a function that gets exception and response output as parameters.