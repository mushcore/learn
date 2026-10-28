---
title: "Some exam tasks cannot be done, and the answer says why"
minutes: 30
---

The practice list warns that the moral-reasoning question *may include "trick" questions where your knowledge is tested by asking you to do something that cannot be done. You'll need to be able to spot the issue and explain why you cannot provide an answer.* An example offered where none can exist scores nothing; "this cannot be done, because…" with the right reason scores full marks.

## Every trick breaks one of five rules

| Rule | Slide | What it rules out |
|---|---|---|
| Only claims are true or false; an argument is not a statement and has no truth value | l1 s16, s23 | a true or false argument |
| Validity and soundness belong to arguments, not to claims | l1 s23 | a valid or sound premise |
| Inductive arguments are strong or weak, never valid or invalid | l1 s17 | a valid or sound inductive argument |
| Truth flows forward: valid with true premises gives a true conclusion; nothing flows back from the conclusion | l1 s18, s21, s24 | a sound argument with a false conclusion; a sound but invalid argument |
| No ought from is: only empirical premises cannot give a value conclusion | l1 s29–30 | a valid argument from facts alone to a moral verdict |

When a question gives you a condition and asks what follows, the trick is often the opposite: the condition settles nothing, and the right answer is "not necessarily" or "we cannot tell", with the reason.

## Lecture 2 slide 12 asks six review questions

Lecture 2 opens with this review. Write a one- or two-sentence answer to each before you reveal it.

```quiz
[
  {
    "type": "free",
    "q": "Suppose that an argument is valid. Are the premises true?",
    "model": "Not necessarily, and validity alone cannot tell us. An argument can be valid regardless of whether the premises or conclusion are true (slide 18): slide 19's \"All computers are intelligent\" is a false premise in a valid argument. Validity says only that if the premises are true, the conclusion must be true.",
    "points": ["says not necessarily / we cannot tell", "validity is independent of the actual truth of the premises (slide 18)", "validity only guarantees: if the premises are true, the conclusion is true"],
    "rows": 4,
    "explain": "Students answer 'yes', treating valid as a word for 'correct'. Valid describes the link, not the truth of what it links."
  },
  {
    "type": "free",
    "q": "Suppose that an argument is valid but not sound. Is the conclusion true?",
    "model": "We cannot tell. Valid but not sound means at least one premise is false (slide 21), and a false premise removes the guarantee, so the conclusion may be true or false. Slide 26's Dinklage argument is valid and unsound with a false conclusion; \"All coders are from Germany; Michelle is a coder; so Michelle is from Germany\" is valid and unsound with a true one.",
    "points": ["says we cannot tell: it may be true or false", "valid but not sound means at least one premise is false (slide 21)", "gives or describes one case of each, or explains why the guarantee is lost"],
    "rows": 4,
    "explain": "Students answer 'no, it is false'. An unsound argument can still have a true conclusion: unsoundness says something about the premises, not the conclusion."
  },
  {
    "type": "free",
    "q": "Suppose that an argument is valid and the conclusion is true. Are the premises true?",
    "model": "Not necessarily. Truth flows from the premises to the conclusion, never back, which is why slide 24's line \"in a deductively valid argument, if the conclusion is true so too must be the premises\" is false. \"All coders are from Germany; Michelle is a coder; so Michelle is from Germany\" is valid with a true conclusion and a false first premise.",
    "points": ["says not necessarily", "truth is preserved from premises to conclusion, not from conclusion to premises", "gives an example of a valid argument with a true conclusion and a false premise"],
    "rows": 4,
    "explain": "Students run the guarantee backwards. Validity is one-way: true premises give a true conclusion; a true conclusion gives nothing."
  },
  {
    "type": "free",
    "q": "Suppose that an argument is sound but not valid. Are the premises true?",
    "model": "This cannot be done, because the question describes an impossible argument. An argument is sound if and only if it is valid and all its premises are true (slide 21); validity is a necessary condition, so no argument can be sound but not valid. There is no such argument to ask about, so the question has no answer.",
    "points": ["says this cannot be answered: no argument is sound but not valid", "sound iff valid and all premises true (slide 21)", "validity is a necessary condition for soundness"],
    "rows": 4,
    "explain": "Students answer 'yes, sound means the premises are true' and miss the impossible condition. The marker wants the impossibility named first."
  },
  {
    "type": "free",
    "q": "Provide an example of a valid premise.",
    "model": "This cannot be done, because validity is a property of arguments, not of claims. A premise is a claim, so it can only be true or false (slide 23: only the premises and the conclusion, being claims, are truth-apt). What can be valid is the link between premises and conclusion, which is the argument itself.",
    "points": ["says this cannot be done", "a premise is a claim: it is true or false, not valid or invalid", "validity belongs to the argument, the link between premises and conclusion"],
    "rows": 4,
    "explain": "Students offer a premise that is true or plausible. A true premise is not a valid premise; there is no such thing."
  },
  {
    "type": "free",
    "q": "Provide an example of a true argument.",
    "model": "This cannot be done, because an argument is not a statement and has no truth value (slide 16: *There are no true or false arguments*). Only its premises and conclusion, being claims, can be true or false (slide 23). An argument can be valid or invalid, sound or unsound; you could offer a sound argument, but never a true one.",
    "points": ["says this cannot be done", "an argument is not a claim/statement, so it has no truth value (slides 16, 23)", "names what an argument can be instead: valid/invalid, sound/unsound"],
    "rows": 4,
    "explain": "Students give an argument with true premises and a true conclusion. That is at most a sound argument, and calling it 'true' is the mistake the question tests."
  }
]
```

