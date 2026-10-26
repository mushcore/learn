---
title: link, hard and symbolic links, mount
minutes: 16
---

A file can have two names, and a disk's files can appear inside another disk's tree. `link` gives a file a second name; `mount` grafts one file system onto another.

## link adds a directory entry with the same i-number

The directory table (slide 40) has `s = link(name1, name2)`, *Create a new entry, name2, pointing to name1*, and its opposite `s = unlink(name)`, *Remove a directory entry*. Both return `s`, −1 on error.

Slide 42 runs one call:

```c
link("/usr/jim/memo", "/usr/ast/note");
```

A UNIX directory is a list of entries, each an **i-number** and a name. The i-number identifies the file itself; the name is only a label in one directory. *(a) Two directories before linking usr/jim/memo to ast's directory.*

| /usr/ast | /usr/jim |
|---|---|
| 16 mail | 31 bin |
| 81 games | 70 memo |
| 40 test | 59 f.c. |
| | 38 prog1 |

Decide which directory changes, what name the new entry has, and which i-number it carries, before you read on.

*(b) The same directories after linking.*

| /usr/ast | /usr/jim |
|---|---|
| 16 mail | 31 bin |
| 81 games | 70 memo |
| 40 test | 59 f.c. |
| **70 note** | 38 prog1 |

`/usr/ast` gains `note` with i-number **70**, the same as `memo`. No data was copied: two names, one file. A change made through `note` is seen through `memo`.

## A hard link shares the inode; the link count goes up

Slides 43–46 repeat the idea on a real system with three names: `my_file`, a hard link `my_file_h_link`, and a symbolic link `my_file_s_link`. Slide 43's `stat` output (first lines of each file):

```text
  File: my_file
  Size: 29              Blocks: 1          IO Block: 65536  regular file
Device: 20318e08h/540118536d    Inode: 20829148276976248  Links: 2

  File: my_file_h_link
  Size: 29              Blocks: 1          IO Block: 65536  regular file
Device: 20318e08h/540118536d    Inode: 20829148276976248  Links: 2
```

The red note on `Links: 2` reads *# of links to the main file*. The hard link is a second directory entry like `note`: same inode number, same size 29, same type, and it raises the **link count** of the one file to 2.

## A symbolic link is a separate small file holding a name

Slide 44, the third name:

```text
  File: my_file_s_link -> my_file
  Size: 7               Blocks: 0          IO Block: 65536  symbolic link
Device: 20318e08h/540118536d    Inode: 6192449488013181  Links: 1
Access: (0777/lrwxrwxrwx)  Uid: (2739586/A0)          Gid: (1049089/AD+Group(513))
```

Everything differs from the hard link: its own inode, type *symbolic link*, `Links: 1`, mode `lrwxrwxrwx`, and size 7, which is the length of the text it stores, the name `my_file` (seven characters). It does not add to `my_file`'s count, which stays 2.

Slide 45 draws the difference: `my_file` and `my_file_h_link` each have an arrow straight to the data on disk; `my_file_s_link` has an arrow to the name `my_file`, not to the data.

## Deleting the original

Slide 46 deletes `my_file`. Predict the hard link's `Links:` value and what `cat` prints for each link, then read the terminal.

```text
  File: my_file_h_link
  Size: 29              Blocks: 1          IO Block: 65536  regular file
Device: 20318e08h/540118536d    Inode: 20829148276976248  Links: 1

  File: my_file_s_link -> my_file
  Size: 7               Blocks: 0          IO Block: 65536  symbolic link
Device: 20318e08h/540118536d    Inode: 6192449488013181  Links: 1
OS:>> cat my_file_h_link
Link test
I added  second line.
OS:>> cat my_file_s_link
cat: my_file_s_link: No such file or directory
```

- Deleting a name is `unlink`: one directory entry goes, and the count drops from 2 to 1. The data is still reachable through `my_file_h_link`, so it still reads.
- `my_file_s_link` still holds the text `my_file`, but that name no longer exists. The link **dangles**: *No such file or directory*.

Not on the slides (standard UNIX behaviour): the file's data is freed only when its link count reaches 0.

### The two directories, a hard link, a symbolic link, and a delete

Make each kind of link, watch the i-numbers and the count, then delete the original.

```widget
file-links
{ "scene": "slide" }
```

## mount merges two file systems into one

Slide 47: *the mount system call allows two file systems to be merged into one. A common situation is to have the root file system, containing the binary (executable) versions of the common commands and other heavily used files, on a hard disk (sub)partition and user files on another (sub)partition. Further, the user can then insert a USB disk with files to be read.*

| | Root's children | What hangs below |
|---|---|---|
| (a) *File system before the mount.* | bin, dev, lib, mnt, usr | nothing; all five are leaves |
| (b) *File system after the mount.* | bin, dev, lib, (mnt), usr | the mounted file system: five directories, each with its own subtree, under mnt's position |

