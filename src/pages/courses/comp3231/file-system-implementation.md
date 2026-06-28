---
layout: ../../../layouts/Layout.astro
title: COMP3231 - File System Implementation
---

## **Implementing a File System**
***

The FS must map symbolic file names into a collection of block addresses

The FS must keep track of
* which blocks belong to which files
* in what order the blocks form the file
* which blocks are free for allocation

Given a logical region of a file, the FS must track the corresponding block(s) on disk.
* Stored in the file system metadata

## **File Allocation Methods**
***

A file is divided into “blocks”, the the unit of transfer to storage

### **Contiguous Allocation**
***

Pros:
* Easy **bookkeeping** (need to keep track of the starting block and length of the file)
* Increases **performance** for sequential operations because the entire file can be read from the disk in a single operation. Only one seek is needed (to the first block)

Cons:
* Over time, the disk becomes fragmented. When a file is removed, its blocks are freed, leaving a run of free blocks in the disk. As a result, the disk **ultimately consists of files and holes**.
* It is possible to reuse the fragmented space by maintaining a list of holes. However, when a new file is to be created, it is necessary to know its **final size** in order to choose a hole of the correct size to place it in

<img src="/assets/images/comp3231/contig-allocation-holes.png" alt="" width="100%" style="display:block;margin:1rem auto;"/>

There is one situation in which contiguous allocation is feasible and still used: on **CD-ROMs**. All the file sizes are known in advance and will never change during subsequent use of the CD-ROM file system.

### **Dynamic Allocation**
***

Disk space allocated in portions as needed

Allocation occurs in fixed-size blocks

Pros:
* No external fragmentation
* Does not require pre-allocating disk space

Cons:
* File blocks are scattered across the disk
* Complex metadata management (maintain the collection of blocks for each file)

#### **External and Internal fragmentation**
***

External fragmentation:
* The space wasted is outside of the allocated memory regions
* Memory space exists to satisfy a request but it is unusable as it is not contiguous (no single gap is big enough)

Internal fragmentation:
* The space wasted is inside of the allocated memory regions. 
* Because memory is handed out in fixed-size units, an allocation is rounded up to be slightly larger than what was requested. The leftover space inside that block is wasted and can't be used by anyone else.

#### **Linked-List Allocation**
***

The first coupled of bytes of each block is used as a pointer to the next one. The rest of the block is for data.

Free blocks are also linked in a chain.

Pros:
* Only single metadata entry per file
* Best for sequential files

Cons:
* Poor for random access
* Blocks end up scattered across the disk due to free list eventually being randomised

#### **File Allocation Table (FAT)**
***

Both disadvantages of the linked-list allocation can be eliminated by taking the pointer word from each disk block and putting it in a table in memory. 
* A table entry contains the number of the next block of the file
* The last block in a file and empty blocks are marked using reserved values

<img src="/assets/images/comp3231/fat-table.png" alt="" width="70%" style="display:block;margin:1rem auto;"/>

The primary disadvantage of this method is that the entire table must be in memory all the time to make it work.
* Requires a lot of memory for large disks
* 200GB = 200 * 10^6 * 1K-blocks => 200 * 20^6 FAT entries = 800MB

**FAT Disk layout:**

On disk the structure is: reserved area -> FAT1 -> FAT2 -> data blocks. The two copies of FAT (FAT1 and FAT2) sit permanently on disk for redundancy. If one gets corrupted, the other is the backup.

At boot time, the OS reads FAT from disk and loads it into RAM, where it stays for the entire session so block chain lookups are fast.

FAT is still used because it's simple and universally understood. Used for USB drives and SD cards that need to work across different machines.

FAT12, FAT16, FAT32: The number refers to how many bits each entry in the table uses; 12, 16, or 32 bits. More bits means you can address more blocks, meaning the system can support larger disks.

#### **Inode-based FS Structure**
***

An i-node (index-node) is a small data structure that belongs to one specific file. It contains two things:
* The file's attributes (owner, size, timestamps, permissions etc.)
* The disk block addresses of where that file's actual data lives on disk

The i-node need to be in memory only when the corresponding file is open. 

<img src="/assets/images/comp3231/inode.png" alt="" width="70%" style="display:block;margin:1rem auto;"/>
A special inode entry (e.g. the last one) is reserved for a pointer to an extension inode for large files that need more block addresses that can fit in one inode.

Inodes sit in a dedicated region of the disk, separate from the data blocks.

<img src="/assets/images/comp3231/inode-disk.png" alt="" width="70%" style="display:block;margin:1rem auto;"/>

Inodes are allocated dynamically, hence free-space management is required for inodes
* Use fixed-size inodes to simplify dynamic allocation

##### **Free-space management**

Approach 1: linked list of free blocks in free blocks on disk

Approach 2: keep bitmaps of free blocks and free i-nodes on disk

<img src="/assets/images/comp3231/inode-free-space-manage.png" alt="" width="100%" style="display:block;margin:1rem auto;"/>

**Free block list**

* List of all unallocated blocks
* Background jobs can re-order list for better contiguity
* Store in free blocks themselves
    * Does not reduce disk capacity
* Only one block of pointers need be kept in the main memory

**Bit tables**

* Individual bits in a bit vector flags used/free blocks
* 16GB disk with 512-byte blocks --> 4MB table
* May be too large to hold in main memory
* Expensive to search
    * Optimisations possible, e.g. a two level table
* Concentrating (de)allocations in a portion of the bitmap has desirable effect of concentrating access
* Simple to find contiguous free space

## **Implementing Directories**
***

Directories are stored like normal files
* directory entries are contained inside data blocks

The FS assigns special meaning to the content of these files
* a directory file is a list of directory entries
* a directory entry contains file name, (optionally) attributes, and the file i-node number
    * maps human-oriented file name to a system-oriented name

### **Directory Entry Sizes**
***

Fixed-size directory entries
* Either too small
    * Example: DOS 8+3 characters
* Or waste too much space
    * Example: 255 characters per file name

Variable-size directory entries
* Freeing variable length entries can create external fragmentation in directory blocks
    * Can compact when block is in RAM
* Must manage fragmentation problems inside directories

### **Searching Directory Listings**
***

Locating a file in a directory
* Linear scan
    * Implement a directory cache in software to speed-up search
* Hash lookup
* B-tree (100's of thousands entries)

### **Storing file attributes**
***

<img src="/assets/images/comp3231/directory-file-attributes.png" alt="" width="100%" style="display:block;margin:1rem auto;"/>

a. disk addresses and attributes in directory entry -> FAT

b. directory in which each entry just refers to an i-node -> UNIX

## **Trade-off in FS block size**
***

File systems deal with 2 types of blocks
* Disk blocks or sectors (usually 512 bytes)
* File system blocks 512 * 2^N bytes
* What is the optimal N?

Larger blocks require less FS metadata

Smaller blocks waste less disk space (less internal fragmentation)

Sequential Access
* The larger the block size, the fewer I/O operations required

Random Access
* The larger the block size, the more unrelated data loaded.
* Nearby data access softens the random access problem

Choosing an appropriate block size is a compromise