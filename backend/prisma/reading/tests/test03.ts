import { TFNG, TFNG_INSTRUCTION, YNNG, YNNG_INSTRUCTION, type PassageDef, type ReadingTestDef } from "../types";

// ---------------------------------------------------------------------------
// Passage 1 — table completion, TFNG, sentence completion
// ---------------------------------------------------------------------------
const passage1: PassageDef = {
  title: "Reading Passage 1 — Farming Upwards",
  shortTitle: "Vertical Farming",
  passage: `In a converted warehouse on the edge of a city, rows of lettuce, basil and kale grow in trays stacked ten levels high, bathed not in sunlight but in the pinkish glow of LED lamps. No soil is used, no pesticides are sprayed, and the plants receive exactly the amount of water and nutrients they need. Supporters of this approach, known as vertical farming, claim that it could transform the way cities are fed. Critics argue that, for most crops, it makes little economic or environmental sense.

The concept was popularised in the late 1990s by Dickson Despommier, a professor at Columbia University in New York, who challenged his students to design a farm that could feed the population of Manhattan. Their initial plans for rooftop gardens could feed only a tiny fraction of the city, so Despommier proposed growing crops inside tall buildings, floor upon floor. At the time, the technology to do this economically did not exist. Since then, however, the cost of LED lighting has fallen dramatically while its efficiency has improved, making indoor farming commercially possible for the first time.

Most vertical farms use one of two methods. In hydroponic systems, the plants' roots sit in a flowing solution of water and dissolved minerals. In aeroponic systems, the roots hang in the air and are sprayed with a fine mist of nutrients at regular intervals. Aeroponics uses even less water than hydroponics, but the equipment is more complicated, and a failure of the pumps can kill a crop within hours. In both systems, water that is not absorbed by the plants is collected and reused, so that vertical farms typically use around 95 per cent less water than conventional fields.

The advantages go beyond water savings. Because conditions inside the building are controlled, crops can be grown all year round, regardless of the weather outside, and harvests are highly predictable. A hectare of vertical farm can produce many times the yield of a hectare of open field, partly because of the stacked layers and partly because crops grow faster under ideal conditions; lettuces may be ready for harvest in around 30 days rather than 60. Farms can be located close to the shops and restaurants they supply, reducing transport and allowing produce to be sold within hours of being picked. And since insects cannot easily get in, pesticides are rarely needed.

The greatest disadvantage is energy. Sunlight is free; electric light is not. A vertical farm must pay to power its lamps, as well as the fans, pumps and air-conditioning systems needed to remove the heat they produce. As a result, energy can account for a quarter or more of a vertical farm's operating costs. Unless that electricity comes from renewable sources, the carbon emissions associated with growing a lettuce indoors can exceed those of growing it in a field and transporting it hundreds of kilometres. Labour is another significant expense, although many farms are now introducing robots to plant and harvest crops.

These costs explain why vertical farms grow such a limited range of produce. Leafy greens and herbs are ideal: they grow quickly, are small enough to fit on shallow shelves, and are almost entirely edible, so little of the energy used to grow them is wasted. Staple crops such as wheat, rice and potatoes are another matter. They take months to mature, require a great deal of light, and much of the plant — the stalks and leaves — cannot be eaten. One estimate suggested that a loaf of bread made from wheat grown indoors would cost more than ten times as much as an ordinary loaf.

The industry has had a turbulent recent history. During the late 2010s and early 2020s, investors poured billions of dollars into vertical farming companies, but when energy prices rose sharply in 2022, several high-profile businesses in Europe and the United States collapsed. Those that have survived tend to be smaller and more cautious, often focusing on high-value crops such as herbs, microgreens and strawberries. Few believe that vertical farms will replace traditional agriculture. They may, however, play a useful supporting role, particularly in places where farmland and water are scarce, such as Singapore or the Gulf states, which currently import most of their fresh food.`,
  groups: [
    {
      kind: "Table completion",
      instruction: "{range}\nComplete the table below.\nChoose ONE WORD ONLY from the passage for each answer.",
      figure: `Method      | How the roots receive nutrients     | Notes
------------+-------------------------------------+-------------------------------------
Hydroponic  | roots sit in a flowing ( 1 )        |
            | of water and dissolved minerals     |
------------+-------------------------------------+-------------------------------------
Aeroponic   | roots hang in the air and are       | uses even less ( 3 );
            | sprayed with a fine ( 2 )           | a crop can die within hours
            |                                     | if the ( 4 ) fail
------------+-------------------------------------+-------------------------------------
Both        | unabsorbed water is collected       |
            | and ( 5 )                           |`,
      questions: [
        { prompt: "Gap 1", answer: ["solution"] },
        { prompt: "Gap 2", answer: ["mist"] },
        { prompt: "Gap 3", answer: ["water"] },
        { prompt: "Gap 4", answer: ["pumps"] },
        { prompt: "Gap 5", answer: ["reused"] },
      ],
    },
    {
      kind: "True/False/Not Given",
      instruction: TFNG_INSTRUCTION(1),
      options: TFNG,
      questions: [
        { prompt: "Despommier's students first suggested growing food on the roofs of buildings.", answer: "TRUE" },
        { prompt: "Vertical farms never need to use pesticides.", answer: "FALSE" },
        { prompt: "Lettuces can be harvested in about half the usual time in a vertical farm.", answer: "TRUE" },
        { prompt: "Most vertical farms now obtain their electricity from renewable sources.", answer: "NOT GIVEN" },
        { prompt: "Some vertical farms are now operated entirely by robots.", answer: "NOT GIVEN" },
      ],
    },
    {
      kind: "Sentence completion",
      instruction: "{range}\nComplete the sentences below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.",
      questions: [
        { prompt: "Leafy greens suit vertical farms partly because they are almost entirely ______.", answer: ["edible"] },
        {
          prompt: "Several well-known vertical farming companies failed after ______ rose sharply in 2022.",
          answer: ["energy prices"],
        },
        { prompt: "Vertical farms may be most useful in places that lack farmland and ______.", answer: ["water"] },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Passage 2 — matching headings, multiple choice, sentence completion
// ---------------------------------------------------------------------------
const HEADINGS = [
  "i. Problems caused by faster travel",
  "ii. The invention of the mechanical clock",
  "iii. A decision that was not universally accepted",
  "iv. From the Earth's spin to the atom",
  "v. Timekeeping based on the position of the sun",
  "vi. Why sailors needed accurate clocks",
  "vii. Political choices about time today",
  "viii. The first country to share a single time",
  "ix. Dividing up a continent",
  "x. Public opposition to daylight saving",
];

const passage2: PassageDef = {
  title: "Reading Passage 2 — Setting the World's Clocks",
  shortTitle: "Standard Time",
  passage: `A   For most of human history, time was a local matter. Each town set its clocks by the sun, so that noon was the moment when the sun stood highest in the sky. Since the sun appears to move across the sky from east to west, noon in a town a few dozen kilometres to the east arrived a few minutes earlier. In Britain, for example, the clocks of Bristol ran about ten minutes behind those of London. For people who rarely travelled further than they could walk or ride in a day, these differences hardly mattered.

B   The railways changed this. A train could cross several local times in a single journey, and timetables became extraordinarily confusing. Each railway company tended to keep its own time, usually that of the city where it had its headquarters, so a single station served by several companies might display several clocks showing different times. In the United States, where distances were far greater, dozens of different railway times were in use in the 1870s. Missed connections were common, and on single-track lines, where trains travelling in opposite directions depended on precise timing to avoid one another, confusion could have fatal consequences.

C   British railways were the first to adopt a common standard. During the 1840s, companies began to adopt London time, determined by the Royal Observatory at Greenwich, and the newly invented electric telegraph allowed time signals to be sent almost instantly along the lines. By 1855 the great majority of public clocks in Britain showed Greenwich time, although it did not become the legal time throughout the country until 1880. Some towns resisted for years; a clock on the Corn Exchange in Bristol still has two minute hands, one showing local time and the other London time.

D   In North America, a single national time was impossible: the continent spans more than four hours of solar time. The solution was to divide it into zones, within each of which all clocks would show the same time. A system of this kind was proposed by several people, among them Sandford Fleming, a Scottish-born engineer working in Canada, who is said to have become interested in the problem after missing a train in Ireland because of an error in a printed timetable. On 18 November 1883 the American and Canadian railways introduced four standard time zones. The change was made by the railway companies themselves, without any government law; the United States Congress did not formally adopt standard time until 1918.

E   The question of a worldwide system was taken up at the International Meridian Conference, held in Washington in 1884 and attended by representatives of 25 nations. Its main task was to choose a 'prime meridian', the line of longitude from which all others would be measured and from which time around the globe could be calculated. The meridian passing through Greenwich was selected, largely because around 70 per cent of the world's shipping already used charts based on it. The vote was not unanimous: the Dominican Republic voted against, while France and Brazil abstained. France continued to use Paris Mean Time for decades afterwards, and only adopted the Greenwich system in 1911, officially describing it as Paris time 'retarded by nine minutes and twenty-one seconds'.

F   Even today, the boundaries of time zones follow political rather than strictly geographical logic. China, which in principle spans five time zones, uses a single national time, meaning that in the far west of the country the sun may not rise until around 10 a.m. in winter. Some countries, including India, use time zones that differ from Greenwich by a half-hour, and Nepal's is offset by five hours and forty-five minutes. Governments also change their time zones for economic or symbolic reasons; in 2011, Samoa moved to the other side of the International Date Line in order to align its working week with those of Australia and New Zealand, its main trading partners, skipping 30 December entirely.

G   The precision with which time is measured has also changed beyond recognition. Since 1967 the second has been defined not by the rotation of the Earth but by the vibrations of caesium atoms, and the world's official time is now calculated from a network of several hundred atomic clocks. Because the Earth's rotation is gradually and irregularly slowing, an extra 'leap second' has occasionally been added to keep atomic time in step with the sun. These insertions cause problems for computer networks, however, and in 2022 an international conference agreed to stop adding leap seconds by 2035.`,
  groups: [
    {
      kind: "Matching headings",
      instruction:
        "{range}\nReading Passage 2 has seven paragraphs, A–G.\nChoose the correct heading for each paragraph from the list of headings below.\nThere are more headings than paragraphs.",
      options: HEADINGS,
      questions: [
        { prompt: "Paragraph A", answer: "v" },
        { prompt: "Paragraph B", answer: "i" },
        { prompt: "Paragraph C", answer: "viii" },
        { prompt: "Paragraph D", answer: "ix" },
        { prompt: "Paragraph E", answer: "iii" },
        { prompt: "Paragraph F", answer: "vii" },
        { prompt: "Paragraph G", answer: "iv" },
      ],
    },
    {
      kind: "Multiple choice",
      instruction: "{range}\nChoose the correct letter, A, B, C or D.",
      questions: [
        {
          prompt: "Why does the writer mention the clock with two minute hands?",
          options: [
            "A. to show that some places were slow to accept London time",
            "B. to describe an early electric clock",
            "C. to explain how the telegraph sent time signals",
            "D. to show how accurate railway clocks had become",
          ],
          answer: "A",
        },
        {
          prompt: "Greenwich was chosen as the prime meridian mainly because",
          options: [
            "A. Britain sent the largest number of representatives.",
            "B. it was already used on most shipping charts.",
            "C. France had proposed it.",
            "D. it lay at the centre of the world's time zones.",
          ],
          answer: "B",
        },
      ],
    },
    {
      kind: "Sentence completion",
      instruction:
        "{range}\nComplete the sentences below.\nChoose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.",
      questions: [
        {
          prompt: "In North America, standard time zones were introduced by the ______ rather than by law.",
          answer: ["railway companies", "railways"],
        },
        {
          prompt: "Sandford Fleming reportedly missed a train because of an error in a printed ______.",
          answer: ["timetable"],
        },
        {
          prompt: "Samoa changed its time zone to match the working week of its main ______.",
          answer: ["trading partners"],
        },
        { prompt: "Leap seconds are due to be abandoned by ______.", answer: ["2035"] },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Passage 3 — multiple choice, matching features, YNNG
// ---------------------------------------------------------------------------
const passage3: PassageDef = {
  title: "Reading Passage 3 — The Bilingual Brain",
  shortTitle: "Bilingualism",
  passage: `For much of the twentieth century, parents in many countries were advised not to bring up their children with two languages. Learning two languages at once, it was believed, would confuse young minds, delay speech and hold children back at school. Early studies appeared to support this view, finding that bilingual children scored lower on intelligence tests than their monolingual peers. In retrospect, these studies were deeply flawed: many tested immigrant children in a language they were still learning, and failed to take account of differences in family income and education.

The picture began to change in 1962, when the Canadian researchers Elizabeth Peal and Wallace Lambert published a study of ten-year-olds in Montreal which, unusually, compared bilingual and monolingual children from similar backgrounds. To the researchers' own surprise, the bilingual children performed better on a range of tests, particularly those requiring mental flexibility. Over the following decades, a substantial body of research developed around what came to be called the 'bilingual advantage'.

The most influential figure in this field has been Ellen Bialystok, a psychologist at York University in Toronto. Her explanation for the advantage rests on a simple observation: in the brain of a bilingual person, both languages are active at the same time, even when only one is being used. Speaking one language therefore requires the constant suppression of the other. Bialystok proposed that this continual practice strengthens the brain's 'executive control' system — the set of mental processes that allow us to focus attention, ignore distractions and switch between tasks. In a series of experiments, she found that bilingual children and adults were faster at tasks designed to measure these abilities. In 2007 her team also reported that, among patients attending a memory clinic in Toronto, those who had spoken two languages throughout their lives had developed symptoms of dementia about four years later, on average, than those who spoke only one.

These findings attracted enormous public attention, and the idea that learning a language could make people smarter and protect them against dementia became widely accepted. Within the scientific community, however, doubts were growing. The psychologist Kenneth Paap and his colleagues conducted a number of large studies which found no difference between bilinguals and monolinguals on tests of executive control. Paap argued that many earlier studies had used small samples, making chance results more likely, and that apparent differences often disappeared once factors such as cultural background and social class were taken into account.

A further problem was identified by Angela de Bruin, then a researcher at the University of Edinburgh. In 2015 she and her co-authors examined summaries of research presented at scientific conferences between 1999 and 2012 and tracked which of these studies were later published in academic journals. They found that studies reporting a bilingual advantage were considerably more likely to be published than studies that found no effect or a negative one. If this pattern were widespread, the published literature would give a misleading impression of the strength of the evidence — a phenomenon known as publication bias.

Where does this leave the bilingual advantage? It seems to me that the most reasonable conclusion is that the effect on executive control, if it exists at all, is much smaller and less consistent than was once claimed. The evidence regarding dementia is more difficult to assess. Some later studies have supported Bialystok's findings while others have not, and research of this kind is hard to carry out, since people cannot be randomly assigned to grow up bilingual. The question is therefore likely to remain open for some time.

What is not in doubt is that the old fears about bilingualism were unfounded. Children who grow up with two languages do not suffer lasting confusion, and although their vocabulary in each individual language may be somewhat smaller than that of a monolingual child, their total vocabulary across both languages is typically similar or larger. Nor is there any evidence that bilingualism harms academic achievement. It is unfortunate, then, that so much of the public debate has focused on whether a second language provides mental benefits, as if the value of a language could be measured by a test score. The ability to communicate with more people, to read another literature and to understand another culture would justify learning a language even if it had no effect on the brain at all.`,
  groups: [
    {
      kind: "Multiple choice",
      instruction: "{range}\nChoose the correct letter, A, B, C or D.",
      questions: [
        {
          prompt: "What does the writer say about early studies of bilingual children?",
          options: [
            "A. They were carried out mainly in Canada.",
            "B. They did not compare children from similar backgrounds.",
            "C. They showed that bilingual children learned to speak earlier.",
            "D. They tested children in their first language.",
          ],
          answer: "B",
        },
        {
          prompt: "What surprised Peal and Lambert?",
          options: [
            "A. how few bilingual children there were in Montreal",
            "B. that the bilingual children did better on the tests",
            "C. that the monolingual children showed more mental flexibility",
            "D. that intelligence tests were unreliable",
          ],
          answer: "B",
        },
        {
          prompt: "According to Bialystok, bilingual people have stronger executive control because they",
          options: [
            "A. learn to speak at a younger age.",
            "B. constantly have to suppress one of their languages.",
            "C. usually come from wealthier families.",
            "D. only ever have one language active at a time.",
          ],
          answer: "B",
        },
        {
          prompt: "What was the purpose of de Bruin's study?",
          options: [
            "A. to test bilingual adults on executive control tasks",
            "B. to compare bilingual and monolingual dementia patients",
            "C. to find out whether certain results were more likely to be published",
            "D. to repeat Peal and Lambert's study with a larger sample",
          ],
          answer: "C",
        },
      ],
    },
    {
      kind: "Matching features",
      instruction:
        "{range}\nMatch each statement with the correct researcher or researchers, A–D.\nYou may use any letter more than once.",
      options: [
        "A. Elizabeth Peal and Wallace Lambert",
        "B. Ellen Bialystok",
        "C. Kenneth Paap",
        "D. Angela de Bruin",
      ],
      questions: [
        { prompt: "found that lifelong bilinguals showed symptoms of a disease later", answer: "B" },
        { prompt: "suggested that small samples could produce misleading results", answer: "C" },
        { prompt: "compared children from similar backgrounds", answer: "A" },
        { prompt: "examined research presented at conferences", answer: "D" },
        { prompt: "explained an advantage in terms of suppressing a language", answer: "B" },
      ],
    },
    {
      kind: "Yes/No/Not Given",
      instruction: YNNG_INSTRUCTION(3),
      options: YNNG,
      questions: [
        { prompt: "The early studies of bilingual children had serious weaknesses.", answer: "YES" },
        { prompt: "Bilingualism clearly improves executive control.", answer: "NO" },
        { prompt: "The link between bilingualism and later dementia has been disproved.", answer: "NO" },
        { prompt: "Public discussion of bilingualism has focused too much on its mental benefits.", answer: "YES" },
        { prompt: "Schools should require all children to learn a second language.", answer: "NOT GIVEN" },
      ],
    },
  ],
};

export const test03: ReadingTestDef = { number: 3, passages: [passage1, passage2, passage3] };
