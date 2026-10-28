---
title: "Mock quiz: Lecture 2"
minutes: 20
---

Sixteen items on lecture 2: seven workplace scenarios to place on Kohlberg's scale, Piaget, Singer's distinctions, and two written answers paired with a computing case. Take it cold first, then go back to the lesson behind any miss.

```quiz
[
  {
    "q": "A junior developer does not copy licensed code into the product, and gives one reason: the last person who did it was fired. Which stage does the reason show?",
    "options": ["Stage 1: obedience and punishment", "Stage 2: instrumental exchange", "Stage 4: law and order", "Stage 5: social contract and individual rights"],
    "answer": 0,
    "explain": "The act is wrong because it gets punished: might makes right (slide 17). A stage 4 reason would point to what code theft does to social order."
  },
  {
    "q": "A contractor agrees to review a client's security settings for free, but only if the client refers two new customers to her. Which stage does this show?",
    "options": ["Stage 2: instrumental exchange", "Stage 1: obedience and punishment", "Stage 3: good boy/nice girl", "Stage 6: universal ethical principles"],
    "answer": 0,
    "explain": "Self-interest with a sense of fair exchange: normative egoism plus a mutually beneficial deal (slide 18)."
  },
  {
    "q": "A tester signs off on a release she has doubts about, because her team lead will be pleased and she wants to be seen as a team player. Which stage does this show?",
    "options": ["Stage 3: good boy/nice girl", "Stage 2: instrumental exchange", "Stage 4: law and order", "Stage 4.5: the cynic"],
    "answer": 0,
    "explain": "She wants praise and to live up to the expectations of others (slide 19). No exchange is bargained for, and no appeal to society's rules is made."
  },
  {
    "q": "A system administrator refuses to skip the company's change-control process: \"If everyone ignored the rules, the whole operation would fall apart.\" Which stage does this show?",
    "options": ["Stage 4: law and order", "Stage 1: obedience and punishment", "Stage 3: good boy/nice girl", "Stage 5: social contract and individual rights"],
    "answer": 0,
    "explain": "Rules are followed because they are useful for social order, the justification stage 4 adds (slide 20). Stage 5 would ask whether the rule itself is good and how to improve it."
  },
  {
    "q": "An engineer says every company's ethics code is just public relations, nobody really believes any of it, so she will do whatever pays best. Which stage does this show?",
    "options": ["Stage 4.5: the cynic", "Stage 5: social contract and individual rights", "Stage 3: good boy/nice girl", "Stage 6: universal ethical principles"],
    "answer": 0,
    "explain": "Conventions are seen as relative and arbitrary, no alternative is known, and she drops into \"do your own thing\" (slide 21)."
  },
  {
    "q": "A product manager argues at the board's review that the company's data-retention policy violates users' privacy rights and should be changed through the review process. Which stage does this show?",
    "options": ["Stage 5: social contract and individual rights", "Stage 4: law and order", "Stage 4.5: the cynic", "Stage 2: instrumental exchange"],
    "answer": 0,
    "explain": "A rule is not good simply because it is the rule; it can be improved through agreed procedures, with attention to rights (slide 22)."
  },
  {
    "q": "After every appeal fails, an engineer refuses to build a legally required feature that would expose a persecuted minority, and accepts the penalty. Which stage does this show?",
    "options": ["Stage 6: universal ethical principles", "Stage 5: social contract and individual rights", "Stage 4.5: the cynic", "Stage 1: obedience and punishment"],
    "answer": 0,
    "explain": "Civil disobedience once the law cannot be changed by democratic processes, on the ground that laws are valid only insofar as they are just (slide 23)."
  },
  {
    "q": "In Piaget's example, one boy broke 15 cups trying to help his mother and another broke one cup trying to steal cookies. An eleven-year-old says the second boy did worse. Why?",
    "options": ["Older children judge by the intentions behind actions", "Older children judge by the consequences of actions", "Older children see rules as fixed and handed down by parents or God", "Older children reason at Kohlberg's stage 1"],
    "answer": 0,
    "explain": "Slide 13: over 10/11, judgment is based on intentions; under 10/11, on consequences, with rules fixed and absolute."
  },
  {
    "type": "tf",
    "q": "Kohlberg's stages suggest that being moral is mainly the ability to memorize claims such as \"lying is wrong\".",
    "answer": false,
    "explain": "Slide 14: stages suggest moral knowledge is know-how, a skill, rather than knowing-that."
  },
  {
    "q": "What does Singer mean when he says equality is a moral ideal?",
    "options": ["Equality is a claim about how beings ought to be considered, not a statement that they are the same", "All humans are in fact equal in intelligence and ability", "Every being should be given exactly the same rights", "Equality means whatever rights one's society recognizes"],
    "answer": 0,
    "explain": "Slide 27: not a statement of fact, since we are obviously not the same. Same rights is rejected on slide 26; the last option is the relativist's answer."
  },
  {
    "type": "tf",
    "q": "Singer's equality requires that men have a right to an abortion, since women have one.",
    "answer": false,
    "explain": "Slide 26: men cannot have children, so we do not need to defend that right. Equal rights, not the same rights."
  },
  {
    "q": "On Singer's view, why does a higher intelligence not entitle humans to exploit nonhumans?",
    "options": ["Equality is not grounded in merit; the vital characteristic is the capacity to suffer", "Animals are in fact as intelligent as humans", "Intelligence matters only among humans, by convention", "Only beings that can talk or reason count, and some animals can"],
    "answer": 0,
    "explain": "Slide 28: intelligence does not entitle one human to use another, so it cannot entitle humans to use nonhumans. Bentham's question is not can they talk or reason but can they suffer."
  },
  {
    "type": "match",
    "q": "Match each claim to its source on the slides.",
    "pairs": [
      ["Humans are equals because they are human and can enjoy a good life", "Frankena (slide 30)"],
      ["Every being is capable of having a good life", "Singer (slide 31)"],
      ["Laws are only valid insofar as they are grounded in justice", "Martin Luther King (slide 23)"],
      ["Life is more important than property", "a stage 5 subject on Heinz (slide 22)"]
    ],
    "explain": "Slides 30, 31, 23 and 22."
  },
  {
    "type": "text",
    "q": "Name the bias the experimenter shows when he refuses to test on an infant but will test on a guinea pig.",
    "answer": ["speciesism", "speciesist bias"],
    "explain": "Slide 29: a bias towards his own species."
  },
  {
    "type": "free",
    "q": "Is the developer's reasoning a problem? Answer with Kohlberg's stages.\n\n> A developer at an online retailer is asked to add a checkout screen where cancelling a subscription takes eight clicks and the button is hidden in grey text. She checks with legal, hears that nothing in the law forbids it, and says: \"It's legal and it's company policy, so it's fine. Rules are what keep a business running.\"",
    "model": "Her reasoning is stage 4, *law and order*: she treats the act as right because it is legal and company policy, and she justifies the rules because they *are useful for social order* (slide 20). At this stage *authority figures are seldom questioned*, and *many adults never reach the third level* (stages 5 and 6). The course notes say development tends to stall at stages 3 and 4, with the uncritical adoption of inherited viewpoints.\n\nYes, it is a problem. Stage 4 follows a rule because it is a rule, so it cannot see when the rule is itself wrong; it is right only when the conventions happen to be right, and conventional morality is a poor guide wherever they are *either flawed or may be only accidentally right* (course notes). Here the law is silent, so her method approves a screen built to trap users against their own interests. A legal loophole does not make a practice ethical. A stage 5 developer would ask whether the policy is good and push to change it through the company's own processes; she would not need a law to see the harm. Her respect for rules is not worthless, since most rules do keep a business running, but it cannot be the last word.",
    "points": ["identifies stage 4: right because legal and company policy; rules useful for social order (slide 20)", "notes authority seldom questioned, or that many stall at stages 3 and 4", "explains the problem: rule-following cannot detect a flawed rule; right only by accident", "applies it to the case: the law is silent, so her method approves a harmful design", "contrasts with stage 5 (question and improve the rule) and takes a side"],
    "rows": 9,
    "explain": "Students say she is wrong because dark patterns are illegal. The case says the law is silent: the point is that her reason is the problem, because it would approve anything the rules allow."
  },
  {
    "type": "free",
    "q": "Why was the convention a poor guide, and what would Kohlberg and Singer say about it?\n\n> In the 1990s, common conventions in computing held that hacking was exciting, that getting pirated software was cheaper, that getting copyrighted movies was smart, and that \"it's not illegal if you don't get caught\" (slide 24). A student copies a commercial compiler because, as everyone in his lab says, that is just what people do.",
    "model": "The student is reasoning at Kohlberg's conventional level: he does what his group expects, *what people do*, rather than asking whether it is right (stages 3 and 4, slides 19–20). The convention itself mixes in stage 1 thinking: *\"it's not illegal if you don't get caught\"* makes being caught, not the act, the test of wrong (slide 17). The course notes say conventional morality is a poor guide to the extent that its attitudes are *either flawed or may be only accidentally right*; here it is plainly flawed, since copying the compiler takes from its makers whatever the lab thinks.\n\nSinger's method shows the alternative. In \"All animals are equal\" he rejects the convention that only humans count by asking for a principled reason: *equality is a moral ideal, not a statement of a fact*, and the test is *Can they suffer?*, not who we happen to favour (slides 27–28). We *should question the assumptions of our age* (slide 29). Applied here, the question is not what the lab does but whether the act can be justified, and \"everyone does it\" is an empirical fact that gives no ought. Slide 24 asks whether anything has changed since then; the habits have moved on, but any convention in a team, such as padding a resume, needs the same test. Some conventions pass it; this one does not.",
    "points": ["places the student at the conventional level (doing what the group expects), or notes the stage 1 'don't get caught' reasoning", "says convention can be flawed or only accidentally right (course notes)", "relates Singer: reject a convention by principled reasoning, question the assumptions of our age (slide 29)", "uses 'everyone does it' is not a justification (no ought from is) or an equivalent", "takes a side on the case with a reason about the act"],
    "rows": 9,
    "explain": "Students argue only that piracy is illegal, which is stage 4 reasoning, and leave Singer out. The question asks for the post-conventional point: the convention is tested by reasons, not by law or by what others do."
  }
]
```
