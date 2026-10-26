---
title: "Cache lines, sets, direct mapping and replacement"
minutes: 18
---

The CPU keeps copies of recently used memory in a small, fast cache. Two questions follow: how many lines and sets a cache has, and which line a block of memory lands in.

## CPUs outrun memory; caches close the gap

Slide 50, *Imbalance Between CPU and Memory*: *Historically, CPU is faster than memories. The capacity of memories are increased, not speed. The slower the memory, the more cycles the CPU will have to wait.*

The *Practical Solution*: *Cache memory (L1, L2, and L3)*. *Main memories and caches are divided up into fixed-size blocks (cache lines) e.g. typically 64 bytes.* The slide's CPU-Z screenshot:

| Cache | Size | Descriptor |
|---|---|---|
| L1 D-Cache | 32 KBytes x 2 | 8-way set associative, 64-byte line size |
| L1 I-Cache | 32 KBytes x 2 | 8-way set associative, 64-byte line size |
| L2 Cache | 256 KBytes x 2 | 4-way set associative, 64-byte line size |
| L3 Cache | 3 MBytes | 12-way set associative, 64-byte line size |

## Lines and sets from a cache's size

Slide 51 asks: *Obtain the number of cache lines and sets for L1D Cache?* The instructor's working:

- *Total L1D = 32KB x 2 = 64 KB*
- *Number of cache lines = 64 KB/64B = 64x1024/64 = 1024*
- *Number of sets = Number of cache lines/8 = 128*

The 8 is the *8-way* in the descriptor. So lines = cache size ÷ line size, and sets = lines ÷ ways. The slide adds both cores' L1D before dividing; one core alone would be 512 lines and 64 sets.

## An address falls in line address ÷ line size

