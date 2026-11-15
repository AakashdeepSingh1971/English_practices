import { TFNG, type PassageDef, type ReadingTestDef } from "../types";

// ---------------------------------------------------------------------------
// Section 1 — everyday texts
// ---------------------------------------------------------------------------
const section1: PassageDef = {
  title: "Section 1 — Museums and Parking Permits",
  shortTitle: "Museums & Parking Permits",
  passage: `TEXT 1
MUSEUMS AND GALLERIES IN WESTFORD

A   Westford City Museum
Discover the history of Westford from Roman times to the present day through objects found in and around the city. Entry is free, and free guided tours leave the main hall every Saturday at 11 a.m. The museum café serves light lunches. Closed on Mondays.

B   The Hartley Gallery
Westford's home of modern art, with changing exhibitions every three months by artists from around the world. Admission is £8 for adults; students with a valid card enter free. Please note that photography is not permitted in any part of the gallery.

C   Museum of Rail Transport
Housed in a former engine shed, the museum tells the story of the railways that made Westford an important industrial town. Visitors can climb aboard several historic locomotives. On the first Sunday of every month, steam train rides are available along a short section of restored track (extra charge). Large free car park.

D   Westford Science Discovery Centre
Over a hundred hands-on exhibits help children explore light, sound, electricity and the human body. Shows in the planetarium run throughout the day. During school holidays the centre is extremely busy, and all visits must be booked online beforehand. Birthday party packages are also available.

E   The Craft Workshop Museum
See skilled makers demonstrate traditional crafts such as weaving, pottery and glass-blowing. On Thursday afternoons, visitors can try making their own pot under the guidance of a potter. The museum shop sells pottery, glassware and textiles produced in the workshops.


TEXT 2
RESIDENTS' PARKING PERMITS

In parts of the town centre, parking on the street is restricted to vehicles displaying a valid permit between 8 a.m. and 6.30 p.m., Monday to Saturday. The council offers several types of permit.

Resident permits
These are available to anyone whose main home is within a permit zone. Applicants must provide proof of address, such as a council tax bill, together with the vehicle's registration document. The first permit for each household costs £60 a year; a second permit costs £110. No more than two resident permits are issued per address.

Visitor permits
Residents can buy books of visitor permits for friends, family or tradespeople. Each permit is valid for one day and must be displayed on the dashboard with the date written clearly on it. A book of ten permits costs £15. Each household may buy up to 60 visitor permits per year.

Carer permits
These are free and are issued to professional carers who visit residents in their homes. Applications must be made by the carer's employer, not by the carer.

Business permits
Businesses within a permit zone may apply for up to three permits for vehicles that are essential to their work, at a cost of £300 each per year. Permits are not issued for staff who simply drive to work.

Electric vehicles
Owners of fully electric vehicles receive a 50 per cent discount on resident permits.

Applications can be made online, and permits are usually posted within five working days. Vehicles parked in a permit zone without a valid permit may receive a fine of £70, which is reduced to £35 if paid within 14 days.`,
  groups: [
    {
      kind: "Matching information",
      instruction:
        "{range}\nLook at the five places, A–E, in Text 1.\nFor which place are the following statements true?\nChoose the correct letter, A–E. You may use any letter more than once.",
      options: ["A", "B", "C", "D", "E"],
      questions: [
        { prompt: "Visitors can go for a ride on certain days.", answer: "C" },
        { prompt: "There is an entrance fee, but some people can enter without paying.", answer: "B" },
        { prompt: "Visitors can make something themselves.", answer: "E" },
        { prompt: "Visitors must book in advance at certain times of year.", answer: "D" },
        { prompt: "Free tours are offered once a week.", answer: "A" },
        { prompt: "Visitors are not allowed to take pictures.", answer: "B" },
        { prompt: "Items made on the premises are for sale.", answer: "E" },
      ],
    },
    {
      kind: "Table completion",
      instruction:
        "{range}\nComplete the table below.\nChoose NO MORE THAN TWO WORDS AND/OR A NUMBER from Text 2 for each answer.",
      figure: `Permit     | Who can apply                 | Cost                    | Notes
-----------+-------------------------------+-------------------------+------------------------------
Resident   | people whose ( 8 ) is in a    | first permit £60;       | proof of address needed,
           | permit zone                   | second permit £( 9 )    | e.g. a ( 10 ) bill
-----------+-------------------------------+-------------------------+------------------------------
Visitor    | residents, for friends,       | £( 11 ) for a book      | write the ( 12 ) on
           | family or tradespeople        | of ten                  | each permit
-----------+-------------------------------+-------------------------+------------------------------
Carer      | the carer's ( 13 )            | free                    |
-----------+-------------------------------+-------------------------+------------------------------
Business   | businesses in a permit zone   | £300 each per year      | maximum of ( 14 ) permits`,
      questions: [
        { prompt: "Gap 8", answer: ["main home"] },
        { prompt: "Gap 9", answer: ["110", "£110"] },
        { prompt: "Gap 10", answer: ["council tax"] },
        { prompt: "Gap 11", answer: ["15", "£15"] },
        { prompt: "Gap 12", answer: ["date", "the date"] },
        { prompt: "Gap 13", answer: ["employer"] },
        { prompt: "Gap 14", answer: ["three", "3"] },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Section 2 — work-related texts
// ---------------------------------------------------------------------------
const section2: PassageDef = {
  title: "Section 2 — Working from Home and Customer Complaints",
  shortTitle: "Home Working & Complaints",
  passage: `TEXT 1
WORKING FROM HOME: POLICY FOR OFFICE STAFF

Since last year, office-based staff have been able to work from home for up to two days a week. This policy explains how the arrangement works.

Eligibility
The arrangement is available to all office staff who have worked for the company for at least six months. Staff who need to work from home more often for a short time, for example while recovering from an operation, should discuss this with their manager. It is not available to staff whose role requires them to be on site, such as reception and facilities staff.

Agreeing your days
You should agree your home-working days with your line manager. Each team must have at least half of its members in the office on any working day, so not everyone can choose the same days. Wednesday is a 'whole-team day', when all staff are expected to be in the office for meetings and training.

Equipment
The company will provide a laptop, a headset and, on request, a separate screen. Staff are responsible for providing a suitable desk and chair. Before you start working from home, you must complete an online assessment to make sure that your workspace is safe and comfortable.

Being available
While working from home, you must be available by phone and on the company's messaging system during your normal working hours. If you need to go out during the day, for example to a medical appointment, you should tell your manager in the same way as you would in the office.

Security
Confidential documents must not be printed at home. Never use public Wi-Fi, such as in cafés, to access company systems.

Costs
Staff working from home receive an allowance of £6 per week towards the extra cost of heating and electricity. This is added to your monthly salary.

The arrangement will be reviewed every year, and managers may ask staff to spend more time in the office if business needs change.


TEXT 2
HANDLING CUSTOMER COMPLAINTS

Every complaint is an opportunity to improve our service and to keep a customer who might otherwise go elsewhere. All customer service staff should follow the procedure below.

When a complaint is received, whether in person, by phone or in writing, the first step is to listen carefully and allow the customer to explain the problem fully without interruption. Then apologise for the inconvenience, even if you believe the company is not at fault; an apology is not an admission of responsibility.

Next, record the details of the complaint on the customer database. Include the customer's contact details, the date and a clear description of the problem. Each complaint is automatically given a reference number, which you should give to the customer.

If you can solve the problem immediately — for example, by replacing a faulty item or correcting a billing error — do so, and record the solution. You may offer a voucher of up to £20 as a goodwill gesture without asking for approval. Larger amounts must be approved by a supervisor.

If the complaint cannot be resolved straight away, pass it to the relevant department and tell the customer when they can expect a reply. We aim to respond in full to all complaints within ten working days.

If the customer is still unhappy with our response, the complaint should be referred to the Customer Relations Manager, who will review the case. Customers who remain dissatisfied after this stage can contact the independent ombudsman, whose decision we accept.

Finally, the customer service team meets every month to discuss the complaints received and to identify any patterns, such as a particular product that often develops faults. These findings are shared with other departments so that the causes of complaints can be dealt with.`,
  groups: [
    {
      kind: "Sentence completion",
      instruction:
        "{range}\nComplete the sentences below.\nChoose NO MORE THAN TWO WORDS AND/OR A NUMBER from Text 1 for each answer.",
      questions: [
        { prompt: "To work from home, staff must have been with the company for at least ______.", answer: ["six months", "6 months"] },
        { prompt: "On every working day, at least ______ of each team must be in the office.", answer: ["half"] },
        { prompt: "On Wednesdays, all staff come to the office for meetings and ______.", answer: ["training"] },
        { prompt: "Before working from home, staff must complete an online ______ of their workspace.", answer: ["assessment"] },
        { prompt: "Staff must not print ______ at home.", answer: ["confidential documents"] },
        { prompt: "The weekly allowance helps with the extra cost of heating and ______.", answer: ["electricity"] },
      ],
    },
    {
      kind: "Flow-chart completion",
      instruction:
        "{range}\nComplete the flow-chart below.\nChoose ONE WORD ONLY from Text 2 for each answer.\n\nHANDLING A COMPLAINT\nListen to the customer without ___21___\n        ↓\nApologise (this is not an ___22___ of responsibility)\n        ↓\nRecord the details on the customer ___23___ and give the customer the ___24___ number\n        ↓\nSolve the problem if possible (a ___25___ of up to £20 may be offered)\n        ↓\nIf not solved, pass to the relevant department\n        ↓\nIf the customer is still unhappy: Customer Relations Manager, then the independent ___26___\n        ↓\nMonthly team meeting to identify ___27___",
      questions: [
        { prompt: "Listen without ______.", answer: ["interruption"] },
        { prompt: "An apology is not an ______ of responsibility.", answer: ["admission"] },
        { prompt: "Record the details on the customer ______.", answer: ["database"] },
        { prompt: "Give the customer the ______ number.", answer: ["reference"] },
        { prompt: "A ______ of up to £20 may be offered.", answer: ["voucher"] },
        { prompt: "Finally, the customer may contact the independent ______.", answer: ["ombudsman"] },
        { prompt: "The monthly meeting tries to identify ______.", answer: ["patterns"] },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Section 3 — general-interest text
// ---------------------------------------------------------------------------
const section3: PassageDef = {
  title: "Section 3 — Never Too Late: Learning Music as an Adult",
  shortTitle: "Learning Music as an Adult",
  passage: `It is widely believed that musical skill must be developed in childhood, and that adults who take up an instrument for the first time are unlikely to make much progress. Many adults who regret giving up piano lessons at the age of ten assume that the opportunity has passed for ever. Recent research suggests that this belief is, at best, only partly true.

Part of the explanation for the common view lies in the idea of 'critical periods' — windows in early life during which the brain is especially responsive to certain kinds of experience. The clearest example is language: children who learn a second language before puberty are much more likely to speak it without an accent. A similar effect has been found for perfect pitch, the rare ability to identify a musical note without hearing a reference note first. Almost everyone who has this ability began musical training before the age of seven. However, perfect pitch is not necessary to become a good musician, and many professional performers do not have it.

For most other musical skills, the evidence for a critical period is much weaker. The neuroscientist Elena Marsh compared adults who began learning the violin after the age of 30 with children who began at eight. After two years, the children had developed better finger control, but the adults had learned to read music faster and understood more about how pieces of music are structured. Marsh argues that adults' greater ability to think about what they are doing makes up, at least partly, for the flexibility of the young brain.

Adults also face disadvantages, however, and these are often practical rather than biological. Children typically practise every day as part of a routine organised by their parents, while adults must fit practice around work and family responsibilities. David Okafor, a professor of music education, points out that the most common reason adults give up is not a lack of ability but a lack of time. He recommends short, frequent practice sessions — fifteen minutes a day rather than two hours at the weekend — because the brain strengthens newly learned movements during the sleep that follows practice.

Another obstacle is embarrassment. Adults are used to being competent, and many find it uncomfortable to sound unskilled, particularly in front of other people. According to the psychologist Ruth Lindqvist, this fear of failure leads many adult beginners to avoid lessons altogether and to try to teach themselves from online videos. While such videos can be useful, she warns that learners without a teacher often develop bad habits in posture and technique which are difficult to correct later.

Choosing the right instrument also matters. Teachers often recommend that adult beginners start with an instrument that produces a pleasant sound from the first lesson, such as the piano or the ukulele, rather than one like the violin, on which even a simple note can take weeks to play in tune. Early success of this kind builds the confidence that adults need to keep going through the difficult first months. Equally important is choosing music that the learner actually enjoys. Many adults are put off by beginners' books full of children's songs, and teachers who specialise in adult learners increasingly arrange simple versions of popular songs and film music instead. Some learners also find that setting a specific goal, such as playing a particular piece at a family celebration, gives their practice a sense of purpose.

There is growing evidence that learning music benefits adults in ways that go beyond the music itself. A study led by Hiroshi Tanaka, who researches the health of older people, followed a group of people aged between 60 and 85 who took weekly piano lessons for six months. Compared with a similar group who had no lessons, the learners showed improvements in memory and in their ability to concentrate. Tanaka believes that the combination of physical coordination, reading and listening makes playing music an unusually demanding activity for the brain. Making music in a group, such as singing in a choir, appears to bring additional benefits, including reduced feelings of loneliness among older people.

None of this means that an adult beginner is likely to become a concert pianist. Reaching the highest level requires many thousands of hours of practice, which few adults are able to find. But for most people that was never the goal. If the aim is to play for pleasure, to join an amateur orchestra or to accompany friends who like to sing, the evidence suggests that it is rarely too late to start.`,
  groups: [
    {
      kind: "True/False/Not Given",
      instruction:
        "{range}\nDo the following statements agree with the information given in the text?\n\nTRUE — if the statement agrees with the information\nFALSE — if the statement contradicts the information\nNOT GIVEN — if there is no information on this",
      options: TFNG,
      questions: [
        { prompt: "Children who learn a second language before puberty are more likely to speak it without an accent.", answer: "TRUE" },
        { prompt: "Perfect pitch is essential for anyone who wants to become a good musician.", answer: "FALSE" },
        { prompt: "Most people with perfect pitch started musical training before they were seven.", answer: "TRUE" },
        { prompt: "In Marsh's study, the adults developed better finger control than the children.", answer: "FALSE" },
        { prompt: "Some of the adults in Marsh's study had played another instrument as children.", answer: "NOT GIVEN" },
        { prompt: "Adult learners usually practise for longer in each session than children do.", answer: "NOT GIVEN" },
      ],
    },
    {
      kind: "Matching features",
      instruction:
        "{range}\nLook at the following statements and the list of people below.\nMatch each statement with the correct person, A–D.\n\nA  Elena Marsh\nB  David Okafor\nC  Ruth Lindqvist\nD  Hiroshi Tanaka",
      options: ["A", "B", "C", "D"],
      questions: [
        { prompt: "Learning without a teacher can lead to problems that are hard to fix.", answer: "C" },
        { prompt: "Regular short practice is more effective than occasional long sessions.", answer: "B" },
        { prompt: "Adults have a mental advantage that partly makes up for their age.", answer: "A" },
        { prompt: "Playing music makes particularly heavy demands on the brain.", answer: "D" },
      ],
    },
    {
      kind: "Sentence completion",
      instruction: "{range}\nComplete the sentences below.\nChoose ONE WORD ONLY from the text for each answer.",
      questions: [
        { prompt: "According to Okafor, adults most often give up because they do not have enough ______.", answer: ["time"] },
        { prompt: "The older learners in Tanaka's study improved their memory and their ability to ______.", answer: ["concentrate"] },
        { prompt: "Singing in a choir may reduce feelings of ______ among older people.", answer: ["loneliness"] },
      ],
    },
  ],
};

export const gt03: ReadingTestDef = { number: 3, variant: "GENERAL", passages: [section1, section2, section3] };
