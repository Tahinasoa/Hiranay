//Syncing slides with websocket
/* message code and type
/  0 : connected
/  2 : reload every slides
    attributes :
        collection
        filename
/  3 : go to slide
    attributes :
        targetSlide = {h:int, v:int, f:int}
/  4 : change location // change presentation file
/   attributes :
/       targetLocation = url
/  5 : update audio control
    attributes :
        audioProperty = obj
*/
let socket = io();

socket.addEventListener("connect", (event)=>{
    let msg = {};
    msg.code = 0 ;
    socket.send(JSON.stringify(msg)) ;
    //Setting the location
    msg = {} ;
    msg.code = 4 ;
    msg.targetLocation = location.href ;
    socket.send(JSON.stringify(msg)) ;
});

socket.addEventListener("message", function(event){
    let msg = JSON.parse(event) ;
    
    switch(msg.code){
        case 2 :
            reload(msg) ;
            break ;
        case 3 :// go to slide
            goToSlide(msg)
            break ;
        case 4 ://Change location
            changeLocation(msg)
            break ;
    }
})

slideChangedByScript = false ;
Reveal.on("slidechanged", function(e){
    if (slideChangedByScript){
        slideChangedByScript = false ;
        return ;
    }
    
    if( socket.readyState == socket.OPEN){
        let i = Reveal.getIndices() ;

        let msg = {}
        msg.code = 3 // go to slide
        msg.targetSlide = i ;
        
        let json = JSON.stringify(msg) ;
        socket.send(json) ;
    }
})

//Function
function goToSlide(msg){
    slideChangedByScript = true ;
    let target = msg.targetSlide ;
    Reveal.slide(target.h, target.v, target.f) ;
}

function changeLocation(msg){
    if (location.href != msg.targetLocation){
    location = msg.targetLocation ;
    }
}

function reload(msg){
    location.reload() ;
}

Reveal.initialize({
    controls: false,
    progress: true,
    center: true,
    hash: true,
    transition: "fade"
});