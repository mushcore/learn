---
title: The 25 listed questions, answered in writing
minutes: 90
---

The practice list says the exam's questions *will either be taken from the list* (rare) *or will be very similar to those questions* (typical). Here are all twenty-five listed questions, each with the model answer from the lesson that teaches it. Write your two paragraphs first, then reveal the model and tick only the points your answer actually makes. A question you already aced in its lecture module can be skipped; one you could not start is the one to redo tomorrow.

## Lecture 1: the moral-reasoning question tests validity, soundness and claim types

```quiz
[
  {
    "type": "free",
    "pq": "M",
    "q": "Here is an argument. Is it true? Is it valid? Is it sound? Which of its claims are empirical, value, conceptual?\n\n> P1 A phishing email is an email designed to trick its recipient into revealing private information.\n> P2 The company's IT security team sent every employee a phishing email as an unannounced test.\n> P3 It is always wrong to try to trick someone into revealing private information.\n> C Therefore, the IT security team acted wrongly.",
    "model": "The first question cannot be answered: an argument is not a statement, so it is never true or false (slide 16, *There are no true or false arguments*); only its premises and conclusion, being claims, are truth-apt (slide 23). The argument is valid. P1 and P2 say the team tried to trick employees into revealing private information, and P3 says that is always wrong, so if all three premises were true the conclusion would have to be true: *the truth of the premises guarantees the truth of the conclusion* (slide 18).\n\nAn argument is sound if and only if it is valid and all its premises are true (slide 21). P1 is true and P2 is true in the case, so soundness rests on P3, and I think P3 is false. An authorized test that teaches staff to recognize real attacks, and exposes no one's data, tricks people for their own protection; the word \"always\" makes P3 an absolute principle that this case counts against. So the argument is valid but unsound, which does not show the conclusion false. Without P3 it would be invalid, since no ought from is (slide 29): the value premise is where the real debate lies. P1 is a conceptual claim, true by the meaning of \"phishing email\"; P2 is empirical, settled by the email logs; P3 and C are value claims, judgments of disapproval that no sensory test can settle (slide 28).",
    "points": [
      "says an argument cannot be true or false; only its claims can (slides 16, 23)",
      "judges it valid: true premises would guarantee the conclusion (slide 18)",
      "types P1 conceptual, P2 empirical, P3 and C value (slide 28)",
      "judges soundness by naming P3 as the doubtful premise: valid but unsound, or soundness not established (slide 21)",
      "notes that without the value premise the argument would be invalid: no ought from is (slide 29)"
    ],
    "rows": 10,
    "explain": "Students answer 'is it true?' with yes or no, which the instructor marks as not understanding validity: the question is a trick. Others call the argument invalid because they disagree with P3, but disagreeing with a premise is a soundness question, not a validity one."
  }
]
```

## Lecture 2: Kohlberg's stages and why convention is not the last word

