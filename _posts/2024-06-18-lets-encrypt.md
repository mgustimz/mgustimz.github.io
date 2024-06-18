---
layout: post
title: Free SSL certificates with Let's Encrypt
slug: free-ssl-certificates-with-lets-encrypt
toc: true
---

![ssl-cert](https://images.unsplash.com/photo-1605351792643-fe0c43d18762?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

This is a guide on how to get free SSL certificates with Let's Encrypt with NGINX

## Prerequisites

- A domain name
- A server with NGINX installed
- A user with sudo privileges

## Step 1: Point your domain to your server

You need to point your domain to your server's IP address. You can do this by adding an A record in your domain registrar's DNS settings.

## Step 2: Configure NGINX

You need to configure NGINX to serve your domain. Create a new server block configuration file in `/etc/nginx/sites-available/` directory.

```bash
sudo nano /etc/nginx/sites-available/yourdomain.com
```

Add the following configuration to the file:

```bash
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

Save the file and create a symbolic link to the `sites-enabled` directory:

```bash
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
```

Test the NGINX configuration:

```bash
sudo nginx -t
```

If the test is successful, reload NGINX:

```bash
sudo systemctl reload nginx
```

## Step 3: Install Certbot

Certbot is a free, open-source software tool for automatically using Let's Encrypt certificates on manually-administrated websites to enable HTTPS.

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

## Step 4: A and CNAME records

Add an A record for your domain and a CNAME record for www.yourdomain.com in your domain registrar's DNS settings.

Example:

```
A record: yourdomain.com -> your server's IP address
CNAME record: www.yourdomain.com -> yourdomain.com
```

## Step 5: Obtain SSL certificate

Run the following command to obtain an SSL certificate for your domain:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot will automatically configure NGINX to use the SSL certificate.

## Step 6: Verify SSL certificate

Visit your domain in a web browser and verify that the SSL certificate is working.

## Conclusion

You now have free SSL certificates with Let's Encrypt on your NGINX server. Your website is now secure and encrypted.

```

```
