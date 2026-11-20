---
title: "The sampling distribution of p-hat: centre p, width √(pq/n)"
minutes: 12
---
<!-- facts: none; the iPhone numbers are the notes' 6.1 example, the four-student case and the practice scenarios are new and checked in Python -->
One sample of students gives one share. This lesson finds where all the possible shares pile up, and how wide that pile is.

## One sample, one share; another sample, another share

Take 200 students. Count the iPhone users. Divide by 200.

That share has a name: **$\hat{p}$ (say "p-hat"), the sample proportion**. In symbols $\hat{p} = X/n$, where X is the count of successes in the sample and n is the sample size.

Now take a different 200 students. Count again. The share comes out a little different.

Drop each share on a number line: **a blue dot**. Keep sampling. The dots stack up into a pile.

**The sampling distribution of p-hat is that pile: every share a sample of size n could give, with how often each comes up.** The notes: *The sampling distribution of $\hat{p}$ is the probability distribution of $\hat{p}$ for all possible random samples of size n.* For example, a coffee shop counts the oat-milk share in each batch of 100 orders. Each batch lands a little differently; together they make the pile.

Behind the pile sits one fixed number, the share in the whole population: **p**, **the pink line**. You never see it in real life.

"If I took another sample, how far could my number move?" This lesson answers half: where the pile is centred, and how wide it is.

## A thousand samples of 200 pile up around 0.572

One sample, one share, one dot on the line; then a thousand more. Watch the dots. No one tells them to make a bell. They pile up around the pink line anyway, and the green arrow measures how wide the pile is.

```widget
sample-pile-play
{ "stat": "phat", "p": 0.572, "n": 200, "what": "iPhone users", "title": "Samples of 200 students pile up in a bell centred on the true share 0.572" }
```

## Four students, five possible shares

Build the smallest pile there is. Half of the students on a campus bring lunch from home. Ask 4 of them at random.

- $p = 0.5$, the share of all students who bring lunch.
- $q = 1 - p = 0.5$, the share who do not.
- $n = 4$, the students asked.
- $X$, how many of the 4 bring lunch: 0, 1, 2, 3 or 4.

So $\hat{p}$ can only be 0, 0.25, 0.5, 0.75 or 1.

