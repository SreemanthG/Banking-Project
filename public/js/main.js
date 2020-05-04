

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

