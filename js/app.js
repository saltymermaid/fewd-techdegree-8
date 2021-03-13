function createAndAddToElement(elem, attrib, details, adult) {
  let element = document.createElement(elem);
  element.setAttribute(attrib, details);
  adult.appendChild(element);
  return element;
}

function createWithTextAndAddToElement(elem, content, classy, adult) {
  let element = document.createElement(elem);
  element.textContent = content;
  element.setAttribute("class", classy);
  adult.appendChild(element);
  return element;
}

let employees = [];
let filteredEmployees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=us,gb,ie,au,ca,nz`
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal-close");
const modalNav = document.querySelector(".modal-nav");
const modalNext = document.querySelector(".modal-next");
const modalPrev = document.querySelector(".modal-prev");

fetch(urlAPI)
.then(res => res.json())
.then(res => res.results)
.then(copyEmployees)
.then(displayEmployees)
.catch(err => console.log(err))

function copyEmployees(allEmployees) {
  employees = allEmployees;
  filteredEmployees = allEmployees;
  return allEmployees;
}

function createEmployee(index, grandparent, parentClass, modal=false) {
  const {name, dob, phone, email, location: {city, street, state, postcode}, picture} = filteredEmployees[index];
  const date = new Date(dob.date);
  const parent = createAndAddToElement('div', 'class', parentClass, grandparent)
  parent.setAttribute('data-index', index)
  const photo = createAndAddToElement('img', 'src', picture.large, parent)
  photo.setAttribute('class', 'avatar')
  const textContainer = createAndAddToElement('div', 'class', 'text-container', parent)
  createWithTextAndAddToElement('h2', `${name.first} ${name.last}`, 'name', textContainer)
  createWithTextAndAddToElement('p', email, 'email', textContainer)
  createWithTextAndAddToElement('p', city, 'location', textContainer)
  if (modal) {
    let hr = document.createElement('hr');
    textContainer.appendChild(hr);
    createWithTextAndAddToElement('p', phone, 'additional', textContainer )
    createWithTextAndAddToElement(
      'p',
      `${street.number} ${street.name}, ${city}, ${state} ${postcode}`,
      'additional',
      textContainer
    )
    createWithTextAndAddToElement('p', `Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`, 'additional', textContainer )
  }
}

function displayEmployees(employeeData) {
  employeesToDisplay = employeeData;
  for (let i = 0; i < employeesToDisplay.length; i++) {
    createEmployee(i, gridContainer, 'card')
  };
}

function displayModal(index) {
  const navButtons = Array.from(modalNav.children);
  navButtons.forEach(button => {
    button.classList.remove("hidden");
  });
  const deleteModal = modal.querySelector('.modal-content');
  if (deleteModal) {
    modal.removeChild(deleteModal)
  };
  createEmployee(index, modal, 'modal-content', true)
  displayModalNav(index);
  overlay.classList.remove("hidden");
}

function displayModalNav(index) {
  const size = filteredEmployees.length;
  if (index === size - 1) {
    modalNext.classList.add("hidden");
  }
  if (index === 0) {
    modalPrev.classList.add("hidden");
  }
}

gridContainer.addEventListener('click', e => {
  if (e.target !== gridContainer) {
    const card = e.target.closest(".card");
    const index = parseInt(card.getAttribute('data-index'));
    displayModal(index);
    }
  });

modalClose.addEventListener('click', () => {
  overlay.classList.add("hidden");
});

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    overlay.classList.add("hidden");
  }
});

modalNav.addEventListener('click', (e) => {
  const employeeIndex = document.querySelector('.modal-content');
  displayModalNav(parseInt(employeeIndex.dataset.index));
  if (e.target === modalNext) {
    const nextEmployee = parseInt(employeeIndex.dataset.index) + 1;
    if (nextEmployee < filteredEmployees.length) {
      displayModal(nextEmployee);
    };
  } else if (e.target === modalPrev) {
    const prevEmployee = parseInt(employeeIndex.dataset.index) - 1;
    if (prevEmployee >= 0) {
      displayModal(prevEmployee);
    };
  }
});

function handleSearch() {
  let search = document.querySelector('#search').value;
  search = search.toLowerCase();
  filteredEmployees = [];
  gridContainer.innerHTML = '';

  employees.forEach(employee => {
    employeeName = `${employee.name.first} ${employee.name.last}`;
    if (employeeName.toLowerCase().includes(search)) {
      filteredEmployees.push(employee);
    }
  })
  displayEmployees(filteredEmployees);
}

search.addEventListener('search', handleSearch);
search.addEventListener('keyup', handleSearch);

