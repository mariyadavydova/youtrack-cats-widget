var listOfCatIds = ["purr", "meal", "knead"];

function renderCat(catGifId) {
  var container = document.getElementById('cat');
  container.innerHTML =
    "<img " +
    "src='http://iconka.com/wp-content/uploads/edd/2015/10/" + catGifId +".gif' " +
    "style='width:90%'>";
}

function renderSelector(dashboardAPI) {
  var container = document.getElementById('cat');
  container.innerHTML =
    "<select id='catSelector' class='catSelector'>" +
      "<option value='random'>Random Cat</option>" +
      "<option value='purr'>Purr</option>" +
      "<option value='meal'>Meal</option>" +
      "<option value='knead'>Knead</option>" +
    "</select>" +
    "<input type='button' value='Save' id='save' class='save'>";

  var button = document.getElementById('save');
  button.onclick = function() {
    var selector = document.getElementById('catSelector');
    var catId = selector.options[selector.selectedIndex].value;
    console.log('Cat ID:' + catId);
    dashboardAPI.storeConfig({
      catId: catId
    });
    dashboardAPI.exitConfigMode();
    renderCat(catId);
  }
}

function drawCatFromConfig(dashboardAPI) {
  dashboardAPI.readConfig().then(function(config) {
    var catId = (config && config.catId) || 'purr';
    if (catId === 'random') {
      catId = listOfCatIds[Math.floor(Math.random() * listOfCatIds.length)];
    }
    renderCat(catId);
  });
}

Dashboard.registerWidget(function (dashboardAPI, registerWidgetAPI) {
  dashboardAPI.setTitle('Keep calm and purrrrr...');
  drawCatFromConfig(dashboardAPI);

  registerWidgetAPI({
    onConfigure: function() {
      renderSelector(dashboardAPI);
    },
    onRefresh: function() {
      drawCatFromConfig(dashboardAPI);
    }
  });
});