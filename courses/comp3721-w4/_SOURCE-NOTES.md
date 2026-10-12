# COMP 3721 Week 4 (lecture 04, 04a) — facts and worked answers transcribed from the instructor's material

Source files: `D:/BCIT/COMP3721/lectures/COMP3721 - 04 - Week 4 - Copy.pdf` (64 slides, file dated 2026-10-01, downloaded 2026-10-06),
`lectures/COMP3721 - 04a - Complementary Notes.pdf` (2 pages, "Baseline Wandering and Self-Synchronization (Clock Recovery)", from Peterson & Davie, *Computer Networks: A Systems Approach*, 5th ed., ch. 2).
Exercise sheet: `exercises/COMP3721 - E04 - Week 4 Exercises with Answers.pdf` (7 pages, posted after the 2026-10-06 build; worked in lessons 02, 05 and 09 and in the mock quiz, see the E04 section at the end). Lesson 09's drawing patterns are still our own.
Textbook: Forouzan, *Data Communications and Networking with TCP/IP Protocol Suite*, 6th ed. Reading for 04: Ch 2 §2.3.1, §2.8 (practice test).
**The 6th edition's §2.3.1 has one paragraph on line coding (Figure 2.8, encoder/decoder) and no schemes, and §2.8 has no line-coding problems.** The slide figures carry an earlier edition's labels ("Figure 4.6"). The slides and 04a are the only sources for this module.

## 04 — Line coding, data and signal elements (slides 2-19)
- Learning outcomes: explain data rate and signal rate; compute the bandwidth of a digital signal; explain line coding schemes and their characteristics.
- "A computer network is designed to send information from one point to another. This information needs to be converted to either a digital signal or an analog signal for transmission." This lecture: digital-to-digital conversion (convert digital data to digital signals).
- Line coding: "The process of converting digital data to digital signal." "A sequence of bits is converted to a digital signal." Figure: sender, encoder, link, decoder, receiver.
- Slide 4 also shows a chart "Common Binary Line Code Formats" (NRZ-L, NRZ-M, NRZ-S, RZ, Biphase-L (Manchester), Biphase-M, Biphase-S, Differential Manchester, Delay modulation, Bipolar) for 1 0 1 1 0 0 0 1 1 0 1. It is not taught; **its NRZ-L row draws 1 high.**
- Six common characteristics: signal element vs. data element; data rate vs. signal rate; bandwidth; baseline wandering; self-synchronization; DC components.
- Data element (bit): the smallest entity that can represent a piece of information; what we need to send; two types, 0 and 1. Signal element (symbol, state): carries data elements; the shortest unit (timewise) of a digital signal. Boxed: "Data elements are what we need to send (logically). Signal elements are what we can send (physically)."
- Ratio (r): the number of data elements carried by each signal element; different for each line coding scheme.
- Transportation analogy: data element = person, signal element = vehicle; r = 1 each person is driving a vehicle; r > 1 more than one person in a vehicle (a carpool); r = 1/2 one person driving a car and a trailer.
- Figures: a. one data element per one signal element (r = 1), bits 1 0 1 drawn low, high, low; b. one per two (r = 1/2), every bit drawn low then high; c. two per one (r = 2), 11 01 11; d. four per three (r = 4/3), 1101.

## 04 — Data rate, signal rate, bandwidth (slides 20-37)
- Data rate (bit rate): number of data elements (bits) sent in 1 second; bps; increase in the data rate → increase in the speed of transmission.
- Signal rate (modulation rate, pulse rate, baud rate): number of signal elements sent in 1 second; baud; decrease in the signal rate → decrease in the bandwidth requirement.
- Boxed: "A goal in data communications is to increase the data rate while decreasing the signal rate."
- FYI microcontrollers: a serial connection on an Arduino specifies a baud rate on the pin; "the baud rate determines how fast data is sent over a serial line (consider the ratio r)"; the pin must receive the same number of signal elements in a second as the sensor connected to it.
- S = N/r. "This relationship, of course, depends on the value of r and the pattern of the data." Three cases: worst (maximum signal rate), best (minimum signal rate), average (we are usually interested in). S_avg = c × N × 1/r, c = case factor (different for each case).
  - Lesson 02 gives a reason for "the pattern of the data" (all 1s or all 0s against alternating 0s and 1s) attributed to an earlier edition of the textbook. **From memory, unverified against a file on disk.**
