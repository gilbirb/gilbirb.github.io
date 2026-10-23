---
layout: ../../../layouts/Layout.astro
title: COMP3331 - Domain Name System (DNS)
---

## **Domain Name System (DNS)**
***

The Core Problem: Humans prefer mnemonic names (e.g., `cs.umass.edu`), whereas network hardware routes packets using numerical IP addresses (32-bit in IPv4).

DNS is an application-layer protocol and a distributed database implemented across a hierarchy of name servers to resolve names to IP addresses (and vice versa).

Even though DNS is a core Internet function, it is implemented at the network’s edge within the application layer rather than built into the network core.

Originally, the Internet used a single flat file (hosts.txt) maintained by the Stanford Research Institute (SRI). As the network grew, centralized management broke down. A single centralized server would cause:
* A single point of failure.
* Massive traffic volume (billions of daily queries).
* High latency to a distant centralized database.
* Impossible maintenance and scaling.

## **Key Services Provided by DNS**
***

Hostname-to-IP Address Translation: The primary function of resolving human-readable names to routable IP addresses.

Host Aliasing: Allows a host to have one canonical (real) name and multiple alias names.

Mail Server Aliasing: Directs email queries to the appropriate mail server hostnames.

Load Distribution: Maps a single domain name to multiple replicated IP addresses to balance web server load.

## **The DNS Hierarchy**
***

DNS distributes records through three levels of servers:
1. Root Name Servers:
    * Official contact-of-last-resort for unresolved queries.
    * Managed under ICANN and logically structured as 13 root server identities replicated hundreds of times globally via anycast.
2. Top-Level Domain (TLD) Servers:
    * Responsible for generic domains (e.g., `.com`, `.edu`, `.org`) and country codes (e.g., `.au`, `.uk`, `.jp`).
    * Managed by registries such as Educause (`.edu`) or Network Solutions (`.com`, `.net`).
3. Authoritative DNS Servers:
    * Maintained by an organization or service provider.
    * Contain the actual mapping records for an organization's specific named hosts.

Local DNS Name Server (Default Name Server): Does not strictly belong to the hierarchy. Assigned to hosts (usually via DHCP) by an ISP, company, or university. It caches recent lookups and acts as a proxy forwarding queries up into the DNS hierarchy.

## **Name Resolution: Iterated vs. Recursive Queries**
***

Iterated Query: Contacted servers reply with the address of the next server to consult ("I don't know this name, but ask this server"). The local DNS server performs the legwork of querying root, TLD, and authoritative servers sequentially.

Recursive Query: Puts the burden of name resolution entirely on the contacted server, which recursively queries other servers and returns the final answer. This approach puts heavier load on upper-level servers and is rarely used at the root/TLD level.

## **Caching and Resource Records**
***

DNS servers cache learned mappings to speed up subsequent queries, automatically expiring them after a designated Time to Live (TTL).

DNS records use the format `(name, value, type, ttl)`. Example types:
1. `A`: Maps a hostname to an IPv4 address.
2. `NS`: Maps a domain name to the hostname of its authoritative name server.
3. `CNAME`: Maps an alias hostname to its canonical (real) hostname.
4. `MX`: Maps a domain name to the hostname of its mail server.

## **Transport and Reliability**
***

Operates on port **53** using **UDP** by default (TCP is supported when required, such as for larger responses or zone transfers).

Reliability, retransmissions, and exponential backoff are handled at the application layer because UDP does not provide built-in delivery guarantees.