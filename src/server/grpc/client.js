var PROTO_PATH = __dirname + '/helloworld.proto';

var grpc = require('grpc');
var hello_proto = grpc.load(PROTO_PATH).helloworld;

function main() {
  var client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());

  var method = client['sayHello'].bind(client)
  method({name: 'world'}, function(err, response) {
    console.log('Greeting:', response.message);
  });
}

main();
