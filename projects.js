(function () {
  "use strict";

  var list = document.getElementById("work-list");
  if (!list) return;

  // Display layer: repo name -> how the project appears on the site.
  // Screenshots live in assets/work/ (add a file with the matching name).
  var DISPLAY = {
    "Abu": {
      title: "Abu Boutique",
      category: "Clothing boutique, e-commerce concept",
      summary: "A men's and women's clothing storefront concept with product browsing, a shopping cart and a checkout flow.",
      image: "assets/work/abu.jpg"
    },
    "Adeluxe": {
      title: "Adeluxe",
      category: "Boutique, e-commerce concept",
      summary: "An e-commerce boutique website concept focused on presenting products clearly online.",
      image: "assets/work/adeluxe.jpg"
    },
    "Aura-atelier-demo": {
      title: "Aura Atelier",
      category: "Boutique, e-commerce concept",
      summary: "An e-commerce boutique website concept focused on presenting products clearly online.",
      image: "assets/work/aura-atelier.jpg"
    }
  };

  function safeHttpsUrl(value) {
    try {
      var url = new URL(String(value).trim());
      return url.protocol === "https:" ? url.href : null;
    } catch (e) {
      return null;
    }
  }

  function showMessage(text) {
    list.innerHTML = "";
    var p = document.createElement("p");
    p.className = "work-message";
    p.textContent = text;
    list.appendChild(p);
  }

  function buildMedia(info) {
    var media = document.createElement("div");
    media.className = "work-item__media";

    function showEmpty() {
      media.innerHTML = "";
      var empty = document.createElement("div");
      empty.className = "work-item__empty";
      empty.setAttribute("aria-hidden", "true");
      empty.textContent = info.title.charAt(0);
      media.appendChild(empty);
    }

    if (!info.image) {
      showEmpty();
      return media;
    }

    var img = document.createElement("img");
    img.src = info.image;
    img.alt = "Screenshot of the " + info.title + " website";
    img.width = 1600;
    img.height = 1000;
    img.loading = "lazy";
    img.addEventListener("error", showEmpty);
    media.appendChild(img);
    return media;
  }

  function buildItem(project) {
    var link = safeHttpsUrl(project.homepage);
    if (!link) return null;

    var known = DISPLAY[project.repo];
    var info = known || {
      title: project.repo.replace(/[-_]+/g, " "),
      category: "Website project",
      summary: project.description || "",
      image: ""
    };

    var item = document.createElement("article");
    item.className = "work-item";

    item.appendChild(buildMedia(info));

    var body = document.createElement("div");

    var title = document.createElement("h3");
    title.textContent = info.title;
    body.appendChild(title);

    var meta = document.createElement("p");
    meta.className = "work-item__meta";
    meta.textContent = info.category;
    body.appendChild(meta);

    if (info.summary) {
      var summary = document.createElement("p");
      summary.className = "work-item__summary";
      summary.textContent = info.summary;
      body.appendChild(summary);
    }

    var a = document.createElement("a");
    a.className = "text-link work-item__link";
    a.href = link;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "Visit live site";
    a.setAttribute("aria-label", "Visit live site: " + info.title + " (opens in a new tab)");
    body.appendChild(a);

    item.appendChild(body);
    return item;
  }

  fetch("data/projects.json", { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) throw new Error("projects.json " + response.status);
      return response.json();
    })
    .then(function (data) {
      var projects = data && Array.isArray(data.projects) ? data.projects : [];
      var items = projects.map(buildItem).filter(Boolean);

      if (!items.length) {
        showMessage("Selected projects are being added. Please check back soon.");
        return;
      }

      list.innerHTML = "";
      items.forEach(function (item) {
        list.appendChild(item);
      });
    })
    .catch(function () {
      showMessage("Selected projects could not be loaded. Please refresh the page.");
    });
})();
