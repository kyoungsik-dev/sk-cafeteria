const express = require('express');
const app = express();


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const numbers = [0, 1, 2, 3, 4]; // Monday to Friday
  const weekdayString = ['월', '화', '수', '목', '금'];
  const today = new Date();
  const weekdayToday = 2;

  const formatDate = (mydate) => {
    return mydate.getMonth()+1 + '월 ' + mydate.getDate() + '일';
  }

  const datearr = numbers.map(index => {
    const day = new Date(today.getTime() - ((today.getDay() - index - 1) * 86400 * 1000));
    return formatDate(day);
  })


  res.render('index', {
    datearr, 
    weekdayString,
    weekdayToday
  });
});

const port = 3000;
app.listen(port, () => {
  console.log('listening 3000...');
});