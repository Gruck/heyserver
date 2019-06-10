/*this module will describe custom routes or middleware on /api to interract with the salesforce instance */

module.exports = function(server, router, ss, oauth){

    server.use("/me",ss.authNMiddleware)
    server.get("/me",function (req,res){
        if(req.administrator){
            res.send({
                "isAdmin":true,
                "username":req.administrator.username,
                "organization_id":null,
                "sfdc_instanceUrl":null
            })
        }else if(req.user){
            res.send({
                "isAdmin":false,
                "username":req.user.username,
                "organization_id":req.organization.id,
                "sfdc_instanceUrl":req.organization.sfdc_instanceUrl
            })
        }else{
            res.sendStatus(401)
        }
    });

        
    server.use("/test",ss.authNMiddleware)
    server.get("/test",function(req,res){
        
        var conn = oauth.getConnection(req.organization);

        conn.identity(function(err, res2) {
            if (err) { return console.error(err); }
            res.send({
                "user_id" : res2.user_id,
                "organization_id" : res2.organization_id,
                "username" : res2.username,
                "display_name" : res2.display_name
            })
        });
    })
}