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

export const NavBar = (title, links = [], loggedIn = false) => {
  const nav = document.createElement('nav');
  nav.className = 'navbar navbar-expand-lg navbar-dark bg-dark';
  let skeleton = `
    <a class="navbar-brand" href="#">${title || 'title'}</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
        ${createLinks(links)}
        </ul>
    </div>`;
    if(loggedIn) {
    skeleton += ` <ul class="navbar-nav ml-md-auto">
    <li class="nav-item">
      <a class="nav-item nav-link mr-md-2" href="#" id="logout" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
        Logout
      </a>
    </li>
  </ul>`;
    }
  nav.innerHTML = skeleton;

  root.append(nav);
};

export const Card = (title, id, description, image, rootContainer) => {
  const divCol = document.createElement('div');
  divCol.className = 'col';
  const skeleton = `
    <div class="card" style="width: 18rem;">
    <img src="${image}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">${description || ''}</p>
      <a class="btn btn-primary"  data-toggle="modal" data-target="#${id}">Escuchar!</a>
    </div>
  </div>`;

  divCol.innerHTML = skeleton;

  rootContainer.append(divCol);
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

export const ModalListTrack = (title, listTrack = [], id) => {
  let divContainer = document.createElement('div');
  let skeleton = `<div class="modal fade" id="${id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">${title ||
          'Tracks'}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <ul class="list-items">`;

  for (const track of listTrack) {
    skeleton += `<li class="list-item"></li>`;
  }

  skeleton += `</ul>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>`;
divContainer.innerHTML = skeleton;
  root.append(divContainer);
};
