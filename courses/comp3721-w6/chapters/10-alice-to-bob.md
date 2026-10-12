---
title: "Alice's datagram to Bob: the frames at every node"
minutes: 16
---

The last three lessons gave the pieces: frames, two kinds of addresses and ARP. This lesson runs them together for one datagram from Alice to Bob through two routers, writing the frame that leaves every node.

## The setup

Slide wording (slide 29): *Assume Alice needs to send a datagram to Bob, who is three nodes away on the Internet. Assume that Alice knows the network-layer (IP) address of Bob (i.e., N_B). Also, Alice's host knows its own IP address (i.e., N_A) and its MAC address (i.e., L_A). Explain/show the activities for communication at the data link layer at each node.*

The topology, with each interface's addresses as the slides reveal them:

| Node | Interface toward Alice | Interface toward Bob |
|---|---|---|
| Alice | | $L_A$, $N_A$ (on Alice's site LAN) |
| R1 | $L_1$, $N_1$ | $L_2$ |
| R2 | $L_3$, $N_3$ | $L_4$, $N_4$ |
| Bob | $L_B$, $N_B$ (on Bob's site LAN) | |

:::warn Different numbering from the small internet
In the previous lesson $L_1$ was Alice. Here Alice is $L_A$ and $L_1$ is R1's interface on Alice's LAN. Each figure defines its own labels; read the picture, not your memory of the other one.
:::

## The same four steps at every sending node

The slide figures at Alice, R1 and R2 all follow one recipe:

1. The **network layer** has the datagram $[N_A \mid N_B \mid \text{Data}]$ and looks $N_B$ up in the **forwarding table**, which returns the IP address of the **next hop**.
2. The node's **ARP** asks for the MAC address of that next-hop IP address; the next hop's ARP answers with its MAC address.
3. The **data-link layer** gets the datagram, the next hop's MAC address (destination) and its own interface's MAC address (source), and builds the frame.
4. The **physical layer** turns the frame into a signal on the link.

At a router, steps 1 to 4 are preceded by the reverse: the physical layer receives the signal, the data-link layer decapsulates the frame, and the datagram goes up to the network layer.

## Alice's site, R1, R2 and Bob's site

| Node | Forwarding table: $N_B \to$ | ARP asks for | ARP answered by | Frame sent |
|---|---|---|---|---|
| Alice | $N_1$ | $N_1$ | ARP (R1): $L_1$ | $[L_1 \mid L_A \mid N_A \mid N_B \mid \text{Data}]$ to R1 |
| R1 | $N_3$ | $N_3$ | ARP (R2): $L_3$ | $[L_3 \mid L_2 \mid N_A \mid N_B \mid \text{Data}]$ to R2 |
| R2 | $N_B$ | $N_B$ | ARP (Bob): $L_B$ | $[L_B \mid L_4 \mid N_A \mid N_B \mid \text{Data}]$ to Bob |
| Bob | | | | receives $[L_B \mid L_4 \mid N_A \mid N_B \mid \text{Data}]$, decapsulates, datagram $[N_A \mid N_B \mid \text{Data}]$ goes to the network layer |

Walk the rows:

- **Alice's site** (slide 30). The next hop $N_1$ is R1's interface on Alice's LAN. ARP (R1) replies $L_1$; the data-link layer takes $L_1$ as the destination and Alice's own $L_A$ as the source.
- **Router R1** (slide 31, *Flow of packets at Router R1*). The next hop $N_3$ is R2's interface on the point-to-point link. The source is now $L_2$, R1's **outgoing** interface, not $L_1$ (its incoming one) and not $L_A$ (Alice).
- **Router R2** (slide 32). The forwarding table maps $N_B$ to **$N_B$ itself**, because Bob is directly connected to R2's LAN: the next hop is the destination. ARP (Bob) replies $L_B$; source $L_4$.
- **Bob's site** (slide 33, *Flow of packets at Bob's computer*). Signal, frame, datagram, network layer. Boxed on the slide: *Note that the source and destination network-layer addresses, N_A and N_B, have not been changed during the whole journey.*

Three ARP exchanges happen, one per link, each answered by the node at the far end of that link: R1, then R2, then Bob.

## The three frames side by side

| Link | Frame | Who built it | L destination is | L source is |
|---|---|---|---|---|
| Alice's LAN | $[L_1 \mid L_A \mid N_A \mid N_B \mid \text{Data}]$ | Alice | R1's interface on Alice's LAN | Alice |
| R1 to R2 | $[L_3 \mid L_2 \mid N_A \mid N_B \mid \text{Data}]$ | R1 | R2's interface toward R1 | R1's interface toward R2 |
| Bob's LAN | $[L_B \mid L_4 \mid N_A \mid N_B \mid \text{Data}]$ | R2 | Bob | R2's interface on Bob's LAN |

Same pattern as the small internet: link-layer addresses destination-source and new on every link; IP addresses source-destination and $N_A\ N_B$ throughout.

### Step through Alice's datagram, node by node

```widget
hop-walk
{ "preset": "Alice to Bob (slides 30-33)", "draw": false }
```

Now cover the table and write the two L fields of each frame yourself:

```widget
hop-walk
{ "preset": "Alice to Bob (slides 30-33)", "draw": true }
```

## What the data-link layer is responsible for

The lecture's summary slide (slide 34) lists the layer's responsibilities. Write these on your study sheet as the lecture's own closing list:

- *The creation and delivery of a frame to another node, along the link*
- *Packetizing (framing)*
- *Flow control and error control along the link*
- *Controlling access to the link*
- *Link-layer addressing*
- *ARP to map IP addresses to MAC addresses*

Every item says "along the link" or "to another node": the data-link layer's whole world is one hop.

```quiz
[
  {
    "q": "At Alice's site, what does the forwarding table return when the network layer looks up N_B?",
    "options": ["L₁", "N₁", "N_B", "L_A"],
    "answer": 1,
    "explain": "The forwarding table maps the destination IP address N_B to the IP address of the next hop, N₁ (R1's interface on Alice's LAN). ARP then turns N₁ into L₁. A forwarding table returns IP addresses, never MAC addresses."
  },
  {
    "q": "Which frame does Alice send to R1?",
    "options": [
      "[L_A | L₁ | N_A | N_B | Data]",
      "[L₁ | L_A | N_A | N₁ | Data]",
      "[L₁ | L_A | N_A | N_B | Data]",
      "[L_B | L_A | N_A | N_B | Data]"
    ],
    "answer": 2,
    "explain": "Link-layer destination first (L₁, R1), then link-layer source (L_A, Alice), then the datagram's IP source and destination N_A N_B. The IP destination is Bob's N_B, not the next hop's N₁."
  },
  {
    "q": "Who answers the ARP request that R1 sends while forwarding Alice's datagram?",
    "options": ["R2", "Alice", "Bob", "R1 answers its own request"],
    "answer": 0,
    "explain": "R1's forwarding table gives next hop N₃, R2's interface on the point-to-point link, so ARP (R1) asks for N₃ and ARP (R2) replies with L₃. Each ARP exchange is answered by the node at the far end of the current link: R1 for Alice, R2 for R1, Bob for R2."
  },
  {
    "q": "In the frame R1 sends to R2, [L₃ | L₂ | N_A | N_B | Data], why is the source address L₂ rather than L₁?",
    "options": [
      "L₁ belongs to Alice",
      "L₂ is R1's interface on the link toward R2; L₁ is R1's interface on Alice's LAN",
      "L₂ is Bob's address",
      "The source field always holds the lowest-numbered address"
    ],
    "answer": 1,
    "explain": "A router has one link-layer address per interface. The frame leaves through R1's interface on the R1-R2 link, L₂, so that is the source. L₁ was the destination of the frame that arrived from Alice on the other interface."
  },
  {
    "q": "At router R2, the forwarding table lookup for N_B returns N_B itself.",
    "type": "tf",
    "answer": true,
    "explain": "Bob is on the LAN directly connected to R2, so the next hop is the destination. ARP (R2) therefore asks for N_B and ARP (Bob) replies with L_B."
  },
  {
    "q": "The last frame of the journey, from R2 to Bob, is [L_B | L₄ | N_A | N_B | Data]. Fill in the blank: the link-layer source L₄ belongs to _______.",
    "type": "text",
    "answer": ["R2", "router R2", "R2's interface on Bob's LAN"],
    "explain": "L₄ is R2's interface on Bob's site LAN, the interface the frame leaves through. L_B (Bob) is the destination."
  },
  {
    "q": "During the whole journey from Alice to Bob, the source and destination network-layer addresses N_A and N_B are rewritten by each router.",
    "type": "tf",
    "answer": false,
    "explain": "Boxed on slide 33: the source and destination network-layer addresses, N_A and N_B, have not been changed during the whole journey. Only the two link-layer addresses change, once per link."
  },
  {
    "q": "How many ARP request-reply exchanges take place on the path Alice → R1 → R2 → Bob (one per link)?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "explain": "One per link: Alice asks for N₁ (R1 answers L₁), R1 asks for N₃ (R2 answers L₃), R2 asks for N_B (Bob answers L_B)."
  },
  {
    "q": "Put the steps at a sending node in the slide's order.",
    "type": "reorder",
    "lines": [
      "Network layer looks N_B up in the forwarding table and gets the next-hop IP address",
      "ARP asks for the next hop's MAC address and gets the reply",
      "Data-link layer builds the frame with the next hop's MAC as destination and its own MAC as source",
      "Physical layer sends the frame as a signal on the link"
    ],
    "explain": "Forwarding table first (which IP address is next), ARP second (what MAC address that is), then framing, then the signal. The same four steps repeat at Alice, R1 and R2."
  },
  {
    "q": "Which of these are on the summary slide's list of what the data-link layer is responsible for? Select all that apply.",
    "options": [
      "Packetizing (framing)",
      "Choosing the end-to-end path through the Internet",
      "Controlling access to the link",
      "ARP to map IP addresses to MAC addresses"
    ],
    "answer": [0, 2, 3],
    "explain": "The summary lists frame creation and delivery along the link, packetizing (framing), flow and error control along the link, controlling access to the link, link-layer addressing, and ARP. Choosing the end-to-end path is routing, a network-layer job; the data-link layer only ever handles one hop."
  }
]
```