```quiz
[
  {
    "type": "free",
    "pq": "K1",
    "q": "Name Kohlberg's six stages of moral development and briefly describe each.",
    "model": "Kohlberg groups six stages in three levels (slide 16). The preconventional level: stage 1, *obedience and punishment*, where norms are *handed down from figures of power* and an act is wrong because you get punished, *might makes right* (slide 17); stage 2, *individualism and exchange*, where it is *right whatever suits one's interests* (normative egoism) but with a sense of fair exchange (slide 18). The conventional level: stage 3, *good boy/nice girl*, where we want praise and to *live up to expectations of others*, family and peers (slide 19); stage 4, *law and order*, concern for *society as a whole*, laws obeyed because *laws are useful for social order*, authority seldom questioned (slide 20).\n\nBetween the levels sits stage 4.5, the cynic, who sees conventions as *socially constructed, relative and arbitrary* but knows no alternative, *wise enough to question it all, not wise enough to find answers* (slide 21). The postconventional level: stage 5, *social contract and individual rights*, where *laws are not good simply because they are laws* and are improved through democratic agreement, with attention to human rights (slide 22); stage 6, *universal ethical principles*, the few who see that even democracy can fail, the *tyranny of the majority*, and that civil disobedience against unjust laws can be justified (MLK; slide 23). On Heinz, a stage 2 subject says steal because the druggist refused a fair deal; a stage 5 subject says life is more important than property.",
    "points": [
      "groups the stages in three levels: preconventional 1–2, conventional 3–4, postconventional 5–6 (slide 16)",
      "describes stages 1 and 2: punishment and might makes right; self-interest with fair exchange",
      "describes stages 3 and 4: expectations and praise of others; laws for social order, authority seldom questioned",
      "names stage 4.5, the cynic: conventions seen as relative, no alternative known (slide 21)",
      "describes stages 5 and 6: laws improvable democratically, rights; universal principles beyond democracy, civil disobedience"
    ],
    "rows": 10,
    "explain": "Students list six names with no description, or leave out stage 4.5 and the three levels. Each stage needs the reason that drives it, not just its label, and the marker expects the slide's terms (might makes right, social order, tyranny of the majority)."
  },
  {
    "type": "free",
    "pq": "K2",
    "q": "Can it be problematic to remain in the law and order stage (Kohlberg) of moral development? Why?",
    "model": "Yes. At stage 4, *law and order*, people are concerned with *society as a whole* and obey rules because *laws are useful for social order*; *authority figures are seldom questioned*, and *many adults never reach the third level* (slide 20). The course notes say development tends to stall at stages 3 and 4, with the *uncritical adoption of moral viewpoints inherited from family and community*. The problem is that stage 4 follows a law because it is a law that keeps order, not because it is just, so it cannot tell when the law or the company rule is itself wrong. To the extent the conventions are *either flawed or may be only accidentally right*, it is *a very poor guide to ethical conduct* (course notes).\n\nTake a developer asked to build a dark pattern that tricks users into sharing their data, where no law yet forbids it. The stage 4 developer builds it: it is legal and the manager asked. Her refusal to copy a rival's source code is right, but only accidentally right, because it tracks the law, not the harm. Where computing law lags behind the technology, stage 4 has nothing to say. Stage 4 is not worthless: laws do keep social order, and most of them are right. But a professional who never asks whether a rule is just will follow it into wrongdoing, so remaining there is a problem.",
    "points": [
      "describes stage 4: laws obeyed because they are useful for social order; authority seldom questioned (slide 20)",
      "says many adults never reach stages 5 and 6, or stall at 3 and 4 (slide 20, course notes)",
      "explains the problem: following laws because they are laws cannot detect an unjust or flawed law or convention",
      "uses 'flawed or only accidentally right' or an equivalent explanation",
      "gives a computing example where the legal or expected act is wrong",
      "takes a side: yes, it can be problematic, while granting social order has value"
    ],
    "rows": 9,
    "explain": "Students answer that stage 4 people are bad or that laws are bad. The marker wants the reason: stage 4 grounds rightness in social order, so it is right only when the law happens to be right. 'It depends on the person' with no example scores little."
  },
  {
    "type": "free",
    "pq": "K3",
    "q": "What is the conventional level of moral development (Kohlberg), and why is it not the final level? (explicitly relate to Singer's arguments in \"All animals are equal\")",
    "model": "Kohlberg's conventional level is stages 3 and 4 (slide 16). At stage 3, *good boy/nice girl*, we want praise and to *live up to expectations of others* (slide 19); at stage 4, *law and order*, we obey laws because they *are useful for social order*, and *authority figures are seldom questioned* (slide 20). At this level we have been *socialized into accepting the customary moral attitudes* of family, community, the corporate world and society (course notes).\n\nIt is not final because, in the notes' words, those attitudes are *either flawed or may be only accidentally right*: convention gets the answer right only when the convention happens to be right. Singer's \"All animals are equal\" shows it. By convention only humans count, and arguing for animals sounds as ridiculous as Taylor's joke against Wollstonecraft (slide 25). Singer reasons instead: *equality is a moral ideal, not a statement of a fact*, so it means equal consideration of interests, not the same rights (slides 26–27); its basis is not merit or intelligence but Bentham's *Can they suffer?* (slide 28); and the experimenter who tests on a guinea pig but not an infant shows speciesism (slide 29). His method, *question the assumptions of our age*, is post-conventional: it tests the convention by reasons instead of consulting what society accepts. The 1990s piracy conventions (slide 24) fail likewise. Whether or not Singer is right about animals, a convention is not justified merely by being the convention.",
    "points": [
      "defines the conventional level as stages 3 and 4: expectations of others, laws for social order (slides 19–20)",
      "says it is not final because conventions may be flawed or only accidentally right (course notes)",
      "states Singer's view that equality is a moral ideal, not a fact: equal consideration of interests, not the same rights (slides 26–27)",
      "gives Singer's basis, 'Can they suffer?', not merit (slide 28), and names speciesism (slide 29)",
      "says Singer's reasoning is post-conventional: it questions the convention by principle rather than accepting it"
    ],
    "rows": 10,
    "explain": "Students describe stages 3 and 4 and then summarize Singer with no link between them. The question asks you to relate them: Singer is the example of reasoning that rejects a convention (only humans count) on principle, which is why convention cannot be the last level."
  },
  {
    "type": "free",
    "pq": "K4",
    "q": "Why does Kohlberg describe a stage 6 of moral development? Should it not suffice to believe in democracy and in changing unfair laws using democratic processes, as someone in stage 5 will do? Briefly discuss.",
    "model": "Stage 5 already questions the law: *laws are not good simply because they are laws*, and there is *a commitment to the social contract and to changing laws through democratic agreements* (slide 22). Kohlberg adds stage 6, *universal ethical principles*, because *even democratic processes may fail*: a majority can elect someone who hurts a minority, *the so-called \"tyranny of the majority\"* (Mill, Jefferson; slide 23). Aristotle's question is whether the majority rules *for its own advantage, or for the common advantage*.\n\nSo believing in democracy does not suffice, and I think Kohlberg is right. A fair procedure does not guarantee a just result: a vote is a convention on a larger scale, and like any convention it can be flawed. Stage 6 asks whether a law is just, not only whether it was passed fairly; with Martin Luther King, *laws are only valid insofar as they are grounded in justice*, and *if a law cannot be changed by democratic processes, disobedience can be morally justified*. Suppose a law required platforms to hand a persecuted minority's private messages to the state, and the minority had no democratic route to change it. A stage 5 engineer complies while lobbying; a stage 6 engineer can rightly refuse. Stage 5 keeps its value: most of the time working through democracy is right, which is why disobedience is justified only once the democratic route is closed.",
    "points": [
      "states stage 5: laws improved through the social contract and democratic agreements (slide 22)",
      "says democracy can fail: the tyranny of the majority (slide 23)",
      "states stage 6: laws valid only insofar as grounded in justice (Martin Luther King)",
      "says civil disobedience can be justified when a law cannot be changed democratically (slide 23)",
      "takes a side (democracy does not suffice) with an example"
    ],
    "rows": 9,
    "explain": "Students answer that stage 6 is for people who reject democracy. Stage 6 does not reject democracy; it denies that a democratic decision is just merely because it is democratic, and it justifies disobedience only when the democratic route is closed."
  }
]
```

## Lecture 3: normative relativism fails, and objectivism is not absolutism

