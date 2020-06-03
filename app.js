const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');

const log = console.log;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {

  // -------- 날짜 표시 --------
  const date = {};
  const numbers = [0, 1, 2, 3, 4]; // Monday to Friday
  const today = new Date();
  date.weekdayString = ['월', '화', '수', '목', '금'];
  date.weekdayToday = 2;

  const formatDate = (mydate) => {
    return mydate.getMonth()+1 + '월 ' + mydate.getDate() + '일';
  }

  const dateObjs = numbers.map(index => {
    return new Date(today.getTime() - ((today.getDay() - index - 1) * 86400 * 1000));
  });
  date.dateString = dateObjs.map(o => formatDate(o));

  // -------- 식단 크롤링 --------

  const urls = dateObjs.map(o => {
    const thisDate = `${o.getFullYear()}-${o.getMonth()+1}-${o.getDate}`;
    return 'https://www.skhystec.com/service-cafe-bd.asp?m_gubun1=2&shr_yymmdd=' + thisDate;
  })
  
  // urls로 GET 요청 및 HTML 파싱


  res.render('index', {
    date
  });
});

const port = 3000;
app.listen(port, () => {
  console.log('listening 3000...');
});