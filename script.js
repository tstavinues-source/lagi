document.addEventListener('DOMContentLoaded', () => {
    // ---- Bagian 1: Data Soal dan Struktur SRS ----
    const quizData =;

    // ---- Bagian 2: Inisialisasi Aplikasi ----
    let currentQuiz =;
    let score = 0;
    let currentQuestionIndex = 0;
    
    const questionBox = document.getElementById('question-box');
    const questionText = document.getElementById('question-text');
    const exampleSentence = document.getElementById('example-sentence');
    const optionsContainer = document.getElementById('options-container');
    const optionsButtons = document.querySelectorAll('.option-btn');
    const progressBar = document.getElementById('progress-bar');
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackText = document.getElementById('feedback-text');
    const nextBtn = document.getElementById('next-btn');
    const resultContainer = document.getElementById('result-container');
    const scoreText = document.getElementById('score-text');
    const restartBtn = document.getElementById('restart-btn');
    const quizContainer = document.getElementById('quiz-container');

    function initQuiz() {
        // Logika untuk memilih kartu yang perlu diulas hari ini berdasarkan SRS
        const today = new Date();
        currentQuiz = quizData.filter(item => {
            if (!item.lastReviewed) return true;
            const nextReviewDate = new Date(item.lastReviewed);
            nextReviewDate.setDate(nextReviewDate.getDate() + item.interval);
            return nextReviewDate <= today;
        });
        
        // Acak urutan kuis
        currentQuiz.sort(() => Math.random() - 0.5);

        if (currentQuiz.length === 0) {
            questionText.textContent = "Tidak ada kartu untuk diulas hari ini. Coba lagi besok!";
            optionsContainer.innerHTML = '';
            return;
        }

        score = 0;
        currentQuestionIndex = 0;
        quizContainer.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        renderQuestion();
    }

    // ---- Bagian 3: Logika Generasi Soal dan Antarmuka ----
    function renderQuestion() {
        if (currentQuestionIndex >= currentQuiz.length) {
            showResult();
            return;
        }

        const currentItem = currentQuiz[currentQuestionIndex];
        const questionType = Math.random() < 0.5? 'kanji' : 'vocabulary';

        // Reset tampilan
        optionsButtons.forEach(btn => {
            btn.classList.remove('correct', 'incorrect');
            btn.disabled = false;
        });
        feedbackContainer.classList.add('hidden');
        nextBtn.classList.add('hidden');
        exampleSentence.classList.add('hidden');

        let questionStem;
        let correctAnswer;
        
        if (questionType === 'kanji') {
            questionStem = `Pilih kanji yang benar untuk bacaan ini: ${currentItem.kana}`;
            correctAnswer = currentItem.kanji;
        } else {
            questionStem = `Pilih arti yang benar untuk: ${currentItem.kanji}`;
            correctAnswer = currentItem.arti;
            exampleSentence.textContent = `Contoh kalimat: ${currentItem.example.replace(currentItem.kanji, '☐')}`;
            exampleSentence.classList.remove('hidden');
        }

        questionText.textContent = questionStem;

        // Buat distractors (pilihan yang salah tapi masuk akal)
        const allOptions = [correctAnswer];
        const allPossibleAnswers = quizData.map(item => questionType === 'kanji'? item.kanji : item.arti);

        while (allOptions.length < 4) {
            const randomDistractor = allPossibleAnswers[Math.floor(Math.random() * allPossibleAnswers.length)];
            // Pastikan distractor berbeda dari jawaban benar dan tidak duplikat
            if (!allOptions.includes(randomDistractor) && randomDistractor!== correctAnswer) {
                allOptions.push(randomDistractor);
            }
        }
        
        // Acak posisi jawaban benar
        allOptions.sort(() => Math.random() - 0.5);

        optionsButtons.forEach((btn, index) => {
            btn.textContent = allOptions[index];
            btn.onclick = () => handleAnswer(btn, allOptions[index] === correctAnswer);
        });

        updateProgressBar();
    }

    function updateProgressBar() {
        const progress = (currentQuestionIndex / currentQuiz.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // ---- Bagian 4: Logika Jawaban dan Umpan Balik ----
    function handleAnswer(button, isCorrect) {
        optionsButtons.forEach(btn => btn.disabled = true);
        
        const currentItem = currentQuiz[currentQuestionIndex];
        const grade = isCorrect? 5 : 0; // Sederhanakan grade untuk prototipe: 5=benar, 0=salah

        if (isCorrect) {
            button.classList.add('correct');
            feedbackText.textContent = `Jawaban Anda benar! Arti: ${currentItem.arti}`;
            score++;
        } else {
            button.classList.add('incorrect');
            feedbackText.textContent = `Salah. Jawaban yang benar adalah "${currentItem.arti}" (${currentItem.kanji}).`;
            // Sorot jawaban yang benar
            optionsButtons.forEach(btn => {
                const questionType = questionText.textContent.includes('bacaan ini')? 'kanji' : 'vocabulary';
                const correctAnswerText = questionType === 'kanji'? currentItem.kanji : currentItem.arti;
                if (btn.textContent === correctAnswerText) {
                    btn.classList.add('correct');
                }
            });
        }

        // Terapkan logika SRS dasar
        updateSRS(currentItem, grade);
        currentItem.lastReviewed = new Date();

        feedbackContainer.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
    }

    function showResult() {
        quizContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        scoreText.textContent = `${score} dari ${currentQuiz.length}`;
        progressBar.style.width = '100%';
    }

    // ---- Bagian 5: Implementasi SRS Sederhana (SM-2) ----
    function updateSRS(item, grade) {
        if (grade >= 3) { // Grade 3-5 dianggap benar
            item.repetition++;
            if (item.repetition === 1) {
                item.interval = 1;
            } else if (item.repetition === 2) {
                item.interval = 6;
            } else {
                item.interval = Math.round(item.interval * item.efactor);
            }
        } else { // Grade 0-2 dianggap salah
            item.repetition = 0;
            item.interval = 1;
        }

        // Penyesuaian E-factor (sesuai SM-2)
        const efactorDelta = 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);
        item.efactor += efactorDelta;
        if (item.efactor < 1.3) {
            item.efactor = 1.3;
        }
    }

    // ---- Bagian 6: Event Listeners ----
    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        renderQuestion();
    });

    restartBtn.addEventListener('click', () => {
        initQuiz();
    });

    // Mulai kuis saat halaman dimuat
    initQuiz();
});