console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/DSC106_portfolio/";         // GitHub Pages repo name

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/SarahColbath-UCSD-Student', title: "Github"},
  // add the rest of your pages here
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
  }
  let title = p.title;
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }
  if (url === "https://github.com/SarahColbath-UCSD-Student") {
    a.target = "_blank";
  }
  nav.append(a);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
      <label><option value="light dark">Automatic</label>
			<label><option value="light">Light</label>
      <label><option value="dark">Dark</label>
		</select>
	</label>`,
);

let select = document.querySelector("select");

function setColorScheme(value) {
  document.documentElement.style.setProperty('color-scheme', value);
}

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  setColorScheme(event.target.value);
  localStorage.colorScheme = event.target.value;
});

window.addEventListener('load', function () {
  if (localStorage.colorScheme) {
    setColorScheme(localStorage.colorScheme);
    select.value = localStorage.colorScheme;
  }
});

let form = document.querySelector("form");

form?.addEventListener('submit', function (event) {
  const data = new FormData(form);
  let url = form.action + '?';
  for (let [name, value] of data) {  
    url = url + name + '=' + value + '&';
    console.log(name, value);
  }
  url = url.substring(0, url.length - 1);
  url = url + '?';
  location.href = url;
  console.log(url);
})

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(project, containerElement) {
  containerElement.innerHTML = '';
  console.log(project.image);
  const article = document.createElement('article');
  article.innerHTML = `
    <h3>${project.title}</h3>
    <img src="${project.image}" alt="${project.title}">
    <p>${project.description}</p>
  `;
  containerElement.appendChild(article);
}
