---
layout: ../../../layouts/Layout.astro
title: COMP3331 - Network core
---

## **Network Core**
***

Network core: a mesh of interconnected routers/switches that moves data between hosts. The Internet uses packet switching. Circuit switching is the older alternative, used in telephone networks.

## **Circuit switching**
***

* Resources are reserved end-to-end for each “call”. They are dedicated and not shared, so performance is guaranteed.
* A reserved circuit sits idle if the call isn’t using it.
* Phases: circuit establishment → information transfer → teardown.
* Ways to split a link into circuits:
    * FDM (frequency division): each call gets its own frequency band.
    * TDM (time division): each call gets periodic time slots at the full band’s rate.
* Why it doesn’t suit the Internet:
    * Inefficient: computer traffic is bursty, and idle circuits can’t be reused.
    * Fixed rate: applications need very different rates (video vs telnet).
    * State overhead: per-connection state doesn’t scale.

## **Packet switching**
***

* Hosts break messages into packets. Each has a header (instructions for the network, such as destination address, TTL and header checksum) and a payload (the data).
* Switches forward packets based on their headers.
* Each packet travels independently, with no notion of a circuit.
* No resources are reserved. Link capacity is shared on demand, which is called statistical multiplexing.
* Store-and-forward: the switch receives the entire packet before transmitting it onward. We always assume this, and we assume processing time is negligible. The alternative, cut-through, starts forwarding once the header is processed.

## **Two key core functions**

Function	| Scope |	What it does
-- | -- | --
Forwarding	| Local| 	Moves a packet from a router’s input link to the right output link, using the forwarding table (header value → output link)
Routing |	Global	| Determines the source→destination paths packets take (routing algorithms)

## **Statistical multiplexing**
***

* Idea: bursty flows rarely peak at the same time, so sharing the full capacity beats giving each flow a fixed 1/3 share (which is circuit-like and overloads on a burst).
* It relies on the assumption that not all flows burst at once. The slides compare this to insurance, with the same failure case.
* Overload handling:
    * Transient overload: packets queue in the buffer, which absorbs the burst. This isn’t a rare event.
    * Persistent overload: the buffer fills and packets are dropped.