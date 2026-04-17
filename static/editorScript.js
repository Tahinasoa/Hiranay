var saveBtn = document.getElementById("saveBtn");
saveBtn.onclick = save ;
document.addEventListener("keydown", (ev)=>{
    if(ev.key === "s" && ev.ctrlKey){
        ev.preventDefault() ;
        ev.stopPropagation() ;
        save() ;
    }
})

function save () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhttp.responseText);
        }
    };

    let form = new FormData() ;
    let text = document.getElementById("text").value ;
    if(text == ""){
        alert("the content is empty");
        return ;
    }

    form.append("text", text) ;
    form.append("collection", collection) ;
    form.append("filename", filename) ;

    xhttp.open("POST", "/editor/save", true);
    xhttp.send(form);
}