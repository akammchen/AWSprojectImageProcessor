
var imageProc = ( function () {

    var sqs, s3;
    var processingImageData;
    var BUCKETkk = 'kkpbucket';
   
  
    function uploadConvertedFile(){

        var fs = require('fs');
        fs.readFile('./temp/temp'+processingImageData.Messages[0].Body.split( "|" )[0]+'.jpg', function read(err, data) {
        if (err) {
            throw err;
        }
        
        var params = {
        Bucket: BUCKETkk, // required
        Key: (processingImageData.Messages[0].Body.split( "|" )[0]+"cv"), // required
        Body: data,
        };
        s3.putObject(params, function(err, data) {
             if (err) console.log(err, err.stack); // an error occurred
             else     console.log(data);           // successful response
            });
});
        }



    function convert(){
        //TODO
        uploadConvertedFile();
        }


    function saveFile(ImageBody){
        console.log(ImageBody);
        var fs = require('fs');
         fs.writeFile('./temp/temp'+processingImageData.Messages[0].Body.split( "|" )[0]+'.jpg',ImageBody, function(err) {
             if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
        convert();
        }
             });
             
        }
    
    
    
     function getImage( Id ) {
        var params = {
            Bucket: BUCKETkk, // required
            Key: Id
        };
        s3.getObject( params, function ( err, data ) {
            if ( err ) console.log( err, err.stack ); // an error occurred
            else{
                    saveFile(data.Body);
                }        // successful response
        });
    }


    


    function process( imageData ) {
        console.log( imageData.Messages[0].Body );

        processingImageData = imageData;
        
        getImage( processingImageData.Messages[0].Body.split( "|" )[0] );


    }

    return {

        init: function ( sqs_, s3_ ) {
            console.log( "ImgProc INIT" );
            sqs = sqs_;
            s3 = s3_;
        },

        processImage: function ( imageData ) {
            process( imageData )
            }
    }

} () );

exports.imageProc = imageProc
