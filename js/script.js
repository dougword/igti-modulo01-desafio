let userList = [];
let searchEdit = null;

let foundUsersTitle = document.querySelector('#foundUsersTitle');
let statisticsTitle = document.querySelector('#statisticsTitle');

let users = document.querySelector('#users');
let details = document.querySelector('#details');

window.addEventListener('load', () => {
  loadData();
  loadComponents();
  formHandle();
});

async function loadData() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  userList = json.results.map((user) => {
    return {
      fullName: `${user.name.first} ${user.name.last}`,
      gender: user.gender,
      age: user.dob.age,
      picture: user.picture.thumbnail,
    };
  });
  userList.sort((a, b) => a.fullName.localeCompare(b.fullName));
}

function loadComponents() {
  searchEdit = document.querySelector('#searchEdit');
}

function formHandle() {
  let form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    search();
  });
}

function countGender(users, gender) {
  return users.reduce((acc, current) => (acc += current.gender == gender), 0);
}

function sumAges(users) {
  return users.reduce((acc, current) => (acc += current.age), 0);
}

function avgAges(users) {
  return users.length > 0 ? sumAges(users) / users.length : 0;
}

function search() {
  // Get search text, if empty clear fields
  let searchText = searchEdit.value.toLowerCase().trim();
  let foundUsers = [];
  if (searchText.length > 0) {
    // Search for users according to text field
    foundUsers = userList.filter((user) =>
      user.fullName.toLowerCase().includes(searchText)
    );
  }

  render(foundUsers);
}

function createLabelValue(label, value) {
  return `
    <div>
      <h6 class="center">
      ${label}: <strong>${value}</strong>
      </h6>
    </div>
  `;
}

function render(foundUsers) {
  // Calculate statistics for foundUsers
  let maleCount = countGender(foundUsers, 'male');
  let femaleCount = countGender(foundUsers, 'female');
  let ageSum = sumAges(foundUsers);
  let ageAverage = avgAges(foundUsers);

  let statisticsHTML =
    createLabelValue('Sexo masculino', maleCount) +
    createLabelValue('Sexo feminino', femaleCount) +
    createLabelValue('Soma das idades', ageSum) +
    createLabelValue('Média das idades', ageAverage.toFixed(2));

  statisticsTitle.textContent = 'Estatísticas';
  details.innerHTML = statisticsHTML;

  // Show found users
  let title = `${foundUsers.length} usuário(s) encontrado(s)`;
  let foundCards = createUserCards(foundUsers);

  foundUsersTitle.textContent = title;
  users.innerHTML = foundCards;
}

function createUserCards(foundUsers) {
  let cards = '';
  foundUsers.forEach((user) => {
    /*
    cards += `
      <div>
        <img src="${user.picture}" />
        ${user.fullName}, ${user.age} anos.
      </div>
    `;
    */
    cards += `
      <div class="col s12 l6 offset-l3">
        <div class="card-panel grey lighten-5 z-depth-1">
          <div class="valign-wrapper">
            <div class="col s3">
              <img src="${user.picture}" alt="" class="circle responsive-img"> <!-- notice the "circle" class -->
            </div>
            <div class="col s9">
              <span class="black-text">
              <h6>
              ${user.fullName}, ${user.age} anos.
              </h6>
              </span>
            </div>
          </div>
        </div>
      </div>    
    `;
  });
  return cards;
}
