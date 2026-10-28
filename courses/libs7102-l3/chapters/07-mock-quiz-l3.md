---
title: "Mock quiz: Lecture 3"
minutes: 40
---

Eighteen items over the whole of Lecture 3: twelve one-line positions to classify, four quick items on Rachels and the fallacy, then two exam-style written answers, each with a computing case. Write each written answer in two paragraphs before you reveal the model.

```quiz
[
  {
    "q": "\"Surveys show that developers in some countries see screen scraping as theft, and developers in others see it as fair use.\" Which position is this?",
    "options": ["Descriptive relativism (an empirical claim)", "Normative relativism", "Objectivist, absolutist", "Objectivist, non-absolutist"],
    "answer": 0,
    "explain": "It reports what people believe, like Rachels's claim 1 (slide 17). It says nothing about what is right."
  },
  {
    "q": "\"Screen scraping is wrong here, but in countries where it is accepted, it is right there.\" Which position is this?",
    "options": ["Normative relativism", "Descriptive relativism (an empirical claim)", "Objectivist, non-absolutist", "Objectivist, absolutist"],
    "answer": 0,
    "explain": "What is right is fixed by the local code: claim 5, *the moral code of a society determines what is right in that society* (slide 17)."
  },
  {
    "q": "\"Padding a resume is wrong for anyone, anywhere, with no exceptions.\" Which position is this?",
    "options": ["Objectivist, absolutist", "Objectivist, non-absolutist", "Relativist, absolutist", "Descriptive relativism (an empirical claim)"],
    "answer": 0,
    "explain": "A universal claim with *at least one principle that ought never to be violated* (Pojman, slide 28)."
  },
  {
    "q": "\"Sharing a customer's data without consent is wrong everywhere, unless it is the only way to stop an attack that would harm many people.\" Which position is this?",
    "options": ["Objectivist, non-absolutist", "Objectivist, absolutist", "Normative relativism", "Relativist, non-absolutist"],
    "answer": 0,
    "explain": "Universal (objectivist) and responsive to *the circumstances of the action* (non-absolutist, slide 36). \"Unless\" is about circumstances, not culture, so it is not relativism."
  },
  {
    "q": "The founder of an ad-tracking start-up says: \"Tracking users across sites is fine everywhere, for everyone.\" Which description fits best?",
    "options": ["Objectivist, but likely biased (not objective)", "Normative relativism", "Descriptive relativism (an empirical claim)", "Relativist, absolutist"],
    "answer": 0,
    "explain": "A universal claim, so objectivist; his income depends on it, so probably not psychologically objective. Slide 24: *moral objectivists can be biased*."
  },
  {
    "q": "\"Whatever my company's code of conduct says is right is right for the people who work there.\" Which position is this?",
    "options": ["Normative relativism", "Objectivist, absolutist", "Objectivist, non-absolutist", "Descriptive relativism (an empirical claim)"],
    "answer": 0,
    "explain": "Right is fixed by the group's code. Riley's *\"If you work for Amazon, you need to fully support whatever it does\"* is the slide's version (slide 31)."
  },
  {
    "q": "\"Canadians must never write phishing emails, whatever the circumstances.\" Which position is this?",
    "options": ["Relativist, absolutist", "Objectivist, absolutist", "Objectivist, non-absolutist", "Descriptive relativism (an empirical claim)"],
    "answer": 0,
    "explain": "Like *\"Canadians shouldn't lie!\"* (slide 29): a principle never to be violated, but only for one group."
  },
  {
    "q": "\"Whether any security researcher, anywhere, should publish a flaw depends on whether the vendor has had time to fix it.\" Which position is this?",
    "options": ["Objectivist, non-absolutist", "Normative relativism", "Objectivist, absolutist", "Descriptive relativism (an empirical claim)"],
    "answer": 0,
    "explain": "\"It depends\" on the circumstances of the action, not on the judge's culture: circumstantialism, not relativism (slide 33; lecture 4 slide 6)."
  },
  {
    "q": "\"In one country, most people think that phishing the naive is a fair way to make money.\" Which position is this?",
    "options": ["Descriptive relativism (an empirical claim)", "Normative relativism", "Objectivist, non-absolutist", "Relativist, absolutist"],
    "answer": 0,
    "explain": "A report of what people believe, like slide 27's *\"Europeans consider that earning money from phishing and hacking is morally OK\"*."
  },
  {
    "q": "A developer raised by two privacy activists says: \"Every company in the world should encrypt all user data.\" Which description fits best?",
    "options": ["Objectivist, but possibly not objective (influenced by upbringing)", "Normative relativism", "Descriptive relativism (an empirical claim)", "Relativist, absolutist"],
    "answer": 0,
    "explain": "A universal claim, so objectivist. The course notes' example is the child of musicians who values intellectual property: an objectivist need not be unbiased. The view may still be right."
  },
  {
    "q": "\"Conflicts of interest are wrong only where the local business culture says they are.\" Which position is this?",
    "options": ["Normative relativism", "Objectivist, non-absolutist", "Objectivist, absolutist", "Descriptive relativism (an empirical claim)"],
    "answer": 0,
    "explain": "Right and wrong depend on *the cultural context of who is doing the judging* (slide 36)."
  },
  {
    "q": "\"Lying to a client is wrong everywhere, though in some circumstances, such as protecting a whistle-blower's identity, it is right.\" Which position is this?",
    "options": ["Objectivist, non-absolutist", "Objectivist, absolutist", "Normative relativism", "Relativist, non-absolutist"],
    "answer": 0,
    "explain": "Slide 33: *in some circumstances it's moral to lie* is circumstantialism. The relativist non-absolutist would say it only for one culture (*\"Canadians value honesty but consider other values\"*)."
  },
  {
    "type": "match",
    "q": "Match each item from Rachels (slides 17–18) to its classification.",
    "pairs": [
      ["Different societies have different moral codes", "descriptive relativism: true"],
      ["The moral code of a society determines what is right in that society", "normative relativism: a mistake"],
      ["The cultural differences argument", "invalid: no ought from is"]
    ],
    "explain": "Claim 1 is true and empirical; claims 2–6 are normative relativism (slide 17); the argument from 1 to the rest is invalid (slide 18)."
  },
  {
    "q": "Which of these belong to normative moral relativism (slide 17)? Select all.",
    "options": ["There is no objective standard to judge one societal code better than another", "The moral code of our own society has no special status", "There is no universal truth in ethics", "It is arrogance to judge the conduct of other peoples", "Different societies have different moral codes"],
    "answer": [0, 1, 2, 3],
    "explain": "Claims 2–6 are normative (claim 5 is the one not listed here). Claim 1, *different societies have different moral codes*, is descriptive and true."
  },
  {
    "q": "A code reviewer rejects a junior developer's report of a security flaw because \"you've shipped bugs yourself.\" What is wrong with the reviewer's reasoning?",
    "options": ["It is an appeal to hypocrisy: whether the flaw is real is independent of the reporter's own record", "Nothing: those who are not perfect should not judge", "It is relativist, because it depends on the team's culture", "It is an empirical claim, so it cannot be wrong"],
    "answer": 0,
    "explain": "Slide 12: *these are two entirely distinct and independent issues*. \"Those who are not perfect should not judge\" is the Matthew 7 line that slide 11 says, *if taken literally*, is wrong."
  },
  {
    "type": "tf",
    "q": "Because the cultural differences argument is invalid, its conclusion must be false.",
    "answer": false,
    "explain": "Slide 19: *it is logically possible that the conclusion … might still be true, for other reasons.* That is why Rachels adds the reductio."
  },
  {
    "type": "free",
    "q": "Is the team lead's argument valid? Identify the relativist claims in it and give two arguments against them.\n\n> A team lead at an outsourcing firm says: \"In our client's country, paying officials to win government contracts is normal. Different cultures have different moral codes, so there's no objective truth about bribery. Who are we to say it's wrong there?\"",
    "model": "The team lead starts from descriptive relativism, the empirical claim that *different societies have different moral codes* (Rachels's claim 1, slide 17), which is true: the client's country may well accept bribery. He concludes that *there is no objective truth* about bribery and that judging it is arrogance, which are normative claims (claims 4 and 6, *a mistake with serious consequences*). This is Rachels's cultural differences argument, and it is not valid: it moves from what people believe to what is right, *no ought from is* (slide 18). That officials accept bribes does not show bribery is right, any more than some people believing the Earth is flat means they should believe it.\n\nSince an invalid argument could still have a true conclusion (slide 19), the second argument is Rachels's reductio. If the team lead were right, we could not criticize any society's customs, we could learn right from wrong by consulting local standards, and there could be no moral progress, so an anti-corruption reform in that country would be no improvement. There may also be less disagreement than it seems (slide 20): officials who take bribes rarely defend corruption openly, and the public they harm has an interest in its own welfare, which Rachels calls *a value internal to all viable cultures* (slide 22). The firm can judge the practice without interfering in the country, by refusing to pay.",
    "points": ["identifies the premise as descriptive relativism, true and empirical (slide 17)", "identifies the conclusion as normative relativism (no objective truth, do not judge)", "says the argument is invalid: ought from is (slide 18)", "gives the reductio: no criticism, consult local standards, no moral progress (slide 19)", "applies it to the bribery case, or uses less disagreement / judging without interfering"],
    "rows": 9,
    "explain": "Students say the argument is invalid because the premise is false; the premise is true, and the flaw is the step from it. Saying bribery is wrong \"because it is illegal\" swaps a moral question for a legal one."
  },
  {
    "type": "free",
    "q": "What mistakes does this manager make about objectivism? Explain using the course's definitions.\n\n> A manager tells her team: \"I'm a moral objectivist, which means I'm always objective. That's also why our rule against sharing user data has no exceptions, ever. And as an objectivist I can't tolerate anyone on this team holding different views on anything.\"",
    "model": "She makes three mistakes. First, being a moral objectivist is not being objective: objectivism is *a philosophical position* that moral relativism is wrong, while being objective *describes their psychology*, being impartial and unbiased (slide 24). Objectivists *can be biased*; Hitler and Gandhi were both objectivists. Second, objectivism is not absolutism. Pojman's objectivism holds that *there is a fact of the matter as to whether any given action is morally permissible or impermissible*, not depending solely on custom or acceptance; absolutism holds that *there is at least one principle that ought never to be violated* (slide 28). An objectivist can be a non-absolutist, like the utilitarian, for whom right and wrong respond to the circumstances of the action (slide 36).\n\nThird, objectivism does not rule out tolerance. Each objectivist commits to *some core group of values* where tolerance is inappropriate, such as fraud or harassment, and *only outside this core tolerance is meaningful* (slide 35). Her team can differ on coding style, working hours, politics or religion without any threat to her objectivism. Her rule on user data may even be a good one, but she would hold it as an absolutist, not because objectivism requires it. A non-absolutist objectivist could allow sharing data to stop an attack in progress, and that \"it depends\" would not be relativism.",
    "points": ["says objectivist is not objective: a philosophical position vs a description of psychology (slide 24)", "gives Pojman's definitions and says objectivism does not require absolutism (slide 28)", "gives a non-absolutist objectivist (utilitarians) or says circumstances are not culture (slides 33, 36)", "says objectivism is compatible with tolerance outside core values (slide 35)", "applies each point to the manager's statements"],
    "rows": 9,
    "explain": "Students catch the tolerance mistake and miss the other two, or define objectivism as being objective themselves. The marker wants all three distinctions and Pojman's wording."
  }
]
```
