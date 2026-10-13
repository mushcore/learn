---
title: Node-to-node communication, framing and the four services
minutes: 14
---

A datagram crosses the Internet one link at a time, and the data-link layer is the layer that carries it across each link.

## The Internet is networks glued together by routers or switches

Slide wording: *The Internet: Combination of networks glued together by connecting devices (routers or switches). A packet traveling from a host to another host needs to pass through these networks.*

The slide's "small part of the Internet" is a laptop on a LAN, a router, a point-to-point network, a router, a LAN, a router, a point-to-point network, a router, a LAN, and a server. Redrawn as dots and lines it becomes six **nodes** joined by five **links**.

| Thing in the picture | Role |
|---|---|
| hosts (the laptop, the server) and routers | **nodes** |
| LANs and point-to-point networks | **links** |

The data-link layer's job is *node-to-node communication*: move a frame from one node to the next node over the link between them. It never sees the whole path.

## The data-link layer is active at every hop

The "Communication at the data-link layer" figure sends a message from Alice (Sky Research) to Bob (Scientific Books) through routers R2, R4, R5 and R7. Alice and Bob run all five layers. Each router runs three: network, data-link and physical. The data-link arrows go between every neighbouring pair, Alice to R2, R2 to R4, R4 to R5, R5 to R7, R7 to Bob, so the data-link layer runs **five times** on this path, once per hop.

## A packet at the data-link layer is called a frame

Boxed on the slide: *A packet at the data-link layer is called a frame.*

The "Encapsulation and decapsulation" figure shows the source's data link putting the datagram inside a **frame of type 1** for the **link of type 1**. At the router, the data link **decapsulates**: it removes the frame and passes the bare datagram up. The router's other data link then **encapsulates** it again in a **frame of type 2** for the **link of type 2**. The dotted line between two data-link layers is the *logical link*; the solid wire is the *actual link*. The data-link header (the small box labelled 2) is what gets stripped and rebuilt at each node.

### Why encapsulate and decapsulate at each intermediate node?

The slide asks this and answers it (slide 8), two reasons:

1. *Each link may be using a different protocol with a different frame format.*
2. *Even if one link and the next are using the same protocol, encapsulation and decapsulation are needed because the link-layer addresses are normally different.* The next lesson is about those addresses.

The datagram inside stays the same; the frame around it is rebuilt at every node.

### Week 1's walk: the data-link header changes at the router, not at the switch

```widget
encapsulation
{ "title": "Week 1's walk: watch the data-link header change at the switch and the router" }
```

The switch only reads $H_L$ and forwards the frame unchanged. The router removes $H_L$, reads $H_N$ to choose the next link, and writes a new $H_L$. That new $H_L$ is the type-2 frame of the slide.

## Where the layer sits and the four services it provides

*The data-link layer is located between the physical layer and the network layer.* It *provides services to the network layer* and *receives services from the physical layer*.

Slide wording for the services provided by the data-link layer:

| # | Service | Slide definition |
|---|---|---|
| 1 | **Framing** | *Encapsulating the datagram in a frame before sending it to the next node* |
| 2 | **Flow control** | *Controlling the rate of producing frames w.r.t. the rate of consumed frames* |
| 3 | **Error control** | *Error detection and correction* |
| 4 | **Congestion control** | listed as the fourth service, with no definition on the slide |

Flow control is about a fast producer and a slow consumer on one link. Not on the slide: if the sender produces frames faster than the receiver consumes them, frames are lost at the receiver.

## Two sublayers: DLC for every link, MAC only for shared links

*We can divide the data-link layer into two sublayers:*

| Sublayer | Deals with | Services |
|---|---|---|
| **Data Link Control (DLC)** | *issues common to both point-to-point (dedicated) and broadcast (shared) links* | *framing, flow control, and error control* |
| **Media Access Control (MAC)** | *only issues specific to broadcast (shared) links* | who may talk on the shared medium (not detailed on the slide) |

The slide's figure shows the two cases: the data-link layer of a **broadcast link** has a DLC sublayer on top of a MAC sublayer; the data-link layer of a **point-to-point link** has the DLC sublayer only, the MAC space greyed out. A dedicated link has one sender at each end, so there is no access to control.

