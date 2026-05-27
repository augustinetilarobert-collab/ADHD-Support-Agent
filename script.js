const CONDITIONS = {

    overwhelm: [
        'overwhelm',
        'overwhelmed',
        'stress',
        'stressed',
        'panic',
        'panicking',
        'too much',
        'chaos'
    ],

    focus: [
        'focus',
        'focused',
        'distract',
        'distracted',
        'cannot concentrate',
        "can't focus",
        'attention'
    ],

    procrastination: [
        'procrastinate',
        'procrastinating',
        'procrastination',
        "can't start",
        'cannot start',
        'avoiding',
        'lazy',
        'no motivation'
    ],

    lowEnergy: [
        'tired',
        'exhausted',
        'fatigue',
        'fatigued',
        'burnout',
        'burned out',
        'no energy'
    ],

    memory: [
        'forget',
        'forgot',
        "can't remember",
        'memory'
    ],

    deadline: [
        'deadline',
        'due tomorrow',
        'urgent',
        'late',
        'running out of time'
    ],

    overload: [
        'too many tasks',
        'backlog',
        'many assignments',
        'too much work'
    ]
};

/* =========================
   TOOLS
========================= */

const TOOLS = {

    Emotional_Regulation_Tool:
        'Calms and reassures the user before task engagement',

    Task_Breakdown_Tool:
        'Breaks large tasks into smaller manageable steps',

    Focus_Timer_Tool:
        'Provides ADHD-friendly short focus sessions',

    Starter_Step_Tool:
        'Creates one easy starting action',

    Memory_Checklist_Tool:
        'Creates visual memory aids and checklists',

    Energy_Adjustment_Tool:
        'Reduces workload based on fatigue level',

    Deadline_Planner_Tool:
        'Prioritizes urgent tasks',

    Movement_Break_Tool:
        'Suggests movement or sensory breaks',

    Visual_Support_Tool:
        'Uses simplified and visually manageable instructions'
};

/* =========================
   ADHD AGENT
========================= */

class ADHDSupportAgent {

    constructor() {

        this.MAX_OUTPUT_STEPS = 3;

        this.init();
    }

    init() {

        document
            .getElementById('analyzeBtn')
            .addEventListener('click', () => this.analyze());

        document
            .getElementById('userInput')
            .addEventListener('keypress', (e) => {

                if (e.key === 'Enter' && e.ctrlKey) {

                    this.analyze();
                }
            });
    }

    async analyze() {

        const input = document
            .getElementById('userInput')
            .value
            .trim();

        if (!input) return;

        this.showLoading();

        await new Promise(resolve =>
            setTimeout(resolve, 1200)
        );

        const conditions =
            this.detectConditions(input);

        if (conditions.length === 0) {

            this.showError(
                "This assistant supports ADHD-related task and focus challenges only."
            );

            return;
        }

        const stressLevel =
            this.calculateStress(conditions);

        this.updateStressIndicator(stressLevel);

        const tools =
            this.selectTools(conditions, stressLevel);

        const plan =
            this.generatePlan(
                conditions,
                tools,
                stressLevel
            );

        this.displayResults(
            conditions,
            tools,
            plan,
            stressLevel
        );
    }

    /* =========================
       DETECT CONDITIONS
    ========================= */

    detectConditions(input) {

        const detected = [];

        const lower =
            input.toLowerCase();

        Object.entries(CONDITIONS)
            .forEach(([condition, keywords]) => {

                const matches =
                    keywords.filter(keyword =>
                        lower.includes(keyword)
                    );

                if (matches.length > 0) {

                    detected.push({

                        name: condition,

                        confidence:
                            (matches.length /
                                keywords.length) * 100,

                        keywords: matches
                    });
                }
            });

        return detected.sort(
            (a, b) =>
                b.confidence - a.confidence
        );
    }

    /* =========================
       STRESS CALCULATION
    ========================= */

    calculateStress(conditions) {

        let score = 20;

        conditions.forEach(condition => {

            if (
                condition.name === 'overwhelm' ||
                condition.name === 'deadline'
            ) {
                score += 30;
            }

            if (
                condition.name === 'lowEnergy'
            ) {
                score += 20;
            }

            if (
                condition.name === 'overload'
            ) {
                score += 15;
            }
        });

        return Math.min(score, 100);
    }

    /* =========================
       TOOL SELECTION
    ========================= */

    selectTools(conditions, stressLevel) {

        const selected = [];

        /* PRIORITIZE EMOTIONAL REGULATION */

        if (stressLevel >= 70) {

            selected.push(
                'Emotional_Regulation_Tool'
            );
        }

        conditions.forEach(condition => {

            const mapping = {

                overwhelm: [
                    'Task_Breakdown_Tool',
                    'Starter_Step_Tool',
                    'Movement_Break_Tool'
                ],

                focus: [
                    'Focus_Timer_Tool'
                ],

                procrastination: [
                    'Starter_Step_Tool',
                    'Visual_Support_Tool'
                ],

                lowEnergy: [
                    'Energy_Adjustment_Tool',
                    'Movement_Break_Tool'
                ],

                memory: [
                    'Memory_Checklist_Tool'
                ],

                deadline: [
                    'Deadline_Planner_Tool'
                ],

                overload: [
                    'Task_Breakdown_Tool'
                ]
            };

            const tools =
                mapping[condition.name] || [];

            tools.forEach(tool => {

                if (!selected.includes(tool)) {

                    selected.push(tool);
                }
            });
        });

        return selected;
    }

