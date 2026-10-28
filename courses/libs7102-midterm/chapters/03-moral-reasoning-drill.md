---
title: "Moral reasoning drill: the question that scores all or nothing"
minutes: 45
---

The practice list's lecture 1 section warns that *Most midterms and final exams include one question on moral reasoning*, and that *you may also get 0% if it's clear you don't understand validity, soundness, what is a conceptual, moral/value or empirical argument*. Here are six tasks in the exam's form, each on a new computing argument; some ask for something that cannot be done, as the exam's *"trick" questions* do. Write each answer in full before you reveal the model.

## Three tasks test what validity and soundness guarantee

The definitions these draw on are lecture 1, slides 16 to 24, and the review questions of lecture 2, slide 12.

```quiz
[
  {
    "type": "free",
    "q": "Give an example of a sound argument about phishing whose conclusion is false.",
    "model": "This cannot be done, because a sound argument cannot have a false conclusion. Lecture 1 slide 21: an argument is sound *if and only if* it is valid and all its premises are true. Slide 18 defines validity: *the truth of the premises guarantees the truth of the conclusion*; a valid argument is *truth-preserving*. So in a sound argument the premises are true, and their truth guarantees that the conclusion is true. A false conclusion means that a premise is false or that the argument is invalid, and either way the argument is not sound.\n\nWhat can be given is a valid argument with a false conclusion, which must then have a false premise. P1: Every phishing email contains a spelling mistake. P2: The email that tricked the payroll clerk was a phishing email. C: The email that tricked the payroll clerk contained a spelling mistake. The form is valid (all X are Y; this is an X; so it is a Y, a valid form like slide 19's), but P1 is false, since many phishing emails are written without errors, so the argument is unsound, and its conclusion may well be false. That is the only way a valid argument reaches a false conclusion, and it is exactly what soundness rules out.",
    "points": [
      "says it cannot be done, and why",
      "defines sound: valid and all premises true, if and only if (slide 21)",
      "defines valid: the truth of the premises guarantees the truth of the conclusion; truth-preserving (slide 18)",
      "concludes that true premises plus validity force a true conclusion",
      "gives instead a valid argument with a false premise, which is unsound"
    ],
    "rows": 8,
    "explain": "Students who do not spot the trick write an argument with a false conclusion and call it sound, which shows the marker exactly the misunderstanding that scores 0. Saying \"cannot be done\" without the reason also earns little: the mark is for the reason."
  },
  {
    "type": "free",
    "q": "Suppose an argument about a ransomware attack is valid and its conclusion is true. Must its premises be true? And if an argument is valid but not sound, is its conclusion false? Explain, with an example.",
    "model": "No to both. Validity means *the truth of the premises guarantees the truth of the conclusion* (lecture 1 slide 18): it runs one way only, from true premises to a true conclusion. It says nothing when the premises are false, and *An argument can be valid regardless of whether the premises or conclusion are true*. So a valid argument with a true conclusion may have false premises: the fourth line of slide 24, *if the conclusion is true so too must be the premises*, is false. And a valid argument that is not sound has at least one false premise (slide 21), which leaves its conclusion undetermined: it may be true or false.\n\nOne example answers both. P1: Every piece of malware is ransomware. P2: Lockbit is malware. C: Lockbit is ransomware. The form is valid (all X are Y; L is X; so L is Y). The conclusion is true, since slide 17 names Lockbit as ransomware, yet P1 is false, because spyware and keyloggers are malware but not ransomware. So the argument is valid, unsound, and has a true conclusion. Asked \"valid but not sound: is the conclusion true?\", the right answer is that we cannot tell from that information alone; we must check the conclusion itself.",
    "points": [
      "answers no: a valid argument with a true conclusion can have false premises (slide 24)",
      "says validity only guarantees a true conclusion when the premises are true; it is independent of the actual truth of premises and conclusion (slide 18)",
      "says valid but not sound means at least one premise is false, so the conclusion's truth is not settled",
      "gives a valid example with a false premise and a true conclusion"
    ],
    "rows": 8,
    "explain": "The common mistake reads validity backwards, as if a true conclusion proved the premises, or treats \"not sound\" as \"false conclusion\". Both are the lecture 2 slide 12 review questions, and the marker expects the one-way guarantee stated."
  },
  {
    "type": "free",
    "q": "Give an example of a valid premise about anti-virus software, an example of a sound inductive argument about anti-virus software, and an example of a sound argument that is not valid.",
    "model": "Neither can be given. A premise is a claim, and claims are truth-apt: *only the premises and the conclusion, being claims, are truth-apt* (lecture 1 slide 23). A premise is true or false; validity is a property of a deductive argument, the relation in which *the truth of the premises guarantees the truth of the conclusion* (slide 18). So no premise is valid, just as no argument is true: *There are no true or false arguments* (slide 16). What can be given is a true premise: \"Anti-virus software scans files for known malware signatures.\"\n\nA sound inductive argument is impossible too. Slide 17: inductive arguments *cannot be valid/invalid as there is never a guarantee the conclusion is true (they are strong/weak)*. Soundness requires validity (slide 21), so an inductive argument can never be sound. Slide 17's own example is the closest thing: \"This anti-virus has been keeping my computer safe for years, so it's likely I will not get a virus this year.\" The move from past years to this year is an *inductive leap*; the argument is fairly strong, not sound, because the premises make the conclusion likely without guaranteeing it. A new strain the software does not recognize could make the premise true and the conclusion false. Nor can a sound argument be invalid: validity is a necessary condition of soundness (slide 21).",
    "points": [
      "says a premise cannot be valid: premises are claims, true or false; validity belongs to arguments (slides 18, 23)",
      "says an inductive argument cannot be valid, only strong or weak (slide 17)",
      "says soundness requires validity, so no inductive argument is sound and no sound argument is invalid (slide 21)",
      "gives what can be given: a true premise and a strong inductive argument"
    ],
    "rows": 8,
    "explain": "These are lecture 2 slide 12's trick items. Writing a premise and calling it valid, or calling an inductive argument sound, tells the marker you do not know which words apply to claims and which to arguments, and the question is then worth 0."
  }
]
```

