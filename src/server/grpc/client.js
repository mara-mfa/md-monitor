var PROTO_PATH = __dirname + '/helloworld.proto';
const tempy = require('tempy');
const http = require('http');
const fs = require('fs');

var protoFile = loadProtoFile('http://localhost:8081/helloworld.proto')
console.log('ZZZ ' + protoFile)

function loadProtoFile(url) {
  let fileName = tempy.file()
  let file = fs.createWriteStream(fileName)
  http.get(url, (response) => {
    response.pipe(file)
  })
  return fileName
}


const protoLoader = require('@grpc/proto-loader');
var grpc = require('grpc');
//var grpc = require('@grpc/grpc-js')
//var hello_proto = grpc.load(PROTO_PATH).helloworld;

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const package = grpc.loadPackageDefinition(packageDefinition).helloworld;

//console.log(package)


function main() {
  var client = new package.Greeter('localhost:50051', grpc.credentials.createInsecure());

  var method = client['sayHello'].bind(client)
  method({name: 'world'}, function(err, response) {
    if (err)  {
      console.error(err.message, err)
      return
    }
    console.log('Greeting:', response.message);
  });
}

main();
