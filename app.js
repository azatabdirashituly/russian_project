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

app.get('/getCulturalPage', (req, res) => {
    res.render('cultural/cultural_main')
})
app.get('/cultural_questionnaire', (req, res) => {
    const msg = req.query.message ? JSON.parse(decodeURIComponent(req.query.message)) : null;
    res.render('cultural/questionnaire', {msg: msg})
})
app.get('/getCareerPage', (req, res) => {
    res.render('career/career_main')
})
app.get('/career_questionnaire', (req, res) => {
    const msg = req.query.message? JSON.parse(decodeURIComponent(req.query.message)) : null;
    res.render('career/questionnaire', {msg: msg})
})
app.get('/getPersonalPage', (req, res) => {
    res.render('personal/personal_main')
})
app.get('/personal_questionnaire', (req, res) => {
    const msg = req.query.message? JSON.parse(decodeURIComponent(req.query.message)) : null;
    res.render('personal/questionnaire', {msg: msg})
})


app.post('/getRespFromCultural', async (req, res) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{"role":"user", "content": `
        "Насколько вы очарованы русским фольклором и традиционными историями? ${req.body.q1}"
        "Вызывает ли у вас интерес к изучению языка роль России в мировой истории? ${req.body.q2}"
        "Насколько ваш интерес к русской кухне влияет на ваше желание изучать русский язык? ${req.body.q3}"
        "Есть ли у вас мотивация изучать русский язык, чтобы понимать российское кино и телевидение без субтитров? ${req.body.q4}"
        "Повлияли ли на ваш интерес к русскому языку известные российские ученые и изобретатели? ${req.body.q5}"
        "Насколько вас заинтриговали русские праздники и традиции? ${req.body.q6}"
        "Хотите ли вы выучить русский язык, чтобы лучше оценить русский театр и балет? ${req.body.q7}"
        "Насколько важно понимание русского юмора и идиом в вашем решении изучать язык? ${req.body.q8}"
        "Мотивирует ли вас изучение российских социальных сетей и интернет-культуры изучать русский язык? ${req.body.q9}"
        "Считаете ли вы привлекательным российское архитектурное и художественное наследие? ${req.body.q10}"
        Анализируй ответы и дай советы для улучшения, поднятие мотиваций к изучению русского языка        `}],
    })
    res.redirect(`/cultural_questionnaire?message=${encodeURIComponent(JSON.stringify(response.choices[0].message.content))}`);
})
app.post('/getRespFromCareer', async (req, res) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{"role":"user", "content": `
        "Считаете ли вы русский важнейшим языком для международного бизнеса и торговли? ${req.body.q1}"
        "Насколько важно свободное владение русским языком для ваших возможностей профессионального общения? ${req.body.q2}"
        "Является ли изучение русского языка обязательным требованием или значительным преимуществом в вашей нынешней работе или образовании? ${req.body.q3}"
        "Верите ли вы, что знание русского языка увеличит ваши шансы на учебу или работу за границей? ${req.body.q4}"
        "Изучаете ли вы русский язык, чтобы получить конкурентное преимущество в своей профессиональной сфере? ${req.body.q5}"
        "Насколько, по вашему мнению, актуален русский язык в мировом технологическом секторе? ${req.body.q6}"
        "Рассматриваете ли вы изучение русского языка как способ получить доступ к возможностям трудоустройства в России или русскоязычных странах? ${req.body.q7}"
        "Важно ли понимание русского языка для ваших исследований или академической деятельности? ${req.body.q8}"
        "Считаете ли вы, что знание русского языка повысит ваши лидерские или управленческие способности? ${req.body.q9}"
        "Есть ли у вас мотивация изучать русский язык для участия в международных конференциях или мероприятиях? ${req.body.q10}"
        Анализируй ответы и дай мотивавию или советы
        `}],
    })
    res.redirect(`/career_questionnaire?message=${encodeURIComponent(JSON.stringify(response.choices[0].message.content))}`);
})
app.post('/getRespFromCultural', async (req, res) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{"role":"user", "content": `
        "Насколько вы очарованы русским фольклором и традиционными историями? ${req.body.q1}"
        "Вызывает ли у вас интерес к изучению языка роль России в мировой истории? ${req.body.q2}"
        "Насколько ваш интерес к русской кухне влияет на ваше желание изучать русский язык? ${req.body.q3}"
        "Есть ли у вас мотивация изучать русский язык, чтобы понимать российское кино и телевидение без субтитров? ${req.body.q4}"
        "Повлияли ли на ваш интерес к русскому языку известные российские ученые и изобретатели? ${req.body.q5}"
        "Насколько вас заинтриговали русские праздники и традиции? ${req.body.q6}"
        "Хотите ли вы выучить русский язык, чтобы лучше оценить русский театр и балет? ${req.body.q7}"
        "Насколько важно понимание русского юмора и идиом в вашем решении изучать язык? ${req.body.q8}"
        "Мотивирует ли вас изучение российских социальных сетей и интернет-культуры изучать русский язык? ${req.body.q9}"
        "Считаете ли вы привлекательным российское архитектурное и художественное наследие? ${req.body.q10}"
        Анализируй ответы и дай советы для улучшения, поднятие мотиваций к изучению русского языка
        `}],
    })
    res.redirect(`/cultural_questionnaire?message=${encodeURIComponent(JSON.stringify(response.choices[0].message.content))}`);
})
app.post('/getRespFromPersonal', async (req, res) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{"role":"user", "content": `
        "Есть ли у вас русскоязычные члены семьи, с которыми вы хотели бы общаться более эффективно? ${req.body.q1}"
        "Является ли общение с русскоязычным сообществом в вашем регионе причиной для изучения языка? ${req.body.q2}"
        "Планируете ли вы путешествовать по русскоязычным регионам и хотите общаться с местными жителями? ${req.body.q3}"
        "Важно ли для вас изучать русский язык, чтобы понимать и ценить культурное наследие друга или партнера? ${req.body.q4}"
        "Интересуетесь ли вы русским языком, чтобы завести новых друзей или связи в русскоязычных онлайн-сообществах? ${req.body.q5}"
        "Рассматриваете ли вы изучение русского языка как способ приобщиться к своему наследию или семейной истории? ${req.body.q6}"
        "Насколько важно для вас изучать русский язык для эффективного межкультурного общения? ${req.body.q7}"
        "Мотивированы ли вы изучать русский язык для участия в программах культурного обмена? ${req.body.q8}"
        Анализируй ответы и дай советы для улучшения, поднятие мотиваций к изучению русского языка
        `}],
    })
    res.redirect(`/personal_questionnaire?message=${encodeURIComponent(JSON.stringify(response.choices[0].message.content))}`);
})

app.listen(3000, () => console.log('App listening on port 3000!'))