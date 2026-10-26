---
title: "Alarm system calls, the next-signal list and watchdog timers"
minutes: 14
---

Several processes may each want a warning at a different time, but the machine has one clock. The clock driver serves them all from one linked list, and it uses the same clock to watch the system itself.

## A process can ask for a warning after an interval

Duty 4 of the clock driver, slide 38, *Handling alarm system call from user processes*: *In many systems, a process can request that the operating system give it a warning (a signal, interrupt, message,…) after a certain interval. If many signals are expected, it is more efficient to simulate multiple clocks by chaining all the pending clock requests together, sorted on time, in a linked list.*

The rule that defines the list: *Each entry on the list tells how many clock ticks following the previous one to wait before causing a signal.*

The entries are differences, not absolute times. The first entry counts from the current time; every later entry counts from the signal before it.

## Slide 39: signals pending for 4203, 4207, 4213, 4215 and 4216

The figure, *Simulating multiple timers with a single clock*, shows three boxes: *Current time* 4200, *Next signal* 3, and a *Clock header* pointing to five two-field nodes:

```text
Clock header → [3|•] → [4|•] → [6|•] → [2|•] → [1|X]
```

Each entry is one subtraction:

| Pending signal | Calculation | List entry |
|---|---|---|
| 4203 | 4203 − 4200 (current time) | 3 |
| 4207 | 4207 − 4203 | 4 |
| 4213 | 4213 − 4207 | 6 |
| 4215 | 4215 − 4213 | 2 |
| 4216 | 4216 − 4215 | 1 |

The slide's text for the ticks that follow: *the next interrupt occurs in 3 ticks. On each tick, Next signal is decremented. When Next signal = 0, the signal corresponding to the first item on the list is caused, and that item is removed from the list. Then Next signal = 4.*

Only *Next signal* changes on a tick. The entries behind the head wait untouched, because each one counts from the signal before it, not from now. That is why one clock is enough for any number of pending requests.

Run the slide's list to the end and every signal fires on its pending time. *Next signal* reaches 0 at 4203, takes the value 4 and reaches 0 again at 4207, then takes 6 (fires at 4213), 2 (4215) and 1 (4216). After the last node is removed the clock header points to nothing, and no signal is pending until a process makes another alarm request.

To recover an absolute time, add the entries up from the current time: 4200 + 3 + 4 = 4207 for the second signal.

### Every tick, Next signal counts down

Each step is one tick: *Current time* rises by 1 and *Next signal* falls by 1. At zero the head's signal fires, its node is removed, and *Next signal* takes the next entry's value.

```widget
alarm-list-play
{ "now": 4200, "predict": true }
```

## Watchdog timers watch the system itself

Duty 5, slide 40, *Providing watchdog timers for parts of system itself*: *Detect and recover from crashes, infinite loops*. The slide's example: *a watchdog timer may reset a system that stops running, especially used in embedded system.*

The slide pictures a bulldog and an Arduino UNO board, a typical embedded system, and links a YouTube demonstration (youtube.com/watch?v=GC6dGypGctQ).

An alarm serves a user process that asked for a warning; a watchdog serves the operating system, and its action is a recovery such as a reset. Slide 33 lists both as clock-driver duties, numbers 4 and 5, so both are software built on the clock's interrupts.

## Build the list for a new set of alarms

The current time is 5100 and signals are pending for 5102, 5108, 5109, 5115 and 5120. Build the list as on slide 39, then run the clock forward.

