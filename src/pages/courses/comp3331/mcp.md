---
layout: ../../../layouts/Layout.astro
title: COMP3331 - Model Context Protocol (MCP)
---

## **Model Context Protocol**
***

**MCP (Model Context Protocol)** is an open application-layer protocol that lets an AI app (the host) discover and use external tools and data through one standard message format. It doesn’t define the LLM, the UI or the server’s backend logic, only how the two sides talk.

## **Architecture**
***

* Host: the AI app (UI + LLM + orchestration + consent policy). It decides what is allowed and keeps servers isolated from each other.
* Clients: the host runs one MCP client per server connection.
* Servers: expose capabilities, e.g. a local files server or a remote weather server.

## **Message layer: JSON-RPC 2.0**
***

* A request has an `id`, a `method` and `params`.
* A response repeats the same `id` and carries either a `result` or an `error`.
* A notification has no `id` and gets no reply, e.g. `notifications/tools/list_changed`.
* MCP adds the meaning on top: method names like `tools/list`, schemas and capabilities.

## **Stateless design**
***

* A client may call `server/discover` first to learn the server’s supported versions and capabilities.
* Every request then carries its own protocol version, client capabilities and client info, so the server keeps no session state.

## **Three primitives**
***

| Primitive | What it is | Who controls it | Methods
| -- | -- | -- | -- |
| Prompts | Reusable message templates | User | `prompts/list`, `prompts/get` |
|Resources | Read-only data identified by URI | App | `resources/list`, `resources/read` |
| Tools | Executable functions | Model picks, host policy approves | `tools/list`, `tools/call` |

## **Two transports**
***

* stdio (local): the host launches the server as a subprocess. Messages are newline-delimited JSON over stdin/stdout, and logs go to stderr.
* Streamable HTTP (usually remote): one endpoint, and each client message is a separate HTTP POST. The reply is plain JSON or an SSE stream, and closing that stream cancels the request.

## **Typical Flow**

`server/discover` → `tools/list` (returns `get_weather` and its JSON schema) → the LLM chooses the tool → `tools/call get_weather` → result. The matching `id` ties each reply to its request.
