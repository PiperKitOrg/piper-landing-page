(function () {
  "use strict";

  var root = document.documentElement;
  var pageId = root.getAttribute("data-docs-page") || "";
  var navUrl = new URL("nav.json", window.location.href).href;
  var searchIndex = null;

  function flatPages(nav) {
    var out = [];
    (nav.sections || []).forEach(function (section) {
      (section.pages || []).forEach(function (page) {
        out.push({
          id: page.id,
          title: page.title,
          href: page.href,
          file: page.file || page.href,
          section: section.title
        });
      });
    });
    return out;
  }

  function currentIndex(pages) {
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].id === pageId) return i;
    }
    return -1;
  }

  function renderSidebar(nav) {
    var host = document.getElementById("docs-side-nav");
    if (!host) return;
    var html = "";
    (nav.sections || []).forEach(function (section) {
      html += '<p class="docs-side-label">' + escapeHtml(section.title) + "</p>";
      (section.pages || []).forEach(function (page) {
        var current = page.id === pageId ? ' aria-current="page"' : "";
        html +=
          '<a href="' +
          escapeAttr(page.href) +
          '"' +
          current +
          ">" +
          escapeHtml(page.title) +
          "</a>";
      });
    });
    host.innerHTML = html;
  }

  function renderCrumb(pages) {
    var host = document.getElementById("docs-crumb");
    if (!host) return;
    var idx = currentIndex(pages);
    if (idx < 0) return;
    var page = pages[idx];
    host.innerHTML =
      '<a href="../index.html">Piper</a> / <a href="index.html">Docs</a> / ' +
      escapeHtml(page.section) +
      " / <span>" +
      escapeHtml(page.title) +
      "</span>";
  }

  function renderPager(pages) {
    var host = document.getElementById("docs-pager");
    if (!host) return;
    var idx = currentIndex(pages);
    var prev = idx > 0 ? pages[idx - 1] : null;
    var next = idx >= 0 && idx < pages.length - 1 ? pages[idx + 1] : null;
    var html = "";
    if (prev) {
      html +=
        '<a class="prev" href="' +
        escapeAttr(prev.href) +
        '"><span class="dir">Previous</span><span class="title">' +
        escapeHtml(prev.title) +
        "</span></a>";
    } else {
      html += '<span class="empty"></span>';
    }
    if (next) {
      html +=
        '<a class="next" href="' +
        escapeAttr(next.href) +
        '"><span class="dir">Next</span><span class="title">' +
        escapeHtml(next.title) +
        "</span></a>";
    } else {
      html += '<span class="empty"></span>';
    }
    host.innerHTML = html;
  }

  function slugify(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function buildToc() {
    var article = document.querySelector("article.docs-article");
    var tocNav = document.getElementById("docs-toc-nav");
    var tocMobile = document.getElementById("docs-toc-mobile-nav");
    if (!article || !tocNav) return [];
    var headings = [].slice.call(article.querySelectorAll("h2, h3"));
    var items = [];
    headings.forEach(function (heading) {
      if (!heading.id) heading.id = slugify(heading.textContent);
      items.push({
        id: heading.id,
        text: heading.textContent,
        level: heading.tagName === "H3" ? 3 : 2
      });
    });
    var html = items
      .map(function (item) {
        var pad = item.level === 3 ? ' style="padding-left:1.25rem"' : "";
        return (
          '<a href="#' +
          escapeAttr(item.id) +
          '"' +
          pad +
          ">" +
          escapeHtml(item.text) +
          "</a>"
        );
      })
      .join("");
    tocNav.innerHTML = html;
    if (tocMobile) tocMobile.innerHTML = html;
    var wrap = document.querySelector(".docs-toc");
    var mobile = document.querySelector(".docs-toc-mobile");
    if (!items.length) {
      if (wrap) wrap.hidden = true;
      if (mobile) mobile.hidden = true;
    }
    return items;
  }

  function watchToc(items) {
    if (!items.length || !("IntersectionObserver" in window)) return;
    var links = [].slice.call(document.querySelectorAll("#docs-toc-nav a, #docs-toc-mobile-nav a"));
    var byId = {};
    links.forEach(function (link) {
      byId[link.getAttribute("href").slice(1)] = link;
    });
    var activeId = "";
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) activeId = entry.target.id;
        });
        if (!activeId) return;
        links.forEach(function (link) {
          if (link.getAttribute("href") === "#" + activeId) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 1] }
    );
    items.forEach(function (item) {
      var el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
  }

  function bindCopy() {
    [].slice.call(document.querySelectorAll("[data-copy]")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy") || "";
        var label = btn.textContent;
        function done() {
          btn.textContent = "Copied";
          setTimeout(function () {
            btn.textContent = label;
          }, 1200);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
          done();
        }
      });
    });
  }

  function bindMenu() {
    var btn = document.getElementById("docs-menu-btn");
    var sidebar = document.getElementById("docs-sidebar");
    var backdrop = document.getElementById("docs-backdrop");
    if (!btn || !sidebar || !backdrop) return;
    function close() {
      sidebar.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      backdrop.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
    function open() {
      sidebar.classList.add("is-open");
      backdrop.hidden = false;
      backdrop.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }
    btn.addEventListener("click", function () {
      if (sidebar.classList.contains("is-open")) close();
      else open();
    });
    backdrop.addEventListener("click", close);
    sidebar.addEventListener("click", function (event) {
      if (event.target.tagName === "A") close();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") close();
    });
  }

  function stripHtml(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || "").replace(/\s+/g, " ").trim();
  }

  var SEARCH_SNIPPET_RADIUS = 28;
  var SEARCH_SNIPPET_LENGTH = 90;
  var SEARCH_RESULT_LIMIT = 8;

  function emptySearchDoc(page) {
    return {
      id: page.id,
      title: page.title,
      href: page.href,
      section: page.section,
      body: ""
    };
  }

  function loadSearchIndex(pages) {
    return Promise.all(
      pages.map(function (page) {
        return fetch(page.file, { credentials: "same-origin" })
          .then(function (res) {
            return res.ok ? res.text() : "";
          })
          .then(function (html) {
            var match = html.match(/<article[^>]*class="docs-article"[^>]*>([\s\S]*?)<\/article>/i);
            var body = match ? stripHtml(match[1]) : "";
            var doc = emptySearchDoc(page);
            doc.body = body;
            return doc;
          })
          .catch(function () {
            return emptySearchDoc(page);
          });
      })
    );
  }

  function snippetForMatch(doc, query) {
    var body = doc.body || "";
    var at = body.toLowerCase().indexOf(query);
    if (at < 0) return doc.section;
    var start = Math.max(0, at - SEARCH_SNIPPET_RADIUS);
    var snippet = body.slice(start, start + SEARCH_SNIPPET_LENGTH);
    if (start > 0) snippet = "…" + snippet;
    if (start + SEARCH_SNIPPET_LENGTH < body.length) snippet += "…";
    return snippet || doc.section;
  }

  function bindSearch(pages) {
    var input = document.getElementById("docs-search");
    var results = document.getElementById("docs-search-results");
    if (!input || !results) return;

    searchIndex = pages.map(emptySearchDoc);

    function hide() {
      results.hidden = true;
      results.innerHTML = "";
    }

    function show(items, query) {
      if (!items.length) {
        results.innerHTML =
          '<p class="docs-search-empty">No matches for “' + escapeHtml(query) + '”.</p>';
        results.hidden = false;
        return;
      }
      results.innerHTML = items
        .map(function (item) {
          return (
            '<a href="' +
            escapeAttr(item.href) +
            '"><strong>' +
            escapeHtml(item.title) +
            "</strong><span>" +
            escapeHtml(item.section) +
            " · " +
            escapeHtml(item.snippet) +
            "</span></a>"
          );
        })
        .join("");
      results.hidden = false;
    }

    function runSearch(query) {
      var q = query.trim().toLowerCase();
      if (!q) {
        hide();
        return;
      }
      var hits = [];
      searchIndex.forEach(function (doc) {
        var hay = (doc.title + " " + doc.section + " " + doc.body).toLowerCase();
        if (hay.indexOf(q) < 0) return;
        hits.push({
          title: doc.title,
          href: doc.href,
          section: doc.section,
          snippet: snippetForMatch(doc, q)
        });
      });
      show(hits.slice(0, SEARCH_RESULT_LIMIT), query);
    }

    input.addEventListener("input", function () {
      runSearch(input.value);
    });
    input.addEventListener("focus", function () {
      if (input.value.trim()) runSearch(input.value);
    });
    input.addEventListener("keydown", function (event) {
      if (event.key !== "Enter") return;
      var first = results.querySelector("a");
      if (!first || results.hidden) return;
      event.preventDefault();
      window.location.href = first.getAttribute("href");
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "/" && event.target !== input && event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA") {
        event.preventDefault();
        input.focus();
      }
      if (event.key === "Escape") hide();
    });
    document.addEventListener("click", function (event) {
      if (!results.contains(event.target) && event.target !== input) hide();
    });

    loadSearchIndex(pages).then(function (index) {
      searchIndex = index;
      if (input.value.trim()) runSearch(input.value);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, "&#39;");
  }

  fetch(navUrl, { credentials: "same-origin" })
    .then(function (res) {
      if (!res.ok) throw new Error("nav missing");
      return res.json();
    })
    .then(function (nav) {
      var pages = flatPages(nav);
      renderSidebar(nav);
      renderCrumb(pages);
      renderPager(pages);
      var tocItems = buildToc();
      watchToc(tocItems);
      bindCopy();
      bindMenu();
      bindSearch(pages);
    })
    .catch(function () {
      bindCopy();
      bindMenu();
      buildToc();
    });
})();
