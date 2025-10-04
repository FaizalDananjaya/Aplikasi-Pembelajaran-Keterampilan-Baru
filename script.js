// Data Dummy Kursus
const courses = [
    {
        id: 1,
        title: "JavaScript Fundamentals",
        description: "Master the basics of JavaScript programming from scratch",
        category: "programming",
        duration: "8 hours",
        difficulty: "Beginner",
        instructor: "Sarah Johnson",
        rating: 4.8,
        students: 1250,
        lessons: [
            { id: 1, title: "Introduction to JavaScript", duration: "45 min", content: "Learn what JavaScript is and why it is important" },
            { id: 2, title: "Variables and Data Types", duration: "60 min", content: "Understanding variables, constants, and data types" },
            { id: 3, title: "Functions and Scope", duration: "90 min", content: "Master JavaScript functions and scope concepts" }
        ],
        quiz: {
            questions: [
                { question: "What is JavaScript primarily used for?", options: ["Server-side programming", "Client-side scripting", "Database management", "Network configuration"], correct: 1 },
                { question: "Which keyword is used to declare a constant?", options: ["var", "let", "const", "define"], correct: 2 }
            ]
        }
    },
    {
        id: 2,
        title: "UI/UX Design Principles",
        description: "Learn fundamental design principles for creating beautiful interfaces",
        category: "design",
        duration: "6 hours",
        difficulty: "Intermediate",
        instructor: "Michael Chen",
        rating: 4.9,
        students: 890,
        lessons: [
            { id: 1, title: "Color Theory Basics", duration: "30 min", content: "Understanding color psychology and combinations" },
            { id: 2, title: "Typography Fundamentals", duration: "45 min", content: "Master the art of typography in design" }
        ],
        quiz: {
            questions: [
                { question: "What is the primary color model for digital design?", options: ["RGB", "CMYK", "Pantone", "RAL"], correct: 0 },
                { question: "Which font type is best for body text?", options: ["Display", "Serif", "Sans-serif", "Script"], correct: 2 }
            ]
        }
    },
    {
        id: 3,
        title: "Italian Cooking Masterclass",
        description: "Learn authentic Italian cooking techniques and recipes",
        category: "cooking",
        duration: "12 hours",
        difficulty: "Beginner",
        instructor: "Chef Marco Rossi",
        rating: 4.7,
        students: 2100,
        lessons: [
            { id: 1, title: "Pasta Making Basics", duration: "90 min", content: "Master the art of making fresh pasta from scratch" },
            { id: 2, title: "Italian Sauces", duration: "60 min", content: "Learn to make authentic Italian sauces" }
        ],
        quiz: {
            questions: [
                { question: "What is the main ingredient in traditional pasta?", options: ["Rice flour", "Semolina flour", "All-purpose flour", "Corn flour"], correct: 1 },
                { question: "Which herb is essential in Italian cooking?", options: ["Cilantro", "Basil", "Mint", "Parsley"], correct: 1 }
            ]
        }
    },
    {
        id: 4,
        title: "Photography Fundamentals",
        description: "Master the basics of photography and camera settings",
        category: "photography",
        duration: "10 hours",
        difficulty: "Beginner",
        instructor: "Emma Wilson",
        rating: 4.6,
        students: 750,
        lessons: [
            { id: 1, title: "Camera Settings", duration: "60 min", content: "Understanding aperture, shutter speed, and ISO" },
            { id: 2, title: "Composition Rules", duration: "45 min", content: "Master the rule of thirds and other composition techniques" }
        ],
        quiz: {
            questions: [
                { question: "What does ISO control in photography?", options: ["Aperture", "Shutter speed", "Sensor sensitivity", "Focus"], correct: 2 },
                { question: "What is the rule of thirds?", options: ["A focusing technique", "A composition guideline", "A lighting setup", "A camera setting"], correct: 1 }
            ]
        }
    }
];

// User Progress Storage
let userProgress = JSON.parse(localStorage.getItem('userProgress')) || {
    activeCourses: [],
    totalScore: 0,
    certificates: 0,
    completedLessons: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadCourses();
    updateDashboard();
    setupEventListeners();
});

// Load Courses
function loadCourses() {
    const courseGrid = document.getElementById('courseGrid');
    courseGrid.innerHTML = '';
    
    courses.forEach(course => {
        const courseCard = createCourseCard(course);
        courseGrid.appendChild(courseCard);
    });
}

