---
title: Right means maximizing actual utility, a test of actions, not a decision procedure
minutes: 25
---

Utilitarianism judges an action by consequences that have not yet happened when you act. So how can anyone know what to do?

## Utilitarianism has six features, all about consequences

The week 4 course notes sum up what utilitarianism involves:

- *Evaluating the morality of actions by considering only consequences*
- *Considering only actual consequences of actions - not predicted, likely or intended consequences*
- *The view that pleasure is the only intrinsic good, pain the only intrinsic bad*
- *Equal consideration of interests (perfect impartiality - everyone's pain/pleasure is worth as much as anyone else's)*
- *The view that the best overall consequence can be calculated by aggregating pleasure and pain for each. Utility is the net value of this calculation.*
- *Pleasure and pain is evaluated for all affected (not just an individual or interest group)*

The notes draw one consequence: *the ends can justify the means. If the ends are desirable enough, any means may be acceptable.*

## The utilitarian algorithm has three steps

Lecture 5 slide 8 warns that *utilitarianism cannot be summarized in a single sentence*, and offers *the closest and still incomplete "short" definition*: describe the *"algorithm"* and implement it.

```diagram
{ "type": "flow", "title": "The utilitarian algorithm (Lecture 5, slide 8)", "nodes": [ { "id": "s1", "label": "1. Identify all affected", "sub": "by the available options" }, { "id": "s2", "label": "2. Aggregate utility", "sub": "per action, ECI, actual outcome" }, { "id": "s3", "label": "3. Choose the option", "sub": "that maximizes utility" } ], "edges": [ { "from": "s1", "to": "s2" }, { "from": "s2", "to": "s3" } ], "hi": ["s3"], "caption": "Step 2 sums pleasure and pain, counting each person's interests equally." }
```

