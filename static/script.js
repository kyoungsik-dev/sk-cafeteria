window.onload = function () {
  let currentType = window.currentType;

  // 식단표 채워넣기
  const makeHTML = (data) => {
    if (!data.name) return;
    const descHTML = data.desc.map(item => `• ${item}&nbsp;`).join('');
    return `<div class="card">
      <div class="card-header px-3">
        ${data.type}&nbsp;
      </div>
      <div class="card-body p-3">
        <h6 class="card-title">${data.name}</h6>
        <p class="small">${descHTML}</p>
        <span class="badge badge-pill badge-secondary">${data.calories} kcal</span>
      </div>
    </div>`
  }
  
  // 데이터 가져오기
  const today = new Date(new Date().getTime() - ((new Date().getDay() - window.weekdayToday - 1) * 86400 * 1000));
  const year = String(today.getFullYear());
  const month = (today.getMonth()+1 < 10 ? '0' : '') + String(today.getMonth()+1);
  const date = (today.getDate() < 10 ? '0' : '') + String(today.getDate());
  const url = `/api/${year}-${month}-${date}`;

  if (0 <= window.weekdayToday && window.weekdayToday <= 4) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
      let wholeHTML = [];
      Object.keys(data).map(type => {
        const menusHTML = data[type].map(o => makeHTML(o)).join('');
        wholeHTML.push(`<div class="menu-display card-group ${type === currentType ? '' : 'd-none'}" data-type=${type}>${menusHTML}</div>`);
      });
      document.querySelector('.menu-body').innerHTML = wholeHTML.join('');
    });
  }

  // 식사 선택
  document.querySelectorAll('.select-type').forEach(element => {
    element.addEventListener('click', (e) => {
      const selectedType = e.target.dataset.type;
      if (selectedType === currentType) return;
      document.querySelector(`.select-type[data-type=${currentType}]`).classList.remove('active');
      document.querySelector(`.select-type[data-type=${selectedType}]`).classList.add('active');

      document.querySelector(`.menu-display[data-type=${currentType}]`).classList.add('d-none');
      document.querySelector(`.menu-display[data-type=${selectedType}]`).classList.remove('d-none');
      currentType = selectedType;
    });
  });
}