    /* =========================
       PLAN GENERATION
    ========================= */

    generatePlan(
        conditions,
        tools,
        stressLevel
    ) {

        return {

            emotionalSupport:
                tools.includes(
                    'Emotional_Regulation_Tool'
                )
                    ? this.generateEmotionalSupport()
                    : null,

            starterStep:
                this.generateStarterStep(),

            taskBreakdown:
                tools.includes(
                    'Task_Breakdown_Tool'
                )
                    ? this.limitSteps(
                        this.generateTaskBreakdown(),
                        stressLevel
                    )
                    : null,

            focusPlan:
                tools.includes(
                    'Focus_Timer_Tool'
                )
                    ? this.generateFocusPlan(
                        stressLevel
                    )
                    : null,

            movementBreak:
                tools.includes(
                    'Movement_Break_Tool'
                )
                    ? this.generateMovementPlan()
                    : null,

            memoryPlan:
                tools.includes(
                    'Memory_Checklist_Tool'
                )
                    ? this.generateMemoryPlan()
                    : null,

            deadlinePlan:
                tools.includes(
                    'Deadline_Planner_Tool'
                )
                    ? this.generateDeadlinePlan()
                    : null,

            supportiveMessage:
                this.generateSupportiveMessage(
                    conditions,
                    stressLevel
                )
        };
    }

    /* =========================
       OUTPUT LIMITER
    ========================= */

    limitSteps(steps, stressLevel) {

        if (stressLevel >= 70) {

            return steps.slice(0, 2);
        }

        return steps.slice(
            0,
            this.MAX_OUTPUT_STEPS
        );
    }

    /* =========================
       GENERATORS
    ========================= */

    generateEmotionalSupport() {

        return [

            "Pause and take a slow breath.",

            "You do not need to finish everything right now.",

            "We will focus on one small step first."
        ];
    }

    generateStarterStep() {

        return "Open your assignment or notebook and do only ONE small action.";
    }

    generateTaskBreakdown() {

        return [

            "Read the instructions only",

            "Write one simple heading",

            "Complete one small section",

            "Save your progress",

            "Take a short break"
        ];
    }

    generateFocusPlan(stressLevel) {

        if (stressLevel >= 70) {

            return [

                "Use a 3–5 minute focus session",

                "Take a short movement break"
            ];
        }

        return [

            "Use a 5–10 minute timer",

            "Focus on ONE task only",

            "Take a short break after the timer"
        ];
    }

    generateMovementPlan() {

        return [

            "Stand up and stretch",

            "Walk for one minute",

            "Drink water before continuing"
        ];
    }

    generateMemoryPlan() {

        return [

            "Write tasks as a checklist",

            "Keep the checklist visible",

            "Tick completed tasks"
        ];
    }

    generateDeadlinePlan() {

        return [

            "Start with the easiest urgent task",

            "Complete a simple version first",

            "Do not aim for perfection initially"
        ];
    }

    /* =========================
       DYNAMIC SUPPORT MESSAGE
    ========================= */

    generateSupportiveMessage(
        conditions,
        stressLevel
    ) {

        const overwhelmMessages = [

            "You do not need to solve everything at once.",

            "Focus on one small step first. The rest can come later.",

            "Feeling overwhelmed is okay. We will simplify things together.",

            "Pause, breathe, and start small.",

            "One completed step is already progress."
        ];

        const lowEnergyMessages = [

            "You are allowed to rest while still making progress.",

            "Low energy does not mean failure.",

            "Try doing the easiest step first.",

            "Small effort is enough for now.",

            "It is okay to slow down and recharge."
        ];

        const procrastinationMessages = [

            "Starting small is better than waiting for motivation.",

            "You only need to begin with one tiny action.",

            "The first step is often the hardest — and you can do it.",

            "Progress begins with starting, not perfection.",

            "Do not aim for perfect. Aim for possible."
        ];

        const focusMessages = [

            "Focus on only one task right now.",

            "You do not need to multitask.",

            "One task. One timer. One step.",

            "Short focus sessions are still productive.",

            "Your attention deserves manageable steps."
        ];

        const generalMessages = [

            "You are doing better than you think.",

            "Progress takes time, and that is okay.",

            "Be patient with yourself today.",

            "You are not alone in this challenge.",

            "Small progress is still meaningful progress."
        ];

        let selectedPool = generalMessages;

        const conditionNames =
            conditions.map(c => c.name);

        if (conditionNames.includes('overwhelm')) {

            selectedPool = overwhelmMessages;
        }

        else if (conditionNames.includes('lowEnergy')) {

            selectedPool = lowEnergyMessages;
        }

        else if (conditionNames.includes('procrastination')) {

            selectedPool = procrastinationMessages;
        }

        else if (conditionNames.includes('focus')) {

            selectedPool = focusMessages;
        }

        if (stressLevel >= 80) {

            selectedPool = [

                "Take things slowly. You only need one small step right now.",

                "You are safe. Pause and focus on one manageable action.",

                "Your well-being matters more than rushing everything.",

                "It is okay to stop briefly and regulate yourself first."
            ];
        }

        const randomIndex =
            Math.floor(Math.random() * selectedPool.length);

        return selectedPool[randomIndex];
    }