Each student answers yes or no, each with chance 1/2. Four answers make 2 × 2 × 2 × 2 = 16 equally likely yes/no lists. Count the lists for each X: there is 1 list with no yes, 4 with one yes (which student said it), 6 with two, 4 with three, 1 with four. These are the binomial counts "4 choose x" from [the binomial on paper](#/math3042-q7/binomial-on-paper).

```diagram
{"type": "grid", "title": "Every share 4 students can give, and its chance", "nodes": [{"id": "h0", "label": "X of 4", "row": 0, "col": 0}, {"id": "h1", "label": "0", "row": 0, "col": 1}, {"id": "h2", "label": "1", "row": 0, "col": 2}, {"id": "h3", "label": "2", "row": 0, "col": 3}, {"id": "h4", "label": "3", "row": 0, "col": 4}, {"id": "h5", "label": "4", "row": 0, "col": 5}, {"id": "a0", "label": "p-hat = X/4", "row": 1, "col": 0}, {"id": "a1", "label": "0", "row": 1, "col": 1}, {"id": "a2", "label": "0.25", "row": 1, "col": 2}, {"id": "a3", "label": "0.5", "row": 1, "col": 3}, {"id": "a4", "label": "0.75", "row": 1, "col": 4}, {"id": "a5", "label": "1", "row": 1, "col": 5}, {"id": "b0", "label": "lists of answers", "row": 2, "col": 0}, {"id": "b1", "label": "1", "row": 2, "col": 1}, {"id": "b2", "label": "4", "row": 2, "col": 2}, {"id": "b3", "label": "6", "row": 2, "col": 3}, {"id": "b4", "label": "4", "row": 2, "col": 4}, {"id": "b5", "label": "1", "row": 2, "col": 5}, {"id": "c0", "label": "chance", "row": 3, "col": 0}, {"id": "c1", "label": "1/16", "row": 3, "col": 1}, {"id": "c2", "label": "4/16", "row": 3, "col": 2}, {"id": "c3", "label": "6/16", "row": 3, "col": 3}, {"id": "c4", "label": "4/16", "row": 3, "col": 4}, {"id": "c5", "label": "1/16", "row": 3, "col": 5}], "hi": ["a3", "c3"], "caption": "The middle share, 0.5, has the most lists behind it: 6 of the 16."}
```

Drawn as a pile, it is five bars, tallest in the middle:

```diagram
{"type": "curve", "title": "Four students: the pile of p-hat is five bars centred on 0.5", "x": [-0.7, 4.7], "xlabel": "p-hat", "curves": [{"dist": "bars", "start": 0, "values": [0.0625, 0.25, 0.375, 0.25, 0.0625], "hi": [2]}], "ticks": [{"x": 0, "label": "0"}, {"x": 1, "label": "0.25"}, {"x": 2, "label": "0.5"}, {"x": 3, "label": "0.75"}, {"x": 4, "label": "1"}], "spans": [{"from": 2, "to": 3, "y": 1.05, "label": "width 0.25"}]}
```

The centre is the average share, each share weighted by its chance:

$$\mu_{\hat{p}} = \underbrace{0 \cdot \frac{1}{16}}_{\text{no one}} + \underbrace{0.25 \cdot \frac{4}{16}}_{\text{1 of 4}} + \underbrace{0.5 \cdot \frac{6}{16}}_{\text{2 of 4}} + \underbrace{0.75 \cdot \frac{4}{16}}_{\text{3 of 4}} + \underbrace{1 \cdot \frac{1}{16}}_{\text{all 4}} = \frac{8}{16} = \mathbf{0.5}$$

The pile is centred on 0.5. That is p, the truth.

## The centre and the width, each symbol named

$$\mu_{\hat{p}} = p \qquad \sigma_{\hat{p}} = \sqrt{\frac{pq}{n}}$$

- $\mu_{\hat{p}}$, the centre of the pile: the average of all the shares.
- $\sigma_{\hat{p}}$, the width of the pile: the standard deviation of $\hat{p}$. It is also called the **standard error**. In the animations it is **the green arrow**.
- $p$, the share in the whole population.
- $q = 1 - p$, the share without the trait.
- $n$, the sample size.

**The pile of p-hat is centred on p, and its standard deviation is the square root of pq over n.** For example, with the four students the pile sits on 0.5, and its width comes out of one line.

$$\frac{pq}{n} = \frac{\underbrace{0.5}_{p} \times \underbrace{0.5}_{q}}{\underbrace{4}_{n}} = 0.0625$$

$$\sigma_{\hat{p}} = \underbrace{\sqrt{0.0625}}_{\text{root of the whole fraction}} = \mathbf{0.25}$$

Check it against the bars. Shares 0 and 1 sit 0.5 from the centre, so their squared distance is 0.25. Shares 0.25 and 0.75 sit 0.25 away, so theirs is 0.0625:

$$\sigma_{\hat{p}}^2 = \underbrace{2 \times 0.25 \times \frac{1}{16}}_{\text{shares 0 and 1}} + \underbrace{2 \times 0.0625 \times \frac{4}{16}}_{\text{shares 0.25 and 0.75}} + \underbrace{0 \times \frac{6}{16}}_{\text{share 0.5}} = \frac{1}{16} = 0.0625$$

Its root is 0.25 again. The formula is not a new rule. It is the width of the same pile.

**Where $\sqrt{pq/n}$ comes from.** The count X is binomial, with standard deviation $\sqrt{npq}$. Dividing every count by n to get $\hat{p}$ divides the width by n too, and $\sqrt{npq}/n = \sqrt{pq/n}$. Just like a ruler read in centimetres: switch to metres and every distance, spread included, is divided by 100.

:::warn Take the root of the whole fraction
$\sqrt{pq}/n$ is a different number. For the four students it gives 0.5/4 = 0.125, half the real width of 0.25.
:::

## When the pile is a bell: np ≥ 5 and nq ≥ 5

"Bell" and "normal" mean the same shape here.

The notes put it this way: *The Central Limit Theorem tells us that the sampling distribution of $\hat{p}$ is close to being a normal distribution.* That holds under conditions.

**The pile of p-hat is close to a normal bell when np ≥ 5 and nq ≥ 5.** For example, the four students give $np = 4 \times 0.5 = 2$, which fails. So the bell rule does not apply: their pile is only five coarse bars.

np is the successes a sample expects, nq the failures. Below 5, the pile is squashed against 0 or 1.

## The notes' iPhone pile: centre 0.572, width 0.0350

The share of all BCIT students who use an iPhone is 0.572. Take a random sample of 200 students. X is the number of iPhone users in the sample, binomial; this is the notes' example.

- $n = 200$, the students in the sample.
- $p = 0.572$, the share of all students who use an iPhone.
- $q = 1 - p = 0.428$, the share who do not.

The notes start with the pile of counts:

$$\mu = np = \underbrace{200}_{n} \times \underbrace{0.572}_{p} = \mathbf{114.4}$$

$$npq = \underbrace{200}_{n} \times \underbrace{0.572}_{p} \times \underbrace{0.428}_{q} = 48.9632$$

$$\sigma = \underbrace{\sqrt{48.9632}}_{\text{root of } npq} = 6.9974 = \mathbf{7.00}$$

Then they divide by n to get the pile of shares:

$$\mu_{\hat{p}} = \frac{np}{n} = p = \mathbf{0.572}$$

$$\frac{pq}{n} = \frac{\underbrace{0.572}_{p} \times \underbrace{0.428}_{q}}{\underbrace{200}_{n}} = 0.00122408$$

$$\sigma_{\hat{p}} = \underbrace{\sqrt{0.00122408}}_{\text{root of the whole fraction}} = 0.034987 = \mathbf{0.0350}$$

The bell check passes on both sides:

$$np = \underbrace{200}_{n} \times \underbrace{0.572}_{p} = 114.4 \ge 5 \qquad nq = \underbrace{200}_{n} \times \underbrace{0.428}_{q} = 85.6 \ge 5$$

The pile is a bell centred on 0.572. One width to the left is 0.537; one width to the right is 0.607.

```diagram
{"type": "curve", "title": "The pile of p-hat for n = 200: centre 0.572, width 0.0350", "x": [0.45, 0.695], "xlabel": "p-hat", "curves": [{"dist": "normal", "mu": 0.572, "sigma": 0.035}], "ticks": [{"x": 0.537, "label": "0.537"}, {"x": 0.572, "label": "0.572"}, {"x": 0.607, "label": "0.607"}], "lines": [{"x": 0.572, "tone": "hl", "label": "p = 0.572", "side": "right", "full": true}], "spans": [{"from": 0.537, "to": 0.572, "y": 0.35, "label": "0.0350"}, {"from": 0.572, "to": 0.607, "y": 0.35, "label": "0.0350"}]}
```

The possible shares step by 1/200 = 0.005, so close that a smooth bell fits them.

**To describe a sampling distribution, give three things: its centre, its standard deviation, and its shape with the reason.** For example: centre 0.572, standard deviation 0.0350, approximately normal because np = 114.4 and nq = 85.6 are both at least 5.

## Describe the pile: oat milk, SkyTrain, a help desk, downloads, a COMP course

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- $\mu_{\hat{p}} = p$, $\sigma_{\hat{p}} = \sqrt{\dfrac{pq}{n}}$
- $\hat{p}$ is normally distributed as long as $np \ge 5$ and $nq \ge 5$.

**Not on the sheet, so know it:**

- $q = 1 - p$ and $\hat{p} = X/n$.
- The root covers the whole fraction $pq/n$.
- Describing a pile means centre, standard deviation, and shape with its reason.
:::

```quiz
[
  {"q": "At a campus coffee shop, 30% of all orders use oat milk. Take a random batch of 100 orders. Find the standard deviation of $\\hat{p}$, the share of oat-milk orders in the batch. (4 decimals)", "type": "numeric", "answer": 0.0458, "tolerance": 0.0002, "explain": "X = the number of oat-milk orders in the batch, $p = 0.30$ the share of all orders, $q = 0.70$ the share without oat milk, $n = 100$ orders. $$\\dfrac{pq}{n} = \\dfrac{\\underbrace{0.30}_{p} \\times \\underbrace{0.70}_{q}}{\\underbrace{100}_{n}} = 0.0021$$ $$\\sigma_{\\hat{p}} = \\underbrace{\\sqrt{0.0021}}_{\\text{root of the whole fraction}} = 0.045826 = \\mathbf{0.0458}$$"},
  {"q": "85% of all SkyTrain trains reach a station on time. A student records 60 random trains. Is the sampling distribution of $\\hat{p}$, the on-time share, approximately normal? Type YES or NO.", "type": "text", "answer": ["YES", "Yes", "yes"], "explain": "$p = 0.85$ the on-time share of all trains, $q = 0.15$ the late share, $n = 60$ trains. Both checks pass: $$np = \\underbrace{60}_{n} \\times \\underbrace{0.85}_{p} = \\mathbf{51} \\ge 5 \\qquad nq = \\underbrace{60}_{n} \\times \\underbrace{0.15}_{q} = \\mathbf{9} \\ge 5$$ YES. nq = 9 is the smaller one, and it still clears 5."},
  {"q": "At a help desk, 10% of all tickets are password resets. Take 20 random tickets. Is the sampling distribution of $\\hat{p}$, the share of resets, approximately normal? Type YES or NO.", "type": "text", "answer": ["NO", "No", "no"], "explain": "$p = 0.10$ the share of resets among all tickets, $q = 0.90$, $n = 20$ tickets. $$np = \\underbrace{20}_{n} \\times \\underbrace{0.10}_{p} = \\mathbf{2} < 5$$ NO. A sample of 20 expects only 2 resets, so the pile is squashed against 0 and lopsided. nq = 18 passing does not help: both checks must pass."},
  {"q": "2% of all downloads from a course website fail. Take 500 random downloads. Find $\\sigma_{\\hat{p}}$, the standard deviation of the share that fail. (4 decimals)", "type": "numeric", "answer": 0.0063, "tolerance": 0.0002, "explain": "$p = 0.02$ the failure share of all downloads, $q = 0.98$, $n = 500$ downloads. $$\\dfrac{pq}{n} = \\dfrac{\\underbrace{0.02}_{p} \\times \\underbrace{0.98}_{q}}{\\underbrace{500}_{n}} = 0.0000392$$ $$\\sigma_{\\hat{p}} = \\underbrace{\\sqrt{0.0000392}}_{\\text{root of the whole fraction}} = 0.006261 = \\mathbf{0.0063}$$ The bell check passes too: np = 10 and nq = 490."},
  {"q": "64% of all students in a COMP course pass the first lab on the first try. Take random samples of 144 students. Which describes the sampling distribution of $\\hat{p}$, the pass share?", "options": ["Centre 0.64, standard deviation 0.04, approximately normal because np = 92.16 and nq = 51.84 are both at least 5", "Centre 92.16, standard deviation 5.76, approximately normal because the sample is large", "Centre 0.64, standard deviation 0.0016, approximately normal because np and nq are at least 5", "Centre 0.64, standard deviation 0.04, not normal because a pass or fail is not a normal variable"], "answer": 0, "explain": "$p = 0.64$ the pass share, $q = 0.36$, $n = 144$ students. Centre: $\\mu_{\\hat{p}} = p = 0.64$. $$\\dfrac{pq}{n} = \\dfrac{\\underbrace{0.64}_{p} \\times \\underbrace{0.36}_{q}}{\\underbrace{144}_{n}} = 0.0016$$ $$\\sigma_{\\hat{p}} = \\underbrace{\\sqrt{0.0016}}_{\\text{root of the whole fraction}} = \\mathbf{0.04}$$ Shape: $np = 144 \\times 0.64 = 92.16$ and $nq = 144 \\times 0.36 = 51.84$, both at least 5. Centre 92.16 and 5.76 describe the pile of counts X, not of shares. 0.0016 forgot the root. Each answer is a yes or no, but the pile of shares is still a bell once np and nq pass."},
  {"q": "True or false: doubling the sample size halves the standard deviation of $\\hat{p}$.", "type": "tf", "answer": false, "explain": "False. n sits under a square root, so doubling n divides the width by $\\sqrt{2} \\approx 1.414$. To halve it, multiply n by 4. For example, the four lunch students give 0.25; with 16 students: $$\\dfrac{pq}{n} = \\dfrac{\\underbrace{0.5}_{p} \\times \\underbrace{0.5}_{q}}{\\underbrace{16}_{n}} = 0.015625$$ $$\\sigma_{\\hat{p}} = \\underbrace{\\sqrt{0.015625}}_{\\text{root of the whole fraction}} = \\mathbf{0.125}$$ which is half of 0.25."}
]
```

## Remember

- **Centre $\mu_{\hat{p}} = p$; width $\sigma_{\hat{p}} = \sqrt{pq/n}$, the root of the whole fraction.**
- **Bell when np ≥ 5 and nq ≥ 5.** Four students at p = 0.5: np = 2, five bars.
- Describe a pile: centre, standard deviation, shape with its reason.
- Four times the sample, half the width. Next: [how far 95% of the pile reaches](#/math3042-q9/margin-of-error).
