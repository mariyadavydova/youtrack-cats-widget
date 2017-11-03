var LIST_OF_CAT_IDS = ["purr", "walk", "acrobat", "kittens",
                    "burp", "sleepy", "facepalm", "meal",
                    "banjo", "groom", "gift", "knead",
                    "love", "fly", "popcorn", "drink"];

var DEFAULT_CAT_ID = "purr";
var DEFAULT_TITLE = "Keep calm and purrrrr...";

function renderCat(catId) {
  document.getElementById('catSettings').hidden = true;

  if (catId === 'random') {
    catId = LIST_OF_CAT_IDS[Math.floor(Math.random() * LIST_OF_CAT_IDS.length)];
  }
  var container = document.getElementById('cat');
  container.innerHTML =
    "<img " +
    "src='images/" + catId +".gif' " +
    "class='catImage'>";
}

function renderSelector(dashboardAPI, catId, title) {
  var options = "";
  LIST_OF_CAT_IDS.forEach(function(id) {
    var name = id.charAt(0).toUpperCase() + id.slice(1);
    options += "<option value='" + id + "'>" + name + "</option>";
  });

  var container = document.getElementById('catSettings');
  container.hidden = false;
  container.innerHTML =
    "<div><input type='text' id='title' class='catTitle' placeholder='Widget title'></div>" +
    "<div><select id='catSelector' class='catSelector'>" +
      "<option value='random'>Random Cat</option>" +
      options +
    "</select></div>" +
    "<div><input type='button' value='Save' id='save' class='catButton'>" +
    "<input type='button' value='Cancel' id='cancel' class='catButton'></div>";

  var selector = document.getElementById('catSelector');
  selector.value = catId;
  var titleInput = document.getElementById('title');
  titleInput.value = title;

  var buttonSave = document.getElementById('save');
  buttonSave.onclick = function() {
    var selector = document.getElementById('catSelector');
    var catId = selector.options[selector.selectedIndex].value;
    var titleInput = document.getElementById('title');
    title = titleInput.value;
    dashboardAPI.storeConfig({
      title: title,
      catId: catId
    });
    dashboardAPI.exitConfigMode();
    dashboardAPI.setTitle(title);
    renderCat(catId);
  };

  var buttonCancel = document.getElementById('cancel');
  buttonCancel.onclick = function() {
    dashboardAPI.exitConfigMode();
    var selector = document.getElementById('catSelector');
    var catId = selector.options[selector.selectedIndex].value;
    dashboardAPI.exitConfigMode();
    renderCat(catId);
  };
}

function drawCatFromConfig(dashboardAPI) {
  dashboardAPI.readConfig().then(function(config) {
    var title = (config && config.title) || DEFAULT_TITLE;
    var catId = (config && config.catId) || DEFAULT_CAT_ID;
    dashboardAPI.setTitle(title);
    renderCat(catId);
  });
}

Dashboard.registerWidget(function (dashboardAPI, registerWidgetAPI) {
  drawCatFromConfig(dashboardAPI);

  registerWidgetAPI({
    onConfigure: function() {
      dashboardAPI.readConfig().then(function(config) {
        var title = (config && config.title) || DEFAULT_TITLE;
        var catId = (config && config.catId) || DEFAULT_CAT_ID;
        renderSelector(dashboardAPI, catId, title);
      });
    },
    onRefresh: function() {
      drawCatFromConfig(dashboardAPI);
    }
  });
});