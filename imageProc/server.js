var AWS = require( "aws-sdk" );

AWS.config.loadFromPath( 'config.json' );
var s3 = new AWS.S3();

AWS.config.loadFromPath( 'configSQS.json' );
var sqs = new AWS.SQS();


var QUEUEkk='https://sqs.us-west-2.amazonaws.com/983680736795/korycki';

console.log( '_____INIT OK' );


var imageProcessor=require( "./ImageProcessor" ).imageProc;

imageProcessor.init(sqs,s3);




function getMessage(){
var params = {
  QueueUrl: QUEUEkk,
  MaxNumberOfMessages: 1,
  VisibilityTimeout: 30,
  WaitTimeSeconds: 10,

  }

    sqs.receiveMessage( params, function ( err, data ) {
        if ( err ){
            
             //console.log("noMSG or ERR");
             }
         // an error occurred
        else{ //console.log( data );  
               imageProcessor.processImage(data);
               var params = {
                QueueUrl: QUEUEkk, // required
                ReceiptHandle: data.Messages[0].ReceiptHandle  // required
            };
            sqs.deleteMessage( params, function ( err, data ) {
                if ( err ) console.log( err, err.stack ); // an error occurred
                else console.log( data );           // successful response
                });
            }         // successful response
    });
 }

 getMessage();
setInterval(function(){
  getMessage();
  }, 10*1000);