| Slide 12 question | Answer |
|---|---|
| Valid: are the premises true? | Not necessarily; validity does not depend on actual truth |
| Valid, not sound: is the conclusion true? | We cannot tell; a premise is false, so the guarantee is gone |
| Valid, conclusion true: are the premises true? | Not necessarily; truth does not flow back |
| Sound but not valid: are the premises true? | Cannot be answered: no argument is sound but not valid |
| A valid premise | Cannot be done: premises are true or false |
| A true argument | Cannot be done: arguments have no truth value |

## Two more tasks cannot be done

```quiz
[
  {
    "type": "free",
    "q": "Provide an example of a sound inductive argument.",
    "model": "This cannot be done, because inductive arguments cannot be valid or invalid: there is never a guarantee their conclusion is true, so they are strong or weak (slide 17). Soundness requires validity (slide 21), so no inductive argument is sound. The most I can offer is a strong inductive argument, such as \"this anti-virus has kept my computer safe for years, so it probably will this year\".",
    "points": ["says this cannot be done", "inductive arguments are strong or weak, never valid (slide 17)", "soundness requires validity (slide 21)"],
    "rows": 4,
    "explain": "Students give a convincing generalization and call it sound. However strong, an inductive leap is never valid, so never sound."
  },
  {
    "type": "free",
    "q": "Provide a valid argument whose premises are all empirical and whose conclusion is a value claim.",
    "model": "This cannot be done, because of \"no ought from is\": a value conclusion cannot be established from empirical facts alone (slide 14). An argument with only empirical premises and a value conclusion is incomplete and therefore invalid (slide 30). Adding a value premise makes it valid, but then its premises are no longer all empirical.",
    "points": ["says this cannot be done", "names no ought from is (slides 14, 29)", "such an argument is incomplete, therefore invalid (slide 30)", "notes that a value premise is what would make it valid"],
    "rows": 4,
    "explain": "Students offer slide 30's first resume argument as an example. That argument is the slide's own example of an invalid one."
  }
]
```

Both answers have the same shape as the slide 12 tricks: name the impossibility, then give the rule and its slide. Where you can, offer the nearest thing that can exist (a strong inductive argument, a valid argument with a value premise) and say it is not what was asked.

## Spot the impossible task in six new requests

Decide whether each request can be done, and if not, which rule it breaks.

