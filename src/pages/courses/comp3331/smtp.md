---
layout: ../../../layouts/Layout.astro
title: COMP3331 - Simple Mail Transfer Protocol (SMTP)
---

## **Simple Mail Transfer Protocol (SMTP)**
***

SMTP (Simple Mail Transfer Protocol, RFC 5321) is the protocol mail servers use to push email to each other, and it’s also how a user agent sends mail out to its own server.

* Three components: user agents (mail readers like Outlook or the iPhone mail client), mail servers, and SMTP.
* Mail server: holds a mailbox for incoming messages and a message queue for outgoing ones.
* SMTP roles: the sending mail server acts as the client, and the receiving mail server acts as the “server”.

## **How SMTP works**
***

* Transport: TCP, server port 25, so delivery is reliable.
* Direct transfer: the sending server connects straight to the receiving server, with no intermediate servers.
* Three phases: handshaking (greeting), message transfer, closure.
* Command/response: commands are ASCII text and responses are a status code plus a phrase (like HTTP).
* Persistent connections: multiple messages can go over one connection.
* 7-bit ASCII: the header and body must both be 7-bit ASCII, so non-text content has to be encoded.
* End of message: a line containing only a period (CRLF.CRLF).

## **Sample SMTP interaction**
***

Alice sends to Bob
1. Alice composes the message in her user agent, addressed to `bob@someschool.edu`.
2. Her user agent sends it to her mail server, where it’s placed in the message queue.
3. The client side of SMTP on her server opens a TCP connection to Bob’s mail server.
4. The SMTP client sends Alice’s message over that connection.
5. Bob’s mail server places the message in Bob’s mailbox.
6. Bob uses his user agent to read it.

```
S: 220 hamburger.edu
C: HELO crepes.fr
S: 250 Hello crepes.fr, pleased to meet you
C: MAIL FROM: <alice@crepes.fr>
S: 250 alice@crepes.fr... Sender ok
C: RCPT TO: <bob@hamburger.edu>
S: 250 bob@hamburger.edu ... Recipient ok
C: DATA
S: 354 Enter mail, end with "." on a line by itself
C: Do you like ketchup?
C: How about pickles?
C: .
S: 250 Message accepted for delivery
C: QUIT
S: 221 hamburger.edu closing connection
```

## **SMTP vs HTTP**
***

|	| HTTP	| SMTP |
| -- | -- | -- |
Direction	|Pull (client fetches)	|Push (sender sends) |
Interaction	|ASCII command/response, status codes	| ASCII command/response, status codes |
Objects	|Each object in its own response	| Multiple objects in one multipart message |
Connection	|Persistent or not	| Persistent |
