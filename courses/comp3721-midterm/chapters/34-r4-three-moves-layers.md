---
title: "Review 4a: the three-move written answer, and the layers"
minutes: 25
---
This lesson teaches how a short written answer earns its marks, then the five layers of the Internet's protocol stack. It prepares you for the question shapes "What is the responsibility of the … layer?" and "Why are protocols organised in layers?".

## What a written answer is marked for, in plain words

A marker reads a written answer against a short list of points. Each point is a term the slide uses, or a fact the slide states.

So the answer that earns marks has three moves, always in the same order. First you name the thing in the slide's words.

Then you give the reason, or the difference between the two things asked about. Last you give one example or one number.

```diagram
{ "type": "flow", "title": "Every written response in three moves", "nodes": [
  { "id": "n", "label": "1. Name it", "sub": "the slide's term" },
  { "id": "r", "label": "2. Reason or difference", "sub": "why, or what changes" },
  { "id": "e", "label": "3. Example or number", "sub": "a device, a scheme, a value" }
], "edges": [ { "from": "n", "to": "r" }, { "from": "r", "to": "e" } ], "hi": ["n"], "caption": "Move 1 earns most marks: a correct idea in your own words can miss the term the marker is looking for." }
```

Two to four sentences are enough. A page of prose earns no more than the three moves do.

In the models below, the words in italics are the slide's own words. Those are the words to copy.

## A tiny case you can do in your head

The question is "What is a protocol?".

Move 1 names it: a protocol is *a set of rules that govern data communications*.

Move 2 gives the reason it exists. It *represents an agreement between the communicating devices* on *what* is communicated, *how* and *when*.

Move 3 gives an example. HTTP is the protocol a browser and a web server agree on.

That is **three sentences for three points**. Each sentence carries exactly one thing the marker is looking for.

## The sample quiz's two written questions, worked

The instructor's Sample Quiz Questions sheet shows two written questions. Here is each one done in three moves.

**Q5. List two disadvantages of star topology.**

Move 1: in a *star*, *each device has a dedicated point-to-point link only to a central controller, usually called a hub*.

Move 2: the first disadvantage is the *dependency of the whole topology on one single point*. The second is *more cabling than bus and ring*.

Move 3: if the hub fails, every device is cut off. A star of n devices needs n cables, so 12 devices need 12 cables to the hub.

**Q6. What is the responsibility of the data-link layer in the TCP/IP protocol suite?**

Move 1: *data transfer between neighbouring network elements*, node to node, *without errors*.

Move 2: its packet is a *frame*, and it runs again at every hop. It offers *framing*, *flow control*, *error control* and *congestion control*.

Move 3: Ethernet and 802.11, which is WiFi, are data-link protocols.

Do not write "transforms bits into signals" for the data link. That job belongs to the physical layer, and the sample quiz's true-or-false item uses exactly that swap.

## What a layer is, in plain words

Sending a message across the Internet is one big job. Layering cuts it into five smaller jobs, stacked one on top of the other.

Each layer does its own job and trusts the layer below it to do the next one. The slide calls what a layer offers upward its *service model*.

Think of mailing a letter. You write the letter, the mailroom puts it in an envelope with an address, and the truck only cares about the next stop.

Each layer wraps what it received from above in its own header. That wrapping is called *encapsulation*, and the receiver unwraps the layers in reverse order.

```diagram
{ "type": "flow", "dir": "tb", "title": "Encapsulation at the source, one header per layer", "nodes": [
  { "id": "m", "label": "M", "sub": "application: message" },
  { "id": "t", "label": "H_T M", "sub": "transport: segment" },
  { "id": "nw", "label": "H_N H_T M", "sub": "network: datagram" },
  { "id": "l", "label": "H_L H_N H_T M", "sub": "data link: frame" },
  { "id": "b", "label": "1010110…", "sub": "physical: bits" }
], "edges": [ { "from": "m", "to": "t" }, { "from": "t", "to": "nw" }, { "from": "nw", "to": "l" }, { "from": "l", "to": "b" } ], "hi": ["l"], "caption": "Going down, each layer adds one header: M, then H_T M, then H_N H_T M, then H_L H_N H_T M, then bits." }
```

## The five layers, one sentence each

The packet a layer makes is its *PDU*, which stands for *Protocol Data Unit*. The slide defines it as *a unit of data passed between layers of a protocol stack*.

The *application* layer is the program's own conversation, such as a browser asking a web server for a page. Its PDU is a *message*, and its address is a *name* such as a URL.

The *transport* layer hands the message to the right program on the computer. The slide calls this *process-to-process*, and the address is a *port number*.

