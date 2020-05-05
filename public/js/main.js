

function menuclick(){
    var menu = document.getElementById("menuicon");
    var sidebar = document.getElementById("sidenav");
    var subitems = document.querySelectorAll(".subitems");

    sidebar.classList.toggle("activesidebar");
    menu.classList.toggle("menumove");

    subitems.forEach(function(ele){
        ele.classList.toggle("subitemsactive")
    })


}

$(document).ready(function(){
    $("#myInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#myTable tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });
