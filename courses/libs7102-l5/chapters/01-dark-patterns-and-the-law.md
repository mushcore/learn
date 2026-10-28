---
title: Dark patterns can be legal in Canada and still wrong, and act utilitarianism judges each one
minutes: 15
---

Lecture 5 opens its *Objections to utilitarianism* with one running *Example: Dark Patterns* (slide 1). Two questions follow it: does the law settle whether a manipulative design is wrong, and what does act utilitarianism say about such designs?

## Dark patterns are manipulative UX design

Slide 2 calls them *Manipulative UX (User Experience) design*. The EU's definition, quoted in the course notes, is *misleading tricks that manipulate users into choices they do not intend to make*. Harry Brignull coined the term in 2010. The Vox reading (Sara Morrison) gives the examples worth using in an answer:

| Pattern | How it steers you | Vox example |
|---|---|---|
| Unequal buttons | the option the company wants is bright, the other blends in | Instagram's pop-up: a bright blue *Make ads more personalized*, and *Make ads less personalized* in *a slightly darker shade of black than the pop-up background* |
| Soft words | friendly terms hide what you permit | Instagram says *activity* and *personalized* instead of *tracking* and *targeting* |
| Hard to cancel | easy to get into, hard to cancel | the drugstore account you *can't easily cancel*; a CD-a-month club *almost impossible to cancel*; the free trial that charges you when it expires |
| Fake urgency | invented time pressure | the email that says respond within five minutes, with a *fake countdown timer* |
| Cookie banners | accepting is one big button, refusing is a hunt | to refuse you must *search for and click through to a menu of settings and disable them manually* |
| Shaming the opt-out | declining is made to feel bad | a big red *Sign Me Up* beside a small opt-out implying you don't care about saving money |

## The FTC and the EU call dark patterns unfair; Canada has no standalone law

Slide 2: dark patterns were *considered unfair and deceptive by the Federal Trade Commission (FTC) in the US in Oct 2021, by the EU in March 2022*. *In Canada, there is no standalone law explicitly addressing dark patterns, but privacy regulators do now recognize deceptive design patterns as a privacy-compliance issue.*

Slide 3 lists what Canada does have:

- **PIPEDA**, the Personal Information Protection and Electronic Documents Act, *has guidelines for obtaining meaningful consent regarding the collection, use and disclosure of personal information* (*it's from the 90s*).
- **CASL**, Canada's Anti-Spam Legislation, *prohibits false and misleading statements in electronic messages*.
- **Bill C-27**: *If Bill C-27 got passed, we would have had more explicit language.* Its section 16: *"An organization must not obtain or attempt to obtain an individual's consent by providing false or misleading information or using deceptive or misleading practices. Any consent obtained under those circumstances is invalid."*
- *6th Jan 2025 - Bill C-27 was dropped due to prorogation (interruption) of Parliament.*
- **Bill C-36** *retains this prohibition*, *under discussion now in 2026*.

## A legal loophole does not make a practice ethical

Slide 2 draws two lessons. First, *legal loophole doesn't mean a practice is ethical*. "No law forbids it" is an empirical claim and "so it is right" is a value conclusion; the step between them is the "ought from is" that lecture 1 calls incomplete. Taking the law as the measure of right is Kohlberg's stage 4, which lecture 2 showed can be *only accidentally right*. Second, *existing privacy regulation already has some teeth so there's no guarantee that you and/or your company wouldn't face legal consequences*: PIPEDA's consent guidelines already reach a deceptive consent screen.

## Slide 4 asks whether manipulating users for their own good can be right

Slide 4 is titled *Manipulating you to do what is best: Consent and avuncular ethics*. The course notes put its question: what if a designer manipulated users into choices they did not intend, but perhaps *should* make? Could utilitarian calculation justify that? Slide 4 gives two designs.

```quiz
[
  {
    "type": "free",
    "q": "What does act utilitarianism say about each of these two designs, and how do they differ?\n\n> First design: a pension sign-up screen makes contributing the default; declining is clear and possible, but it takes work. Second design: a booking site for a dangerous activity gives much-needed insurance to every user who keeps clicking yes without reading; declining requires spotting and checking a tiny box.",
    "model": "Act utilitarianism gives no verdict on dark patterns as a class (slide 4): each design is right if no available alternative design produces more total utility on its actual outcome, so either one could be right if users really end up better off. The slide separates them by consent. The pension default is *avuncular ethics*: declining is *clear and possible but hard work*. The tiny insurance box is *more paternalistic and violates consent more*. For act utilitarianism that breach counts only through the pain it causes.",
    "points": ["says act utilitarianism judges each design, not dark patterns as a class (slide 4)", "says either design is right only if it maximizes total utility on the actual outcome", "calls the pension default avuncular and the insurance box more paternalistic, violating consent more"],
    "rows": 4,
    "explain": "The common answer is that both are wrong because they manipulate. That is a rule about the class, which act utilitarianism does not make; you can say it as your own objection, not as the theory's verdict."
  }
]
```

## Act utilitarianism judges each dark pattern, never the whole class

Slide 4's verdict: *What does act utilitarianism say about using dark patterns? As always, it says nothing about the whole class of actions, as it depends on the specifics of each action.* "Dark patterns are wrong" and "dark patterns are fine" are both claims about a class, and act utilitarianism makes neither. Each design is right if and only if no available alternative has higher total utility on its actual outcome.

The slide then ranks the two designs by consent. The pension default is *avuncular ethics*, the kindly uncle's nudge: the good option is the default, but *declining contributing to pension plan is clear and possible but hard work*. The insurance design is *more paternalistic and violates consent more*, because a user who *keeps clicking yes without reading* never sees the *tiny box*. For act utilitarianism consent has no weight of its own; a breach counts only through the pleasure and pain it causes, which is why the theory can approve either design. Slide 9 returns to consent in [how not to describe utilitarianism](#/libs7102-l5/how-not-to-describe-utilitarianism), and slide 25 uses dark patterns again when [utility is aggregated](#/libs7102-l5/aggregation-responsibility-trivial-promises).

```quiz
[
  {
    "q": "When did the US Federal Trade Commission consider dark patterns unfair and deceptive?",
    "options": ["October 2021", "March 2022", "January 2025", "2010"],
    "answer": 0,
    "explain": "Slide 2: the FTC in Oct 2021, the EU in March 2022. Bill C-27 was dropped on 6 Jan 2025, and 2010 is when Brignull coined the term."
  },
  {
    "q": "Which Canadian law does slide 3 say has guidelines for obtaining meaningful consent to the collection, use and disclosure of personal information?",
    "options": ["PIPEDA", "CASL", "Bill C-27", "Bill C-36"],
    "answer": 0,
    "explain": "PIPEDA, from the 90s, sets the consent guidelines. CASL prohibits false and misleading statements in electronic messages; C-27 was dropped; C-36 is still under discussion in 2026."
  },
  {
    "type": "match",
    "q": "Match each Canadian item to what slide 3 says about it.",
    "pairs": [
      ["CASL", "prohibits false and misleading statements in electronic messages"],
      ["Bill C-27 section 16", "consent obtained by deceptive or misleading practices is invalid"],
      ["6 January 2025", "Bill C-27 dropped on the prorogation of Parliament"],
      ["Bill C-36", "retains the prohibition; under discussion in 2026"]
    ],
    "explain": "Slide 3. Canada has no standalone dark-pattern law; section 16 would have given explicit language, and C-36 carries the same prohibition forward."
  },
  {
    "type": "tf",
    "q": "Because Canada has no standalone law on dark patterns, a Canadian company that uses them faces no legal risk.",
    "answer": false,
    "explain": "Slide 2: privacy regulators now treat deceptive design as a privacy-compliance issue, and existing privacy regulation already has some teeth, so there is no guarantee you or your company would escape legal consequences."
  },
  {
    "type": "tf",
    "q": "A legal loophole shows that a practice is ethical.",
    "answer": false,
    "explain": "Slide 2: a legal loophole doesn't mean a practice is ethical. Going from 'no law forbids it' (empirical) to 'it is right' (value) is ought from is."
  },
  {
    "q": "What does act utilitarianism say about using dark patterns?",
    "options": ["Nothing about the class: each design is right or wrong by the actual utility of that action", "They are always wrong, because manipulation never respects consent", "They are permitted wherever the law allows them", "They are right whenever the majority of users benefit"],
    "answer": 0,
    "explain": "Slide 4: it says nothing about the whole class of actions. 'Always wrong' is the absolutist answer, 'permitted where legal' is stage 4 law-and-order thinking, and 'the majority' is the misreading that slide 6 corrects: only total utility counts."
  },
  {
    "q": "On slide 4, which design is avuncular ethics?",
    "options": ["A pension plan with contributing as the default, where declining is clear and possible but hard work", "Insurance added for users who click yes without reading, declined only by a tiny box", "A fake countdown timer on a marketing email", "A cookie banner whose refusal is hidden in a settings menu"],
    "answer": 0,
    "explain": "The pension default leaves the exit clear. The tiny insurance box is more paternalistic and violates consent more; the timer and cookie banner are Vox examples of plain manipulation."
  },
  {
    "type": "text",
    "q": "Which body considered dark patterns unfair and deceptive in March 2022?",
    "answer": ["the EU", "EU", "the European Union", "European Union"],
    "explain": "Slide 2: the FTC in Oct 2021, the EU in March 2022."
  }
]
```