// Create Course Card
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
        <div class="course-image">
            <i class="fas fa-${getCategoryIcon(course.category)}"></i>
        </div>
        <div class="course-content">
            <h3 class="course-title">${course.title}</h3>
            <p class="course-description">${course.description}</p>
            <div class="course-meta">
                <span class="course-instructor">${course.instructor}</span>
                <span class="course-rating">⭐ ${course.rating}</span>
            </div>
            <button class="course-button" onclick="showCourseDetail(${course.id})">Lihat Detail</button>
        </div>
    `;
    return card;
}

// Get Category Icon
function getCategoryIcon(category) {
    const icons = {
        programming: 'code',
        design: 'palette',
        cooking: 'utensils',
        photography: 'camera'
    };
    return icons[category] || 'book';
}

// Show Course Detail
function showCourseDetail(courseId) {
    const course = courses.find(c => c.id === courseId);
    const modal = document.getElementById('courseModal');
    const detail = document.getElementById('courseDetail');
    
    detail.innerHTML = `
        <h2>${course.title}</h2>
        <p><strong>Instruktur:</strong> ${course.instructor}</p>
        <p><strong>Durasi:</strong> ${course.duration}</p>
        <p><strong>Rating:</strong> ${course.rating}/5</p>
        <p><strong>Deskripsi:</strong> ${course.description}</p>
        
        <h3>Daftar Pelajaran:</h3>
        <div class="lessons-list">
            ${course.lessons.map(lesson => `
                <div class="lesson-item">
                    <h4>${lesson.title}</h4>
                    <p>Durasi: ${lesson.duration}</p>
                    <p>${lesson.content}</p>
                    <button onclick="startLesson(${course.id}, ${lesson.id})">Mulai Pelajaran</button>
                </div>
            `).join('')}
        </div>
        
        <button onclick="startQuiz(${course.id})" class="quiz-button">Mulai Quiz</button>
    `;
    
    modal.style.display = 'block';
}

// Start Quiz
function startQuiz(courseId) {
    const course = courses.find(c => c.id === courseId);
    const modal = document.getElementById('quizModal');
    const content = document.getElementById('quizContent');
    
    let currentQuestion = 0;
    let score = 0;
    
    function showQuestion() {
        const question = course.quiz.questions[currentQuestion];
        content.innerHTML = `
            <h2>Quiz: ${course.title}</h2>
            <p>Pertanyaan ${currentQuestion + 1} dari ${course.quiz.questions.length}</p>
            <h3>${question.question}</h3>
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <label>
                        <input type="radio" name="answer" value="${index}">
                        ${option}
                    </label>
                `).join('')}
            </div>
            <button onclick="submitAnswer()">Jawab</button>
        `;
    }
    
    window.submitAnswer = function() {
        const selected = document.querySelector('input[name="answer"]:checked');
        if (!selected) {
            alert('Pilih jawaban terlebih dahulu!');
            return;
        }
        
        const answer = parseInt(selected.value);
        const question = course.quiz.questions[currentQuestion];
        
        if (answer === question.correct) {
            score++;
        }
        
        currentQuestion++;
        
        if (currentQuestion < course.quiz.questions.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    };
    
    function finishQuiz() {
        const percentage = (score / course.quiz.questions.length) * 100;
        content.innerHTML = `
            <h2>Quiz Selesai!</h2>
            <p>Skor Anda: ${score}/${course.quiz.questions.length} (${percentage.toFixed(0)}%)</p>
            <button onclick="closeQuizModal()">Selesai</button>
        `;
        
        // Update user progress
        userProgress.totalScore += score;
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        updateDashboard();
    }
    
    showQuestion();
    modal.style.display = 'block';
}

// Filter Courses
function filterCourses(category) {
    const courseGrid = document.getElementById('courseGrid');
    courseGrid.innerHTML = '';
    
    const filteredCourses = category === 'all' 
        ? courses 
        : courses.filter(course => course.category === category);
    
    filteredCourses.forEach(course => {
        const courseCard = createCourseCard(course);
        courseGrid.appendChild(courseCard);
    });
}

// Show Courses Section
function showCourses() {
    document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
}

// Update Dashboard
function updateDashboard() {
    document.getElementById('activeCourses').textContent = userProgress.activeCourses.length;
    document.getElementById('totalScore').textContent = userProgress.totalScore;
    document.getElementById('certificates').textContent = userProgress.certificates;
}

// Close Modals
function closeModal() {
    document.getElementById('courseModal').style.display = 'none';
}

function closeQuizModal() {
    document.getElementById('quizModal').style.display = 'none';
}

// Setup Event Listeners
function setupEventListeners() {
    // Close modals when clicking outside
    window.onclick = function(event) {
        const courseModal = document.getElementById('courseModal');
        const quizModal = document.getElementById('quizModal');
        
        if (event.target === courseModal) {
            closeModal();
        }
        if (event.target === quizModal) {
            closeQuizModal();
        }
    };
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href').substring(1);
        
        if (target === 'dashboard') {
            document.getElementById('dashboard').style.display = 'block';
            document.getElementById('courses').style.display = 'none';
            document.getElementById('home').style.display = 'none';
        } else if (target === 'courses') {
            document.getElementById('courses').style.display = 'block';
            document.getElementById('dashboard').style.display = 'none';
            document.getElementById('home').style.display = 'block';
        } else {
            document.getElementById('dashboard').style.display = 'none';
            document.getElementById('courses').style.display = 'block';
            document.getElementById('home').style.display = 'block';
        }
    });
});
