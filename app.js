const express = require('express');
const OpenAI = require('openai');
const bodyparser = require('body-parser');
require('dotenv').config({path: './.env'});
const app = express();
app.use(express.json());
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyparser.urlencoded({extended: false}));

const openai=new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/getAnketaPage', (req, res) => {
    const msg = req.query.message ? JSON.parse(decodeURIComponent(req.query.message)) : null;
    res.render('anketa', {msg: msg})
})
app.get('/getGrammaPage', (req, res) => {
    res.render('grammatika/grammatika')
})
app.get('/questions', (req, res) => {
    const msg = req.query.message ? JSON.parse(decodeURIComponent(req.query.message)) : null;
    res.render('grammatika/questions', {msg: msg})
})
app.post('/getResponseFromGramma', async (req, res) => {
    const answers = req.body;
    let messageContent = `
        1. Укажите форму глагола в будущем времени: "Я (читать) книгу": Правильный ответ: Буду читать. Мой ответ: (${answers.q1})			
        2. Какое слово лишнее?: Правильный ответ: Бегать. Мой ответ: (${answers.q2})
        3. Укажите правильный вариант множественного числа существительного "гусь": Правильный ответ: Гуси. Мой ответ: (${answers.q3})		
        4. Какое слово в предложении является наречием: "Мы быстро бежали к морю"?: Правильный ответ: Быстро. Мой ответ: (${answers.q4})		
        5. Выберите правильный предлог: "Я иду _ магазин" Правильный ответ: В. Мой ответ:: (${answers.q5})
        6. Какой падеж у слова "друзья" в предложении: "Я подарил подарок друзьям"?: Правильный ответ: Дательный. Мой ответ: (${answers.q6})
        7. Какое слово является причастием: "Видя опасность, он отступил"?: Правильный ответ: Видя. Мой ответ: (${answers.q7})
        8. Укажите форму прошедшего времени глагола "бежать": Правильный ответ: Бежал. Мой ответ: (${answers.q8})
        9. В каком предложении допущена ошибка?: Правильный ответ: Они пошли в кино в суботу.. Мой ответ: (${answers.q9})
        10. Какое из данных слов является существительным?: Правильный ответ: Город. Мой ответ: (${answers.q10})
        подсчитай, на сколько вопросов я ответил правильно, проверь ответы очень внимательно, если мой ответ не совподает ответом соответствующего вопроса
        то ответ неправильный, и выводи результат как в примере, 10/10 или 7/10 и т.д
        и дай 3 советы по грамматике более подробно но не слишком больше полагаясь на мои ответы
    `;

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{"role":"user", "content": messageContent}],
    });

    const aiResponse = response.choices[0].message.content;
    console.log(aiResponse);
    res.redirect(`/questions?message=${encodeURIComponent(JSON.stringify(aiResponse))}`);
});

app.post('/getResponseFromAnketa', async (req, res) => {
    const { answers } = req.body;
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{"role":"user", "content": `
        Я изучаю русский язык, потому что мне это интересно и я хочу расширить свои культурные горизонты.			
        Моя мотивация изучать русский язык заключается в том, чтобы улучшить свои академические и профессиональные перспективы.			
        Я чувствую себя более уверенным/уверенной, когда могу общаться на русском языке.			
        Моя семья или друзья поощряют меня в изучении русского языка.			
        Я изучаю русский язык, потому что это может помочь мне в путешествиях или общении с носителями языка.			
        Моя мотивация изучать русский язык основана на желании понимать русскую литературу, кино или музыку.			
        Я чувствую давление со стороны общества или окружения на изучение русского языка (например, в школе, университете, или в рамках работы)..			
        Я уверен/уверена, что изучение русского языка поможет мне развить новые когнитивные навыки.			
        Моя мотивация изучать русский язык основана на том, чтобы понимать русскую культуру и традиции глубже.			
        Я чувствую, что изучение русского языка помогает мне развивать свою коммуникативную компетенцию в целом..
        ответы на 10 вопросов: ${answers}. Определи какой я студент покороче, пологаясь на мои ответы на конкретный вопрос и дай основные 3 советы
        пологаясь на мои ответы на конкретный вопрос
        `}],
    })
    console.log(answers)
    res.redirect(`/getAnketaPage?message=${encodeURIComponent(JSON.stringify(response.choices[0].message.content))}`);
})

app.listen(3000, () => console.log('App listening on port 3000!'))