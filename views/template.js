module.exports = {
    body: function (login, button, contents) {
        return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
        
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <meta name="description" content="">
            <meta name="author" content="">
        
            <title>Free board</title>
        
            <!-- Bootstrap core CSS -->
            <link href="./css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="./sample.css">
        
        </head>
        
        <body>
        
            <!-- Navigation -->
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark static-top">
            <div class="container">
                <a class="navbar-brand" href="#">Free board</a>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav ml-auto">
                    ${login}
                </ul>
                </div>
            </div>
            </nav>
        
            <!-- Page Content -->
            <div class="button">${button}</div>
            <div class="container">
                <div class="row">
                    <div class="col-lg-12 text-center">
                        ${contents}
                    </div>
                </div>
            </div>
        </body>
        <style>
            div.button {
                margin-left:1000px;
                margin-top:50px;
            }
            a:link { color: black;text-decoration: none;}
            a:hover { color: blue; text-decoration: underline;}
        </style>
        </html>
        `;
    }
}