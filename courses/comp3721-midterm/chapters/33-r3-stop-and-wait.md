---
title: "Review 3e: flow control, error control and Stop-and-Wait"
minutes: 15
---
This lesson teaches how a sender and a receiver keep frames from flooding or getting lost. It prepares you to trace Stop-and-Wait when a frame or an acknowledgment goes missing.

## The two controls, in plain words

*Flow control* stops a fast sender from flooding a slow receiver. Slide 22 asks for *a balance between production and consumption rates*.

Frames that arrive faster than they are used wait in a *buffer*. That is *a set of memory locations that can hold packets*.

When the buffer fills, the receiver either drops frames or sends *feedback* asking the sender *to stop or slow down*.

```diagram
{ "type": "sequence", "title": "Slide 23: flow control as feedback", "nodes": [
  { "id": "p", "label": "Producer", "kind": "lane", "sub": "sending data-link" },
  { "id": "c", "label": "Consumer", "kind": "lane", "sub": "receiving data-link" }
], "edges": [
  { "from": "p", "to": "c", "label": "Frame, buffered" },
  { "from": "p", "to": "c", "label": "Frame, buffered" },
  { "from": "c", "to": "p", "label": "Feedback: slow down" }
], "hi": ["3"], "caption": "Frames are pushed faster than they are consumed, so the consumer asks the producer to stop or slow down." }
```

*Error control* keeps damaged frames away from the network layer. The sender adds a CRC, the receiver checks it, and *corrupted frames are discarded*.

One message does both jobs. An acknowledgment, ACK for short, says the frame arrived uncorrupted and the sender may go on. *The lack of acknowledgment means that there is a problem in the sent frame.*

The *Simple* protocol has *No flow and error control*. It sends frames and never waits for an answer.

## Stop-and-Wait, in plain words

*Stop-and-Wait* is *connection-oriented* and gives *both flow and error control*. The sender sends one frame, then waits for its ACK before sending the next.

The sender keeps a saved copy and starts a *timer*. If no ACK comes back before the timer runs out, it resends the saved copy.

The receiver sends an ACK only for an error-free frame. A corrupted frame is discarded with no reply, so the sender's timer runs out.

## A tiny case: one good frame, then a lost one

Two frames go out. The first arrives and is acknowledged, the second is lost on the link.

```diagram
{ "type": "sequence", "title": "Slide 35: a lost frame", "nodes": [
  { "id": "s", "label": "Sender data-link", "kind": "lane" },
  { "id": "r", "label": "Receiver data-link", "kind": "lane" }
], "edges": [
  { "from": "s", "to": "r", "label": "Frame (timer started)" },
  { "from": "r", "to": "s", "label": "ACK (timer stopped)" },
  { "from": "s", "to": "r", "label": "Frame: lost", "dashed": true },
  { "from": "s", "to": "r", "label": "Time-out: Frame resent" },
  { "from": "r", "to": "s", "label": "ACK" }
], "hi": ["4"], "caption": "No ACK comes back for the lost frame, so the timer runs out and the saved copy is sent again." }
```

The sender never learns what went wrong. Silence is enough: the time-out alone triggers the resend.

## What goes wrong when an ACK is lost

Now the frame arrives and is delivered, but its ACK is lost. The sender's timer runs out and it resends the frame.

```diagram
{ "type": "sequence", "title": "Slide 35: a lost ACK, without numbers", "nodes": [
  { "id": "s", "label": "Sender data-link", "kind": "lane" },
  { "id": "r", "label": "Receiver data-link", "kind": "lane" }
], "edges": [
  { "from": "s", "to": "r", "label": "Frame: delivered" },
  { "from": "r", "to": "s", "label": "ACK: lost", "dashed": true },
  { "from": "s", "to": "r", "label": "Time-out: Frame resent" },
  { "from": "r", "to": "s", "label": "Delivered again: Duplicate" }
], "hi": ["4"], "caption": "The receiver cannot tell the resent frame from a new one, so it delivers the same packet twice." }
```

The slide labels the second delivery *Duplicate*. Sequence numbers fix this.

## The rules, with each part named

The sender's states come from slide 34. It starts in Ready.

| State | Event | Action | Next |
|---|---|---|---|
| Ready | *Packet came from network layer.* | *Make a frame, save a copy, and send the frame. Start the timer.* | Blocking |
| Blocking | *Time-out.* | *Resend the saved frame. Restart the timer.* | Blocking |
| Blocking | *Corrupted ACK arrived.* | *Discard the ACK.* | Blocking |
| Blocking | *Error-free ACK arrived.* | *Stop the timer. Discard the saved frame.* | Ready |

Blocking has no row for a new packet. That missing row is the flow control: nothing new goes out until the ACK arrives.

Slide 36 numbers the frames and the ACKs.

$$\text{sequence numbers: } 0, 1, 0, 1, \ldots \qquad \text{ACK numbers: } 1, 0, 1, 0, \ldots$$

- The sequence number names the frame being sent.
- The ACK number names *the sequence number of the next frame to receive*.

The trap is the ACK number. It is the frame the receiver wants next, not the frame that just arrived, so Frame 0 gets ACK 1.

## The slide's rule, worked on a game link

The Classic client sends three frames to the game server over a lossy link. Frame 1 is lost once, and later an ACK 1 is lost.

