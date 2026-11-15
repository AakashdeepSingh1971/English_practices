import { TFNG, YNNG, type PassageDef, type ReadingTestDef } from "../types";

// ---------------------------------------------------------------------------
// Passage 1
// ---------------------------------------------------------------------------
const passage1: PassageDef = {
  title: "Reading Passage 1 — The Return of the Urban Beekeeper",
  shortTitle: "Urban Beekeeping",
  passage: `For most of the twentieth century, beekeeping was regarded as a rural pursuit, practised by farmers and a small number of enthusiasts in the countryside. Over the past two decades, however, hives have appeared on the rooftops of offices, hotels and apartment blocks in cities from London to Tokyo. In Paris alone, the number of registered hives rose from around 300 in 2010 to more than 2,500 a decade later, and a similar pattern has been observed in New York, where keeping bees within the city was illegal until 2010.

Several factors explain this growth. Widespread media coverage of declining bee populations encouraged many city dwellers to believe that keeping bees was a practical way of helping the environment. At the same time, companies discovered that a hive on the roof was an inexpensive way of demonstrating their commitment to sustainability, and some began to offer jars of 'office honey' to clients as gifts. Perhaps surprisingly, cities can be good places for bees. Urban parks, gardens and street trees provide a wide variety of flowers that bloom at different times of the year, whereas in the countryside large areas are often planted with a single crop that flowers for only a few weeks. Cities are also typically two or three degrees warmer than the surrounding land, which allows colonies to remain active for longer each year. In addition, urban bees are exposed to fewer agricultural pesticides.

Yet the boom has not been welcomed by everyone. Ecologists point out that the honeybee is only one of many bee species, and it is not the one most at risk. In Britain, for example, there are more than 250 species of bee, the great majority of which live alone rather than in colonies. These solitary bees, along with bumblebees, are responsible for a large share of the pollination of wild plants, and several species are in serious decline. A single honeybee colony may contain 50,000 workers in summer, and when many hives are concentrated in a small area, the honeybees can consume so much nectar and pollen that little is left for wild species. A study carried out in Paris in 2020 found that the more hives there were in a district, the fewer wild bees visited the local flowers. The researchers concluded that adding hives to a city should not be considered a conservation measure.

For those who still wish to keep bees, the basic design of the hive has changed little in a century. A modern hive consists of a series of stacked wooden boxes. The lowest, known as the brood box, is where the queen lays her eggs. Above this sits a thin metal grid called the queen excluder, whose gaps are large enough for worker bees to pass through but too small for the larger queen. This ensures that the boxes above, called supers, contain only honey and no young bees. The whole structure is covered by a roof, which protects the colony from rain, and bees enter and leave through a narrow opening at the base.

When the honey is ready, usually in late summer, the beekeeper first removes the supers from the hive, using a gentle puff of smoke to calm the bees. Each frame of honeycomb is then taken out of its box. Because the bees seal each cell with a thin layer of wax once the honey inside has dried sufficiently, this wax must be sliced off with a heated knife before any honey can be collected. The frames are next placed in a machine called an extractor, which spins them rapidly so that the honey is thrown out of the comb. Finally, the honey is passed through a fine filter to remove pieces of wax and other debris before it is poured into jars.

Urban honey often has a distinctive flavour. Because bees in a city feed on a mixture of ornamental plants, fruit trees and weeds, the honey produced on one rooftop may taste quite different from that produced a few streets away. Some restaurants now name the neighbourhood their honey comes from on the menu, in the same way that wine lists name the region in which the grapes were grown.

Despite the concerns of ecologists, few experts believe that urban beekeeping should be banned. Instead, many recommend that cities limit the number of hives per square kilometre and that new beekeepers be required to complete a training course. Perhaps more importantly, they argue that anyone who wants to help bees could do more good by planting flowers rich in nectar, such as lavender and wild thyme, on balconies and in gardens, as this benefits every kind of bee rather than just one.`,
  groups: [
    {
      kind: "True/False/Not Given",
      instruction:
        "{range}\nDo the following statements agree with the information given in Reading Passage 1?\n\nTRUE — if the statement agrees with the information\nFALSE — if the statement contradicts the information\nNOT GIVEN — if there is no information on this",
      options: TFNG,
      questions: [
        { prompt: "Keeping bees in New York City was not permitted before 2010.", answer: "TRUE" },
        { prompt: "Most companies that keep hives sell the honey they produce.", answer: "NOT GIVEN" },
        {
          prompt: "Plants in the countryside generally flower over a longer period than plants in cities.",
          answer: "FALSE",
        },
        { prompt: "Most species of bee found in Britain live in colonies.", answer: "FALSE" },
        {
          prompt: "The 2020 Paris study found fewer wild bees in districts with a large number of hives.",
          answer: "TRUE",
        },
      ],
    },
    {
      kind: "Flow-chart completion",
      instruction:
        "{range}\nComplete the flow-chart below.\nChoose ONE WORD ONLY from the passage for each answer.\n\nHARVESTING HONEY\nSupers removed from the hive (bees calmed with ___6___)\n        ↓\nWax seal cut from each cell with a heated ___7___\n        ↓\nFrames spun rapidly in an ___8___\n        ↓\nHoney filtered and poured into jars",
      questions: [
        { prompt: "Bees are calmed with ______.", answer: "smoke" },
        { prompt: "The wax seal is cut off with a heated ______.", answer: "knife" },
        { prompt: "The frames are spun rapidly in an ______.", answer: "extractor" },
      ],
    },
    {
      kind: "Diagram labelling",
      instruction: "{range}\nLabel the diagram below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.",
      figure: `+------------------------------+
|           ( 9 )              |  <- protects the colony from rain
+------------------------------+
|           SUPER              |  <- contains only ( 10 ), no young bees
+------------------------------+
|           ( 11 )             |  <- metal grid: workers pass, queen cannot
+------------------------------+
|         BROOD BOX            |  <- queen lays her eggs here
+-----------[entrance]---------+`,
      questions: [
        { prompt: "Label 9", answer: ["roof", "the roof", "a roof"] },
        { prompt: "Label 10", answer: ["honey"] },
        { prompt: "Label 11", answer: ["queen excluder", "excluder"] },
      ],
    },
    {
      kind: "Short answer",
      instruction: "{range}\nAnswer the questions below.\nChoose NO MORE THAN THREE WORDS from the passage for each answer.",
      questions: [
        {
          prompt: "What do some restaurants name on their menus to show where their honey comes from?",
          answer: ["neighbourhood", "the neighbourhood", "neighborhood", "the neighborhood"],
        },
        {
          prompt: "What do experts say new beekeepers should be required to complete?",
          answer: ["training course", "a training course"],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Passage 2
// ---------------------------------------------------------------------------
const HEADINGS = [
  "i. The practical objections to changing school hours",
  "ii. A slower build-up of tiredness",
  "iii. The hidden dangers of night-time phone use",
  "iv. A delayed chemical signal for sleep",
  "v. A conflict between biology and the school day",
  "vi. Measured benefits of starting later",
  "vii. Why adults need less sleep than teenagers",
  "viii. A behaviour that was long misunderstood",
  "ix. New laws requiring later school hours",
];
const PARAGRAPHS_AF = ["A", "B", "C", "D", "E", "F"];

const passage2: PassageDef = {
  title: "Reading Passage 2 — Why Teenagers Sleep Late",
  shortTitle: "Teenage Sleep",
  passage: `A   Parents have long complained that teenagers stay up late and are impossible to wake in the morning. For much of the twentieth century this behaviour was put down to laziness, late-night socialising or, more recently, the glow of mobile phone screens. Over the past thirty years, however, sleep scientists have assembled a body of evidence suggesting that the main cause is biological: during adolescence, the body's internal clock shifts later, and young people genuinely find it difficult to fall asleep before about 11 p.m.

B   The internal clock, known as the circadian rhythm, governs when we feel alert and when we feel drowsy over a roughly 24-hour cycle. One of its key signals is the hormone melatonin, which the brain releases in the evening to prepare the body for sleep. In the 1990s the American researcher Mary Carskadon measured melatonin levels in saliva samples taken from young people staying at a summer sleep laboratory. She found that in older teenagers, melatonin was released up to two hours later in the evening than in children or adults. Crucially, the shift occurred even when the participants had no access to televisions or phones, indicating that technology alone could not be responsible.

C   A second process also changes during the teenage years. Throughout the day, a chemical called adenosine gradually builds up in the brain, creating what scientists call 'sleep pressure': the longer we stay awake, the sleepier we become. Studies have shown that in adolescents this pressure accumulates more slowly than in younger children, so teenagers can remain awake and alert late into the evening without feeling tired. The combination of a delayed clock and a slower build-up of sleep pressure means that a fifteen-year-old who goes to bed at 9.30 p.m. may simply lie awake for an hour or more.

D   The problem is that school timetables have not adjusted to this biology. In many countries classes begin at around 8 a.m., which can require students to wake at 6.30 or earlier. Since teenagers need between eight and ten hours of sleep a night, a large proportion of them are chronically sleep-deprived during the school week. They then attempt to catch up by sleeping late at weekends, which shifts their internal clock even further and makes Monday mornings harder still — a pattern sometimes described as 'social jet lag'. The effects of insufficient sleep are wide-ranging. Tired students find it harder to concentrate and to remember what they have learned, and they are more likely to experience low mood. Among those old enough to drive, drowsiness has been linked to a higher rate of road accidents.

E   In response, a number of schools have experimented with later start times. One of the best-known trials took place in Seattle in 2016, when the city's secondary schools moved their start time from 7.50 to 8.45 a.m. A team led by the biologist Horacio de la Iglesia gave students wrist monitors to record their sleep before and after the change. The students slept an average of 34 minutes longer per night, their attendance improved, and their grades in biology rose by 4.5 per cent. In the United Kingdom, the neuroscientist Paul Kelley led a similar experiment at a school in the north-east of England, where moving the start to 10 a.m. was associated with a marked fall in absences caused by illness.

F   Not everyone is persuaded that later starts are the answer. Some head teachers argue that changing the timetable creates practical difficulties: parents may need to leave for work before their children set off for school, after-school sports must finish later, and bus companies may charge more if routes have to be rescheduled. Others worry that students will simply go to bed later still, cancelling out any benefit. However, the Seattle data suggest this concern may be exaggerated, since the students' bedtimes changed very little after the reform. Most researchers now agree that while later starts are not a complete solution, they are among the most effective measures available, particularly when combined with education about the importance of sleep.`,
  groups: [
    {
      kind: "Matching headings",
      instruction:
        "{range}\nReading Passage 2 has six paragraphs, A–F.\nChoose the correct heading for each paragraph from the list of headings below.\nThere are more headings than paragraphs.",
      options: HEADINGS,
      questions: [
        { prompt: "Paragraph A", answer: "viii" },
        { prompt: "Paragraph B", answer: "iv" },
        { prompt: "Paragraph C", answer: "ii" },
        { prompt: "Paragraph D", answer: "v" },
        { prompt: "Paragraph E", answer: "vi" },
        { prompt: "Paragraph F", answer: "i" },
      ],
    },
    {
      kind: "Matching information",
      instruction:
        "{range}\nWhich paragraph contains the following information?\nChoose the correct letter, A–F. You may use any letter more than once.",
      options: PARAGRAPHS_AF,
      questions: [
        { prompt: "a reference to the cost of changing transport arrangements", answer: "F" },
        { prompt: "a description of how the level of a hormone was measured", answer: "B" },
        { prompt: "the effect of sleeping late at weekends", answer: "D" },
      ],
    },
    {
      kind: "Matching sentence endings",
      instruction: "{range}\nComplete each sentence with the correct ending, A–E.",
      options: [
        "A. teenagers need more sleep than younger children.",
        "B. technology alone cannot explain late teenage bedtimes.",
        "C. students did not cancel out the benefit by going to bed later.",
        "D. later school start times are popular with parents.",
        "E. sleep pressure builds up faster in adults than in children.",
      ],
      questions: [
        {
          prompt: "Carskadon's finding that the melatonin shift occurred without access to screens suggests that…",
          answer: "B",
        },
        { prompt: "The Seattle students' bedtimes after the reform suggest that…", answer: "C" },
      ],
    },
    {
      kind: "Sentence completion",
      instruction: "{range}\nComplete the sentences below.\nChoose NO MORE THAN THREE WORDS from the passage for each answer.",
      questions: [
        {
          prompt:
            "Sleeping late at weekends to make up for lost sleep can lead to a pattern known as ______.",
          answer: ["social jet lag", "social jetlag"],
        },
        {
          prompt: "At the school in north-east England, a later start was linked to fewer absences caused by ______.",
          answer: ["illness"],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Passage 3
// ---------------------------------------------------------------------------
const passage3: PassageDef = {
  title: "Reading Passage 3 — The Question of Machine Creativity",
  shortTitle: "Machine Creativity",
  passage: `In 2018 a portrait of a blurred, dark-coated gentleman sold at auction in New York for $432,500, more than forty times its estimated price. The painting had not been produced by a human artist but by an algorithm developed by a small group of French students, who had trained it on 15,000 portraits painted between the fourteenth and twentieth centuries. Since then, computer systems have composed symphonies, written poetry and generated millions of images from short written descriptions. These developments have revived an old and surprisingly difficult question: can a machine be genuinely creative, or is it merely imitating the creativity of the people whose work it has absorbed?

Part of the difficulty lies in defining creativity itself. The British cognitive scientist Margaret Boden, whose work has shaped much of the debate, proposed that a creative idea must be new, surprising and valuable. She further distinguished between three kinds of creativity. 'Combinational' creativity produces unfamiliar combinations of familiar ideas, as when a poet links two unrelated images in a metaphor. 'Exploratory' creativity involves investigating the possibilities within an established style, such as a composer writing a new piece in the manner of a classical sonata. The rarest kind, 'transformational' creativity, alters the rules of a style so fundamentally that ideas which were previously impossible become possible — the invention of Cubism being an often-cited example. Boden argued that computers had already shown themselves capable of the first two kinds, but that transformational creativity remained largely beyond them.

Not everyone accepts that machines can be creative even in the limited sense Boden described. The philosopher Sean Kelly has argued that creativity is inseparable from the social world in which it occurs: a work counts as creative partly because a community recognises it as making a contribution, and because its creator can be held responsible for it. On this view, a program that generates a striking image is no more creative than a camera that captures a beautiful sunset. I find this argument persuasive up to a point. It is certainly true that we tend to value art partly for what it tells us about the person who made it. Yet the argument seems to prove too much, since it would also deny creativity to an unknown human artist whose work had never been seen by anyone.

A more practical perspective comes from the computer scientist Simon Colton, who has spent many years building a program called The Painting Fool. Colton has suggested that audiences are reluctant to describe software as creative because they cannot see the process behind the result. To address this, he designed his program to produce short written commentaries explaining what it had been trying to achieve with each picture. In exhibitions, visitors who read these commentaries rated the paintings as more creative than visitors who saw the paintings alone, even though the images themselves were identical.

Perhaps the most striking evidence for machine creativity, however, comes not from the arts but from the game of Go. In 2016 a program called AlphaGo defeated Lee Sedol, one of the world's strongest players, in a five-game match. In the second game AlphaGo played a move — the now famous 'move 37' — which commentators initially assumed was a mistake, since it went against centuries of accepted strategy. It later proved decisive. Professional players have since adopted strategies first discovered by such programs, and a study of several million professional moves published in 2023 found that the quality of human decisions has improved noticeably since 2016. If transformational creativity means changing the rules of what is thought possible, it is difficult to argue that nothing of the kind occurred.

None of this means that human artists are about to become obsolete. The systems that generate images and texts today depend entirely on vast collections of human-made work, and many artists have objected, with some justification, that their work was used without permission or payment. It also remains the case that a machine has no reason of its own to create anything; it produces a poem because someone has asked it to. In my view, the most useful question is therefore not whether machines can be creative in isolation, but how they might extend the creativity of the people who use them. The camera did not put an end to painting; it freed painters to explore what photography could not do. There is good reason to hope that intelligent machines will have a similar effect.`,
  groups: [
    {
      kind: "Multiple choice",
      instruction: "{range}\nChoose the correct letter, A, B, C or D.",
      questions: [
        {
          prompt: "What does the writer say about the portrait sold in 2018?",
          options: [
            "A. It was painted in the style of a twentieth-century artist.",
            "B. It sold for far more than had been expected.",
            "C. It was created by a well-known French painter.",
            "D. It was based on a single historical portrait.",
          ],
          answer: "B",
        },
        {
          prompt: "According to Boden, the invention of Cubism is an example of",
          options: [
            "A. combining two familiar ideas.",
            "B. working within an established style.",
            "C. changing the rules of a style.",
            "D. a kind of creativity computers have mastered.",
          ],
          answer: "C",
        },
        {
          prompt: "What did Colton's exhibitions show?",
          options: [
            "A. Visitors preferred paintings made by humans.",
            "B. Written explanations affected how creative the paintings seemed.",
            "C. The Painting Fool produced better images over time.",
            "D. Visitors could not tell which images were made by software.",
          ],
          answer: "B",
        },
      ],
    },
    {
      kind: "Yes/No/Not Given",
      instruction:
        "{range}\nDo the following statements agree with the views of the writer in Reading Passage 3?\n\nYES — if the statement agrees with the views of the writer\nNO — if the statement contradicts the views of the writer\nNOT GIVEN — if it is impossible to say what the writer thinks about this",
      options: YNNG,
      questions: [
        { prompt: "Kelly's argument about creativity has some merit.", answer: "YES" },
        { prompt: "Art is valued only for what it reveals about the person who made it.", answer: "NO" },
        { prompt: "Move 37 was the most important move ever played in a game of Go.", answer: "NOT GIVEN" },
        { prompt: "Artists who object to the way their work has been used have a reasonable case.", answer: "YES" },
      ],
    },
    {
      kind: "Matching features",
      instruction:
        "{range}\nMatch each statement with the correct person, A–D.\nYou may use any letter more than once.",
      options: ["A. Margaret Boden", "B. Sean Kelly", "C. Simon Colton", "D. Lee Sedol"],
      questions: [
        {
          prompt: "People are reluctant to call software creative because the process behind its work is hidden.",
          answer: "C",
        },
        { prompt: "Recognition by a community is part of what makes a work creative.", answer: "B" },
        {
          prompt: "Computers have demonstrated some kinds of creativity but not the most radical kind.",
          answer: "A",
        },
      ],
    },
    {
      kind: "Summary completion",
      instruction:
        "{range}\nComplete the summary below using the list of words, A–H.\n\nRecent advances have raised the question of whether machines can be truly creative. A Go program surprised experts with a move that at first seemed to be a ___37___, and human players have since adopted strategies the programs discovered. However, current systems rely on large amounts of ___38___ work, and a machine has no ___39___ of its own to create. The writer believes the key question is how machines can ___40___ human creativity, as the camera did for painting.",
      options: [
        "A. mistake",
        "B. human-made",
        "C. reason",
        "D. replace",
        "E. extend",
        "F. tradition",
        "G. computer-generated",
        "H. permission",
      ],
      questions: [
        { prompt: "Gap 37", answer: "A" },
        { prompt: "Gap 38", answer: "B" },
        { prompt: "Gap 39", answer: "C" },
        { prompt: "Gap 40", answer: "E" },
      ],
    },
  ],
};

export const test01: ReadingTestDef = { number: 1, passages: [passage1, passage2, passage3] };
