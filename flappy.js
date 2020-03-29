const cvs=document.getElementById('flappy');
const ctx= cvs.getContext('2d')
let frames=0;
const sprite = new Image();
sprite.src='./sprite.png'


const state={
    current:0,
    getReady:0,
    game:1,
    over:2,
}
const buttonPosition={
    x: 120,
    y:263,
    w:83,
    h:29

}

cvs.addEventListener('click', (e)=>{
    switch (state.current) {
        case state.getReady:
            state.current=state.game
            break;
            case state.game:
                kus.flight()
                break;
            case state.over:
                
                let rect =cvs.getBoundingClientRect();
                let clickX=e.clientX-rect.left;
                let clickY=e.clientY-rect.top;
                if (clickX> buttonPosition.x&& clickX<buttonPosition.x+buttonPosition.w&&clickY>buttonPosition.y&&clickY<buttonPosition.y+buttonPosition.h) {
                    state.current=state.getReady;
                    kus.resetVelocity();
                    pipes.resetPos();
                    score.resetValue();
                }

                   

    
        default:
            break;
    }
})

const score ={
    best: parseInt(localStorage.getItem('best'))|| 0,
    value:0,

    draw: function()  {
        ctx.fillStyle="#FFF";
        ctx.strokeStyle='#000';


        if(state.current == state.game) {
            ctx.lineWidth = 2;
            ctx.font='35px Teko';
            ctx.fillText(this.value, cvs.width/2,50);
            ctx.strokeText(this.value, cvs.width/2, 50);

           
        }

        else if(state.current==state.over) {
            ctx.font='25px Teko';
            ctx.fillText(this.value, 225,180);
            ctx.strokeText(this.value, 225, 180);

            ctx.fillText(this.best,225,220);
            ctx.strokeText(this.best, 225,220);

        }
    },

    resetValue: function () {
        this.value=0;
        this.best=0;
    }

}




const pipes={
    positions:[],
    top:{
        sX:553,
         sY:0
        },
    bottom:{
        sX:502,
         sY:0
        },
    dx:2,
    w:53,
    h:400,
    gap:85,
    maxYPos:-150,

    resetPos: function() {
        this.positions=[];
    },

    draw : function ()  {
        for(let i=0; i<this.positions.length; i++)

        {

            let p=this.positions[i]
            let top_pipes_y=p.y;
            let bottom_pipes_y=p.y+this.h+this.gap;
        ctx.drawImage(sprite, this.top.sX,this.top.sY, this.w,this.h, p.x,top_pipes_y, this.w, this.h);
        ctx.drawImage(sprite, this.bottom.sX,this.bottom.sY, this.w,this.h, p.x,bottom_pipes_y, this.w, this.h)
        };
    },

    guncel : function () {
        if (state.current !== state.game)  return;
        if (frames%100==0){
            this.positions.push(
                  {
                    x: cvs.width,
                    y:this.maxYPos*(Math.random()+1)
                });
            };

        for (let i=0; i<this.positions.length; i++){
            let p=this.positions[i];
            if (kus.radius+kus.x>=p.x&& kus.x-kus.radius<=p.x+this.w&&kus.y+kus.radius>p.y&&kus.y-kus.radius<p.y+this.h) {
                state.current=state.over;
            }
            if (kus.radius+kus.x>=p.x&& kus.x-kus.radius<=p.x+this.w&&kus.y+kus.radius>p.y+this.h+this.gap&&kus.y-kus.radius<p.y+2*this.h+this.gap) {
                state.current=state.over;
            }

            p.x-=this.dx;
            if (p.x+this.w<=0) { 
                score.value+=1;
                localStorage.setItem('best', Math.max(score.best, score.value))

                this.positions.shift()}
        };
    }


}


const background= {
    sX:0,
    sY:0,
    w:275,
    h:226,
    x:0,
    y:cvs.height-226,
    draw: function() {
        ctx.drawImage(sprite, this.sX,this.sY, this.w, this.h,  this.x,this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX,this.sY, this.w, this.h,  this.x+this.w,this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX,this.sY, this.w, this.h,  this.x+this.w+this.w,this.y, this.w, this.h);
    }
}
const forground= {
    sX:276,
    sY:0,
    w:224,
    h:112,
    x:0,
    y:cvs.height-112,
    dx:2,
    draw: function() {
        ctx.drawImage(sprite, this.sX,this.sY, this.w, this.h,  this.x,this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX,this.sY, this.w, this.h,  this.x+this.w,this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX,this.sY, this.w, this.h,  this.x+this.w+this.w,this.y, this.w, this.h);
    },
    streaming: function() {

        if (state.current==state.game)
        {
            this.x=(this.x-this.dx)%(this.w/2);
      
    }
    },
}

const kus = {
    animation :[{ sX:276,sY:112},
                { sX:276,sY:139},
                { sX:276,sY:164},
                { sX:276,sY:139},],
    w:34,
    h:26,
    x:50,
    y:150,
    radius:12,
    frame:0,
    speed:0,
    jumping:-30,
    gravity:0.004,
    period:10,

    flight: function() {
        this.y +=  this.jumping;
        console.log('printing', this.y)
        

    },

    resetVelocity: function() {
        this.speed=0;
    },


    draw: function() {
        let kuscuk=this.animation[this.frame];
        ctx.drawImage(sprite, kuscuk.sX, kuscuk.sY, this.w, this.h,  this.x-this.h/2,this.y, this.w, this.h)
    },
    actual: function(){
        //this.period = state.current == state.getReady ? 10 : 5;
        
        // WE INCREMENT THE FRAME BY 1, EACH PERIOD
        this.frame += frames%this.period == 0 ? 1 : 0;
        // FRAME GOES FROM 0 To 4, THEN AGAIN TO 0
        this.frame = this.frame%this.animation.length;

        if(state.current == state.getReady) {
           this.y=150

        }
        else {
            this.speed += this.gravity;
            this.y += this.speed
            if (this.y+this.h/2>=cvs.height-forground.h){
                this.y=cvs.height-forground.h-this.h/2;
                if (state.current==state.game) {
                    state.current=state.over
                }

            }

        }
        if(state.current==state.over){
            this.frame=1;
        }
    },

   
 
    
}



const getReady = {
    sX:0,
    sY:228,
    w:173,
    h:152,
    x:cvs.width/2-173/2,
    y:80,
    
    draw: function() {
        if (state.current === state.getReady){
        ctx.drawImage(sprite, this.sX,this.sY, this.w, this.h,  this.x,this.y, this.w, this.h);
          }
    }

}

const gameOver = {
    sX:175,
    sY:228,
    w:225,
    h:202,
    x:cvs.width/2-225/2,
    y:80,
    draw: function() {
        if (state.current === state.over) {
        ctx.drawImage(sprite, this.sX,this.sY, this.w, this.h,  this.x,this.y, this.w, this.h);
          }
          
        }

}


function draw() {
    ctx.fillStyle="#70c5ce";
    ctx.fillRect(0,0,cvs.width,cvs.height);
    
    background.draw();
    forground.draw();
    kus.draw();
   
    forground.streaming();
    pipes.draw();
    getReady.draw();
    
    gameOver.draw();
    score.draw();
 
   

}

function Update() {
    kus.actual();
    pipes.guncel();
    
}


function loop () {
    draw();
    Update();
    requestAnimationFrame(loop);
    frames ++;

}

loop();