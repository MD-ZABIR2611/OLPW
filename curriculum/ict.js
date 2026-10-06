/* OLPW expansion curriculum — ICT (CAIE 0417 companion chapters 15-18) */
module.exports = {
    chapters: [
        {
            n: 15,
            title: 'Emerging Technologies',
            card: 'Cloud computing, artificial intelligence, the Internet of Things and big data: what each technology is, how it is used, and the benefits and concerns it raises.',
            lead: 'The newest part of the syllabus: understanding cloud computing, artificial intelligence, the Internet of Things and big data well enough to explain what they are, how they are used and what they mean for people and businesses.',
            concepts: [
                'Cloud computing delivers computing services such as storage, software and servers over the internet on demand, so users rent capacity instead of owning hardware; examples include Google Drive, Microsoft OneDrive and Amazon Web Services (AWS).',
                'Artificial intelligence (AI) lets machines perform tasks that need human intelligence, such as speech and image recognition; virtual assistants like Siri and Alexa use AI to interpret spoken commands.',
                'Machine learning is a branch of AI in which systems improve by learning patterns from large volumes of data rather than following fixed rules; Netflix and YouTube recommendation systems use it.',
                'The Internet of Things (IoT) connects everyday objects with sensors to the internet so they send and receive data, including smart thermostats such as Nest, fitness trackers and connected cars.',
                'Big data refers to datasets too large, fast-moving or complex for traditional software; supermarkets analyse loyalty-card big data to plan stock and target promotions at individual shoppers.',
                'These technologies bring convenience, lower upfront cost and new services, but raise concerns about privacy, security, dependence on connectivity and job displacement, which is why the syllabus treats them at awareness level.'
            ],
            terms: [
                { t: 'Cloud computing', d: 'The delivery of computing services such as storage, software and servers over the internet on demand, so users rent rather than buy capacity.' },
                { t: 'Artificial intelligence', d: 'The simulation of human intelligence by machines, enabling tasks such as speech recognition, image recognition and decision-making.' },
                { t: 'Machine learning', d: 'A branch of artificial intelligence in which systems improve their performance by learning patterns from data instead of following fixed programmed rules.' },
                { t: 'Internet of Things', d: 'A network of everyday physical devices embedded with sensors and connectivity that collect and exchange data over the internet.' },
                { t: 'Big data', d: 'Datasets that are too large, fast-moving or complex to process with traditional software tools, analysed to reveal patterns and trends.' },
                { t: 'Smart device', d: 'An everyday electronic device, such as a smart thermostat or watch, connected to a network that can monitor, control and exchange data.' },
                { t: 'Wearable technology', d: 'Smart electronic devices worn on the body, such as fitness trackers and smartwatches, that collect data and connect to other devices.' },
                { t: 'Virtual assistant', d: 'A software agent, such as Siri or Alexa, that answers questions and performs tasks for a user using voice recognition and artificial intelligence.' }
            ],
            tip: 'Emerging-technology questions test awareness, not depth: define the technology, add one named real example, then one benefit and one concern, and the marks follow.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Define cloud computing and give two named examples of cloud services, stating what each provides.',
                    ans: 'Cloud computing is the delivery of computing services such as storage and software over the internet on demand (1). Google Drive or Microsoft OneDrive provides online file storage (1). Google Docs or Microsoft 365 provides applications that run in the browser (1). Users rent the capacity instead of buying their own server hardware (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A school is considering moving all student files to cloud storage. Discuss the benefits and risks of this decision and reach a judgement.',
                    ans: 'Benefits: files can be reached from any internet-connected device, easing homework and collaboration (1); the school rents storage, avoiding the cost and maintenance of its own file server, and the provider handles backup (1). Risks: learning depends on a reliable internet connection, which may fail (1); storing student files with a third party raises privacy and security concerns if accounts are breached (1). Judgement: acceptable if the school enforces strong passwords, access rights and a second backup, because the benefits then outweigh the risks (1).'
                }
            ]
        },
        {
            n: 16,
            title: 'Programming & Computational Thinking',
            card: 'Pseudocode, flowcharts and trace tables: the computational-thinking tools used to design, represent and dry-run algorithms before any code is written.',
            lead: 'Computational thinking turns real problems into step-by-step solutions. Pseudocode, flowcharts and trace tables let you design and test an algorithm before writing a single line of code.',
            concepts: [
                'Computational thinking breaks problem-solving into four skills: decomposition, pattern recognition, abstraction and algorithm design.',
                'An algorithm is a precise step-by-step method built from sequence (steps in order), selection (IF...THEN...ELSE) and iteration (FOR, WHILE and REPEAT...UNTIL loops).',
                'Pseudocode writes the algorithm in structured plain language, so its logic can be planned and checked before it is coded in a real programming language.',
                'A flowchart represents the algorithm with standard symbols: a rounded rectangle (terminator) for start and end, a rectangle for a process, a diamond for a decision and a parallelogram for input or output.',
                'A trace table dry-runs an algorithm by recording the value of every variable each time it changes, exposing logic errors in loops and selections before coding begins.',
                'In exam trace-table questions most marks are for the intermediate values, so complete every row and read the loop condition carefully to decide whether the test happens before or after each pass.'
            ],
            terms: [
                { t: 'Computational thinking', d: 'The thought process of formulating problems and their solutions so they can be carried out by a computer, using decomposition and abstraction.' },
                { t: 'Decomposition', d: 'Breaking a complex problem down into smaller, simpler parts that can be solved one at a time and then combined.' },
                { t: 'Abstraction', d: 'Removing unnecessary detail from a problem so that only the information essential to solving it is kept.' },
                { t: 'Algorithm', d: 'A precise, step-by-step set of instructions that solves a problem or completes a task in a finite number of steps.' },
                { t: 'Pseudocode', d: 'A structured, plain-language description of an algorithm using keywords, which can be understood without knowing a real programming language.' },
                { t: 'Flowchart', d: 'A diagram that represents an algorithm using standard symbols connected by arrows to show the order of operations.' },
                { t: 'Trace table', d: 'A table used to dry-run an algorithm by recording the changing values of its variables at each step to check that it works correctly.' },
                { t: 'Iteration', d: 'The repeated execution of a block of instructions in an algorithm, achieved with loops such as FOR, WHILE or REPEAT...UNTIL.' }
            ],
            tip: 'In trace-table questions draw the table with one column per variable and complete every row before writing the final output; most marks are for intermediate values, and one wrong early row usually costs the rest.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Name the standard flowchart symbol used for each of the following, and state what it represents: (a) a decision, (b) a process, (c) the start or end of the chart, (d) an input or output of data.',
                    ans: 'Diamond: a decision with yes/no branches (1). Rectangle: a process or action (1). Rounded rectangle or oval (terminator): the start or end of the flowchart (1). Parallelogram: an input or output of data (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A student plans an algorithm in pseudocode and tests it with a trace table before coding it in JavaScript. Explain the advantages of each tool and why testing the logic first saves time.',
                    ans: 'Pseudocode uses structured plain language, so the logic can be planned and read without learning a programming language\'s syntax (1); it is quick to write and easy to change while the design is still being decided (1). A trace table dry-runs the algorithm, recording each variable every time it changes, so errors in loops and selections are found on paper (1). Fixing logic errors before coding avoids rewriting and debugging large amounts of code later (1). Therefore the marks in trace-table questions reward completing every row accurately, not just the final answer (1).'
                }
            ]
        },
        {
            n: 17,
            title: 'Creating Digital Media',
            card: 'How digital images, audio and video are captured, stored and compressed, and how to choose formats and settings for a defined audience and purpose.',
            lead: 'Digital images, audio and video are built from measurable quantities: pixels, samples and frames. Understanding those quantities lets you choose the right format and settings for any audience and purpose.',
            concepts: [
                'A bitmap image is stored as a grid of pixels; its file size in bytes equals width × height × (bit depth ÷ 8), so resolution and colour depth drive both quality and size.',
                'JPEG uses lossy compression suited to photographs on web pages; PNG is lossless and supports transparency for logos; GIF is limited to 256 colours and supports simple animation.',
                'Digital audio is captured by sampling; file size equals sampling rate × bit depth × number of channels × seconds, and MP3 compression reduces it with a small loss of quality.',
                'Video is a sequence of frames: frame rate in frames per second and resolution control smoothness and clarity, while codecs compress the footage for storage and streaming.',
                'Every media product should be designed for a defined audience and purpose, following the house style and including accessibility features such as alt text for images and captions for video.',
                'Reducing resolution, colour depth or frame rate reduces quality but speeds up loading and eases transfer, so the trade-off must be justified by what the audience actually needs.'
            ],
            terms: [
                { t: 'Bitmap image', d: 'An image stored as a grid of pixels in which each pixel holds a colour value; enlarging it makes it pixelated.' },
                { t: 'Vector image', d: 'An image defined by mathematical descriptions of lines and shapes, which can be scaled to any size without losing quality.' },
                { t: 'Resolution', d: 'The amount of detail in a digital image, measured by its total pixel dimensions or pixels per unit length.' },
                { t: 'Bit depth', d: 'The number of bits used to store each pixel or audio sample, determining how many colours or volume levels can be represented.' },
                { t: 'Lossy compression', d: 'A method of reducing file size by permanently discarding some data, so quality is lost each time the file is re-saved.' },
                { t: 'Sampling rate', d: 'The number of audio samples captured per second during recording, measured in hertz; higher rates give better quality and larger files.' },
                { t: 'Frame rate', d: 'The number of frames of video displayed each second, measured in frames per second (fps), controlling how smooth motion looks.' },
                { t: 'Streaming', d: 'Playing audio or video over the internet while it downloads, so the user does not wait for the whole file to arrive.' }
            ],
            tip: 'Learn the file-size calculations as two recipes: images are width × height × bytes per pixel, audio is sampling rate × bit depth × channels × seconds. Convert bytes with 1024 × 1024 and state the units to earn the final mark.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'A digital photo is 1600 × 1200 pixels with a bit depth of 24 bits. Calculate the file size in bytes and then in megabytes, showing every step.',
                    ans: 'Bytes per pixel = 24 ÷ 8 = 3 bytes (1). File size = width × height × bytes per pixel = 1600 × 1200 × 3 = 5,760,000 bytes (1). Convert to megabytes by dividing by 1024 × 1024 (1): 5,760,000 ÷ 1,048,576 ≈ 5.5 MB (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A school website needs (a) a large photograph of its campus and (b) its logo placed on a coloured background. Evaluate the use of JPEG and PNG for these two images.',
                    ans: 'JPEG uses lossy compression, so the photograph becomes a small file that loads quickly with little visible quality loss, which suits the campus photo (1). PNG is lossless, so the logo stays perfectly sharp at any size and its transparent background lets the page colour show through (1). Saving the photograph as PNG would produce a much larger file with no visible benefit, slowing the page for visitors (1). Judgement: JPEG for the photo and PNG for the logo best balance quality, transparency and download speed for the site\'s audience (1).'
                }
            ]
        },
        {
            n: 18,
            title: 'Integrated ICT Project & Exam Technique',
            card: 'Scenario-based exam practice that integrates databases, spreadsheets, documents and websites with systems life cycle skills and tested changeover methods.',
            lead: 'The exam brings everything together: long scenario questions test databases, spreadsheets, document production and website authoring alongside the systems life cycle. Technique — reading the scenario, using its details and answering the command word — decides the grade.',
            concepts: [
                'Scenario questions integrate the whole syllabus: a business case may require a database, a spreadsheet model, a presentation and a website, so a strong answer names the application and justifies it.',
                'The systems life cycle runs from analysis through design, implementation, testing, evaluation to maintenance; exam answers must apply each stage to the scenario rather than just list the stages.',
                'Testing uses normal data (valid, within range), extreme data (valid, at the boundaries) and abnormal data (invalid, which must be rejected); a test plan records test data, expected results and actual results.',
                'Changeover methods trade cost against risk: direct is cheap but risky, parallel is safe but costly, pilot runs the new system at one site first, and phased introduces it stage by stage.',
                'Evaluation judges the finished system against the requirements specification and success criteria agreed with the client at the analysis stage.',
                'Exam technique: underline the command word, answer in the context of the scenario using its named details, and give a linked justification for every choice of software or method.'
            ],
            terms: [
                { t: 'Requirements specification', d: 'A document produced during analysis listing everything the new system must do, agreed by the client as the basis for design.' },
                { t: 'Test plan', d: 'A document listing every test a new system must pass, with the test data, expected results and actual results recorded for each.' },
                { t: 'Normal data', d: 'Test data that is valid and lies within the range a system is designed to accept.' },
                { t: 'Extreme data', d: 'Test data at the boundary limits of the valid range, used to check that a system accepts the largest and smallest permissible values.' },
                { t: 'Abnormal data', d: 'Test data that is invalid or outside the expected range, which the system should detect and reject with an error message.' },
                { t: 'Parallel running', d: 'A changeover method in which the old and new systems run together for a period so their outputs can be compared.' },
                { t: 'Direct changeover', d: 'A changeover method in which the old system stops and the new system starts immediately; it is cheap but risky.' },
                { t: 'Evaluation', d: 'The final stage of the systems life cycle in which the working system is judged against the original requirements specification and success criteria.' }
            ],
            tip: 'Scenario questions reward context: name the application you would use and justify it with a detail lifted from the scenario itself. In test-data questions, always state the expected response — acceptance, or rejection with an error message — as well as the value.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'An exam-marks system accepts whole-number marks from 0 to 100. Give one example each of normal, extreme and abnormal test data, and state what the system should do in each case.',
                    ans: 'Normal: 55, a valid mark inside the range, which the system should accept (1). Extreme: 0 or 100, valid data at the boundaries, which must also be accepted to prove the limits work (1). Abnormal: 101 or −3, invalid data outside the range, which the system must reject with an error message (1). Non-numeric data such as abc should also be rejected (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A bank is replacing its customer account system. Evaluate direct changeover against parallel running for this scenario and justify your choice.',
                    ans: 'Direct changeover is cheap and quick because only one system runs, but if the new system fails customers cannot reach their accounts, which is severe for a bank (1). Parallel running keeps the old system operating alongside for a period, so outputs are compared and the bank can fall back if errors appear (1). However, parallel running doubles the staff workload and data entry for weeks and costs more (1). Judgement: a bank should choose parallel or phased changeover because reliability and customer trust outweigh the extra cost (1).'
                }
            ]
        }
    ]
};
