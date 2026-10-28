---
title: White, black and grey hats differ by permission and intent; utilitarianism looks only at outcomes
minutes: 20
---

Everyone already believes that phishing, fraud and hacking are wrong. The useful question is why, and whether the reason survives a hard case where an illegal hack turns out well.

## Internet fraud is the applied topic of lectures 4 and 5

Slide 7: *In the next two weeks we'll focus on Internet fraud as applie[d] examples: cybercrime, fraud, hacking, spoofing, phishing, dark patterns,...* *We'll focus a little more on hacking as an example.* *Hacking can be ethically problematic due to a number of reasons*, *but not all hacking is the same*.

The course notes frame it. Being told "phishing and spoofing is wrong" teaches nothing; the common-sense reasons (taking private data without consent is wrong, stealing property is wrong) are familiar. What is less understood is their ultimate justification, and how well they hold up in the hard cases: typically not well at all, the notes say. Hard cases force you to say why consent matters and whether stealing can ever be right. Kohlberg already showed that an illegal act can be ethical and a legal one unethical, so the notes ask: can the illegal actions of a black hat hacker be ethical if the consequences turn out good for society? That also raises the question of whether any ethical principle is absolute.

The names come from Richard Stallman, who took them from old Western films, where the good guys wore white hats and the bad guys black.

## White hats have permission, black hats do harm, grey hats break in and then help

Slide 8 defines them:

- *White hat hacking - with permission (paid and legal penetration tester)*.
- *Black hat hacking - without permission. Goal is to steal data, destroy data, make the network unusable, steal confidential info, etc*.
- *Grey hat hackers can break the law, but then not take advantage, or even offer to fix security issue*.

Then the slide asks its question in bold.

```quiz
[
  {
    "type": "free",
    "q": "Slide 8 asks the question below. What would common sense say about each hat, and how could you tell for the grey hat?\n\n> White hat, black hat, grey hat: are any of these ethical?",
    "model": "Slide 8 gives common sense's answer: *White – Yes*, *Black – No*, *Grey – Possibly – But how can we tell?* Common sense sorts the hats by permission, legality and intention, and those give no clear answer for someone who breaks the law and then offers to fix the hole. The slide's way to tell: *We'll use utilitarianism to investigate*. Utilitarianism ignores the hat and asks what each concrete hack actually did to everyone affected, so on its view any of the three could be right or wrong (slide 9).",
    "points": [
      "gives common sense's verdicts: white yes, black no, grey possibly (slide 8)",
      "says common sense cannot settle the grey hat",
      "says utilitarianism judges by the actual outcome of the concrete hack",
      "concludes any hat could be right or wrong on that view (slide 9)"
    ],
    "rows": 4,
    "explain": "Answering only with common sense's yes, no, possibly stops where the slide starts. The point of the slide is that utilitarianism does not use the hat at all."
  }
]
```

## Common sense says yes, no, possibly; utilitarianism says it depends on the outcome

Common sense would tell you, slide 8 says: *White – Yes*, *Black – No*, *Grey – Possibly – But how can we tell?* The answer: *We'll use utilitarianism to investigate.*

Slide 9 lists *the main intuition-based distinctions between white, black and grey hat hacking*:

1. *permission/consent (with/without)*
2. *legality (legal or illegal)*
3. *intention (to help/harm)* and
4. *outcome (does it actually help/harm?)*, with **outcome** in bold on the slide

*Utilitarianism tells us we should look only at the outcome, so actually any of these types of hacking could be right or wrong, according to utilitarianism.* The grid puts the three hats against the four distinctions. Only the last row counts for a utilitarian, and slide 8's definitions leave it open for every hat.

```diagram
{ "type": "grid", "title": "The three hats against slide 9's four distinctions", "nodes": [
  { "id": "c00", "label": "", "row": 0, "col": 0 },
  { "id": "c01", "label": "White hat", "row": 0, "col": 1 },
  { "id": "c02", "label": "Black hat", "row": 0, "col": 2 },
  { "id": "c03", "label": "Grey hat", "row": 0, "col": 3 },
  { "id": "c10", "label": "1. Permission", "row": 1, "col": 0 },
  { "id": "c11", "label": "With", "row": 1, "col": 1 },
  { "id": "c12", "label": "Without", "row": 1, "col": 2 },
  { "id": "c13", "label": "Without", "row": 1, "col": 3 },
  { "id": "c20", "label": "2. Legality", "row": 2, "col": 0 },
  { "id": "c21", "label": "Legal, paid", "row": 2, "col": 1 },
  { "id": "c22", "label": "Illegal", "row": 2, "col": 2 },
  { "id": "c23", "label": "Can break the law", "row": 2, "col": 3 },
  { "id": "c30", "label": "3. Intention", "row": 3, "col": 0 },
  { "id": "c31", "label": "To help", "row": 3, "col": 1 },
  { "id": "c32", "label": "Steal, destroy", "row": 3, "col": 2 },
  { "id": "c33", "label": "No advantage taken", "row": 3, "col": 3 },
  { "id": "c40", "label": "4. Outcome", "row": 4, "col": 0 },
  { "id": "c41", "label": "Help or harm?", "row": 4, "col": 1 },
  { "id": "c42", "label": "Help or harm?", "row": 4, "col": 2 },
  { "id": "c43", "label": "Help or harm?", "row": 4, "col": 3 }
], "hi": ["c40", "c41", "c42", "c43"], "caption": "Intuition uses all four rows; utilitarianism looks only at the outcome row, which no hat settles in advance." }
```