The *network* layer moves the datagram from the first computer to the last one. The slide calls this *host-to-host*, and the address is the *logical (IP) address*.

The *data-link* layer moves a frame across one link only, to the next node. The address is the *link-layer (MAC) address* of that next node.

The *physical* layer turns the bits of the frame into signals on the wire or in the air. It has no address.

```diagram
{ "type": "layers", "title": "TCP/IP: what each layer does, its PDU and its address", "nodes": [
  { "id": "l5", "label": "5 Application: message", "sub": "end systems, a network application · names · HTTP, SMTP, DNS" },
  { "id": "l4", "label": "4 Transport: segment", "sub": "process-to-process · port numbers · TCP, UDP, SCTP" },
  { "id": "l3", "label": "3 Network: datagram", "sub": "host-to-host routing · IP addresses · IP, ICMP, DHCP, ARP" },
  { "id": "l2", "label": "2 Data link: frame", "sub": "neighbouring nodes, without errors · MAC addresses · Ethernet, 802.11" },
  { "id": "l1", "label": "1 Physical: bits", "sub": "bits to signals · no address · link dependent" }
], "hi": ["l2"], "caption": "Read a layer question as one row: the job, the PDU, the address. A switch runs layers 1 and 2; a router runs 1 to 3." }
```

## Why the stack is built in layers

The slide lists three advantages. The first is *separating the services from the implementation*: the layer above cares what it gets, not how.

The second is *simpler and less expensive intermediate systems*. A switch needs only two layers, and a router needs three.

The third is *modularity*. A change inside one layer is *transparent to the rest of the system*.

E01's second exercise is the tiny case. If a LAN changes to a new technology, only the data-link and physical layers change.

The widget sends one message from host A through a switch and a router to host B. Watch the frame header stay the same at the switch and get rebuilt at the router.

```widget
encapsulation
{ "title": "Encapsulation and decapsulation from A to B", "predict": true }
```

## Try it

The bank's examples come from one game script. It runs a MapleStory character and sends a death notice to a Discord channel over the Internet.

Write each answer in three moves before you reveal the model.

