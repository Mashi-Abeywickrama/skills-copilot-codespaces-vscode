 // Create web server
 var server = http.createServer(function(request, response) {
   // Get the path
   var path = url.parse(request.url).pathname;
   // Determine if this is a POST request
   if (request.method === 'POST') {
     // If so, then process the comment
     processComment(request, response);
   } else {
     // Otherwise, serve the file
     fs.readFile(__dirname + path, function(error, data) {
       if (error) {
         // If there is an error, set the status code and serve an error page
         response.writeHead(404, {'Content-type':'text/plain'});
         response.end('404 - File not found');
       } else {
         // Otherwise, serve the file
         response.writeHead(200, {'Content-type':'text/html'});
         response.end(data);
       }
     });
   }
 });
 // Process comment
 function processComment(request, response) {
   // Set up body variable
   var body = '';
   // Set encoding
   request.setEncoding('utf8');
   // Listen for data events
   request.on('data', function(data) {
     // Append data
     body += data;
   });
   // Listen for end event
   request.on('end', function() {
     // When done, write comment to file
     fs.appendFile('comments.txt', body + '\n', function(error) {
       // If there is an error, set the status code and serve an error page
       if (error) {
         response.writeHead(500, {'Content-type':'text/plain'});
         response.end('500 - Internal server error');
       } else {
         // Otherwise, set the status code and serve a confirmation message
         response.writeHead(200, {'Content-type':'text/plain'});
         response.end('Thank you for your comment');
       }
     });
   });
 }
 // Listen for connections
 server.listen(8080);
 // Log a message to the console
 console.log('Server is listening on port 8080');

// Path: comments.txt
// This is a comment
// This is another comment
// This is a third comment

// Path: index.html
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <title>Comments</title>
// </head>
// <body>
//   <h1>Comments</h1>
//   <form