```quiz
[
  {
    "type": "free",
    "pq": "R1",
    "q": "Distinguish descriptive ethical relativism from normative ethical relativism",
    "model": "Descriptive ethical relativism is an empirical claim: *different societies have different moral codes*, Rachels's claim 1 on slide 17, which the slide calls *True. It's empirically verifiable*. Herodotus's Greeks and Callatians were each shocked by the other's funeral customs (slide 15). Normative ethical relativism is a claim about what is right, not about what people believe: claims 2 to 6, that *there is no objective standard* to judge one code better than another, that our own code *is merely one among many*, that there is *no universal truth in ethics*, that *the moral code of a society determines what is right in that society*, and that judging other peoples is arrogance. Slide 17 calls it *a mistake with serious consequences*.\n\nRelativists argue from the first to the second. Rachels's cultural differences argument (slide 18) takes the empirical premise and concludes that there is no objective truth in morality, which is *a move from \"is\" to \"ought\"*, so the argument is invalid: it is not because people believe something that they ought to believe it, just as some people believing the Earth is flat does not mean they should believe it. Suppose one country sees phishing as harmful and another as fair profit from the naive. The descriptive claim records that, truly; the normative claim would make phishing right in the second country, and that does not follow. So I accept the first claim and reject the second.",
    "points": [
      "defines descriptive relativism as the empirical claim that moral codes differ between societies, and says it is true (slide 17, claim 1)",
      "defines normative relativism as the claim that right and wrong are determined by one's society's code (claims 2–6), a mistake (slide 17)",
      "says one is about what people believe, the other about what is right",
      "says inferring the normative from the descriptive is \"ought from is\", so invalid (slide 18)",
      "gives an example (Greeks and Callatians, phishing, or another)"
    ],
    "rows": 9,
    "explain": "Students describe both as forms of relativism the course rejects; descriptive relativism is true and the course accepts it. Defining normative relativism as \"people should disagree\" or \"it depends\" misses that it says the society's code determines what is right."
  },
  {
    "type": "free",
    "pq": "R2",
    "q": "Distinguish objectivism from absolutism (careful with using Google/ChatGPT for definitions as you may find entirely different definitions! Consider the definition of objectivism as discussed in class, and Pojman's definition of absolutism as discussed in class)",
    "model": "Slide 28 gives Pojman's definitions. *Moral objectivism: There is a fact of the matter as to whether any given action is morally permissible or impermissible: a fact of the matter that does not depend solely on social custom or individual acceptance.* *Moral absolutism: There is at least one principle that ought never to be violated.* Objectivism answers whether at least some moral values are universally valid, and its opposite is relativism. Absolutism answers whether right and wrong can be captured in principles with no exceptions, and its opposite is non-absolutism. So absolutism is not the opposite of objectivism: the two questions are independent (slide 36).\n\nKant (*\"Don't lie\"*) is an objectivist absolutist; utilitarians (*\"Lie if it maximizes utility\"*) are objectivist non-absolutists; *\"Canadians should never lie\"* is absolutist and relativist (slides 29, 36). A developer who holds that user data must never be shared is an objectivist absolutist; one who holds that it may be shared to stop a ransomware attack in progress is an objectivist non-absolutist, and her \"it depends\" is about the circumstances of the action, like the bridge engineer's (slide 33), not about culture, so it is not relativism. The web's definitions fail here: they give Ayn Rand's Objectivism, or \"objective\" as unbiased, but slide 24 says being an objectivist is a philosophical position while being objective describes someone's psychology. Hitler and Gandhi were both objectivists.",
    "points": [
      "gives Pojman's definition of objectivism: a fact of the matter not depending solely on social custom or individual acceptance (slide 28)",
      "gives Pojman's definition of absolutism: at least one principle that ought never to be violated (slide 28)",
      "says the two are independent: objectivists can be absolutist (Kant) or non-absolutist (utilitarians), and a relativist can be absolutist (slides 28–29, 36)",
      "says non-absolutist \"it depends\" (circumstances) is not relativism (culture) (slide 33)",
      "says why the web definition fails: not Ayn Rand's Objectivism, not being objective/unbiased (slide 24)"
    ],
    "rows": 10,
    "explain": "The practice list warns about this one: answers that define objectivism as being unbiased, or as Ayn Rand's philosophy, score nothing for that part. Treating absolutism as the opposite of objectivism, or calling \"it depends\" relativism, are the other two mistakes (lecture 4 slide 6)."
  },
  {
    "type": "free",
    "pq": "R3",
    "q": "Is it true that only a relativist can be tolerant? Explain why this is not true and briefly discuss.",
    "model": "It is not true. Slide 35 says that many relativists *falsely believe that relativism is a logical consequence of the value of tolerance*. Tolerance is itself a value, and a moral objectivist, who holds that at least some values have *a fact of the matter that does not depend solely on social custom or individual acceptance* (Pojman, slide 28), can hold tolerance as one of them. Each objectivist commits to a core of values *where tolerance seems inappropriate (e.g. sexual harassment, fraud, corruption, murder)*, and *only outside this core tolerance is meaningful*. The relativist, by contrast, cannot defend tolerance at all: in a society whose code is intolerant, relativism makes intolerance right there, and a relativist meeting an intolerant person must tolerate the intolerance (course notes).\n\nTake a team lead who accepts her developers' different working hours, religious dress and political views, but who will not accept a colleague harassing a co-worker or selling user data. She is tolerant outside her core and firm inside it, which is tolerance *just right* (slide 6): hypermoralism tolerates nothing, relativism everything. She can judge without interfering, and reject a practice rather than a whole culture (slide 25). Relativists are not consistent here anyway: they *will probably judge the actions of Hitler or Jeffrey Dahmer* (slide 35). So the objectivist is the one who can be tolerant and say why tolerance is good.",
    "points": [
      "answers no: relativism is not a logical consequence of tolerance (slide 35)",
      "says tolerance is itself a value an objectivist can hold as objectively valid",
      "explains core values: tolerance is meaningful only outside one's core (slide 35)",
      "says the relativist cannot defend tolerance where a culture rejects it, or must tolerate intolerance",
      "gives an example, or uses judging without interfering (slide 25) or tolerance just right (slide 6)"
    ],
    "rows": 9,
    "explain": "Students argue that objectivists are intolerant because they think they are right, confusing objectivism with being dogmatic or absolutist. Holding that some values are universal does not mean tolerating nothing; the core-values picture is what the marker looks for."
  },
  {
    "type": "free",
    "pq": "R4",
    "q": "Suppose that a normative moral relativist argues that \"out of respect and tolerance, we ought not to criticize other cultures.\" Why is it problematic to argue this?",
    "model": "Normative moral relativism holds that *there are no moral truths that hold for all peoples at all times* and that *the moral code of a society determines what is right in that society* (slide 17, claims 4 and 5). But \"out of respect and tolerance, we ought not to criticize other cultures\" is a universal ought: it tells every person in every culture what they ought to do. If relativism is true, there is no such universal moral truth, so the relativist cannot assert it; if they assert it, they have given up relativism. The claim defeats itself, as \"do not judge\", which slide 11 calls wrong *if taken literally*, is itself a judgment.\n\nIt also fails by relativism's own lights. A culture whose code says to criticize and condemn other cultures would be right to do so, so the relativist cannot say it ought not to. Taken seriously, the rule has Rachels's unacceptable consequences: no criticizing slavery, FGM or apartheid (slide 19). And respect does not require silence: *it is possible to judge without interfering*, and we can reject individual practices rather than a whole culture (slide 25). A platform that refuses to condemn a government's state-sponsored hacking \"out of respect\" is making a universal claim about respect while denying that universal claims exist. Respect and tolerance can be defended as values only if some values hold across cultures, which is objectivism (slide 35).",
    "points": [
      "states normative relativism: no universal moral truths; each society's code determines right (slide 17)",
      "says the claim is a universal ought binding every culture, which relativism denies exists: self-refuting",
      "says a culture whose code endorses criticizing others would be right to do so by relativism's own lights",
      "uses the reductio (slavery, FGM, apartheid, slide 19) or judging without interfering (slide 25)",
      "concludes that tolerance and respect are defensible as values only if some values are objective (slide 35)"
    ],
    "rows": 9,
    "explain": "Students answer that criticizing is sometimes needed, which is true but misses the logical problem: the relativist's sentence is a universal moral claim, which relativism says cannot exist. The marker wants the self-refutation first."
  },
  {
    "type": "free",
    "pq": "R5",
    "q": "Identify two important arguments that can be raised against normative ethical relativism. Briefly discuss.",
    "model": "Normative ethical relativism holds that *the moral code of a society determines what is right in that society* and that no code is objectively better than another (slide 17, claims 2 to 6). The first argument against it is that its main support, the cultural differences argument, is invalid (slide 18). From the empirical premise that *different societies have different moral codes* it concludes that *there is no objective truth in morality*, *a move from \"is\" to \"ought\"*. Some people believing that the Earth is flat does not mean they should believe it; people disagreeing about morality does not show there is no truth to disagree about.\n\nThat only removes the support, since an invalid argument can still have a true conclusion (slide 19). The second argument is a reductio: if relativism were true, *we could not criticize the customs of other societies*, not even slavery or FGM; we could know right from wrong *by merely consulting the standards of our own society*, so apartheid was right in South Africa while it was accepted; and *there could be no moral progress*. In computing terms, a government that approves its agents hacking foreign businesses would be acting rightly by its own lights, and no one outside could call it wrong, which is the question Microsoft faced with Strontium. These consequences are unacceptable, so I think the second argument is the stronger: it gives a reason to think relativism false, not merely unproven.",
    "points": [
      "argument 1: the cultural differences argument is invalid, an ought from an is (slide 18)",
      "notes that an invalid argument does not show the conclusion false, so a second argument is needed (slide 19)",
      "argument 2: the reductio, naming at least two of the three consequences (no criticizing other societies, right = consult your society, no moral progress) (slide 19)",
      "gives an example (apartheid, slavery, state-backed hacking)",
      "takes a side or discusses which argument is stronger"
    ],
    "rows": 9,
    "explain": "Students list the three consequences as three separate arguments and skip the invalidity of the argument, or state the arguments without discussing them as the question asks. Saying relativism is wrong \"because some things are just wrong\" assumes what is to be shown."
  }
]
```