In the slide's words: *1) identify all affected by available options for action; 2) for each available action, aggregate all relevant utility (since the theory subscribes to normative hedonism, this is the sum of pleasure and pain, using ECI) considering the actual outcome and 3) choose the option that maximizes utility*. Step 3 is slide 24's rule from [Mill's principle](#/libs7102-l4/mill-refines-bentham): right iff no available action has higher utility.

## Only what actually happens makes an action right

The notes are blunt: *if an action is merely predicted to maximize happiness, it is not necessarily moral. It is only moral if it actually succeeds in doing so.* A security update shipped with every good reason to expect it to help, which instead locks a clinic out of its patient records, was the wrong action. Intentions and forecasts do not enter the verdict.

## Utilitarianism is a criterion of right, not a decision procedure

If only actual outcomes count, nobody can be sure in advance. The notes answer that *the utilitarian calculation aims to evaluate actions rather than giving you a decision procedure*: *utilitarianism doesn't demand or expect that a utilitarian must calculate utility at all before acting. A utilitarian may act by instinct, or using kindness, or they may be acting of loyalty. What matters is the outcome - the action (thus the name "act utilitarianism").* Among its advantages: the principle *is not strictly speaking a method for knowing what to do. It is not a decision procedure. It is merely a criterion of right*, and *utilitarianism demands nothing of a user's motivations or knowledge.* The notes list two more advantages: it asks *that we maximize utility for all affected by the action - not just ourselves, or a group of friends*, and *it focuses on results (consequences), so results are always guaranteed*, *as opposed to actions where the agent "means well" but can end up acting in ways that hurt others.*

How a utilitarian still decides well comes from Mill's reply to the *lack of time* objection (Lecture 5, slides 17–18): *"There is no difficulty in proving any ethical standard whatever to work ill if we suppose universal idiocy to be conjoined with it"*; by now *mankind must ... have acquired positive beliefs as to the effects of some actions on their happiness*. Experience tells us *lying, corruption, torture* are likely to cause pain, so *there is no need to calculate every time*, a point Bentham had made (slide 18). Mill's social rules, which *generally suffice* (slide 22), carry that experience.

## No ought without can

*If an action is not available (it is simply impossible to do it), then there is no moral obligation to perform it. This is something utilitarianism shares with all other moral theories.* The notes' example: *it makes no sense to say that I ought to save someone from drowning by jumping into a lake to get them, if I cannot swim myself*. Only available actions enter step 1, and the Kill One notes add: *we also cannot blame someone for doing a/b if only a/b are physically possible.*

## The prisoners' switch lets you choose only who is tortured

```quiz
[
  {
    "type": "free",
    "q": "Is either choice moral? Why?\n\n> You can control what will happen with the flick of a switch. If you do nothing, (a) happens: 2 prisoners of war will be tortured (by an unknown torturer). If you flick it, (b) happens: 1 prisoner of war will be tortured (by an unknown torturer).",
    "model": "Flicking the switch is the moral choice. The scenario gives you no choice about whether torture happens, so you cannot have a duty to prevent it: *no ought without can*. Your only available choice is who gets hurt, and minimizing the number hurt is a moral choice. Both outcomes are deeply regrettable, but the desirability of an outcome is not the morality of a choice.",
    "points": ["says flicking the switch (one tortured) is the moral choice", "applies no ought without can: avoiding all torture is not available", "separates the regrettable outcome from the morality of the choice"],
    "rows": 4,
    "explain": "The tempting answer, \"both are wrong because both involve torture\", is the absolutist's, and it blames you for an option you never had."
  }
]
```

The Kill One to Save Nineteen notes ask *can all possible choices be morally wrong?* An absolutist about torture *may be tempted to say, once again, that no choice is moral, since they both involve torture*. But *we cannot be said to have a moral duty to avoid torture, since the option is never available*. *The moral choice may then simply be to minimize the number of people who get hurt. If that has any moral value, then we've made a moral choice.* The notes add: *if it were in our power to avoid both, we should avoid both. But we shouldn't confuse the desirability of the outcome with the morality of the choice.* In hard cases *the most moral choice is "the moral choice"*; [Jim and the twenty](#/libs7102-l4/jim-and-the-twenty) applies this.

The practice list asks how a utilitarian can know what to do; write your answer before you reveal the model.

```quiz
[
  {
    "type": "free",
    "pq": "U3",
    "q": "How can utilitarians know what to do, if moral evaluation is based on the actual consequences of actions they haven't done yet?",
    "model": "They cannot know for certain, and utilitarianism does not claim they can. The theory judges *only actual consequences of actions - not predicted, likely or intended consequences* (week 4 notes), and slide 24 makes an action right *if and only if there is no other available action the agent could have done instead that has higher utility*. But this is a criterion of right, not a decision procedure: *utilitarianism doesn't demand or expect that a utilitarian must calculate utility at all before acting*, and one may act *by instinct, or using kindness*, or from loyalty. The principle *demands nothing of a user's motivations or knowledge*.\n\nIn practice a utilitarian acts on experience. Answering the lack-of-time objection (Lecture 5, slide 18), Mill says we need not suppose *universal idiocy*: *mankind must by this time have acquired positive beliefs as to the effects of some actions on their happiness*, so we know lying, corruption and torture tend to cause pain, and social rules *generally suffice* (slide 22). A penetration tester who keeps to the agreed scope acts on that evidence. If the test still crashes a clinic's records system, the act was wrong by its actual outcome, but foreseeing what no available evidence showed was not an option open to her, and *no ought without can*: she is not to blame. The objection fails against the criterion, though the verdict often comes only afterwards.",
    "points": ["says utilitarians cannot know actual consequences in advance and the theory does not claim they can, while rightness still depends on the actual outcome, not the predicted one", "states that utilitarianism is a criterion of right, not a decision procedure; no calculation is required before acting (week 4 notes)", "gives Mill's reply: experience (not universal idiocy) tells us what actions tend to cause pain, e.g. lying, corruption, torture (Lecture 5 slide 18)", "uses no ought without can or blamelessness for an unforeseeable outcome", "gives a computing example (e.g. a penetration test)", "takes a side: the objection fails against a criterion of right"],
    "rows": 9,
    "explain": "Students often answer that utilitarians judge by predicted or intended consequences, which the course rejects: only actual consequences count. Others only list the felicific calculus, a utility calculation that does not answer how the agent can know."
  }
]
```

```quiz
[
  { "q": "According to utilitarianism, an action predicted to maximize happiness is right even if it fails to.", "type": "tf", "answer": false, "explain": "Week 4 notes: *if an action is merely predicted to maximize happiness, it is not necessarily moral. It is only moral if it actually succeeds in doing so.*" },
  { "q": "Which consequences does utilitarianism consider?", "options": ["Actual consequences only", "Intended consequences", "Predicted or likely consequences", "Consequences for the majority only"], "answer": 0, "explain": "*Considering only actual consequences of actions - not predicted, likely or intended consequences*, and *for all affected (not just an individual or interest group)*." },
  { "q": "Match each step of the utilitarian algorithm (Lecture 5, slide 8) to what it does.", "type": "match", "pairs": [["Step 1", "Identify all affected by the available options for action"], ["Step 2", "For each available action, aggregate pleasure and pain using ECI, on the actual outcome"], ["Step 3", "Choose the option that maximizes utility"]], "explain": "Slide 8 calls this *the closest and still incomplete \"short\" definition*." },
  { "q": "A utilitarian must calculate utility before every action.", "type": "tf", "answer": false, "explain": "*Utilitarianism doesn't demand or expect that a utilitarian must calculate utility at all before acting. A utilitarian may act by instinct, or using kindness, or they may be acting of loyalty.*" },
  { "q": "The principle of utility is described in the week 4 notes as a criterion of right, not a decision ___.", "type": "text", "answer": ["procedure"], "explain": "*It is not a decision procedure. It is merely a criterion of right (a method to identify the right action).*" },
  { "q": "Which slogan means you have no duty to do what is impossible?", "options": ["No ought without can", "No ought from is", "Everybody to count for one, nobody for more than one", "The greatest happiness of the greatest number"], "answer": 0, "explain": "*No ought without can* is about availability. *No ought from is* is the Lecture 1 rule about empirical premises; *everybody to count for one* is equal consideration; the last is the misread quote of slide 17." },
  { "q": "Faced with the switch that decides whether two prisoners or one will be tortured, an absolutist about torture says no choice is moral. What does the course reply?", "options": ["Avoiding torture is not an available option, so the moral choice is to minimize the number hurt", "Both choices are wrong, so you should refuse to touch the switch", "The answer depends on what your culture thinks of torture", "Any choice is moral as long as you meant well"], "answer": 0, "explain": "*We cannot be said to have a moral duty to avoid torture, since the option is never available.* Refusing is itself choosing outcome (a); the cultural answer is relativism; meaning well is about intention, which utilitarianism ignores." },
  { "q": "Mill answers the lack-of-time objection by saying we know from experience that some actions, such as lying, corruption and torture, are likely to cause pain.", "type": "tf", "answer": true, "explain": "Lecture 5 slide 18: *One can know, by experience, that some actions (e.g. lying, corruption, torture) are likely to cause pain ... There is no need to calculate every time.*" }
]
```
