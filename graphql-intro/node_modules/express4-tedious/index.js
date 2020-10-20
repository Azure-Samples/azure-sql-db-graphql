var TYPES = require('tedious').TYPES;

function tediousExpress(config){

    if(arguments.length > 1)
        throw "Express4/Tedious connector can have just one argument since version 0.3, Remove first argument(request) and leave just connection config object, or use older version.";
    
    return function(sqlQueryText) {

        var Connection = require('tedious').Connection;
        
        return {
            connection: new Connection(config),
            sql: sqlQueryText,
            parameters: [],
            isEmptyResponse: true,
            defaultOutput: "",
            param: function(param, value, type){
                this.parameters.push({name: param, type: type, value: value});
                return this;
            },
            exec: function(ostream, successResponse) {
                var request = this.__createRequest(ostream);
                this.__ExecuteRequest(request, ostream);
            },
            into: function(ostream, defaultOutput = "[]") {
                var request = this.__createRequest(ostream);
                var self = this;
                self.defaultOutput = defaultOutput;
                
                request.on('row', function (columns) {
                    if(self.isEmptyResponse) {
                        self.isEmptyResponse = false;
                    }
                    ostream.write(columns[0].value);
                });
                this.__ExecuteRequest(request, ostream);
            },
            __ExecuteRequest: function(request, ostream) {
                var self = this;
                this.connection.on('connect', function (err) {
                    if (err) {
                        console.trace(err);
                        self.fnOnError && self.fnOnError(err, ostream);
                        
                    } else {
                        self.connection.execSql(request);
                    }
                });
            },
            __createRequest: function(ostream){
                var Request = require('tedious').Request;
                var self = this;
                var request =
                    new Request(this.sql, 
                            function (err, rowCount) {
                                try {
                                    if (err) {
                                        self.fnOnError && self.fnOnError(err, ostream);
                                    }
                                    if(self.isEmptyResponse){
                                        ostream.write(self.defaultOutput);
                                    }
                                } catch (ex) {
                                    console.write(ex);
                                }
                                finally{
                                    self.connection && self.connection.close();
                                    self.fnOnDone && self.fnOnDone('Connection closed', ostream);
                                }
                            });

                for(var index in this.parameters) {
                    request.addParameter(
                        this.parameters[index].name,
                        this.parameters[index].type || TYPES.NVarChar,
                        this.parameters[index].value);
                }
                return request;
            },
            done: function(fnDone){
                this.fnOnDone = fnDone;
                return this;
            },
            fail: function(fnFail){
                this.fnOnError = fnFail;
                return this;
            },
            fnOnDone: function(message, ostream) {
                try{
                    ostream && ostream.end();
                } catch(ex){
                    console.trace(ex);
                }
            },
            fnOnError: function(error, ostream) {
                try{
                    ostream && ostream.status(500);
                    ostream && ostream.write(error.message);
                    ostream && ostream.end();
                } catch (ex) {
                    console.warn("Cannot close response after error: " + ex + "\nOriginal error:"+error);
                }
                console.trace(error);
            }
        }
    }
}

module.exports = tediousExpress;