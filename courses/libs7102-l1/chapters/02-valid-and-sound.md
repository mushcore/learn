---
title: "Valid means the premises guarantee the conclusion; sound adds true premises"
minutes: 20
---

The moral-reasoning question scores all or nothing on validity and soundness. Slides 16 to 24 give the definitions to know word for word.

## An argument is a structure of claims, so it is neither true nor false

Slide 16: *Arguments are persuasive structures containing statements with truth values: one or more premises and a conclusion.* *Premises are presented as reasons to believe the conclusion.* *The structure itself (the argument) does not have a truth value as it's not a statement.* *There are no true or false arguments.*

## Deductive arguments are valid or invalid; inductive arguments are strong or weak

Slide 17: *Deductive arguments can be valid/invalid and sound/unsound. Can you guess whether this a valid argument?*

```quiz
[
  {
    "type": "free",
    "q": "Is this argument valid? Say why before you read on.\n\n> P1 Lockbit is an example of ransomware.\n> P2 Using ransomware is a fun way to obtain ransoms from nuclear power plants and hospitals.\n> C: Lockbit is a fun way to obtain ransoms from nuclear power plants and hospitals.",
    "model": "Yes, it is valid. If Lockbit is ransomware, and using ransomware is a fun way to obtain those ransoms, then Lockbit must be a fun way to obtain them: the truth of the premises would guarantee the truth of the conclusion. The outrageous P2 does not affect validity, which is about the link between premises and conclusion. It does affect soundness: P2 is not true, so the argument is valid but unsound.",
    "points": ["says the argument is valid", "explains that true premises would guarantee the conclusion", "says a false or outrageous premise does not make it invalid, only unsound"],
    "rows": 4,
    "explain": "Students call it invalid because P2 is offensive or false. Validity never depends on whether the premises are actually true (slide 18)."
  }
]
```

The Lockbit argument is valid: a false P2 makes it unsound, never invalid. Slide 17's contrast is the inductive argument: *This anti-virus has been keeping my computer safe for years, so it's likely I will not get a virus this year.* *This attempt to generalize is called an inductive leap. They cannot be valid/invalid as there is never a guarantee the conclusion is true (they are strong/weak).*

## A valid argument is truth-preserving

Slide 18 gives *three ways of defining a valid argument*:

1. *An argument is valid if the conclusion follows from the premises.*
2. *In other words, the truth of the premises guarantees the truth of the conclusion.*
3. *When an argument is valid, we say that it is truth-preserving (if the premises are true, the conclusion must be true).*

And the line most exam errors break: *An argument can be valid regardless of whether the premises or conclusion are true.*

## Validity is a matter of structure

Slide 19: *P1 - All computers are intelligent. P2 - Intelligence makes you miserable. C - Therefore, all computers are miserable.* *Yes, the argument is valid. Look at the structure: P1 - All X are Y. P2 - All Y are Z. C - Therefore all X are Z.* Any argument of that form is valid, whatever X, Y and Z are.

Slide 20 adds two notes with two odd arguments:

- *P1. Paul is a man. P2. Rachel is Swedish. C. Paul is a man.* Valid. *The conclusion doesn't have to capture all the claims in all the premises for the argument to be valid.*
- *P1. The sky is blue. P2. The sky is not blue. C. The sky is blue.* *The conclusion can't contradict any of the premises if the argument is to be valid.*

## Sound means valid and all premises true, nothing more and nothing less

Slide 21: *Arguments can then said to be sound if and only if these two conditions are satisfied: A) the argument is valid; B) all the premises are true.* Why "if and only if"? *Because these two conditions are not just necessary but also sufficient for an argument to be sound. Nothing else is required.* *Validity, for instance, is a necessary but not sufficient condition for soundness.*

Slide 22 shows two ways to fail:

