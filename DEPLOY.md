# Deploy

## Prerequisites

- Docker installed on the target machine
- Port 80 (or any port) available

## Build & Run

```bash
# Clone the repo
git clone <repo-url>
cd ntucpcpc-website

# Build the image
docker build -t ntucpcpc-website .

# Run (binds to port 8080 on the host)
docker run -d -p 8080:80 --name ntucpcpc --restart unless-stopped ntucpcpc-website
```

The site is now available at `http://<server-ip>:8080`.

## Update

```bash
git pull
docker build -t ntucpcpc-website .
docker stop ntucpcpc && docker rm ntucpcpc
docker run -d -p 8080:80 --name ntucpcpc --restart unless-stopped ntucpcpc-website
```

## Serve on Port 80

Change `-p 8080:80` to `-p 80:80`, or put nginx / Caddy in front as a reverse proxy.

### Caddy example (`Caddyfile`)

```
ntucpcpc.ntucpc.org {
    reverse_proxy localhost:8080
}
```

## Useful Commands

```bash
docker logs ntucpcpc          # view logs
docker ps                     # check running containers
docker stop ntucpcpc          # stop
docker rm ntucpcpc            # remove container
docker rmi ntucpcpc-website   # remove image
```
