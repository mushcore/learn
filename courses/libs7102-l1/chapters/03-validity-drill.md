---
title: "Validity drill: judge each argument valid or invalid, sound or unsound"
minutes: 25
---

Slides 25 and 26 put six arguments to you with one question, *Are these arguments valid?* Judge each one, then six new ones in computing settings, before you reveal the verdict.

## Three questions, in order, settle every verdict

1. **Deductive or inductive?** If the argument only claims its conclusion is likely (an inductive leap, slide 17), it is strong or weak, and you stop: it cannot be valid, invalid, sound or unsound.
2. **Valid?** Suppose every premise were true, whatever you think of it. Would the conclusion then have to be true? If yes, valid; if there is any way for the premises to be true and the conclusion false, invalid (slide 18).
3. **Sound?** Only if valid: are all the premises actually true? Valid with all premises true is sound; valid with a false premise is unsound; invalid is always unsound (slide 21).

Keep step 2 and step 3 apart. A silly premise never makes an argument invalid, and a true conclusion never makes it valid.

## Slide 25 gives three arguments about ChatGPT, a Tesla and BCIT

```quiz
[
  {
    "q": "Slide 25, argument 1.\n\n1.1 OpenAI's ChatGPT conversation bot is conscious (has experience/feelings).\n1.2 Every computer that can run ChatGPT is conscious. My laptop is running ChatGPT.\n1.3 My laptop is conscious.",
    "options": ["Valid but unsound", "Valid and sound", "Invalid, therefore unsound", "Inductive: strong or weak, neither valid nor invalid"],
    "answer": 0,
    "explain": "Valid: if every computer that can run ChatGPT is conscious and my laptop is running it, my laptop must be conscious. Premise 1.1 is not even needed (slide 20: the conclusion need not use every premise). Unsound: 'every computer that can run ChatGPT is conscious' is false, or at the very least not known to be true, so the argument cannot be shown sound."
  },
  {
    "q": "Slide 25, argument 2.\n\n2.1 Musk is God and Tesla can drive by itself and its advanced visual system makes all crashes impossible.\n2.2 My car is a Tesla and I have a tattoo of Elon's face on my chest.\n2.3 My car can drive by itself and it will never crash.",
    "options": ["Valid but unsound", "Valid and sound", "Invalid, therefore unsound", "Inductive: strong or weak, neither valid nor invalid"],
    "answer": 0,
    "explain": "Valid: if a Tesla drives by itself and its visual system makes all crashes impossible, and my car is a Tesla, my car drives by itself and will never crash. 'Musk is God' and the tattoo play no part, which does not matter. Unsound: 2.1 is false (Musk is not God, and Teslas do crash)."
  },
  {
    "q": "Slide 25, argument 3.\n\n3.1 BCIT is either in BC or in Kursk.\n3.2 BCIT is not in BC.\n3.3 BCIT is in Kursk.",
    "options": ["Valid but unsound", "Valid and sound", "Invalid, therefore unsound", "Inductive: strong or weak, neither valid nor invalid"],
    "answer": 0,
    "explain": "Valid by its form: either A or B; not A; so B. If both premises were true, BCIT would have to be in Kursk. Unsound, because 3.2 is false: BCIT is in BC."
  }
]
```

All three are valid, and none is sound. Each shows that validity survives premises that are obviously false.

## Slide 26 gives three more, and only the last is invalid

```quiz
[
  {
    "q": "Slide 26, argument 4.\n\n4.1 Peter Dinklage is taller than Shaquille O'Neil.\n4.2 Shaquille O'Neill is taller than Emilia Clarke.\n4.3 Peter Dinklage is taller than Emilia Clarke.",
    "options": ["Valid but unsound", "Valid and sound", "Invalid, therefore unsound", "Inductive: strong or weak, neither valid nor invalid"],
    "answer": 0,
    "explain": "Valid: 'taller than' carries over, so if A is taller than B and B than C, A is taller than C. Unsound: 4.1 is false (Dinklage is about 1.35 m, O'Neal about 2.16 m). The conclusion is false too, which is exactly what slide 24 allows: a valid argument can have a false conclusion when a premise is false."
  },
  {
    "q": "Slide 26, argument 5.\n\n5.1 All software developers apply for well-paying jobs.\n5.2 Jane is a person who has a developer job she applied for.\n5.3 Jane has a well-paying job.",
    "options": ["Valid but unsound", "Valid and sound", "Invalid, therefore unsound", "Inductive: strong or weak, neither valid nor invalid"],
    "answer": 0,
    "explain": "Valid. Read 5.1 as the slide states it: every job a software developer applies for is well-paying. Jane has a developer job, so she is a developer, and she applied for that job. If both premises were true, that job would have to be well-paying, so Jane would have a well-paying job (slide 18). Unsound: 5.1 is false, since not every developer applies only for well-paying jobs. Read 5.1 as 'developers apply for some well-paying jobs' and it would be invalid; on the exam, state the reading you use."
  },
  {
    "q": "Slide 26, argument 6.\n\n6.1 Consumer-level drones can potentially be flown into the flight path of a commercial airplane.\n6.2 A plane can crash if it collides with a drone and a turbine gets damaged.\n6.3 Drones are dangerous and shouldn't be flown.",
    "options": ["Invalid, therefore unsound", "Valid but unsound", "Valid and sound", "Inductive: strong or weak, neither valid nor invalid"],
    "answer": 0,
    "explain": "Invalid. Both premises are empirical, and 'shouldn't be flown' is a value conclusion: no ought from is (slide 14, slide 29). Nothing in the premises says that what could cause a crash should not be done. The premises are plausibly true, and the argument is still unsound because it is invalid."
  }
]
```