```quiz
[
  {
    "q": "\"Give an example of a sound argument with a false conclusion.\"",
    "options": ["It cannot be done: a sound argument is valid with true premises, so its conclusion must be true", "It can be done: soundness says nothing about the conclusion", "It cannot be done: arguments are not true or false", "It can be done if the argument is inductive"],
    "answer": 0,
    "explain": "Sound means valid and all premises true (slide 21), and valid with true premises guarantees a true conclusion (slide 18). The 'arguments are not true or false' answer misreads the task: it asks about the conclusion, which is a claim."
  },
  {
    "q": "\"Give an example of a valid argument with a false premise and a true conclusion.\"",
    "options": ["It can be done: e.g. all laptops are made by Apple; a MacBook is a laptop; so a MacBook is made by Apple", "It cannot be done: a valid argument must have true premises", "It cannot be done: a false premise makes an argument invalid", "It cannot be done: premises are not true or false"],
    "answer": 0,
    "explain": "Validity is independent of the actual truth of the premises (slide 18), and a false premise leaves the conclusion free to be true or false. The example is valid (all X are Y; a is X; so a is Y), with a false first premise and a true conclusion."
  },
  {
    "q": "\"Give an example of an invalid argument whose premises and conclusion are all true.\"",
    "options": ["It can be done: e.g. Python is a programming language; many languages are used for web development; so Python is used for web development", "It cannot be done: true premises and a true conclusion make an argument valid", "It cannot be done: an invalid argument always has a false conclusion", "It cannot be done: only inductive arguments can be invalid"],
    "answer": 0,
    "explain": "Every claim in the example is true, but 'many' is not 'all', so the premises do not guarantee the conclusion. Slide 22's hackers argument makes the point: the premises may be true and the argument is still invalid."
  },
  {
    "q": "\"Which premise of the following argument is valid?\"",
    "options": ["It cannot be done: premises are claims, true or false, and only arguments are valid", "It can be done: the premise that is true is the valid one", "It can be done: the premise the conclusion depends on is the valid one", "It cannot be done: premises are neither true nor false"],
    "answer": 0,
    "explain": "Slide 23: only premises and conclusions are truth-apt, and only arguments are valid or invalid. 'Premises are neither true nor false' has the rule backwards: premises are exactly the things that are true or false."
  },
  {
    "q": "\"Give an example of a valid argument with true premises and a false conclusion.\"",
    "options": ["It cannot be done: in a valid argument, true premises guarantee a true conclusion", "It can be done: validity is independent of truth", "It can be done if one premise is a value claim", "It cannot be done: arguments are not true or false"],
    "answer": 0,
    "explain": "This is the one combination validity forbids (slide 18, truth-preserving). 'Validity is independent of truth' is true of the premises taken alone, not of true premises with a false conclusion."
  },
  {
    "q": "\"Rewrite this argument so that it is true.\"",
    "options": ["It cannot be done: an argument has no truth value; it can be made valid or sound, not true", "It can be done: replace every false premise with a true one", "It can be done: make the conclusion true", "It cannot be done: only deductive arguments can be true"],
    "answer": 0,
    "explain": "Slide 16: there are no true or false arguments. Replacing false premises can make a valid argument sound, which is what the request may mean; say so, and say that 'true' is the wrong word."
  }
]
```

## The practice list's moral-reasoning question combines every check

The practice list's moral-reasoning task asks all four questions at once about one argument, and the first is a trick. Write both paragraphs before you reveal the model.