```quiz
[
  {
    "q": "Fill in the five list entries, head first.",
    "type": "fill",
    "code": "Clock header → [___] → [___] → [___] → [___] → [___|X]",
    "answer": ["2", "6", "1", "6", "5"],
    "explain": "5102 − 5100 = **2**, 5108 − 5102 = **6**, 5109 − 5108 = **1**, 5115 − 5109 = **6**, 5120 − 5115 = **5**. The head counts from the current time, every other entry from the signal before it."
  },
  {
    "q": "What is Next signal at current time 5100?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "unit": "ticks",
    "explain": "Next signal is the head entry: 5102 − 5100 = **2** ticks."
  },
  {
    "q": "The first two signals have fired and their nodes are removed. What is Next signal right after the second one fires?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "unit": "ticks",
    "explain": "After 5102 fires the head is 6; Next signal counts it down to 0 at 5108, that signal fires and its node goes. The new head is the third entry, 5109 − 5108 = **1**."
  },
  {
    "q": "At what current time does the third signal fire?",
    "type": "numeric",
    "answer": 5109,
    "tolerance": 0,
    "explain": "Add the entries from the current time: 5100 + 2 + 6 + 1 = **5109**, the third pending time."
  },
  {
    "q": "What is Next signal when the current time is 5112?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "ticks",
    "explain": "At 5109 the third signal fires and Next signal becomes the fourth entry, 6. Three ticks later, at 5112, it has been decremented to 6 − 3 = **3**, which is also 5115 − 5112."
  }
]
```

```quiz
[
  {
    "q": "Each entry on the pending-signal list stores the absolute time at which its signal is due.",
    "type": "tf",
    "answer": false,
    "explain": "*Each entry on the list tells how many clock ticks following the previous one to wait before causing a signal.* The entries are differences; the absolute times are recovered by adding them up from the current time."
  },
  {
    "q": "The current time is 820 and signals are pending for 825, 826, 834 and 840. What is the third entry on the list?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0,
    "unit": "ticks",
    "explain": "The list is 825 − 820 = 5, 826 − 825 = 1, 834 − 826 = **8**, 840 − 834 = 6."
  },
  {
    "q": "Same list (current time 820; signals at 825, 826, 834, 840). What is Next signal when the current time reaches 830?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "ticks",
    "explain": "The first two signals fire at 825 and 826. At 826 Next signal becomes the third entry, 8; four ticks later, at 830, it is 8 − 4 = **4** (that is, 834 − 830)."
  },
  {
    "q": "At current time 1000 the list reads 2 → 5 → 3. At what time is the last signal caused?",
    "type": "numeric",
    "answer": 1010,
    "tolerance": 0,
    "explain": "Each entry counts from the one before: 1000 + 2 = 1002, + 5 = 1007, + 3 = **1010**."
  },
  {
    "q": "Each list entry after the first counts its ticks from what?",
    "options": [
      "The signal of the previous entry",
      "The current time",
      "The time the system was booted",
      "The start of the current second"
    ],
    "answer": 0,
    "explain": "*how many clock ticks following the previous one to wait*. Only the head counts from the current time; the boot time and the current second belong to the time-of-day counters."
  },
  {
    "q": "When Next signal = 0, the first item's signal is caused and the item stays on the list until the process handles the signal.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 39: *the signal corresponding to the first item on the list is caused, and that item is removed from the list.* Next signal then takes the next entry's value."
  },
  {
    "q": "What can a watchdog timer do, according to slide 40?",
    "options": [
      "Reset a system that stops running",
      "Give a user process a signal after a certain interval",
      "Tell how long a process has run",
      "Call the scheduler when a quantum ends"
    ],
    "answer": 0,
    "explain": "A watchdog timer is there to *detect and recover from crashes, infinite loops*, for example by resetting a system that stops running. A signal after an interval is the alarm system call, run time is CPU accounting, and the scheduler call ends a quantum."
  },
  {
    "q": "Watchdog timers are especially used in ___ systems.",
    "type": "text",
    "answer": ["embedded", "embedded system", "embedded systems"],
    "explain": "Slide 40: *especially used in embedded system*, pictured with an Arduino UNO board."
  },
  {
    "q": "If many signals are expected, it is more efficient to keep a separate hardware clock for each pending request.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 38: it is more efficient to *simulate multiple clocks by chaining all the pending clock requests together, sorted on time, in a linked list*, driven by the one clock."
  }
]
```
