---
layout: ../../../layouts/Layout.astro
title: COMP3231 - Buffering, Caching, and Consistency
---

## **Buffer**
***

A buffer is temporary storage used when moving data between two entities, especially when those entities operate at different speeds or use incompatible transfer units. 

The classic example is between an application and a disk: applications want to read/write arbitrarily sized chunks of a file, but disks only transfer in fixed-size blocks. The kernel buffer sits in the middle, letting the application work with arbitrary byte ranges while the disk side deals in whole blocks.

This buffering gives a few practical benefits:
* Write-back: when an application writes data, the kernel can copy it into the buffer and return immediately, rather than making the application wait for the actual disk write to finish. The real write to disk happens later, in the background.
* Read-ahead: the kernel can guess that the next block on disk will be needed soon and pre-load it into a buffer before the application even asks for it, hiding disk latency.

## **Cache**
***

A cache is fast storage that holds data temporarily to speed up repeated access to that data.

The example here being main memory caching disk blocks. When the application wants a block, the kernel checks whether it's already sitting in memory before going to disk at all. If it's there, the disk access is avoided entirely.

## **Relation of Buffering and Caching**
***

Data is read into buffer; an extra independent cache copy would be wasteful

After use, block should be cached

Future access may hit cached copy

Cache utilises unused kernel memory space
* may have to shrink, depending on memory demand

## **Unix Buffer Cache**
***

On read
1. Compute hash from (device#, block#) -> identifies which bucket to check
2. Look up that bucket in the hash table
3. Hit: block found in bucket -> use in-memory copy directly (no disk access)
4. Miss in bucket: walk the collision chain (linked list of blocks hashing to same bucket), comparing device#/block# of each entry
5. Still not found -> true cache miss -> read block from disk into a buffer cache slot, then add it to the hash table for future lookups

## **Replacement**
***

Since the cache is finite, when it's full and a new block needs to come in, the kernel must evict something.

Options include FIFO (First in first out) or LRU (least recently used), with LRU needing timestamps to track usage.

## **File System Consistency**
***

A frequently read-and-written file is always "recently used," so a naive LRU cache would never evict it (and will never be written to disk) but the data still needs to actually reach disk eventually so it survives a crash.

Two strategies:

1. Priority-based writeback: cached blocks are prioritized by how critical they are to filesystem integrity. Directory and inode blocks, if lost, can corrupt the whole filesystem (imagine losing the root directory), so these are written to disk immediately. Ordinary data blocks only corrupt the one file they belong to if lost, so they're written back periodically rather than immediately.

2. Write-through caching: every modified block is written to disk immediately, full stop. This is much safer against crashes or sudden removal but generates far more disk traffic, since temporary files get written out and multiple quick updates to the same block aren't combined into one write. This was DOS's approach, well-suited to an era of floppy disks being yanked out mid-session, and it's still used today for things like USB storage devices.


