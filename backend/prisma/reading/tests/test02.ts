import { TFNG, TFNG_INSTRUCTION, YNNG, YNNG_INSTRUCTION, type PassageDef, type ReadingTestDef } from "../types";

// ---------------------------------------------------------------------------
// Passage 1 — TFNG, note completion, short answer
// ---------------------------------------------------------------------------
const passage1: PassageDef = {
  title: "Reading Passage 1 — The Box That Changed the World",
  shortTitle: "Shipping Containers",
  passage: `Before the 1950s, loading a cargo ship was slow, costly and labour-intensive. Goods arrived at the docks in sacks, barrels, crates and bales of every size, and each item had to be lifted individually into the ship's hold by teams of dockworkers. A typical cargo ship might spend as long in port being loaded and unloaded as it did at sea. Theft was common, and damage to goods was frequent. According to one widely quoted estimate, loading and unloading accounted for more than half the total cost of moving goods across the Atlantic.

The man usually credited with changing this was Malcolm McLean, an American who had built up a successful trucking company in North Carolina. McLean was not a sailor, and he had no particular interest in ships. His concern was the time his drivers lost waiting at ports while their cargo was transferred, piece by piece, from lorry to ship. His solution was to load the entire trailer, or at least the metal box on top of it, directly on board. In April 1956 a converted oil tanker called the Ideal X sailed from Newark, New Jersey, to Houston, Texas, carrying 58 metal containers on its deck. When the costs of the voyage were calculated, loading had cost less than 16 cents per ton, compared with almost six dollars per ton for conventional cargo.

The idea of putting goods into large boxes was not entirely new. Railways in Britain and the United States had experimented with removable containers in the early twentieth century, and the American army had used small steel boxes to ship equipment during the Second World War. What distinguished McLean was his recognition that the box alone was not enough. To realise its benefits, every part of the transport system — ships, cranes, ports, lorries and trains — had to be redesigned around it.

This proved to be the greatest obstacle. In the early years, different companies built containers of different lengths, so that a box belonging to one shipping line could not be carried on another line's vessels or lifted by its cranes. Between 1961 and 1970 a series of international agreements, negotiated through the International Organization for Standardization, established common dimensions and, just as importantly, a standard design for the corner fittings by which containers are lifted and locked together. Today the capacity of container ships is still measured in 'twenty-foot equivalent units', or TEUs: the volume of one container of the standard twenty-foot length.

Resistance also came from dockworkers' unions, which correctly predicted that containerisation would eliminate most of their members' jobs. In New York, the number of days worked by dockworkers fell by more than half within a decade. Strikes delayed the introduction of container terminals in several ports, and many historic city-centre docks, unable to accommodate the vast new ships and the open space needed to store containers, closed altogether. Shipping moved to new, purpose-built terminals, often many kilometres away. In London, for example, the old docks near the city centre declined as traffic shifted to Tilbury, further down the River Thames.

The Vietnam War gave containerisation an unexpected boost. In the mid-1960s the American military struggled to supply its forces because of severe congestion at Vietnamese ports. McLean's company won a contract to carry supplies by container, and it solved the problem so effectively that military officials became enthusiastic supporters of the system. Moreover, the ships returning empty across the Pacific called at Japan, where McLean found manufacturers eager to export goods to the United States. This, some historians argue, helped to establish the trading links between East Asia and North America that dominate world commerce today.

The long-term effects of the container are difficult to overstate. By reducing the cost of shipping so dramatically, it made it economical for companies to manufacture components in one country, assemble them in another and sell the finished product in a third. Some economists have estimated that containerisation did more to increase international trade in the late twentieth century than all the trade agreements of the period combined. The largest modern ships can carry more than 20,000 TEUs, and the cost of shipping a container from China to Europe is now often a small fraction of the price of the goods it holds. The humble steel box, it seems, is one of the least celebrated but most important inventions of the modern age.`,
  groups: [
    {
      kind: "True/False/Not Given",
      instruction: TFNG_INSTRUCTION(1),
      options: TFNG,
      questions: [
        {
          prompt: "Before containers were introduced, a cargo ship could spend as much time in port as at sea.",
          answer: "TRUE",
        },
        { prompt: "McLean had worked at sea before starting his trucking business.", answer: "FALSE" },
        { prompt: "The Ideal X was the largest ship sailing from Newark at the time.", answer: "NOT GIVEN" },
        { prompt: "McLean was the first person to transport goods in large boxes.", answer: "FALSE" },
        { prompt: "Many dockworkers who lost their jobs found work at the new container terminals.", answer: "NOT GIVEN" },
      ],
    },
    {
      kind: "Note completion",
      instruction:
        "{range}\nComplete the notes below.\nChoose ONE WORD AND/OR A NUMBER from the passage for each answer.\n\nThe problem of standardisation\n• early containers were built in different ___6___\n• international agreements were made between 1961 and ___7___\n• a common design was agreed for the ___8___ fittings used to lift and lock containers\n• ship capacity is measured in TEUs, based on a container ___9___ feet long",
      questions: [
        { prompt: "Early containers were built in different ______.", answer: ["lengths"] },
        { prompt: "Agreements were made between 1961 and ______.", answer: ["1970"] },
        { prompt: "A common design was agreed for the ______ fittings.", answer: ["corner"] },
        { prompt: "A TEU is based on a container ______ feet long.", answer: ["twenty", "20"] },
      ],
    },
    {
      kind: "Short answer",
      instruction:
        "{range}\nAnswer the questions below.\nChoose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.",
      questions: [
        { prompt: "To which place did London's shipping traffic move?", answer: ["Tilbury"] },
        {
          prompt: "Which conflict increased the military's support for containers?",
          answer: ["Vietnam War"],
        },
        { prompt: "In which country did McLean find manufacturers wanting to export goods?", answer: ["Japan"] },
        {
          prompt: "The largest modern ships can carry more than how many TEUs?",
          answer: ["20,000", "20000", "twenty thousand"],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Passage 2 — matching information, matching features, summary completion
// ---------------------------------------------------------------------------
const PARAGRAPHS_AG = ["A", "B", "C", "D", "E", "F", "G"];

const passage2: PassageDef = {
  title: "Reading Passage 2 — Rebuilding the Reef",
  shortTitle: "Coral Restoration",
  passage: `A   Coral reefs cover less than one per cent of the ocean floor, yet they are home to roughly a quarter of all known marine species. They protect coastlines from storms, support fisheries on which hundreds of millions of people depend, and attract tourists who contribute billions of dollars to local economies. Over the past few decades, however, reefs around the world have suffered severe damage. Some estimates suggest that the world has already lost around half of its living coral since the 1950s, and scientists warn that much of what remains is under threat.

B   The main cause of this decline is rising sea temperatures. Reef-building corals live in partnership with microscopic algae that grow inside their tissues. The algae provide the coral with most of its food through photosynthesis and give it its colour. When the water becomes too warm for an extended period, this partnership breaks down: the coral expels the algae and turns white, a process known as bleaching. A bleached coral is not dead, and if temperatures return to normal quickly enough, the algae can recolonise it. If the heat persists, however, the coral starves. Australia's Great Barrier Reef has experienced several mass bleaching events since 2016, affecting reefs along almost its entire length.

C   Faced with these losses, a growing number of scientists and conservation groups have begun not just to protect reefs but to actively rebuild them. The most widespread technique is known as coral gardening. Small pieces of healthy coral are collected and grown in underwater nurseries, often hung from frames resembling branching trees, where they are protected from predators and sediment. Once they have grown large enough, they are attached to damaged areas of reef using cement, nails or cable ties. In the Florida Keys, one organisation alone has planted well over 100,000 corals in this way.

D   Coral gardening works well for fast-growing branching species, but many of the corals that form the structural foundation of reefs grow extremely slowly — sometimes only a few centimetres a year. A solution emerged largely by accident. In the mid-2000s, the marine biologist David Vaughan, then working at a laboratory in Florida, was moving a slow-growing coral when part of it broke into small fragments. Rather than dying, the tiny fragments grew back to their original size within weeks, far faster than expected. This technique, now called micro-fragmentation, relies on the fact that corals grow rapidly when repairing an injury. When fragments of the same coral are placed close together, they also fuse into a single colony, allowing a large area to be covered in a fraction of the usual time.

E   Both gardening and micro-fragmentation have a significant limitation: because new corals are produced from pieces of existing ones, they are genetically identical to their parents, leaving restored reefs vulnerable to the same diseases and stresses. An alternative approach uses sexual reproduction. On many reefs, corals release eggs and sperm into the water on just a few nights each year, usually in the days after a full moon. A team led by Professor Peter Harrison of Southern Cross University in Australia has developed methods of collecting this spawn, rearing the resulting larvae in floating enclosures and then releasing them onto damaged reefs, where they settle and grow. Because the young corals come from many parents, they are genetically diverse.

F   Some researchers argue that even this will not be enough if ocean temperatures continue to rise. They are therefore investigating whether corals can be helped to tolerate heat. One approach, sometimes called 'assisted evolution', involves selecting corals that have survived bleaching events and breeding them together, in the hope of producing offspring that are more resistant. The marine scientist Madeleine van Oppen has also experimented with growing the corals' partner algae at gradually increasing temperatures in the laboratory, producing strains that cope better with heat stress.

G   Critics point out that restoration remains tiny in scale compared with the problem. The Great Barrier Reef alone covers an area of more than 340,000 square kilometres, while most restoration projects have treated areas of no more than a few hectares, and the cost per hectare can run to hundreds of thousands of dollars. There is also a concern that well-publicised restoration projects may give the impression that damaged reefs can easily be repaired, reducing the pressure on governments to address the underlying cause. Most reef scientists agree that restoration can buy time and preserve genetic diversity, but that the long-term survival of reefs depends on reducing global greenhouse gas emissions.`,
  groups: [
    {
      kind: "Matching information",
      instruction:
        "{range}\nReading Passage 2 has seven paragraphs, A–G.\nWhich paragraph contains the following information?\nChoose the correct letter, A–G.",
      options: PARAGRAPHS_AG,
      questions: [
        { prompt: "an explanation of why corals lose their colour", answer: "B" },
        { prompt: "a comparison between the size of a reef and the size of restored areas", answer: "G" },
        { prompt: "an example of a discovery made by chance", answer: "D" },
        { prompt: "a reference to the timing of coral reproduction", answer: "E" },
      ],
    },
    {
      kind: "Matching features",
      instruction:
        "{range}\nMatch each statement with the correct researcher, A–C.\nYou may use any letter more than once.",
      options: ["A. David Vaughan", "B. Peter Harrison", "C. Madeleine van Oppen"],
      questions: [
        { prompt: "developed a method that produces genetically varied corals", answer: "B" },
        { prompt: "altered organisms that live inside coral tissue", answer: "C" },
        { prompt: "observed that broken coral could regrow surprisingly fast", answer: "A" },
        { prompt: "raised young corals in floating structures", answer: "B" },
      ],
    },
    {
      kind: "Summary completion",
      instruction:
        "{range}\nComplete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\n\nCoral gardening\nIn coral gardening, small pieces of coral are raised in underwater ___22___, where they are kept safe from predators and ___23___. They are then fixed to the reef with materials such as cement or cable ties. However, the method is less suitable for corals that grow very ___24___. Because the new corals are genetically identical to their parents, restored reefs may be affected by the same ___25___ and stresses. Critics also fear that restoration projects may reduce the pressure on ___26___ to deal with the root cause of reef decline.",
      questions: [
        { prompt: "Gap 22", answer: ["nurseries"] },
        { prompt: "Gap 23", answer: ["sediment"] },
        { prompt: "Gap 24", answer: ["slowly"] },
        { prompt: "Gap 25", answer: ["diseases"] },
        { prompt: "Gap 26", answer: ["governments"] },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Passage 3 — multiple choice, YNNG, matching sentence endings
// ---------------------------------------------------------------------------
const passage3: PassageDef = {
  title: "Reading Passage 3 — The Problem with Choice",
  shortTitle: "The Psychology of Choice",
  passage: `In 1995, shoppers at an upmarket grocery store in California became the unwitting subjects of one of the most famous experiments in modern psychology. On some days, a tasting stand near the entrance offered 24 varieties of jam; on others, it offered just six. The larger display attracted more visitors, but it was the smaller display that sold more jam: around 30 per cent of those who stopped at the six-jam table went on to make a purchase, compared with only 3 per cent of those who faced 24 options. The researchers, Sheena Iyengar and Mark Lepper, concluded that too much choice could be 'demotivating', leaving people so uncertain about which option was best that they chose nothing at all.

The finding seemed to capture something about modern life, and it spread rapidly beyond academic journals. In his 2004 book The Paradox of Choice, the psychologist Barry Schwartz argued that the explosion of options in wealthy societies — from breakfast cereals to pension plans — was making people not freer but more anxious. Schwartz drew a distinction between two types of decision-maker. 'Maximisers' feel they must examine every possibility in order to find the very best option, while 'satisficers' are content to choose the first option that meets their requirements. Research he was involved in suggested that maximisers often made objectively better decisions, earning higher starting salaries in their first jobs, for example, yet felt less satisfied with the outcome, since they were more likely to dwell on the alternatives they had rejected.

These ideas have been enormously influential. Businesses have reduced the number of products they offer, governments have simplified the design of public services, and countless self-help writers have urged readers to limit the choices in their daily lives. Yet the scientific basis for the 'choice overload' effect has turned out to be less secure than many people assume. In 2010 a team led by Benjamin Scheibehenne combined the results of 50 separate experiments on the subject, involving more than 5,000 participants. They found that, on average, the number of options had virtually no effect on people's willingness to choose or their satisfaction with the result. Some studies had found strong overload effects, but others had found the opposite: that people preferred, and were happier with, larger selections.

It would be a mistake, however, to conclude that choice overload is a myth. A later analysis, published in 2015, suggested that the effect is real but appears only under particular conditions. People are most likely to be overwhelmed when the options are difficult to compare, when they have no clear preferences of their own, when the decision feels important and when they are under pressure of time. A shopper with a favourite brand of jam will not be troubled by a shelf of 24; someone choosing a jam as a gift for an unfamiliar host may well be. In my view, this more nuanced picture is far more useful than the original headline, since it tells us not whether choice is good or bad but when it is likely to become a burden.

Similar caution is needed with a related idea that has become popular in recent years: that our capacity to make decisions is a limited resource which becomes depleted over the course of the day. A frequently cited study of parole hearings in Israel appeared to show that judges were far more likely to grant parole early in the morning and immediately after meal breaks than just before them, as if their mental energy had been exhausted. However, other researchers subsequently noted that the order in which cases were heard was not random — prisoners without legal representation, whose applications were less likely to succeed, tended to be heard at the end of each session — and this alone could explain much of the pattern. Attempts to replicate the laboratory experiments on which the theory of 'decision fatigue' was based have also produced disappointing results.

None of this means that the critics of excessive choice were entirely wrong. Anyone who has spent an evening comparing mobile phone contracts knows that a bewildering range of options can be exhausting, and there is good evidence that complex choices lead people to delay important decisions, such as joining a pension scheme. The most effective response, though, is probably not to eliminate choice but to design it better: for example, by grouping options into clear categories, by offering a sensible default for those who do not wish to choose, and by making it easy to compare alternatives on the features that matter most. Freedom of choice remains valuable. The challenge is to present it in a way that people can actually use.`,
  groups: [
    {
      kind: "Multiple choice",
      instruction: "{range}\nChoose the correct letter, A, B, C or D.",
      questions: [
        {
          prompt: "What was the main finding of the jam experiment?",
          options: [
            "A. Shoppers preferred stands that offered free samples.",
            "B. The wider selection attracted fewer visitors.",
            "C. The smaller selection led to more purchases.",
            "D. Most shoppers bought jam whichever display they saw.",
          ],
          answer: "C",
        },
        {
          prompt: "According to the passage, maximisers tend to",
          options: [
            "A. make poorer decisions than satisficers.",
            "B. earn less in their first jobs.",
            "C. choose the first acceptable option.",
            "D. feel less content with their choices.",
          ],
          answer: "D",
        },
        {
          prompt: "What did Scheibehenne's analysis show?",
          options: [
            "A. Choice overload occurred in most of the experiments.",
            "B. Overall, the number of options made little difference.",
            "C. Participants always preferred larger selections.",
            "D. The original jam study had been carried out incorrectly.",
          ],
          answer: "B",
        },
        {
          prompt: "The writer mentions prisoners without legal representation in order to",
          options: [
            "A. criticise the decisions made by the judges.",
            "B. offer an alternative explanation for the results.",
            "C. show that the hearings took place in the morning.",
            "D. support the theory of decision fatigue.",
          ],
          answer: "B",
        },
      ],
    },
    {
      kind: "Yes/No/Not Given",
      instruction: YNNG_INSTRUCTION(3),
      options: YNNG,
      questions: [
        { prompt: "Many people overestimate how well supported the choice overload effect is.", answer: "YES" },
        { prompt: "Choice overload does not really exist.", answer: "NO" },
        {
          prompt: "The conclusions of the 2015 analysis are more helpful than the original jam study's headline.",
          answer: "YES",
        },
        { prompt: "Businesses that reduced their product ranges have lost customers as a result.", answer: "NOT GIVEN" },
        { prompt: "The best solution is to give people fewer options for important decisions.", answer: "NO" },
      ],
    },
    {
      kind: "Matching sentence endings",
      instruction: "{range}\nComplete each sentence with the correct ending, A–G.",
      options: [
        "A. have produced disappointing results.",
        "B. always leads to greater satisfaction.",
        "C. is unlikely to be troubled by a large number of options.",
        "D. helps those who do not want to make a choice.",
        "E. tend to earn lower salaries.",
        "F. is more likely to be overwhelmed by a large selection.",
        "G. can lead people to delay making a decision.",
      ],
      questions: [
        { prompt: "Someone choosing a gift for a person they do not know well…", answer: "F" },
        { prompt: "A shopper who already has a favourite brand…", answer: "C" },
        { prompt: "A complex range of pension options…", answer: "G" },
        { prompt: "Offering a sensible default option…", answer: "D" },
        { prompt: "Attempts to repeat the laboratory experiments on decision fatigue…", answer: "A" },
      ],
    },
  ],
};

export const test02: ReadingTestDef = { number: 2, passages: [passage1, passage2, passage3] };
