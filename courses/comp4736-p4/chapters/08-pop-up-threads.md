---
title: Pop-up threads
minutes: 9
---

A server that handles messages from the network can keep a thread waiting for each one, or it can create a fresh thread the moment a message arrives. Slides 50 and 51 describe the second way.

## What a pop-up thread is

Slide 50: *The arrival of a message causes the system to create a new thread to handle the message. Such a thread is called a pop-up thread. The new thread is given the incoming message to process.*

The payoff is speed of response: *The result of using pop-up threads is that the latency between message arrival and the start of processing can be made very short.*

Compare the web server of [the thread-usage lesson](#/comp4736-p4/thread-usage). There the dispatcher thread hands each request to a worker thread that already exists and is blocked, waking it from blocked to ready. A pop-up thread does not exist until its message arrives.

## Why a pop-up thread is quick to create

Why can the system create one fast enough to keep the latency short? Slide 50 again: *A key advantage of pop-up threads is that since they are brand new, they do not have any history—registers, stack, whatever—that must be restored. Each one starts out fresh and each one is identical to all the others. This makes it possible to create such a thread quickly.*

A thread that has run before carries a saved program counter, registers and stack, the per-thread items of [the classical thread model](#/comp4736-p4/classical-thread-model), and they must be loaded back before it continues. A pop-up thread has nothing saved, so there is nothing to load.

## Before and after the message arrives

Slide 51, **Creation of a new thread when a message arrives. (a) Before the message arrives. (b) After the message arrives.** Two machines sit on a bar labelled Network.

| | (a) Before the message arrives | (b) After the message arrives |
|---|---|---|
| Threads in the process | one, the "Existing thread" | two: the existing thread and a new one |
| The network | idle | an "Incoming message" travels along it and up into the process |
| The new thread | not yet created | "Pop-up thread created to handle incoming message" |

The existing thread is untouched in (b): the message goes to the new thread, not to it.

```quiz
[
  {
    "q": "With pop-up threads, the latency between message arrival and the start of processing is long, because a new thread must be created first.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 50: *the latency between message arrival and the start of processing can be made very short.* Creating the thread is quick because it has no history to restore."
  },
  {
    "q": "Why can a pop-up thread be created quickly?",
    "options": [
      "It is brand new, so it has no registers or stack that must be restored",
      "It reuses the stack of the existing thread",
      "The kernel creates it without a thread table entry",
      "It is a blocked worker thread that is woken up"
    ],
    "answer": 0,
    "explain": "Slide 50: *since they are brand new, they do not have any history—registers, stack, whatever—that must be restored.* Waking a blocked worker is the dispatcher/worker web server, where the thread already exists."
  },
  {
    "q": "What causes the system to create a pop-up thread?",
    "options": [
      "The arrival of a message",
      "A thread calling pthread_yield",
      "A page fault",
      "A clock interrupt"
    ],
    "answer": 0,
    "explain": "*The arrival of a message causes the system to create a new thread to handle the message* (slide 50). The new thread is given the incoming message to process."
  },
  {
    "q": "Name the thread that the system creates to handle an incoming message.",
    "type": "text",
    "answer": ["pop-up thread", "popup thread", "pop up thread", "pop-up"],
    "explain": "*Such a thread is called a pop-up thread* (slide 50)."
  },
  {
    "q": "Each pop-up thread starts out fresh, and each one is identical to all the others.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 50: *Each one starts out fresh and each one is identical to all the others. This makes it possible to create such a thread quickly.*"
  },
  {
    "q": "In slide 51's figure (b), how many threads does the process hold after the message arrives?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "explain": "Figure (a) has one, the existing thread. In (b) the incoming message creates a second: the pop-up thread created to handle incoming message. The existing thread is still there."
  },
  {
    "q": "In slide 51's figure (b), the incoming message is handed to the existing thread.",
    "type": "tf",
    "answer": false,
    "explain": "The message goes up into the process to a new wavy line labelled \"Pop-up thread created to handle incoming message\". The existing thread is unchanged."
  }
]
```
