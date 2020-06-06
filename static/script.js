window.onload = function () {
  let currentType = 'lunch';

  // 식단표 채워넣기
  const makeHtml = (data) => {
    return `<div class="card">
      <div class="card-header">
        ${data.type}&nbsp;
      </div>
      <div class="card-body">
        <h5 class="card-title">${data.name}</h5>
        <p class="card-text">${data.desc}</p>
      </div>
      <div class="card-footer">
        <small class="text-muted">${data.calories} ${data.calories ? 'kcal' : '&nbsp;'}</small>
      </div>
    </div>`
  }
  
  // 데이터 가져오기
  const today = new Date();
  // const url = `/api/${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
  const url = '/api/2020-06-05';
  fetch(url)
    .then(response => response.json())
    .then(data => {
      let wholeHTML = [];
      Object.keys(data).map(type => {
        const menusHTML = data[type].map(o => makeHtml(o)).join('');
        wholeHTML.push(`<div class="menu-display card-group ${type === currentType ? '' : 'd-none'}" data-type=${type}>${menusHTML}</div>`);
        this.console.log(menusHTML);
      });
      document.querySelector('.right').innerHTML = wholeHTML.join('');
    });

  // 식사 선택
  document.querySelector(`.select-type[data-type=${currentType}]`).classList.add('active');
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