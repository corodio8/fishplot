Demo avaiable at code.wordcruft.com:8999/fish/

Just a little overcomplicated demo to show given a (random) set of data,
what your expected number of fish is, given the size of barrel you buy.

index.html runs JS that makes a call to a subfolder on the same server,
which is an nginx proxy to node, which returns raw stringified JSON, 
which is then used as data for some linear regression on one variable.

RandomNum.js creates a random set of points and returns them

The nginx config needs to be set up to proxy the node server otherwise
we will get cross-site-scripting errors.


upstream misc_server {
 ## 8999 is the port nginx will be listening on.
 ## here its set to 8999 just so it doesn't get hammered
 server localhost:8999;
}

server {
 listen 8999;
 server_name static;

 location /site {
     alias /path/to/www/files;
     try_files $uri $uri/ @node_randomnum;
 }

 location @node_randomnum {
     rewrite /site(.*) $1 break;

     proxy_set_header X-Real-IP $remote_addr;
     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_set_header Host $proxy_host;
     proxy_set_header X-NginX-Proxy true;
    
     ## 8998 is our node server port here
     ## This is independent of the nginx port, it just needs its own port
     ## this can also be firewalled off since nginx is proxying the request.
     proxy_pass http://your.domain.here.com:8998;
     proxy_redirect http://your.domain.here.com/ /site/;
 }
}

