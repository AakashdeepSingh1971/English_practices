import { TFNG, YNNG, type PassageDef, type ReadingTestDef } from "../types";

// ---------------------------------------------------------------------------
// Section 1 — everyday texts
// ---------------------------------------------------------------------------
const section1: PassageDef = {
  title: "Section 1 — Places to Stay and Waste Collection",
  shortTitle: "Places to Stay & Recycling",
  passage: `TEXT 1
PLACES TO STAY NEAR KIRKBY BAY

A   Harbour View Hotel
A family-run hotel with 24 rooms, most of which look out over the harbour. Our restaurant specialises in fresh fish landed by local boats each morning. A lift serves all floors. Rooms from £110 per night, including breakfast. We regret that pets cannot be accommodated.

B   Meadow Farm Campsite
Pitches for tents and caravans on a working farm just outside the village. Facilities include hot showers, a laundry room and a small shop selling eggs, milk and cheese from the farm. Dogs are welcome but must be kept on a lead. £18 per tent per night. Closed from November to March.

C   The Old School House
A converted Victorian school that sleeps six, with a large enclosed garden and a fully equipped kitchen. The beach is a ten-minute walk away. In July and August the cottage is let for a minimum of one week, from Saturday to Saturday; shorter stays are possible at other times. Dogs allowed by arrangement for an extra £15.

D   Kirkby Youth Hostel
Beds in shared dormitories from £22 per night, plus a few private rooms for families. Guests can prepare their own meals in the large shared kitchen. Bicycles can be hired from reception, and staff are happy to suggest routes. Please note that reception closes at 10 p.m.

E   Willow Bed and Breakfast
Three comfortable rooms in our family home, overlooking a quiet garden. We will collect you from Kirkby railway station at no charge, and we can prepare packed lunches for walkers on request. As our house is not suitable for young children, we accept adults only.

F   Bay Holiday Park
Modern wooden lodges, each with its own hot tub. The park has an indoor swimming pool, a children's club during the school holidays and live entertainment every evening. Short breaks of three or four nights are available all year round.


TEXT 2
CHANGES TO WASTE AND RECYCLING COLLECTIONS

From 1 March, Westbrook Council is changing the way household waste is collected. The changes are designed to increase the amount of waste that is recycled, which currently stands at just 38 per cent.

Food waste
Every household will receive a small grey caddy for the kitchen and a larger brown bin to keep outside. Food waste, including tea bags, bones and vegetable peelings, should be placed in the caddy and emptied into the brown bin, which will be collected every week. Liners for the kitchen caddy can be collected free of charge from any public library.

Recycling
Paper, cardboard, glass bottles and jars, cans and plastic bottles can all be put together in your blue bin, which will continue to be collected every two weeks. Please rinse containers before putting them in the bin. Plastic bags and polystyrene cannot be recycled and must not be put in the blue bin.

General waste
Black bins, for all other rubbish, will now be collected every three weeks instead of every two. Households of six or more people may apply for a larger black bin.

Garden waste
The garden waste service is optional and costs £45 a year. Grass cuttings, leaves and small branches can be placed in the green bin, which is collected every two weeks between March and November.

Larger items
Furniture, fridges and other large items can be collected for a fee of £25 for up to three items. Bookings must be made online at least a week in advance.

Calendars showing your collection days will be delivered to every home in February. If your bin is not collected on the correct day, please report it on the council website within two working days.`,
  groups: [
    {
      kind: "Matching information",
      instruction:
        "{range}\nLook at the six places to stay, A–F, in Text 1.\nFor which place are the following statements true?\nChoose the correct letter, A–F. You may use any letter more than once.",
      options: ["A", "B", "C", "D", "E", "F"],
      questions: [
        { prompt: "It is closed for part of the year.", answer: "B" },
        { prompt: "Guests can be picked up from the station free of charge.", answer: "E" },
        { prompt: "Guests must stay for at least a week at certain times of year.", answer: "C" },
        { prompt: "It organises activities for children.", answer: "F" },
        { prompt: "Guests can rent bicycles.", answer: "D" },
        { prompt: "It is suitable for guests who cannot climb stairs.", answer: "A" },
        { prompt: "Children cannot stay there.", answer: "E" },
      ],
    },
    {
      kind: "Sentence completion",
      instruction:
        "{range}\nComplete the sentences below.\nChoose NO MORE THAN TWO WORDS AND/OR A NUMBER from Text 2 for each answer.",
      questions: [
        { prompt: "At present, only ______ per cent of household waste is recycled.", answer: ["38"] },
        { prompt: "Liners for food caddies can be picked up free from any ______.", answer: ["public library", "library"] },
        { prompt: "Brown bins for food waste will be emptied every ______.", answer: ["week"] },
        { prompt: "Residents should ______ containers before putting them in the blue bin.", answer: ["rinse"] },
        { prompt: "Black bins will be emptied every ______.", answer: ["three weeks", "3 weeks"] },
        { prompt: "A household with at least ______ people can ask for a larger black bin.", answer: ["six", "6"] },
        { prompt: "Collections of large items must be booked at least ______ in advance.", answer: ["a week", "one week", "1 week"] },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Section 2 — work-related texts
// ---------------------------------------------------------------------------
const section2: PassageDef = {
  title: "Section 2 — Manual Handling and Internal Vacancies",
  shortTitle: "Manual Handling & Vacancies",
  passage: `TEXT 1
MANUAL HANDLING: GUIDANCE FOR STORE STAFF

Manual handling means any activity that involves lifting, carrying, pushing or pulling a load by hand. Injuries caused by manual handling, particularly to the back, are one of the most common reasons for staff absence in our stores.

Before you lift
Always consider whether the item needs to be moved by hand at all. Trolleys and lifting equipment are available in every stockroom, and you should use them whenever possible. Check the weight of the load: most boxes delivered to our stores display their weight on the label. As a general guide, staff should not lift anything heavier than 25 kilograms on their own. Heavier items must be moved by two people or with equipment.

Lifting safely
Stand close to the load with your feet apart. Bend your knees rather than your back, and keep the load close to your waist as you lift. Avoid twisting your body; turn by moving your feet instead. If you need to put the load down in a precise position, put it down first and then slide it into place.

Training
All staff who handle stock must attend a manual handling course within their first month. The course lasts half a day and is repeated every three years. Staff who return to work after a back injury will be offered a refresher session before they resume lifting duties.

Reporting problems
If you notice that any equipment is damaged, stop using it immediately and inform your manager. Any injury, however minor, must be recorded in the accident book kept in the staff room. This helps us to identify where improvements are needed. Staff who are pregnant, or who have a medical condition affecting their ability to lift, should speak to their manager so that their duties can be adjusted.


TEXT 2
APPLYING FOR AN INTERNAL VACANCY

A   All current vacancies are posted on the staff noticeboard and on the intranet every Monday. Positions are open to internal applicants for one week before they are advertised outside the company.

B   Before applying, please speak to your current line manager. Although you do not need their permission to apply, they will be asked to provide a reference, so it is helpful if they know about your application in advance.

C   Complete the internal application form, which is shorter than the external version because we already hold your personal details. In the section headed 'Supporting statement', explain how your experience matches each of the requirements listed in the job description.

D   Shortlisted candidates will be invited to an interview, normally with two managers from the department concerned. For some roles you may also be asked to give a short presentation or to complete a practical task.

E   All applicants, whether successful or not, will be told the outcome within ten working days of the interview. Unsuccessful applicants can request a meeting to discuss feedback, which many people find useful when applying for future roles.

F   If you are offered the position, your start date will be agreed between your current and new managers. A notice period of up to four weeks is normal, to give your current team time to arrange cover.`,
  groups: [
    {
      kind: "True/False/Not Given",
      instruction:
        "{range}\nDo the following statements agree with the information given in Text 1?\n\nTRUE — if the statement agrees with the information\nFALSE — if the statement contradicts the information\nNOT GIVEN — if there is no information on this",
      options: TFNG,
      questions: [
        { prompt: "Pushing a heavy object counts as manual handling.", answer: "TRUE" },
        { prompt: "Every box delivered to the stores is labelled with its weight.", answer: "FALSE" },
        { prompt: "Staff may lift a 20-kilogram box on their own.", answer: "TRUE" },
        { prompt: "Staff should twist their body to change direction when carrying a load.", answer: "FALSE" },
        { prompt: "New staff must complete the manual handling course before they start work.", answer: "FALSE" },
        { prompt: "The manual handling course takes place at the company's head office.", answer: "NOT GIVEN" },
        { prompt: "Staff who are injured at work receive extra pay while they are absent.", answer: "NOT GIVEN" },
      ],
    },
    {
      kind: "Matching headings",
      instruction:
        "{range}\nText 2 has six sections, A–F.\nChoose the correct heading for each section from the list of headings below.\nThere are more headings than sections.",
      options: [
        "i. Learning from the result",
        "ii. Agreeing when to move",
        "iii. Negotiating your new salary",
        "iv. Where to find opportunities",
        "v. What the selection stage may involve",
        "vi. Explaining why you are suitable",
        "vii. Keeping your manager informed",
        "viii. Support for new team leaders",
      ],
      questions: [
        { prompt: "Section A", answer: "iv" },
        { prompt: "Section B", answer: "vii" },
        { prompt: "Section C", answer: "vi" },
        { prompt: "Section D", answer: "v" },
        { prompt: "Section E", answer: "i" },
        { prompt: "Section F", answer: "ii" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Section 3 — general-interest text
// ---------------------------------------------------------------------------
const section3: PassageDef = {
  title: "Section 3 — The Bicycle: A Short History",
  shortTitle: "History of the Bicycle",
  passage: `The bicycle is so familiar that it is easy to forget how recently it was invented, and how many unsuccessful designs came before the machine we know today. Its first recognisable ancestor appeared in 1817, when Karl Drais, a civil servant in the German city of Mannheim, built a wooden 'running machine'. It had two wheels and could be steered, but it had no pedals: the rider sat astride it and pushed along the ground with his feet. Some historians have suggested that Drais was looking for an alternative to the horse after a failed harvest caused many horses to starve, although there is no direct evidence that this was his motive. The machine enjoyed a brief fashion among wealthy young men, but it was soon banned from the pavements of several cities because riders kept colliding with pedestrians.

Pedals were first fitted in the 1860s, attached directly to the front wheel. These machines, known in English as velocipedes, were made largely of iron and wood, and their rigid frames and metal tyres gave such an uncomfortable ride on cobbled streets that they were popularly called 'boneshakers'. Because each turn of the pedals produced only one turn of the wheel, makers soon realised that a larger front wheel would carry the rider further with each stroke. This led, in the 1870s, to the high-wheeler, often called the penny-farthing, whose front wheel could be as much as 1.5 metres in diameter. It was fast but dangerous: the rider sat high above the ground, and a sudden stop could throw him over the handlebars. Riding one was regarded as a sport for athletic young men rather than a practical means of transport.

The breakthrough came in 1885, when the English inventor John Kemp Starley produced the 'safety bicycle'. It had two wheels of similar size and, crucially, a chain that carried power from the pedals to the rear wheel. Because the gearing allowed the wheels to turn faster than the pedals, a large front wheel was no longer needed. Three years later, John Boyd Dunlop, a Scottish vet living in Belfast, developed an air-filled rubber tyre, originally to make his son's tricycle more comfortable. The combination of the chain drive and the air-filled tyre produced a machine that was safe, comfortable and efficient, and its basic shape has hardly changed since.

The effect on society was remarkable. During the 1890s cycling became a craze in Europe and North America, and for the first time ordinary working people could travel independently beyond walking distance of their homes. In my view, the bicycle's most important social effect was on women. Cycling required practical clothing, and the long, heavy skirts of the period gave way to shorter skirts and even trousers. The American campaigner Susan B. Anthony remarked in 1896 that the bicycle had done more to free women than anything else in the world. Not everyone approved: some doctors warned that cycling was harmful to women's health, although such warnings had no scientific basis whatsoever.

The arrival of the motor car in the early twentieth century reduced the bicycle's importance in wealthy countries, where it came to be seen mainly as a children's toy or a form of exercise. In much of Asia and Africa, however, it remained a vital means of transport for workers and traders, and in many places it still is. The Netherlands and Denmark were notable exceptions in Europe. In the 1970s, after public protests about the number of children killed in road accidents, both countries invested heavily in separate cycle lanes, and today cycling accounts for more than a quarter of all journeys in the Netherlands.

In recent years cycling has enjoyed a revival in many cities, helped by bicycle-sharing schemes and by the electric bicycle, which makes hills and longer commutes manageable for less fit riders. Some cities close certain roads to cars on Sundays and hand them over to cyclists and walkers, and in 2020 many created temporary cycle lanes, some of which later became permanent. The health benefits are also clear: regular cyclists tend to be fitter than people who travel by car, and cycling to work has been linked to a lower risk of heart disease. Critics argue that the cost of building cycle lanes is hard to justify when relatively few people cycle. I believe this argument has things the wrong way round. Experience in the Netherlands suggests that people cycle when they feel safe, and that providing safe routes is what creates the demand in the first place. Two centuries after Drais pushed his wooden machine along the streets of Mannheim, the bicycle may yet prove to be one of the most important inventions for the cities of the future.`,
  groups: [
    {
      kind: "Multiple choice",
      instruction: "{range}\nChoose the correct letter, A, B, C or D.",
      questions: [
        {
          prompt: "What does the writer say about Drais's reason for building his machine?",
          options: [
            "A. He wanted to replace horses that had died after a poor harvest.",
            "B. He hoped to sell it to wealthy young men.",
            "C. His motive is not known for certain.",
            "D. He needed a faster way to travel to work.",
          ],
          answer: "C",
        },
        {
          prompt: "Velocipedes were known as 'boneshakers' because",
          options: [
            "A. they often caused accidents.",
            "B. they were uncomfortable to ride on rough streets.",
            "C. their pedals were difficult to turn.",
            "D. their frames were made of bone.",
          ],
          answer: "B",
        },
        {
          prompt: "Why did makers in the 1870s increase the size of the front wheel?",
          options: [
            "A. to travel further with each turn of the pedals",
            "B. to make the machine easier to steer",
            "C. to give the rider a better view of the road",
            "D. to make the ride more comfortable",
          ],
          answer: "A",
        },
        {
          prompt: "What made a large front wheel unnecessary?",
          options: [
            "A. the air-filled tyre",
            "B. a lighter metal frame",
            "C. a lower seat",
            "D. a chain connecting the pedals to the rear wheel",
          ],
          answer: "D",
        },
      ],
    },
    {
      kind: "Yes/No/Not Given",
      instruction:
        "{range}\nDo the following statements agree with the views of the writer of the text?\n\nYES — if the statement agrees with the views of the writer\nNO — if the statement contradicts the views of the writer\nNOT GIVEN — if it is impossible to say what the writer thinks about this",
      options: YNNG,
      questions: [
        { prompt: "The bicycle's most significant effect on society concerned women.", answer: "YES" },
        { prompt: "Doctors were right to be concerned about women cycling.", answer: "NO" },
        { prompt: "Bicycles are now more widely used in Africa than in Asia.", answer: "NOT GIVEN" },
        { prompt: "The cost of cycle lanes cannot be justified while so few people cycle.", answer: "NO" },
        { prompt: "Electric bicycles will soon be more popular than ordinary bicycles.", answer: "NOT GIVEN" },
      ],
    },
    {
      kind: "Summary completion",
      instruction:
        "{range}\nComplete the summary using the list of words, A–H, below.\n\nIn the 1970s, the Netherlands and Denmark built separate cycle lanes following ___37___ about road deaths among children. Today more than a quarter of all ___38___ in the Netherlands are made by bicycle. Elsewhere, cycling has recently grown again thanks to sharing schemes and electric bicycles, which help less ___39___ riders. The writer believes that safe routes ___40___ demand for cycling.",
      options: [
        "A. protests",
        "B. journeys",
        "C. fit",
        "D. create",
        "E. reduce",
        "F. accidents",
        "G. wealthy",
        "H. commuters",
      ],
      questions: [
        { prompt: "The cycle lanes followed ______ about road deaths among children.", answer: "A" },
        { prompt: "More than a quarter of all ______ in the Netherlands are made by bicycle.", answer: "B" },
        { prompt: "Electric bicycles help less ______ riders.", answer: "C" },
        { prompt: "Safe routes ______ demand for cycling.", answer: "D" },
      ],
    },
  ],
};

export const gt02: ReadingTestDef = { number: 2, variant: "GENERAL", passages: [section1, section2, section3] };
