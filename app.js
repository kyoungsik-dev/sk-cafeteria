const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

const getData = (day) => {
  const date = {};
  const numbers = [0, 1, 2, 3, 4]; // Monday to Friday
  const today = new Date();
  date.weekdayString = ['월', '화', '수', '목', '금'];
  date.weekdayToday = day;

  const formatDate = (mydate) => {
    return mydate.getMonth()+1 + '월 ' + mydate.getDate() + '일';
  }

  const dateObjs = numbers.map(index => {
    return new Date(today.getTime() - ((today.getDay() - index - 1) * 86400 * 1000));
  });
  date.dateString = dateObjs.map(o => formatDate(o));


  return { date, isError: false };
}
app.set('view engine', 'ejs');
app.use('/static', express.static('static'));

app.get('/api2/:date', (req, res) => {

  const menus = {};
  const time = {};

  const typeCode = {
    'breakfast': 'T_B',
    'lunch': 'T_L',
    'dinner': 'T_D'
  };

  const parseMenu = (obj) => {
    return {
      type: obj.retCorn,
      calories: obj.retCalo,
      name: obj.retMenu.replace(/ /g, ''),
      desc: obj.retDesc.split('#').filter(o => !!o).map(o => o.replace(/ /g, ''))
    };
  }

  const fetchMenu = (type, i) => {
    return new Promise(resolve => {
      const url = `https://mc.skhystec.com/V2/prc/jsCafeMenu.prc?jDate=${req.params.date}&jRest=R_21&jTerm=${typeCode[type]}`;
      axios.get(url)
        .then(result => {
//          console.log(result.data);

          menus[type] = [];
          menus[type][0] = parseMenu(result.data.rows[0]);
          menus[type][1] = parseMenu(result.data.rows[1]);
          time[type] = result.data.retTime.replace('~', ' ~ ');
          resolve();
        })
        .catch(error => {
          console.log(error);
          resolve();
        });
    });
  }

  async function fetchAllMenu() {
    const promises = ['breakfast', 'lunch', 'dinner'].map((type, i) => fetchMenu(type, i));
    await Promise.all(promises);
    res.json({menus, time});
  }

  fetchAllMenu();
})
app.get('/api/:date', (req, res) => {

  const menus = {};
  const time = {
    breakfast: '07:30 ~ 08:30',
    lunch: '11:30 ~ 13:30',
    dinner: '17:30 ~ 19:00'
  };
  const  httpsAgent = new https.Agent({
    rejectUnauthorized: false
  });

  const parseMenu = (obj) => {
    const $ = cheerio.load(obj);
    const desc = $('ul li').map(function(i, el) {
      if (i == 0) return;
      return $(this).text();
    }).get();
    return {
      type: $('h6 strong').text(),
      calories: $('h6 > span').text(),
      name: $('ul .mainmenu').text(), 
      desc
    }
  }

  const fetchMenu = (type, i) => {
    return new Promise(resolve => {
      const url = `https://www.skhystec.com/service-cafe-bd.asp?m_gubun1=${i+1}&shr_yymmdd=${req.params.date}`;
      axios.get(url, {httpsAgent})
        .then(html => {
          const $ = cheerio.load(html.data);
          const $bodyList = $('ul.menu-info').children().prev();
          menus[type] = [];
          menus[type][0] = parseMenu($bodyList.html());
          menus[type][1] = parseMenu($bodyList.next().html());
          menus[type][2] = parseMenu($bodyList.next().next().html());
          resolve();
        })
        .catch(error => {
          console.log(error);
          resolve();
        });
    });
  }

  async function fetchAllMenu() {
    const promises = ['breakfast', 'lunch', 'dinner'].map((type, i) => fetchMenu(type, i));
    await Promise.all(promises);
    res.json({menus, time});
  }
  
  fetchAllMenu();
});

app.get('/:day', (req, res) => {
  const data = getData(parseInt(req.params.day));
  res.render('index', data);
});

app.get('/', (req, res) => {
  const data = getData(new Date().getDay() - 1);
  res.render('index', data);
});

app.get('/*', (req, res) => {
  const data = getData(100);
  res.render('index', data);
})

const port = 3000;
app.listen(port, () => {
  console.log('listening 3000...');
});