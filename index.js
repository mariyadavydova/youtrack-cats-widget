function renderCat(catGifId) {
  var container = document.getElementById('cat');
  container.innerHTML =
    "<img " +
    "src='http://iconka.com/wp-content/uploads/edd/2015/10/" + catGifId +".gif' " +
    "style='width:90%'>";
}

Dashboard.registerWidget(function (dashboardAPI, registerWidgetAPI) {
  dashboardAPI.setTitle('Keep calm and purrrrr...');
  renderCat("purr");

  registerWidgetAPI({
    onConfigure: function() {
      renderCat("meal");
    },
    onRefresh: function() {
      renderCat("knead");
    }
  });
});