```quiz
[
  {
    "type": "free",
    "pq": "M",
    "q": "Here is an argument. Is it true? Is it valid? Is it sound? Which of its claims are empirical, value, conceptual?\n\n> P1 A phishing email is an email designed to trick its recipient into revealing private information.\n> P2 The company's IT security team sent every employee a phishing email as an unannounced test.\n> P3 It is always wrong to try to trick someone into revealing private information.\n> C Therefore, the IT security team acted wrongly.",
    "model": "The first question cannot be answered: an argument is not a statement, so it is never true or false (slide 16, *There are no true or false arguments*); only its premises and conclusion, being claims, are truth-apt (slide 23). The argument is valid. P1 and P2 say the team tried to trick employees into revealing private information, and P3 says that is always wrong, so if all three premises were true the conclusion would have to be true: *the truth of the premises guarantees the truth of the conclusion* (slide 18).\n\nAn argument is sound if and only if it is valid and all its premises are true (slide 21). P1 is true and P2 is true in the case, so soundness rests on P3, and I think P3 is false. An authorized test that teaches staff to recognize real attacks, and exposes no one's data, tricks people for their own protection; the word \"always\" makes P3 an absolute principle that this case counts against. So the argument is valid but unsound, which does not show the conclusion false. Without P3 it would be invalid, since no ought from is (slide 29): the value premise is where the real debate lies. P1 is a conceptual claim, true by the meaning of \"phishing email\"; P2 is empirical, settled by the email logs; P3 and C are value claims, judgments of disapproval that no sensory test can settle (slide 28).",
    "points": ["says an argument cannot be true or false; only its claims can (slides 16, 23)", "judges it valid: true premises would guarantee the conclusion (slide 18)", "types P1 conceptual, P2 empirical, P3 and C value (slide 28)", "judges soundness by naming P3 as the doubtful premise: valid but unsound, or soundness not established (slide 21)", "notes that without the value premise the argument would be invalid: no ought from is (slide 29)"],
    "rows": 10,
    "explain": "Students answer 'is it true?' with yes or no, which the instructor marks as not understanding validity: the question is a trick. Others call the argument invalid because they disagree with P3, but disagreeing with a premise is a soundness question, not a validity one."
  }
]
```

```quiz
[
  {
    "type": "tf",
    "q": "The right answer to \"Provide an example of a true argument\" is an argument whose premises and conclusion are all true.",
    "answer": false,
    "explain": "Arguments have no truth value (slide 16), so no example can be given. An argument with true premises that is valid is sound, not true."
  },
  {
    "q": "An argument is valid but not sound. What do you know?",
    "options": ["At least one of its premises is false", "Its conclusion is false", "Its conclusion is true", "It is inductive"],
    "answer": 0,
    "explain": "Sound is valid plus all premises true (slide 21). Valid and not sound leaves only one way to fail: a false premise. The conclusion can be either true or false."
  },
  {
    "q": "Which of these tasks can be done?",
    "options": ["Give a valid argument with a false conclusion", "Give a sound argument with a false conclusion", "Give a sound inductive argument", "Give an example of a valid premise"],
    "answer": 0,
    "explain": "A valid argument with a false premise can have a false conclusion (slide 24, and slide 26's Dinklage argument). The other three are impossible: sound guarantees a true conclusion, inductive arguments are never valid, and premises are true or false."
  },
  {
    "type": "tf",
    "q": "Every sound argument has a true conclusion.",
    "answer": true,
    "explain": "Sound means valid with all premises true, and validity guarantees that true premises give a true conclusion."
  },
  {
    "q": "The exam asks you to do something that cannot be done. What earns the marks?",
    "options": ["Saying it cannot be done and explaining which rule makes it impossible", "Giving the closest example you can and calling it an answer", "Leaving the question blank", "Giving an example and adding that the question was unclear"],
    "answer": 0,
    "explain": "The practice list: spot the issue and explain why you cannot provide an answer. You may then offer the nearest possible thing, but only after saying the task itself is impossible."
  },
  {
    "type": "tf",
    "q": "\"In a valid argument, if the conclusion is true, the premises must be true\" is correct.",
    "answer": false,
    "explain": "Slide 24's fourth line, and it is false: truth is preserved from premises to conclusion, not from conclusion to premises."
  },
  {
    "q": "Which of these can be valid or invalid?",
    "options": ["A deductive argument", "A premise", "A conclusion", "An inductive argument"],
    "answer": 0,
    "explain": "Slide 23: deductive arguments are valid/invalid and sound/unsound and can't be anything else. Premises and conclusions are true or false; inductive arguments are strong or weak."
  }
]
```