```quiz
[
  {
    "type": "free",
    "q": "A death notice from the game PC crosses three links on its way to Discord. What does the data-link layer do on each link, and why does every router build a new frame?",
    "model": "The data-link layer does *data transfer between neighbouring network elements* (node to node) *without errors*, and *a packet at the data-link layer is called a frame*. A router decapsulates the frame and builds a new one for two reasons: *each link may be using a different protocol with a different frame format*, and even with the same protocol *the link-layer addresses are normally different*. The notice may leave the game PC in an 802.11 frame and continue in an Ethernet frame on the next link, while the datagram inside stays the same.",
    "points": [
      "neighbouring nodes (node to node), without errors",
      "the PDU is a frame",
      "reason 1: a different protocol with a different frame format on each link",
      "reason 2: the link-layer addresses are normally different",
      "example: 802.11 on one link, Ethernet on the next; the datagram unchanged"
    ],
    "rows": 4,
    "explain": "Sheet side 3, \"The data-link layer (06b)\" lists both reasons. Do not write \"transforms bits to signals\": that is the physical layer."
  },
  {
    "type": "free",
    "q": "State the responsibility of each of the five layers of the TCP/IP protocol suite, one line per layer.",
    "model": "The *physical* layer *carries individual bits across the link*, transforming the bits of a frame into signals; the *data-link* layer handles *data transfer between neighbouring network elements*; the *network* layer routes *datagrams from source to destination (host-to-host)*. The *transport* layer gives *logical communication between application processes on different hosts* (process-to-process), and the *application* layer gives *communication between end systems for a network application*. For the death notice, the application layer writes the message, the transport layer hands it to the right process, the network layer routes it host to host, and the lower two move it one link at a time.",
    "points": [
      "physical: individual bits across the link, bits to signals",
      "data link: neighbouring network elements (node to node)",
      "network: host-to-host routing of datagrams",
      "transport: process-to-process",
      "application: end systems, a network application"
    ],
    "rows": 6,
    "explain": "Sheet side 1, \"Protocol layering (01b)\", the Job column. The fill-in trap: host-to-host is the network layer, process-to-process the transport layer."
  },
  {
    "type": "free",
    "q": "Name the PDU at each TCP/IP layer as the death notice goes down the stack at the game PC, and say what each layer adds.",
    "model": "A *PDU (Protocol Data Unit)* is *a unit of data passed between layers of a protocol stack*: the application layer makes a *message*, the transport layer a *segment* (a *user datagram* with UDP), the network layer a *datagram* (*packet*), the data-link layer a *frame*, and the physical layer sends *bits*. Going down, each layer adds its own header, which is *encapsulation*: M, then H_T M, then H_N H_T M, then H_L H_N H_T M. The death notice is the message; its TCP segment rides in an IP datagram, and the datagram rides in a frame to the first router.",
    "points": [
      "application: message",
      "transport: segment (user datagram)",
      "network: datagram (packet)",
      "data link: frame; physical: bits",
      "each layer adds a header: encapsulation"
    ],
    "rows": 5,
    "explain": "Sheet side 1, \"Protocol layering (01b)\", the PDU column and the encapsulation line under the table."
  },
  {
    "type": "free",
    "q": "Which type of address is used at each layer of the TCP/IP protocol suite? Give one example from the death notice for each.",
    "model": "The suite uses *four levels of addresses*: *names* at the application layer (URLs, email addresses), *port numbers* at the transport layer (they *identify a process on a host*), *logical (IP) addresses* at the network layer (they *uniquely define a host on the Internet*), and *link-layer (MAC) addresses* at the data-link layer (they *define a specific host or router in a network*). The physical layer has no address. For the death notice, the Discord URL is the name, a port number picks the server process, the IP address names the server host, and a MAC address names the next node on the current link.",
    "points": [
      "application: names (URLs, email addresses)",
      "transport: port numbers, a process on a host",
      "network: logical (IP) addresses, a host on the Internet",
      "data link: link-layer (MAC) addresses",
      "physical: none"
    ],
    "rows": 5,
    "explain": "Sheet side 1, \"Protocol layering (01b)\", the Address column. \"The physical layer has an address\" is a true-or-false trap."
  },
  {
    "type": "free",
    "q": "Give two example protocols for each of the top four TCP/IP layers, and say why the physical layer's protocols are described differently.",
    "model": "Application: *HTTP*, *SMTP*, *IMAP*, *FTP*, *DNS*, *Telnet*; transport: *TCP*, *UDP*, *SCTP*; network: *IP*, *ICMP*, *DHCP*, *ARP* and the routing protocols; data link: *Ethernet* and *802.11 (WiFi)*. The physical layer's protocols are *link dependent (rely on the medium)*, so they change with the cable or the air rather than with the application. The death notice sent as an HTTP request over TCP and IP, on WiFi to the home router, uses one protocol from each of the top four layers.",
    "points": [
      "application: two of HTTP, SMTP, IMAP, FTP, DNS, Telnet",
      "transport: two of TCP, UDP, SCTP",
      "network: two of IP, ICMP, DHCP, ARP",
      "data link: Ethernet, 802.11",
      "physical: link dependent, relies on the medium"
    ],
    "rows": 5,
    "explain": "Sheet side 1, \"Protocol layering (01b)\", the Protocols column. ARP sits in the network layer on both 01b and 06b."
  },
  {
    "type": "free",
    "q": "Why are network protocols organised in layers? Give the advantages the slide lists and one example.",
    "model": "*Protocol layering* divides the complex task of communication into *smaller, simpler tasks*; each layer offers a *service model* to the layer above and relies on the services of the layer below. The slide's advantages are *separating services from implementation*, *simpler and less expensive intermediate systems* (a switch runs two layers, a router three), and *modularity*: a change in one layer is transparent to the rest. When the game PC moves from Ethernet to WiFi, only the data-link and physical layers change; the death notice's HTTP, TCP and IP stay the same.",
    "points": [
      "a complex task divided into smaller, simpler tasks",
      "service model: each layer serves the layer above, uses the one below",
      "separating services from implementation",
      "simpler, less expensive intermediate systems; modularity",
      "example: a new LAN technology changes only data link and physical"
    ],
    "rows": 5,
    "explain": "Sheet side 1, \"Protocol layering (01b)\", the Advantages line. The example is E01 question 2: a new LAN technology changes only the data-link and physical layers."
  }
]
```

## Remember

- Three moves: the slide's term, the reason or difference, one example or number.
- Host-to-host is the network layer. Process-to-process is the transport layer.
- Bits to signals is the physical layer's job, never the data link's.
- *On the sheet:* *Sheet side 1, "Protocol layering (01b)"* and *Sheet side 3, "The data-link layer (06b)"*.

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "responsibility of the … layer" | the slide's job phrase, then the PDU | the PDU name | not the job of the neighbouring layer |
| "address at each layer" | names, port numbers, IP, MAC | one per layer | the physical layer has none |
| "why layers" | smaller, simpler tasks, then the three advantages | an example | a new LAN changes only layers 1 and 2 |