```diagram
{ "type": "sequence", "title": "Client to game server, Stop-and-Wait with sequence numbers", "nodes": [
  { "id": "c", "label": "Client data-link", "kind": "lane" },
  { "id": "g", "label": "Game server data-link", "kind": "lane" }
], "edges": [
  { "from": "c", "to": "g", "label": "Frame 0 (timer started)" },
  { "from": "g", "to": "c", "label": "ACK 1 (next expected: 1)" },
  { "from": "c", "to": "g", "label": "Frame 1: lost", "dashed": true },
  { "from": "c", "to": "g", "label": "Time-out: Frame 1 resent" },
  { "from": "g", "to": "c", "label": "ACK 0" },
  { "from": "c", "to": "g", "label": "Frame 0" },
  { "from": "g", "to": "c", "label": "ACK 1: lost", "dashed": true },
  { "from": "c", "to": "g", "label": "Time-out: Frame 0 resent" },
  { "from": "g", "to": "c", "label": "Duplicate discarded, ACK 1 again" }
], "hi": ["9"], "caption": "The server expects Frame 1 and sees Frame 0: a duplicate. It discards the frame and repeats ACK 1, so the packet is not delivered twice." }
```

Check: the sequence numbers alternate 0, 1, 0, and each ACK names the next frame. Without the numbers, slide 35 delivers that resent frame again as a *Duplicate*.

## Watch it step by step

The widget replays the lost-ACK exchange with a number on every frame and every acknowledgment.

Before each step it asks what happens next. Before each acknowledgment it asks for its number.

A wrong pick quotes the line of the slide's state machine that decides it.

```widget
stop-wait-play
{ "scenario": "ack-lost", "seq": true, "predict": true }
```

## Try it

Trace each event with the receiver's rule and the sender's table.

```quiz
[
  {
    "q": "With sequence numbers, the first copy of Frame 1 arrives corrupted at the game server. What does the server do?",
    "options": ["Discards the frame and sends nothing", "Delivers the packet and sends ACK 0", "Sends ACK 1 to ask for the frame again", "Discards the frame and sends ACK 0"],
    "answer": 0,
    "explain": "Rule: receiver, Corrupted frame arrived → Discard the frame.\nSubstitution: the CRC check fails on the first copy of Frame 1.\nAnswer: it discards the frame and sends no ACK.\nCheck: the client's timer then runs out and it resends Frame 1."
  },
  {
    "q": "The client has sent a frame and is still waiting for its ACK when the timer runs out. What does it do?",
    "options": ["Resends the saved frame and restarts the timer", "Stops the timer and discards the saved frame", "Discards the ACK", "Makes a new frame from the next packet"],
    "answer": 0,
    "explain": "Rule: sender, Time-out → Resend the saved frame. Restart the timer.\nSubstitution: no ACK came back for the frame in flight.\nAnswer: resend the saved copy, restart the timer, stay in the same state.\nCheck: stopping the timer and discarding the copy happen only on an error-free ACK."
  },
  {
    "q": "The resent Frame 1 arrives error-free. Which acknowledgment number does the game server send?",
    "type": "numeric",
    "answer": 0,
    "tolerance": 0,
    "unit": "",
    "explain": "Rule: an acknowledgment number always define the sequence number of the next frame to receive.\nSubstitution: after Frame 1, the next frame expected is Frame 0.\nAnswer: ACK 0.\nCheck: the ACK numbers run 1, 0, 1, 0, one step ahead of the sequence numbers."
  },
  {
    "q": "The Simple protocol provides flow control.",
    "type": "tf",
    "answer": false,
    "explain": "Rule: slide 30, the Simple protocol has no flow and error control.\nSubstitution: it sends frames and never waits for an ACK.\nAnswer: false.\nCheck: Stop-and-Wait is the protocol that provides both flow and error control."
  },
  {
    "q": "Name the state the Stop-and-Wait sender is in while it waits for an acknowledgment.",
    "type": "text",
    "answer": ["Blocking"],
    "explain": "Rule: slide 34, Ready → Blocking when the frame is sent and the timer starts.\nSubstitution: the sender has sent a frame and holds a saved copy.\nAnswer: Blocking.\nCheck: only an error-free ACK takes it back to Ready."
  },
  {
    "type": "free",
    "q": "In Stop-and-Wait with sequence numbers, the game server's ACK for Frame 0 is lost and Frame 0 is resent. Explain what the game server does with the resent frame and why.",
    "model": "The server has already delivered Frame 0 and expects Frame 1, so the resent Frame 0 is a *duplicate*. It *discards* the frame and sends ACK 1 again, because *an acknowledgment number always define the sequence number of the next frame to receive*. The sender's *time-out* caused the resend; without sequence numbers the packet would be delivered twice (slide 35).",
    "points": [
      "Names the resent frame a duplicate",
      "The server discards it rather than delivering it",
      "It sends ACK 1 again",
      "The ACK number is the next frame expected",
      "The resend came from the sender's time-out after the lost ACK"
    ],
    "rows": 4,
    "explain": "Three moves: name it in the slide's words (duplicate), give the reason (the server expects 1 and the ACK number is the next frame expected), give the trace (discard, ACK 1 again)."
  }
]
```

## Remember

- No ACK means a problem: the sender's time-out resends the saved frame.
- The ACK number is the sequence number of the next frame expected.
- A resent frame with the wrong number is a duplicate: discard it and repeat the ACK.
- *On the sheet:* Sheet side 4, "Flow and error control, Simple and Stop-and-Wait".

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "lost frame", "lost ACK", "time-out" | slide 34 sender table | the trace of events | one frame in flight at a time |
| "sequence number", "acknowledgment number" | ACK = next frame expected | 0 or 1 | numbers alternate 0, 1 |
