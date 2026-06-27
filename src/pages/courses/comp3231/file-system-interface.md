---
layout: ../../../layouts/Layout.astro
title: COMP3231 - File System Interface
---

## **File Systems**
***

Why do they need to exist? Processes need to store information that:
1. Can hold large amounts of data
2. Survives after the process terminates, and
3. Can be accessed by multiple processes at once.

## **User's View**
***

A file is an abstraction, a mechanism for storing information on disk and reading it back without the user worrying about how/where it's physically stored.

### **File Names**
***

File system must provide a convenient naming scheme
* Textual names
* May have restrictions that vary by OS
    * Only certain characters
    * Limited length
    * Only certain format (DOS, 8 + 3)
* Case sensitivity

### **File Structure**
***
There are three common models
1. Unstructured byte sequence (UNIX, Windows, most modern OSes)
2. A sequence of fixed-length records
3. Tree of records keyed by a field

<img src="/assets/images/comp3231/file-structure-types.png" alt="" width="100%" style="display:block;margin:1rem auto;"/>

### **File Types**
***

Many operating systems support several types of files
1. Regular files: Contain user information, generally either ASCII files or binary files
2. Directories: System files for maintaining structure of a file system
3. Special files: Character / block devices

### **File Access**
***

* Sequential access
    * read all bytes/records from the beginning
    * cannot jump around, could rewind or back up
    *  convenient when medium was magnetic tape rather than disk
* Random access
    * bytes/records read in any order
    * essential for database systems

### **Attributes**
***

Metadata beyond name and data
| Attribute | Meaning |
|---|---|
| Protection | Who can access the file and in what way |
| Password | Password needed to access the file |
| Creator | ID of the person who created the file |
| Owner | Current owner |
| Read-only flag | 0 for read/write; 1 for read only |
| Hidden flag | 0 for normal; 1 for do not display in listings |
| System flag | 0 for normal files; 1 for system file |
| Archive flag | 0 for has been backed up; 1 for needs to be backed up |
| ASCII/binary flag | 0 for ASCII file; 1 for binary file |
| Random access flag | 0 for sequential access only; 1 for random access |
| Temporary flag | 0 for normal; 1 for delete file on process exit |
| Lock flags | 0 for unlocked; nonzero for locked |
| Record length | Number of bytes in a record |
| Key position | Offset of the key within each record |
| Key length | Number of bytes in the key field |
| Creation time | Date and time the file was created |
| Time of last access | Date and time the file was last accessed |
| Time of last change | Date and time the file has last changed |
| Current size | Number of bytes in the file |
| Maximum size | Number of bytes the file may grow to |

### **File Operations**
***
Different systems provide different operations to allow storage and retrieval. Here are some typical file operations:
1. Create
2. Delete
3. Open
4. Close
5. Read
6. Write
7. Append
8. Seek
9. Get attributes
10. Set attributes
11. Rename

## **Directories**
***

To keep track of files, file systems normally have **directories** or **folders**, which are themselves files.

They provide mapping between file names and the files themselves, and contain information about files (attributes, location, ownership)

### **Hierarchical (Tree-Structured) Directory**
***

Files can be located by following a path from the root, or master, directory down various branches
* This is the *absolute* pathname for the file

We can have several files with the same file name as long as they have unique path names

<img src="/assets/images/comp3231/hierarchy-directory.png" alt="" width="80%" style="display:block;margin:1rem auto;"/>

### **Current Working Directory**
***

The problem: typing the full absolute path (starting from root /) every time is tedious

Solution: Introduce the idea of a working directory
* files are referenced relative to the working directory

Example: cwd = /home/tsewell

.profile = /home/tsewell/.profile

### **Relative and Absolute Pathnames**
***

**Absolute path names:**
* A path from the root of the system to the file.
* e.g. /home/tsewell/work/os_3231/lectures/26t2/w04b-files.pdf

**Relative path names:**
* A path from the current working directory.
* Note that (in UNIX) ‘.’ and ‘..’ refer to current and parent dir.
* e.g. suppose cwd = /home/tsewell
* ../../etc/passwd = /etc/passwd
* ../kevine = /home/kevine
* ./work/os_3231/lectures = /home/tsewell/work/os_3231/lectures

### **Directory Operations**
***

Here are some typical directory operations:
1. Create
2. Delete
3. Opendir
4. Closedir
5. Readdir
6. Rename
7. Link
8. Unlink

## **File Sharing**
***

In multiuser system, allow files to be shared among users. Two issues emerge:
1. Access rights
2. Management of simultaneous access

### **Access Rights**
***

None
* User may not know of the existence of the file
* User is not allowed to read the directory that includes the file
Knowledge
* User can only determine that the file exists and who its owner is

### **Access Rights**
***

Execution
* The user can load and execute a program but cannot copy it
Reading
* The user can read the file for any purpose, including copying and execution
Appending
* The user can add data to the file but cannot modify or delete any of the file’s contents
Updating
* The user can modify, delete, and add to the file’s data. This includes creating the file, rewriting it, and removing all or part of the data
Changing protection
* The user can change the access rights granted to other users
Deletion
* The user can delete the file
Owners
* The owner user has all rights previously listed
* They may grant rights to others using the following classes of users:
    * Specific users
    * User groups
    * All users
        * For public files

### **Simultaneous Access**
***

Most OSes provide mechanisms for users to manage concurrent access to files. Example: flock(), lockf(), system calls.

Typically
* User may lock entire file when it is to be updated
* User may lock individual records (i.e. ranges) during an update

**Mutual exclusion** and **deadlock** are issues for shared access