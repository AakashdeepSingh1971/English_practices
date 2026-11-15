import { TFNG, type PassageDef, type ReadingTestDef } from "../types";

// ---------------------------------------------------------------------------
// Section 1 — everyday texts
// ---------------------------------------------------------------------------
const section1: PassageDef = {
  title: "Section 1 — Community Classes and Leisure Centre Membership",
  shortTitle: "Classes & Leisure Centre",
  passage: `TEXT 1
CLASSES AT NORTHGATE COMMUNITY CENTRE — AUTUMN TERM

A   Beginners' Photography
Learn how to get the best out of any camera, including the one on your phone. Over eight weeks you will cover lighting, composition and simple editing. Each session includes a short walk around the local area to practise what you have learned, so please bring comfortable shoes. Tuesdays, 7–9 p.m. £95.

B   Conversational Spanish
Ideal for anyone planning a holiday in Spain or Latin America. The emphasis is on speaking and listening rather than grammar, and there is no written homework. Classes are limited to twelve students so that everyone gets plenty of practice. Mondays, 6.30–8 p.m. £80, which includes a course book.

C   Furniture Restoration
Bring an old chair, small table or chest of drawers and learn how to repair and refinish it. All tools are provided, but students must buy their own materials, such as varnish and sandpaper, which typically cost around £20. Because of the equipment used, this class is open to adults over 18 only. Wednesdays, 7–9.30 p.m. £120.

D   Healthy Cooking on a Budget
Our popular cookery class shows you how to prepare nutritious family meals for less than £2 a portion. You will eat what you have cooked at the end of each session, so there is no need to have dinner beforehand. Please tell the tutor in advance about any food allergies. Thursdays, 6–8 p.m. £85, including all ingredients.

E   Creative Writing
Whether you want to write short stories, poetry or the story of your own life, this friendly group will help you find your voice. Each week students share their work and receive feedback from the rest of the group. At the end of the course, a selection of pieces will be published in the centre's magazine. Thursdays, 7.30–9 p.m. £70.

F   Introduction to Computers
A gentle course for people who have little or no experience of computers. Topics include sending emails, shopping online safely and making video calls to family. Laptops are provided, so you do not need to bring your own. This course is free to people aged over 65; others pay £40. Fridays, 10 a.m.–12 noon.


TEXT 2
RIVERSIDE LEISURE CENTRE — MEMBERSHIP INFORMATION

Riverside Leisure Centre offers three types of membership.

Standard membership gives you unlimited use of the gym and swimming pool at any time the centre is open. It costs £38 per month, and you can cancel at any time by giving one month's notice.

Off-Peak membership costs £26 per month and gives access to the same facilities, but only before 4 p.m. on weekdays and at any time at weekends.

Family membership covers two adults and up to three children under 16 living at the same address, and costs £75 per month. Children under eight must be accompanied in the pool by an adult at all times.

All members can book fitness classes such as yoga and spinning up to seven days in advance using our app. Classes are included in the price of Standard and Family membership; Off-Peak members pay £4 per class. If you cannot attend a class you have booked, please cancel at least two hours before it begins, as places are limited. Members who fail to attend three booked classes in a month without cancelling will be unable to book for the following two weeks.

New members receive a free introductory session with one of our personal trainers, who will show you how to use the gym equipment safely and help you plan a programme. This session must be taken within a month of joining.

Parking is free for members for up to three hours. The centre is also served by the number 14 bus, which stops directly outside.

Lockers in the changing rooms require a £1 coin, which is returned when you open the locker. Towels can be hired from reception for £2.

The centre is closed on 25 and 26 December and on 1 January. Opening hours on other public holidays are shown on our website.`,
  groups: [
    {
      kind: "Matching information",
      instruction:
        "{range}\nLook at the six classes, A–F, in Text 1.\nFor which class are the following statements true?\nChoose the correct letter, A–F. You may use any letter more than once.",
      options: ["A", "B", "C", "D", "E", "F"],
      questions: [
        { prompt: "Part of each lesson takes place outdoors.", answer: "A" },
        { prompt: "Students do not have any written work to do at home.", answer: "B" },
        { prompt: "Younger people are not allowed to join.", answer: "C" },
        { prompt: "The price includes a book.", answer: "B" },
        { prompt: "Classes take place during the day.", answer: "F" },
        { prompt: "Students have a meal during the class.", answer: "D" },
        { prompt: "Some students' work may appear in print.", answer: "E" },
      ],
    },
    {
      kind: "True/False/Not Given",
      instruction:
        "{range}\nDo the following statements agree with the information given in Text 2?\n\nTRUE — if the statement agrees with the information\nFALSE — if the statement contradicts the information\nNOT GIVEN — if there is no information on this",
      options: TFNG,
      questions: [
        { prompt: "Standard members must pay for a full year in advance.", answer: "FALSE" },
        { prompt: "Off-Peak members may use the swimming pool on Saturday evenings.", answer: "TRUE" },
        { prompt: "Family membership can include children who live at a different address.", answer: "FALSE" },
        { prompt: "Off-Peak members are charged extra to attend fitness classes.", answer: "TRUE" },
        { prompt: "Yoga is the most popular class at the centre.", answer: "NOT GIVEN" },
        { prompt: "New members can take their free session with a trainer at any time during their first year.", answer: "FALSE" },
        { prompt: "Swimming costumes can be hired at reception.", answer: "NOT GIVEN" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Section 2 — work-related texts
// ---------------------------------------------------------------------------
const section2: PassageDef = {
  title: "Section 2 — Starting Work and Annual Leave",
  shortTitle: "New Staff & Annual Leave",
  passage: `TEXT 1
HARLOW DISTRIBUTION — INFORMATION FOR NEW WAREHOUSE STAFF

Welcome to Harlow Distribution. This guide explains what you need to know during your first weeks with us.

Your first day
On your first day, please report to the security gate at 8.15 a.m., where you will be given a temporary pass. Your permanent identity card, which includes your photograph, will be ready by the end of your first week. You will spend the morning with a member of the Human Resources team, who will go through your contract and ask you to provide your bank details so that your wages can be paid.

Training
All new staff complete a two-day induction course before starting work on the warehouse floor. This covers fire safety, the correct way to lift heavy items and the use of the hand-held scanners that record the location of every parcel. Staff who will be driving forklift trucks must also hold a valid licence; if you do not yet have one, the company will pay for you to attend a five-day course at a local training centre.

Clothing and equipment
For safety reasons, steel-toed boots must be worn at all times in the warehouse. The company will provide two pairs of trousers, three shirts and a high-visibility jacket free of charge. You will need to supply your own boots, but you can claim back up to £50 of the cost by giving your receipt to your supervisor.

Shifts and breaks
The warehouse operates 24 hours a day on three eight-hour shifts. Your shift pattern will be agreed with your supervisor and will normally change every four weeks. Each shift includes a paid 30-minute meal break and two unpaid ten-minute breaks. Hot food is available in the staff canteen during the day shift only; staff on the night shift may use the microwaves and fridges in the rest area.

Absence
If you are unable to come to work because of illness, you must telephone the absence line at least one hour before your shift starts. Text messages and emails are not accepted. If you are absent for more than seven days, you will need to provide a note from your doctor.


TEXT 2
REQUESTING ANNUAL LEAVE

Full-time employees are entitled to 25 days of paid annual leave each year, in addition to public holidays. Part-time staff receive the same entitlement in proportion to the number of hours they work. The leave year runs from 1 April to 31 March.

How to apply
Requests should be made through the staff website, where you can also see how many days you have left. Your manager will normally reply within five working days. Requests are approved in the order in which they are received, so it is advisable to book early, particularly for the summer months and school holidays.

Busy periods
Because November and December are our busiest months, no more than two members of each team may be on leave at the same time during this period. Leave of more than one week in these months will only be approved in exceptional circumstances.

Carrying leave forward
We encourage all staff to take their full entitlement. However, up to five unused days may be carried forward into the next leave year, provided they are taken before the end of June. Any days not taken by then will be lost.

Unpaid leave
In some situations, such as a family emergency, you may be able to take additional unpaid leave. This must be agreed in advance with the Human Resources department rather than with your manager.

Buying extra leave
Staff who have completed their probation period may buy up to five extra days of leave each year. The cost is deducted from your salary in equal monthly amounts.`,
  groups: [
    {
      kind: "Note completion",
      instruction:
        "{range}\nComplete the notes below.\nChoose ONE WORD ONLY from Text 1 for each answer.\n\nNEW WAREHOUSE STAFF\nFirst day: collect a temporary ___15___ at the security gate\n  – permanent ID card shows your ___16___\n  – give HR your ___17___ details\nTraining: induction covers fire safety, lifting and using ___18___\n  – forklift drivers need a ___19___\nClothing: buy your own boots, then give the ___20___ to your supervisor\nAbsence: ___21___ at least one hour before your shift",
      questions: [
        { prompt: "Collect a temporary ______ at the security gate.", answer: ["pass"] },
        { prompt: "The permanent ID card shows your ______.", answer: ["photograph", "photo"] },
        { prompt: "Give HR your ______ details.", answer: ["bank"] },
        { prompt: "The induction covers the use of ______.", answer: ["scanners"] },
        { prompt: "Forklift drivers need a ______.", answer: ["licence", "license"] },
        { prompt: "Give the ______ for your boots to your supervisor.", answer: ["receipt"] },
        { prompt: "If you are ill, ______ at least one hour before your shift.", answer: ["telephone", "phone"] },
      ],
    },
    {
      kind: "Short answer",
      instruction:
        "{range}\nAnswer the questions below.\nChoose NO MORE THAN THREE WORDS AND/OR A NUMBER from Text 2 for each answer.",
      questions: [
        { prompt: "How many days of paid annual leave do full-time employees receive?", answer: ["25", "25 days", "twenty-five"] },
        { prompt: "Where should employees make their leave requests?", answer: ["staff website", "the staff website"] },
        { prompt: "Which are the company's busiest months?", answer: ["November and December", "November, December"] },
        { prompt: "By the end of which month must leave carried forward be taken?", answer: ["June"] },
        { prompt: "Who must agree to a request for unpaid leave?", answer: ["Human Resources", "Human Resources department", "HR"] },
        { prompt: "What must staff complete before they can buy extra leave?", answer: ["probation period", "their probation period", "probation"] },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Section 3 — general-interest text
// ---------------------------------------------------------------------------
const section3: PassageDef = {
  title: "Section 3 — The Public Library: Past, Present and Future",
  shortTitle: "The Public Library",
  passage: `A   Libraries are among the oldest public institutions in the world. The famous library of Alexandria, founded in the third century BC, is said to have held hundreds of thousands of scrolls. Yet for most of history, collections of books belonged to monasteries, universities and wealthy individuals, and access to them was restricted to scholars and the privileged few. The idea that anyone, regardless of income or education, should be able to walk in and borrow a book for free is a surprisingly modern one.

B   In Britain, that idea became law with the Public Libraries Act of 1850, which allowed town councils to raise a small local tax to pay for a library. At first the Act applied only to towns with a population of more than 10,000, and even there many councils were reluctant to use it. Opponents complained about the cost to taxpayers and argued that working people would have neither the time nor the inclination to read. Some feared the opposite: that libraries would encourage people to read novels instead of working. Progress was slow, and by 1880 fewer than a hundred towns had opened a public library.

C   Much of the growth that followed was paid for not by taxpayers but by a single man. Andrew Carnegie, a Scottish-born industrialist who had made an enormous fortune in the American steel industry, funded more than 2,500 library buildings around the world between 1883 and 1929. His gifts came with conditions: the local council had to provide the land and agree to pay for books, staff and maintenance from public funds. Carnegie's enthusiasm had personal roots. As a poor teenager in Pennsylvania, he had educated himself by borrowing books from a private collection that a local businessman opened to working boys on Saturdays.

D   Early public libraries looked very different from those of today. Most operated a system of closed access: readers chose a title from a printed catalogue and asked a librarian to fetch it from the stacks. The idea of allowing readers to browse the shelves themselves was introduced gradually from the 1890s onwards. Critics predicted that books would be stolen or put back in the wrong place, but in practice losses were small, and borrowing increased sharply wherever open shelves were introduced.

E   During the twentieth century, libraries steadily widened their role. Children's sections with low shelves and picture books became common, and mobile libraries — vans fitted with shelves — were introduced to serve people living in villages far from a town. Many libraries began lending records and, later, videos, and offered rooms for local groups to meet. For millions of people, the library became not just a place to borrow books but a centre of community life.

F   The last two decades have been far more difficult. The spread of the internet and electronic books reduced the number of people borrowing printed books, and many local authorities, facing cuts in their budgets, chose to reduce library opening hours or close branches altogether. In Britain, hundreds of libraries closed during the 2010s. Some that would otherwise have shut are now run by volunteers, an arrangement that keeps the doors open but which critics say cannot replace the skills of trained librarians.

G   Yet libraries have shown a remarkable capacity to reinvent themselves. Many now offer workspaces with equipment such as 3D printers, help people to apply for jobs and access government services online, and provide quiet places to study for students who have no space at home. In winter, some advertise themselves as warm spaces for people who cannot afford to heat their homes. In my opinion, this points to the library's most important value today. It is no longer simply a store of books but one of the few indoor public spaces where nobody is expected to spend money, and where everyone, whatever their circumstances, is welcome to stay.`,
  groups: [
    {
      kind: "Matching headings",
      instruction:
        "{range}\nThe text has seven paragraphs, A–G.\nChoose the correct heading for paragraphs B–G from the list of headings below.\nThere are more headings than paragraphs.",
      options: [
        "i. A generous gift with conditions attached",
        "ii. Disagreement over a new public service",
        "iii. Trusting readers to find books themselves",
        "iv. More than a place to borrow books",
        "v. A period of decline",
        "vi. A place that asks nothing of its visitors",
        "vii. The world's most valuable book collections",
        "viii. How libraries choose which books to buy",
        "ix. The origins of library catalogues",
      ],
      questions: [
        { prompt: "Paragraph B", answer: "ii" },
        { prompt: "Paragraph C", answer: "i" },
        { prompt: "Paragraph D", answer: "iii" },
        { prompt: "Paragraph E", answer: "iv" },
        { prompt: "Paragraph F", answer: "v" },
        { prompt: "Paragraph G", answer: "vi" },
      ],
    },
    {
      kind: "Multiple choice",
      instruction: "{range}\nChoose the correct letter, A, B, C or D.",
      questions: [
        {
          prompt: "According to paragraph B, the Public Libraries Act of 1850 at first",
          options: [
            "A. applied only to larger towns.",
            "B. required every town to open a library.",
            "C. was paid for by the national government.",
            "D. was welcomed by most town councils.",
          ],
          answer: "A",
        },
        {
          prompt: "Carnegie's interest in libraries was partly because",
          options: [
            "A. he had worked as a librarian in Pennsylvania.",
            "B. he wanted to sell steel for library buildings.",
            "C. he had benefited from borrowing books when he was young.",
            "D. local councils had asked him for help.",
          ],
          answer: "C",
        },
        {
          prompt: "What happened when libraries allowed readers to choose books from the shelves?",
          options: [
            "A. Large numbers of books were stolen.",
            "B. More books were borrowed.",
            "C. Librarians had to work longer hours.",
            "D. Printed catalogues stopped being used.",
          ],
          answer: "B",
        },
      ],
    },
    {
      kind: "Sentence completion",
      instruction: "{range}\nComplete the sentences below.\nChoose NO MORE THAN TWO WORDS from the text for each answer.",
      questions: [
        { prompt: "Mobile libraries were introduced for people living in ______ far from a town.", answer: ["villages"] },
        { prompt: "Some libraries that would otherwise have closed are now run by ______.", answer: ["volunteers"] },
        { prompt: "Some library workspaces now include equipment such as ______.", answer: ["3D printers", "3-D printers"] },
        { prompt: "The writer values libraries as places where nobody is expected to ______.", answer: ["spend money"] },
      ],
    },
  ],
};

export const gt01: ReadingTestDef = { number: 1, variant: "GENERAL", passages: [section1, section2, section3] };