## Lectures 4 and 5: act utilitarianism and the objections to it

```quiz
[
  {
    "type": "free",
    "pq": "U1",
    "q": "Does utilitarianism ask us to maximize happiness for the majority (over 50%)? Explain.",
    "model": "No. Utilitarianism maximizes total aggregated utility; maximizing happiness for the majority is the mistake that lecture 5 slide 6 corrects: *What matters is only total aggregated utility. Choose that option no matter how many are helped, and how distribution looks*. Its principle of equal consideration of interests (lecture 4 slide 15) says *the pleasure or pain of one person should be of no more value than the pleasure or pain of another*: everyone affected counts, and counts equally, in the sum. ECI is *not a principle of equal treatment or just distribution*, and *the action recommended by applying the ECI may well only benefit a few, or only one*.\n\nLecture 4 slide 16 shows it with five people affected: −2 −1 −2 +500 +5. Three of the five, a majority, lose, yet the total is +500 and the action is right if no alternative does better. Large numbers often matter only because *utility adds up when high numbers of people are found (e.g. kill 1 to save 19)*, and that holds *in many cases (but not all)*. Bentham's *greatest happiness of the greatest number* is the misread quote: it does not mean serving the majority or spreading utility evenly. In computing, a pension app's default contribution that mildly annoys most users but saves a few from poverty in old age is right if it gives the highest total, though most users would vote against it.",
    "points": [
      "answers no: utilitarianism maximizes total aggregated utility, however many are helped (l5 slide 6)",
      "states ECI: each person's pleasure and pain counts equally, but this is not equal treatment or just distribution (l4 slide 15)",
      "gives the row −2 −1 −2 +500 +5 or an example where a minority's large gain outweighs a majority's small loss (l4 slide 16)",
      "explains that numbers matter only because utility often adds up with more people (kill 1 to save 19), not in all cases",
      "calls 'the greatest happiness of the greatest number' the misread quote"
    ],
    "rows": 9,
    "explain": "The usual wrong answer is yes, utilitarianism serves the most people: the exact revision of slide 6. Answering no without the row or a case where the few outweigh the many shows the correction was memorized, not understood."
  },
  {
    "type": "free",
    "pq": "U2",
    "q": "Does utilitarianism ask us to do what causes more pleasure than pain? Explain.",
    "model": "No. Doing what causes more pleasure than pain is not the criterion; slide 7 calls *it's moral because the benefits outweigh the costs* an *inaccurate summary of the actual procedure*, and *utilitarianism is also not about causing more good than bad*. The correct interpretation (lecture 4 slide 24): *An action is right if and only if there is no other available action the agent could have done instead that has higher utility*, where *Utility = net of Pleasure – Pain*. The theory compares every available action and requires the one with the highest net utility; it maximizes rather than asking for a positive balance.\n\nSlide 7 gives two reasons. *You may have several options where the benefits outweigh the costs*: a rule of more pleasure than pain would approve them all, but only the best is right and the rest are wrong. *You may have no options where this happens*: that rule would approve nothing, yet one option is still right, the least bad, though it causes more pain than pleasure, since *the action recommended by utilitarianism may cause pain* (slide 10). Suppose a company's servers have already leaked user data and every way of handling it causes net pain: the right choice is the one causing the least. A software release that pleases users more than it harms them is still wrong if a safer release would have produced more net utility, because *increasing utility is not enough if it's not maximized*.",
    "points": [
      "answers no: right iff no available alternative has higher utility (l4 slide 24)",
      "defines utility as net pleasure minus pain",
      "says several options may give more pleasure than pain, and only the maximum is right (slide 7)",
      "says no option may give more pleasure than pain, and the least bad is still right, so the right act may cause pain (slides 7, 10)",
      "names 'benefits outweigh the costs' or 'more good than bad' as the inaccurate summary"
    ],
    "rows": 9,
    "explain": "Students answer yes, as long as pleasure exceeds pain, which is the slide 7 revision. It also misses that cost-benefit analysis has a point of view (whose costs?), while utilitarianism counts everyone equally."
  },
  {
    "type": "free",
    "pq": "U3",
    "q": "How can utilitarians know what to do, if moral evaluation is based on the actual consequences of actions they haven't done yet?",
    "model": "They cannot know for certain, and utilitarianism does not claim they can. The theory judges *only actual consequences of actions - not predicted, likely or intended consequences* (week 4 notes), and slide 24 makes an action right *if and only if there is no other available action the agent could have done instead that has higher utility*. But this is a criterion of right, not a decision procedure: *utilitarianism doesn't demand or expect that a utilitarian must calculate utility at all before acting*, and one may act *by instinct, or using kindness*, or from loyalty. The principle *demands nothing of a user's motivations or knowledge*.\n\nIn practice a utilitarian acts on experience. Answering the lack-of-time objection (Lecture 5, slide 18), Mill says we need not suppose *universal idiocy*: *mankind must by this time have acquired positive beliefs as to the effects of some actions on their happiness*, so we know lying, corruption and torture tend to cause pain, and social rules *generally suffice* (slide 22). A penetration tester who keeps to the agreed scope acts on that evidence. If the test still crashes a clinic's records system, the act was wrong by its actual outcome, but foreseeing what no available evidence showed was not an option open to her, and *no ought without can*: she is not to blame. The objection fails against the criterion, though the verdict often comes only afterwards.",
    "points": [
      "says utilitarians cannot know actual consequences in advance and the theory does not claim they can, while rightness still depends on the actual outcome, not the predicted one",
      "states that utilitarianism is a criterion of right, not a decision procedure; no calculation is required before acting (week 4 notes)",
      "gives Mill's reply: experience (not universal idiocy) tells us what actions tend to cause pain, e.g. lying, corruption, torture (Lecture 5 slide 18)",
      "uses no ought without can or blamelessness for an unforeseeable outcome",
      "gives a computing example (e.g. a penetration test)",
      "takes a side: the objection fails against a criterion of right"
    ],
    "rows": 9,
    "explain": "Students often answer that utilitarians judge by predicted or intended consequences, which the course rejects: only actual consequences count. Others only list the felicific calculus, a utility calculation that does not answer how the agent can know."
  },
  {
    "type": "free",
    "pq": "U4",
    "q": "Utilitarianism says that we should consider interests equally. Does this mean that it advocates justice (e.g. borrowed money should be paid back, the terms of fair legal contracts should be followed, no one should be punished for a crime they didn't commit, etc..)? Explain.",
    "model": "No. Equal consideration of interests means that equal amounts of pleasure or pain count equally in the sum, whoever has them; it is not equal treatment and not a just distribution (Lecture 4, slide 16). Slide 33 states the gap: there is *equal consideration of interests, but... utility is aggregated*. Once everyone's utility is added into one total, only the total matters. Justice and human rights are therefore not *values in themselves*; acting on them *will have only derivative value* (slide 32), so repaying a debt, honouring a contract or sparing the innocent is right only when, in that particular case, it maximizes utility.\n\nThe slides show what follows. Peter and Sarah worked equally hard, but if Peter is sad unless he gets 60%, the 60-40 split can be right (slide 33). Deterrence can recommend that we *frame an innocent and punish him in public* (slide 32), and a promise binds only when keeping it pays (slide 28). In computing: a start-up owes a freelance developer for finished work; if withholding the payment and spending it on a feature that pleases thousands of users yields more total utility, the theory says the start-up need not pay its debt. So utilitarianism can recommend injustice, and I think this shows equal consideration is a rule for counting interests, not a commitment to justice.",
    "points": [
      "answers no: ECI counts interests equally in the sum but does not require equal treatment or just distribution",
      "states slide 33's point: equal consideration of interests, but utility is aggregated",
      "says justice and rights have only derivative value (slide 32)",
      "gives Peter and Sarah's 60-40 or framing an innocent as an example",
      "gives a computing example of an injustice the theory could recommend"
    ],
    "rows": 10,
    "explain": "The trap is to answer yes because ECI sounds like fairness. Equal consideration is about counting interests, not distributing goods; and the answer must say the theory can recommend the injustice, not just that it might."
  },
  {
    "type": "free",
    "pq": "U5",
    "q": "Utilitarianism is a hedonistic moral theory. According to normative hedonism, the only intrinsic good is pleasure. What arguments can be raised against normative hedonism? Explain.",
    "model": "Normative hedonism (lecture 4 slide 13) holds that *pleasure is the only intrinsic good, pain the only intrinsic bad*, which is why utility is net pleasure minus pain. Slide 20 asks whether *all our actions can be ultimately justified by reference to pleasure*, and the famous argument against it is Nozick's experience machine (*Anarchy, State and Utopia*, 1974). The machine *can give you any experiences you want*, *perfectly simulates a life of achievement, pleasure, love*, *is indistinguishable from reality*, and *you must plug in permanently* (slide 22). *If pleasure and pain are the only things that have ultimate value, you should want them even if they are not deserved* (slide 20), so a normative hedonist must plug in.\n\nMost of us refuse, and Nozick's three reasons (slide 23) say why. We want *to do certain things, and not just have the experience of doing them*: a programmer wants to have really built the system, not merely to feel that she has. We want *to be a certain sort of person*, and *someone floating in a tank is an indeterminate blob*. And the machine *limits us to a man-made reality* with *no actual contact with any deeper reality*: *ignorance may be bliss, but it's worthless bliss*. So *pleasure is not the only thing that has intrinsic value*. I think the argument succeeds: hedonism cannot explain why we prefer reality to a better-feeling illusion.",
    "points": [
      "defines normative hedonism: pleasure the only intrinsic good, pain the only intrinsic bad (l4 slide 13)",
      "describes the experience machine and its features, including permanent and indistinguishable from reality (slide 22)",
      "says a normative hedonist should plug in, but most of us would not",
      "gives Nozick's three reasons: doing things, being a certain sort of person, contact with a deeper reality (slide 23)",
      "concludes that pleasure is not the only thing with intrinsic value (slide 23)"
    ],
    "rows": 9,
    "explain": "Students describe the machine and stop, without saying why refusing counts against hedonism, or mix it up with psychological hedonism, which is a claim about what explains action, not what is good."
  },
  {
    "type": "free",
    "pq": "U6",
    "q": "According to Mill, pleasure and pain can be evaluated according to quality, and not just according to quantity (as Bentham had argued). \"It is better to be a human being dissatisfied than a pig satisfied, better Socrates dissatisfied than a fool satisfied\", said Mill. What are the main advantages and disadvantages of Mill's inclusion of quality in the measurement of utility?",
    "model": "Bentham measured utility by quantity alone; Mill (lecture 4 slide 22) *rejected the idea that the mere quantification of utility was all that mattered*: *some kinds of pleasure are more desirable and more valuable than others* (slide 13). The main advantage is that this answers the doctrine of swine (slide 12): utilitarianism no longer implies that a satisfied pig lives as well as a human, which fits the intuition that some lives and pleasures are better. It also gives a test rather than the moralist's taste: the higher pleasure is the one that *all or almost all who have experience of both* prefer, *irrespective of any feeling of moral obligation to prefer it* (lecture 4 slide 25).\n\nThe disadvantages are slide 13's three doubts. *How do we know who is a competent judge?* Few people know both pleasures well, and choosing who counts already assumes an answer. *What if judges disagree?* Mill gives no tiebreaker. Most serious, quality may *smuggle non-utilitarian forms of morality evaluation* into the theory: if reading philosophy outranks a larger amount of a simpler pleasure, something besides pleasure is doing the valuing, which contradicts normative hedonism. The course notes add that the judges make the theory *a moving target* and add subjectivity, and qualities are harder to add up than amounts. On balance I think the gain is real but costs utilitarianism its simplicity and possibly its hedonism.",
    "points": [
      "states Mill's view: quality as well as quantity, against Bentham's quantity only (l4 slide 22)",
      "advantage: answers the doctrine of swine objection (slides 12–13)",
      "explains the competent judges as the test of quality (l4 slide 25)",
      "disadvantage: who counts as a competent judge, and what if judges disagree (slide 13)",
      "disadvantage: quality may smuggle non-utilitarian (non-hedonistic) evaluation into the theory (slide 13)",
      "takes a side on whether the gain is worth the cost"
    ],
    "rows": 10,
    "explain": "Students list the advantage and the Socrates quote and give no disadvantages, or give only 'it is subjective'. The marker wants slide 13's three doubts, the third above all."
  },
  {
    "type": "free",
    "pq": "U7",
    "q": "What is the \"Too high for humanity\" objection to utilitarianism, and how has Mill responded to it?",
    "model": "The objection, in Mill's own description on slide 14, is that *it is exacting (demanding) too much to require that people shall always act from the inducement of promoting the general interests of society*. The slide's example: when we are kind to a neighbour, we are not really moved by the general interest of society, so a theory that asks for that motive asks too much of human beings. Mill replies (slide 15) that the objection confuses *the rule of action with the motive of it*: *It is the business of ethics to tell us what are our duties, or by what test we may know them, but no system of ethics requires that the sole motive of all we do shall be a feeling of duty*. The test is the actual consequences, so the kind neighbour acts rightly whatever moved them.\n\nThe reply works against the objection as stated, but only by making motives irrelevant to right and wrong, and slide 15 asks whether that is true. Sandel's doctors (slide 16) test it: judged by actual outcomes, the doctor who meant to exterminate the villagers but left them healthier acted rightly, and the one who meant to heal them but unknowingly infected them acted wrongly, which most of us reject. So would a developer whose trap-the-user dark pattern happened to leave users better off. So Mill avoids demanding saintly motives at the price of a verdict on motives that is hard to accept.",
    "points": [
      "states the objection: it demands too much to require that people always act from the motive of promoting the general interest (slide 14)",
      "gives the neighbour example or an equivalent everyday act",
      "states Mill's reply: the objection confuses the rule of action with the motive of it; ethics gives the test of duty, not the sole motive (slide 15)",
      "says rightness depends on the actual consequences, not the motive",
      "questions whether motives really don't matter, with Sandel's doctors (slide 16) or a computing example",
      "takes a side on whether Mill's reply succeeds"
    ],
    "rows": 9,
    "explain": "Students often answer with the demandingness of maximizing (giving everything away), which is the supererogation problem of slides 36 to 38, not this objection: this one is about the motive behind an action. A bare quote of Mill's reply without saying what it means scores little (slide 5)."
  },
  {
    "type": "free",
    "pq": "U8",
    "q": "What is the \"Doctrine of swine\" objection to utilitarianism, and how has Mill responded to it?",
    "model": "The objection, as Mill describes it on slide 12: *To suppose that life has no higher end than pleasure – no better and nobler object of desire and pursuit – they designate as utterly mean and grovelling; as a doctrine worthy only of swine*. It targets normative hedonism, *utilitarianism's claim that pleasure is the only thing that has intrinsic value (all other things have instrumental value)*. If pleasure is all that is good, a pig that eats and sleeps all day has as good a life as a human.\n\nMill replies (slide 13) that *some kinds of pleasure are more desirable and more valuable than others*, so we must weigh quality as well as quantity, unlike Bentham. The test is the competent judges, *those who are properly acquainted with both*: if all or almost all who have experienced two pleasures give one *a decided preference*, it is the higher (lecture 4 slide 25). Hence, in Mill's words on lecture 4 slide 22, *better Socrates dissatisfied than a fool satisfied*. An engineer who has both built a hard system and spent an evening scrolling a feed is a competent judge of those two pleasures. The reply answers the insult, but slide 13 asks whether it is good: who is competent, what if judges disagree, and does quality smuggle a non-utilitarian standard into the theory? I think it succeeds against the objection only by making the theory less purely hedonistic.",
    "points": [
      "states the objection: a life with no higher end than pleasure is a doctrine worthy only of swine (slide 12)",
      "says it targets the claim that pleasure is the only intrinsic good",
      "states Mill's reply: pleasures differ in quality as well as quantity (slide 13)",
      "explains the competent judges: those acquainted with both pleasures decide which is higher (l4 slide 25)",
      "raises a slide 13 doubt (who is competent, disagreement, smuggling non-utilitarian value) and takes a side"
    ],
    "rows": 9,
    "explain": "Students describe the pig and stop, without saying the objection targets pleasure as the only intrinsic good, or give 'quality' without the competent judges. A Mill quote with no explanation in your own words scores little (slide 5)."
  },
  {
    "type": "free",
    "pq": "U9",
    "q": "What is the \"Lack of time\" objection to utilitarianism, and how has Mill responded to it?",
    "model": "The objection, in Mill's description on slide 17: *There is not time, previous to action, for calculating and weighing the effects of any line of conduct on the general happiness*. Utilitarianism asks us to identify everyone affected, aggregate the utility of every available action and choose the maximum (slide 8), but most choices must be made at once, so the theory seems impossible to use.\n\nMill replies (slide 18): *There is no difficulty in proving any ethical standard whatever to work ill if we suppose universal idiocy to be conjoined with it*. Any theory fails if we assume its user is an idiot; but humanity has had the whole past duration of the species to learn, and *must by this time have acquired positive beliefs as to the effects of some actions on their happiness*. *One can know, by experience, that some actions (e.g. lying, corruption, torture) are likely to cause pain*, so *there is no need to calculate every time*, a point Bentham had already made. A developer asked to falsify a security audit report does not need a calculation to know that the lie will very likely cause harm. I think the reply succeeds for ordinary cases, though it leaves new situations, such as a novel technology, with little experience to draw on, and the experience guides the decision without replacing the criterion: the act is still right or wrong by its actual consequences.",
    "points": [
      "states the objection: no time before acting to calculate the effects on general happiness (slide 17)",
      "states the universal idiocy reply: any theory fails if its user is assumed to be an idiot (slide 18)",
      "says experience shows some kinds of action (lying, corruption, torture) tend to cause pain, so no need to calculate every time (slide 18)",
      "notes Bentham made the same point, or that one calculates when there is time",
      "takes a side on whether the reply succeeds, with an example"
    ],
    "rows": 9,
    "explain": "Students give the objection and Mill's quote without translating 'universal idiocy' into what it means (slide 18's translation), or turn the answer into how we cannot know actual consequences, which is a different question."
  },
  {
    "type": "free",
    "pq": "U10",
    "q": "What is Mill's justification (his \"Proof\") for the principle of utility?",
    "model": "Mill's proof (lecture 4 slide 26): *The only proof capable of being given that an object is visible is that people actually see it.... In like manner, I apprehend, the sole evidence it is possible to produce that anything is desirable is that people do actually desire it.* Each person desires his or her own happiness, so happiness is desirable, a good, and the general happiness is a good to the aggregate of all persons. Slide 24 puts it as *We desire pleasure, therefore it is desirable*: a desire-fulfilment theory of welfare, on which what is desired is what is good.\n\nThe proof fails because *desirable* has two readings (slide 24). If it means able to be desired, the proof says *we desire pleasure, therefore we desire pleasure*: *trivially true but circular*. If it means good, worth desiring, it says *we desire pleasure, therefore it is good*: *clearly wrong*. Visible and desirable are not parallel: being seen shows that a thing can be seen, but being desired does not show that it ought to be. People desire crack because they are addicted, or to be hurt out of low self-esteem, and a user hooked on a feed designed to be compulsive desires more of it; none of this is good for them. So the proof is circular or wrong; it moves from an empirical fact (people desire X) to a value conclusion (X is good), no ought from is.",
    "points": [
      "gives the visible/desirable analogy in Mill's words (l4 slide 26)",
      "states the conclusion: happiness is desirable (good), and the general happiness is good for all; a desire-fulfilment theory of welfare (slide 24)",
      "gives the two readings of 'desirable': circular if it means can be desired, wrong if it means good (slide 24)",
      "gives crack, self-harm or a computing example of desiring what is bad",
      "says the proof moves from what people desire (empirical) to what is good (value)"
    ],
    "rows": 9,
    "explain": "Students quote the visible/desirable sentence and stop. A quote with no explanation in your own words scores little (slide 5); the marker wants the two readings of 'desirable' and why each fails."
  },
  {
    "type": "free",
    "pq": "U11",
    "q": "Why can it be problematic to aggregate utility? Provide an example.",
    "model": "To aggregate utility is to add up all the pleasures and pains of everyone affected by an option, counting each person's interests equally, and then to choose the option with the highest total (slide 8, step 2). Slide 25 states the problem as a choice: *Is it OK to aggregate all utility? Or must we respect the rights of individuals, even at a cost to general happiness?* Because only the total matters, a great harm to one person, or a violated right, can always be outweighed by enough smaller gains to others. Rights, promises and fairness have no weight of their own; they count only as pleasure or pain in the sum.\n\nSlide 25's example: a dark pattern tricks a user into sharing photos he wished were private, and in one case the RCMP uses them to identify him as a sex offender and convict him. Summed on the actual outcome, the violation of his privacy was right, even required, although his consent was obtained by deception and the good result was luck. A computing case of my own: an online retailer quietly sells one customer's purchase history so that thousands of others get slightly cheaper prices; if the many small gains add up to more than her loss, utilitarianism approves. I think this shows aggregation is a real problem: an individual's rights should not depend on how many others benefit from violating them.",
    "points": [
      "defines aggregation: everyone's pleasure and pain added into one total, ECI, maximize (slide 8)",
      "states slide 25's question: aggregate all utility, or respect individual rights at a cost to general happiness",
      "says a great harm to one can be outweighed by many small gains, so rights have no weight of their own",
      "gives the RCMP photos case or an equivalent computing example",
      "takes a side on whether this is a serious problem for the theory"
    ],
    "rows": 9,
    "explain": "Students often write that utilitarianism serves the majority. It does not (slide 6): it serves the highest total, which can be a minority's large gain; the problem is that the total ignores rights, not that it counts heads."
  },
  {
    "type": "free",
    "pq": "U12",
    "q": "How could advocating for perfect impartiality be a problem for utilitarianism?",
    "model": "Utilitarianism counts every affected person's interests equally, and Singer draws the consequence: *we cannot discriminate against someone merely because he is far away from us*, *in distance or psychologically - friend or stranger* (slide 35); *emotional proximity and physical distance do not matter* (slide 34). Perfect impartiality means my own child's life weighs exactly as much as a stranger's. In slide 35's case, three kids fall in the water and I can save two strangers or my own child: impartiality says I must save the strangers, and with 11 strangers against my family of 10, let my whole family die. A1 accepts this: *impartiality is the only way to be moral*.\n\nTwo objections make it a problem. A2: *no ought without can*; almost no one can be that impartial, so there can be no obligation to be. A3: it is *actually wrong to be that impartial*, because *there are special duties to those who rely on us (e.g. our children, partner, friends)*. A computing case: a developer asked to implement a dark pattern harming users in India (slide 34) must, if impartial, weigh her family's need for her income no more than any one user's loss, and refuse or report it even at great cost. I think A3 is the stronger objection: a parent who let their child drown to save two strangers would have failed that child, so the theory misses a real moral duty.",
    "points": [
      "states impartiality: distance and emotional proximity do not matter; friend or stranger (slides 34 to 35)",
      "uses the three kids or the 11 strangers versus family of 10",
      "gives A2: no ought without can; almost no one can be that impartial",
      "gives A3: special duties to those who rely on us make it wrong",
      "gives a computing example and takes a side"
    ],
    "rows": 9,
    "explain": "Students often stop at \"it is hard to be impartial\" (A2 alone); the stronger point is A3, that partiality to those who rely on us can be a duty, not a weakness."
  },
  {
    "type": "free",
    "pq": "U13",
    "q": "What does utilitarianism say about keeping promises?",
    "model": "Utilitarianism says a promise has no intrinsic moral force. Slide 28: *you only need to keep a promise when it maximizes utility*, so *promises will rarely be kept*; and *when a promise is kept, there's no requirement to do it because it was promised*. Breaking a promise *may cause pain*, and that pain counts in the sum, *but otherwise there's no intrinsic moral obligation to keep promises*. Keeping a promise is right only when, on the actual outcome, no other available action yields more utility; like any other act, it is never right or wrong in itself.\n\nSandel's dying grandfather (slides 29 to 30) shows the cost. The grandson promised to bury him with respect; on the island the options are bait +25, bury −10, let the body rot −2, throw it in the sea −1. The grandfather is dead and no one will know, so breaking the promise causes no pain, and using the body for bait is required. In computing, a developer who promised a client to delete their data after a project should, by this theory, break the promise and sell the data if that would produce more total utility and no one finds out. I think this is a serious problem: we trust promises because they bind when breaking them would pay.",
    "points": [
      "states that a promise is kept only when keeping it maximizes utility, so promises will rarely be kept (slide 28)",
      "says there is no intrinsic obligation; only the pain of breaking it counts",
      "uses the dying grandfather with the slide 30 utilities (bait +25 highest) or an equivalent",
      "concludes the promise may be, even must be, broken when no one will know",
      "takes a side, with a computing example"
    ],
    "rows": 9,
    "explain": "Saying utilitarianism tells us to keep promises because breaking them generally causes pain describes rule utilitarianism (slide 9); act utilitarianism judges each promise on its own actual outcome."
  },
  {
    "type": "free",
    "pq": "U14",
    "q": "According to some moral theories, very demanding actions (e.g. saving someone from a fire at great risk to one's own life), while moral, are not absolutely required actions from a moral point of view – it is not wrong to fail to perform them. They are called supererogatory actions (i.e. beyond the call of duty). Are there supererogatory actions in utilitarianism? Explain (keep in mind Singer's arguments in \"Famine, Affluence and Morality\")",
    "model": "No, not in classical act utilitarianism. An action is right if and only if no available alternative has higher utility, so the right action is always required and anything less is wrong; there is no moral but optional zone. A supererogatory action is *beyond the call of duty*, *ethical, but not strictly required* (slide 34). Slide 37: if the threshold of supererogation is *abolished, no duty is considered supererogatory* and *this what classical act utilitarianism actually calls for*; we can no longer tell duty (*ethically mandatory*) from charity (*moral to give, but optional*). Saving someone from a fire at great risk is required whenever it maximizes utility.\n\nSinger agrees. Helping Bengali refugees is *not mere charity*; *it's our duty* (slide 34). His strong version says to prevent bad things unless we would sacrifice something of *comparable moral significance*, which means giving down to *the level of marginal utility*, and he calls it *the correct one* (slide 36). His moderate version, unless we sacrifice *something morally significant*, only redraws the threshold upward, creating *a moral duty to do some charity* (slide 37). The drowning child shows the principle: muddy clothes do not excuse letting a child drown, and distance changes nothing. In computing, refusing to build a dark pattern that harms users in India is a duty even at real cost to my career. I think this demandingness is a real objection, since it makes every comfort we keep a wrong.",
    "points": [
      "answers no for classical act utilitarianism: the maximizing action is always required (slide 37)",
      "defines supererogation: beyond the call of duty, moral but optional",
      "gives Singer's strong version (comparable moral significance; marginal utility) and that he calls it correct (slide 36)",
      "gives the moderate version as redrawing the threshold upward: a duty to do some charity",
      "uses the drowning child or helping Bengal as duty, not charity",
      "takes a side, with a computing example"
    ],
    "rows": 10,
    "explain": "A frequent mistake is answering yes because Singer argues from the moderate version; the moderate version only moves the threshold, and the question is about utilitarianism, which abolishes it. Do not confuse this with Mill's too-high-for-humanity objection, which is about motives (slide 14)."
  },
  {
    "type": "free",
    "pq": "U15",
    "q": "Punishment can produce utility through rehabilitation, deterrence or vengeance. Point out morally problematic aspects with each of these, within the framework of utilitarianism (consider the actions it could recommend)",
    "model": "For a utilitarian, punishment is an evil (Bentham) justified only by the utility it produces, and slide 31 names three sources: rehabilitation, deterrence and vengeance. Slide 32's problem with **rehabilitation** is that it is *not seen as a right (good in itself)*: the offender has no claim to it, and *if we happen to maximize utility by leaving the person e.g. in solitary confinement for life, so be it*. With **deterrence**, what matters is that the public believes someone was punished, so the theory can recommend that we *frame an innocent and punish him in public*, or *convict three people, to make sure the one guilty person is punished*. With **vengeance**, the pleasure of the vengeful counts, so *any punishment that gives pleasure to enough people is morally justified*, and guilt *is not intrinsically morally relevant*.\n\nAll three, slide 32 says, *derive from not seeing justice and a defense of human rights as values in themselves*; they have *only derivative value*. A computing case: after a data breach at a bank, the security team cannot find the attacker, but publicly firing and prosecuting a junior developer who had nothing to do with it would reassure customers and deter insiders. If the deterrence and the public's satisfaction outweigh one person's suffering, utilitarianism recommends it. I think this is a decisive problem, because an account of punishment that does not require guilt is not an account of just punishment.",
    "points": [
      "rehabilitation: not a right or good in itself; life in solitary confinement if that maximizes utility (slide 32)",
      "deterrence: could recommend framing an innocent or convicting three to catch one guilty",
      "vengeance: the pleasure of enough people justifies any punishment; guilt not intrinsically relevant",
      "names the root: justice and human rights have only derivative value (slide 32)",
      "gives a computing example and takes a side"
    ],
    "rows": 10,
    "explain": "A common answer lists how each method helps society and stops there; the question asks for the actions utilitarianism could recommend, and a marker wants the innocent framed, the three convicted and the vengeful pleased."
  }
]
```