Slide 52: *a 64-byte line size, a reference to memory address 260, what line is pulled into one cash line ?* ("cash" is the slide's spelling.) The figure draws memory as 64-byte lines *0-63*, *64-127*, *128-191*, *192-255*, *256-319*, with 260 pointing into the last one.

$260 / 64 = 4$ remainder 4: the whole line 4, bytes 256 to 319, comes into the cache, and 260 is byte 4 within it. The remainder is the offset; a line of $2^k$ bytes needs k bits of offset, so a 32-byte line ($2^5$) needs 5.

## Direct mapping: CI = MI % (# of cache lines)

Slide 53 names three *Mapping Techniques*: *1. Direct mapping. 2. Associative mapping. 3. Set - Associative mapping.* Only direct mapping is worked. [Not on the slides:] associative lets a block use any line; set-associative fixes the set, not the line.

Slide 54 labels the memory block numbers *Memory Index (MI)* and the cache line numbers *Cache Index (CI)*, with 16 memory blocks and 4 cache lines:

$$CI = MI \;\%\; (\#\text{ of cache lines})$$

*CI = 3 % 4 = 3*, *CI = 10 % 4 = 2*, *CI = 13 % 4 = 1*. Every block has exactly one line it can use.

## The slide's 15 requests on 4 lines

Slide 55 runs the reference string *9 2 3 0 12 12 7 0 6 4 6 1 7 2 14* through a 4-line direct-mapped cache that starts empty. For each request compute CI; if that line already holds the block it is a hit, otherwise a miss and the block replaces what the line held. Write the hit or miss column on paper first.

### One request per step, CI = MI % 4

Predict mode asks hit or miss before each request.

```widget
cache-map-play
{ "requests": "9 2 3 0 12 12 7 0 6 4 6 1 7 2 14", "lines": 4, "address": 260, "lineSize": 64, "predict": true }
```

The slide prints each line's history, the subscript being the request's position (hits in red on the slide, marked H here):

| Line | History on slide 55 |
|---|---|
| [0] | 0₄, 12₅, 12₆ H, 0₈, 4₁₀ |
| [1] | 9₁, 1₁₂ |
| [2] | 2₂, 6₉, 6₁₁ H, 2₁₄, 14₁₅ |
| [3] | 3₃, 7₇, 7₁₃ H |

Result box: *Miss : 12 Hit : 3 Miss rate : 80.000% Hit rate : 20.000%*, that is 12 / 15 and 3 / 15. The last entry in each row is the final contents. Request 8 is the cost of direct mapping: 12 shares line 0 with block 0 and pushed it out at request 5.

## The cache is tiny next to main memory

Slide 56 shows a laptop's CPU-Z: L1 data *4 x 32 KBytes*, L1 instruction *4 x 32 KBytes*, level 2 *4 x 256 KBytes*, level 3 *6 MBytes*, callout *64-byte line Total < 8MB*, against *Total = 16GB* of DDR4. That is 7.25 MB of cache for 16 GB of memory, so the cache must keep choosing what to hold.

## Four caching issues and five replacement algorithms

Slide 57, *Caching system issues*:

- *A. When to put a new item into the cache.*
- *B. Which cache line to put the new item in.*
- *C. Which item to remove from the cache when a slot is needed.*
- *D. Where to put a newly evicted item in the larger memory.*

*There are some algorithms which are used to replace the existing block in the cache memory with the new fetched data.* *Cache Replacement Algorithms*: *1. Least Recently Used (LRU). 2. First In First Out (FIFO). 3. Least Frequently Used (LFU). 4. Random. 5. Clock algorithm.* The slide names them without defining them. Direct mapping needs none of them: CI fixes the line, so the block to evict is whatever that line holds.

## RAM: bits, bytes, words and cells

Slide 58, *RAM*: *Memory is part of computer and contains a number of cells.* *The basic unit of memory is bit {0, 1}.* *1 byte = 8 bits. word = 1, 2, .. Byte*. Its figure, *Three ways of organizing a 96-bit memory*: 12 cells of 8 bits (addresses 0–11), 8 cells of 12 bits (0–7), 6 cells of 16 bits (0–5). Bigger cells, fewer addresses. The slide's table runs from 1 bit per cell (Burroughs B1700) to 60 (CDC Cyber); the IBM PC uses 8.

## Map an address, size an L2 and trace twelve requests on 8 lines

Line numbers count from 0, and every cache starts empty.

```quiz
[
  {
    "q": "With a 64-byte line size, which line number holds memory address 700?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0,
    "explain": "$700 / 64 = 10$ remainder 60. Line 10 covers bytes $10 \\times 64 = 640$ to $640 + 63 = 703$, and 700 is byte 60 of it."
  },
  {
    "q": "How many bits of offset does a 64-byte cache line need?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0,
    "unit": "bits",
    "explain": "$64 = 2^6$, so 6 bits number the bytes 0 to 63 within a line."
  },
  {
    "q": "An 8-way set-associative L2 cache has 2048 lines. How many sets does it have?",
    "type": "numeric",
    "answer": 256,
    "tolerance": 0,
    "unit": "sets",
    "explain": "Sets = lines ÷ ways = 2048 ÷ 8 = 256, as slide 51 divides 1024 lines by 8."
  },
  {
    "q": "A direct-mapped cache has 8 lines. Requests: `5 10 21 10 5 13 7 2 18 7 13 10`. How many hits?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "hits",
    "explain": "CI = MI % 8. 5→5 M, 10→2 M, 21→5 M (evicts 5), 10→2 **H**, 5→5 M (evicts 21), 13→5 M (evicts 5), 7→7 M, 2→2 M (evicts 10), 18→2 M (evicts 2), 7→7 **H**, 13→5 **H**, 10→2 M (evicts 18). 3 hits, 9 misses, hit rate 3/12 = 25 %. Eight lines do not stop 5, 13 and 21 colliding: all three give 5 % 8."
  },
  {
    "q": "Same trace on 8 lines. Fill in the final contents of the lines that are not empty.",
    "type": "fill",
    "code": "Line 2: ___\nLine 5: ___\nLine 7: ___",
    "answer": ["10", "13", "7"],
    "explain": "The last block written into each line stays: line 2 got 10 at request 12, line 5 got 13 at request 6 and hit on it at request 11, line 7 got 7 at request 7. Lines 0, 1, 3, 4 and 6 were never used."
  },
  {
    "q": "Same trace on 8 lines. How many misses?",
    "type": "numeric",
    "answer": 9,
    "tolerance": 0,
    "unit": "misses",
    "explain": "12 requests − 3 hits = 9 misses, a miss rate of 9/12 = 75 %."
  }
]
```

```quiz
[
  {
    "q": "An L2 cache of 512 KB is 16-way set associative with 64-byte lines. How many sets does it have?",
    "type": "numeric",
    "answer": 512,
    "tolerance": 0,
    "unit": "sets",
    "explain": "Lines = 512 × 1024 ÷ 64 = 8192. Sets = 8192 ÷ 16 = 512."
  },
  {
    "q": "A direct-mapped cache has 16 lines. Which line does memory block 45 map to?",
    "type": "numeric",
    "answer": 13,
    "tolerance": 0,
    "explain": "CI = MI % (# of cache lines) = 45 % 16 = 13, since 45 = 2 × 16 + 13."
  },
  {
    "q": "A direct-mapped cache with 4 lines starts empty. Requests: `5 9 5 1 5`. How many hits?",
    "type": "numeric",
    "answer": 0,
    "tolerance": 0,
    "unit": "hits",
    "explain": "5 % 4, 9 % 4 and 1 % 4 are all 1, so every request fights for line 1: 5 M, 9 M (evicts 5), 5 M (evicts 9), 1 M (evicts 5), 5 M (evicts 1). Five misses, no hits, while lines 0, 2 and 3 stay empty."
  },
  {
    "q": "In $CI = MI \\% (\\#\\text{ of cache lines})$, what is MI?",
    "options": ["the memory block's index", "the cache line's index", "the line size in bytes", "the number of sets"],
    "answer": 0,
    "explain": "Slide 54 labels the memory block numbers Memory Index (MI) and the cache line numbers Cache Index (CI). The formula maps a memory block to its one cache line."
  },
  {
    "q": "Put the four caching system issues of slide 57 in the slide's order, A to D.",
    "type": "reorder",
    "lines": [
      "When to put a new item into the cache.",
      "Which cache line to put the new item in.",
      "Which item to remove from the cache when a slot is needed.",
      "Where to put a newly evicted item in the larger memory."
    ],
    "explain": "A when to bring it in, B where in the cache, C what to throw out, D where the evicted item goes in the larger memory. The replacement algorithms answer C."
  },
  {
    "q": "Which of these is not one of the cache replacement algorithms on slide 57?",
    "options": ["Direct mapping", "Least Recently Used (LRU)", "Least Frequently Used (LFU)", "Clock algorithm"],
    "answer": 0,
    "explain": "The five are LRU, FIFO, LFU, Random and the Clock algorithm. Direct mapping is a mapping technique (slide 53), with associative and set-associative mapping."
  },
  {
    "q": "Historically, the speed of memories has increased while their capacity has stayed the same.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 50 says the reverse: the capacity of memories are increased, not speed. That is why the CPU waits on memory and why caches exist."
  },
  {
    "q": "Main memories and caches are divided up into fixed-size blocks called cache lines, typically 64 bytes.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 50, word for word. Every CPU-Z descriptor on slides 50 and 56 says 64-byte line size."
  },
  {
    "q": "In a direct-mapped cache, which caching issue does the formula $CI = MI \\% (\\#\\text{ of cache lines})$ settle on its own?",
    "options": [
      "Which cache line to put the new item in",
      "When to put a new item into the cache",
      "Where to put a newly evicted item in the larger memory",
      "How many sets the cache has"
    ],
    "answer": 0,
    "explain": "Issue B. The formula gives each block exactly one line, so it also fixes which item leaves (the one already in that line) and no replacement algorithm is needed."
  },
  {
    "q": "A 96-bit memory is organized in cells of 24 bits. How many addresses does it have?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "addresses",
    "explain": "96 ÷ 24 = 4 cells, addresses 0 to 3. Slide 58 shows the same 96 bits as 12 × 8, 8 × 12 and 6 × 16."
  }
]
```