Figure (b) draws the mount point without its label. The calls are `s = mount(special, name, flag)` and `s = umount(special)` (slide 40). Part 1 (slide 84) adds the rule: *File systems are nearly always mounted on empty directories.* See [Part 1's files and mount](#/comp4736-p1/os-zoo-processes-files).

## Count the links on a new pair of directories

`/home/kim/report` has i-number 52 and `Links: 1`. The commands run in order.

```quiz
[
  {
    "q": "`link(\"/home/kim/report\", \"/home/lee/copy\");` succeeds. What i-number does `/home/lee/copy` have?",
    "type": "numeric",
    "answer": 52,
    "tolerance": 0,
    "explain": "`link` adds a directory entry pointing at the same file, so `copy` carries i-number 52, as `note` carried memo's 70."
  },
  {
    "q": "What is the link count of the file now?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "explain": "One entry before (`report`), plus `copy`: 1 + 1 = 2, like `Links: 2` for `my_file` with one hard link."
  },
  {
    "q": "In `/home/kim`, `ln -s report report_s` makes a symbolic link. What is the file's link count after this?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "explain": "A symbolic link is a separate file with its own inode; it points at the name, not the inode, so the count stays 2."
  },
  {
    "q": "What size does `stat` report for `report_s`?",
    "type": "numeric",
    "answer": 6,
    "unit": "bytes",
    "tolerance": 0,
    "explain": "A symbolic link stores the name it points to: `report` is r-e-p-o-r-t, 6 characters, as `my_file_s_link` had size 7 for `my_file`."
  },
  {
    "q": "`/home/kim/report` is then deleted. What does `cat` do for each remaining name?",
    "options": [
      "copy prints the contents; report_s gives No such file or directory",
      "copy gives No such file or directory; report_s prints the contents",
      "both print the contents",
      "both give No such file or directory"
    ],
    "answer": 0,
    "explain": "Deleting removes one entry: the count goes 2 → 1 and `copy` still reaches the data. `report_s` holds the name `report`, which is gone, so it dangles."
  }
]
```

```quiz
[
  {
    "q": "A hard link gets a new i-number of its own.",
    "type": "tf",
    "answer": false,
    "explain": "A hard link is another directory entry with the same i-number: `note` got memo's 70, and `my_file_h_link` shows the same inode as `my_file`. The symbolic link is the one with its own inode."
  },
  {
    "q": "After `link(\"/usr/jim/memo\", \"/usr/ast/note\")`, which entry appears in /usr/ast?",
    "options": ["70 note", "70 memo", "38 note", "16 note"],
    "answer": 0,
    "explain": "The new name `note` goes into `/usr/ast` with memo's i-number, 70. `/usr/jim` is unchanged."
  },
  {
    "q": "What does the POSIX table say `link(name1, name2)` does?",
    "options": [
      "Create a new entry, name2, pointing to name1",
      "Remove a directory entry",
      "Copy name1's data into a new file name2",
      "Mount a file system"
    ],
    "answer": 0,
    "explain": "`s = link(name1, name2)`: create a new entry, name2, pointing to name1. Removing an entry is `unlink`; mounting is `mount`. Nothing is copied."
  },
  {
    "q": "`my_file` is deleted. What happens to its two links?",
    "options": [
      "The hard link still reads the data; the symbolic link gives No such file or directory",
      "Both links still read the data",
      "Both links are deleted with it",
      "The symbolic link still reads the data; the hard link dangles"
    ],
    "answer": 0,
    "explain": "The hard link points at the data (its count drops 2 → 1), so `cat my_file_h_link` prints `Link test` and the second line. The symbolic link points at the name `my_file`, which no longer exists."
  },
  {
    "q": "What was the hard link's `Links:` value after `my_file` was deleted?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "explain": "Two names (my_file, my_file_h_link) gave `Links: 2`; deleting one leaves 2 − 1 = 1. The symbolic link never counted."
  },
  {
    "q": "Why does `stat` report Size 7 for `my_file_s_link`?",
    "options": [
      "It stores the name my_file, seven characters",
      "It shares my_file's data, which is 7 blocks",
      "Every symbolic link is 7 bytes",
      "It holds a copy of the first 7 bytes of my_file"
    ],
    "answer": 0,
    "explain": "A symbolic link is a small file whose contents are the path it points to: `my_file` is 7 characters, with 0 blocks of data. `my_file` itself is 29 bytes."
  },
  {
    "q": "Name the number stored beside each file name in a UNIX directory entry.",
    "type": "text",
    "answer": ["i-number", "inumber", "i number", "inode number", "inode"],
    "explain": "Each entry is an i-number and a name (16 mail, 70 memo). Two names with the same i-number are the same file."
  },
  {
    "q": "The mount system call allows two file systems to be merged into one.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 47's wording. In the figure the mounted file system's tree hangs under mnt's position in the root file system."
  },
  {
    "q": "File systems are nearly always mounted on non-empty directories.",
    "type": "tf",
    "answer": false,
    "explain": "Part 1, slide 84: file systems are nearly always mounted on **empty** directories. The mounted tree takes the directory's place."
  }
]
```
