---
layout: ../../../layouts/Layout.astro
title: COMP3331 - Hypertext Transfer Protocol (HTTP)
---

## **HTTP**
***

HTTP is the Web’s application-layer protocol: a stateless, text-based request/response protocol between a browser (client) and a web server, carried over TCP (port 80, or 443 for HTTPS).

* Client/server model: the client requests Web objects (HTML, images, etc.) and the server responds. Each object has a URL: protocol://host[:port]/path/resource.
* Uses TCP: the client opens a connection to the server, they exchange messages, then the connection closes.
* Stateless: the server keeps no memory of past requests. This keeps the protocol simple and avoids crash-recovery problems.
* ASCII text: messages are human-readable and easy to delimit with `\r\n`, but less efficient than binary fields.

## **HTTP Messages**
***

* Request: request line (`GET /index.html HTTP/1.1`), then header lines (Host, User-Agent, Accept, Connection...), then a blank line, then an optional body.
* Response: status line (`HTTP/1.1 200 OK`), then headers (Date, Server, Content-Length, Content-Type...), then a blank line, then the data.
* Methods
    * GET fetches an object (it can also carry data in the URL after `?`).
    * POST sends form data in the body.
    * HEAD fetches only the headers.
    * PUT uploads or replaces an object.
* Status codes:
    * 200 OK
    * 301 Moved Permanently (new location in the Location: header)
    * 304 Not Modified
    * 400 Bad Request
    * 404 Not Found
    * 505 HTTP Version Not Supported

## **HTTP Cookies**
***

Cookies adds state to a stateless protocol

* Four parts: a Set-Cookie header in the response, a Cookie header in later requests, a cookie file on the user’s host, and a back-end database at the site.
* How it works: the server creates an ID on the first visit, the browser sends it back on every later request, and the server looks up that user in its database.
* Uses: login/authorization, shopping carts, recommendations, session state.
* Privacy: third-party cookies (from ad networks, often via a 1-pixel banner) let one ID be tracked across many sites.

## **Performance**
***

* Non-persistent (HTTP/1.0): one TCP connection per object. Each object costs 2 RTT plus transmission time, with a new slow-start each time. Browsers add parallel connections to compensate, but too many hurt the network and the server.
* Persistent (HTTP/1.1): the connection stays open for all objects.
    * Without pipelining: 1 RTT per object.
    * With pipelining: requests are sent back-to-back, so as little as 1 RTT for all the objects.
* Quiz formulas (base file S₀, N objects of size S, link capacity C, RTT D):
    * Non-persistent: 2D + S₀/C + N(2D + S/C)
    * Persistent, no pipelining: 2D + S₀/C + N(D + S/C)
    * Persistent with pipelining: 3D + (S₀ + NS)/C

## **Caching and proxies**
***

* Web cache (proxy): it acts as a server to the client and as a client to the origin server. It is typically installed by an ISP, university or company.
* Benefits: faster responses (the cache is closer), less traffic on the access link, and help for small content providers.
* Conditional GET: the cache sends `If-Modified-Since: <date>`. The server replies `304 Not Modified` with no object if the copy is fresh, or `200 OK` with data if not. ETag (often a hash of the content) is used for dynamic content.
* Replication and CDNs: popular content is copied across many servers, with DNS steering clients to a nearby replica.

## **HTTP versions**
***

* HTTP/1.1: persistent connections and pipelining, but responses come back in order (FCFS). A small object can be stuck behind a large one (head-of-line blocking).
* HTTP/2 (2015): objects are split into frames and interleaved. Small objects aren’t blocked by large ones, and the client can set priorities. The server can push unrequested objects. Methods, status codes and most headers are unchanged.
* HTTP/3 (2022): runs over QUIC/UDP instead of TCP. It skips the TCP handshake and removes HOL blocking between objects, so one lost packet no longer stalls everything.

## **HTTPS**
***

Plain HTTP is insecure. Basic auth only base64-encodes the password, which is easily reversed. HTTPS is HTTP over TLS-encrypted TCP, giving authentication and bidirectional encryption.