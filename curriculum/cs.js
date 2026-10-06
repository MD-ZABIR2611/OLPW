/* OLPW expansion curriculum — Computer Science (CAIE 0478/2210 companion chapters 15-18) */
module.exports = {
    chapters: [
        {
            n: 15,
            title: 'Binary Arithmetic and Data Representation in Depth',
            card: 'Binary addition, two\'s complement, overflow and shifts, plus floating-point basics: the number-crunching detail behind data representation.',
            lead: 'Under the hood of every computer is binary arithmetic: adding bit patterns, representing negative numbers, catching overflow, and storing very large and very small values.',
            concepts: [
                'Binary addition follows four rules — 0+0=0, 0+1=1, 1+1=0 carry 1, and 1+1+1=1 carry 1 — and overflow occurs when a carry is generated beyond the most significant bit, meaning the fixed word size cannot store the result.',
                'Two\'s complement represents negative integers: invert every bit of the positive value (one\'s complement) and add 1; the most significant bit acts as a sign bit (1 for negative), and an 8-bit word can hold values from −128 to +127.',
                'Overflow also arises when two negative numbers are added and the result underflows below the minimum, or when a positive and negative operand produce a result whose sign contradicts both operands; detecting it lets programs flag errors instead of silently wrapping around.',
                'Binary shifts multiply or divide by powers of two: shifting every bit one place left multiplies by 2, and shifting right divides by 2, with bits shifted beyond the register discarded and zeros shifted in.',
                'Floating-point representation stores a mantissa and an exponent, so the value is mantissa multiplied by 2 raised to the exponent; this trades some precision for a vastly greater range than fixed-point, which keeps the binary point at a set position.',
                'Characters and colours are bit patterns too: ASCII gives 128 7-bit codes while Unicode extends the idea to the scripts of the world, and 24-bit true colour stores red, green and blue as one byte each, giving over 16 million colours.'
            ],
            terms: [
                { t: 'Two\'s complement', d: 'A method of representing signed integers in binary by inverting the bits of the positive value and adding one, allowing subtraction to be done by addition.' },
                { t: 'Overflow', d: 'An error occurring when a calculation produces a result too large or too small for the available number of bits, carrying beyond the most significant bit.' },
                { t: 'Sign bit', d: 'The most significant bit of a signed binary number, 0 for positive and 1 for negative in two\'s complement representation.' },
                { t: 'Binary shift', d: 'Moving every bit in a register left or right, multiplying the value by two for each left shift and dividing by two for each right shift.' },
                { t: 'Mantissa', d: 'The part of a floating-point number holding its significant digits, multiplied by two raised to the exponent.' },
                { t: 'Exponent', d: 'The part of a floating-point number that scales the mantissa by a power of two, setting the magnitude and range of the value.' },
                { t: 'Fixed-point representation', d: 'A method of storing real numbers with the binary point at a fixed, agreed position within the bits.' },
                { t: 'Unicode', d: 'A character-encoding standard assigning a unique code to the characters of the world\'s scripts, extending beyond ASCII\'s 7 bits.' }
            ],
            tip: 'Show working in binary questions: write the numbers one above the other, mark the carry between columns, and state the overflow check (a carry beyond the most significant bit); method marks are awarded even when the final value slips.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Using two\'s complement, show how −5 is represented in 8 bits, and state the largest positive value an 8-bit two\'s complement register can hold.',
                    ans: 'Write +5 as 00000101 (1). Invert every bit to get 11111010 (1). Add one to get 11111011, which represents −5 (1). The largest positive value is 01111111 = +127 (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Explain why two\'s complement is preferred to sign-and-magnitude for arithmetic, and describe one situation that causes overflow in an 8-bit register.',
                    ans: 'Sign-and-magnitude has two representations of zero, 00000000 and 10000000, which complicates comparison and processor hardware (1). Two\'s complement gives a single representation of zero and lets subtraction be performed by adding the two\'s complement of the subtrahend, so one adder circuit handles both operations (1). The sign bit behaves naturally in arithmetic with no special rule for negative numbers, simplifying the processor\'s design (1). Overflow example: adding two large positives such as 100 + 100 gives 200, beyond +127, producing a carry beyond the sign bit and a wrong negative result (1). Equally, adding two large negatives such as −100 + −100 underflows below −128; in both cases the result\'s sign contradicts the operands\' signs, flagging the error (1).'
                }
            ]
        },
        {
            n: 16,
            title: 'Structured Programming',
            card: 'Procedures, functions, parameter passing, local and global variables, trace tables and validation: writing and testing structured programs.',
            lead: 'Well-built programs are assembled from tested blocks: modules with clear interfaces, controlled data passing and disciplined testing make code readable, reliable and easy to fix.',
            concepts: [
                'Structured programming decomposes a problem into modules — procedures and functions — each with one clear purpose, so code is easier to write, test, debug and reuse.',
                'A procedure performs a task and returns no value to the calling code, while a function returns a single value; in CAIE pseudocode, DECLARE FUNCTION names the module and RETURN sends the value back.',
                'Parameters pass data into and out of modules through the module header: the value passed in is called the argument, and the module uses the parameter names defined for it, keeping each module\'s internal workings hidden from the rest of the program.',
                'Local variables are declared inside a module and exist only while it runs, protecting other modules from interference; global variables are visible everywhere, which is convenient but risky because any module can change them, making bugs harder to trace.',
                'Trace tables are the standard exam tool for dry-running pseudocode: list every variable and condition, then step row by row recording values at each iteration, to predict output and find logic errors before coding.',
                'Testing validates a program against its specification with normal, boundary and erroneous data: normal data should be accepted, boundary data tests the extreme valid values, and erroneous data should be rejected by validation checks such as range, type and length checks.'
            ],
            terms: [
                { t: 'Procedure', d: 'A named block of code that performs a specific task; it is called by name and returns no value to the calling program.' },
                { t: 'Function', d: 'A named block of code that performs a task and returns a single value to the calling program.' },
                { t: 'Parameter', d: 'A variable declared in a module header through which data is passed into or out of a procedure or function.' },
                { t: 'Argument', d: 'The actual value supplied to a parameter when a procedure or function is called.' },
                { t: 'Local variable', d: 'A variable declared inside a module, accessible only within that module and destroyed when the module ends.' },
                { t: 'Global variable', d: 'A variable declared at program level, accessible from every module in the program.' },
                { t: 'Trace table', d: 'A systematic dry run of an algorithm recording the changing values of variables and conditions at each step, used to check logic and find errors.' },
                { t: 'Validation', d: 'The automated checking that input data is sensible and within allowed limits, e.g. range, type and length checks, before it is accepted.' }
            ],
            tip: 'In trace-table questions, add a row for every iteration and fill in every variable on every row, even where unchanged; the mark scheme awards a mark per correct row, and gaps cost marks even when the final output is right.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'State the difference between a procedure and a function, and between a local and a global variable.',
                    ans: 'A procedure performs a task and returns no value, while a function returns a single value to the caller (1). Example: a procedure might display a menu, while a function such as CalculateTotal returns a number (1). A local variable is declared inside a module and exists only while it runs (1). A global variable is declared at program level and is visible to every module (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Explain how parameter passing and modular design make a program easier to test and maintain than one long sequence using global variables.',
                    ans: 'Modules divide the program into self-contained units with one clear purpose, so each can be tested separately with its own test data (1). Trace tables can be built module by module, isolating a fault to one small section instead of dry-running the whole program (1). Parameters pass data through a defined interface, so a module\'s behaviour is predictable and documented (1). Local variables protect each module from interference, whereas global variables can be changed anywhere, creating side effects that are hard to trace (1). Maintenance is safer: a change inside one module need not affect others as long as the interface stays the same, reducing regression bugs (1).'
                }
            ]
        },
        {
            n: 17,
            title: 'Network Protocols and the Internet in Depth',
            card: 'How data really travels: TCP/IP layers, encapsulation, packet switching, TCP versus UDP, DNS and the journey of a web request.',
            lead: 'A single web request crosses the world in milliseconds by cooperating protocols: layered rules, addressed packets and routers that find the best path.',
            concepts: [
                'Protocols are agreed rules for communication, and TCP/IP is organised in layers — application (HTTP, HTTPS, FTP, SMTP), transport (TCP, UDP), internet (IP) and link — so each layer can change independently as long as its interface with the neighbours stays the same.',
                'As a message is sent it is encapsulated at each layer: application data is wrapped in a TCP segment with port and sequence numbers, then an IP packet with source and destination IP addresses, then a frame with MAC addresses for the local link; the receiving machine unwraps them in reverse.',
                'Packet switching splits data into labelled packets routed independently across networks and reassembled at the destination; routers read destination IP addresses, choose best paths, and packets may take different routes and arrive out of order.',
                'TCP provides reliable, ordered delivery: it numbers segments, acknowledges receipt and retransmits missing ones, suiting web and email, while UDP is connectionless and faster but unreliable, suiting live streaming and online gaming where resending late data is pointless.',
                'The DNS (Domain Name System) translates human-readable domain names into IP addresses through a hierarchy of root, top-level-domain and authoritative name servers, so browsers can locate servers without users memorising numbers.',
                'End to end, a browser request is encoded and sent as packets via the router, ISP and backbone to the web server, whose response returns in packets that the browser renders; MAC addresses serve the local hop while IP addresses identify the source and destination across the whole journey.'
            ],
            terms: [
                { t: 'Protocol', d: 'An agreed set of rules that allows devices to communicate, defining the format, timing and error handling of messages.' },
                { t: 'TCP/IP', d: 'The suite of communication protocols that organises internet communication in layers, including TCP for reliable transport and IP for addressing and routing.' },
                { t: 'Encapsulation', d: 'The wrapping of data with header information at each TCP/IP layer as it travels down the stack, unwrapped in reverse at the receiving end.' },
                { t: 'Packet switching', d: 'A method of transmitting data in addressed packets that are routed independently across a network and reassembled in order at the destination.' },
                { t: 'Router', d: 'A device that forwards packets between networks by reading destination IP addresses and choosing the best available path.' },
                { t: 'TCP', d: 'Transmission Control Protocol: a connection-oriented protocol providing reliable, ordered, error-checked delivery using sequence numbers and acknowledgements.' },
                { t: 'UDP', d: 'User Datagram Protocol: a fast, connectionless transport protocol with no delivery guarantees, used for streaming and gaming.' },
                { t: 'DNS', d: 'Domain Name System: the hierarchical service that translates domain names into IP addresses so users need not remember numeric addresses.' }
            ],
            tip: 'Learn one example protocol per layer — HTTP at application, TCP or UDP at transport, IP at internet — then describe a web request in layers: DNS lookup, TCP connection, HTTP request, packetised, routed, reassembled; layered answers score the analysis marks.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Name the system that translates domain names into IP addresses, and state one difference between TCP and UDP.',
                    ans: 'The Domain Name System (DNS) translates domain names into IP addresses (1). TCP is connection-oriented, numbering and acknowledging segments so delivery is reliable and ordered (1). UDP is connectionless with no acknowledgements, so it is faster but unreliable (1). Example: TCP for web and email, UDP for streaming or gaming (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Describe the journey of a web page request from a browser to a server and back, referring to DNS, TCP, IP addresses, routers and packet switching.',
                    ans: 'The browser asks a DNS server to translate the domain name into the web server\'s IP address (1). It opens a TCP connection with the server, a handshake ensuring both sides are ready for reliable, ordered exchange (1). The HTTP request is encapsulated at each layer into a TCP segment, an IP packet with source and destination addresses, and a frame with MAC addresses for the local link (1). Routers read the destination IP address and forward the packets across networks along best paths; packets may travel by different routes, which is packet switching (1). The server responds with the page split into packets; TCP reassembles them in order, retransmitting any that go missing, and the browser renders the result (1).'
                }
            ]
        },
        {
            n: 18,
            title: 'Ethical, Legal and Environmental Issues in Computing',
            card: 'Data protection law, computer misuse, intellectual property, e-waste and energy use: the legal and environmental duties that come with computing.',
            lead: 'Computing touches every life, so it is regulated: laws protect personal data and punish hacking and piracy, while the industry grapples with the environmental cost of its devices and data centres.',
            concepts: [
                'Data protection laws such as the GDPR require personal data to be processed lawfully, only for stated purposes, kept accurate and secure, and not retained longer than necessary; organisations must comply and can be investigated and fined by a data protection authority.',
                'Individuals hold rights over their personal data: to be told what is held, to access it, to have errors corrected and, in many frameworks, to erasure; breaches can bring heavy fines, so firms encrypt data, restrict access and audit their systems.',
                'Computer misuse legislation criminalises unauthorised access to computer material, access with intent to commit further offences, and unauthorised modification such as deploying malware; copyright law protects software and media, and licences define what users may legally do.',
                'Intellectual property in computing includes copyright for code, music and images, patents for inventions, and trademarks for names and logos; piracy, the copying or distribution of material without a licence, deprives creators of income and is a criminal offence.',
                'Computing carries environmental costs: manufacturing chips and devices uses rare-earth metals, water and energy; data centres consume large amounts of electricity for power and cooling; and discarded e-waste releases toxic metals such as lead and mercury if dumped in landfill.',
                'Sustainability responses include energy-efficient processors and virtualisation, renewable-powered data centres, extending device lifespans through repair and refurbishment, and recycling e-waste to recover metals, following reduce, reuse, recycle principles across the product life cycle.'
            ],
            terms: [
                { t: 'Data protection', d: 'Laws controlling how organisations collect, store, use and share personal data, requiring lawful, fair, secure and purpose-limited processing.' },
                { t: 'GDPR', d: 'The General Data Protection Regulation, a law giving individuals rights over their personal data and imposing large fines for breaches.' },
                { t: 'Computer misuse', d: 'Illegal acts involving unauthorised access to or modification of computer systems and data, criminalised under computer misuse legislation.' },
                { t: 'Copyright', d: 'The legal right of creators to control the copying and distribution of their original work, including software, music, images and text.' },
                { t: 'Software licence', d: 'A legal agreement defining how software may be used, copied and distributed, such as proprietary, open-source, shareware or freeware licences.' },
                { t: 'Open-source software', d: 'Software whose source code is freely available to view, modify and distribute under its licence, e.g. Linux and LibreOffice.' },
                { t: 'E-waste', d: 'Discarded electronic devices and components, which can release toxic metals into the environment if not recycled responsibly.' },
                { t: 'Carbon footprint', d: 'The total greenhouse-gas emissions caused directly and indirectly by an activity, such as manufacturing and running computing devices and data centres.' }
            ],
            tip: 'Legal-issues questions follow a model: state the law or right, describe the obligation or offence, then apply it to the scenario, e.g. a firm keeping customer data after use breaches the purpose and retention principles; applied answers sit in the top band.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'State two rights individuals have under data protection law and one example of computer misuse.',
                    ans: 'Any two rights: to be told what data is held about them, to access their data, to have errors corrected, to object to processing or to request erasure (1) (1). Computer misuse example: hacking into an account without authorisation, spreading malware, or unauthorised modification of data (1). Organisations must keep personal data secure and use it only for stated purposes (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Evaluate the environmental impact of computing, discussing the costs of devices and data centres and the measures that reduce them, reaching a judgement.',
                    ans: 'Manufacturing devices uses rare-earth metals, water and energy, and mining and refining them damage habitats and generate pollution (1). Billions of devices become e-waste, and dumped in landfill they leak toxic lead and mercury into soil and water (1). Data centres consume large amounts of electricity for servers and cooling, contributing to carbon emissions where the power is fossil-fuelled (1). Measures include renewable-powered data centres, energy-efficient processors and virtualisation, which runs more work on fewer machines (1). Extending device lifespans through repair and refurbishment, and recycling e-waste to recover metals, cuts both mining and landfill (1). Conclusion: computing\'s footprint is real but manageable, and the industry and consumers share responsibility for reducing, reusing and recycling (1).'
                }
            ]
        }
    ]
};
