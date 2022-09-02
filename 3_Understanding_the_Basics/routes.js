import fs from 'fs';

const requestHandler = (req,res) =>
{
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title><head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>')
        return res.end();

    }

    if (url === '/message' && method === 'POST') {
        const body = [];
        // listening data event by on function 
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk); // with push we are editing the body element not changing it form behind
        });
        req.on('end', () => {
            const parseBody = Buffer.concat(body).toString();
            const message = parseBody.split('=')[1];
            fs.writeFile('message.txt', message, err => {
                res.statusCode = 382;
                res.setHeader('Location', '/');
                return res.end();
            });
            console.log(parseBody);
        });


    }
    // console.log(req.url, req.method, req.headers);
    //   process.exit();
    // generally we don't quit our servers because people will not
    // be able to use our page
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first page </title><head>');
    res.write('<body><h1>Hello from my Node.js server!</h1></body>');
    res.write('</html>')
    res.end();
};

// first method of exporting 
export default requestHandler;

/* module.exports =  {
    handler: requestedHandler,
    sometext: 'some hard coded text';
};*/

// exports.handler = requestHandler;
// exports.sometext = 'some hard coded text';