Argument 4 is valid with a false conclusion; argument 5 is valid but rests on the false generalization 5.1; argument 6 jumps from what is to what ought to be done. That last gap is the one the exam asks you to repair.

```quiz
[
  {
    "type": "free",
    "q": "Add one premise that makes slide 26's argument 6 valid, and say what kind of claim it is.",
    "model": "Add a value premise such as: \"Anything that can potentially cause a commercial airplane to crash is dangerous and shouldn't be flown.\" With 6.1 and 6.2 it guarantees 6.3, that drones are dangerous and shouldn't be flown. It is a value claim: it approves or disapproves of an action in a way that sensory tests alone cannot settle. Without it, the argument tries to get an ought from an is. The repaired argument is valid; whether it is sound now depends on whether the value premise is true, and it is doubtful, since it would ground every drone.",
    "points": ["adds a premise that makes the conclusion follow", "the added premise is a value claim (should/ought)", "names the original gap as no ought from is", "notes that validity now holds but soundness depends on the new premise"],
    "rows": 4,
    "explain": "Students add another empirical fact ('drones have caused near misses'). More facts never close the gap to a 'should': only a value premise does (slide 30)."
  }
]
```

## Judge six new arguments in computing settings

The same three questions, new arguments. Verdicts only; the explanations show each step.

```quiz
[
  {
    "q": "P1 All ransomware encrypts files and demands payment.\nP2 This program encrypts files and demands payment.\nC Therefore, this program is ransomware.",
    "options": ["Invalid, therefore unsound", "Valid but unsound", "Valid and sound", "Inductive: strong or weak, neither valid nor invalid"],
    "answer": 0,
    "explain": "Invalid. The form is: all X are Y; this is Y; so this is X. P1 does not say only ransomware encrypts files and demands payment, so both premises can be true of something that is not ransomware (say, a security test tool built to behave like it). Compare slide 22's Michelle argument."
  },
  {
    "q": "P1 An IPv4 address is made of four octets.\nP2 An octet is eight bits.\nC Therefore, an IPv4 address is 32 bits long.",
    "options": ["Valid and sound", "Valid but unsound", "Invalid, therefore unsound", "Inductive: strong or weak, neither valid nor invalid"],
    "answer": 0,
    "explain": "Valid: four groups of eight bits must be 32 bits. Both premises are true (P2 is true by the meaning of 'octet'), so it is sound, and its conclusion is true."
  },
  {
    "q": "P1 All open-source software is free of security bugs.\nP2 Linux is open-source software.\nC Therefore, Linux is free of security bugs.",
    "options": ["Valid but unsound", "Valid and sound", "Invalid, therefore unsound", "Inductive: strong or weak, neither valid nor invalid"],
    "answer": 0,
    "explain": "Valid: all X are Y; Linux is X; so Linux is Y. Unsound: P1 is false, since open-source software has security bugs like any other."
  },
  {
    "q": "P1 Python is a programming language.\nP2 Many programming languages are used for web development.\nC Therefore, Python is used for web development.",
    "options": ["Invalid, therefore unsound", "Valid and sound", "Valid but unsound", "Inductive: strong or weak, neither valid nor invalid"],
    "answer": 0,
    "explain": "Invalid. 'Many' is not 'all', so Python could be one of the languages not used for the web while both premises stay true. Every claim here happens to be true, and the argument is still invalid, so unsound (slide 22's hackers argument makes the same point)."
  },
  {
    "q": "Every login attempt from this IP address over the last month has been an attack, so the next attempt from it will probably be an attack too.",
    "options": ["Inductive: strong or weak, neither valid nor invalid", "Valid and sound", "Valid but unsound", "Invalid, therefore unsound"],
    "answer": 0,
    "explain": "An inductive leap from past cases to a likely future one (slide 17). There is never a guarantee the conclusion is true, so it is strong or weak (fairly strong here), never valid or invalid, and so never sound or unsound."
  },
  {
    "q": "P1 Scraping a website collects data its owners chose to publish.\nP2 Scraping at high speed slows the site down for other users.\nC Therefore, you should not scrape that site at high speed.",
    "options": ["Invalid, therefore unsound", "Valid and sound", "Valid but unsound", "Inductive: strong or weak, neither valid nor invalid"],
    "answer": 0,
    "explain": "Invalid: two empirical premises and a value conclusion, so no ought from is (slide 29). Adding a value premise such as 'you should not slow down a service for its other users' would make it valid."
  }
]
```
