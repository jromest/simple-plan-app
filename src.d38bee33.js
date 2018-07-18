// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"index.js":[function(require,module,exports) {
document.addEventListener("DOMContentLoaded", function () {
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll(".navbar-burger"), 0);

  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach(function (el) {
      el.addEventListener("click", function () {
        var target = el.dataset.target;
        var $target = document.getElementById(target);

        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }

  var currentView = "post";

  var postButton = document.getElementById("post");
  var userButton = document.getElementById("user");
  var container = document.getElementById("main-content");

  renderPageContent(currentView, container);

  postButton.addEventListener("click", function () {
    var id = postButton.getAttribute("id");
    currentView = renderCurrentView(currentView, id, container);
  });

  userButton.addEventListener("click", function () {
    var id = userButton.getAttribute("id");
    currentView = renderCurrentView(currentView, id, container);
  });

  window.addEventListener("scroll", function (e) {
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
  var documentEl = document.documentElement;
  var documentBody = document.body;
  return (documentEl.scrollTop || documentBody.scrollTop) / ((documentEl.scrollHeight || documentBody.scrollHeight) - documentEl.clientHeight) * 100;
}

function fetchContent(url, callback) {
  fetch(url).then(function (response) {
    return response.json();
  }).then(function (json) {
    return callback(json);
  }).catch(function (err) {
    callback(null);
    throw err;
  });
}

function renderPageContent(type, container) {
  container.innerHTML = "";
  container.innerHTML += "<h1 class=\"is-size-2 is-capitalized\">" + type + "</h1>";

  getRandomContent(type);
}

function getRandomContent(type) {
  var urlUser = "https://randomuser.me/api/?results=5&nat=us,dk,fr,gb";
  var urlPost = "https://jsonplaceholder.typicode.com/comments?postId=1";

  var url = type === "user" ? urlUser : urlPost;

  fetchContent(url, function (data) {
    renderContent(type, data);
  });
}

function renderContent(type, data) {
  var container = document.getElementById("main-content");
  var htmlToRender = "";

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
  var users = [];

  for (var item in data) {
    var avatar = data[item].picture;
    var name = data[item].name;
    var phone = data[item].phone;
    var email = data[item].email;
    var address = data[item].location;

    users.push("\n    <div class=\"card\">\n      <div class=\"card-content\">\n        <div class=\"media is-block-mobile\">\n          <div class=\"media-left is-flex-mobile\">\n            <figure class=\"image is-128x128\">\n              <img src=\"" + avatar.large + "\" alt=\"\" class=\"avatar\">\n            </figure>\n          </div>\n          <div class=\"media-content\">\n            <p class=\"title is-4 is-capitalized has-text-centered-mobile\">\n              " + (name.first + " " + name.last) + "\n            </p>\n            <p class=\"subtitle is-6 has-text-centered-mobile\">\n              <i class=\"icon ion-md-mail\"></i>\n              " + email + "\n            </p>\n            <p>\n              <i class=\"icon ion-md-call\"></i>\n              " + phone + "\n            </p>\n            <p class=\"is-capitalized\">\n              <i class=\"icon ion-md-pin\"></i>\n              " + (address.street + ", " + address.city + ", " + address.state + " " + address.postcode) + "\n            </p>\n          </div>\n        </div>\n      </div>\n    </div>\n    ");
  }

  return users.join("");
}

function extractEmail(email) {
  var name = email.match(/(.+)(@)/);
  return name[1];
}

function renderPosts(data) {
  var posts = [];

  for (var item in data) {
    var id = data[item].id;
    var title = data[item].name;
    var postContent = data[item].body;
    var author = data[item].email;

    posts.push("\n      <div class=\"card\">\n        <div class=\"card-image\">\n          <figure class=\"image\">\n            <img src=\"https://picsum.photos/980/400/?image" + id + "\" alt=\"\">\n          </figure>\n        </div>\n        <div class=\"card-content\">\n          <p class=\"title is-4 is-capitalized\">" + title + "</p>\n          <p>" + postContent + "</p>\n        </div>\n        <div class=\"card-footer\">\n          <div class=\"card-footer-item author\">\n            <i class=\"icon ion-md-person\"></i>\n            " + extractEmail(author) + "\n          </div>\n          <div class=\"card-footer-item is-size-4-tablet\">\n            <i class=\"card-footer-item icon ion-logo-facebook\"></i>\n            <i class=\"card-footer-item icon ion-logo-twitter\"></i>\n            <i class=\"card-footer-item icon ion-logo-instagram\"></i>\n            <i class=\"card-footer-item icon ion-logo-rss\"></i>\n          </div>\n        </div>\n      </div>\n    ");
  }

  return posts.join("");
}

function renderErrorPage() {
  return "\n    <div class=\"notification is-warning\">\n      Failed to load.\n    </div>\n  ";
}
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '44449' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.d38bee33.map