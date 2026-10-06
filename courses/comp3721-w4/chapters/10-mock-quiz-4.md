---
title: Mock Quiz 4 (Week 4)
minutes: 35
---

The lab quizzes follow the lectures one week behind, so Quiz 4 is expected to cover Lecture 04: line coding, data elements and signal elements, data rate and signal rate, the bandwidth of a digital signal, baseline wandering, self-synchronization, DC components, and the unipolar, polar and bipolar schemes. Same rules as the real thing: one A4 or letter page of notes, single-sided and preferably hand-written, a calculator, and a unit with every calculated answer. Waveforms are written one symbol per signal element (`+` positive, `−` negative, `0` zero) with a space between bits.

```quiz
[
  {
    "q": "What is line coding?",
    "options": ["The process of converting an analog signal to digital data", "The process of converting digital data to digital signal", "The process of changing a digital signal to an analog signal for transmission", "The process of adding redundant bits to a block of data"],
    "answer": 1,
    "explain": "Line coding is the process of converting digital data to digital signal: a sequence of bits is converted to a digital signal. It is the lecture's digital-to-digital conversion."
  },
  {
    "q": "Select the items that are on the slide's list of common characteristics of line coding schemes.",
    "options": ["Crosstalk", "Baseline wandering", "DC components", "Attenuation", "Self-synchronization"],
    "answer": [1, 2, 4],
    "explain": "The six characteristics: signal element vs. data element, data rate vs. signal rate, bandwidth, baseline wandering, self-synchronization, DC components. Crosstalk and attenuation are Lecture 03 impairments."
  },
  {
    "q": "Fill in the blank: a data element is the smallest entity that can represent a piece of ________.",
    "type": "text",
    "answer": ["information"],
    "explain": "Data element (bit): the smallest entity that can represent a piece of information. There are two types, 0 and 1."
  },
  {
    "q": "Which statement describes a signal element?",
    "options": ["The smallest entity that can represent a piece of information", "The number of bits sent in 1 second", "The running average of the received signal power", "The shortest unit (timewise) of a digital signal"],
    "answer": 3,
    "explain": "A signal element (symbol, state) carries data elements and is the shortest unit (timewise) of a digital signal. The smallest entity that can represent a piece of information is the data element."
  },
  {
    "q": "Data elements are what we can send (physically); signal elements are what we need to send (logically).",
    "type": "tf",
    "answer": false,
    "explain": "The other way round. Data elements are what we **need** to send (logically). Signal elements are what we **can** send (physically)."
  },
  {
    "q": "Fill in the blank: the ratio $r$ is the number of ________ elements carried by each signal element.",
    "type": "text",
    "answer": ["data"],
    "explain": "$r$ is the number of data elements carried by each signal element. It is different for each line coding scheme."
  },
  {
    "q": "In the transportation analogy, one person is driving a car and a trailer. What is $r$?",
    "options": ["$r = 1/2$", "$r = 1$", "$r = 2$", "$r = 4/3$"],
    "answer": 0,
    "explain": "A person is a data element and a vehicle is a signal element. One person with a car and a trailer is one data element in two signal elements: $r = 1/2$. Each person driving a vehicle is $r = 1$; a carpool is $r > 1$."
  },
  {
    "q": "A signal carries four data elements in three signal elements. What is $r$?",
    "options": ["$3/4$", "$1/2$", "$4/3$", "$2$"],
    "answer": 2,
    "explain": "Slide figure d: four data elements per three signal elements, $r = 4/3$. Data elements go on top because $r$ counts data elements per signal element."
  },
  {
    "type": "match",
    "q": "Match each term to its description.",
    "pairs": [
      ["Data rate", "number of data elements sent in 1 second"],
      ["Signal rate", "number of signal elements sent in 1 second"],
      ["bps", "unit of the data rate"],
      ["baud", "unit of the signal rate"]
    ],
    "explain": "Data rate (bit rate): data elements (bits) sent in 1 second, in bps. Signal rate: signal elements sent in 1 second, in baud."
  },
  {
    "q": "Select the other names the slide gives for the signal rate.",
    "options": ["Bit rate", "Modulation rate", "Pulse rate", "Capacity", "Baud rate"],
    "answer": [1, 2, 4],
    "explain": "Signal rate = modulation rate = pulse rate = baud rate. Bit rate is the other name for the data rate."
  },
  {
    "q": "Which sentence is the slide's goal in data communications?",
    "options": ["Increase the signal rate while decreasing the data rate", "Increase both the data rate and the signal rate", "Increase the data rate while decreasing the signal rate", "Decrease both the data rate and the signal rate"],
    "answer": 2,
    "explain": "An increase in the data rate is an increase in the speed of transmission. A decrease in the signal rate is a decrease in the bandwidth requirement. The goal wants both."
  },
  {
    "q": "A signal is carrying data in which one data element is encoded as one signal element. If the bit rate is 100 kbps, what is the average value of the baud rate if $c$ is 1/2? Answer in kbaud.",
    "type": "numeric",
    "answer": 50,
    "tolerance": 0.05,
    "unit": "kbaud",
    "explain": "$r = 1$. $S = c \\times N \\times \\frac{1}{r} = \\frac{1}{2} \\times 100000 \\times \\frac{1}{1} = 50000$ baud $= 50$ kbaud."
  },
  {
    "q": "A signal carries two data elements per signal element ($r = 2$). The data rate is 64 kbps and $c = 1/2$. What is the average signal rate, in baud?",
    "type": "numeric",
    "answer": 16000,
    "tolerance": 1,
    "unit": "baud",
    "explain": "$S = c \\times N \\times \\frac{1}{r} = \\frac{1}{2} \\times 64000 \\times \\frac{1}{2} = 16000$ baud."
  },
  {
    "q": "A signal uses two signal elements for each data element ($r = 1/2$). The data rate is 10 Mbps and $c = 1/2$. What is the average signal rate, in Mbaud?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0.01,
    "unit": "Mbaud",
    "explain": "$\\frac{1}{r} = 2$. $S = \\frac{1}{2} \\times 10000000 \\times 2 = 10000000$ baud $= 10$ Mbaud. With $r = 1/2$ the average signal rate equals the data rate."
  },
  {
    "q": "A signal carries four data elements in every three signal elements and its signal rate is 3000 baud. Using $S = N/r$, what is the data rate, in bps?",
    "type": "numeric",
    "answer": 4000,
    "tolerance": 1,
    "unit": "bps",
    "explain": "$r = 4/3$ and $N = S \\times r = 3000 \\times \\frac{4}{3} = 4000$ bps."
  },
  {
    "q": "The relationship between data rate and signal rate depends on the pattern of the data, which gives three cases. Which case has the maximum signal rate?",
    "options": ["The best case", "The average case", "None: the signal rate depends on $r$ alone", "The worst case"],
    "answer": 3,
    "explain": "Worst case: maximum signal rate. Best case: minimum signal rate. Average case: the one we are usually interested in. The case factor $c$ is different for each case."
  },
  {
    "q": "The actual bandwidth of a nonperiodic digital signal is finite.",
    "type": "tf",
    "answer": false,
    "explain": "The actual bandwidth is continuous with an infinite range (theoretically). The **effective** bandwidth is finite, because many of the components have such a small amplitude that they can be ignored."
  },
  {
    "q": "Fill in the blank: the ________ rate, not the bit rate, determines the required bandwidth for a digital signal.",
    "type": "text",
    "answer": ["baud", "baud rate"],
    "explain": "The baud rate, not the bit rate, determines the required bandwidth. The bandwidth (range of frequencies) is proportional to the signal rate (baud rate)."
  },
  {
    "q": "A digital signal has a data rate of 1 Mbps with $r = 1$ and $c = 1/2$. What bandwidth does $B = c \\times N \\times \\frac{1}{r}$ give, in kHz?",
    "type": "numeric",
    "answer": 500,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "$B = \\frac{1}{2} \\times 1000000 \\times \\frac{1}{1} = 500000$ Hz $= 500$ kHz. The slide gets this formula by replacing $S$ with $B$."
  },
  {
    "q": "A channel has a bandwidth of 200 kHz. The signal has 4 levels, each level is one signal element, and $c = 1/2$. What is $N_{max}$, in kbps?",
    "type": "numeric",
    "answer": 800,
    "tolerance": 0.5,
    "unit": "kbps",
    "explain": "4 levels carry $\\log_{2} 4 = 2$ bits per level, so $r = 2$. $N_{max} = \\frac{1}{c} \\times B \\times r = 2 \\times 200000 \\times 2 = 800000$ bps $= 800$ kbps, the same as Nyquist's $2 \\times B \\times \\log_{2} L$."
  },
  {
    "q": "The slide shows that $N_{max} = \\frac{1}{c} \\times B \\times r$ agrees with the Nyquist formula. Which values does it assume?",
    "options": ["$c = 1$ and $r = L$", "$c = 1/2$ and $r = \\log_{2} L$", "$c = 1/2$ and $r = 2L$", "$c = 2$ and $r = \\log_{2} L$"],
    "answer": 1,
    "explain": "A signal with $L$ levels can carry $\\log_{2} L$ bits per level. If each level corresponds to one signal element and we assume the average case ($c = 1/2$), $N_{max} = \\frac{1}{c} \\times B \\times r = 2 \\times B \\times \\log_{2} L$."
  },
  {
    "q": "Fill in the blank: in decoding a digital signal, the receiver calculates a running average of the received signal power. This average is called the ________.",
    "type": "text",
    "answer": ["baseline"],
    "explain": "The incoming signal power is evaluated against the baseline to determine the value of the data element."
  },
  {
    "q": "What causes baseline wandering?",
    "options": ["A receiver clock that is faster than the sender clock", "A signal with too many voltage levels", "A long string of 0s or a long string of 1s", "A transition at the middle of every bit"],
    "answer": 2,
    "explain": "Baseline wandering is a drift in the baseline caused by a long string of 0s or a long string of 1s. It makes it difficult for the receiver to decode the received signal correctly, so a good line coding scheme needs to prevent it."
  },
  {
    "q": "Fill in the blank: a self-synchronizing digital signal includes ________ information in the data being transmitted.",
    "type": "text",
    "answer": ["timing"],
    "explain": "The timing information is the transitions (changes in voltage level) that alert the receiver to the beginning, middle, or end of the pulse. If the receiver's clock is out of synchronization, these points can reset the clock."
  },
  {
    "q": "The sender sends 10110001 and the receiver has a shorter bit duration than the sender. What does the receiver receive on the slide?",
    "options": ["110111000011", "10110001", "1011", "101100011011"],
    "answer": 0,
    "explain": "The receiver clock is faster, so the bit intervals are not matched and the same signal is read as 12 bits: 110111000011."
  },
  {
    "q": "In a digital transmission, the receiver clock is 0.1 percent faster than the sender clock. How many extra bits per second does the receiver receive if the data rate is 1 kbps?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0.01,
    "unit": "bps",
    "explain": "1 kbps: 1000 bits sent in 1 s. $1000 \\times (1 + 0.1\\%) = 1001$ bits received in 1 s: 1 extra bps."
  },
  {
    "q": "Same clocks (receiver 0.1 percent faster), data rate 1 Mbps. How many bits does the receiver receive in 1 second?",
    "type": "numeric",
    "answer": 1001000,
    "tolerance": 0.5,
    "unit": "bits",
    "explain": "1 Mbps: 1000000 bits sent in 1 s. $1000000 \\times (1 + 0.1\\%) = 1001000$ bits received in 1 s, which is 1000 extra bps."
  },
  {
    "q": "A receiver clock is 0.5 percent faster than the sender clock and the data rate is 64 kbps. How many extra bits per second does the receiver receive?",
    "type": "numeric",
    "answer": 320,
    "tolerance": 0.5,
    "unit": "bps",
    "explain": "64000 bits sent in 1 s. $64000 \\times (1 + 0.5\\%) = 64320$ bits received in 1 s: 320 extra bps."
  },
  {
    "q": "What are DC components?",
    "options": ["Transitions at the middle of each bit", "The highest frequencies in the spectrum of a digital signal", "The signal elements that carry no data elements", "Very low frequencies (around zero) created by a duration of fixed voltage level"],
    "answer": 3,
    "explain": "Direct Current (DC) components, or constant components, are the very low frequencies (around zero) created as a result of a duration of fixed voltage level in a digital signal. They cause problems for a system that cannot pass low frequencies or uses electrical coupling, such as a line that cannot pass frequencies below 200 Hz."
  },
  {
    "q": "With no DC component, a signal has an average amplitude of 0.",
    "type": "tf",
    "answer": true,
    "explain": "The DC component (bias) is the mean amplitude of the waveform. If the mean amplitude is zero there is no DC bias: a DC balanced or DC free waveform."
  },
  {
    "type": "match",
    "q": "Match each category of line coding scheme to its voltage levels.",
    "pairs": [
      ["Unipolar", "all the signal levels on one side of the time axis"],
      ["Polar", "voltages on both sides of the time axis"],
      ["Bipolar", "three voltage levels: positive, negative, zero"]
    ],
    "explain": "Unipolar: NRZ. Polar: NRZ, RZ, and biphase (Manchester, and differential Manchester). Bipolar: AMI."
  },
  {
    "q": "In the unipolar NRZ scheme, positive voltage defines bit 1 and the zero voltage defines bit 0.",
    "type": "tf",
    "answer": true,
    "explain": "Unipolar NRZ: positive voltage for 1, zero voltage for 0, so 10110 is `+ 0 + + 0`. Polar NRZ-L is different: positive voltage level for 0 and negative voltage level for 1."
  },
  {
    "q": "Fill in the blank: the scheme is called NRZ because the signal does not return to zero at the ________ of the bit.",
    "type": "text",
    "answer": ["middle"],
    "explain": "NRZ is non-return-to-zero: the signal does not return to zero at the middle of the bit."
  },
  {
    "q": "Which signal is 01001110 in NRZ-L, as the slide defines NRZ-L?",
    "options": ["− + − − + + + −", "+ − − − + − + +", "+ − + + − − − +", "0 + 0 0 + + + 0"],
    "answer": 2,
    "explain": "NRZ-L: positive voltage level for 0 and negative voltage level for 1, so 01001110 is `+ − + + − − − +`. The second option is the same bits in NRZ-I."
  },
  {
    "q": "Which signal is 110100 in NRZ-I? The level before the first bit is positive.",
    "options": ["− + + − − −", "− − + − + +", "+ + − + − −", "+ − − + + +"],
    "answer": 0,
    "explain": "NRZ-I: no change for 0 and change for 1. From positive: 1 inverts to −, 1 inverts to +, 0 stays +, 1 inverts to −, 0 stays −, 0 stays −. The second option is the same bits in NRZ-L."
  },
  {
    "q": "An NRZ-L signal (slide definition) is `− + − − +`. Which bits does it carry? Type the five bits.",
    "type": "text",
    "answer": ["10110", "1 0 1 1 0"],
    "explain": "Negative is 1 and positive is 0, so `− + − − +` is 10110."
  },
  {
    "q": "Select the problems the slide lists for the polar NRZ schemes.",
    "options": ["Baseline wandering", "Three voltage levels", "DC components", "No self-synchronization", "A signal rate higher than Manchester's"],
    "answer": [0, 2, 3],
    "explain": "DC components (the power density is very high around frequencies close to zero), baseline wandering (a long sequence of 0s or 1s) and no self-synchronization (a long sequence of 0s or 1s)."
  },
  {
    "q": "On the slide, how does Manchester encode each bit?",
    "options": ["0 is low-to-high, 1 is high-to-low", "0 is no change, 1 is a change", "0 is zero voltage, 1 alternates", "0 is high-to-low, 1 is low-to-high"],
    "answer": 3,
    "explain": "Slide 57: 0 is high-to-low and 1 is low-to-high, with the transition at the middle of the bit. The 04a complementary note draws the opposite assignment."
  },
  {
    "q": "Which signal is 1001 in Manchester, as the slide defines it?",
    "options": ["+− −+ −+ +−", "−+ +− +− −+", "− + + −", "+− +− +− −+"],
    "answer": 1,
    "explain": "1 is low-to-high (`−+`) and 0 is high-to-low (`+−`), so 1001 is `−+ +− +− −+`. Each bit takes two signal elements."
  },
  {
    "q": "Which signal is 0110 in differential Manchester? The level before the first bit is positive.",
    "options": ["−+ +− −+ −+", "+− −+ −+ +−", "+− +− −+ −+", "−+ −+ +− +−"],
    "answer": 0,
    "explain": "There is always a transition at the middle of the bit. At the start of a bit: inversion if the bit is 0, no inversion if the bit is 1. From positive: 0 inverts to `−+`, 1 continues as `+−`, 1 continues as `−+`, 0 inverts to `−+`. The second option is the same bits in Manchester."
  },
  {
    "q": "Select what the slide says about Manchester and differential Manchester.",
    "options": ["They use three voltage levels", "They have self-synchronization", "Their signal rate is lower than NRZ-L's", "They have no baseline wandering", "They have no DC component"],
    "answer": [1, 3, 4],
    "explain": "Self-synchronization is provided by the transition at the middle of the bit, there is no baseline wandering, and there is no DC component because each bit has a positive and negative voltage contribution. The drawback: the signal rate is **higher** compared with some other polar schemes, e.g., NRZ-L."
  },
  {
    "q": "Which two schemes are classified as differential encoding?",
    "options": ["NRZ-L and Manchester", "NRZ-I and differential Manchester", "Manchester and differential Manchester", "Unipolar NRZ and AMI"],
    "answer": 1,
    "explain": "NRZ-I and differential Manchester are classified as differential encoding: the bit is read from a change or lack of change, not from the level itself."
  },
  {
    "type": "match",
    "q": "Match each name to the slide's note about it.",
    "pairs": [
      ["Manchester", "used for IR protocols, RFID, and NFC system"],
      ["Differential Manchester", "used in 802.5 with twisted pair"],
      ["AMI", "alternate 1 inversion"],
      ["Unipolar", "on-off keying"],
      ["Bipolar", "multilevel binary"]
    ],
    "explain": "Manchester: IR protocols, RFID and NFC. Differential Manchester: 802.5 with twisted pair. AMI is Alternate Mark Inversion, alternate 1 inversion. The slide titles read Unipolar (On-Off Keying) and Bipolar (Multilevel Binary)."
  },
  {
    "q": "Fill in the blank: AMI stands for Alternate ________ Inversion.",
    "type": "text",
    "answer": ["mark"],
    "explain": "Alternate Mark Inversion: alternate 1 inversion. A 0 is a neutral zero voltage; a 1 is alternating positive and negative voltages."
  },
  {
    "q": "Which signal is 011011 in AMI? The first 1 is positive.",
    "options": ["0 + + 0 + +", "0 − + 0 − +", "0 + − 0 + −", "+ − − + − −"],
    "answer": 2,
    "explain": "0 is a neutral zero voltage and the 1s alternate between positive and negative: `0 + − 0 + −`. The first option keeps every 1 positive, which is unipolar NRZ."
  }
]
```
