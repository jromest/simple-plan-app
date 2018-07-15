document.addEventListener("DOMContentLoaded", () => {
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach(el => {
      el.addEventListener("click", () => {
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }

  let currentView = "post";

  let postButton = document.getElementById("post");
  let userButton = document.getElementById("user");
  let container = document.getElementById("main-content");

  renderPageContent(currentView, container);

  postButton.addEventListener("click", () => {
    let id = postButton.getAttribute("id");
    currentView = renderCurrentView(currentView, id, container);
  });

  userButton.addEventListener("click", () => {
    let id = userButton.getAttribute("id");
    currentView = renderCurrentView(currentView, id, container);
  });

  window.addEventListener("scroll", e => {
    if (getScrollPercent() >= 80) {
      getRandomContent(currentView);
    }
  });
});

function renderCurrentView(currentView, id, container) {
  if (currentView !== id) {
    renderPageContent(id, container);
    return id;
  }
}

function getScrollPercent() {
  let documentEl = document.documentElement;
  let documentBody = document.body;
  return (
    ((documentEl.scrollTop || documentBody.scrollTop) /
      ((documentEl.scrollHeight || documentBody.scrollHeight) -
        documentEl.clientHeight)) *
    100
  );
}

async function fetchContent(url, callback) {
  await fetch(url)
    .then(response => response.json())
    .then(json => callback(json))
    .catch(err => {
      callback(null);
      throw err;
    });
}

function renderPageContent(type, container) {
  container.innerHTML = "";
  container.innerHTML += `<h1 class="is-size-2 is-capitalized">${type}</h1>`;

  getRandomContent(type);
}

function getRandomContent(type) {
  let urlUser = "https://randomuser.me/api/?results=5&nat=us,dk,fr,gb";
  let urlPost = "https://jsonplaceholder.typicode.com/comments?postId=1";

  let url = type === "user" ? urlUser : urlPost;

  fetchContent(url, data => {
    renderContent(type, data);
  });
}

function renderContent(type, data) {
  let container = document.getElementById("main-content");
  let htmlToRender = "";

  if (data !== null) {
    if (type === "user") {
      htmlToRender = renderUsers(data.results);
    } else if (type === "post") {
      htmlToRender = renderPosts(data);
    }
  } else {
    htmlToRender = renderErrorPage();
  }

  container.innerHTML += htmlToRender;
}

function renderUsers(data) {
  let users = [];

  for (let item in data) {
    let avatar = data[item].picture;
    let name = data[item].name;
    let phone = data[item].phone;
    let email = data[item].email;
    let address = data[item].location;

    users.push(`
    <div class="card">
      <div class="card-content">
        <div class="media is-block-mobile">
          <div class="media-left is-flex-mobile">
            <figure class="image is-128x128">
              <img src="${avatar.large}" alt="" class="avatar">
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4 is-capitalized has-text-centered-mobile">
              ${name.first + " " + name.last}
            </p>
            <p class="subtitle is-6 has-text-centered-mobile">
              <i class="icon ion-md-mail"></i>
              ${email}
            </p>
            <p>
              <i class="icon ion-md-call"></i>
              ${phone}
            </p>
            <p class="is-capitalized">
              <i class="icon ion-md-pin"></i>
              ${address.street +
                ", " +
                address.city +
                ", " +
                address.state +
                " " +
                address.postcode}
            </p>
          </div>
        </div>
      </div>
    </div>
    `);
  }

  return users.join("");
}

function extractEmail(email) {
  let name = email.match(/(.+)(@)/);
  return name[1];
}

function renderPosts(data) {
  let posts = [];

  for (let item in data) {
    let id = data[item].id;
    let title = data[item].name;
    let postContent = data[item].body;
    let author = data[item].email;

    posts.push(`
      <div class="card">
        <div class="card-image">
          <figure class="image">
            <img src="https://picsum.photos/980/400/?image${id}" alt="">
          </figure>
        </div>
        <div class="card-content">
          <p class="title is-4 is-capitalized">${title}</p>
          <p>${postContent}</p>
        </div>
        <div class="card-footer">
          <div class="card-footer-item author">
            <i class="icon ion-md-person"></i>
            ${extractEmail(author)}
          </div>
          <div class="card-footer-item is-size-4-tablet">
            <i class="card-footer-item icon ion-logo-facebook"></i>
            <i class="card-footer-item icon ion-logo-twitter"></i>
            <i class="card-footer-item icon ion-logo-instagram"></i>
            <i class="card-footer-item icon ion-logo-rss"></i>
          </div>
        </div>
      </div>
    `);
  }

  return posts.join("");
}

function renderErrorPage() {
  return `
    <div class="notification is-warning">
      Failed to load.
    </div>
  `;
}
