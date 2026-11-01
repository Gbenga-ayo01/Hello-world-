(function () {
  "use strict";

  var form = document.getElementById("enquiry-form");
  if (!form) return;

  var config = window.G33BY_CONFIG || {};
  var statusEl = document.getElementById("enquiry-status");
  var submitBtn = form.querySelector('[type="submit"]');
  var submitLabel = submitBtn ? submitBtn.textContent : "";

  var RATE_KEY = "g33by_last_enquiry";
  var RATE_MS = 60 * 1000;
  var TYPES = ["design", "development", "ecommerce", "improvements", "other"];
  var EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  var SUCCESS = "Your enquiry has been received. Thank you for getting in touch.";
  var FAILURE = "Your message could not be sent. Please try again.";

  function setStatus(text, isError) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.toggle("is-error", Boolean(isError));
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? "Sending" : submitLabel;
  }

  function value(name) {
    var field = form.elements.namedItem(name);
    return field ? String(field.value || "").trim() : "";
  }

  function validate() {
    var name = value("full_name");
    var email = value("email");
    var business = value("business_name");
    var type = value("project_type");
    var message = value("message");

    if (name.length < 1 || name.length > 100) return "Enter your full name.";
    if (email.length > 254 || !EMAIL_RE.test(email)) return "Enter a valid email address.";
    if (business.length > 150) return "Keep the business name under 150 characters.";
    if (TYPES.indexOf(type) === -1) return "Select what you need.";
    if (message.length < 10) return "Tell me a little more about your project (at least 10 characters).";
    if (message.length > 5000) return "Keep your message under 5000 characters.";
    return null;
  }

  function rateLimited() {
    try {
      var last = Number(localStorage.getItem(RATE_KEY));
      return last && Date.now() - last < RATE_MS;
    } catch (e) {
      return false;
    }
  }

  function markSent() {
    try {
      localStorage.setItem(RATE_KEY, String(Date.now()));
    } catch (e) {
      /* storage unavailable; ignore */
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Honeypot: bots fill the hidden field. Pretend it worked.
    if (value("website") !== "") {
      setStatus(SUCCESS, false);
      form.reset();
      return;
    }

    var problem = validate();
    if (problem) {
      setStatus(problem, true);
      return;
    }

    if (rateLimited()) {
      setStatus("Please wait a minute before sending another enquiry.", true);
      return;
    }

    if (!config.supabaseUrl || !config.supabaseAnonKey || config.supabaseUrl.indexOf("YOUR_PROJECT") !== -1) {
      setStatus(FAILURE, true);
      return;
    }

    var payload = {
      full_name: value("full_name"),
      email: value("email"),
      business_name: value("business_name") || null,
      project_type: value("project_type"),
      message: value("message")
    };

    setLoading(true);
    setStatus("", false);

    fetch(config.supabaseUrl + "/rest/v1/enquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": config.supabaseAnonKey,
        "Authorization": "Bearer " + config.supabaseAnonKey,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (!response.ok) throw new Error("status " + response.status);
        setStatus(SUCCESS, false);
        form.reset();
        markSent();
      })
      .catch(function () {
        setStatus(FAILURE, true);
      })
      .then(function () {
        setLoading(false);
      });
  });
})();