- *P1 - All computing students either already know or can learn how to hack a computer. P2 – BCIT has many computing students. C - Therefore, BCIT is nothing but a training camp for hackers.* *The premises may be true, but the above argument is invalid (the conclusion doesn't follow from the premises). Therefore, it is unsound.*
- *P1 – Michelle is a coder from Germany. P2 – All good coders are from Germany. C – Michelle is a good coder.* *Invalid argument and one false premise - therefore unsound.*

## Deductive arguments are valid or invalid, sound or unsound, and nothing else

Slide 23: *So now we know that deductive arguments can be: Valid/invalid; Sound/Unsound. They can't be anything else!* *Note that only the premises and the conclusion, being claims, are truth-apt (i.e. we can say of them that they are true or false).* *Arguments are not claims, so they are not truth-apt. They cannot ever be said to be true or false.*

Slide 24 tests the definitions with five lines. Decide each before you check.

```quiz
[
  {
    "type": "tf",
    "q": "A valid argument can have false premises.",
    "answer": true,
    "explain": "Validity is independent of whether the premises are actually true (slide 18). Slide 19's 'All computers are intelligent' is a false premise in a valid argument."
  },
  {
    "type": "tf",
    "q": "A valid argument can have a false conclusion.",
    "answer": true,
    "explain": "Yes, as long as at least one premise is false. Validity only promises that true premises give a true conclusion."
  },
  {
    "type": "tf",
    "q": "A deductively valid argument where all premises are true must have a true conclusion.",
    "answer": true,
    "explain": "That is what truth-preserving means (slide 18), and it is why every sound argument has a true conclusion."
  },
  {
    "type": "tf",
    "q": "In a deductively valid argument, if the conclusion is true so too must be the premises.",
    "answer": false,
    "explain": "Truth flows from premises to conclusion, not back. 'All coders are from Germany; Michelle is a coder; so Michelle is from Germany' is valid, and its conclusion is true (slide 22), but its first premise is false."
  },
  {
    "type": "tf",
    "q": "All sound arguments have nothing but true premises and are valid.",
    "answer": true,
    "explain": "That is the definition on slide 21: valid and all premises true."
  }
]
```

```quiz
[
  {
    "q": "Which is a correct definition of a valid argument (slide 18)?",
    "options": ["The truth of the premises guarantees the truth of the conclusion", "All of its premises and its conclusion are true", "Its conclusion is probably true given the premises", "It is a true argument"],
    "answer": 0,
    "explain": "Validity is truth-preservation. 'All premises and conclusion true' confuses validity with the truth of the claims; 'probably true' describes a strong inductive argument; and no argument is true."
  },
  {
    "q": "What can an inductive argument be?",
    "options": ["Strong or weak", "Valid or invalid", "Sound or unsound", "True or false"],
    "answer": 0,
    "explain": "Slide 17: inductive arguments cannot be valid or invalid, as there is never a guarantee the conclusion is true. They are strong or weak. Soundness requires validity, so they are not sound either."
  },
  {
    "type": "tf",
    "q": "For an argument to be valid, its conclusion must use every claim in its premises.",
    "answer": false,
    "explain": "Slide 20: 'Paul is a man. Rachel is Swedish. So Paul is a man' is valid. The conclusion doesn't have to capture all the claims in all the premises."
  },
  {
    "q": "Why does slide 21 say an argument is sound \"if and only if\" it is valid and all its premises are true?",
    "options": ["The two conditions are necessary and also sufficient: nothing else is required", "Validity alone is sufficient for soundness", "True premises alone are sufficient for soundness", "Soundness also requires a true conclusion as a third condition"],
    "answer": 0,
    "explain": "'If and only if' marks conditions that are necessary and jointly sufficient. Validity is necessary but not sufficient. A true conclusion is not an extra condition: it follows from the other two."
  },
  {
    "q": "Slide 22's hackers argument: all computing students know or can learn how to hack; BCIT has many computing students; so BCIT is nothing but a training camp for hackers. What is its verdict?",
    "options": ["Invalid, so unsound, even if the premises are true", "Valid but unsound, because a premise is false", "Sound, because both premises are true", "Strong, because it is inductive"],
    "answer": 0,
    "explain": "The conclusion doesn't follow from the premises, so it is invalid and therefore unsound, whatever the truth of the premises."
  },
  {
    "type": "tf",
    "q": "An argument whose conclusion contradicts one of its premises can be valid.",
    "answer": false,
    "explain": "Slide 20's sky argument: the conclusion can't contradict any of the premises if the argument is to be valid."
  },
  {
    "q": "Which of these can be true or false?",
    "options": ["A premise", "A valid argument", "A sound argument", "An inductive argument"],
    "answer": 0,
    "explain": "Slide 23: only the premises and the conclusion, being claims, are truth-apt. Arguments are not claims, so they cannot ever be said to be true or false."
  }
]
```
