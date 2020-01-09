const root = document.getElementById('root');

function createLinks(links) {
  return links.reduce(
    (prev, current) =>
      (prev += `
    <li class="nav-item">
        <a class="nav-link" href="${current.href}">${current.text}</a>
    </li>
`),
    ''
  );
}

export const NavBar = (title, links = []) => {
  const nav = document.createElement('nav');
  nav.className = 'navbar navbar-expand-lg navbar-dark bg-dark';
  const skeleton = `
    <a class="navbar-brand" href="#">${title || 'title'}</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
        ${createLinks(links)}
        </ul>
    </div>`;
  nav.innerHTML = skeleton;

  root.append(nav);
};

export const Card = () => {
  const divContainer = document.createElement('div');
  const skeleton = `
    <div class="card" style="width: 18rem;">
    <img src="..." class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      <a href="#" class="btn btn-primary">Go somewhere</a>
    </div>
  </div>`;
  divContainer.innerHTML = skeleton;

  root.append(divContainer);
};

export const ButtonLink = (url, text) => {
  let frag = document.createElement('div');
  frag.innerHTML = `
        <div class="text-center mt-3">
            <a href="${url}" class="btn btn-primary btn-lg">${text}</a>
        </div>
    `;
  root.append(frag);
};
