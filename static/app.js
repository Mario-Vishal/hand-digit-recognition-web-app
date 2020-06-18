window.addEventListener('load',()=>{
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext('2d');
    const button_clear = document.querySelector("#clear");
    let painting=false;
    var width = window.innerWidth;
    if (width<400){
        canvas.width=window.innerWidth;
        canvas.height=window.innerWidth;
    }
    else{
        canvas.width = 400;
        canvas.height = 400;
    }
    console.log(canvas.width,canvas.height)
    
    
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height)
    var offset = canvas.offset;

    function startPosition(e){
        painting=true;
        draw(e);
    }

    function finishedPosition(){
        painting=false;
        ctx.beginPath();
    }

    //clear the canvas-----------
    button_clear.addEventListener('click',()=>{
        ctx.fillRect(0,0,canvas.width,canvas.height)
    })

    
    

    function draw(e){
        if(!painting) return;
        ctx.lineWidth=25;
        ctx.lineCap="round"
        var x_coordinate = e.clientX - canvas.getBoundingClientRect().left;
        var y_coordinate = e.clientY - canvas.getBoundingClientRect().top;
        ctx.lineTo(x_coordinate,y_coordinate)
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x_coordinate,y_coordinate);
    }

    function draw_touch(e){
        if(!painting) return;
        ctx.lineWidth=25;
        ctx.lineCap='round';
        var touch = e.touches[0]
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
          });
        var x_coordinate = clientX - canvas.getBoundingClientRect().left;
        var y_coordinate = clientY - canvas.getBoundingClientRect().top;
        ctx.lineTo(x_coordinate,y_coordinate)
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x_coordinate,y_coordinate);

    }

    canvas.addEventListener("mousedown",startPosition);
    canvas.addEventListener("mouseup",finishedPosition);
    canvas.addEventListener('mousemove',draw);
    canvas.addEventListener('touchmove', draw_touch);
})

const button_predict = document.querySelector('#predict');

button_predict.addEventListener('click',()=>{
    const ctx = canvas.getContext('2d');
    var img_url = canvas.toDataURL().split(',')[1];

    const hidden_div = document.querySelector('#result')
    

    

    // console.log(img_url)
    $.ajax({
        url:"https://0.0.0.0:5000",
        type:"POST",
        data:{imageBase64:img_url}
    
    
    }).done(function(response) {

        document.getElementById('result').style.display="block";
        document.getElementById('acc').innerHTML=(response.acc).slice(0,5);
        document.getElementById('digit').innerHTML=response.dig
        hidden_div.classList.add('animate')
        
        console.log(response)
    });

    ctx.fillRect(0,0,canvas.width,canvas.height);
    hidden_div.classList.remove('animate');
    

})
