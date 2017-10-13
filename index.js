var listOfCatIds = ["purr", "meal", "knead"];

function renderCat(catId) {
  if (catId === 'random') {
    catId = listOfCatIds[Math.floor(Math.random() * listOfCatIds.length)];
  }
  var container = document.getElementById('cat');
  container.innerHTML =
    "<img " +
    "src='http://iconka.com/wp-content/uploads/edd/2015/10/" + catId +".gif' " +
    "style='width:90%'>";
}

function renderSelector(dashboardAPI, catId) {
  var container = document.getElementById('cat');
  container.innerHTML =
    "<select id='catSelector' class='catSelector'>" +
      "<option value='random'>Random Cat</option>" +
      "<option value='purr'>Purr</option>" +
      "<option value='meal'>Meal</option>" +
      "<option value='knead'>Knead</option>" +
    "</select>" +
    "<input type='button' value='Save' id='save' class='button'>" +
    "<input type='button' value='Cancel' id='cancel' class='button'>";

  var selector = document.getElementById('catSelector');
  selector.value = catId;

  var buttonSave = document.getElementById('save');
  buttonSave.onclick = function() {
    var selector = document.getElementById('catSelector');
    var catId = selector.options[selector.selectedIndex].value;
    dashboardAPI.storeConfig({
      catId: catId
    });
    dashboardAPI.exitConfigMode();
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
    var catId = (config && config.catId) || 'purr';
    renderCat(catId);
  });
}

Dashboard.registerWidget(function (dashboardAPI, registerWidgetAPI) {
  dashboardAPI.setTitle('Keep calm and purrrrr...');
  drawCatFromConfig(dashboardAPI);

  registerWidgetAPI({
    onConfigure: function() {
      dashboardAPI.readConfig().then(function(config) {
        var catId = (config && config.catId) || 'purr';
        renderSelector(dashboardAPI, catId);
      });
    },
    onRefresh: function() {
      drawCatFromConfig(dashboardAPI);
    }
  });
});