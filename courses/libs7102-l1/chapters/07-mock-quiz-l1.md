---
title: "Mock quiz: Lecture 1"
minutes: 25
---

Twenty items on lecture 1 in the exam's spirit: ten on arguments, four on claim types, three trick tasks to write out, and three on egoism, Hume and Williams. Write the three trick answers before you reveal them.

```quiz
[
  {
    "q": "P1 Every app in the company store was scanned for malware.\nP2 This app is in the company store.\nC Therefore, this app was scanned for malware.\n\nIs the argument valid?",
    "options": ["Valid", "Invalid", "Neither: it is inductive", "It is a true argument"],
    "answer": 0,
    "explain": "If every app in the store was scanned and this app is in the store, it must have been scanned: the truth of the premises guarantees the conclusion. Whether it is sound depends on whether the premises are actually true. No argument is 'true'."
  },
  {
    "q": "P1 Some hackers are paid by governments.\nP2 Ana is a hacker.\nC Therefore, Ana is paid by a government.\n\nWhat is the verdict?",
    "options": ["Invalid, therefore unsound", "Valid but unsound", "Valid and sound", "Inductive, so strong or weak"],
    "answer": 0,
    "explain": "'Some' hackers leaves room for Ana to be one who is not paid by a government, so the premises can be true while the conclusion is false. Invalid arguments are always unsound."
  },
  {
    "q": "P1 All encryption can be broken in under a minute.\nP2 AES is a form of encryption.\nC Therefore, AES can be broken in under a minute.\n\nWhat is the verdict?",
    "options": ["Valid but unsound", "Valid and sound", "Invalid, therefore unsound", "Inductive, so strong or weak"],
    "answer": 0,
    "explain": "All X are Y; AES is X; so AES is Y: valid. P1 is false, so it is unsound, and here the conclusion is false too."
  },
  {
    "type": "tf",
    "q": "If an argument has a false conclusion, then either it is invalid or at least one of its premises is false.",
    "answer": true,
    "explain": "A valid argument with all premises true (a sound one) must have a true conclusion. So a false conclusion means the argument is invalid, or a premise is false, or both."
  },
  {
    "type": "tf",
    "q": "An invalid argument can have true premises and a true conclusion.",
    "answer": true,
    "explain": "Slide 22: the hackers argument's premises may be true and it is still invalid. 'Python is a language; many languages are used for the web; so Python is used for the web' has all true claims and is invalid."
  },
  {
    "q": "\"Our servers have not failed once in five years, so they will probably not fail this year.\" What kind of argument is it?",
    "options": ["Inductive: strong or weak", "Deductive and valid", "Deductive and invalid", "Deductive and sound"],
    "answer": 0,
    "explain": "A generalization from past cases, an inductive leap (slide 17). There is never a guarantee the conclusion is true, so it cannot be valid or invalid."
  },
  {
    "q": "An argument has true premises and a false conclusion. What must it be?",
    "options": ["Invalid", "Valid but unsound", "Sound", "Valid, because its premises are true"],
    "answer": 0,
    "explain": "If it were valid, true premises would guarantee a true conclusion. So it is invalid, and so unsound."
  },
  {
    "q": "P1 Either the bug is in the front end or it is in the database.\nP2 The bug is not in the front end.\nC Therefore, the bug is in the database.\n\nIs the argument valid?",
    "options": ["Valid", "Invalid", "Neither: it is inductive", "Valid only if the bug really is in the database"],
    "answer": 0,
    "explain": "Either A or B; not A; so B, the same form as slide 25's BCIT-or-Kursk argument. Validity does not depend on where the bug really is; soundness does."
  },
  {
    "type": "tf",
    "q": "Validity is a sufficient condition for soundness.",
    "answer": false,
    "explain": "Slide 21: validity is a necessary but not sufficient condition for soundness. All the premises must also be true."
  },
  {
    "q": "A report says: \"This argument is true, because all its premises are true.\" What is wrong with it?",
    "options": ["Arguments are not true or false; with true premises it is sound only if it is also valid", "Nothing: an argument with true premises is a true argument", "Only the conclusion matters, not the premises", "It should say the argument is strong"],
    "answer": 0,
    "explain": "Slides 16 and 23: arguments are not truth-apt. True premises plus validity make an argument sound; true premises alone make it nothing in particular. 'Strong' belongs to inductive arguments."
  },
  {
    "q": "\"Our password policy is unfair to users with disabilities.\" What kind of claim is it?",
    "options": ["Value", "Empirical", "Conceptual"],
    "answer": 0,
    "explain": "'Unfair' is a moral judgment of disapproval that no sensory test settles (slide 28)."
  },
  {
    "q": "\"The policy requires passwords of at least 16 characters.\" What kind of claim is it?",
    "options": ["Empirical", "Value", "Conceptual"],
    "answer": 0,
    "explain": "You settle it by reading the policy: a sensory test."
  },
  {
    "q": "\"A password of at least 16 characters has more than 15 characters.\" What kind of claim is it?",
    "options": ["Conceptual", "Empirical", "Value"],
    "answer": 0,
    "explain": "True by the meaning of the words alone, like 'There are no four-sided triangles' (slide 28)."
  },
  {
    "q": "\"Facial recognition software is less accurate for some groups of people than for others.\" What kind of claim is it?",
    "options": ["Empirical", "Value", "Conceptual"],
    "answer": 0,
    "explain": "It is settled by testing the software on different groups and measuring errors. It may support a value claim ('this is unjust'), but it is not one."
  },
  {
    "type": "free",
    "q": "Is the following argument true?\n\n> P1 All phishing is illegal in Canada.\n> P2 This email is phishing.\n> C Therefore, this email is illegal in Canada.",
    "model": "This cannot be done, because an argument is not a statement and has no truth value (slide 16): only its premises and conclusion are true or false (slide 23). What can be said is that it is valid, since true premises would guarantee the conclusion, and that it is sound only if both premises are actually true.",
    "points": ["says an argument cannot be true or false", "says only its claims are truth-apt (slides 16, 23)", "judges it valid instead, and says soundness depends on the premises being true"],
    "rows": 4,
    "explain": "Answering yes or no is the trick working on you. Name the impossibility first, then say what can be said: valid or invalid, sound or unsound."
  },
  {
    "type": "free",
    "q": "Give an example of a valid inductive argument about a spam filter.",
    "model": "This cannot be done, because inductive arguments can never be valid or invalid: there is never a guarantee their conclusion is true, so they are strong or weak (slide 17). The closest I can give is a strong inductive argument: \"The filter has caught every phishing email for two years, so it will probably catch the next one.\"",
    "points": ["says this cannot be done", "inductive arguments are strong or weak, never valid or invalid (slide 17)", "may offer a strong inductive argument and say it is not valid"],
    "rows": 4,
    "explain": "Students give a good generalization and call it valid. Validity needs a guarantee, and an inductive leap never gives one."
  },
  {
    "type": "free",
    "q": "Give a sound argument whose premises are all empirical and whose conclusion is \"You ought to patch your server.\"",
    "model": "This cannot be done, because of \"no ought from is\": a value conclusion cannot be established from empirical facts alone (slide 14). Such an argument is incomplete and therefore invalid (slide 30), and an invalid argument cannot be sound. A value premise, such as \"you ought to fix known risks to your users' data\", would make it valid, but then not every premise is empirical.",
    "points": ["says this cannot be done", "names no ought from is (slides 14, 29)", "an argument with only empirical premises and a value conclusion is invalid, so not sound (slides 21, 30)"],
    "rows": 4,
    "explain": "Students supply facts about the vulnerability. However many facts you add, the 'ought' needs a value premise."
  },
  {
    "q": "What does normative egoism claim?",
    "options": ["Everyone ought to always act out of self-interest", "Everyone is self-interested at all times", "Everyone is benevolent at least sometimes", "Selfishness is excessive concern with self-interest"],
    "answer": 0,
    "explain": "Slide 34: normative egoism is a value/normative claim. 'Everyone is self-interested at all times' is psychological egoism, an empirical claim; benevolence in everyone is Hume's point, and selfishness as excessive concern is Williams's."
  },
  {
    "type": "free",
    "q": "Psychological egoism says everyone is self-interested at all times. How does Hume argue against it?",
    "model": "Hume grants that we sometimes deceive ourselves that we are nice when we are being self-interested, but not always (slide 36). He asks of *a man, that grieves for a valuable friend, who needed his patronage and protection*, *how can we suppose that his passionate tenderness arises from some metaphysical regards to a self-interest, which has no foundation or reality?*, and *What interest can a fond mother have in view, who loses her health by assiduous attendance on her sick child, and afterwards languishes and dies of grief, when freed, by his death, from the slavery of that attendance?* Neither gains anything, so their grief cannot be explained by self-interest.\n\nSo benevolence is a natural tendency of human beings, present in everyone to some degree but mostly directed to those close to us (slide 37). We often fail to be moral not by being selfish but by directing benevolence incorrectly, as in nepotism, so moral/selfish is a false dichotomy. Slide 41 sums it up: *If Hume is right, we are all benevolent, at least sometimes, with some people. So at least some of the time we are not acting exclusively to benefit ourselves.*",
    "points": ["Hume grants self-deception sometimes, but not always (slide 36)", "gives the grieving friend or the fond mother as a counterexample", "benevolence is natural and present in everyone to some degree (slide 37)", "moral/selfish is a false dichotomy: failure is often misdirected benevolence (e.g. nepotism)"],
    "rows": 8,
    "explain": "Students say 'people are sometimes kind' without Hume's examples or his point about misdirected benevolence, which is what makes the dichotomy false."
  },
  {
    "q": "What do slide 39's two glasses of water show?",
    "options": ["Selfishness is excessive concern with one's self-interest, not self-interest as such", "Every self-interested action is selfish", "Drinking water is a moral action", "We always act to satisfy our own desires, so we are all selfish"],
    "answer": 0,
    "explain": "Drinking when thirsty is self-interested and fine; drinking two glasses when not thirsty while someone beside you dies of thirst is selfish. 'We always act to satisfy our own desires, so we are all selfish' is the argument Williams rejects on slide 38."
  }
]
```
