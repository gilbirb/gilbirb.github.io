---
layout: ../../../layouts/Layout.astro
title: COMP3331 - Content Distribution Network (CDN)
---

## **Video Streaming**
***

Video is the biggest consumer of Internet bandwidth. Netflix, YouTube and Amazon Prime made up about 80% of residential ISP traffic in 2020.
* Scale: you need to reach around a billion users, and one mega-server can’t do that.
* Heterogeneity: users differ (wired vs mobile, fast vs slow connections), so one fixed quality doesn’t fit everyone.
* Solution: distributed, application-level infrastructure, which means CDNs plus DASH.

A video is:
* A sequence of images shown at a constant rate, e.g. 24 frames per second.
* Each image is an array of pixels, and each pixel is stored as bits. Raw video would be enormous, so it gets compressed.

## **Video Compression**
***

* Spatial (within one frame): if a region has N pixels of the same colour, send just two values, “green, ×N”, instead of N separate values.
* Temporal (between frames): consecutive frames are mostly identical, so frame i+1 is sent as only its differences from frame i.

## **Bit rate types**
***

* CBR (constant bit rate): the encoding rate is fixed.
* VBR (variable bit rate): the rate rises and falls with how much spatial and temporal compression is possible. A static scene compresses well and uses a low rate; fast action uses a high rate.

## **DASH**
***

DASH (Dynamic, Adaptive Streaming over HTTP) is how video streaming adjusts quality on the fly. The video is split into small chunks, each stored at several quality levels. Your player picks the best quality your current bandwidth can handle, one chunk at a time.

Server side
* Splits the video into chunks, typically a few seconds each.
* Encodes every chunk at multiple bitrates (e.g. low, medium, high).
* Publishes a manifest file listing the URL for every chunk at every bitrate.

Client side
* Downloads the manifest first.
* Keeps measuring the bandwidth it’s actually getting from the server.
* For each chunk, it decides:
    * What rate: the highest bitrate it can sustain right now.
    * When: request chunks early enough that the playout buffer doesn’t run dry (stalling), but not so early it overflows.
    * Where: which server to fetch from, e.g. a nearby CDN node or one with spare bandwidth.

Why it works well:
* Quality changes chunk by chunk. If your Wi-Fi drops mid-video, the next chunks come at lower quality instead of the video freezing.
* It runs over plain HTTP, so it works with ordinary web servers, caches and CDNs.
* It handles device differences, such as a phone on 4G versus a TV on fibre.

## **Content Distribution Network**
***

A CDN (content distribution network) stores copies of content (videos, images, web pages) on many servers spread around the world. Each user is served from a nearby copy instead of one central server.

Why not one big server? A single “mega-server” doesn’t scale:
* It’s a single point of failure.
* It becomes a congestion point.
* Distant clients get long, slow paths.
* The same video gets sent over the same outgoing link thousands of times.

## **Placement Strategies**
***

* Enter deep (Akamai): many small server clusters pushed inside access networks (ISPs), very close to users.
* Bring home (Limelight): fewer, larger clusters at points of presence (POPs) near access networks but not inside them.