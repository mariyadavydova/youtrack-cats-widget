Dashboard.registerWidget(function (dashboardAPI) {
  dashboardAPI.setTitle('Keep calm and purrrrr...');
  var container = document.getElementById('cat');
  container.innerHTML =
    "<img " +
      "src='http://iconka.com/wp-content/uploads/edd/2015/10/purr.gif' " +
      "style='width:90%'>";
});