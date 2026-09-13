---
layout: /src/layouts/Layout.astro
title: AWS CCP - Cloud Architecture
---

## **Intro**
***

**Solutions Architect**: A role in a technical organization that architects a technical solution using multiple systems via researching, documentation, experimentation.

**Cloud Architect**: A solutions architect that is focused solely on architecting technical solutions using cloud services.

A cloud architect need to understand the following terms and factor them into their designed architecture based on the business requirements
* Availability
* Scalability
* Elasticity
* Fault Tolerance
* Disaster Recovery

A solutions architect needs to always consider the following business factors
* Security
* Cost

## **High Availability**
***

Your ability for your service to remain available by ensuring there is no single point of failure and/or ensure a certain level of performance

**Elastic load balancer**: A load balancer allows you to evenly distribute traffic to multiple servers in one or more datacenter. If a datacenter or server becomes unavailable, the load balancer will route the traffic to only available datacenters with servers.

Running your workload across multiple Availability Zones ensures that if 1 or 2 AZs become unavailable your service / applications remains available.

## **High Scalability**
***

Your ability to increase your capacity based on the increasing demand of traffic, memory, and computing power

**Vertical scaling**: Upgrade to a bigger server

**Horizontal scaling**: Add more servers of the same size

## **High Elasticity**
***

Your ability to automatically increase or decrease your capacity based on the current demand of traffic, memory and computing power

Horizontal scaling:
* Scaling Out - Add more servers of the same size
* Scaling In - Removing underutilized servers of the same size

**Auto Scaling Groups (ASG)** is an AWS feature that will automatically add or remove servers based on scaling rules you define based on metrics

Vertical Scaling is generally hard for traditional architecture so you'll usually only see horizontal scaling described with Elasticity.

## **Fault Tolerance**
***

Your ability for your service to ensure there is no single point of failure. Preventing a chance of failure

**Fail-overs** is when you have a plan to shift traffic to a redundant system in case the primary system fails

A common example is having a copy (secondary) of your database where all ongoing changes are synced. The secondary system is not in-use until a fail over occurs and it becomes the primary database