## Three tasks take an argument apart claim by claim

The tools are the claim types of lecture 1, slides 27 and 28, and the value argument of slides 29 and 30.

```quiz
[
  {
    "type": "free",
    "q": "Is this argument true? Is it valid? Is it sound? Say which of its claims are empirical, value or conceptual.\n\n> P1: Collecting a person's data without their consent is wrong. P2: Anyone who has not agreed to share their data has not consented to share it. P3: The city's parking app collects location data from users who never agreed to share it. C: The parking app's data collection is wrong.",
    "model": "The argument cannot be called true or false: *There are no true or false arguments* (lecture 1 slide 16); only its claims are truth-apt. It is valid. From P2 and P3 the app collects data without consent, and P1 says that doing so is wrong, so if all three premises are true the conclusion must be true (slide 18). The claims are of three types (slide 28). P1 is a value claim: a judgment of disapproval that cannot be reduced to an empirical claim. P2 is conceptual: the meaning of \"consent\" alone settles it. P3 is empirical: sensory tests, such as inspecting the app's network traffic, settle it. C is a value claim.\n\nWhether it is sound depends on whether every premise is true (slide 21). P2 is true by meaning, and P3 is true if the traffic shows it. P1 is the doubtful one: as an exceptionless rule it is an absolutist claim, and an act utilitarian would deny it, since act utilitarianism *says nothing about the whole class of actions, as it depends on the specifics of each action* (lecture 5 slide 4): collecting data without consent could be right in a case where it maximizes utility, as the dark-pattern photos that let the RCMP convict an offender may have been (slide 25). So I would not call the argument sound until P1 is defended; as an absolute principle it is probably false, which would make the argument valid but unsound.",
    "points": [
      "says the argument cannot be true or false; only its claims can (slide 16)",
      "judges it valid: true premises would guarantee the conclusion (slide 18)",
      "types P1 and C as value, P2 as conceptual, P3 as empirical (slide 28)",
      "says soundness needs every premise true and names P1 as the premise in doubt (slide 21)",
      "takes a position on soundness with a reason"
    ],
    "rows": 9,
    "explain": "The trap is to answer \"yes, it's true\" or \"it's a good argument\" before anything else. The marker wants the refusal first, then validity, then soundness with the doubtful premise named, then the claim types."
  },
  {
    "type": "free",
    "q": "Type each claim as empirical, value or conceptual, and say what settles it.\n\n> (a) The breach exposed 40,000 customer records. (b) The company should have encrypted the records. (c) Encrypted data is data that has been encoded. (d) The CEO said that the breach was regrettable. (e) The new login page is beautiful, and so is its designer. (f) Some passwords are longer than themselves.",
    "model": "Lecture 1 slide 28 gives the three tests. For an empirical claim it asks *Can we use sensory tests alone to determine the truth of the claim?* A claim is a value claim if there is *a judgment of approval/disapproval that cannot be reduced to an empirical claim*; *Moral and aesthetic claims are examples of types of value claims*. For a conceptual claim: *Can we use the meaning of the words alone to determine the truth of the claim?* A claim's type does not depend on whether it is true: a false empirical claim is still empirical.\n\n(a) is empirical: counting the exposed records settles it. (b) is a value claim, a moral one: \"should\" expresses a judgment that no count of facts settles. (c) is conceptual and true: the meaning of \"encrypted\" settles it. (d) is empirical, although it reports a value judgment: whether the CEO said those words is checked by a recording, the way slide 27's *Justin Trudeau said that…* sentence is empirical while what he said is a value claim. (e) is a value claim, aesthetic, about the page and about the designer, like slide 28's *This function is well designed and so are you*. (f) is conceptual and false: nothing can be longer than itself, so the meaning of the words alone shows it false, as with slide 28's *Some brothers have no siblings*.",
    "points": [
      "gives the three tests in slide 28's terms: sensory tests alone, approval/disapproval not reducible to empirical, meaning of the words alone",
      "types (a) empirical, (b) value, (c) conceptual",
      "types (d) empirical: a report of a value claim is itself empirical (slide 27)",
      "types (e) value (aesthetic) and (f) conceptual, false by meaning",
      "says a claim's type does not depend on its truth"
    ],
    "rows": 9,
    "explain": "The usual slips are (d), typed as value because it contains \"regrettable\", and (f), typed as empirical because it sounds like a fact about passwords. Ask what would settle the claim, not what words it contains."
  },
  {
    "type": "free",
    "q": "Is this argument against screen scraping valid? If not, add what it needs to be valid, and say what kind of claim you added and whether the repaired argument is sound.\n\n> P1: Screen scraping copies a website's data without the owner's permission. P2: This price-comparison tool screen-scrapes an airline's fare pages. C: The price-comparison tool is doing something wrong.",
    "model": "As it stands the argument is invalid. P1 and P2 are empirical claims, settled by what the tool actually does, and the conclusion is a value claim. Lecture 1 slide 29: *it is not possible to get to a value conclusion by using only empirical statements* – *no ought from is*. Slide 30 makes the same diagnosis of the resume-lies argument: *The argument is incomplete and is therefore invalid*. It was not established that copying data without permission is wrong, so the conclusion does not follow, however true the premises are.\n\nTo make it valid, add a value premise that links the facts to the verdict. P3: It is wrong to copy a website's data without the owner's permission. Now P2 and P1 place the tool's copying under P3, and the conclusion follows: the argument is valid, and the conclusion borrows its value from P3, as on slide 30. Validity does not make it sound, which also needs P3 to be true (slide 21). As an exceptionless rule, P3 is doubtful: copying publicly posted fares so that travellers can compare prices may harm no one, and an act utilitarian would judge each case by its actual outcome. So I think the repaired argument is valid but probably unsound as written; a narrower value premise, such as \"copying that harms the owner without permission is wrong\", plus an empirical premise that this copying harms the airline, would be easier to defend.",
    "points": [
      "says it is invalid: only empirical premises and a value conclusion, no ought from is (slide 29)",
      "types P1 and P2 as empirical and C as value",
      "adds a value premise that makes it valid, as in the resume-lies example (slide 30)",
      "says the added premise is a value claim",
      "says validity is not soundness and judges whether the added premise is true"
    ],
    "rows": 9,
    "explain": "Students often add another empirical premise (\"scraping costs the airline money\"), which still leaves the argument with no value premise and so still invalid. The repair must be a value claim."
  }
]
```
