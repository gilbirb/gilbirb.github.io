---
layout: /src/layouts/Layout.astro
title: AWS CCP - Cloud Concepts
---

## **Amazon Web Services**
***

Amazon calls their cloud provider service **Amazon Web Services**. Commonly referred to just **AWS**.

## **Cloud Service Provider**
***

A Cloud Service Provider (CSP) is a company which
* Provides multiple Cloud Services e.g. tens to hundreds of services
* those Cloud Services:
    * **can be chained together** to create cloud architectures
    * are accessible **via Single Unified API** e.g. AWS API
    * utilized **metered billing** based on usage e.g. per second, hour
    * have rich monitoring built in e.g. AWS CloudTrail
    * have an Infrastructure as a Service (IaaS) offering
    * offers **automation** via Infrastructure as Code (IaC)

## **Landscape of CSPs**
***

**Tier 1 (Top Tier)**
* Early to market, wide offering, strong synergies between services, well recognized in the industry
* AWS, Microsoft Azure, Google Cloud Platform (GCP), Alibaba Cloud

**Tier 2 (Mid Tier)**
* Backed by well-known tech companies, slow to innovate and turned to specialization
* IBM Cloud, Oracle Cloud, Huawei Cloud, Tencent Cloud

**Tier 3 (Light Tier)**
* Virtual Private Servers (VPS) turned to offer core IaaS offering. Simple, cost effective
* Vultr, Digital Ocean, Akamai Connected Cloud (Linode)

**Tier 4 (Private Tier)**
* Infrastructure as Service software deployed to run in an organization's own private data center
* OpenStack (RackSpace), Apache CloudStack, *Vmware vSphere

## **Common Cloud Services**
***

* **Compute**: 
    * Imagine having a virtual computer that can run application, programs, and code.
    * EC2 Virtual Machines
* **Networking**: 
    * Imagine having a virtual network defining internet connections or network isolations between services or outbound to the internet
    * VPC Private Cloud Network
* **Storage**: 
    * Imagine having a virtual hard-drive that can store files
    * EBS Virtual Hard Drives
* **Databases**: 
    * Imagine a virtual database for storing reporting data or a database for general purpose web-application
    * RDS SQL Databases

Categories outside the 4 core:
* Analytics
* Application Integration
* AR & VR
* AWS Cost Management
* Blockchain
* Business Applications
* Containers
* Customer Engagement
* Developer Tools
* End User Computing
* Game Tech
* Internet of Things
* Machine Learning
* Management & Governance
* Media Services
* Migration & Transfer
* Mobile
* Quantum Technologies
* Robotics
* Satellites
* Security, Identity & Compliance

## **Evolution of Computing**
***

**Dedicated**
* A physical server wholly utilized by a single customer.
* You have to guess your capacity
* You'll overpay for an underutilized server
* You can't vertical scale, need manual migration
* Replacing a server is very difficult
* You are limited by your Host Operating System
* Multiple apps can result in conflicts in resource sharing
* You have a *guarantee of security, privacy, and full utility of underlying resources

**Virtual Machines**
* You can run multiple Virtual Machines on one machine
* *Hypervisor* is the software layer that lets you run the VMs
* A physical server shared by multiple customers
* You are to pay for a fraction of the server
* You'll overpay for an underutilized Virtual Machine
* You are limited by your Guest Operating System
* Multiple apps on a single Virtual Machine can result in conflicts in resource sharing.
* Easy to export or import images for migration
* Easy to Vertical or Horizontally scale.

**Containers**
* Virtual Machine running multiple containers
* **Docker Daemon** is the name of the software layer that lets you run mutliple containers.
* You can maximize the utilization of the available capacity which is more cost effective.
* Your containers share the same underlying OS so containers are more efficient than multiple VMs
* Multiple apps can run side by side without being limited to the same OS requirement and will not cause conflicts during resource sharing

**Functions**
* Are managed VMs running managed containers
* Known as **Serverless Compute**
* You upload a piece of code, choose the amount of memory and duration
* Only responsible for code and data, nothing else
* Very cost-effective, only pay for the time code is running, VMs only run when there is code to be executed
* Cold start is a side-effect of this setup

## **Types of Cloud Computing**
***

**Software As a Service (SaaS)**
* A product that is run and managed by the service provider.
* *Dont worry about how the service is maintained. It works and remains available.*
* For customers

**Platform as a Service (Paas)**
* Focus on the deployment and management of your apps.
* *Don't worry about provisioning, configuring, or understanding the hardware or OS*
* For developers

**Infrastructure as a Service (IaaS)**
* The basic building blocks for cloud IT. Provides access to networking features, computers and data storage space.
* *Don't worry about IT staff, data centers, and hardware*
* or admins

## **Deployment Models**
***

**Public Cloud**
* Everything (the workload or the project) is built on the CSP.
* Also known as: Cloud-Native or Cloud First
* Companies that are starting out today, or are small enough to make the leap from a VPS to a CSP: Startups, SaaS offerings, new projects and companies

**Private Cloud**
* Everything built on company's datacenters
* Also known as **On-Premise**
* The cloud could be OpenStack
* Organizations that cannot run on cloud due to struct regulatory compliance or the sheer size of their organization: Public Sector eg government, super sensitive data eg. hospitals, Large enterprise with heavy regulation eg. insurance companies 

**Hybrid**
* Using both **On-Premise** and A **Cloud Service Provider**
* Organizations that started with their own datacenter, can't fully move to cloud due to effort of migration or security compliance: Banks, FinTech, Investment Management, Large proffessional service providers, Legacy on-premise

**Cross-Cloud**
* Using Multiple Cloud Providers aka multi-cloud.
* Example: Azure Arc, Google's Anthos

