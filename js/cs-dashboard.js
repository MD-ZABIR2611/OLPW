const chapters = [
            { id: "cs-chapter-01", num: "01", title: "Computer Systems", desc: "Hardware, software, CPU architecture, Von Neumann, Fetch-Decode-Execute cycle, registers, performance factors." },
            { id: "cs-chapter-02", num: "02", title: "Data Representation", desc: "Binary, hexadecimal, ASCII, Unicode, image and sound representation, compression, file size calculations." },
            { id: "cs-chapter-03", num: "03", title: "Communication & Networks", desc: "LAN, WAN, topologies, protocols, TCP/IP, MAC/IP addresses, packet switching, DNS." },
            { id: "cs-chapter-04", num: "04", title: "Cybersecurity & Digital Security", desc: "Malware, phishing, social engineering, firewalls, encryption, access rights, security policies." },
            { id: "cs-chapter-05", num: "05", title: "Operating Systems & Software", desc: "OS functions, GUI vs CLI, memory management, utility software, system vs application software." },
            { id: "cs-chapter-06", num: "06", title: "Algorithms & Problem Solving", desc: "Computational thinking, decomposition, abstraction, pseudocode, flowcharts, trace tables." },
            { id: "cs-chapter-07", num: "07", title: "Programming Fundamentals", desc: "Variables, data types, operators, sequence, selection (IF/CASE), iteration (FOR/WHILE/REPEAT)." },
            { id: "cs-chapter-08", num: "08", title: "Data Structures & File Handling", desc: "Arrays, records, stacks (LIFO), queues (FIFO), linear/binary search, bubble sort, file I/O." },
            { id: "cs-chapter-09", num: "09", title: "Databases & SQL", desc: "DBMS, primary/foreign keys, SQL commands (SELECT, INSERT, UPDATE, DELETE), validation." },
            { id: "cs-chapter-10", num: "10", title: "Web, Internet & Digital Communication", desc: "Internet vs WWW, HTML/CSS/JS, client-server model, DNS, HTTP/HTTPS, cookies, cloud computing." },
            { id: "cs-chapter-11", num: "11", title: "Digital Technology, Ethics & Social Impact", desc: "Digital divide, privacy, copyright, AI, automation, e-waste, environmental impact." },
            { id: "cs-chapter-12", num: "12", title: "Logic, Boolean Algebra & Digital Circuits", desc: "Logic gates (AND, OR, NOT, XOR, NAND, NOR), truth tables, Boolean expressions, logic circuits." },
            { id: "cs-chapter-13", num: "13", title: "Computer Architecture, Storage & Emerging Tech", desc: "RAM/ROM, virtual memory, SSD/HDD, cloud storage, IoT, sensors, actuators, embedded systems." },
            { id: "cs-chapter-14", num: "14", title: "Exam Practice, Programming & Revision", desc: "Mixed-topic questions, algorithm tracing, debugging, timed practice, mock examinations." }
        ];

        // Render Chapter Cards
        const chapterList = document.getElementById('chapterList');
        let completedCount = 0;

        chapters.forEach(ch => {
            const isComplete = localStorage.getItem(ch.id) === 'true';
            if (isComplete) completedCount++;

            const card = document.createElement('a');
            card.href = `cs-chapter${parseInt(ch.num, 10)}.html`;
            card.className = 'chapter-card';
            card.innerHTML = `
                <span class="chap-num">CHAPTER ${ch.num}</span>
                <span class="status-badge ${isComplete ? 'visible' : ''}">COMPLETE</span>
                <h3>${ch.title}</h3>
                <p class="chap-desc">${ch.desc}</p>
                <span class="tag">CORE</span>
            `;
            chapterList.appendChild(card);
        });

        // Update Progress Dashboard
        const percent = Math.round((completedCount / 14) * 100);
        document.getElementById('completedCount').innerText = `${completedCount} / 14`;
        document.getElementById('masteredCount').innerText = completedCount;
        document.getElementById('remainingCount').innerText = 14 - completedCount;
        document.getElementById('progressPercent').innerText = `${percent}%`;
        document.getElementById('progressCircle').style.background = `conic-gradient(var(--accent) ${percent}%, var(--border) ${percent}%)`;

        function toggleMenu() { document.getElementById('navLinks').classList.toggle('active'); }
