let btns = document.querySelectorAll(".btn-book");
for (let i = 0; i < btns.length; i++) {
    btns[i].value = "";
    btns[i].addEventListener("mousedown", displayBook);
}

function displayBook(e) {
    let titleContainer = document.getElementsByClassName("titleContainer");
    for (let i = 0; i < titleContainer.length; i++) {
        if (titleContainer[i].dataset["book"] == e.target.textContent)
            titleContainer[i].style.display = "block";
        else
            titleContainer[i].style.display = "none";
    }
    for (let i = 0; i < btns.length; i++) {
        if (btns[i] == e.target)
            btns[i].value = "selected";
        else
            btns[i].value = "";
    }
}


let titles = document.querySelectorAll(".titleContainer .title");
for (let i = 0; i < titles.length; i++) {
    titles[i].addEventListener("click", openLink);
}

function openLink(e) {
    let href = e.target.dataset["href"];
    location = "/hira/" + href;
}

//FILTRE
let filterInput = document.getElementById("filter")
filterInput.addEventListener("input", updateFilter);

function updateFilter(e) {
    let filter = e.target.value.toLowerCase();
    e.target.value = filter;

    for (let i = 0; i < titles.length; i++) {
        let re = new RegExp(filter);
        if (re.test(titles[i].textContent.toLocaleLowerCase()))
            titles[i].style.display = "block";
        else
            titles[i].style.display = "none";
    }
}

//initializing
displayBook({ target: btns[0] });
updateFilter({ target: filterInput });


/*
*  Open or close the drop down menu
*
*/
let navigationLabel = document.getElementById("navigationLabel");
let navigationContent = document.getElementsByClassName("navigation-content")[0] ;

navigationLabel.addEventListener("click", function (e) {
    navigationContent.classList.toggle("show") ;
})

/*Toggle between mobile and desktop*/
window.addEventListener("load", updateLayout) ;
window.addEventListener("resize", updateLayout);

function updateLayout() {
    let width = parseInt(getComputedStyle(document.body, null).width);
    if (width <= 600)
        {
            document.getElementById("titles").classList.add("mobile");
            document.getElementById("navigation").classList.add("mobile");
        }
    else{
        document.getElementById("titles").classList.remove("mobile");
        document.getElementById("navigation").classList.remove("mobile");
    }
}