---
layout: ../../../layouts/Layout.astro
title: COMP3231 - Virtual File Systems
---

## **Virtual File System**
***

<img src="/assets/images/comp3231/vfs.png" alt="" width="40%" style="display:block;margin:1rem auto;"/>


Provides single system call interface for many file systems
* E.g., UFS, Ext2, XFS, DOS, ISO9660,…

Transparent handling of network file systems
* E.g., NFS, AFS, CODA

File-based interface to arbitrary device drivers (/dev)

File-based interface to kernel data structures (/proc)

Provides an indirection layer for system calls
* File operation table set up at file open time
* Points to actual handling code for particular type
* Further file operations redirected to those functions

The file system independent code deals with vfs and vnodes

## **VFS Interface**
***

Two major data types
* VFS struct / superblock
    * Represents all file system types
    * Contains pointers to functions to manipulate each file system as a whole (e.g mount, unmount)
        * Form a standard interface to the file system
* Vnode
    * Represents a file (inode) in the underlying filesystem
    * Points to an in-memory copy of real inode
    * Contains pointers to functions to manipulate files/inodes (e.g. open, close, read, write,…)

## **Object Oriented**
***

The vfs/vnode types are like OO classes or interfaces

The particular file system implements sub-classes

Each vfs/vnode object contains
* Generic data (superclass data)
* FS-specific data (subclass data)
* Function pointers to FS code (subclass methods)

Example:
```
VFS struct  ≈  abstract base class for "a file system"
Vnode       ≈  abstract base class for "a file"

ext4_super  ≈  class ext4FS extends FileSystem
ext4_inode  ≈  class ext4File extends File

nfs_super   ≈  class NFS extends FileSystem
nfs_inode   ≈  class NFSFile extends File
```

## **File Descriptors**
***

In UNIX, each open file has a file descriptor

State associated with a file descriptor
* File pointer (offset): Determines where in the file the next read or write is performed
* Mode: Was the file opened read-only, etc…. 