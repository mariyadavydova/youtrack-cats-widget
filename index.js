var listOfCatIds = ["purr", "meal", "knead"];

var DEFAULT_CAT_ID = "purr";
var DEFAULT_TITLE = "Keep calm and purrrrr...";

function renderCat(catId) {
  if (catId === 'random') {
    catId = listOfCatIds[Math.floor(Math.random() * listOfCatIds.length)];
  }
  var container = document.getElementById('cat');
  container.innerHTML =
    "<img " +
    "src='http://iconka.com/wp-content/uploads/edd/2015/10/" + catId +".gif' " +
    "class='catImage'>";
}

function renderSelector(dashboardAPI, catId, title) {
  var container = document.getElementById('cat');
  container.innerHTML =
    "<div><input type='text' id='title' class='title'></div>" +
    "<div><select id='catSelector' class='catSelector'>" +
      "<option value='random'>Random Cat</option>" +
      "<option value='purr'>Purr</option>" +
      "<option value='meal'>Meal</option>" +
      "<option value='knead'>Knead</option>" +
    "</select></div>" +
    "<div><input type='button' value='Save' id='save' class='button'>" +
    "<input type='button' value='Cancel' id='cancel' class='button'></div>";

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