- Example: one data element per signal element, 100 kbps, c = 1/2: r = 1; S = 1/2 × 100000 × 1/1 = 50000 baud = **50 kbaud**.
- Bandwidth: the actual bandwidth of a nonperiodic digital signal is continuous with an infinite range (theoretically); the effective bandwidth is finite (many components have such a small amplitude that they can be ignored). "The baud rate, not the bit rate, determines the required bandwidth for a digital signal." Bandwidth is proportional to the signal rate: replace S with B: **B = c × N × 1/r**.
- N = 1/c × B × r ("Date rate of a channel", the slide's typo). Agreement with Nyquist: L levels carry log2 L bits per level; each level one signal element, average case c = 1/2: **N_max = 1/c × B × r = 2 × B × log2 L**.

## 04 — Baseline wandering, self-synchronization, DC components (slides 38-52)
- Baseline: "In decoding a digital signal, the receiver calculates a running average of the received signal power. This average is called the baseline." The incoming signal power is evaluated against it to determine the value of the data element.
- Baseline wandering: a drift in the baseline caused by a long string of 0s or a long string of 1s; difficult for the receiver to decode correctly. Boxed: "A good line coding scheme needs to prevent baseline wandering." FYI: an ECG baseline wanders because of something like breathing; in data communication because of the pattern of the information.
- Self-synchronization: the receiver clock must be synchronized with the sender clock (bit intervals must correspond exactly) to correctly interpret the received signals. A self-synchronizing digital signal includes timing information in the data being transmitted: transitions that alert the receiver to the beginning, middle, or end of the pulse (they can reset the clock).
- Figure: sender sends **10110001**, receiver with a shorter bit duration receives **110111000011** (figure draws 1 high).
- Example: receiver clock 0.1 percent faster. 1 kbps: 1000 × (1 + 0.1%) = 1001 received, **1 extra bps**. 1 Mbps: 1001000 received, **1000 extra bps**.
- DC components: the very low frequencies (around zero) created by a duration of fixed voltage level; problem for a system that cannot pass low frequencies or uses electrical coupling (e.g., a line that cannot pass frequencies below 200 Hz). With no DC component a signal has an average amplitude of 0. "DC component (bias): The mean amplitude of the waveform." Zero mean = DC balanced or DC free.
- Example figure: a composite analog signal between -1.0 and 1.0; the same signal with an added DC component runs 0.0 to 2.0; the frequency-domain plot has a spike at 0 (about 1.0) next to components at 1 and 3.

## 04 — Schemes (slides 53-62)
- Tree: Unipolar: NRZ. Polar: NRZ, RZ, and biphase (Manchester, and differential Manchester). Bipolar: AMI. **RZ has no slide.**
- Unipolar (on-off keying): all the signal levels on one side of the time axis, either above or below. NRZ: the signal does not return to zero at the middle of the bit. Positive voltage defines bit 1, zero voltage defines bit 0. Figure 1 0 1 1 0 = `+ 0 + + 0`.
- Polar: voltages on both sides of the time axis. NRZ-L (Level): two levels of voltage amplitude, **positive for 0, negative for 1**. NRZ-I (Invert): the change or lack of change in the level determines the value of the bit; no change for 0, change for 1. Figure 0 1 0 0 1 1 1 0: NRZ-L `+ − + + − − − +`, NRZ-I `+ − − − + − + +` (level before the first bit positive). Legend: open dot no inversion, next bit is 0; filled dot inversion, next bit is 1.
- Polar schemes, problems: DC components (power density very high around frequencies close to zero); baseline wandering (a long sequence of 0s or 1s); no self-synchronization (a long sequence of 0s or 1s).
- Manchester: **0 is high-to-low, 1 is low-to-high**. Differential Manchester: always a mid-bit transition; open dot no inversion, next bit is 1; filled dot inversion, next bit is 0. Figure 0 1 0 0 1 1: Manchester `+− −+ +− +− −+ −+`; differential Manchester `−+ +− +− +− −+ +−` (level before the first bit positive).
- Boxes: "Popular techniques for data transmission." Manchester "is used for IR protocols, RFID, and NFC system." "NRZ-I and differential Manchester are classified as differential encoding." Differential Manchester "Used in 802.5 with Twisted Pair." FYI: an IR remote control, most codes 8 to 32 bits long, Bi-Phase or Manchester encoding.
- Manchester and differential Manchester: have self-synchronization (the transition at the middle of the bit); no baseline wandering; no DC component (each bit has a positive and negative voltage contribution); drawback: signal rate higher compared with some other polar schemes, e.g., NRZ-L.
- Bipolar (multilevel binary): three voltage levels, positive, negative, zero; one data element at zero, the other alternates between positive and negative. AMI (Alternate Mark Inversion, "alternate 1 inversion"): 0 → a neutral zero voltage; 1 → alternating positive and negative voltages. Figure 0 1 0 0 1 0 = `0 + 0 0 − 0`.

## 04a — Complementary note (Peterson & Davie)
- NRZ here: 1 high, 0 low. Two problems of long strings of 1s or 0s: baseline wander (the receiver keeps an average of the signal seen so far; too many consecutive 1s or 0s change it) and clock recovery (frequent transitions are needed).
- A separate clock wire is avoided because it makes the cost of cabling twice as high; the receiver derives the clock from the received signal; a long period without a transition leads to clock drift.
- NRZI: transition to encode a 1, stay to encode a 0; "solves the problem of consecutive 1s, but obviously does nothing for consecutive 0s."
- Manchester: the exclusive OR of the NRZ-encoded data and the clock (clock alternates low to high); **0 is low-to-high, 1 is high-to-low, the mirror image of slide 57.** Differential Manchester: 1 has its first half equal to the last half of the previous bit's signal, 0 opposite (agrees with slide 57).

## Conflicts the lessons flag
- NRZ-L polarity: slide 55 (0 positive) against slide 4's chart, the slide-46 figure and 04a (1 high). Lessons use slide 55. **E04 figure (a) draws 0 high and 1 low, so the posted answer sheet agrees with slide 55; the conflict is resolved in favour of the slides.**
- Manchester polarity: slide 57 against 04a. Lessons use slide 57.

## Beyond the slides (labelled as such in the lessons)
- r per scheme (NRZ schemes and AMI 1, Manchester schemes 1/2) is read from the figures; "S = N/2 for r = 1 and S = N for r = 1/2 at c = 1/2" is computed from the slide formula.
- AMI's properties (no transition in a run of 0s, mean near zero) and unipolar NRZ's are derived from the rules; the slides state properties only for polar NRZ and the Manchester schemes.
- Slower-clock arithmetic (1 − p%) and the two-thirds reading of the 8-to-12-bit figure are computed, not printed.
- The widgets' running average (time constant of 6 bit durations) and the `clock-drift` rule that a sample on an edge reads the higher level are modelling choices; the second one reproduces the slide's 110111000011 at 1.5×.

## E04 (posted after the build) — questions and official answers
Source: `exercises/COMP3721 - E04 - Week 4 Exercises with Answers.pdf`, 7 pages, each question on one page and its answer on the next.
1. "In a digital transmission, the receiver clock is 0.2 percent faster than the sender clock. How many extra bits per second does the receiver receive if the data rate is 1 Mbps?" Answer: data rate 1 Mbps = 1,000,000 bps; bits received per second = 1,000,000 + 1,000,000 × 0.2% = 1,002,000, **2,000 extra bps**. "Or 0.2% × 1000,000 = 0.002 × 1000,000 = 2,000 extra bps." (Lesson 05 paragraph and quiz item; lesson 09; mock quiz. The 250 kbps / 500 bps item in lesson 05 is ours and stays.)
2. "An analog signal has a bit rate of 8000 bps and a baud rate of 1000 baud. How many data elements are carried by each signal element? How many signal elements do we need? Assume c = 1 and each signal element corresponds to a signal level." Answer: S = c × N × 1/r → r = N/S = 8000/1000 = **8 bits per baud**; since each signal element corresponds to a signal level, r = log2 L → L = 2^r = 2^8 = **256**. (Lesson 02 section "E04: the ratio and the levels from two rates"; lesson 09; mock quiz. The remark that c = 1/2 would give r = 4 is ours.)
3. "The figure below shows the encoding of a bit sequence using two different line coding schemes. Indicate the category (unipolar, polar, bipolar) of the line coding schemes used in (a) and (b). Give the reasoning for your answer." Figure: bits 0 1 0 0 1 1 0 0 0 1 1 over a shared time axis; (a) a two-level signal, **high for 0 and low for 1** (`+ − + + − − + + + − −`); (b) 0 on the axis, 1s alternating + − + − (`0 + 0 0 − + 0 0 0 − +`). Answer: a) "Polar scheme since we have two voltage levels on both sides of the time axis." b) "Bipolar scheme (AMI) since we have three voltage levels on both sides of the time axis (positive, negative and zero) and the voltage level for data element (bit) 1 alternates between positive and negative." **Figure (a) draws 0 high, agreeing with slide 55's NRZ-L convention.** (Lesson 09 section "E04, worked" with a `line-code` compare widget on `01001100011`; mock quiz, with the two signals written in the lesson's `+ − 0` notation since the quiz cannot show the figure.)
