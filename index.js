const fs = require('fs');
const http = require('http');
const formidable = require('formidable');
const mm = require('music-metadata');
const { DEFAULT_OPTIONS } = require('formidable');
const util = require('util');
const jsmediatags = require('jsmediatags');

http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            var oldpath = files.filetoupload.path;
            var newpath = 'C:/Users/Darren/Desktop/Audioworks/MediaProcessing/assets/' + files.filetoupload.name;
            fs.rename(oldpath, newpath, (err) => {
                if (err) throw err;
                res.write('File uploaded and moved!');

                var metadata;
                mm.parseFile(newpath).then(e => {
                    if (e) {
                        metadata = JSON.stringify(e);
                        // console.log(metadata);
                        var location = newpath.slice(0, newpath.length - 4);
                        fs.appendFile(location + '.txt', metadata, (err) => {
                            if (err) throw err;
                            console.log('file has been uploaded to assets folder');
                        });
                        res.end();
                    }
                });

                // one solution that works, but doesn't seem to collect a lot of data

                // var metadata;
                // new jsmediatags.Reader('./assets/' + files.filetoupload.name).setTagsToRead(['title', 'artist', 'album', 'year', 'genre']).read({
                //     onSuccess: (tags) => {
                //         metadata = JSON.stringify(tags);

                //         var location = newpath.slice(0, newpath.length - 4);
                //         console.log(typeof metadata);
                //         fs.appendFile(location + '.txt', metadata, (err) => {
                //             if (err) throw err;
                //             console.log('file has been uploaded to assets folder');
                //         });
                //         res.end();
                //     },
                //     onError: (error) => {
                //         console.log(error);
                //     }
                // });
            });



        });

    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
}).listen(8080);