:::quiz MAC the sublayer, MAC the address
"MAC" here is the sublayer that controls access to a shared link. The MAC address of the next lesson is named after it, but the MAC sublayer is about shared links, not about addresses.
:::

```quiz
[
  {
    "q": "In the slide's nodes-and-links figure, what are the nodes and what are the links?",
    "options": [
      "Nodes are LANs; links are the routers between them",
      "Nodes are hosts and routers; links are the LANs and point-to-point networks between them",
      "Nodes are switches only; links are cables",
      "Nodes are applications; links are TCP connections"
    ],
    "answer": 1,
    "explain": "The small part of the Internet redraws as six nodes (the two hosts and four routers) joined by five links (the three LANs and two point-to-point networks). The data-link layer moves a frame from one node to the next over one link."
  },
  {
    "q": "A packet at the data-link layer is called a _______.",
    "type": "text",
    "answer": ["frame"],
    "explain": "Boxed on the slide: a packet at the data-link layer is called a frame. The network-layer packet inside it is the datagram."
  },
  {
    "q": "On the path Alice → R2 → R4 → R5 → R7 → Bob, how many times is the data-link layer used (one use per hop)?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0,
    "explain": "Five hops: Alice-R2, R2-R4, R4-R5, R5-R7, R7-Bob. The data-link layer is active at every hop, in the hosts and in every router, because each router runs the network, data-link and physical layers."
  },
  {
    "q": "The same frame that leaves the source arrives unchanged at the destination; only routers at the ends of the path touch it.",
    "type": "tf",
    "answer": false,
    "explain": "Every intermediate node decapsulates the datagram and encapsulates it in a new frame, for two reasons: the next link may use a different protocol with a different frame format, and the link-layer addresses are normally different on the next link. The datagram survives; the frame is rebuilt."
  },
  {
    "q": "Which two reasons does the slide give for encapsulation and decapsulation at each intermediate node? Select all that apply.",
    "options": [
      "Each link may be using a different protocol with a different frame format",
      "The datagram must be re-encrypted on every link",
      "The link-layer addresses are normally different from one link to the next",
      "The router must recompute the IP checksum"
    ],
    "answer": [0, 2],
    "explain": "Slide 8's two reasons: a different frame format per link, and different link-layer addresses even when the protocol is the same. Encryption and IP checksums are not on the slide."
  },
  {
    "q": "The data-link layer is located between which two layers?",
    "options": [
      "Transport and network",
      "Application and transport",
      "Physical and the transmission medium",
      "Network and physical"
    ],
    "answer": 3,
    "explain": "The data-link layer sits between the physical layer and the network layer: it provides services to the network layer and receives services from the physical layer."
  },
  {
    "q": "Match each data-link service to the slide's definition.",
    "type": "match",
    "pairs": [
      ["Framing", "encapsulating the datagram in a frame before sending it to the next node"],
      ["Flow control", "controlling the rate of producing frames w.r.t. the rate of consumed frames"],
      ["Error control", "error detection and correction"]
    ],
    "explain": "Framing wraps the datagram; flow control matches the producer's rate to the consumer's; error control detects and corrects errors. Congestion control is the fourth item on the list."
  },
  {
    "q": "Which of these is NOT one of the four services the slide lists for the data-link layer?",
    "options": ["Framing", "Flow control", "Routing", "Congestion control"],
    "answer": 2,
    "explain": "The four listed services are framing, flow control, error control and congestion control. Routing (choosing the path from forwarding tables) belongs to the network layer."
  },
  {
    "q": "The _______ sublayer deals only with issues specific to broadcast (shared) links.",
    "type": "text",
    "answer": ["MAC", "media access control", "Media Access Control (MAC)", "media access control (MAC)"],
    "explain": "Media Access Control (MAC) handles the shared-medium issues. Data Link Control (DLC) handles what is common to both point-to-point and broadcast links: framing, flow control and error control."
  },
  {
    "q": "A point-to-point (dedicated) link needs both the DLC and the MAC sublayers.",
    "type": "tf",
    "answer": false,
    "explain": "The slide's figure b shows the data-link layer of a point-to-point link with the DLC sublayer only; the MAC sublayer is greyed out because there is no shared medium to control access to. Figure a, the broadcast link, has both."
  }
]
```