    /* =========================
       UI
    ========================= */

    showLoading() {

        document
            .getElementById('loading')
            .classList
            .remove('hidden');

        document
            .getElementById('outputContainer')
            .classList
            .add('hidden');

        document
            .getElementById('stressIndicator')
            .classList
            .add('hidden');
    }

    updateStressIndicator(level) {

        const fill =
            document.getElementById('stressFill');

        const label =
            document.getElementById('stressLabel');

        fill.style.width = level + '%';

        label.textContent =
            `Stress Level: ${level}%`;

        document
            .getElementById('stressIndicator')
            .classList
            .remove('hidden');
    }

    showError(message) {

        document
            .getElementById('loading')
            .classList
            .add('hidden');

        const output =
            document.getElementById('outputContainer');

        output.innerHTML = `
            <div class="output-section">
                <h3>⚠️ Unsupported Query</h3>
                <p>${message}</p>
            </div>
        `;

        output.classList.remove('hidden');
    }

    displayResults(
        conditions,
        tools,
        plan,
        stressLevel
    ) {

        document
            .getElementById('loading')
            .classList
            .add('hidden');

        const output =
            document.getElementById('outputContainer');

        output.innerHTML =
            this.createOutputHTML(
                conditions,
                tools,
                plan,
                stressLevel
            );

        output.classList.remove('hidden');
    }

    /* =========================
       HTML OUTPUT
    ========================= */

    createOutputHTML(
        conditions,
        tools,
        plan,
        stressLevel
    ) {

        return `

        <div class="output-section reasoning-section">

            <h3>🧠 AI Reasoning</h3>

            <ul>

                <li>
                    Detected ${conditions.length}
                    ADHD-related condition(s)
                </li>

                <li>
                    Stress level assessed:
                    ${stressLevel}%
                </li>

                <li>
                    Primary condition:
                    ${conditions[0]?.name}
                </li>

                <li>
                    Emotional regulation priority:
                    ${stressLevel >= 70 ? 'HIGH' : 'NORMAL'}
                </li>

            </ul>

        </div>

        <div class="output-section tools-section">

            <h3>🔧 Selected Tools</h3>

            <ul>

                ${tools.map(tool => `
                    <li>
                        ${TOOLS[tool]}
                    </li>
                `).join('')}

            </ul>

        </div>

        ${plan.emotionalSupport ? `

        <div class="output-section">

            <h3>🌿 Emotional Regulation</h3>

            <ul>
                ${plan.emotionalSupport.map(item =>
            `<li>${item}</li>`
        ).join('')}
            </ul>

        </div>

        ` : ''}

        <div class="output-section">

            <h3>⚡ Starter Step</h3>

            <p>
                ${plan.starterStep}
            </p>

        </div>

        ${plan.taskBreakdown ? `

        <div class="output-section">

            <h3>🧩 Task Breakdown</h3>

            <ul>
                ${plan.taskBreakdown.map(item =>
            `<li>${item}</li>`
        ).join('')}
            </ul>

        </div>

        ` : ''}

        ${plan.focusPlan ? `

        <div class="output-section">

            <h3>⏱ Focus Plan</h3>

            <ul>
                ${plan.focusPlan.map(item =>
            `<li>${item}</li>`
        ).join('')}
            </ul>

        </div>

        ` : ''}

        ${plan.movementBreak ? `

        <div class="output-section">

            <h3>🚶 Movement Break</h3>

            <ul>
                ${plan.movementBreak.map(item =>
            `<li>${item}</li>`
        ).join('')}
            </ul>

        </div>

        ` : ''}

        ${plan.memoryPlan ? `

        <div class="output-section">

            <h3>✅ Memory Checklist</h3>

            <ul>
                ${plan.memoryPlan.map(item =>
            `<li>${item}</li>`
        ).join('')}
            </ul>

        </div>

        ` : ''}

        ${plan.deadlinePlan ? `

        <div class="output-section">

            <h3>📅 Deadline Plan</h3>

            <ul>
                ${plan.deadlinePlan.map(item =>
            `<li>${item}</li>`
        ).join('')}
            </ul>

        </div>

        ` : ''}

        <div class="output-section">

            <h3>💬 Support Message</h3>

            <p>${plan.supportiveMessage}</p>

        </div>
        `;
    }
}

document.addEventListener(
    'DOMContentLoaded',
    () => {
        new ADHDSupportAgent();
    }
);