## The hats raise two questions: is wrong absolute, and can the end justify the means?

Slide 9 ends with what the lecture will consider:

- *Is good and bad absolute (e.g. murder, stealing) or can it be weighed against the alternatives?*
- *Is an action right if it's a means to an end?*

Utilitarianism answers that good and bad are weighed against the available alternatives, and that the ends can justify the means. The lecture tests both answers on two cases: Mr. Strangelove, a grey hat whose break-in accidentally launches an ICBM, and Andy, a co-worker whose hack you cover with a lie to your boss, in [the trolley, the fat man, Strangelove and Andy](#/libs7102-l4/trolley-fat-man-strangelove-andy).

```quiz
[
  {
    "type": "free",
    "q": "Can a black hat hacker's action be morally right according to utilitarianism? Explain, with an example from computing.",
    "model": "Yes, it can. Slide 9 lists four intuition-based distinctions between the hats: *permission/consent*, *legality*, *intention* and *outcome*. *Utilitarianism tells us we should look only at the outcome, so actually any of these types of hacking could be right or wrong, according to utilitarianism.* It is a consequentialist theory that judges each concrete action by its actual effects on everyone affected. Lacking permission, breaking the law and meaning to steal are not in themselves what makes a hack wrong; they matter only through what the hack actually does.\n\nSuppose a black hat breaks into a bank's network to steal card numbers. The intrusion trips an alarm, the bank traces it and finds the hole, and closes a flaw that had been leaking the data of millions of customers to other criminals. No card is stolen. By the actual outcome, the break-in produced more utility than any alternative the hacker had, such as not hacking at all, so utilitarianism calls it right despite the motive. The same reasoning cuts the other way: a paid, permitted white-hat test that crashes a hospital's network is wrong. Most people resist calling the black hat right, which is exactly the problem slide 9 sets up: intuition counts permission, legality and intention, and utilitarianism does not.",
    "points": [
      "answers yes: utilitarianism looks only at the outcome, so any hat could be right or wrong (slide 9)",
      "names the four intuition-based distinctions: permission, legality, intention, outcome",
      "says it judges the concrete action by its actual consequences, not the intended ones",
      "gives a computing example where a black-hat act turns out best",
      "notes the reverse case or the clash with intuition about permission and intention"
    ],
    "rows": 9,
    "explain": "A common answer says a black hat is wrong because it is illegal or lacks consent, which is common sense's answer, not utilitarianism's. Another slip judges the hack by its intended outcome; utilitarianism counts only the actual one."
  }
]
```

```quiz
[
  {
    "q": "Slide 8 defines white hat hacking as",
    "options": [
      "hacking with permission: a paid and legal penetration tester",
      "breaking the law but then not taking advantage, or offering to fix the issue",
      "hacking without permission to steal or destroy data",
      "any hacking whose outcome turns out to help"
    ],
    "answer": 0,
    "explain": "Breaking in and then offering a fix is the grey hat; stealing or destroying data without permission is the black hat. A good outcome defines no hat: it is what utilitarianism looks at instead."
  },
  {
    "q": "Which of these is the grey hat, by slide 8?",
    "options": [
      "Someone who breaks into a retailer's server without permission, takes nothing, and emails the retailer how to fix the hole",
      "A contractor paid by a retailer to test its server",
      "Someone who breaks into a retailer's server to copy confidential files",
      "Someone who makes a retailer's network unusable"
    ],
    "answer": 0,
    "explain": "*Grey hat hackers can break the law, but then not take advantage, or even offer to fix security issue.* The paid tester is white; copying files or making the network unusable is black."
  },
  {
    "q": "True or false: according to utilitarianism, white hat hacking is always right and black hat hacking always wrong.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 9: *Utilitarianism tells us we should look only at the outcome, so actually any of these types of hacking could be right or wrong.* Yes for white and no for black is common sense's answer on slide 8."
  },
  {
    "q": "Slide 9 lists four intuition-based distinctions between the hats. Which one does utilitarianism use?",
    "options": [
      "Outcome: does it actually help or harm?",
      "Permission or consent",
      "Legality",
      "Intention to help or harm"
    ],
    "answer": 0,
    "explain": "The slide bolds **outcome**, and only the actual help or harm. Intention, the hacker's aim, is exactly what utilitarianism leaves out."
  },
  {
    "q": "Common sense's answer for the grey hat, on slide 8, is",
    "options": [
      "possibly, but how can we tell?",
      "yes, because no advantage is taken",
      "no, because the law is broken",
      "yes, if the culture accepts it"
    ],
    "answer": 0,
    "explain": "*Grey – Possibly – But how can we tell?* The slide's answer to how: *We'll use utilitarianism to investigate.*"
  },
  {
    "q": "True or false: by the course notes, since Kohlberg, an illegal act can be ethical and a legal act unethical.",
    "type": "tf",
    "answer": true,
    "explain": "That is why the notes can ask whether a black hat's illegal hack could be ethical if its consequences turn out good for society. Legality is only one of slide 9's four distinctions."
  },
  {
    "q": "Slide 9's two questions for the lecture are whether good and bad can be weighed against the alternatives, and",
    "options": [
      "whether an action is right if it's a means to an end",
      "whether the hacker had permission",
      "whether the majority benefits",
      "whether the culture approves of hacking"
    ],
    "answer": 0,
    "explain": "*Is an action right if it's a means to an end?* Utilitarianism's answer is that the ends can justify the means. Serving the majority is not what it asks, and cultural approval is the relativist's test."
  }
]
```
